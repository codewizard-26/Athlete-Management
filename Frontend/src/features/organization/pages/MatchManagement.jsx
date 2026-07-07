import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Table, Modal, Form, Input, Select, DatePicker, Tag, message, Spin, Empty, InputNumber, Upload } from "antd";
import { 
    CalendarOutlined, 
    EnvironmentOutlined, 
    PlusOutlined, 
    EditOutlined,
    CheckOutlined,
    EyeOutlined,
    CloudUploadOutlined
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

    // Bulk Upload Modal
    const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
    const [bulkUploadForm] = Form.useForm();
    const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

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

    const handleBulkUpload = async (values) => {
        if (fileList.length === 0) {
            message.warning("Please select a CSV file to upload.");
            return;
        }
        const formData = new FormData();
        formData.append("file", fileList[0].originFileObj || fileList[0]);
        
        try {
            setBulkUploadLoading(true);
            const res = await api.post(`/tournament/${values.tournamentId}/upload-schedule`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            message.success(`Successfully scheduled ${res.data.createdMatches?.length || 0} matches.`);
            if (res.data.errors?.length > 0) {
                 message.warning(`${res.data.errors.length} rows could not be parsed or matched.`);
            }
            
            setBulkUploadModalOpen(false);
            bulkUploadForm.resetFields();
            setFileList([]);
            fetchData();
        } catch (err) {
            console.error("Upload error:", err);
            message.error(err.response?.data?.message || "Failed to upload bulk matches.");
        } finally {
            setBulkUploadLoading(false);
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
                    {record.hasReport ? (
                        <Button 
                            type="primary"
                            size="small"
                            onClick={() => navigate(`/match/${record._id}/report`)}
                            className="text-xs h-7 cursor-pointer bg-brand-primary"
                        >
                            View Report
                        </Button>
                    ) : (
                        <Button 
                            type="primary"
                            size="small"
                            onClick={() => navigate(`/match/${record._id}/report`)}
                            className="text-xs h-7 cursor-pointer bg-status-success hover:bg-status-success/80 border-0"
                        >
                            Match Report
                        </Button>
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
                <div className="flex items-center gap-2">
                    <Button 
                        icon={<CloudUploadOutlined className="text-xs" />} 
                        onClick={() => setBulkUploadModalOpen(true)}
                        className="text-xs font-semibold h-9 rounded-md cursor-pointer"
                    >
                        Bulk Upload
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined className="text-xs" />} 
                        onClick={() => setCreateModalOpen(true)}
                        className="text-xs font-semibold h-9 rounded-md cursor-pointer"
                    >
                        Schedule Match
                    </Button>
                </div>
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

            {/* BULK UPLOAD MODAL */}
            <Modal
                title={<span className="text-xs font-bold uppercase text-text-primary tracking-wider">Bulk Upload Match Schedule</span>}
                open={bulkUploadModalOpen}
                onCancel={() => {
                    setBulkUploadModalOpen(false);
                    setFileList([]);
                    bulkUploadForm.resetFields();
                }}
                footer={null}
                width={500}
                centered
            >
                <Form
                    form={bulkUploadForm}
                    layout="vertical"
                    onFinish={handleBulkUpload}
                    requiredMark={false}
                    className="mt-4"
                >
                    <p className="text-xs text-text-secondary mb-4">
                        Upload a CSV file to automatically schedule matches for a specific tournament. The CSV should have columns: <strong>homeTeam</strong>, <strong>awayTeam</strong>, <strong>matchDate</strong> (YYYY-MM-DD HH:mm), and <strong>venue</strong>.
                    </p>

                    <Form.Item
                        name="tournamentId"
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Target Tournament</span>}
                        rules={[{ required: true, message: "Please select a tournament for the matches" }]}
                    >
                        <Select placeholder="Select tournament championship">
                            {tournaments.map(t => (
                                <Option key={t._id} value={t._id}>{t.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Schedule CSV File</span>}
                        required
                    >
                        <Upload.Dragger
                            accept=".csv"
                            maxCount={1}
                            fileList={fileList}
                            beforeUpload={(file) => {
                                setFileList([file]);
                                return false; // Prevent auto upload
                            }}
                            onRemove={() => setFileList([])}
                            className="bg-bg-surface/50 border-border-subtle hover:border-brand-primary/50 transition-colors"
                        >
                            <p className="ant-upload-drag-icon text-brand-primary/80">
                                <CloudUploadOutlined />
                            </p>
                            <p className="text-xs font-semibold text-text-primary">Click or drag CSV file to this area to upload</p>
                            <p className="text-[10px] text-text-secondary mt-1">Strictly accepts .csv templates</p>
                        </Upload.Dragger>
                    </Form.Item>

                    <div className="pt-4 border-t border-border-subtle flex justify-end space-x-2">
                        <Button onClick={() => {
                            setBulkUploadModalOpen(false);
                            setFileList([]);
                            bulkUploadForm.resetFields();
                        }} className="text-xs">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={bulkUploadLoading} disabled={fileList.length === 0} className="text-xs font-semibold h-9 rounded-md">Upload & Schedule</Button>
                    </div>
                </Form>
            </Modal>

        </div>
    );
}

export default MatchManagement;
