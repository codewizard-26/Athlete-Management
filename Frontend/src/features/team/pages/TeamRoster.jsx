import React, { useState, useEffect } from "react";
import { Card, Avatar, Tag, Spin, Empty, Button } from "antd";
import { UserOutlined, TeamOutlined, TrophyOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

function TeamRoster() {
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRoster = async () => {
        try {
            setLoading(true);
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

    useEffect(() => {
        fetchRoster();
    }, []);

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                        <TeamOutlined className="text-blue-500" />
                        <span>Team Roster</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Review active squad members, registration cards, and player profiles.</p>
                </div>
                <Button onClick={fetchRoster} type="dashed" size="small" className="hover:border-blue-500 hover:text-blue-400 text-xs">
                    Refresh Roster
                </Button>
            </div>

            {/* Roster Cards */}
            {loading ? (
                <div className="py-16 flex justify-center"><Spin size="large" /></div>
            ) : roster.length === 0 ? (
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-16 text-center">
                    <Empty description={<span className="text-slate-400 text-xs">Roster is empty. Approve athletes from Applications to add them to your squad roster!</span>} />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roster.map(mem => {
                        const athlete = mem.athleteId || {};
                        return (
                            <Card 
                                key={mem._id}
                                bordered={false} 
                                className="border border-white/[0.04] bg-[#0f172a]/40 backdrop-blur-sm shadow-md hover:border-blue-500/25 transition-all"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3.5">
                                        <Avatar size={48} icon={<UserOutlined />} className="bg-blue-600 font-bold shrink-0" />
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-black text-white leading-tight truncate">
                                                {athlete.userId?.name || "Roster Player"}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                                                Role: <span className="text-blue-400 font-bold">{athlete.primaryRole || "N/A"}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats grid */}
                                    <div className="grid grid-cols-3 gap-2 bg-[#0b0f19]/40 border border-white/[0.03] p-3 rounded-lg text-[9px]">
                                        <div className="text-center">
                                            <span className="text-slate-500 block uppercase font-bold text-[8px]">Gender</span>
                                            <span className="text-slate-300 font-semibold mt-0.5 block capitalize">{athlete.gender || "N/A"}</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-slate-500 block uppercase font-bold text-[8px]">Height</span>
                                            <span className="text-slate-300 font-semibold mt-0.5 block">{athlete.height ? `${athlete.height} cm` : "N/A"}</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-slate-500 block uppercase font-bold text-[8px]">Weight</span>
                                            <span className="text-slate-300 font-semibold mt-0.5 block">{athlete.weight ? `${athlete.weight} kg` : "N/A"}</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#0b0f19]/25 border border-white/[0.02] p-3 rounded-lg text-[10px] space-y-2">
                                        <div className="flex justify-between items-center text-[10px]">
                                            <span className="text-slate-500 font-bold uppercase tracking-wider">Registry Bio</span>
                                        </div>
                                        <p className="text-slate-400 italic line-clamp-2">
                                            {athlete.bio || "No biography provided by athlete."}
                                        </p>
                                    </div>

                                    <div className="border-t border-white/[0.04] pt-4 flex items-center justify-between text-[10px]">
                                        <span className="text-slate-500 font-bold uppercase tracking-wider">Joined Roster</span>
                                        <span className="text-slate-300 font-semibold">
                                            {mem.joinedAt ? new Date(mem.joinedAt).toLocaleDateString() : "N/A"}
                                        </span>
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

export default TeamRoster;
