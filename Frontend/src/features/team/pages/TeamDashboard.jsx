import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Card, Statistic, Timeline, Button, Tag, Avatar, message } from "antd";
import { 
    TeamOutlined, 
    NotificationOutlined, 
    SolutionOutlined, 
    CalendarOutlined, 
    ArrowRightOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    PlayCircleOutlined,
    UserAddOutlined,
    PlusOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function TeamDashboard() {
    const navigate = useNavigate();
    const { teamData } = useOutletContext(); // Retrieve team detail state shared from Layout

    const [stats, setStats] = useState({
        members: 0,
        pendingRequests: 0,
        drivesCount: 0,
        matchesCount: 0,
        activities: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const res = await api.get("/dashboard/team");
                if (isMounted && res.data) {
                    setStats(res.data);
                }
            } catch (err) {
                console.error("Error fetching team dashboard stats:", err);
                message.error("Failed to fetch dashboard metrics");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Helper to format timestamps relative to current time
    const getRelativeTimeString = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 30) return `${diffDays} days ago`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Format timeline items dynamically
    const getTimelineItems = () => {
        if (!stats.activities || stats.activities.length === 0) {
            // Return visual sports actions as fallback if database has zero logs
            return [
                {
                    color: "blue",
                    children: (
                        <div>
                            <span className="font-bold text-white text-xs">Platform Onboarding Completed</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                Team profile initialized successfully under parent organization • Just now
                            </p>
                        </div>
                    )
                }
            ];
        }

        return stats.activities.map((act) => {
            let color = "blue";
            if (act.type === "membership") {
                color = act.description.includes("ACTIVE") ? "green" : "orange";
            } else if (act.type === "application") {
                color = "purple";
            }

            return {
                color: color,
                children: (
                    <div key={act.id}>
                        <span className="font-bold text-white text-xs">{act.title}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                            {act.description} • {getRelativeTimeString(act.date)}
                        </p>
                    </div>
                )
            };
        });
    };

    const handleActionClick = (section) => {
        message.info(`${section} workspace is under development`);
    };

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* SECTION 1 — Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/50 via-slate-900/30 to-[#0f172a]/60 border border-blue-500/15 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Welcome Back, {teamData?.teamName || "Coach"}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                        Manage your squad, recruitment drives, athlete applications, and performance tracking.
                    </p>
                </div>
                {teamData && (
                    <div className="shrink-0 flex items-center space-x-3 bg-blue-500/10 border border-blue-500/20 px-4 py-3 rounded-xl">
                        <Avatar size="large" src={teamData.logo} icon={<TeamOutlined />} className="bg-blue-600" />
                        <div>
                            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black leading-none">Category</p>
                            <p className="text-xs font-bold text-white mt-1 leading-none">{teamData.ageCategory}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 2 — Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md hover:border-blue-500/20 transition-all">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Players</span>}
                        value={loading ? "..." : stats.members} 
                        valueStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                        prefix={<TeamOutlined className="text-blue-400 mr-2 text-lg" />}
                    />
                </Card>

                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md hover:border-purple-500/20 transition-all">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recruitment Drives</span>}
                        value={loading ? "..." : stats.drivesCount} 
                        valueStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                        prefix={<NotificationOutlined className="text-purple-400 mr-2 text-lg" />}
                    />
                </Card>

                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md hover:border-orange-500/20 transition-all">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Applications</span>}
                        value={loading ? "..." : stats.pendingRequests} 
                        valueStyle={{ color: '#fb923c', fontWeight: 'bold' }}
                        prefix={<SolutionOutlined className="text-orange-400 mr-2 text-lg" />}
                    />
                </Card>

                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md hover:border-emerald-500/20 transition-all">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matches Played</span>}
                        value={loading ? "..." : stats.matchesCount} 
                        valueStyle={{ color: '#34d399', fontWeight: 'bold' }}
                        prefix={<CalendarOutlined className="text-emerald-400 mr-2 text-lg" />}
                    />
                </Card>
            </div>

            {/* SECTION 3 — Quick Actions */}
            <div className="space-y-4">
                <h2 className="text-xs font-bold text-slate-300 tracking-wider uppercase border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                    <PlayCircleOutlined className="text-blue-500" />
                    <span>Quick Actions</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Action 1 */}
                    <div 
                        onClick={() => handleActionClick("Create Recruitment Drive")}
                        className="p-5 bg-[#0f172a]/45 border border-white/[0.04] rounded-xl hover:border-purple-500/40 hover:bg-[#0f172a]/70 transition-all duration-300 shadow-md cursor-pointer flex flex-col space-y-3 group"
                    >
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                            <NotificationOutlined className="text-lg text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
                                <span>Create Recruitment Drive</span>
                                <ArrowRightOutlined className="text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Launch scouting campaigns for position vacancies.</p>
                        </div>
                    </div>

                    {/* Action 2 */}
                    <div 
                        onClick={() => handleActionClick("View Applications")}
                        className="p-5 bg-[#0f172a]/45 border border-white/[0.04] rounded-xl hover:border-orange-500/40 hover:bg-[#0f172a]/70 transition-all duration-300 shadow-md cursor-pointer flex flex-col space-y-3 group"
                    >
                        <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                            <SolutionOutlined className="text-lg text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                                <span>View Applications</span>
                                <ArrowRightOutlined className="text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Review incoming athlete trials and registrations.</p>
                        </div>
                    </div>

                    {/* Action 3 */}
                    <div 
                        onClick={() => handleActionClick("Manage Roster")}
                        className="p-5 bg-[#0f172a]/45 border border-white/[0.04] rounded-xl hover:border-blue-500/40 hover:bg-[#0f172a]/70 transition-all duration-300 shadow-md cursor-pointer flex flex-col space-y-3 group"
                    >
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                            <TeamOutlined className="text-lg text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                                <span>Manage Roster</span>
                                <ArrowRightOutlined className="text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Update squad player lists and manage player status.</p>
                        </div>
                    </div>

                    {/* Action 4 */}
                    <div 
                        onClick={() => handleActionClick("View Team Performance")}
                        className="p-5 bg-[#0f172a]/45 border border-white/[0.04] rounded-xl hover:border-emerald-500/40 hover:bg-[#0f172a]/70 transition-all duration-300 shadow-md cursor-pointer flex flex-col space-y-3 group"
                    >
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                            <CalendarOutlined className="text-lg text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                                <span>View Team Performance</span>
                                <ArrowRightOutlined className="text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Track analytics, scores, and individual logs.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* SECTION 4 — Recent Activity & SECTION 5 — Team Information */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* SECTION 5 — Team Information */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold text-slate-300 tracking-wider uppercase border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                            <InfoCircleOutlined className="text-blue-500" />
                            <span>Team Information</span>
                        </h2>
                        {teamData ? (
                            <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 backdrop-blur-sm p-4 shadow-lg">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="flex flex-col space-y-1 bg-[#0b0f19]/40 border border-white/[0.03] p-4 rounded-xl">
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Team Name</span>
                                        <span className="text-sm font-extrabold text-white">{teamData.teamName}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1 bg-[#0b0f19]/40 border border-white/[0.03] p-4 rounded-xl">
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Sport Category</span>
                                        <span className="text-sm font-extrabold text-blue-400 uppercase tracking-wide">{teamData.sport}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1 bg-[#0b0f19]/40 border border-white/[0.03] p-4 rounded-xl">
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Age Group Limit</span>
                                        <span className="text-sm font-extrabold text-emerald-400">{teamData.ageCategory}</span>
                                    </div>
                                </div>
                                <div className="mt-6 bg-[#0b0f19]/30 border border-white/[0.03] p-5 rounded-xl">
                                    <h3 className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-2">Workspace Description</h3>
                                    <p className="text-xs text-slate-300 leading-relaxed italic">
                                        {teamData.description || "No description set. Edit your team details in Organization settings to describe the squad values, schedule, and home venue details."}
                                    </p>
                                </div>
                            </Card>
                        ) : (
                            <Card bordered={false} loading className="border border-white/[0.04] bg-[#0f172a]/25" />
                        )}
                    </div>

                    {/* SECTION 4 — Recent Activity */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold text-slate-300 tracking-wider uppercase border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                            <ClockCircleOutlined className="text-blue-500" />
                            <span>Recent Activity</span>
                        </h2>
                        <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 backdrop-blur-sm p-4 sm:p-6 shadow-md">
                            <Timeline items={getTimelineItems()} className="custom-timeline mt-2" />
                        </Card>
                    </div>

                </div>

                {/* SECTION 6 — Upcoming Actions Placeholders */}
                <div className="space-y-6">
                    <h2 className="text-xs font-bold text-slate-300 tracking-wider uppercase border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                        <CheckCircleOutlined className="text-blue-500" />
                        <span>Upcoming Actions</span>
                    </h2>

                    {/* 1. Open Recruitment Drives */}
                    <Card 
                        title={<span className="text-xs font-extrabold text-white tracking-wide uppercase">Open Recruitment Drives</span>} 
                        bordered={false} 
                        className="border border-white/[0.04] bg-[#0f172a]/30"
                        headStyle={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                        extra={<Tag color="purple" className="m-0 border-0 font-bold text-[9px]">ACTIVE</Tag>}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0b0f19]/45 border border-white/[0.02]">
                                <div>
                                    <p className="text-xs font-bold text-white">Elite Trial Call</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5">Expires: Aug 12, 2026</p>
                                </div>
                                <span className="text-[10px] text-purple-400 font-bold">2 Vacancies</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0b0f19]/45 border border-white/[0.02]">
                                <div>
                                    <p className="text-xs font-bold text-white">Junior Roster Search</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5">Expires: Sep 30, 2026</p>
                                </div>
                                <span className="text-[10px] text-purple-400 font-bold">5 Vacancies</span>
                            </div>
                            <Button 
                                type="dashed" 
                                size="small" 
                                icon={<PlusOutlined />} 
                                onClick={() => handleActionClick("Add Campaign")}
                                className="w-full text-xs hover:border-purple-500 hover:text-purple-400"
                            >
                                New Drive
                            </Button>
                        </div>
                    </Card>

                    {/* 2. Pending Applications */}
                    <Card 
                        title={<span className="text-xs font-extrabold text-white tracking-wide uppercase">Pending Applications</span>} 
                        bordered={false} 
                        className="border border-white/[0.04] bg-[#0f172a]/30"
                        headStyle={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                        extra={<Tag color="orange" className="m-0 border-0 font-bold text-[9px]">{stats.pendingRequests} REVIEW</Tag>}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#0b0f19]/45 border border-white/[0.02]">
                                <Avatar size="small" icon={<UserAddOutlined />} className="bg-orange-500" />
                                <div className="flex-grow min-w-0">
                                    <p className="text-xs font-bold text-white truncate">Ethan Hunt</p>
                                    <p className="text-[9px] text-slate-400 truncate">Football • Age: 17 • Midfielder</p>
                                </div>
                                <span className="text-[9px] text-slate-500 font-bold shrink-0">1h ago</span>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#0b0f19]/45 border border-white/[0.02]">
                                <Avatar size="small" icon={<UserAddOutlined />} className="bg-orange-500" />
                                <div className="flex-grow min-w-0">
                                    <p className="text-xs font-bold text-white truncate">Chloe Frazer</p>
                                    <p className="text-[9px] text-slate-400 truncate">Football • Age: 16 • Striker</p>
                                </div>
                                <span className="text-[9px] text-slate-500 font-bold shrink-0">1d ago</span>
                            </div>
                            <Button 
                                type="dashed" 
                                size="small" 
                                onClick={() => handleActionClick("Review Applications")}
                                className="w-full text-xs hover:border-orange-500 hover:text-orange-400"
                            >
                                View All Applications
                            </Button>
                        </div>
                    </Card>

                    {/* 3. Recent Team Members */}
                    <Card 
                        title={<span className="text-xs font-extrabold text-white tracking-wide uppercase">Recent Team Members</span>} 
                        bordered={false} 
                        className="border border-white/[0.04] bg-[#0f172a]/30"
                        headStyle={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                        extra={<Tag color="green" className="m-0 border-0 font-bold text-[9px]">NEW</Tag>}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0b0f19]/45 border border-white/[0.02]">
                                <div className="flex items-center space-x-3">
                                    <Avatar size="small" className="bg-emerald-600 font-bold text-xs">NL</Avatar>
                                    <div>
                                        <p className="text-xs font-bold text-white">Nate Logan</p>
                                        <p className="text-[9px] text-slate-400 mt-0.5">Defender</p>
                                    </div>
                                </div>
                                <span className="text-[9px] text-emerald-400 font-bold">Approved</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0b0f19]/45 border border-white/[0.02]">
                                <div className="flex items-center space-x-3">
                                    <Avatar size="small" className="bg-emerald-600 font-bold text-xs">SK</Avatar>
                                    <div>
                                        <p className="text-xs font-bold text-white">Sana Khan</p>
                                        <p className="text-[9px] text-slate-400 mt-0.5">Goalkeeper</p>
                                    </div>
                                </div>
                                <span className="text-[9px] text-emerald-400 font-bold">Approved</span>
                            </div>
                            <Button 
                                type="dashed" 
                                size="small" 
                                onClick={() => handleActionClick("Manage Roster")}
                                className="w-full text-xs hover:border-emerald-500 hover:text-emerald-400"
                            >
                                Manage Roster
                            </Button>
                        </div>
                    </Card>

                </div>

            </div>

        </main>
    );
}

export default TeamDashboard;
