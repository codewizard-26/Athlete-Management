import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Button, Tag, Avatar, Table, Spin, Empty, Modal, Form, Select, InputNumber, Row, Col, Space, message, ConfigProvider, theme } from "antd";
import { 
    CalendarOutlined, 
    EnvironmentOutlined, 
    TrophyOutlined, 
    ArrowLeftOutlined,
    ClockCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    UserOutlined,
    SwapOutlined
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

    const handleOpenAddPerformance = () => {
        setEditingPerformance(null);
        perfForm.resetFields();
        setSelectedTeamId(null);
        setPerfModalOpen(true);
    };

    const handleOpenEditPerformance = (perf) => {
        setEditingPerformance(perf);
        setSelectedTeamId(perf.teamId?._id);
        
        // Pre-populate fields
        perfForm.setFieldsValue({
            teamId: perf.teamId?._id,
            athleteId: perf.athleteId?._id,
            ...perf.stats
        });
        setPerfModalOpen(true);
    };

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

    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: "#2563eb", // Sports corporate blue
            colorBgContainer: "#0f172a", // Slate-900
            colorBorder: "rgba(255, 255, 255, 0.08)",
            colorText: "#f3f4f6",
            colorTextSecondary: "#9ca3af",
            borderRadius: 8,
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        },
        components: {
            Button: {
                colorPrimary: "#2563eb",
                colorPrimaryHover: "#1d4ed8",
                borderRadius: 8,
                controlHeight: 40,
                fontWeight: 600,
            },
            Input: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            },
            Select: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            },
            InputNumber: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            }
        }
    };

    // Columns config for performance logs
    const sportCategory = match?.tournamentId?.sport?.toLowerCase() || "football";
    
    const footballColumns = [
        {
            title: <span className="text-xs font-bold text-slate-400">Player</span>,
            key: "player",
            render: (_, record) => (
                <div className="flex items-center space-x-2">
                    <Avatar size="small" icon={<UserOutlined />} className="bg-blue-600 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-white leading-none">{record.athleteId?.userId?.name || "Player"}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">{record.teamId?.teamName}</p>
                    </div>
                </div>
            )
        },
        {
            title: <span className="text-xs font-bold text-slate-400">Goals</span>,
            dataIndex: ["stats", "goals"],
            key: "goals",
            render: (v) => <span className="text-xs font-black text-emerald-400 font-mono">{v || 0}</span>
        },
        {
            title: <span className="text-xs font-bold text-slate-400">Assists</span>,
            dataIndex: ["stats", "assists"],
            key: "assists",
            render: (v) => <span className="text-xs font-bold text-slate-300 font-mono">{v || 0}</span>
        },
        {
            title: <span className="text-xs font-bold text-slate-400">Passes</span>,
            dataIndex: ["stats", "passes"],
            key: "passes",
            render: (v) => <span className="text-xs text-slate-400 font-mono">{v || 0}</span>
        },
        {
            title: <span className="text-xs font-bold text-slate-400">Tackles</span>,
            dataIndex: ["stats", "tackles"],
            key: "tackles",
            render: (v) => <span className="text-xs text-slate-400 font-mono">{v || 0}</span>
        },
        {
            title: <span className="text-xs font-bold text-slate-400">Clean Sheets</span>,
            dataIndex: ["stats", "cleanSheets"],
            key: "cleanSheets",
            render: (v) => <span className="text-xs text-blue-400 font-mono">{v || 0}</span>
        }
    ];

    const cricketColumns = [
        {
            title: <span className="text-xs font-bold text-slate-400">Player</span>,
            key: "player",
            render: (_, record) => (
                <div className="flex items-center space-x-2">
                    <Avatar size="small" icon={<UserOutlined />} className="bg-blue-600 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-white leading-none">{record.athleteId?.userId?.name || "Player"}</p>
                        <p className="text-[9px] text-slate-500 mt-0.5">{record.teamId?.teamName}</p>
                    </div>
                </div>
            )
        },
        {
            title: <span className="text-xs font-bold text-slate-400">Runs</span>,
            dataIndex: ["stats", "runs"],
            key: "runs",
            render: (v) => <span className="text-xs font-black text-emerald-400 font-mono">{v || 0}</span>
        },
        {
            title: <span className="text-xs font-bold text-slate-400">Balls Faced</span>,
            dataIndex: ["stats", "ballsFaced"],
            key: "ballsFaced",
            render: (v) => <span className="text-xs font-semibold text-slate-300 font-mono">{v || 0}</span>
        },
        {
            title: <span className="text-xs font-bold text-slate-400">Strike Rate</span>,
            dataIndex: ["stats", "strikeRate"],
            key: "strikeRate",
            render: (v) => <span className="text-xs text-blue-400 font-mono font-bold">{v || 0}</span>
        },
        {
            title: <span className="text-xs font-bold text-slate-400">Wickets</span>,
            dataIndex: ["stats", "wickets"],
            key: "wickets",
            render: (v) => <span className="text-xs font-bold text-purple-400 font-mono">{v || 0}</span>
        },
        {
            title: <span className="text-xs font-bold text-slate-400">Economy</span>,
            dataIndex: ["stats", "economy"],
            key: "economy",
            render: (v) => <span className="text-xs text-slate-400 font-mono">{v || 0}</span>
        }
    ];

    const actionColumn = {
        title: <span className="text-xs font-bold text-slate-400">Actions</span>,
        key: "actions",
        render: (_, record) => (
            <div className="flex space-x-2">
                <Button 
                    type="text" 
                    size="small" 
                    icon={<EditOutlined className="text-blue-400 hover:text-blue-300" />}
                    onClick={() => handleOpenEditPerformance(record)}
                />
                <Button 
                    type="text" 
                    size="small" 
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeletePerformance(record._id)}
                />
            </div>
        )
    };

    const columns = sportCategory === "football" ? [...footballColumns] : [...cricketColumns];
    if (isOrganization) {
        columns.push(actionColumn);
    }

    return (
        <ConfigProvider theme={darkTheme}>
            <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
                
                {/* Navigation Back */}
                <div className="flex items-center space-x-2">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => navigate(-1)}
                        className="text-slate-400 hover:text-white"
                    >
                        Back
                    </Button>
                </div>

                {loading ? (
                    <div className="min-h-[40vh] flex flex-col items-center justify-center">
                        <Spin size="large" />
                        <p className="text-xs text-slate-400 mt-4">Syncing match scoreboards...</p>
                    </div>
                ) : !match ? (
                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-16 text-center">
                        <Empty description={<span className="text-slate-400 text-xs">Match details not found.</span>} />
                    </Card>
                ) : (
                    <>
                        {/* SCOREBOARD BANNER */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-slate-900/30 to-[#0f172a]/60 border border-blue-500/10 p-6 sm:p-8 rounded-2xl shadow-xl">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
                            
                            <div className="flex flex-col items-center justify-center space-y-6">
                                {/* Tournament Tag */}
                                <div className="flex items-center space-x-2">
                                    <TrophyOutlined className="text-blue-500 text-xs" />
                                    <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                                        {match.tournamentId?.name || "Championship fixture"}
                                    </span>
                                </div>

                                {/* Main Scores Row */}
                                <div className="flex items-center justify-center space-x-4 sm:space-x-12 w-full max-w-2xl">
                                    
                                    {/* Home Team */}
                                    <div className="flex flex-col items-center text-center w-1/3 min-w-0">
                                        {match.homeTeamId?.logo ? (
                                            <img src={match.homeTeamId.logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border border-white/10 shadow-lg" />
                                        ) : (
                                            <Avatar size={48} icon={<TrophyOutlined />} className="bg-blue-600 rounded-xl" />
                                        )}
                                        <h3 className="text-xs sm:text-sm font-black text-white mt-3 truncate w-full">{match.homeTeamId?.teamName}</h3>
                                        <span className="text-[9px] text-slate-500 uppercase mt-1">Home</span>
                                    </div>

                                    {/* Score display */}
                                    <div className="flex flex-col items-center justify-center w-1/3 shrink-0">
                                        {match.status === "scheduled" ? (
                                            <div className="text-center">
                                                <Tag color="processing" className="m-0 border-0 font-bold uppercase text-[9px] tracking-wide">
                                                    Scheduled
                                                </Tag>
                                                <p className="text-slate-400 font-mono text-xs mt-2 font-bold">VS</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <span className="text-3xl sm:text-4xl font-black text-blue-400 font-mono">
                                                    {match.homeScore} : {match.awayScore}
                                                </span>
                                                <div className="mt-2">
                                                    <Tag color="success" className="m-0 border-0 font-bold uppercase text-[8px] tracking-wide">
                                                        Completed
                                                    </Tag>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Away Team */}
                                    <div className="flex flex-col items-center text-center w-1/3 min-w-0">
                                        {match.awayTeamId?.logo ? (
                                            <img src={match.awayTeamId.logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border border-white/10 shadow-lg" />
                                        ) : (
                                            <Avatar size={48} icon={<TrophyOutlined />} className="bg-blue-600 rounded-xl" />
                                        )}
                                        <h3 className="text-xs sm:text-sm font-black text-white mt-3 truncate w-full">{match.awayTeamId?.teamName}</h3>
                                        <span className="text-[9px] text-slate-500 uppercase mt-1">Away</span>
                                    </div>

                                </div>

                                {/* Match meta logs */}
                                <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-400 pt-3 border-t border-white/[0.04] w-full max-w-md">
                                    <span className="flex items-center">
                                        <CalendarOutlined className="mr-1 text-blue-500" />
                                        {new Date(match.matchDate).toLocaleString()}
                                    </span>
                                    <span className="text-slate-600">•</span>
                                    <span className="flex items-center">
                                        <EnvironmentOutlined className="mr-1 text-slate-500" />
                                        {match.venue}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ROSTER PERFORMANCE RECORDS */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                                <h2 className="text-base font-bold text-white tracking-wide uppercase flex items-center space-x-2">
                                    <TrophyOutlined className="text-blue-500" />
                                    <span>Athlete Match Statistics ({match.tournamentId?.sport?.toUpperCase()})</span>
                                </h2>
                                {isOrganization && (
                                    <Button 
                                        type="primary" 
                                        size="small"
                                        icon={<PlusOutlined />}
                                        onClick={handleOpenAddPerformance}
                                        className="text-xs"
                                    >
                                        Add Performance
                                    </Button>
                                )}
                            </div>

                            {perfLoading ? (
                                <div className="py-12 flex justify-center"><Spin /></div>
                            ) : performances.length === 0 ? (
                                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-12 text-center">
                                    <Empty description={<span className="text-slate-400 text-xs">No individual player statistics have been registered for this match yet.</span>} />
                                </Card>
                            ) : (
                                <Table 
                                    columns={columns}
                                    dataSource={performances.map(p => ({ ...p, key: p._id }))}
                                    pagination={false}
                                    className="custom-table border border-white/[0.04] bg-[#0f172a]/30 rounded-xl overflow-hidden shadow-md"
                                />
                            )}
                        </div>
                    </>
                )}

                {/* RECORD PERFORMANCE MODAL (For Organizations) */}
                <Modal
                    title={<span className="text-sm font-extrabold uppercase text-white tracking-wider">{editingPerformance ? "Update Player Performance" : "Record Player Performance"}</span>}
                    open={perfModalOpen}
                    onCancel={() => setPerfModalOpen(false)}
                    footer={null}
                    width={500}
                    className="custom-modal"
                >
                    <Form
                        form={perfForm}
                        layout="vertical"
                        onFinish={handleSavePerformance}
                        requiredMark={false}
                    >
                        {/* 1. Choose Team */}
                        <Form.Item
                            name="teamId"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Squad</span>}
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
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Player</span>}
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
                        <div className="border-t border-white/[0.04] pt-4 mt-4 space-y-4">
                            <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Game Performance Stats</h4>
                            
                            {sportCategory === "football" ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <Form.Item name="goals" label={<span className="text-[10px] text-slate-400 uppercase font-bold">Goals</span>}>
                                        <InputNumber min={0} max={20} className="w-full" />
                                    </Form.Item>
                                    <Form.Item name="assists" label={<span className="text-[10px] text-slate-400 uppercase font-bold">Assists</span>}>
                                        <InputNumber min={0} max={20} className="w-full" />
                                    </Form.Item>
                                    <Form.Item name="passes" label={<span className="text-[10px] text-slate-400 uppercase font-bold">Passes</span>}>
                                        <InputNumber min={0} max={1000} className="w-full" />
                                    </Form.Item>
                                    <Form.Item name="tackles" label={<span className="text-[10px] text-slate-400 uppercase font-bold">Tackles</span>}>
                                        <InputNumber min={0} max={100} className="w-full" />
                                    </Form.Item>
                                    <Form.Item name="cleanSheets" label={<span className="text-[10px] text-slate-400 uppercase font-bold">Clean Sheets</span>}>
                                        <InputNumber min={0} max={1} className="w-full" placeholder="0 or 1" />
                                    </Form.Item>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <Form.Item name="runs" label={<span className="text-[10px] text-slate-400 uppercase font-bold">Runs</span>}>
                                        <InputNumber min={0} max={500} className="w-full" />
                                    </Form.Item>
                                    <Form.Item name="ballsFaced" label={<span className="text-[10px] text-slate-400 uppercase font-bold">Balls Faced</span>}>
                                        <InputNumber min={0} max={600} className="w-full" />
                                    </Form.Item>
                                    <Form.Item name="strikeRate" label={<span className="text-[10px] text-slate-400 uppercase font-bold">Strike Rate</span>}>
                                        <InputNumber min={0} max={600} step={0.1} className="w-full" />
                                    </Form.Item>
                                    <Form.Item name="wickets" label={<span className="text-[10px] text-slate-400 uppercase font-bold">Wickets</span>}>
                                        <InputNumber min={0} max={10} className="w-full" />
                                    </Form.Item>
                                    <Form.Item name="economy" label={<span className="text-[10px] text-slate-400 uppercase font-bold">Economy</span>}>
                                        <InputNumber min={0} max={36} step={0.01} className="w-full" />
                                    </Form.Item>
                                </div>
                            )}
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-6 mt-6 border-t border-white/[0.04] flex justify-end space-x-2">
                            <Button onClick={() => setPerfModalOpen(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={submitLoading}>Save Metrics</Button>
                        </div>
                    </Form>
                </Modal>

            </main>
        </ConfigProvider>
    );
}

export default MatchDetails;
