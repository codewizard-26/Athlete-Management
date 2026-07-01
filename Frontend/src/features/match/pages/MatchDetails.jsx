import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Button, Tag, Avatar, Table, Spin, Empty, Modal, Form, Select, InputNumber, Space, message } from "antd";
import { 
    CalendarOutlined, 
    EnvironmentOutlined, 
    TrophyOutlined, 
    ArrowLeftOutlined,
    PlusOutlined,
    DeleteOutlined,
    UserOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

const { Option } = Select;

function MatchDetails() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [match, setMatch] = useState(null);
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [perfLoading, setPerfLoading] = useState(true);

    // Modal state for performance recording
    const [perfModalOpen, setPerfModalOpen] = useState(false);
    const [perfForm] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);
    
    // Dropdown active team roster list
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [roster, setRoster] = useState([]);
    const [rosterLoading, setRosterLoading] = useState(false);

    // Track editing performance
    const [editingPerformance, setEditingPerformance] = useState(null);

    const isOrganization = user?.role === "organization";

    const fetchMatchDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/match/${matchId}`);
            if (res.data) {
                setMatch(res.data);
            }
        } catch (err) {
            console.error("Error fetching match details:", err);
            message.error("Failed to load match details");
        } finally {
            setLoading(false);
        }
    };

    const fetchPerformances = async () => {
        try {
            setPerfLoading(true);
            const res = await api.get(`/performance/match/${matchId}`);
            if (res.data) {
                setPerformances(res.data);
            }
        } catch (err) {
            console.error("Error fetching match performances:", err);
        } finally {
            setPerfLoading(false);
        }
    };

    useEffect(() => {
        if (matchId) {
            fetchMatchDetails();
            fetchPerformances();
        }
    }, [matchId]);

    // Fetch team members when team selection changes in performance modal
    useEffect(() => {
        if (selectedTeamId) {
            const fetchTeamRoster = async () => {
                try {
                    setRosterLoading(true);
                    const res = await api.get(`/team/members/${selectedTeamId}`);
                    if (res.data) {
                        setRoster(res.data);
                    }
                } catch (err) {
                    console.error("Error fetching team members:", err);
                    message.error("Failed to load team roster");
                } finally {
                    setRosterLoading(false);
                }
            };
            fetchTeamRoster();
        } else {
            setRoster([]);
        }
    }, [selectedTeamId]);

    const handleSavePerformance = async (values) => {
        if (!match) return;
        try {
            setSubmitLoading(true);
            const sport = match.tournamentId?.sport?.toLowerCase() || "football";

            // Extract performance stats
            const stats = {};
            if (sport === "football") {
                stats.goals = values.goals || 0;
                stats.assists = values.assists || 0;
                stats.passes = values.passes || 0;
                stats.tackles = values.tackles || 0;
                stats.cleanSheets = values.cleanSheets || 0;
            } else {
                stats.runs = values.runs || 0;
                stats.ballsFaced = values.ballsFaced || 0;
                stats.strikeRate = values.strikeRate || 0;
                stats.wickets = values.wickets || 0;
                stats.economy = values.economy || 0;
            }

            if (editingPerformance) {
                // Update performance
                await api.put(`/performance/${editingPerformance._id}`, { stats });
                message.success("Player performance updated successfully!");
            } else {
                // Create new performance record
                const payload = {
                    athleteId: values.athleteId,
                    matchId: match._id,
                    teamId: values.teamId,
                    tournamentId: match.tournamentId?._id,
                    sport: sport,
                    stats: stats
                };
                await api.post("/performance/create", payload);
                message.success("Player performance recorded successfully!");
            }

            setPerfModalOpen(false);
            perfForm.resetFields();
            fetchPerformances();
        } catch (err) {
            console.error("Error saving player performance:", err);
            message.error(err.response?.data?.message || "Failed to record player performance");
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeletePerformance = async (perfId) => {
        try {
            await api.delete(`/performance/${perfId}`);
            message.success("Performance record deleted successfully!");
            fetchPerformances();
        } catch (err) {
            console.error("Error deleting performance record:", err);
            message.error("Failed to delete performance record");
        }
    };

    const sportCategory = match?.tournamentId?.sport?.toLowerCase() || "football";
    
    const footballColumns = [
        {
            title: "PLAYER",
            key: "player",
            render: (_, record) => (
                <div className="flex items-center space-x-2.5">
                    <Avatar size={24} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-text-primary leading-none">{record.athleteId?.userId?.name || "Player"}</p>
                        <p className="text-[10px] text-text-secondary mt-1">{record.teamId?.teamName}</p>
                    </div>
                </div>
            )
        },
        {
            title: "GOALS",
            dataIndex: ["stats", "goals"],
            key: "goals",
            render: (v) => <span className="text-xs font-bold text-brand-secondary font-mono">{v || 0}</span>
        },
        {
            title: "ASSISTS",
            dataIndex: ["stats", "assists"],
            key: "assists",
            render: (v) => <span className="text-xs font-medium text-text-primary font-mono">{v || 0}</span>
        },
        {
            title: "PASSES",
            dataIndex: ["stats", "passes"],
            key: "passes",
            render: (v) => <span className="text-xs text-text-secondary font-mono">{v || 0}</span>
        },
        {
            title: "TACKLES",
            dataIndex: ["stats", "tackles"],
            key: "tackles",
            render: (v) => <span className="text-xs text-text-secondary font-mono">{v || 0}</span>
        },
        {
            title: "CLEAN SHEETS",
            dataIndex: ["stats", "cleanSheets"],
            key: "cleanSheets",
            render: (v) => <span className="text-xs text-brand-primary font-mono">{v || 0}</span>
        }
    ];

    const cricketColumns = [
        {
            title: "PLAYER",
            key: "player",
            render: (_, record) => (
                <div className="flex items-center space-x-2.5">
                    <Avatar size={24} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-text-primary leading-none">{record.athleteId?.userId?.name || "Player"}</p>
                        <p className="text-[10px] text-text-secondary mt-1">{record.teamId?.teamName}</p>
                    </div>
                </div>
            )
        },
        {
            title: "RUNS",
            dataIndex: ["stats", "runs"],
            key: "runs",
            render: (v) => <span className="text-xs font-bold text-brand-secondary font-mono">{v || 0}</span>
        },
        {
            title: "BALLS FACED",
            dataIndex: ["stats", "ballsFaced"],
            key: "ballsFaced",
            render: (v) => <span className="text-xs font-medium text-text-primary font-mono">{v || 0}</span>
        },
        {
            title: "STRIKE RATE",
            dataIndex: ["stats", "strikeRate"],
            key: "strikeRate",
            render: (v) => <span className="text-xs text-brand-primary font-mono font-bold">{v || 0}</span>
        },
        {
            title: "WICKETS",
            dataIndex: ["stats", "wickets"],
            key: "wickets",
            render: (v) => <span className="text-xs font-bold text-brand-primary font-mono">{v || 0}</span>
        },
        {
            title: "ECONOMY",
            dataIndex: ["stats", "economy"],
            key: "economy",
            render: (v) => <span className="text-xs text-text-secondary font-mono">{v || 0}</span>
        }
    ];

    const actionColumn = {
        title: "ACTIONS",
        key: "actions",
        render: (_, record) => (
            <div className="flex space-x-1.5">
                <Button 
                    type="text" 
                    size="small" 
                    danger
                    icon={<DeleteOutlined className="text-xs" />}
                    onClick={() => handleDeletePerformance(record._id)}
                    className="h-7 w-7 cursor-pointer flex items-center justify-center"
                />
            </div>
        )
    };

    const columns = sportCategory === "football" ? [...footballColumns] : [...cricketColumns];
    if (isOrganization) {
        columns.push(actionColumn);
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Navigation Back */}
            <div className="flex items-center">
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined className="text-xs" />} 
                    onClick={() => navigate(-1)}
                    className="text-text-secondary hover:text-text-primary p-0 h-auto cursor-pointer"
                >
                    Back
                </Button>
            </div>

            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="middle" />
                    <p className="text-xs text-text-secondary mt-3">Syncing match scoreboards...</p>
                </div>
            ) : !match ? (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-16 text-center rounded-xl shadow-sm">
                    <Empty description={<span className="text-text-secondary text-xs">Match details not found.</span>} />
                </Card>
            ) : (
                <>
                    {/* SCOREBOARD BANNER */}
                    <div className="bg-bg-surface border border-border-subtle p-6 sm:p-8 rounded-xl shadow-sm relative overflow-hidden">
                        
                        <div className="flex flex-col items-center justify-center space-y-6">
                            {/* Tournament Tag */}
                            <div className="flex items-center space-x-2">
                                <TrophyOutlined className="text-brand-primary text-xs" />
                                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                                    {match.tournamentId?.name || "Championship fixture"}
                                </span>
                            </div>

                            {/* Main Scores Row */}
                            <div className="flex items-center justify-center space-x-4 sm:space-x-12 w-full max-w-2xl">
                                
                                {/* Home Team */}
                                <div className="flex flex-col items-center text-center w-1/3 min-w-0">
                                    {match.homeTeamId?.logo ? (
                                        <img src={match.homeTeamId.logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover border border-border-subtle shadow-sm shrink-0" />
                                    ) : (
                                        <Avatar size={48} icon={<TrophyOutlined />} className="bg-brand-primary rounded shrink-0" />
                                    )}
                                    <h3 className="text-xs sm:text-sm font-semibold text-text-primary mt-3 truncate w-full m-0">{match.homeTeamId?.teamName}</h3>
                                    <span className="text-[10px] text-text-secondary uppercase mt-1">Home</span>
                                </div>

                                {/* Score display */}
                                <div className="flex flex-col items-center justify-center w-1/3 shrink-0">
                                    {match.status === "scheduled" ? (
                                        <div className="text-center">
                                            <Tag color="processing" className="m-0 border-0 font-semibold uppercase text-[9px] px-2 py-0.5 rounded tracking-wide">
                                                Scheduled
                                            </Tag>
                                            <p className="text-text-secondary font-mono text-xs mt-2 font-bold m-0">VS</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <span className="text-3xl sm:text-4xl font-black text-brand-primary font-mono leading-none">
                                                {match.homeScore} - {match.awayScore}
                                            </span>
                                            <div className="mt-2">
                                                <Tag color="success" className="m-0 border-0 font-semibold uppercase text-[8px] px-1.5 py-0.5 rounded tracking-wide">
                                                    Completed
                                                </Tag>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Away Team */}
                                <div className="flex flex-col items-center text-center w-1/3 min-w-0">
                                    {match.awayTeamId?.logo ? (
                                        <img src={match.awayTeamId.logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover border border-border-subtle shadow-sm shrink-0" />
                                    ) : (
                                        <Avatar size={48} icon={<TrophyOutlined />} className="bg-brand-primary rounded shrink-0" />
                                    )}
                                    <h3 className="text-xs sm:text-sm font-semibold text-text-primary mt-3 truncate w-full m-0">{match.awayTeamId?.teamName}</h3>
                                    <span className="text-[10px] text-text-secondary uppercase mt-1">Away</span>
                                </div>

                            </div>

                            {/* Match meta logs */}
                            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-text-secondary pt-3.5 border-t border-border-subtle w-full max-w-md">
                                <span className="flex items-center">
                                    <CalendarOutlined className="mr-1.5 text-brand-primary text-[10px]" />
                                    {new Date(match.matchDate).toLocaleString()}
                                </span>
                                <span className="text-text-secondary/30">•</span>
                                <span className="flex items-center">
                                    <EnvironmentOutlined className="mr-1.5 text-text-secondary/50 text-[10px]" />
                                    {match.venue}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ROSTER PERFORMANCE RECORDS */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                            <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase flex items-center space-x-1.5">
                                <TrophyOutlined className="text-brand-primary text-xs" />
                                <span>Athlete Match Statistics ({match.tournamentId?.sport?.toUpperCase()})</span>
                            </h2>
                            {isOrganization && (
                                <Space>
                                    <Button 
                                        type="default" 
                                        size="small"
                                        icon={<PlusOutlined className="text-xs" />}
                                        onClick={() => navigate(`/organization/performance/single?matchId=${matchId}&tournamentId=${match?.tournamentId?._id || match?.tournamentId}`)}
                                        className="text-xs h-8 cursor-pointer"
                                    >
                                        Single Entry
                                    </Button>
                                    <Button 
                                        type="primary" 
                                        size="small"
                                        icon={<PlusOutlined className="text-xs" />}
                                        onClick={() => navigate(`/organization/performance/bulk?matchId=${matchId}&tournamentId=${match?.tournamentId?._id || match?.tournamentId}`)}
                                        className="text-xs font-semibold h-8 cursor-pointer"
                                    >
                                        Bulk Entry
                                    </Button>
                                </Space>
                            )}
                        </div>

                        {perfLoading ? (
                            <div className="py-12 flex justify-center"><Spin size="small" /></div>
                        ) : performances.length === 0 ? (
                            <Card bordered={false} className="border border-border-subtle bg-bg-surface py-12 text-center rounded-xl shadow-sm">
                                <Empty description={<span className="text-text-secondary text-xs">No individual player statistics have been registered for this match yet.</span>} />
                            </Card>
                        ) : (
                            <Table 
                                columns={columns}
                                dataSource={performances.map(p => ({ ...p, key: p._id }))}
                                pagination={false}
                                size="small"
                                className="custom-table border border-border-subtle bg-bg-surface rounded-xl overflow-hidden shadow-sm"
                            />
                        )}
                    </div>
                </>
            )}

            {/* RECORD PERFORMANCE MODAL (For Organizations) */}
            <Modal
                title={<span className="text-xs font-bold uppercase text-text-primary tracking-wider">{editingPerformance ? "Update Player Performance" : "Record Player Performance"}</span>}
                open={perfModalOpen}
                onCancel={() => setPerfModalOpen(false)}
                footer={null}
                width={500}
                centered
            >
                <Form
                    form={perfForm}
                    layout="vertical"
                    onFinish={handleSavePerformance}
                    requiredMark={false}
                    className="mt-4"
                >
                    {/* 1. Choose Team */}
                    <Form.Item
                        name="teamId"
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Select Squad</span>}
                        rules={[{ required: true, message: "Please select squad team" }]}
                    >
                        <Select 
                            placeholder="Select Team" 
                            onChange={(value) => {
                                setSelectedTeamId(value);
                                perfForm.setFieldsValue({ athleteId: undefined });
                            }}
                            disabled={!!editingPerformance}
                        >
                            <Option value={match?.homeTeamId?._id}>{match?.homeTeamId?.teamName}</Option>
                            <Option value={match?.awayTeamId?._id}>{match?.awayTeamId?.teamName}</Option>
                        </Select>
                    </Form.Item>

                    {/* 2. Choose Player */}
                    <Form.Item
                        name="athleteId"
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Select Player</span>}
                        rules={[{ required: true, message: "Please select a player" }]}
                    >
                        <Select 
                            placeholder={selectedTeamId ? "Select Squad Athlete" : "Choose squad first"} 
                            loading={rosterLoading}
                            disabled={!selectedTeamId || !!editingPerformance}
                        >
                            {roster.map(mem => (
                                <Option key={mem.athleteId?._id} value={mem.athleteId?._id}>
                                    {mem.athleteId?.userId?.name} ({mem.athleteId?.primaryRole})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Sport specific statistics form */}
                    <div className="border-t border-border-subtle pt-4 mt-4 space-y-4">
                        <h4 className="text-xs font-bold text-brand-primary uppercase tracking-wider">Game Performance Stats</h4>
                        
                        {sportCategory === "football" ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <Form.Item name="goals" label={<span className="text-[10px] text-text-secondary uppercase font-bold">Goals</span>}>
                                    <InputNumber min={0} max={20} className="w-full" />
                                </Form.Item>
                                <Form.Item name="assists" label={<span className="text-[10px] text-text-secondary uppercase font-bold">Assists</span>}>
                                    <InputNumber min={0} max={20} className="w-full" />
                                </Form.Item>
                                <Form.Item name="passes" label={<span className="text-[10px] text-text-secondary uppercase font-bold">Passes</span>}>
                                    <InputNumber min={0} max={1000} className="w-full" />
                                </Form.Item>
                                <Form.Item name="tackles" label={<span className="text-[10px] text-text-secondary uppercase font-bold">Tackles</span>}>
                                    <InputNumber min={0} max={100} className="w-full" />
                                </Form.Item>
                                <Form.Item name="cleanSheets" label={<span className="text-[10px] text-text-secondary uppercase font-bold">Clean Sheets</span>}>
                                    <InputNumber min={0} max={1} className="w-full" placeholder="0 or 1" />
                                </Form.Item>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <Form.Item name="runs" label={<span className="text-[10px] text-text-secondary uppercase font-bold">Runs</span>}>
                                    <InputNumber min={0} max={500} className="w-full" />
                                </Form.Item>
                                <Form.Item name="ballsFaced" label={<span className="text-[10px] text-text-secondary uppercase font-bold">Balls Faced</span>}>
                                    <InputNumber min={0} max={600} className="w-full" />
                                </Form.Item>
                                <Form.Item name="strikeRate" label={<span className="text-[10px] text-text-secondary uppercase font-bold">Strike Rate</span>}>
                                    <InputNumber min={0} max={600} step={0.1} className="w-full" />
                                </Form.Item>
                                <Form.Item name="wickets" label={<span className="text-[10px] text-text-secondary uppercase font-bold">Wickets</span>}>
                                    <InputNumber min={0} max={10} className="w-full" />
                                </Form.Item>
                                <Form.Item name="economy" label={<span className="text-[10px] text-text-secondary uppercase font-bold">Economy</span>}>
                                    <InputNumber min={0} max={36} step={0.01} className="w-full" />
                                </Form.Item>
                            </div>
                        )}
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-4 border-t border-border-subtle flex justify-end space-x-2 mt-4">
                        <Button onClick={() => setPerfModalOpen(false)} className="text-xs">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={submitLoading} className="text-xs font-semibold h-9 rounded-md">Save Metrics</Button>
                    </div>
                </Form>
            </Modal>

        </div>
    );
}

export default MatchDetails;
