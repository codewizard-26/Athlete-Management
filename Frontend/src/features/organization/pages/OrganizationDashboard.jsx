import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Statistic, Timeline, Button, message } from "antd";
import { 
    TeamOutlined, 
    TrophyOutlined, 
    ArrowRightOutlined,
    PlusCircleOutlined,
    CalendarOutlined,
    NotificationOutlined,
    UserOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function OrganizationDashboard() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [stats, setStats] = useState({
        teamsCount: 0,
        recruitmentCount: 0,
        tournamentsCount: 0,
        matchesCount: 0,
        activities: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchOrgDashboardData = async () => {
            try {
                const response = await api.get("/dashboard/organization");
                if (isMounted) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching organization stats:", error);
                message.error("Failed to fetch dashboard data. Please try again.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchOrgDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Helper to format timestamps dynamically
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
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 30) return `${diffDays} days ago`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Dynamic timeline items mapped from DB activity list
    const timelineItems = stats.activities && stats.activities.length > 0 
        ? stats.activities.map((act) => {
            let color = "blue";
            if (act.type === "team") color = "green";
            if (act.type === "recruitment") color = "purple";
            if (act.type === "tournament") color = "gold";

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
        })
        : [
            {
                color: "gray",
                children: (
                    <div key="empty">
                        <span className="text-slate-400 text-xs">No recent activities. Create teams or schedule tournaments to get started!</span>
                    </div>
                )
            }
        ];

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* 1. Welcome Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-[#0f172a]/60 border border-blue-500/20 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Welcome back, {user?.name || "Organization Manager"}!
                    </h1>
                    <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                        Review organizational metrics, coordinate active teams, manage recruitment campaigns, and organize tournaments.
                    </p>
                </div>
                <div className="shrink-0 flex gap-3">
                    <Button 
                        type="primary" 
                        icon={<UserOutlined />}
                        onClick={() => navigate("/organization/profile/create")}
                        className="shadow-lg shadow-blue-600/10"
                    >
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* 2. Statistics Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teams Created</span>}
                        value={loading ? "..." : stats.teamsCount} 
                        valueStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                        prefix={<TeamOutlined className="text-blue-400 mr-2 text-lg" />}
                    />
                </Card>

                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Drives</span>}
                        value={loading ? "..." : stats.recruitmentCount} 
                        valueStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                        prefix={<NotificationOutlined className="text-purple-400 mr-2 text-lg" />}
                    />
                </Card>

                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tournaments</span>}
                        value={loading ? "..." : stats.tournamentsCount} 
                        valueStyle={{ color: '#34d399', fontWeight: 'bold' }}
                        prefix={<TrophyOutlined className="text-emerald-400 mr-2 text-lg" />}
                    />
                </Card>

                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matches Scheduled</span>}
                        value={loading ? "..." : stats.matchesCount} 
                        valueStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                        prefix={<CalendarOutlined className="text-amber-400 mr-2 text-lg" />}
                    />
                </Card>

            </div>

            {/* 3. Quick Actions & 4. Recent Activity split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Quick Actions (Col-span 2) */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-base font-bold text-white tracking-wide uppercase border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                        <PlusCircleOutlined className="text-blue-500" />
                        <span>Quick Actions</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Action 1 */}
                        <div 
                            onClick={() => navigate("/organization/teams/create")}
                            className="p-5 bg-[#0f172a]/40 border border-white/[0.04] rounded-xl hover:border-blue-500/35 hover:bg-[#0c1428]/30 transition-all duration-300 shadow-md cursor-pointer flex flex-col space-y-3 group"
                        >
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                                <TeamOutlined className="text-lg text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                                    <span>Create Team</span>
                                    <ArrowRightOutlined className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Initialize a new team roster, add age filters, and configure colors.</p>
                            </div>
                        </div>

                        {/* Action 2 */}
                        <div 
                            onClick={() => message.info("Navigate to Launch Recruitment Drive Form (Under Development)")}
                            className="p-5 bg-[#0f172a]/40 border border-white/[0.04] rounded-xl hover:border-purple-500/35 hover:bg-[#0c1428]/30 transition-all duration-300 shadow-md cursor-pointer flex flex-col space-y-3 group"
                        >
                            <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                                <NotificationOutlined className="text-lg text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
                                    <span>Launch Recruiter Call</span>
                                    <ArrowRightOutlined className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Post open scouting spots for athletes to discover and submit applications.</p>
                            </div>
                        </div>

                        {/* Action 3 */}
                        <div 
                            onClick={() => message.info("Navigate to Create Tournament Form (Under Development)")}
                            className="p-5 bg-[#0f172a]/40 border border-white/[0.04] rounded-xl hover:border-emerald-500/35 hover:bg-[#0c1428]/30 transition-all duration-300 shadow-md cursor-pointer flex flex-col space-y-3 group"
                        >
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                                <TrophyOutlined className="text-lg text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                                    <span>Create Tournament</span>
                                    <ArrowRightOutlined className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </h3>
                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Schedule a sports championship, invite team registries, and set fixture limits.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="space-y-4">
                    <h2 className="text-base font-bold text-white tracking-wide uppercase border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                        <CalendarOutlined className="text-blue-500" />
                        <span>Recent Activity</span>
                    </h2>

                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 backdrop-blur-sm p-4 sm:p-6 shadow-md">
                        <Timeline items={timelineItems} className="custom-timeline mt-2" />
                    </Card>
                </div>

            </div>

        </main>
    );
}

export default OrganizationDashboard;
