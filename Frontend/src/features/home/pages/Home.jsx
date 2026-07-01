import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, ConfigProvider, theme } from "antd";
import {
    ArrowRightOutlined,
    TeamOutlined,
    TrophyOutlined,
    BarChartOutlined,
    UserOutlined,
    CheckCircleFilled,
    ThunderboltOutlined,
    AimOutlined,
    CalendarOutlined
} from "@ant-design/icons";

function Home() {
    const [themeMode, setThemeMode] = useState("dark");

    useEffect(() => {
        const savedTheme = localStorage.getItem("themeMode") || "dark";
        setThemeMode(savedTheme);
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const features = [
        {
            icon: <UserOutlined className="text-xl text-brand-primary" />,
            title: "Athlete Management",
            desc: "Create athlete profiles and track development."
        },
        {
            icon: <TeamOutlined className="text-xl text-brand-primary" />,
            title: "Team Recruitment",
            desc: "Manage applications and discover talent."
        },
        {
            icon: <TrophyOutlined className="text-xl text-brand-primary" />,
            title: "Tournament Management",
            desc: "Organize competitions and fixtures."
        },
        {
            icon: <BarChartOutlined className="text-xl text-brand-primary" />,
            title: "Performance Analytics",
            desc: "Track statistics and athlete growth."
        }
    ];

    const steps = [
        { num: "01", title: "Create Account", desc: "Register as an athlete or organization coordinator." },
        { num: "02", title: "Complete Profile", desc: "Initialize your sports bio, team roster, or organization database." },
        { num: "03", title: "Join or Create Teams", desc: "Coordinate athlete roster applications and assemble teamsheets." },
        { num: "04", title: "Participate In Competitions", desc: "Schedule match fixtures and coordinate tournament leagues." },
        { num: "05", title: "Track Performance", desc: "Log match score stats and review performance development." }
    ];

    const platformModules = [
        {
            icon: <UserOutlined className="text-base text-brand-primary" />,
            title: "Athletes",
            desc: "Comprehensive bio profiles, verified metrics, performance history, and team applications."
        },
        {
            icon: <TeamOutlined className="text-base text-brand-primary" />,
            title: "Teams",
            desc: "Centralized roster boards, franchise management, coach assignments, and team sheets."
        },
        {
            icon: <AimOutlined className="text-base text-brand-primary" />,
            title: "Recruitment",
            desc: "Open scout applications, recruitment drive scheduling, candidate shortlisting, and trials."
        },
        {
            icon: <TrophyOutlined className="text-base text-brand-primary" />,
            title: "Tournaments",
            desc: "League scheduling, bracket generations, automatic standings, and points table updates."
        },
        {
            icon: <CalendarOutlined className="text-base text-brand-primary" />,
            title: "Matches",
            desc: "Fixture logs, live scoreboards, match sheets, ref assignments, and event logs."
        },
        {
            icon: <BarChartOutlined className="text-base text-brand-primary" />,
            title: "Analytics",
            desc: "Longitudinal performance reports, training load trackers, and core team efficiency ratios."
        }
    ];

    return (
        <ConfigProvider 
            theme={{
                algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: "#6366F1",
                    borderRadius: 8,
                    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                }
            }}
        >
            <div className="min-h-screen w-full bg-bg-base text-text-primary font-sans selection:bg-brand-primary selection:text-white flex flex-col transition-colors duration-150 animate-fadeIn">

                {/* Navbar */}
                <header className="sticky top-0 z-50 w-full flex items-center justify-between py-4 px-6 sm:px-10 bg-bg-surface/90 backdrop-blur-md border-b border-border-subtle">
                    <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded bg-brand-primary flex items-center justify-center shadow-lg shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-base font-bold tracking-wider text-text-primary uppercase leading-none">APEX</span>
                            <span className="text-[8px] uppercase tracking-widest hidden sm:block text-brand-primary font-semibold mt-1">Athlete Management Platform</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0">
                        <Link to="/login" className="text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
                            Sign In
                        </Link>
                        <Button 
                            type="primary" 
                            size="middle" 
                            className="text-xs sm:text-sm font-semibold h-8.5 rounded-md cursor-pointer"
                        >
                            <Link to="/register">Register</Link>
                        </Button>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative z-0 py-20 lg:py-28 px-6 sm:px-10 border-b border-border-subtle overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-bg-surface via-bg-base to-bg-surface -z-20" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] dark:opacity-[0.03] -z-10 overflow-hidden">
                        <svg className="w-full h-full text-text-primary max-w-5xl" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                            <rect x="5" y="5" width="90" height="90" rx="3" strokeWidth="0.5" />
                            <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="15" strokeWidth="0.5" />
                            <rect x="30" y="5" width="40" height="15" strokeWidth="0.5" />
                            <rect x="30" y="80" width="40" height="15" strokeWidth="0.5" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-3xl px-2 space-y-5">
                        {/* Ecosystem Badge */}
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/15">
                            <ThunderboltOutlined className="text-xs text-brand-primary" />
                            <span className="text-[10px] font-semibold tracking-wider text-brand-primary uppercase">SPORTS MANAGEMENT ECOSYSTEM</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-text-primary">
                            Manage Athletes.<br />
                            Build Teams.<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
                                Run Competitions.
                            </span>
                        </h1>

                        <p className="text-xs sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
                            Manage athlete profiles, build teams, organize tournaments, track match performance, and streamline recruitment through one unified sports ecosystem.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm mx-auto pt-3">
                            <Button 
                                type="primary" 
                                size="large" 
                                icon={<ArrowRightOutlined className="text-xs" />} 
                                className="w-full sm:w-auto font-semibold text-xs h-10 rounded-md cursor-pointer"
                            >
                                <Link to="/register">Create Account</Link>
                            </Button>
                            <Link to="/login" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-5 h-10 border border-border-subtle hover:border-text-secondary/30 bg-bg-surface hover:bg-bg-elevated text-text-primary text-xs font-semibold rounded-md cursor-pointer transition-all duration-150">
                                    Sign In
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16 sm:py-24 px-6 sm:px-10 border-b border-border-subtle bg-bg-surface">
                    <div className="max-w-6xl mx-auto space-y-12">
                        <div className="text-center space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">Everything You Need To Manage Sports</h2>
                            <p className="text-xs text-text-secondary max-w-md mx-auto">
                                A unified platform built for athletes, teams, and organizations.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((item, idx) => (
                                <div key={idx} className="bg-bg-base border border-border-subtle p-5 rounded-xl hover:border-brand-primary/30 transition-all duration-150 shadow-sm flex flex-col justify-between group">
                                    <div className="space-y-4">
                                        <div className="h-10 w-10 rounded bg-brand-primary/10 flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-semibold text-text-primary mb-1.5 tracking-tight">{item.title}</h3>
                                            <p className="text-xs text-text-secondary leading-relaxed m-0">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 sm:py-24 px-6 sm:px-10 border-b border-border-subtle bg-bg-base">
                    <div className="max-w-6xl mx-auto space-y-12">
                        <div className="text-center space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">How The Platform Works</h2>
                            <p className="text-xs text-text-secondary max-w-md mx-auto">
                                A complete timeline linking account creation directly to statistics logging.
                            </p>
                        </div>

                        {/* Desktop Timeline */}
                        <div className="hidden md:grid grid-cols-5 gap-6 relative z-10">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex flex-col items-start relative space-y-3.5">
                                    <div className="h-9 w-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-xs font-bold text-brand-primary shadow-sm">
                                        {step.num}
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold text-text-primary mb-1 tracking-tight">{step.title}</h3>
                                        <p className="text-xs text-text-secondary leading-relaxed m-0">{step.desc}</p>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className="absolute top-4.5 left-9 w-[calc(100%-20px)] h-[1px] bg-border-subtle -z-10" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile Timeline */}
                        <div className="md:hidden flex flex-col items-center space-y-3 relative z-10">
                            {steps.map((step, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="w-full max-w-sm bg-bg-surface border border-border-subtle p-5 rounded-xl flex flex-col items-center text-center space-y-2">
                                        <div className="h-8 w-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-xs font-bold text-brand-primary">
                                            {step.num}
                                        </div>
                                        <h3 className="text-xs font-semibold text-text-primary tracking-tight">{step.title}</h3>
                                        <p className="text-xs text-text-secondary leading-relaxed m-0">{step.desc}</p>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className="text-brand-primary/50 text-base font-bold py-0.5">↓</div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Role Showcase */}
                <section className="py-16 sm:py-24 px-6 sm:px-10 border-b border-border-subtle bg-bg-surface">
                    <div className="max-w-5xl mx-auto space-y-12">
                        <div className="text-center space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">Role Showcase</h2>
                            <p className="text-xs text-text-secondary max-w-md mx-auto">
                                Tailored features structured to deliver relevant workspaces for different roles.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Athlete Card */}
                            <div className="bg-bg-base border border-border-subtle p-6 sm:p-8 rounded-xl shadow-sm relative overflow-hidden group space-y-6">
                                <div className="flex items-center space-x-3">
                                    <UserOutlined className="text-xl text-brand-primary" />
                                    <h3 className="text-sm font-semibold text-text-primary tracking-tight m-0">Athlete Card</h3>
                                </div>
                                <ul className="space-y-3.5 p-0 m-0">
                                    <li className="flex items-start space-x-2.5 text-xs text-text-secondary">
                                        <CheckCircleFilled className="text-brand-secondary mt-0.5 shrink-0" />
                                        <span>Create Profile</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs text-text-secondary">
                                        <CheckCircleFilled className="text-brand-secondary mt-0.5 shrink-0" />
                                        <span>Join Teams</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs text-text-secondary">
                                        <CheckCircleFilled className="text-brand-secondary mt-0.5 shrink-0" />
                                        <span>Apply For Recruitment Drives</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs text-text-secondary">
                                        <CheckCircleFilled className="text-brand-secondary mt-0.5 shrink-0" />
                                        <span>Track Statistics</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Organization Card */}
                            <div className="bg-bg-base border border-border-subtle p-6 sm:p-8 rounded-xl shadow-sm relative overflow-hidden group space-y-6">
                                <div className="flex items-center space-x-3">
                                    <TrophyOutlined className="text-xl text-brand-secondary" />
                                    <h3 className="text-sm font-semibold text-text-primary tracking-tight m-0">Organization Card</h3>
                                </div>
                                <ul className="space-y-3.5 p-0 m-0">
                                    <li className="flex items-start space-x-2.5 text-xs text-text-secondary">
                                        <CheckCircleFilled className="text-brand-secondary mt-0.5 shrink-0" />
                                        <span>Create Teams</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs text-text-secondary">
                                        <CheckCircleFilled className="text-brand-secondary mt-0.5 shrink-0" />
                                        <span>Organize Tournaments</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs text-text-secondary">
                                        <CheckCircleFilled className="text-brand-secondary mt-0.5 shrink-0" />
                                        <span>Manage Matches</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs text-text-secondary">
                                        <CheckCircleFilled className="text-brand-secondary mt-0.5 shrink-0" />
                                        <span>Record Performances</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Platform Modules */}
                <section className="py-16 sm:py-24 px-6 sm:px-10 border-b border-border-subtle bg-bg-base">
                    <div className="max-w-6xl mx-auto space-y-12">
                        <div className="text-center space-y-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">Platform Modules</h2>
                            <p className="text-xs text-text-secondary max-w-md mx-auto">
                                Unified modular applications working in sync to power the entire sports lifecycle.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {platformModules.map((item, idx) => (
                                <div key={idx} className="bg-bg-surface border border-border-subtle p-6 rounded-xl hover:border-brand-primary/20 transition-all duration-150 group flex flex-col justify-between shadow-sm">
                                    <div className="space-y-4">
                                        <div className="h-9 w-9 rounded bg-brand-primary/10 flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-semibold text-text-primary mb-1.5 tracking-tight uppercase tracking-wider">{item.title}</h3>
                                            <p className="text-xs text-text-secondary leading-relaxed m-0">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-6 sm:px-10 border-b border-border-subtle bg-bg-surface text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-text-primary">
                            Ready To Transform Sports Management?
                        </h2>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
                            Join athletes and organizations on a modern sports management platform.
                        </p>
                        <div className="pt-2">
                            <Button 
                                type="primary" 
                                size="large" 
                                className="w-full sm:w-auto font-semibold text-xs h-10 rounded-md cursor-pointer"
                            >
                                <Link to="/register">Create Account</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 sm:py-16 px-6 sm:px-10 bg-[#0B0E14] text-xs text-slate-400 mt-auto border-t border-border-subtle">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded bg-brand-primary flex items-center justify-center">
                                    <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold tracking-wide text-white uppercase">APEX</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed max-w-[200px]">
                                Connecting athletes, teams, and organizations.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[9px]">Quick Links</h4>
                            <ul className="space-y-2 font-medium p-0 m-0 list-none">
                                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[9px]">Platform</h4>
                            <ul className="space-y-2 font-medium p-0 m-0 list-none">
                                <li><a href="#" className="hover:text-white transition-colors">Athlete Management</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Recruitment</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Tournaments</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
                        <span>© 2026 Apex Athlete Management Platform</span>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </footer>
            </div>
        </ConfigProvider>
    );
}

export default Home;
