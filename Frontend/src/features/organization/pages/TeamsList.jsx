import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Button, message, Row, Col, Badge, Avatar, Skeleton, Empty, Modal, Input, Tabs, Table, Spin } from "antd";
import { 
    TeamOutlined, 
    PlusOutlined, 
    ArrowLeftOutlined, 
    EyeOutlined, 
    KeyOutlined, 
    CopyOutlined,
    UserOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function TeamsList() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dynamic Team Detail Modal
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [activeTab, setActiveTab] = useState("roster");
    
    // Details Tab Data
    const [roster, setRoster] = useState([]);
    const [rosterLoading, setRosterLoading] = useState(false);
    const [allDrives, setAllDrives] = useState([]);
    const [allMatches, setAllMatches] = useState([]);

    // Credential Password Check Modal
    const [credModalOpen, setCredModalOpen] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [verified, setVerified] = useState(false);
    const [targetTeam, setTargetTeam] = useState(null);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const response = await api.get("/team/myTeams");
            setTeams(response.data || []);
        } catch (error) {
            console.error("Error fetching teams list:", error);
            message.error("Failed to load teams list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    // Load detailed Tab contexts (Roster, Drives, Matches)
    const handleOpenDetails = async (team) => {
        setSelectedTeam(team);
        setDetailModalOpen(true);
        setActiveTab("roster");
        setRoster([]);
        
        try {
            setRosterLoading(true);
            const [rosterRes, drivesRes, matchesRes] = await Promise.all([
                api.get(`/team/members/${team._id}`),
                api.get("/recruitment/all"),
                api.get("/match/all")
            ]);
            
            setRoster(rosterRes.data || []);
            setAllDrives(drivesRes.data || []);
            setAllMatches(matchesRes.data || []);
        } catch (err) {
            console.error("Error fetching team detail tabs:", err);
            message.error("Failed to fetch team details");
        } finally {
            setRosterLoading(false);
        }
    };

    const handleOpenCredentials = (team) => {
        setTargetTeam(team);
        setPasswordInput("");
        setVerified(false);
        setVerifying(false);
        setCredModalOpen(true);
    };

    const handleVerifyPassword = async () => {
        if (!passwordInput) {
            message.warning("Please enter your password");
            return;
        }
        try {
            setVerifying(true);
            await api.post("/auth/login", {
                email: user?.email,
                password: passwordInput
            });
            setVerified(true);
            message.success("Identity verified successfully!");
        } catch (err) {
            console.error("Password check verification failed:", err);
            message.error("Incorrect administrator password");
        } finally {
            setVerifying(false);
        }
    };

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        message.success(`${type} copied to clipboard!`);
    };

    // Filter drives & matches
    const filteredDrives = allDrives.filter(d => d.teamId?._id === selectedTeam?._id || d.teamId === selectedTeam?._id);
    const filteredMatches = allMatches.filter(m => 
        m.homeTeamId?._id === selectedTeam?._id || m.homeTeamId === selectedTeam?._id ||
        m.awayTeamId?._id === selectedTeam?._id || m.awayTeamId === selectedTeam?._id
    );

    // Columns config (Stripe/GitHub style)
    const rosterColumns = [
        {
            title: "ATHLETE NAME",
            key: "name",
            render: (_, r) => (
                <div className="flex items-center space-x-2.5">
                    <Avatar size={24} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                    <span className="text-xs font-semibold text-text-primary">{r.athleteId?.userId?.name || "Squad Player"}</span>
                </div>
            )
        },
        {
            title: "PRIMARY ROLE",
            dataIndex: ["athleteId", "primaryRole"],
            key: "role",
            render: (r) => <span className="text-xs font-medium text-brand-primary">{r || "N/A"}</span>
        },
        {
            title: "GENDER",
            dataIndex: ["athleteId", "gender"],
            key: "gender",
            render: (g) => <span className="text-xs text-text-secondary capitalize">{g}</span>
        },
        {
            title: "METRICS",
            key: "metrics",
            render: (_, r) => (
                <span className="text-xs text-text-secondary font-mono">
                    {r.athleteId?.height ? `${r.athleteId.height}cm` : "-"} / {r.athleteId?.weight ? `${r.athleteId.weight}kg` : "-"}
                </span>
            )
        }
    ];

    const driveColumns = [
        {
            title: "CAMPAIGN TITLE",
            dataIndex: "title",
            key: "title",
            render: (t) => <span className="text-xs font-semibold text-text-primary">{t}</span>
        },
        {
            title: "VACANCIES",
            dataIndex: "vacancies",
            key: "spots",
            render: (v) => <span className="text-xs text-brand-secondary font-semibold font-mono">{v || 0} Open</span>
        },
        {
            title: "DEADLINE",
            dataIndex: "applicationDeadline",
            key: "deadline",
            render: (d) => <span className="text-xs text-text-secondary">{d ? new Date(d).toLocaleDateString() : "N/A"}</span>
        }
    ];

    const matchColumns = [
        {
            title: "OPPONENT MATCHUP",
            key: "matchup",
            render: (_, record) => {
                const homeName = record.homeTeamId?.teamName;
                const awayName = record.awayTeamId?.teamName;
                return (
                    <span className="text-xs font-semibold text-text-primary">
                        {homeName} vs {awayName}
                    </span>
                );
            }
        },
        {
            title: "SCORE",
            key: "score",
            render: (_, record) => (
                <span className="text-xs font-bold text-brand-primary font-mono">
                    {record.status === "scheduled" ? "VS" : `${record.homeScore} - ${record.awayScore}`}
                </span>
            )
        },
        {
            title: "VENUE",
            dataIndex: "venue",
            key: "venue",
            render: (v) => <span className="text-xs text-text-secondary">{v}</span>
        }
    ];

    const detailTabItems = [
        {
            key: "roster",
            label: <span className="font-semibold text-xs">Squad Roster ({roster.length})</span>,
            children: rosterLoading ? (
                <div className="py-12 flex justify-center"><Spin size="small" /></div>
            ) : roster.length === 0 ? (
                <div className="py-12 text-center text-text-secondary text-xs">No active roster players in this team.</div>
            ) : (
                <Table columns={rosterColumns} dataSource={roster.map(r => ({ ...r, key: r._id }))} pagination={false} size="small" className="custom-table mt-2" />
            )
        },
        {
            key: "recruitment",
            label: <span className="font-semibold text-xs">Scouting Drives ({filteredDrives.length})</span>,
            children: rosterLoading ? (
                <div className="py-12 flex justify-center"><Spin size="small" /></div>
            ) : filteredDrives.length === 0 ? (
                <div className="py-12 text-center text-text-secondary text-xs">No scouting drives created.</div>
            ) : (
                <Table columns={driveColumns} dataSource={filteredDrives.map(d => ({ ...d, key: d._id }))} pagination={false} size="small" className="custom-table mt-2" />
            )
        },
        {
            key: "matches",
            label: <span className="font-semibold text-xs">Matches Played ({filteredMatches.length})</span>,
            children: rosterLoading ? (
                <div className="py-12 flex justify-center"><Spin size="small" /></div>
            ) : filteredMatches.length === 0 ? (
                <div className="py-12 text-center text-text-secondary text-xs">No matches scheduled.</div>
            ) : (
                <Table columns={matchColumns} dataSource={filteredMatches.map(m => ({ ...m, key: m._id }))} pagination={false} size="small" className="custom-table mt-2" />
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
                <div className="space-y-1">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined className="text-xs" />} 
                        onClick={() => navigate("/dashboard")}
                        className="text-text-secondary hover:text-text-primary flex items-center p-0 h-auto mb-2 cursor-pointer"
                    >
                        Back to Dashboard
                    </Button>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center gap-2">
                        <TeamOutlined className="text-brand-primary" />
                        <span>Organization Teams</span>
                    </h1>
                    <p className="text-text-secondary text-xs">
                        Oversee and manage the active team rosters and age divisions created under your organization.
                    </p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined className="text-xs" />}
                    onClick={() => navigate("/organization/teams/create")}
                    className="shrink-0 text-xs font-semibold h-9 rounded-md cursor-pointer"
                >
                    Create Team
                </Button>
            </div>

            {/* Content Section */}
            {loading ? (
                <Row gutter={[16, 16]}>
                    {[1, 2, 3].map((n) => (
                        <Col xs={24} sm={12} lg={8} key={n}>
                            <Card bordered={false} className="border border-border-subtle bg-bg-surface rounded-xl">
                                <Skeleton active avatar paragraph={{ rows: 3 }} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : teams.length === 0 ? (
                <div className="py-16 bg-bg-surface border border-border-subtle rounded-xl flex flex-col items-center justify-center text-center p-6 shadow-sm">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <span className="text-text-secondary text-xs block">
                                No teams created yet. Get started by creating your first roster!
                            </span>
                        }
                    >
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined className="text-xs" />}
                            onClick={() => navigate("/organization/teams/create")}
                            className="mt-2 text-xs font-semibold h-8 rounded-md cursor-pointer"
                        >
                            Create First Team
                        </Button>
                    </Empty>
                </div>
            ) : (
                <Row gutter={[16, 16]}>
                    {teams.map((team) => (
                        <Col xs={24} sm={12} lg={8} key={team._id}>
                            <Card 
                                bordered={false} 
                                onClick={() => handleOpenDetails(team)}
                                className="border border-border-subtle bg-bg-surface hover:border-brand-primary/20 hover:shadow-md transition-all duration-150 shadow-sm h-full flex flex-col justify-between cursor-pointer rounded-xl group"
                                title={
                                    <div className="flex items-center space-x-3 py-1">
                                        <Avatar 
                                            src={.logo?.url || .logo || undefined} 
                                            icon={!(team.logo?.url || (typeof team.logo === "string" && team.logo)) && <TeamOutlined />} 
                                            className="bg-brand-primary/10 text-brand-primary border border-brand-primary/10 shrink-0 rounded" 
                                        />
                                        <div className="min-w-0">
                                            <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate m-0">{team.teamName}</h3>
                                            <span className="text-[9px] uppercase tracking-wider font-semibold text-brand-primary">
                                                {team.sport}
                                            </span>
                                        </div>
                                    </div>
                                }
                            >
                                <div className="space-y-4 text-xs">
                                    <p className="text-text-secondary text-xs leading-relaxed line-clamp-3 min-h-[54px] m-0">
                                        {team.description || "No description configured for this team roster profile."}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                                        <div className="flex items-center gap-2">
                                            <Badge 
                                                count={team.ageCategory} 
                                                color="var(--color-primary)" 
                                                className="font-bold text-[10px]"
                                            />
                                            <span className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">
                                                Age Division
                                            </span>
                                        </div>
                                    </div>
         
                                    <div className="flex gap-2 pt-2">
                                        <Button 
                                            size="small" 
                                            icon={<EyeOutlined className="text-xs" />}
                                            onClick={(e) => { e.stopPropagation(); handleOpenDetails(team); }}
                                            className="flex-grow text-xs h-8 cursor-pointer"
                                        >
                                            View Details
                                        </Button>
                                        <Button 
                                            size="small" 
                                            icon={<KeyOutlined className="text-xs" />}
                                            onClick={(e) => { e.stopPropagation(); handleOpenCredentials(team); }}
                                            className="text-xs h-8 hover:border-brand-primary hover:text-brand-primary cursor-pointer"
                                        >
                                            Credentials
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* DYNAMIC TEAM DETAILS MODAL */}
            <Modal
                title={<span className="text-xs font-bold uppercase text-text-primary tracking-wider"> Roster Details: {selectedTeam?.teamName}</span>}
                open={detailModalOpen}
                onCancel={() => setDetailModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalOpen(false)} className="text-xs font-semibold">
                        Close Details
                    </Button>
                ]}
                width={700}
                centered
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={detailTabItems} className="custom-tabs mt-2" />
            </Modal>

            {/* PASSWORD CHECK & CREDENTIAL VIEW MODAL */}
            <Modal
                title={<span className="text-xs font-bold uppercase text-text-primary tracking-wider">Team Login Credentials</span>}
                open={credModalOpen}
                onCancel={() => setCredModalOpen(false)}
                footer={null}
                width={400}
                centered
            >
                {!verified ? (
                    <div className="py-2 space-y-4">
                        <p className="text-xs text-text-secondary leading-relaxed">
                            Enter your administrator password to view credentials for <strong className="text-brand-primary">{targetTeam?.teamName}</strong>.
                        </p>
                        <Input.Password
                            placeholder="Enter Administrator Password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            onPressEnter={handleVerifyPassword}
                            className="rounded-md"
                        />
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button onClick={() => setCredModalOpen(false)} className="text-xs">Cancel</Button>
                            <Button type="primary" onClick={handleVerifyPassword} loading={verifying} className="text-xs font-semibold">Verify Identity</Button>
                        </div>
                    </div>
                ) : (
                    <div className="py-2 space-y-4">
                        <p className="text-xs text-text-secondary">
                            Credentials verified. Provide these login details to team managers.
                        </p>
                        
                        {/* Email */}
                        <div className="flex flex-col space-y-1">
                            <span className="text-[9px] uppercase font-bold text-text-secondary tracking-wider">Email Address</span>
                            <div className="flex items-center justify-between bg-bg-elevated border border-border-subtle rounded-lg p-2.5">
                                <span className="text-xs font-mono text-text-primary select-all truncate mr-2">{targetTeam?.userId?.email}</span>
                                <Button 
                                    type="text" 
                                    size="small"
                                    icon={<CopyOutlined className="text-xs" />} 
                                    onClick={() => handleCopy(targetTeam?.userId?.email, "Email")}
                                    className="text-text-secondary hover:text-text-primary shrink-0"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col space-y-1">
                            <span className="text-[9px] uppercase font-bold text-text-secondary tracking-wider">Default Password</span>
                            <div className="flex items-center justify-between bg-bg-elevated border border-border-subtle rounded-lg p-2.5">
                                <span className="text-xs font-mono text-text-primary select-all truncate mr-2">team123</span>
                                <Button 
                                    type="text" 
                                    size="small"
                                    icon={<CopyOutlined className="text-xs" />} 
                                    onClick={() => handleCopy("team123", "Password")}
                                    className="text-text-secondary hover:text-text-primary shrink-0"
                                />
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <Button type="primary" onClick={() => setCredModalOpen(false)} className="w-full text-xs font-semibold h-9 rounded-md">Done</Button>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
}

export default TeamsList;
