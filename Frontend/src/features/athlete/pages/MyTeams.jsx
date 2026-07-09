import React, { useState, useEffect } from "react";
import { Card, Tag, Avatar, message, Spin, Empty, Button, Tabs, Modal, Table } from "antd";
import { 
    UserOutlined, 
    TeamOutlined, 
    CheckCircleOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function MyTeams() {
    const [memberships, setMemberships] = useState([]);
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

    const fetchMemberships = async () => {
        try {
            setLoading(true);
            const res = await api.get("/team/my-memberships");
            if (res.data) {
                setMemberships(res.data);
            }
        } catch (err) {
            console.error("Error fetching my teams:", err);
            message.error("Failed to load team rosters");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemberships();
    }, []);

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

    const activeTeams = memberships.filter(m => m.status === "active");
    const pendingTeams = memberships.filter(m => m.status === "pending" || m.status === "requested");

    // Filter drives & matches
    const filteredDrives = allDrives.filter(d => d.teamId?._id === selectedTeam?._id || d.teamId === selectedTeam?._id);
    const filteredMatches = allMatches.filter(m => 
        m.homeTeamId?._id === selectedTeam?._id || m.homeTeamId === selectedTeam?._id ||
        m.awayTeamId?._id === selectedTeam?._id || m.awayTeamId === selectedTeam?._id
    );

    // Columns config (Stripe/GitHub style)
    const rosterColumns = [
        {
            title: "ATHLETE",
            key: "name",
            render: (_, r) => (
                <div className="flex items-center space-x-2.5">
                    <Avatar size={24} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                    <span className="text-xs font-semibold text-text-primary">{r.athleteId?.userId?.name || "Squad Player"}</span>
                </div>
            )
        },
        {
            title: "ROLE",
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
            title: "CAMPAIGN",
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
            title: "MATCHUP",
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
                <Table 
                    columns={rosterColumns} 
                    dataSource={roster.map(r => ({ ...r, key: r._id }))} 
                    pagination={false} 
                    size="small"
                    className="custom-table mt-2" 
                />
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
                <Table 
                    columns={driveColumns} 
                    dataSource={filteredDrives.map(d => ({ ...d, key: d._id }))} 
                    pagination={false} 
                    size="small"
                    className="custom-table mt-2" 
                />
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
                <Table 
                    columns={matchColumns} 
                    dataSource={filteredMatches.map(m => ({ ...m, key: m._id }))} 
                    pagination={false} 
                    size="small"
                    className="custom-table mt-2" 
                />
            )
        }
    ];

    const renderTeamGrid = (list, type) => {
        if (list.length === 0) {
            return (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-12 text-center rounded-xl shadow-sm">
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span className="text-text-secondary text-xs">No teams found in this category.</span>} 
                    />
                </Card>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map(mem => {
                    const team = mem.teamId || {};
                    return (
                        <Card 
                            key={mem._id}
                            bordered={false} 
                            onClick={() => handleOpenDetails(team)}
                            className="border border-border-subtle bg-bg-surface shadow-sm hover:border-brand-primary/25 cursor-pointer transition-all duration-150 rounded-xl flex flex-col justify-between group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3 min-w-0">
                                        {(team.logo?.url || (typeof team.logo === "string" && team.logo)) ? (
                                            <img src={team.logo?.url || team.logo} alt="Logo" className="w-9 h-9 rounded object-cover border border-border-subtle shrink-0" />
                                        ) : (
                                            <Avatar size={36} icon={<TeamOutlined />} className="bg-brand-primary rounded font-bold shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors leading-tight truncate">{team.teamName || "Apex Squad"}</h3>
                                            <p className="text-[10px] text-text-secondary truncate mt-0.5">Category: {team.ageCategory}</p>
                                        </div>
                                    </div>
                                    <Tag color={team.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 font-semibold uppercase text-[9px]">
                                        {team.sport}
                                    </Tag>
                                </div>

                                <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                                    {team.description || "No squad description provided by the manager."}
                                </p>

                                <div className="border-t border-border-subtle pt-3.5 flex items-center justify-between text-[10px]">
                                    <span className="text-text-secondary font-semibold uppercase tracking-wider">
                                        {type === "active" ? "Member Since" : "Applied Date"}
                                    </span>
                                    <span className="text-text-primary font-semibold">
                                        {new Date(mem.joinedAt || mem.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-t border-border-subtle pt-3.5">
                                    <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">Status</span>
                                    {type === "active" ? (
                                        <Tag icon={<CheckCircleOutlined className="text-xs" />} color="success" className="m-0 border-0 font-semibold px-2.5 py-0.5 rounded text-[10px]">ACTIVE MEMBER</Tag>
                                    ) : (
                                        <Tag icon={<ClockCircleOutlined className="text-xs" />} color="warning" className="m-0 border-0 font-semibold px-2.5 py-0.5 rounded text-[10px]">PENDING APPROVAL</Tag>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        );
    };

    const tabItems = [
        {
            key: "active",
            label: <span className="font-semibold text-xs">Active Rosters ({activeTeams.length})</span>,
            children: renderTeamGrid(activeTeams, "active")
        },
        {
            key: "pending",
            label: <span className="font-semibold text-xs">Pending Join Requests ({pendingTeams.length})</span>,
            children: renderTeamGrid(pendingTeams, "pending")
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight">My Teams</h1>
                    <p className="text-xs text-text-secondary mt-0.5">Review squad memberships and follow pending roster recruitment decisions.</p>
                </div>
                <Button 
                    onClick={fetchMemberships} 
                    type="text" 
                    size="small" 
                    className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium cursor-pointer"
                >
                    Refresh Teams
                </Button>
            </div>

            {/* Content Tabs */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="middle" />
                    <p className="text-xs text-text-secondary mt-3">Syncing squad rosters...</p>
                </div>
            ) : (
                <Tabs items={tabItems} className="custom-tabs" />
            )}

            {/* TEAM DETAIL MODAL */}
            <Modal
                title={<span className="text-xs font-bold uppercase text-text-primary tracking-wider">Team Details: {selectedTeam?.teamName}</span>}
                open={detailModalOpen}
                onCancel={() => setDetailModalOpen(false)}
                footer={[
                    <Button 
                        key="close" 
                        onClick={() => setDetailModalOpen(false)}
                        className="text-xs font-semibold"
                    >
                        Close Details
                    </Button>
                ]}
                width={700}
                centered
            >
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={detailTabItems} className="custom-tabs mt-2" />
            </Modal>

        </div>
    );
}

export default MyTeams;
