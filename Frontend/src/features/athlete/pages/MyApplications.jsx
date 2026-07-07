import React, { useState, useEffect } from "react";
import { Card, Tag, Avatar, message, Spin, Empty, Button } from "antd";
import { 
    ClockCircleOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined,
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
                return <Tag icon={<CheckCircleOutlined className="text-xs" />} color="success" className="m-0 border-0 font-semibold px-2.5 py-0.5 rounded text-[10px]">ACCEPTED</Tag>;
            case "rejected":
                return <Tag icon={<CloseCircleOutlined className="text-xs" />} color="error" className="m-0 border-0 font-semibold px-2.5 py-0.5 rounded text-[10px]">REJECTED</Tag>;
            default:
                return <Tag icon={<ClockCircleOutlined className="text-xs" />} color="warning" className="m-0 border-0 font-semibold px-2.5 py-0.5 rounded text-[10px]">PENDING</Tag>;
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight">My Applications</h1>
                    <p className="text-xs text-text-secondary mt-0.5">Track the review status of your trial and squad scouting submissions.</p>
                </div>
                <Button 
                    onClick={fetchApplications} 
                    type="text" 
                    size="small" 
                    className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium cursor-pointer"
                >
                    Refresh Status
                </Button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="middle" />
                    <p className="text-xs text-text-secondary mt-3">Syncing applications...</p>
                </div>
            ) : applications.length === 0 ? (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-16 text-center shadow-sm rounded-xl">
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span className="text-text-secondary text-xs">You haven't submitted any applications yet. Browse active recruitment drives to get started!</span>}
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
                                className="border border-border-subtle bg-bg-surface shadow-sm hover:border-brand-primary/20 hover:shadow-md transition-all duration-150 rounded-xl flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3 min-w-0">
                                            {(team.logo?.url || (typeof team.logo === "string" && team.logo)) ? (
                                                <img src={.logo?.url || .logo} alt="Logo" className="w-9 h-9 rounded object-cover border border-border-subtle shrink-0" />
                                            ) : (
                                                <Avatar size={36} icon={<UserOutlined />} className="bg-brand-primary rounded font-bold shrink-0" />
                                            )}
                                            <div className="min-w-0">
                                                <h3 className="text-[10px] font-bold text-text-secondary leading-none truncate uppercase tracking-wider">
                                                    {team.teamName || "Apex Squad"}
                                                </h3>
                                                <p className="text-xs font-semibold text-text-primary truncate mt-1.5">{drive.title || "Open Recruitment Call"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-bg-elevated/50 border border-border-subtle p-3.5 rounded-lg space-y-2.5">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-text-secondary font-medium uppercase tracking-wider text-[9px]">Sport Category</span>
                                            <span className="text-text-primary font-semibold uppercase text-[10px]">{drive.sport || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-text-secondary font-medium uppercase tracking-wider text-[9px]">Target Age Group</span>
                                            <span className="text-text-primary font-semibold">{drive.ageCategory || "Senior"}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-text-secondary font-medium uppercase tracking-wider text-[9px]">Applied On</span>
                                            <span className="text-text-primary font-semibold">
                                                {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border-subtle pt-3.5 mt-2">
                                        <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">Review Status</span>
                                        {getStatusTag(app.status)}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyApplications;
