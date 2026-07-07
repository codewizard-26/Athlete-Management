import React, { useState, useEffect } from "react";
import { Card, Avatar, Spin, Empty, Button, Modal, Upload, message, Table, Tag } from "antd";
import { UserOutlined, TeamOutlined, CloudUploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

function TeamRoster() {
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);

    const [team, setTeam] = useState(null);

    // Bulk upload states
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [reviewMode, setReviewMode] = useState(false);
    const [matchedPlayers, setMatchedPlayers] = useState([]);
    const [unmatchedPlayers, setUnmatchedPlayers] = useState([]);

    const fetchRoster = async () => {
        try {
            setLoading(true);
            const teamRes = await api.get("/team/me");
            if (teamRes.data) setTeam(teamRes.data);

            const res = await api.get("/team/me/members");
            if (res.data) {
                setRoster(res.data);
            }
        } catch (err) {
            console.error("Error fetching team roster:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (fileList.length === 0) return message.warning("Please select a CSV file.");
        const formData = new FormData();
        formData.append("file", fileList[0]);
        
        try {
            setUploading(true);
            const res = await api.post(`/team/${team._id}/upload-roster`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setMatchedPlayers(res.data.matches || []);
            setUnmatchedPlayers(res.data.unmatched || []);
            setReviewMode(true);
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to parse bulk upload");
        } finally {
            setUploading(false);
        }
    };

    const handleConfirm = async () => {
        const athleteIds = matchedPlayers.filter(m => !m.alreadyInTeam).map(m => m.athleteId);
        if (athleteIds.length === 0) {
            message.info("No new valid players to add.");
            setUploadModalOpen(false);
            setReviewMode(false);
            setFileList([]);
            return;
        }

        try {
            setUploading(true);
            await api.post(`/team/${team._id}/confirm-roster`, { athleteIds });
            message.success("Athletes successfully added to your roster!");
            setUploadModalOpen(false);
            setReviewMode(false);
            setFileList([]);
            fetchRoster();
        } catch (err) {
            message.error(err.response?.data?.message || "Failed to confirm roster updates");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchRoster();
    }, []);

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                        <TeamOutlined className="text-brand-primary" />
                        <span>Team Roster</span>
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">Review active squad members, registration cards, and player profiles.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        icon={<CloudUploadOutlined className="text-xs" />} 
                        onClick={() => {
                            setUploadModalOpen(true);
                            setReviewMode(false);
                            setFileList([]);
                        }}
                        disabled={!team}
                        className="text-xs font-semibold h-9 rounded-md cursor-pointer border border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                    >
                        Bulk Upload
                    </Button>
                    <Button 
                        onClick={fetchRoster} 
                        type="primary" 
                        size="small" 
                        className="text-xs font-semibold h-9 rounded-md cursor-pointer"
                    >
                        Refresh Roster
                    </Button>
                </div>
            </div>

            {/* Roster Cards */}
            {loading ? (
                <div className="py-16 flex justify-center"><Spin size="middle" /></div>
            ) : roster.length === 0 ? (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-16 text-center shadow-sm rounded-xl">
                    <Empty description={<span className="text-text-secondary text-xs">Roster is empty. Approve athletes from Applications to add them to your squad roster!</span>} />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roster.map(mem => {
                        const athlete = mem.athleteId || {};
                        return (
                            <Card 
                                key={mem._id}
                                bordered={false} 
                                className="border border-border-subtle bg-bg-surface shadow-sm hover:border-brand-primary/25 hover:shadow-md transition-all duration-150 rounded-xl"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3.5">
                                        <Avatar size={40} icon={<UserOutlined />} className="bg-brand-primary shrink-0 rounded" />
                                        <div className="min-w-0">
                                            <h3 className="text-xs font-semibold text-text-primary leading-tight truncate">
                                                {athlete.userId?.name || "Roster Player"}
                                            </h3>
                                            <p className="text-[10px] text-text-secondary mt-1 uppercase tracking-wider">
                                                Role: <span className="text-brand-primary font-semibold">{athlete.primaryRole || "N/A"}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats grid */}
                                    <div className="grid grid-cols-3 gap-2 bg-bg-elevated/50 border border-border-subtle p-3 rounded-lg text-[10px]">
                                        <div className="text-center">
                                            <span className="text-text-secondary block uppercase font-semibold text-[8px]">Gender</span>
                                            <span className="text-text-primary font-medium mt-0.5 block capitalize">{athlete.gender || "N/A"}</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-text-secondary block uppercase font-semibold text-[8px]">Height</span>
                                            <span className="text-text-primary font-medium mt-0.5 block">{athlete.height ? `${athlete.height} cm` : "N/A"}</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-text-secondary block uppercase font-semibold text-[8px]">Weight</span>
                                            <span className="text-text-primary font-medium mt-0.5 block">{athlete.weight ? `${athlete.weight} kg` : "N/A"}</span>
                                        </div>
                                    </div>

                                    <div className="bg-bg-elevated/20 border border-border-subtle p-3 rounded-lg text-[11px] space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-text-secondary font-semibold uppercase tracking-wider text-[8px]">Registry Bio</span>
                                        </div>
                                        <p className="text-text-secondary italic line-clamp-2 m-0">
                                            {athlete.bio || "No biography provided by athlete."}
                                        </p>
                                    </div>

                                    <div className="border-t border-border-subtle pt-3.5 flex items-center justify-between text-[10px]">
                                        <span className="text-text-secondary font-semibold uppercase tracking-wider">Joined Roster</span>
                                        <span className="text-text-primary font-semibold">
                                            {mem.joinedAt ? new Date(mem.joinedAt).toLocaleDateString() : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* UPLOAD & REVIEW MODAL */}
            <Modal
                title={<span className="text-xs font-bold uppercase text-text-primary tracking-wider">{reviewMode ? "Review Roster Upload" : "Bulk Upload Squad"}</span>}
                open={uploadModalOpen}
                onCancel={() => {
                    setUploadModalOpen(false);
                    setReviewMode(false);
                    setFileList([]);
                }}
                footer={null}
                width={reviewMode ? 800 : 500}
                centered
            >
                {!reviewMode ? (
                    <div className="mt-4">
                        <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                            Upload a CSV file containing your existing squad members. The file must contain a <strong>name</strong> column. The system will auto-match them against registered athletes.
                        </p>
                        <Upload.Dragger
                            accept=".csv"
                            maxCount={1}
                            fileList={fileList}
                            beforeUpload={(file) => {
                                setFileList([file]);
                                return false; // Manual upload
                            }}
                            onRemove={() => setFileList([])}
                            className="bg-bg-surface/50 border-border-subtle hover:border-brand-primary/50 transition-colors"
                        >
                            <p className="ant-upload-drag-icon text-brand-primary/80">
                                <CloudUploadOutlined />
                            </p>
                            <p className="text-xs font-semibold text-text-primary">Click or drag CSV file here</p>
                            <p className="text-[10px] text-text-secondary mt-1">Accepts .csv format only</p>
                        </Upload.Dragger>

                        <div className="pt-4 border-t border-border-subtle flex justify-end space-x-2 mt-4">
                            <Button onClick={() => setUploadModalOpen(false)} className="text-xs">Cancel</Button>
                            <Button type="primary" onClick={handleUpload} loading={uploading} disabled={fileList.length === 0} className="text-xs font-semibold h-9 rounded-md">Parse File</Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-status-success/10 border border-status-success/20 p-3 rounded-lg">
                                <p className="text-[10px] font-bold text-status-success uppercase tracking-wider mb-1">Matched Players</p>
                                <p className="text-xl font-mono font-bold text-text-primary m-0">{matchedPlayers.length}</p>
                            </div>
                            <div className="bg-status-danger/10 border border-status-danger/20 p-3 rounded-lg">
                                <p className="text-[10px] font-bold text-status-danger uppercase tracking-wider mb-1">Unmatched Rows</p>
                                <p className="text-xl font-mono font-bold text-text-primary m-0">{unmatchedPlayers.length}</p>
                            </div>
                        </div>

                        {matchedPlayers.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2">Ready to Add</h3>
                                <Table 
                                    dataSource={matchedPlayers}
                                    rowKey="athleteId"
                                    pagination={false}
                                    size="small"
                                    scroll={{ y: 200 }}
                                    columns={[
                                        { title: "Name", dataIndex: "name", key: "name", render: t => <span className="text-xs font-semibold">{t}</span> },
                                        { title: "Role", dataIndex: "primaryRole", key: "role", render: t => <span className="text-[10px] text-text-secondary">{t || "-"}</span> },
                                        { title: "Status", key: "status", render: (_, r) => r.alreadyInTeam ? <Tag color="warning" className="text-[9px]">ALREADY IN TEAM</Tag> : <Tag color="success" className="text-[9px]">MATCHED</Tag>}
                                    ]}
                                    className="custom-table border border-border-subtle rounded-lg overflow-hidden"
                                />
                            </div>
                        )}

                        {unmatchedPlayers.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2 text-status-danger">Unmatched Data (Will be skipped)</h3>
                                <Table 
                                    dataSource={unmatchedPlayers.map((u, i) => ({ ...u, key: i }))}
                                    pagination={false}
                                    size="small"
                                    scroll={{ y: 200 }}
                                    columns={[
                                        { title: "Raw Name", key: "rawName", render: (_, r) => <span className="text-[10px] font-mono">{r.rowData?.name || r.rowData?.Name || r.rowData?.NAME || "N/A"}</span> },
                                        { title: "Reason", dataIndex: "reason", key: "reason", render: t => <span className="text-[10px] text-status-danger">{t}</span> }
                                    ]}
                                    className="custom-table border border-border-subtle rounded-lg overflow-hidden"
                                />
                                <p className="text-[10px] text-text-secondary mt-2 italic">
                                    * Unmatched players must first register an account on the Apex platform before they can be added to a roster.
                                </p>
                            </div>
                        )}

                        <div className="pt-4 border-t border-border-subtle flex justify-between items-center mt-4">
                            <Button type="text" onClick={() => { setReviewMode(false); setFileList([]); }} className="text-xs">Upload Different File</Button>
                            <Button 
                                type="primary" 
                                onClick={handleConfirm} 
                                loading={uploading} 
                                disabled={matchedPlayers.filter(m => !m.alreadyInTeam).length === 0}
                                className="text-xs font-semibold h-9 rounded-md bg-status-success hover:bg-status-success/80 border-0"
                                icon={<CheckCircleOutlined />}
                            >
                                Confirm & Add {matchedPlayers.filter(m => !m.alreadyInTeam).length} Players
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
}

export default TeamRoster;
