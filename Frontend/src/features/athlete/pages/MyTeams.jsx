import React, { useState, useEffect } from "react";
import { Card, Tag, Avatar, message, Spin, Empty, Button, Tabs } from "antd";
import { 
    UserOutlined, 
    TeamOutlined, 
    TrophyOutlined, 
    EnvironmentOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function MyTeams() {
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMemberships = async () => {
        try {
            setLoading(true);
            const res = await api.get("/team/my-memberships");
            if (res.data) {
                setMemberships(res.data);
            }
        } catch (err) {
            console.error("Error fetching my teams:", err);
            message.error("Failed to load team rosters");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemberships();
    }, []);

    const activeTeams = memberships.filter(m => m.status === "active");
    const pendingTeams = memberships.filter(m => m.status === "pending" || m.status === "requested");

    const renderTeamGrid = (list, type) => {
        if (list.length === 0) {
            return (
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-12 text-center">
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span className="text-slate-400 text-xs">No teams found in this category.</span>} 
                    />
                </Card>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map(mem => {
                    const team = mem.teamId || {};
                    return (
                        <Card 
                            key={mem._id}
                            bordered={false} 
                            className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md hover:border-blue-500/20 transition-all"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3 min-w-0">
                                        {team.logo ? (
                                            <img src={team.logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                                        ) : (
                                            <Avatar size={40} icon={<TeamOutlined />} className="bg-blue-600 rounded-lg font-bold shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-white leading-tight truncate">{team.teamName || "Apex Squad"}</h3>
                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">Category: {team.ageCategory}</p>
                                        </div>
                                    </div>
                                    <Tag color={team.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 font-bold uppercase text-[9px]">
                                        {team.sport}
                                    </Tag>
                                </div>

                                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                                    {team.description || "No squad description provided by the manager."}
                                </p>

                                <div className="border-t border-white/[0.04] pt-4 flex items-center justify-between text-[10px]">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider">
                                        {type === "active" ? "Member Since" : "Applied Date"}
                                    </span>
                                    <span className="text-slate-300 font-semibold">
                                        {new Date(mem.joinedAt || mem.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Status</span>
                                    {type === "active" ? (
                                        <Tag icon={<CheckCircleOutlined />} color="success" className="m-0 border-0 font-bold px-2 py-0.5">ACTIVE MEMBER</Tag>
                                    ) : (
                                        <Tag icon={<ClockCircleOutlined />} color="warning" className="m-0 border-0 font-bold px-2 py-0.5">PENDING APPROVAL</Tag>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        );
    };

    const tabItems = [
        {
            key: "active",
            label: <span className="font-bold text-xs">Active Rosters ({activeTeams.length})</span>,
            children: renderTeamGrid(activeTeams, "active")
        },
        {
            key: "pending",
            label: <span className="font-bold text-xs">Pending Join Requests ({pendingTeams.length})</span>,
            children: renderTeamGrid(pendingTeams, "pending")
        }
    ];

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider">My Teams</h1>
                    <p className="text-xs text-slate-400 mt-1">Review squad memberships and follow pending roster recruitment decisions.</p>
                </div>
                <Button onClick={fetchMemberships} type="dashed" size="small" className="hover:border-blue-500 hover:text-blue-400 text-xs">
                    Refresh Teams
                </Button>
            </div>

            {/* Content Tabs */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="large" />
                    <p className="text-xs text-slate-400 mt-4">Syncing squad rosters...</p>
                </div>
            ) : (
                <Tabs items={tabItems} className="custom-tabs" />
            )}

        </main>
    );
}

export default MyTeams;
