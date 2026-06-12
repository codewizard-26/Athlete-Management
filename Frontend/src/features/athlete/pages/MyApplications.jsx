import React, { useState, useEffect } from "react";
import { Card, Tag, Avatar, message, Spin, Empty, Button } from "antd";
import { 
    ClockCircleOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined,
    NotificationOutlined,
    UserOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await api.get("/recruitment/my-applications");
            if (res.data) {
                setApplications(res.data);
            }
        } catch (err) {
            console.error("Error fetching my applications:", err);
            message.error("Failed to load applications list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const getStatusTag = (status) => {
        switch (status?.toLowerCase()) {
            case "accepted":
                return <Tag icon={<CheckCircleOutlined />} color="success" className="m-0 border-0 font-bold px-2 py-0.5">ACCEPTED</Tag>;
            case "rejected":
                return <Tag icon={<CloseCircleOutlined />} color="error" className="m-0 border-0 font-bold px-2 py-0.5">REJECTED</Tag>;
            default:
                return <Tag icon={<ClockCircleOutlined />} color="warning" className="m-0 border-0 font-bold px-2 py-0.5">PENDING</Tag>;
        }
    };

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider">My Applications</h1>
                    <p className="text-xs text-slate-400 mt-1">Track the review status of your open trial and squad scouting submissions.</p>
                </div>
                <Button onClick={fetchApplications} type="dashed" size="small" className="hover:border-blue-500 hover:text-blue-400 text-xs">
                    Refresh Status
                </Button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="large" />
                    <p className="text-xs text-slate-400 mt-4">Syncing applications...</p>
                </div>
            ) : applications.length === 0 ? (
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-16 text-center shadow-lg">
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span className="text-slate-400 text-xs">You haven't submitted any applications yet. Browse active recruitment drives to get started!</span>}
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map(app => {
                        const drive = app.recruitmentDriveId || {};
                        const team = drive.teamId || {};

                        return (
                            <Card 
                                key={app._id}
                                bordered={false}
                                className="border border-white/[0.04] bg-[#0f172a]/40 backdrop-blur-sm shadow-md hover:border-white/[0.08] transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3 min-w-0">
                                            {team.logo ? (
                                                <img src={team.logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                                            ) : (
                                                <Avatar size={40} icon={<UserOutlined />} className="bg-blue-600 rounded-lg font-bold shrink-0" />
                                            )}
                                            <div className="min-w-0">
                                                <h3 className="text-xs font-bold text-slate-400 leading-none truncate uppercase tracking-wider">
                                                    {team.teamName || "Apex Squad"}
                                                </h3>
                                                <p className="text-xs font-bold text-white truncate mt-1.5">{drive.title || "Open Recruitment Call"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#0b0f19]/35 border border-white/[0.02] p-4 rounded-xl space-y-3">
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-500 font-bold uppercase tracking-wider">Sport Category</span>
                                            <Tag color="blue" className="m-0 border-0 font-bold uppercase text-[9px]">{drive.sport || "N/A"}</Tag>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-500 font-bold uppercase tracking-wider">Target Age Group</span>
                                            <span className="text-slate-300 font-semibold">{drive.ageCategory || "Senior"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-500 font-bold uppercase tracking-wider">Applied On</span>
                                            <span className="text-slate-300 font-semibold">
                                                {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Review Status</span>
                                        {getStatusTag(app.status)}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

        </main>
    );
}

export default MyApplications;
