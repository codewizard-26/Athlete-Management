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
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                        <NotificationOutlined className="text-blue-500" />
                        <span>Recruitment Campaigns</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Manage open trials, view applicant counts, and review submissions.</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate("/team/recruitment/create")}
                    className="shadow-lg shadow-blue-600/10 font-bold text-xs"
                >
                    Launch Campaign
                </Button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="large" />
                    <p className="text-xs text-slate-400 mt-4">Syncing recruitment database...</p>
                </div>
            ) : drives.length === 0 ? (
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-16 text-center">
                    <Empty description={<span className="text-slate-400 text-xs">No active recruitment drives created by your team.</span>} />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drives.map(drive => (
                        <Card 
                            key={drive._id}
                            bordered={false} 
                            className="border border-white/[0.04] bg-[#0f172a]/40 backdrop-blur-sm shadow-md hover:border-blue-500/20 transition-all flex flex-col justify-between"
                        >
                            <div className="space-y-4 flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm font-black text-white truncate max-w-[70%]">{drive.title}</h3>
                                    <Tag color={drive.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 font-bold uppercase text-[9px]">
                                        {drive.sport}
                                    </Tag>
                                </div>

                                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                                    {drive.description}
                                </p>

                                <div className="bg-[#0b0f19]/40 border border-white/[0.03] p-3 rounded-lg text-[10px] space-y-2.5">
                                    <div className="flex items-center text-slate-300">
                                        <EnvironmentOutlined className="mr-2 text-blue-500 shrink-0" />
                                        <span className="truncate">{drive.location}</span>
                                    </div>
                                    <div className="flex items-center text-slate-300">
                                        <CalendarOutlined className="mr-2 text-emerald-500 shrink-0" />
                                        <span>Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-300">
                                        <span className="flex items-center">
                                            <TeamOutlined className="mr-2 text-purple-500 shrink-0" />
                                            <span>Age Bracket:</span>
                                        </span>
                                        <span className="font-extrabold text-blue-400">{drive.ageCategory}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="mt-5 border-t border-white/[0.03] pt-4">
                                <Button 
                                    type="primary" 
                                    icon={<EyeOutlined />}
                                    onClick={() => navigate(`/team/applications/${drive._id}`)}
                                    className="w-full text-xs h-9 font-bold tracking-wider"
                                >
                                    Review Applications
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

        </main>
    );
}

export default RecruitmentDrives;
