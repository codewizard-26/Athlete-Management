import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Table, Modal, Form, Input, Select, DatePicker, Tag, message, Spin, Empty, InputNumber } from "antd";
import { 
    CalendarOutlined, 
    EnvironmentOutlined, 
    PlusOutlined, 
    EditOutlined,
    CheckOutlined,
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
            title: "MATCH DETAILS",
            key: "details",
            render: (_, record) => (
                <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-text-primary">
                        {record.homeTeamId?.teamName} vs {record.awayTeamId?.teamName}
                    </p>
                    <p className="text-[10px] text-text-secondary">
                        {record.tournamentId?.name || "Friendly"}
                    </p>
                </div>
            )
        },
        {
            title: "SCHEDULE",
            key: "schedule",
            render: (_, record) => (
                <div className="space-y-0.5 text-xs text-text-secondary">
                    <p className="font-semibold text-text-primary"><CalendarOutlined className="mr-1.5 text-brand-primary text-[10px]" />{new Date(record.matchDate).toLocaleString()}</p>
                    <p><EnvironmentOutlined className="mr-1.5 text-text-secondary/50 text-[10px]" />{record.venue}</p>
                </div>
            )
        },
        {
            title: "SCORE",
            key: "score",
            render: (_, record) => (
                <span className="text-xs font-bold text-brand-primary font-mono">
                    {record.homeScore !== undefined ? record.homeScore : "-"} : {record.awayScore !== undefined ? record.awayScore : "-"}
                </span>
            )
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "completed" ? "success" : "processing"} className="m-0 border-0 font-semibold uppercase text-[9px] px-2 py-0.5 rounded">
                    {status}
                </Tag>
            )
        },
        {
            title: "ACTIONS",
            key: "actions",
            render: (_, record) => (
                <div className="flex space-x-2">
                    <Button 
                        size="small"
                        icon={<EyeOutlined className="text-xs" />}
                        onClick={() => navigate(`/match/${record._id}`)}
                        className="text-xs h-7 cursor-pointer"
                    >
                        View
                    </Button>
                    {record.status !== "completed" && (
                        <>
                            <Button 
                                size="small"
                                icon={<EditOutlined className="text-xs" />}
                                onClick={() => handleOpenScoreModal(record)}
                                className="text-xs h-7 hover:border-brand-primary hover:text-brand-primary cursor-pointer"
                            >
                                Score
                            </Button>
                            <Button 
                                type="primary"
                                size="small"
                                icon={<CheckOutlined className="text-xs" />}
                                onClick={() => handleCompleteMatch(record._id)}
                                loading={completeLoading[record._id]}
                                className="bg-status-success border-0 hover:bg-status-success/80 text-xs h-7 cursor-pointer"
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
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                        <CalendarOutlined className="text-brand-primary" />
                        <span>Match Fixtures & Logs</span>
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">Organize match events, update live scores, and complete scheduled fixtures.</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined className="text-xs" />} 
                    onClick={() => setCreateModalOpen(true)}
                    className="text-xs font-semibold h-9 rounded-md cursor-pointer"
                >
                    Schedule Match
                </Button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="middle" />
                    <p className="text-xs text-text-secondary mt-3">Syncing match sheets...</p>
                </div>
            ) : matches.length === 0 ? (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-16 text-center rounded-xl shadow-sm">
                    <Empty description={<span className="text-text-secondary text-xs">No matches scheduled in the system. Get started by scheduling your first fixture!</span>} />
                </Card>
            ) : (
                <Table 
                    columns={columns}
                    dataSource={matches.map(m => ({ ...m, key: m._id }))}
                    className="custom-table border border-border-subtle bg-bg-surface rounded-xl overflow-hidden shadow-sm"
                    pagination={{ pageSize: 8 }}
                    size="small"
                />
            )}

            {/* CREATE MATCH MODAL */}
            <Modal
                title={<span className="text-xs font-bold uppercase text-text-primary tracking-wider">Schedule New Match</span>}
                open={createModalOpen}
                onCancel={() => setCreateModalOpen(false)}
                footer={null}
                width={500}
                centered
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreateMatch}
                    requiredMark={false}
                    className="mt-4"
                >
                    <Form.Item
                        name="tournamentId"
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Tournament (Optional)</span>}
                    >
                        <Select placeholder="Select tournament championship" allowClear>
                            {tournaments.map(t => (
                                <Option key={t._id} value={t._id}>{t.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="homeTeamId"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Home Team</span>}
                            rules={[{ required: true, message: "Home team selection is required" }]}
                        >
                            <Select placeholder="Select home team">
                                {teams.map(t => (
                                    <Option key={t._id} value={t._id}>{t.teamName}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="awayTeamId"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Away Team</span>}
                            rules={[
                                { required: true, message: "Away team selection is required" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('homeTeamId') !== value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Home and Away teams must be different'));
                                    },
                                }),
                            ]}
                        >
                            <Select placeholder="Select away team">
                                {teams.map(t => (
                                    <Option key={t._id} value={t._id}>{t.teamName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            name="matchDate"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Match Date & Time</span>}
                            rules={[{ required: true, message: "Match date-time is required" }]}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" />
                        </Form.Item>

                        <Form.Item
                            name="venue"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Match Venue</span>}
                            rules={[{ required: true, message: "Match venue location is required" }]}
                        >
                            <Input placeholder="E.g. Wembley Stadium" />
                        </Form.Item>
                    </div>

                    <div className="pt-4 border-t border-border-subtle flex justify-end space-x-2">
                        <Button onClick={() => setCreateModalOpen(false)} className="text-xs">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={createLoading} className="text-xs font-semibold h-9 rounded-md">Schedule Match</Button>
                    </div>
                </Form>
            </Modal>

            {/* UPDATE SCORE MODAL */}
            <Modal
                title={<span className="text-xs font-bold uppercase text-text-primary tracking-wider">Update Match Score</span>}
                open={scoreModalOpen}
                onCancel={() => setScoreModalOpen(false)}
                footer={null}
                width={400}
                centered
            >
                <Form
                    form={scoreForm}
                    layout="vertical"
                    onFinish={handleUpdateScore}
                    requiredMark={false}
                    className="mt-4"
                >
                    <div className="grid grid-cols-2 gap-4 py-2">
                        <Form.Item
                            name="homeScore"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{selectedMatch?.homeTeamId?.teamName || "Home"} Score</span>}
                            rules={[{ required: true, message: "Score is required" }]}
                        >
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>

                        <Form.Item
                            name="awayScore"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{selectedMatch?.awayTeamId?.teamName || "Away"} Score</span>}
                            rules={[{ required: true, message: "Score is required" }]}
                        >
                            <InputNumber min={0} className="w-full" />
                        </Form.Item>
                    </div>

                    <div className="pt-4 border-t border-border-subtle flex justify-end space-x-2">
                        <Button onClick={() => setScoreModalOpen(false)} className="text-xs">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={scoreLoading} className="text-xs font-semibold h-9 rounded-md">Update Score</Button>
                    </div>
                </Form>
            </Modal>

        </div>
    );
}

export default MatchManagement;
