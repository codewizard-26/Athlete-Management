import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Statistic, Timeline, Button, ConfigProvider, theme } from "antd";
import { 
    UserOutlined, 
    TeamOutlined, 
    TrophyOutlined, 
    BarChartOutlined, 
    ArrowRightOutlined,
    EditOutlined,
    NotificationOutlined,
    HistoryOutlined,
    PlusCircleOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";
import { logout } from "../../auth/authSlice";

function AthleteDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [stats, setStats] = useState({
        teams: 0,
        applications: 0,
        matches: 0,
        records: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/dashboard/athlete");
                if (isMounted) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching athlete dashboard stats:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Custom Ant Design theme matching the dark sports-tech portal aesthetic
    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: "#2563eb", // Sports corporate blue
            colorBgContainer: "#0f172a", // Slate-900
            colorBorder: "rgba(255, 255, 255, 0.08)",
            colorText: "#f3f4f6",
            colorTextSecondary: "#9ca3af",
            borderRadius: 12,
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        },
        components: {
            Card: {
                colorBgContainer: "#0f172a", // Dark slate
            },
            Button: {
                colorPrimary: "#2563eb",
                colorPrimaryHover: "#1d4ed8",
                borderRadius: 8,
                controlHeight: 40,
                fontWeight: 600,
            }
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    // Quick Actions config
    const quickActions = [
        {
            title: "Edit Profile",
            desc: "Update details and sporting biometrics",
            icon: <EditOutlined className="text-lg text-blue-400" />,
            link: "/athlete/profile"
        },
        {
            title: "Browse Recruitment Drives",
            desc: "Discover new team scouting calls",
            icon: <NotificationOutlined className="text-lg text-purple-400" />,
            link: "/recruitment/drives"
        },
        {
            title: "View Teams",
            desc: "Check active rosters and team sheets",
            icon: <TeamOutlined className="text-lg text-emerald-400" />,
            link: "/athlete/teams"
        },
        {
            title: "View Performance Statistics",
            desc: "Track longitudinal match history and growth",
            icon: <BarChartOutlined className="text-lg text-amber-400" />,
            link: "/athlete/analytics"
        }
    ];

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

    // Dynamic Activity Timeline items loaded from Backend
    const timelineItems = stats.activities && stats.activities.length > 0 
        ? stats.activities.map((act) => {
            let color = "blue";
            if (act.type === "team") color = "green";
            if (act.type === "profile") color = "gold";
            if (act.type === "application") color = "purple";

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
                        <span className="text-slate-400 text-xs">No recent activities found.</span>
                    </div>
                )
            }
        ];

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="min-h-screen w-full bg-[#080b11] text-slate-100 font-sans selection:bg-blue-600 selection:text-white pb-12 flex flex-col">
                
                {/* Navbar */}
                <header className="w-full flex items-center justify-between py-4 px-6 bg-[#0b0f19]/90 border-b border-white/[0.04]">
                    <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-black tracking-wide text-white uppercase">APEX</span>
                            <span className="text-[8px] uppercase tracking-widest hidden sm:block text-blue-400 font-bold -mt-1">Athlete Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-xs text-slate-400 hidden sm:inline">Role: <strong className="text-blue-400 uppercase">{user?.role}</strong></span>
                        <Button 
                            type="text" 
                            danger 
                            icon={<LogoutOutlined />} 
                            onClick={handleLogout}
                            className="hover:bg-red-500/10 text-xs"
                        >
                            Sign Out
                        </Button>
                    </div>
                </header>

                <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                    
                    {/* 1. Welcome Banner */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-[#0f172a]/60 border border-blue-500/20 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Welcome back, {user?.name || "Athlete"}!
                            </h1>
                            <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                                Review your dashboard metrics, update your bio profiles, or check active recruitment calls from organizations below.
                            </p>
                        </div>
                        <div className="shrink-0 flex gap-3">
                            <Button 
                                type="primary" 
                                icon={<EditOutlined />}
                                onClick={() => navigate("/athlete/profile")}
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
                                title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teams Joined</span>}
                                value={loading ? "..." : stats.teams} 
                                valueStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                                prefix={<TeamOutlined className="text-blue-400 mr-2 text-lg" />}
                            />
                        </Card>

                        <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md">
                            <Statistic 
                                title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applications Sent</span>}
                                value={loading ? "..." : stats.applications} 
                                valueStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                                prefix={<NotificationOutlined className="text-purple-400 mr-2 text-lg" />}
                            />
                        </Card>

                        <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md">
                            <Statistic 
                                title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matches Played</span>}
                                value={loading ? "..." : stats.matches} 
                                valueStyle={{ color: '#34d399', fontWeight: 'bold' }}
                                prefix={<TrophyOutlined className="text-emerald-400 mr-2 text-lg" />}
                            />
                        </Card>

                        <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm shadow-md">
                            <Statistic 
                                title={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance Records</span>}
                                value={loading ? "..." : stats.records} 
                                valueStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                                prefix={<BarChartOutlined className="text-amber-400 mr-2 text-lg" />}
                            />
                        </Card>

                    </div>

                    {/* 3. Quick Actions & 4. Activity Timeline split */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        
                        {/* Quick Actions (Col-span 2) */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-base font-bold text-white tracking-wide uppercase border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                                <PlusCircleOutlined className="text-blue-500" />
                                <span>Quick Actions</span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {quickActions.map((action, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => navigate(action.link)}
                                        className="p-5 bg-[#0f172a]/40 border border-white/[0.04] rounded-xl hover:border-blue-500/35 hover:bg-[#0c1428]/30 transition-all duration-300 shadow-md cursor-pointer flex items-start space-x-4 group"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                                            {action.icon}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                                                <span>{action.title}</span>
                                                <ArrowRightOutlined className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{action.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Timeline */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-white tracking-wide uppercase border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                                <HistoryOutlined className="text-blue-500" />
                                <span>Recent Activity</span>
                            </h2>

                            <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 backdrop-blur-sm p-4 sm:p-6 shadow-md">
                                <Timeline items={timelineItems} className="custom-timeline mt-2" />
                            </Card>
                        </div>

                    </div>

                </main>

            </div>
        </ConfigProvider>
    );
}

export default AthleteDashboard;
