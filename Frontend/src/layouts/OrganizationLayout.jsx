import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, ConfigProvider, theme, Menu, Avatar, message } from "antd";
import { 
    UserOutlined,
    TeamOutlined, 
    TrophyOutlined, 
    BarChartOutlined, 
    LogoutOutlined,
    CalendarOutlined,
    NotificationOutlined,
    SettingOutlined,
    DashboardOutlined
} from "@ant-design/icons";
import { logout } from "../features/auth/authSlice";

function OrganizationLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

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

    const getActiveKey = () => {
        const path = location.pathname;
        if (path.includes("/organization/dashboard")) return "dashboard";
        if (path.includes("/organization/profile")) return "profile";
        if (path.includes("/organization/teams")) return "teams";
        if (path.includes("/organization/recruitment")) return "recruitment";
        if (path.includes("/organization/tournaments")) return "tournaments";
        if (path.includes("/organization/matches")) return "matches";
        if (path.includes("/organization/analytics")) return "analytics";
        if (path.includes("/organization/settings")) return "settings";
        return "dashboard";
    };

    const handleMenuClick = (key) => {
        if (key === "dashboard") {
            navigate("/organization/dashboard");
        } else if (key === "profile") {
            navigate("/organization/profile");
        } else if (key === "teams") {
            navigate("/organization/teams");
        } else if (key === "tournaments") {
            navigate("/organization/tournaments");
        } else if (key === "matches") {
            navigate("/organization/matches");
        } else {
            message.info(`${key.toUpperCase()} section is under development`);
        }
    };

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="min-h-screen w-full bg-[#080b11] text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex">
                
                {/* Left Sidebar Navigation */}
                <aside className="w-64 bg-[#0b0f19] border-r border-white/[0.04] hidden md:flex flex-col shrink-0">
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

                    <div className="flex-grow py-6 px-4">
                        <Menu
                            mode="inline"
                            selectedKeys={[getActiveKey()]}
                            style={{ background: "transparent", borderRight: 0 }}
                            items={sidebarMenuItems.map(item => ({
                                key: item.key,
                                icon: item.icon,
                                label: <span className="text-xs font-semibold">{item.label}</span>,
                                onClick: () => handleMenuClick(item.key)
                            }))}
                        />
                    </div>

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

                {/* Right Area: Content Outlet */}
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

                    {/* Content Outlets */}
                    <div className="flex-grow overflow-y-auto">
                        <Outlet />
                    </div>

                </div>
            </div>
        </ConfigProvider>
    );
}

export default OrganizationLayout;
