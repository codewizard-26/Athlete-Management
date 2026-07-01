import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Table, Button, Select, Tag, Avatar, message, Spin, Empty } from "antd";
import { 
    CheckOutlined, 
    CloseOutlined, 
    UserOutlined, 
    NotificationOutlined, 
    ArrowLeftOutlined 
} from "@ant-design/icons";
import api from "../../../api/axios";

const { Option } = Select;

function TeamApplications() {
    const { driveId } = useParams();
    const navigate = useNavigate();

    const [drives, setDrives] = useState([]);
    const [selectedDriveId, setSelectedDriveId] = useState(driveId || null);
    const [applications, setApplications] = useState([]);
    
    const [loadingDrives, setLoadingDrives] = useState(false);
    const [loadingApps, setLoadingApps] = useState(false);
    const [actionLoading, setActionLoading] = useState({});

    // Fetch team drives to show in selector if driveId is not in URL
    const fetchTeamDrives = async () => {
        try {
            setLoadingDrives(true);
            const res = await api.get("/recruitment/my-drives");
            if (res.data) {
                setDrives(res.data);
                if (!selectedDriveId && res.data.length > 0) {
                    setSelectedDriveId(res.data[0]._id);
                }
            }
        } catch (err) {
            console.error("Error fetching team drives:", err);
            message.error("Failed to load recruitment campaigns");
        } finally {
            setLoadingDrives(false);
        }
    };

    const fetchApplications = async (id) => {
        if (!id) return;
        try {
            setLoadingApps(true);
            const res = await api.get(`/recruitment/applications/${id}`);
            if (res.data) {
                setApplications(res.data);
            }
        } catch (err) {
            console.error("Error fetching drive applications:", err);
            message.error("Failed to load applications");
        } finally {
            setLoadingApps(false);
        }
    };

    useEffect(() => {
        fetchTeamDrives();
    }, []);

    useEffect(() => {
        if (selectedDriveId) {
            fetchApplications(selectedDriveId);
        }
    }, [selectedDriveId]);

    const handleAction = async (applicationId, action) => {
        try {
            setActionLoading(prev => ({ ...prev, [applicationId]: true }));
            const res = await api.put(`/recruitment/${action}/${applicationId}`);
            message.success(res.data?.message || `Application successfully ${action}ed!`);
            if (selectedDriveId) {
                fetchApplications(selectedDriveId);
            }
        } catch (err) {
            console.error(`Error updating application to ${action}:`, err);
            message.error(err.response?.data?.message || `Failed to update application`);
        } finally {
            setActionLoading(prev => ({ ...prev, [applicationId]: false }));
        }
    };

    const getStatusTag = (status) => {
        switch (status?.toLowerCase()) {
            case "accepted":
                return <Tag color="success" className="m-0 border-0 font-semibold text-[9px] px-2 py-0.5 rounded">ACCEPTED</Tag>;
            case "rejected":
                return <Tag color="error" className="m-0 border-0 font-semibold text-[9px] px-2 py-0.5 rounded">REJECTED</Tag>;
            default:
                return <Tag color="warning" className="m-0 border-0 font-semibold text-[9px] px-2 py-0.5 rounded">PENDING</Tag>;
        }
    };

    const columns = [
        {
            title: "ATHLETE NAME",
            dataIndex: "athleteId",
            key: "athlete",
            render: (athlete) => (
                <div className="flex items-center space-x-2.5">
                    <Avatar size={24} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                    <div>
                        <span className="text-xs font-semibold text-text-primary block">{athlete?.userId?.name || "Athlete Candidate"}</span>
                        <span className="text-[10px] text-text-secondary capitalize">{athlete?.gender} • DOB: {athlete?.dob ? new Date(athlete.dob).toLocaleDateString() : "N/A"}</span>
                    </div>
                </div>
            )
        },
        {
            title: "SPORT CATEGORY",
            dataIndex: "athleteId",
            key: "sport",
            render: (athlete) => (
                <Tag color={athlete?.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 font-semibold uppercase text-[9px]">
                    {athlete?.sport || "N/A"}
                </Tag>
            )
        },
        {
            title: "PRIMARY ROLE",
            dataIndex: "athleteId",
            key: "role",
            render: (athlete) => <span className="text-xs font-medium text-text-secondary capitalize">{athlete?.primaryRole || "N/A"}</span>
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            render: (status) => getStatusTag(status)
        },
        {
            title: "ACTIONS",
            key: "actions",
            render: (_, record) => {
                if (record.status !== "pending") return <span className="text-xs text-text-secondary italic font-medium">Decision Made</span>;
                return (
                    <div className="flex space-x-2">
                        <Button 
                            type="primary" 
                            size="small" 
                            icon={<CheckOutlined className="text-xs" />} 
                            onClick={() => handleAction(record._id, "accept")}
                            loading={actionLoading[record._id]}
                            className="bg-status-success border-0 hover:bg-status-success/80 h-7 w-7 cursor-pointer flex items-center justify-center"
                        />
                        <Button 
                            danger 
                            size="small" 
                            icon={<CloseOutlined className="text-xs" />} 
                            onClick={() => handleAction(record._id, "reject")}
                            loading={actionLoading[record._id]}
                            className="h-7 w-7 cursor-pointer flex items-center justify-center"
                        />
                    </div>
                );
            }
        }
    ];

    const currentDrive = drives.find(d => d._id === selectedDriveId);

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header / Nav */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        {driveId && (
                            <Button 
                                type="text" 
                                icon={<ArrowLeftOutlined className="text-xs" />} 
                                onClick={() => navigate("/team/recruitment")}
                                className="text-text-secondary hover:text-text-primary mr-1 p-0 h-auto cursor-pointer"
                            />
                        )}
                        <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                            <NotificationOutlined className="text-brand-primary" />
                            <span>Applicant Review</span>
                        </h1>
                    </div>
                    <p className="text-xs text-text-secondary">Evaluate trials performance, review bio metrics, and accept roster entries.</p>
                </div>

                {/* Drive Selector if direct access */}
                {!driveId && drives.length > 0 && (
                    <div className="w-full sm:w-64">
                        <Select 
                            value={selectedDriveId} 
                            onChange={setSelectedDriveId}
                            className="w-full"
                            loading={loadingDrives}
                        >
                            {drives.map(d => (
                                <Option key={d._id} value={d._id}>{d.title}</Option>
                            ))}
                        </Select>
                    </div>
                )}
            </div>

            {/* Campaign Summary Sub-card */}
            {currentDrive && (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface p-4 rounded-xl shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="text-[9px] text-text-secondary uppercase font-semibold tracking-wider block">Selected Campaign</span>
                            <span className="text-xs font-bold text-text-primary mt-1 block">{currentDrive.title}</span>
                        </div>
                        <div className="flex gap-6 text-xs">
                            <div>
                                <span className="text-text-secondary font-semibold block uppercase tracking-wider text-[9px]">Sport</span>
                                <span className="text-text-primary font-medium block capitalize mt-0.5">{currentDrive.sport}</span>
                            </div>
                            <div>
                                <span className="text-text-secondary font-semibold block uppercase tracking-wider text-[9px]">Bracket</span>
                                <span className="text-text-primary font-medium block mt-0.5">{currentDrive.ageCategory}</span>
                            </div>
                            <div>
                                <span className="text-text-secondary font-semibold block uppercase tracking-wider text-[9px]">Vacancies</span>
                                <span className="text-brand-primary font-semibold block mt-0.5">{currentDrive.vacancies} Left</span>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Applicants Table */}
            {loadingApps ? (
                <div className="py-16 flex justify-center"><Spin size="middle" /></div>
            ) : applications.length === 0 ? (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-16 text-center shadow-sm rounded-xl">
                    <Empty description={<span className="text-text-secondary text-xs">No applications submitted for this campaign yet.</span>} />
                </Card>
            ) : (
                <Table 
                    columns={columns} 
                    dataSource={applications.map(a => ({ ...a, key: a._id }))} 
                    className="custom-table border border-border-subtle bg-bg-surface rounded-xl overflow-hidden shadow-sm"
                    pagination={{ pageSize: 8 }}
                    size="small"
                />
            )}

        </div>
    );
}

export default TeamApplications;
