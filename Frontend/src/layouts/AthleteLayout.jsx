import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { ConfigProvider, theme, Button, Avatar, Dropdown, Menu, message, Drawer } from "antd";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import {
    DashboardOutlined,
    UserOutlined,
    TeamOutlined,
    NotificationOutlined,
    SolutionOutlined,
    BarChartOutlined,
    SettingOutlined,
    LogoutOutlined,
    SunOutlined,
    MoonOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MenuOutlined
} from "@ant-design/icons";

function AthleteLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(null);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const res = await api.get("/athleteprofile/me");
                if (res.data) {
                    const url = res.data.photo?.url || res.data.avatar?.url || (typeof res.data.photo === "string" ? res.data.photo : null);
                    setPhotoUrl(url);
                }
            } catch (err) {
                console.error("Error fetching athlete photo for layout:", err);
            }
        };
        fetchPhoto();
    }, [location.pathname]);

    const { themeMode, toggleTheme } = useTheme();

    const handleLogout = () => {
        dispatch(logout());
        message.success("Signed out successfully");
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
        { key: "profile", icon: <UserOutlined className="text-sm" />, label: "My Profile" },
        { key: "teams", icon: <TeamOutlined className="text-sm" />, label: "My Teams" },
        { key: "recruitment", icon: <NotificationOutlined className="text-sm" />, label: "Recruitment" },
        { key: "applications", icon: <SolutionOutlined className="text-sm" />, label: "Applications" },
        { key: "performance", icon: <BarChartOutlined className="text-sm" />, label: "Analytics" },
        { key: "settings", icon: <SettingOutlined className="text-sm" />, label: "Settings" }
    ];

    const getActiveKey = () => {
        const path = location.pathname;
        if (path.includes("/athlete/dashboard")) return "dashboard";
        if (path.includes("/athlete/profile")) return "profile";
        if (path.includes("/athlete/teams")) return "teams";
        if (path.includes("/athlete/recruitment")) return "recruitment";
        if (path.includes("/athlete/applications")) return "applications";
        if (path.includes("/athlete/performance")) return "performance";
        if (path.includes("/athlete/settings")) return "settings";
        return "dashboard";
    };

    const handleMenuClick = (key) => {
        if (key === "dashboard") {
            navigate("/athlete/dashboard");
        } else if (key === "profile") {
            navigate("/athlete/profile");
        } else if (key === "teams") {
            navigate("/athlete/teams");
        } else if (key === "recruitment") {
            navigate("/athlete/recruitment");
        } else if (key === "applications") {
            navigate("/athlete/applications");
        } else if (key === "performance") {
            navigate("/athlete/performance");
        } else if (key === "settings") {
            navigate("/athlete/settings");
        } else {
            const item = sidebarMenuItems.find(i => i.key === key);
            message.info(`${item?.label || key} section is under development`);
        }
    };

    return (
        <ConfigProvider theme={antdTheme}>
            <div className="h-screen w-full bg-transparent text-text-primary font-sans flex overflow-hidden">
                
                {/* Left Sidebar Navigation */}
                <aside className={`${collapsed ? "w-16" : "w-60"} bg-bg-surface border-r border-border-subtle hidden md:flex flex-col shrink-0 transition-all duration-200`}>
                    <div className="h-14 px-5 flex items-center justify-between border-b border-border-subtle">
                        {!collapsed && (
                            <Link to="/athlete/dashboard" className="flex items-center space-x-2.5 cursor-pointer">
                                <div className="h-7 w-7 rounded-md bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center shadow-sm">
                                    <svg viewBox="0 0 100 100" className="w-4 h-4 fill-current">
                                        <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" />
                                        <path d="M38 65 L62 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold tracking-wider text-text-primary uppercase">ATHLETIX</span>
                                    <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ATHLETE</span>
                                </div>
                            </Link>
                        )}
                        {collapsed && (
                            <Link to="/athlete/dashboard" className="mx-auto h-7 w-7 rounded-md bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center shadow-sm cursor-pointer">
                                <svg viewBox="0 0 100 100" className="w-4 h-4 fill-current">
                                    <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" />
                                    <path d="M38 65 L62 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
                                </svg>
                            </Link>
                        )}
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
                        {!collapsed && (
                            <div className="flex items-center gap-2.5 px-1 py-1">
                                <Avatar size={32} src={photoUrl || undefined} icon={!photoUrl ? <UserOutlined /> : undefined} className="bg-brand-primary shrink-0" />
                                <div className="min-w-0 flex-grow overflow-hidden">
                                    <p className="text-xs font-semibold text-text-primary truncate leading-tight">{user?.name || "Athlete"}</p>
                                    <p className="text-[10px] text-text-secondary truncate font-mono mt-0.5 leading-tight">{user?.email}</p>
                                </div>
                            </div>
                        )}
                        <Button 
                            type="text" 
                            danger 
                            icon={<LogoutOutlined className="text-xs" />} 
                            onClick={handleLogout}
                            className={`w-full text-left justify-start hover:bg-status-danger/10 text-xs py-1.5 px-2.5 h-8 ${collapsed ? "justify-center px-0" : ""}`}
                        >
                            {!collapsed && <span className="text-xs">Sign Out</span>}
                        </Button>
                    </div>
                </aside>

                {/* Right Area: Content Outlet */}
                <div className="flex-grow flex flex-col min-w-0">
                    
                    {/* Top Header Navbar */}
                    <header className="h-14 w-full flex items-center justify-between px-6 bg-bg-surface border-b border-border-subtle sticky top-0 z-40">
                        {/* Collapse Toggle & Brand Info */}
                        <div className="flex items-center space-x-3">
                            <Button 
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                className="!hidden md:!inline-flex text-text-secondary hover:text-text-primary"
                            />
                            
                            <div className="flex items-center space-x-2 md:hidden">
                                <Button 
                                    type="text"
                                    icon={<MenuOutlined />}
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="text-text-secondary hover:text-text-primary mr-1"
                                />
                                <Link to="/athlete/dashboard" className="flex items-center space-x-2 cursor-pointer">
                                    <div className="h-7 w-7 rounded-md bg-[#1A1A1A] dark:bg-white text-[#0A0A0A] flex items-center justify-center">
                                        <svg viewBox="0 0 100 100" className="w-4 h-4 fill-current">
                                            <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" />
                                            <path d="M38 65 L62 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold tracking-wide text-text-primary uppercase">ATHLETIX</span>
                                </Link>
                            </div>

                            <div className="hidden md:block">
                                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Athlete Portal</span>
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

                            {/* User Profile Badge */}
                            <div className="flex items-center gap-2 sm:gap-3 bg-bg-elevated border border-border-subtle px-2 sm:px-3 py-1 rounded-full">
                                <Avatar size={28} src={photoUrl || undefined} icon={!photoUrl ? <UserOutlined /> : undefined} className="bg-brand-primary shrink-0" />
                                <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-text-primary max-w-[120px] truncate">{user?.name}</span>
                                {user?.sport && (
                                    <span className="hidden sm:inline text-[10px] font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-1.5 py-0.2 rounded uppercase">
                                        {user.sport}
                                    </span>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Dynamic Page Content Outlet */}
                    <main className="flex-grow p-4 sm:p-6 md:p-8 overflow-y-auto bg-bg-base transition-colors duration-200">
                        <Outlet context={{ athleteData: user }} />
                    </main>
                </div>

                {/* Mobile Drawer Navigation */}
                <Drawer
                    title={
                        <Link to="/athlete/dashboard" className="flex items-center space-x-2 cursor-pointer">
                            <div className="h-7 w-7 rounded-md bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-4 h-4 fill-current">
                                    <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" />
                                    <path d="M38 65 L62 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
                                </svg>
                            </div>
                            <span className="text-sm font-bold tracking-wider text-text-primary uppercase">ATHLETIX</span>
                        </Link>
                    }
                    placement="left"
                    onClose={() => setMobileMenuOpen(false)}
                    open={mobileMenuOpen}
                    width={260}
                    className="md:hidden"
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[getActiveKey()]}
                        style={{ background: "transparent", borderRight: 0 }}
                        items={sidebarMenuItems.map(item => ({
                            key: item.key,
                            icon: item.icon,
                            label: <span className="text-sm">{item.label}</span>,
                            onClick: () => {
                                handleMenuClick(item.key);
                                setMobileMenuOpen(false);
                            }
                        }))}
                    />
                    <div className="mt-8 pt-4 border-t border-border-subtle flex flex-col gap-3">
                        <div className="flex items-center space-x-3 px-2">
                            <Avatar size={32} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                            <div className="min-w-0 flex-grow">
                                <p className="text-xs font-semibold text-text-primary truncate">{user?.name}</p>
                                <p className="text-[10px] text-text-secondary truncate font-mono">{user?.email}</p>
                            </div>
                        </div>
                        <Button 
                            type="primary" 
                            danger 
                            block 
                            icon={<LogoutOutlined />} 
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                        >
                            Sign Out
                        </Button>
                    </div>
                </Drawer>
            </div>
        </ConfigProvider>
    );
}

export default AthleteLayout;
