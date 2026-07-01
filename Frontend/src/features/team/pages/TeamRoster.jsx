import React, { useState, useEffect } from "react";
import { Card, Avatar, Spin, Empty, Button } from "antd";
import { UserOutlined, TeamOutlined } from "@ant-design/icons";
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
                <Button 
                    onClick={fetchRoster} 
                    type="text" 
                    size="small" 
                    className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium cursor-pointer"
                >
                    Refresh Roster
                </Button>
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

        </div>
    );
}

export default TeamRoster;
