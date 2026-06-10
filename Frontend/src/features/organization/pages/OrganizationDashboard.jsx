import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Card, Statistic, Timeline, Button, ConfigProvider, theme, message, Menu, Avatar } from "antd";
import { 
    HomeOutlined,
    UserOutlined,
    TeamOutlined, 
    TrophyOutlined, 
    BarChartOutlined, 
    ArrowRightOutlined,
    PlusCircleOutlined,
    LogoutOutlined,
    CalendarOutlined,
    NotificationOutlined,
    SettingOutlined,
    DashboardOutlined
} from "@ant-design/icons";
import { logout } from "../../auth/authSlice";
import api from "../../../api/axios";

function OrganizationDashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

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

    // Sidebar items mapping
    const sidebarMenuItems = [
        { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
        { key: "profile", icon: <UserOutlined />, label: "Organization Profile" },
        { key: "teams", icon: <TeamOutlined />, label: "Teams" },
        { key: "recruitment", icon: <NotificationOutlined />, label: "Recruitment" },
        { key: "tournaments", icon: <TrophyOutlined />, label: "Tournaments" },
        { key: "matches", icon: <CalendarOutlined />, label: "Matches" },
        { key: "analytics", icon: <BarChartOutlined />, label: "Analytics" },
        { key: "settings", icon: <SettingOutlined />, label: "Settings" }
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
        <ConfigProvider theme={darkTheme}>
            <div className="min-h-screen w-full bg-[#080b11] text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex">
                
                {/* Left Sidebar Navigation */}
                <aside className="w-64 bg-[#0b0f19] border-r border-white/[0.04] hidden md:flex flex-col shrink-0">
                    {/* Brand */}
                    <div className="p-6 flex items-center space-x-3 border-b border-white/[0.04]">
                        <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black tracking-wide text-white uppercase">APEX</span>
                            <span className="text-[8px] uppercase tracking-widest text-blue-400 font-bold -mt-0.5">Org Workspace</span>
                        </div>
                    </div>

                    {/* Sidebar menu */}
                    <div className="flex-grow py-6 px-4">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={["dashboard"]}
                            style={{ background: "transparent", borderRight: 0 }}
                            items={sidebarMenuItems.map(item => ({
                                key: item.key,
                                icon: item.icon,
                                label: <span className="text-xs font-semibold">{item.label}</span>,
                                onClick: () => {
                                    if (item.key === "profile") {
                                        navigate("/organization/profile/create");
                                    } else {
                                        message.info(`Navigating to ${item.label} (Under Development)`);
                                    }
                                }
                            }))}
                        />
                    </div>

                    {/* User profile & Sign Out footer */}
                    <div className="p-4 border-t border-white/[0.04] bg-[#090d16] flex flex-col gap-3">
                        <div className="flex items-center space-x-3">
                            <Avatar size="small" icon={<UserOutlined />} className="bg-blue-600 shrink-0" />
                            <div className="min-w-0 flex-grow">
                                <p className="text-xs font-bold text-white truncate">{user?.name || "Manager"}</p>
                                <p className="text-[9px] text-slate-400 truncate uppercase tracking-wider">{user?.role}</p>
                            </div>
                        </div>
                        <Button 
                            type="text" 
                            danger 
                            icon={<LogoutOutlined />} 
                            onClick={handleLogout}
                            className="w-full text-left justify-start hover:bg-red-500/10 text-xs py-2 px-3 h-auto"
                        >
                            Sign Out
                        </Button>
                    </div>
                </aside>

                {/* Right Area: Main Dashboard Grid */}
                <div className="flex-grow flex flex-col min-w-0">
                    
                    {/* Top Header Navbar */}
                    <header className="w-full flex items-center justify-between py-4 px-6 bg-[#0b0f19]/90 border-b border-white/[0.04]">
                        <div className="flex items-center space-x-3 md:hidden">
                            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-base font-black tracking-wide text-white uppercase">APEX</span>
                        </div>

                        <div className="hidden md:block">
                            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Organization Portal</h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-xs text-slate-400 hidden sm:inline">User ID: <strong className="text-blue-400 font-mono">{user?.email}</strong></span>
                            <Button 
                                type="text" 
                                danger 
                                icon={<LogoutOutlined />} 
                                onClick={handleLogout}
                                className="hover:bg-red-500/10 text-xs md:hidden"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </header>

                    {/* Scrollable Dashboard Body */}
                    <main className="flex-grow overflow-y-auto max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                        
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
                                        onClick={() => message.info("Navigate to Create Team Form (Under Development)")}
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

                </div>
            </div>
        </ConfigProvider>
    );
}

export default OrganizationDashboard;
