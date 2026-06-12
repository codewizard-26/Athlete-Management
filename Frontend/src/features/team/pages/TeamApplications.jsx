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
                return <Tag color="success" className="m-0 border-0 font-bold text-[9px]">ACCEPTED</Tag>;
            case "rejected":
                return <Tag color="error" className="m-0 border-0 font-bold text-[9px]">REJECTED</Tag>;
            default:
                return <Tag color="warning" className="m-0 border-0 font-bold text-[9px]">PENDING</Tag>;
        }
    };

    const columns = [
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Athlete Name</span>,
            dataIndex: "athleteId",
            key: "athlete",
            render: (athlete) => (
                <div className="flex items-center space-x-2.5">
                    <Avatar size="small" icon={<UserOutlined />} className="bg-blue-600 shrink-0" />
                    <div>
                        <span className="text-xs font-bold text-white block">{athlete?.userId?.name || "Athlete Candidate"}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{athlete?.gender} • DOB: {athlete?.dob ? new Date(athlete.dob).toLocaleDateString() : "N/A"}</span>
                    </div>
                </div>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Sport Category</span>,
            dataIndex: "athleteId",
            key: "sport",
            render: (athlete) => (
                <Tag color={athlete?.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 font-bold uppercase text-[9px]">
                    {athlete?.sport || "N/A"}
                </Tag>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Primary Role</span>,
            dataIndex: "athleteId",
            key: "role",
            render: (athlete) => <span className="text-xs font-semibold text-slate-300 capitalize">{athlete?.primaryRole || "N/A"}</span>
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Status</span>,
            dataIndex: "status",
            key: "status",
            render: (status) => getStatusTag(status)
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Actions</span>,
            key: "actions",
            render: (_, record) => {
                if (record.status !== "pending") return <span className="text-[10px] text-slate-500 italic">Decision Made</span>;
                return (
                    <div className="flex space-x-2">
                        <Button 
                            type="primary" 
                            size="small" 
                            icon={<CheckOutlined />} 
                            onClick={() => handleAction(record._id, "accept")}
                            loading={actionLoading[record._id]}
                            className="bg-emerald-600 border-0 hover:bg-emerald-500"
                        />
                        <Button 
                            danger 
                            size="small" 
                            icon={<CloseOutlined />} 
                            onClick={() => handleAction(record._id, "reject")}
                            loading={actionLoading[record._id]}
                        />
                    </div>
                );
            }
        }
    ];

    const currentDrive = drives.find(d => d._id === selectedDriveId);

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Header / Nav */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        {driveId && (
                            <Button 
                                type="text" 
                                icon={<ArrowLeftOutlined />} 
                                onClick={() => navigate("/team/recruitment")}
                                className="text-slate-400 hover:text-white mr-1"
                            />
                        )}
                        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                            <NotificationOutlined className="text-blue-500" />
                            <span>Applicant Review</span>
                        </h1>
                    </div>
                    <p className="text-xs text-slate-400">Evaluate trials performance, review bio metrics, and accept roster entries.</p>
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
                <Card bordered={false} className="border border-white/[0.04] bg-[#0b0f19]/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">Selected Campaign</span>
                            <span className="text-xs font-bold text-white mt-1 block">{currentDrive.title}</span>
                        </div>
                        <div className="flex gap-6 text-[10px]">
                            <div>
                                <span className="text-slate-500 font-bold block uppercase tracking-wider">Sport</span>
                                <span className="text-slate-300 font-semibold block capitalize mt-0.5">{currentDrive.sport}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-bold block uppercase tracking-wider">Bracket</span>
                                <span className="text-slate-300 font-semibold block mt-0.5">{currentDrive.ageCategory}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 font-bold block uppercase tracking-wider">Vacancies</span>
                                <span className="text-blue-400 font-bold block mt-0.5">{currentDrive.vacancies} Left</span>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Applicants Table */}
            {loadingApps ? (
                <div className="py-16 flex justify-center"><Spin size="large" /></div>
            ) : applications.length === 0 ? (
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-16 text-center">
                    <Empty description={<span className="text-slate-400 text-xs">No applications submitted for this campaign yet.</span>} />
                </Card>
            ) : (
                <Table 
                    columns={columns} 
                    dataSource={applications.map(a => ({ ...a, key: a._id }))} 
                    className="custom-table border border-white/[0.04] bg-[#0f172a]/30 rounded-xl overflow-hidden shadow-md"
                />
            )}

        </main>
    );
}

export default TeamApplications;
