import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Table, Modal, Form, Input, Select, DatePicker, Tag, message, Spin, Empty, InputNumber } from "antd";
import { 
    CalendarOutlined, 
    EnvironmentOutlined, 
    TrophyOutlined, 
    PlusOutlined, 
    EditOutlined,
    CheckOutlined,
    SwapOutlined,
    EyeOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

const { Option } = Select;

function MatchManagement() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [tournaments, setTournaments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create Match Modal
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createForm] = Form.useForm();
    const [createLoading, setCreateLoading] = useState(false);

    // Score Modal
    const [scoreModalOpen, setScoreModalOpen] = useState(false);
    const [scoreForm] = Form.useForm();
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [scoreLoading, setScoreLoading] = useState(false);
    const [completeLoading, setCompleteLoading] = useState({});

    const fetchData = async () => {
        try {
            setLoading(true);
            const [matchesRes, tourRes, teamsRes] = await Promise.all([
                api.get("/match/all"),
                api.get("/tournament/my-tournaments"),
                api.get("/team/myTeams")
            ]);
            if (matchesRes.data) setMatches(matchesRes.data);
            if (tourRes.data) setTournaments(tourRes.data);
            if (teamsRes.data) setTeams(teamsRes.data);
        } catch (err) {
            console.error("Error fetching match data:", err);
            message.error("Failed to load matches dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateMatch = async (values) => {
        try {
            setCreateLoading(true);
            const payload = {
                tournamentId: values.tournamentId,
                homeTeamId: values.homeTeamId,
                awayTeamId: values.awayTeamId,
                matchDate: values.matchDate.format("YYYY-MM-DD HH:mm"),
                venue: values.venue.trim()
            };
            await api.post("/match/create", payload);
            message.success("Match scheduled successfully!");
            setCreateModalOpen(false);
            createForm.resetFields();
            fetchData();
        } catch (err) {
            console.error("Error creating match:", err);
            message.error(err.response?.data?.message || "Failed to schedule match");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleOpenScoreModal = (match) => {
        setSelectedMatch(match);
        scoreForm.setFieldsValue({
            homeScore: match.homeScore || 0,
            awayScore: match.awayScore || 0
        });
        setScoreModalOpen(true);
    };

    const handleUpdateScore = async (values) => {
        if (!selectedMatch) return;
        try {
            setScoreLoading(true);
            await api.put(`/match/score/${selectedMatch._id}`, values);
            message.success("Score updated successfully!");
            setScoreModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Error updating score:", err);
            message.error("Failed to update score");
        } finally {
            setScoreLoading(false);
        }
    };

    const handleCompleteMatch = async (matchId) => {
        try {
            setCompleteLoading(prev => ({ ...prev, [matchId]: true }));
            await api.put(`/match/complete/${matchId}`);
            message.success("Match marked as completed!");
            fetchData();
        } catch (err) {
            console.error("Error completing match:", err);
            message.error("Failed to complete match");
        } finally {
            setCompleteLoading(prev => ({ ...prev, [matchId]: false }));
        }
    };

    const columns = [
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Match Details</span>,
            key: "details",
            render: (_, record) => (
                <div className="space-y-1">
                    <p className="text-xs font-bold text-white">
                        {record.homeTeamId?.teamName} vs {record.awayTeamId?.teamName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                        {record.tournamentId?.name || "Friendly"}
                    </p>
                </div>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Schedule</span>,
            key: "schedule",
            render: (_, record) => (
                <div className="space-y-0.5 text-[10px] text-slate-300">
                    <p className="font-semibold"><CalendarOutlined className="mr-1.5 text-blue-500" />{new Date(record.matchDate).toLocaleString()}</p>
                    <p><EnvironmentOutlined className="mr-1.5 text-slate-500" />{record.venue}</p>
                </div>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Score</span>,
            key: "score",
            render: (_, record) => (
                <span className="text-xs font-black text-blue-400 font-mono">
                    {record.homeScore !== undefined ? record.homeScore : "-"} : {record.awayScore !== undefined ? record.awayScore : "-"}
                </span>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Status</span>,
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "completed" ? "success" : "processing"} className="m-0 border-0 font-bold uppercase text-[9px]">
                    {status}
                </Tag>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Actions</span>,
            key: "actions",
            render: (_, record) => (
                <div className="flex space-x-2">
                    <Button 
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/match/${record._id}`)}
                        className="text-xs"
                    >
                        View
                    </Button>
                    {record.status !== "completed" && (
                        <>
                            <Button 
                                type="dashed"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => handleOpenScoreModal(record)}
                                className="text-xs hover:border-blue-500 hover:text-blue-400"
                            >
                                Score
                            </Button>
                            <Button 
                                type="primary"
                                size="small"
                                icon={<CheckOutlined />}
                                onClick={() => handleCompleteMatch(record._id)}
                                loading={completeLoading[record._id]}
                                className="bg-emerald-600 border-0 hover:bg-emerald-500 text-xs"
                            >
                                End
                            </Button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                        <CalendarOutlined className="text-blue-500" />
                        <span>Match Management</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Schedule tournaments fixtures, record final scores, and update details.</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => setCreateModalOpen(true)}
                    className="shadow-lg shadow-blue-600/10 font-bold text-xs"
                >
                    Schedule Match
                </Button>
            </div>

            {/* List */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="large" />
                    <p className="text-xs text-slate-400 mt-4">Syncing matches database...</p>
                </div>
            ) : matches.length === 0 ? (
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-16 text-center">
                    <Empty description={<span className="text-slate-400 text-xs">No matches scheduled. Click the button to schedule one!</span>} />
                </Card>
            ) : (
                <Table 
                    columns={columns}
                    dataSource={matches.map(m => ({ ...m, key: m._id }))}
                    className="custom-table border border-white/[0.04] bg-[#0f172a]/30 rounded-xl overflow-hidden shadow-md"
                />
            )}

            {/* Create Match Modal */}
            <Modal
                title={<span className="text-sm font-extrabold uppercase text-white tracking-wider">Schedule New Match</span>}
                open={createModalOpen}
                onCancel={() => setCreateModalOpen(false)}
                footer={null}
                className="custom-modal"
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreateMatch}
                    requiredMark={false}
                >
                    <Form.Item
                        name="tournamentId"
                        label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tournament Name</span>}
                        rules={[{ required: true, message: "Select a tournament" }]}
                    >
                        <Select placeholder="Select Tournament">
                            {tournaments.map(t => (
                                <Option key={t._id} value={t._id}>{t.name} ({t.sport})</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Form.Item
                            name="homeTeamId"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Home Team</span>}
                            rules={[{ required: true, message: "Select home team" }]}
                        >
                            <Select placeholder="Select Home Team">
                                {teams.map(t => (
                                    <Option key={t._id} value={t._id}>{t.teamName}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="awayTeamId"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Away Team</span>}
                            rules={[{ required: true, message: "Select away team" }]}
                        >
                            <Select placeholder="Select Away Team">
                                {teams.map(t => (
                                    <Option key={t._id} value={t._id}>{t.teamName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="matchDate"
                        label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Match Date & Time</span>}
                        rules={[{ required: true, message: "Please select date and time" }]}
                    >
                        <DatePicker showTime className="w-full" />
                    </Form.Item>

                    <Form.Item
                        name="venue"
                        label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Venue</span>}
                        rules={[{ required: true, message: "Enter match venue" }]}
                    >
                        <Input placeholder="e.g. Field Arena 3, New York" />
                    </Form.Item>

                    <div className="pt-4 flex justify-end space-x-2">
                        <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={createLoading}>Schedule</Button>
                    </div>
                </Form>
            </Modal>

            {/* Edit Score Modal */}
            <Modal
                title={<span className="text-sm font-extrabold uppercase text-white tracking-wider">Record Score</span>}
                open={scoreModalOpen}
                onCancel={() => setScoreModalOpen(false)}
                footer={null}
                width={400}
                className="custom-modal"
            >
                <Form
                    form={scoreForm}
                    layout="vertical"
                    onFinish={handleUpdateScore}
                    requiredMark={false}
                >
                    <div className="flex items-center justify-between gap-6 py-4">
                        <Form.Item
                            name="homeScore"
                            label={<span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate max-w-[120px]">{selectedMatch?.homeTeamId?.teamName || "Home"}</span>}
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={0} className="w-full text-center text-lg font-bold font-mono" />
                        </Form.Item>

                        <SwapOutlined className="text-slate-500 text-lg mt-4" />

                        Form.Item
                        <Form.Item
                            name="awayScore"
                            label={<span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate max-w-[120px]">{selectedMatch?.awayTeamId?.teamName || "Away"}</span>}
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={0} className="w-full text-center text-lg font-bold font-mono" />
                        </Form.Item>
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                        <Button onClick={() => setScoreModalOpen(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={scoreLoading}>Save Score</Button>
                    </div>
                </Form>
            </Modal>

        </main>
    );
}

export default MatchManagement;
