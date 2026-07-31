import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
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
import { useTheme } from "../context/ThemeContext";

function OrganizationLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const { themeMode, toggleTheme } = useTheme();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    // Custom Ant Design theme synced with Nordic Athletic Light & Dark systems
    const antdTheme = {
        algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: themeMode === "dark" ? "#FFFFFF" : "#1A1A1A",
            colorBgLayout: "transparent",
            colorBgContainer: themeMode === "dark" ? "#111827" : "#FFFFFF",
            colorBorder: themeMode === "dark" ? "#1F2937" : "#E5E7EB",
            colorText: themeMode === "dark" ? "#F9FAFB" : "#111827",
            colorTextSecondary: themeMode === "dark" ? "#D1D5DB" : "#374151",
            colorTextDescription: themeMode === "dark" ? "#9CA3AF" : "#4B5563",
            borderRadius: 6,
            fontFamily: "Geist, -apple-system, BlinkMacSystemFont, sans-serif",
        },
        components: {
            Button: {
                borderRadius: 6,
                controlHeight: 34,
                fontWeight: 500,
                boxShadow: "none",
                colorTextLightSolid: themeMode === "dark" ? "#0A0A0A" : "#FFFFFF",
            },
            Card: {
                borderRadius: 8,
            },
            Menu: {
                itemBg: "transparent",
                itemColor: themeMode === "dark" ? "#888888" : "#555555",
                itemHoverBg: themeMode === "dark" ? "#1A1A1A" : "#F0EEE9",
                itemHoverColor: themeMode === "dark" ? "#EDEDED" : "#1A1A1A",
                itemSelectedBg: themeMode === "dark" ? "#1A1A1A" : "#F0EEE9",
                itemSelectedColor: themeMode === "dark" ? "#FFFFFF" : "#1A1A1A",
                itemMarginInline: 4,
                itemBorderRadius: 6,
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
                        <Link to="/organization/dashboard" className="flex items-center space-x-2.5 cursor-pointer">
                            <div className="h-7 w-7 rounded-md bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center shadow-sm">
                                <svg viewBox="0 0 100 100" className="w-4 h-4 fill-current">
                                    <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" />
                                    <path d="M38 65 L62 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold tracking-wider text-text-primary uppercase">ATHLETIX</span>
                                <span className="text-[9px] uppercase tracking-widest text-[#888888] font-medium -mt-1">ORGANIZATION</span>
                            </div>
                        </Link>
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
                        <div className="flex items-center gap-2.5 px-1 py-1">
                            <Avatar size={32} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                            <div className="min-w-0 flex-grow overflow-hidden">
                                <p className="text-xs font-semibold text-text-primary truncate leading-tight">{user?.name || "Manager"}</p>
                                <p className="text-[10px] text-text-secondary truncate font-mono mt-0.5 leading-tight">{user?.email}</p>
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
                                <Link to="/organization/dashboard" className="flex items-center space-x-2 cursor-pointer">
                                    <div className="h-7 w-7 rounded-md bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center">
                                        <svg viewBox="0 0 100 100" className="w-4 h-4 fill-current">
                                            <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" />
                                            <path d="M38 65 L62 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold tracking-wide text-text-primary uppercase">ATHLETIX</span>
                                </Link>
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
                                <div className="flex items-center gap-3 px-3 py-1 bg-bg-elevated border border-border-subtle rounded-full">
                                    <Avatar size={32} icon={<UserOutlined />} className="bg-brand-primary text-white text-[10px] flex items-center justify-center" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-text-primary truncate max-w-[120px]">{user.name}</span>
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
                            <div className="h-7 w-7 rounded-md bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-4 h-4 fill-current">
                                    <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" />
                                    <path d="M38 65 L62 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold tracking-wider text-text-primary uppercase">ATHLETIX</span>
                                <span className="text-[9px] uppercase tracking-widest text-[#888888] font-medium -mt-1">ORGANIZATION</span>
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
