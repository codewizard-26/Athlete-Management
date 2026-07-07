import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, ConfigProvider, theme, Menu, Avatar, message, Drawer } from "antd";
import { 
    UserOutlined,
    TeamOutlined, 
    TrophyOutlined, 
    BarChartOutlined, 
    LogoutOutlined,
    CalendarOutlined,
    NotificationOutlined,
    SettingOutlined,
    DashboardOutlined,
    MenuOutlined
} from "@ant-design/icons";
import { logout } from "../features/auth/authSlice";

function OrganizationLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Theme state
    const [themeMode, setThemeMode] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    // Theme effect
    useEffect(() => {
        if (themeMode === "dark") {
            document.documentElement.classList.add("dark");
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.setAttribute("data-theme", "light");
        }
        localStorage.setItem("theme", themeMode);
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode(prev => prev === "dark" ? "light" : "dark");
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    // Custom Ant Design theme synced with our CSS design system
    const antdTheme = {
        algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: themeMode === "dark" ? "#6366F1" : "#4F46E5",
            colorBgLayout: "transparent",
            colorBgContainer: themeMode === "dark" ? "rgba(15, 22, 36, 0.45)" : "rgba(255, 255, 255, 0.45)",
            colorBorder: themeMode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)",
            colorText: themeMode === "dark" ? "#F8FAFC" : "#0F172A",
            colorTextSecondary: themeMode === "dark" ? "#94A3B8" : "#475569",
            borderRadius: 8,
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        },
        components: {
            Button: {
                borderRadius: 6,
                controlHeight: 36,
                fontWeight: 500,
                boxShadow: "none",
            },
            Card: {
                borderRadius: 12,
            }
        }
    };

    const sidebarMenuItems = [
        { key: "dashboard", icon: <DashboardOutlined className="text-sm" />, label: "Dashboard" },
        { key: "profile", icon: <UserOutlined className="text-sm" />, label: "Org Profile" },
        { key: "teams", icon: <TeamOutlined className="text-sm" />, label: "Teams" },
        { key: "recruitment", icon: <NotificationOutlined className="text-sm" />, label: "Recruitment" },
        { key: "tournaments", icon: <TrophyOutlined className="text-sm" />, label: "Tournaments" },
        { key: "matches", icon: <CalendarOutlined className="text-sm" />, label: "Matches" },
        { key: "analytics", icon: <BarChartOutlined className="text-sm" />, label: "Analytics" },
        { key: "settings", icon: <SettingOutlined className="text-sm" />, label: "Settings" }
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
        } else if (key === "recruitment") {
            navigate("/organization/recruitment");
        } else if (key === "analytics") {
            navigate("/organization/analytics");
        } else if (key === "settings") {
            navigate("/organization/settings");
        } else {
            message.info(`${key.toUpperCase()} section is under development`);
        }
    };

    return (
        <ConfigProvider theme={antdTheme}>
            <div className="h-screen w-full bg-transparent text-text-primary font-sans flex overflow-hidden">
                
                {/* Left Sidebar Navigation */}
                <aside className="w-60 bg-bg-surface border-r border-border-subtle hidden md:flex flex-col shrink-0">
                    <div className="h-14 px-5 flex items-center justify-between border-b border-border-subtle">
                        <div className="flex items-center space-x-2.5">
                            <div className="h-7 w-7 rounded bg-brand-primary flex items-center justify-center shadow-sm">
                                <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold tracking-wider text-text-primary uppercase">APEX</span>
                                <span className="text-[9px] uppercase tracking-widest text-brand-primary font-medium -mt-1">ORGANIZATION</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-grow py-4 px-2 overflow-y-auto">
                        <Menu
                            mode="inline"
                            selectedKeys={[getActiveKey()]}
                            style={{ background: "transparent", borderRight: 0 }}
                            items={sidebarMenuItems.map(item => ({
                                key: item.key,
                                icon: item.icon,
                                label: <span className="text-xs font-medium">{item.label}</span>,
                                onClick: () => handleMenuClick(item.key)
                            }))}
                            className="custom-sidebar-menu"
                        />
                    </div>

                    <div className="p-3 border-t border-border-subtle bg-bg-elevated/50 flex flex-col gap-2">
                        <div className="flex items-center space-x-2.5 px-2 py-1.5">
                            <Avatar size={28} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                            <div className="min-w-0 flex-grow">
                                <p className="text-xs font-semibold text-text-primary truncate">{user?.name || "Manager"}</p>
                                <p className="text-[10px] text-text-secondary truncate font-mono">{user?.email}</p>
                            </div>
                        </div>
                        <Button 
                            type="text" 
                            danger 
                            icon={<LogoutOutlined className="text-xs" />} 
                            onClick={handleLogout}
                            className="w-full text-left justify-start hover:bg-status-danger/10 text-xs py-1.5 px-2.5 h-8"
                        >
                            <span className="text-xs">Sign Out</span>
                        </Button>
                    </div>
                </aside>

                {/* Right Area: Content Outlet */}
                <div className="flex-grow flex flex-col min-w-0">
                    
                    {/* Top Header Navbar */}
                    <header className="h-14 w-full flex items-center justify-between px-6 bg-bg-surface border-b border-border-subtle sticky top-0 z-40">
                        {/* Mobile Brand Info */}
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2 md:hidden">
                                <Button 
                                    type="text"
                                    icon={<MenuOutlined />}
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="text-text-secondary hover:text-text-primary mr-1"
                                />
                                <div className="h-7 w-7 rounded bg-brand-primary flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold tracking-wide text-text-primary uppercase">APEX</span>
                            </div>

                            <div className="hidden md:block">
                                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Organization Portal</span>
                            </div>
                        </div>

                        {/* Right Area Controls */}
                        <div className="flex items-center space-x-3.5">
                            {/* Theme Toggle Button */}
                            <button 
                                onClick={toggleTheme}
                                className="h-8 w-8 rounded-lg border border-border-subtle hover:border-brand-primary/30 flex items-center justify-center text-text-secondary hover:text-text-primary bg-bg-surface transition-colors cursor-pointer"
                                aria-label="Toggle theme"
                            >
                                {themeMode === "dark" ? (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>

                            {user && (
                                <div className="flex items-center space-x-2.5 px-3 py-1 bg-bg-elevated border border-border-subtle rounded-full">
                                    <Avatar size={20} icon={<UserOutlined />} className="bg-brand-primary text-white text-[10px] flex items-center justify-center" />
                                    <div className="flex items-center space-x-1.5">
                                        <span className="text-xs font-semibold text-text-primary truncate max-w-[120px]">{user.name}</span>
                                        <span className="text-[9px] bg-brand-secondary/15 text-brand-secondary font-bold uppercase px-1.5 py-0.5 rounded border border-brand-secondary/10 shrink-0">
                                            Admin
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="md:hidden">
                                <Button 
                                    type="text" 
                                    danger 
                                    icon={<LogoutOutlined />} 
                                    onClick={handleLogout}
                                    className="hover:bg-status-danger/10 text-xs py-1 px-2.5 h-8"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Content Outlets */}
                    <div className="flex-grow overflow-y-auto bg-transparent">
                        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto">
                            <Outlet />
                        </div>
                    </div>

                </div>

                {/* Mobile Menu Drawer */}
                <Drawer
                    title={
                        <div className="flex items-center space-x-2.5">
                            <div className="h-7 w-7 rounded bg-brand-primary flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold tracking-wider text-text-primary uppercase">APEX</span>
                                <span className="text-[9px] uppercase tracking-widest text-brand-primary font-medium -mt-1">ORGANIZATION</span>
                            </div>
                        </div>
                    }
                    placement="left"
                    onClose={() => setMobileMenuOpen(false)}
                    open={mobileMenuOpen}
                    width={260}
                    styles={{
                        body: { padding: '12px 8px', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--color-bg-surface)' }
                    }}
                >
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex-grow">
                            <Menu
                                mode="inline"
                                selectedKeys={[getActiveKey()]}
                                style={{ background: "transparent", borderRight: 0 }}
                                items={sidebarMenuItems.map(item => ({
                                    key: item.key,
                                    icon: item.icon,
                                    label: <span className="text-xs font-medium">{item.label}</span>,
                                    onClick: () => {
                                        handleMenuClick(item.key);
                                        setMobileMenuOpen(false);
                                    }
                                }))}
                            />
                        </div>
                        <div className="p-3 border-t border-border-subtle bg-bg-elevated/50 flex flex-col gap-2 rounded-lg">
                            <div className="flex items-center space-x-2.5 px-2 py-1.5">
                                <Avatar size={28} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                                <div className="min-w-0 flex-grow">
                                    <p className="text-xs font-semibold text-text-primary truncate">{user?.name || "Manager"}</p>
                                    <p className="text-[10px] text-text-secondary truncate font-mono">{user?.email}</p>
                                </div>
                            </div>
                            <Button 
                                type="text" 
                                danger 
                                icon={<LogoutOutlined className="text-xs" />} 
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full text-left justify-start hover:bg-status-danger/10 text-xs py-1.5 px-2.5 h-8"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </Drawer>

            </div>
        </ConfigProvider>
    );
}

export default OrganizationLayout;
