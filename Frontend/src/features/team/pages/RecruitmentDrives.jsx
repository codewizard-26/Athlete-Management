import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Tag, Spin, Empty, message } from "antd";
import { 
    NotificationOutlined, 
    CalendarOutlined, 
    EnvironmentOutlined, 
    TeamOutlined, 
    PlusOutlined, 
    EyeOutlined 
} from "@ant-design/icons";
import api from "../../../api/axios";

function RecruitmentDrives() {
    const navigate = useNavigate();
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyDrives = async () => {
        try {
            setLoading(true);
            const res = await api.get("/recruitment/my-drives");
            if (res.data) {
                setDrives(res.data);
            }
        } catch (err) {
            console.error("Error fetching team drives:", err);
            message.error("Failed to load recruitment drives");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDrives();
    }, []);

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                        <NotificationOutlined className="text-brand-primary" />
                        <span>Recruitment Campaigns</span>
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">Manage open trials, view applicant counts, and review submissions.</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined className="text-xs" />} 
                    onClick={() => navigate("/team/recruitment/create")}
                    className="text-xs font-semibold h-9 rounded-md cursor-pointer"
                >
                    Launch Campaign
                </Button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="middle" />
                    <p className="text-xs text-text-secondary mt-3">Syncing recruitment database...</p>
                </div>
            ) : drives.length === 0 ? (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-16 text-center shadow-sm rounded-xl">
                    <Empty description={<span className="text-text-secondary text-xs">No active recruitment drives created by your team.</span>} />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drives.map(drive => (
                        <Card 
                            key={drive._id}
                            bordered={false} 
                            className="border border-border-subtle bg-bg-surface shadow-sm hover:border-brand-primary/25 transition-all duration-150 flex flex-col justify-between rounded-xl group"
                        >
                            <div className="space-y-4 flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xs font-semibold text-text-primary truncate max-w-[70%]">{drive.title}</h3>
                                    <Tag color={drive.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 font-semibold uppercase text-[9px]">
                                        {drive.sport}
                                    </Tag>
                                </div>

                                <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                                    {drive.description}
                                </p>

                                <div className="bg-bg-elevated/50 border border-border-subtle p-3.5 rounded-lg text-[11px] space-y-2.5">
                                    <div className="flex items-center text-text-primary">
                                        <EnvironmentOutlined className="mr-2 text-brand-primary shrink-0 text-[10px]" />
                                        <span className="truncate">{drive.location}</span>
                                    </div>
                                    <div className="flex items-center text-text-primary">
                                        <CalendarOutlined className="mr-2 text-brand-secondary shrink-0 text-[10px]" />
                                        <span>Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-text-primary">
                                        <span className="flex items-center">
                                            <TeamOutlined className="mr-2 text-brand-primary shrink-0 text-[10px]" />
                                            <span>Age Bracket:</span>
                                        </span>
                                        <span className="font-semibold text-brand-primary">{drive.ageCategory}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="mt-5 border-t border-border-subtle pt-4">
                                <Button 
                                    type="primary" 
                                    icon={<EyeOutlined className="text-xs" />}
                                    onClick={() => navigate(`/team/applications/${drive._id}`)}
                                    className="w-full text-xs h-9 font-semibold cursor-pointer"
                                >
                                    Review Applications
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

        </div>
    );
}

export default RecruitmentDrives;
