import React from "react";
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
    // Custom Ant Design theme matching the dark sports-tech portal aesthetic
    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: "#2563eb", // Sports corporate blue
            colorBgContainer: "#0f172a", // Slate-900
            colorBorder: "rgba(255, 255, 255, 0.08)",
            colorText: "#f3f4f6",
            colorTextSecondary: "#9ca3af",
            borderRadius: 8,
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        },
        components: {
            Button: {
                colorPrimary: "#2563eb",
                colorPrimaryHover: "#1d4ed8",
                colorPrimaryActive: "#1e40af",
                borderRadius: 8,
                controlHeight: 44,
                fontWeight: 600,
            }
        }
    };

    const features = [
        {
            icon: <UserOutlined className="text-2xl text-blue-500" />,
            title: "Athlete Management",
            desc: "Create athlete profiles and track development."
        },
        {
            icon: <TeamOutlined className="text-2xl text-blue-500" />,
            title: "Team Recruitment",
            desc: "Manage applications and discover talent."
        },
        {
            icon: <TrophyOutlined className="text-2xl text-blue-500" />,
            title: "Tournament Management",
            desc: "Organize competitions and fixtures."
        },
        {
            icon: <BarChartOutlined className="text-2xl text-blue-500" />,
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
            icon: <UserOutlined className="text-xl text-blue-400" />,
            title: "Athletes",
            desc: "Comprehensive bio profiles, verified metrics, performance history, and team applications."
        },
        {
            icon: <TeamOutlined className="text-xl text-blue-400" />,
            title: "Teams",
            desc: "Centralized roster boards, franchise management, coach assignments, and team sheets."
        },
        {
            icon: <AimOutlined className="text-xl text-blue-400" />,
            title: "Recruitment",
            desc: "Open scout applications, recruitment drive scheduling, candidate shortlisting, and trials."
        },
        {
            icon: <TrophyOutlined className="text-xl text-blue-400" />,
            title: "Tournaments",
            desc: "League scheduling, bracket generations, automatic standings, and points table updates."
        },
        {
            icon: <CalendarOutlined className="text-xl text-blue-400" />,
            title: "Matches",
            desc: "Fixture logs, live scoreboards, match sheets, ref assignments, and event logs."
        },
        {
            icon: <BarChartOutlined className="text-xl text-blue-400" />,
            title: "Analytics",
            desc: "Longitudinal performance reports, training load trackers, and core team efficiency ratios."
        }
    ];

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="min-h-screen w-full bg-[#080b11] text-slate-100 font-sans selection:bg-blue-600 selection:text-white scroll-smooth flex flex-col">
                
                {/* 1. Navbar (Sticky on scroll) */}
                <header className="sticky top-0 z-50 w-full flex items-center justify-between py-4 px-4 sm:px-8 md:px-12 bg-[#0b0f19]/90 backdrop-blur-md border-b border-white/[0.04]">
                    <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-base font-black tracking-wide text-white uppercase">APEX</span>
                            <span className="text-[8px] uppercase tracking-widest hidden sm:block text-blue-400 font-bold -mt-1 truncate">Athlete Management Platform</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0">
                        <Link to="/login" className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Button type="primary" size="middle" className="text-xs sm:text-sm shadow-md">
                            <Link to="/register">Register</Link>
                        </Button>
                    </div>
                </header>

                {/* 2. Hero Section */}
                <section className="relative z-0 py-20 lg:py-32 px-4 sm:px-8 md:px-12 border-b border-white/[0.04] overflow-hidden flex flex-col items-center text-center">
                    
                    {/* Glowing Spotlights & Pitch vector overlay with sports-tech overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0c1428] via-[#080d1a] to-[#04060b] -z-20" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

                    {/* Highly stylized tactical overlays inside background vector */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] -z-10 overflow-hidden">
                        <svg className="w-full h-full text-white max-w-5xl" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                            {/* Stadium Pitch */}
                            <rect x="5" y="5" width="90" height="90" rx="3" strokeWidth="0.5" />
                            <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="15" strokeWidth="0.5" />
                            <rect x="30" y="5" width="40" height="15" strokeWidth="0.5" />
                            <rect x="30" y="80" width="40" height="15" strokeWidth="0.5" />
                            
                            {/* Player tracking paths overlay (sports tech visual) */}
                            <path d="M 20,20 Q 35,45 50,35 T 80,80" stroke="#3b82f6" strokeWidth="0.4" strokeDasharray="2,2" />
                            <path d="M 80,20 Q 65,45 50,65 T 20,80" stroke="#818cf8" strokeWidth="0.4" strokeDasharray="2,2" />
                            
                            {/* Tactical network connections */}
                            <circle cx="20" cy="20" r="1" fill="#3b82f6" />
                            <circle cx="50" cy="35" r="1" fill="#3b82f6" />
                            <circle cx="80" cy="80" r="1" fill="#3b82f6" />
                            <circle cx="80" cy="20" r="1" fill="#818cf8" />
                            <circle cx="50" cy="65" r="1" fill="#818cf8" />
                            <circle cx="20" cy="80" r="1" fill="#818cf8" />

                            {/* Tournament bracket structure outlines in background corners */}
                            <path d="M 8,60 H 14 V 68 H 8 M 14,64 H 18" stroke="currentColor" strokeWidth="0.3" />
                            <path d="M 92,60 H 86 V 68 H 92 M 86,64 H 82" stroke="currentColor" strokeWidth="0.3" />
                        </svg>
                    </div>

                    <div className="relative z-10 max-w-3xl px-2">
                        {/* Sports Ecosystem Badge */}
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 mb-6">
                            <ThunderboltOutlined className="text-xs text-blue-400" />
                            <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">SPORTS MANAGEMENT ECOSYSTEM</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white mb-6">
                            Manage Athletes.<br />
                            Build Teams.<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500">
                                Run Competitions.
                            </span>
                        </h1>

                        <p className="text-sm sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
                            Manage athlete profiles, build teams, organize tournaments, track match performance, and streamline recruitment through one unified sports ecosystem.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
                            <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPlacement="end" className="w-full sm:w-auto uppercase tracking-wide">
                                <Link to="/register">Create Account</Link>
                            </Button>
                            <Link to="/login" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-6 h-11 border border-white/[0.08] hover:border-white/[0.16] bg-white/[0.02] hover:bg-white/[0.04] text-white text-sm font-semibold rounded-lg transition-all duration-300">
                                    Sign In
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* SECTION 1 — FEATURES */}
                <section className="py-20 lg:py-28 px-4 sm:px-8 md:px-12 border-b border-white/[0.04]">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16 px-2">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Everything You Need To Manage Sports</h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
                                A unified platform built for athletes, teams, and organizations.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((item, idx) => (
                                <div key={idx} className="glassmorphism p-6 rounded-xl hover:border-blue-500/35 hover:bg-[#0c1428]/40 transition-all duration-300 shadow-xl flex flex-col justify-between group">
                                    <div>
                                        <div className="h-12 w-12 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-base font-bold text-white mb-2 tracking-tight">{item.title}</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 2 — HOW IT WORKS */}
                <section className="py-20 lg:py-28 px-4 sm:px-8 md:px-12 bg-[#06090f]/50 border-b border-white/[0.04]">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16 px-2">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">How The Platform Works</h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
                                A complete timeline linking account creation directly to statistics logging.
                            </p>
                        </div>

                        {/* Desktop Timeline */}
                        <div className="hidden md:grid grid-cols-5 gap-6 relative z-10">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex flex-col items-start relative">
                                    {/* Number Circle Badge */}
                                    <div className="h-10 w-10 rounded-full bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-xs font-black text-blue-400 mb-4 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                                        {step.num}
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-1.5 tracking-tight">{step.title}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                                    
                                    {/* Connection Line on desktop */}
                                    {idx < steps.length - 1 && (
                                        <div className="absolute top-5 left-10 w-[calc(100%-24px)] h-[1px] bg-gradient-to-r from-blue-500/20 to-transparent -z-10" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Mobile Timeline with vertical down arrows */}
                        <div className="md:hidden flex flex-col items-center space-y-4 relative z-10 px-2">
                            {steps.map((step, idx) => (
                                <React.Fragment key={idx}>
                                    <div className="w-full max-w-sm glassmorphism p-5 rounded-xl flex flex-col items-center text-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-600/10 border border-blue-500/25 flex items-center justify-center text-xs font-black text-blue-400 mb-2">
                                            {step.num}
                                        </div>
                                        <h3 className="text-sm font-bold text-white mb-1 tracking-tight">{step.title}</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className="text-blue-500/60 text-xl font-bold py-1">↓</div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3 — ROLE SHOWCASE */}
                <section className="py-20 lg:py-28 px-4 sm:px-8 md:px-12 border-b border-white/[0.04]">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16 px-2">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Role Showcase</h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
                                Tailored features structured to deliver relevant workspaces for different roles.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Athlete Showcase Card */}
                            <div className="bg-gradient-to-b from-[#0c1428] to-[#080d15] border border-blue-500/20 p-6 sm:p-8 rounded-xl shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                                <div className="flex items-center space-x-3 mb-6">
                                    <TeamOutlined className="text-2xl text-blue-400" />
                                    <h3 className="text-xl font-bold text-white tracking-tight">Athlete Card</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                                        <CheckCircleFilled className="text-blue-500 mt-0.5 shrink-0" />
                                        <span>Create Profile</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                                        <CheckCircleFilled className="text-blue-500 mt-0.5 shrink-0" />
                                        <span>Join Teams</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                                        <CheckCircleFilled className="text-blue-500 mt-0.5 shrink-0" />
                                        <span>Apply For Recruitment Drives</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                                        <CheckCircleFilled className="text-blue-500 mt-0.5 shrink-0" />
                                        <span>Track Statistics</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Organization Showcase Card */}
                            <div className="bg-gradient-to-b from-[#110f27] to-[#080710] border border-purple-500/15 p-6 sm:p-8 rounded-xl shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                                <div className="flex items-center space-x-3 mb-6">
                                    <TrophyOutlined className="text-2xl text-purple-400" />
                                    <h3 className="text-xl font-bold text-white tracking-tight">Organization Card</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                                        <CheckCircleFilled className="text-purple-400 mt-0.5 shrink-0" />
                                        <span>Create Teams</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                                        <CheckCircleFilled className="text-purple-400 mt-0.5 shrink-0" />
                                        <span>Organize Tournaments</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                                        <CheckCircleFilled className="text-purple-400 mt-0.5 shrink-0" />
                                        <span>Manage Matches</span>
                                    </li>
                                    <li className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                                        <CheckCircleFilled className="text-purple-400 mt-0.5 shrink-0" />
                                        <span>Record Performances</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4 — PLATFORM MODULES */}
                <section className="py-20 lg:py-28 px-4 sm:px-8 md:px-12 bg-[#06090f]/50 border-b border-white/[0.04]">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16 px-2">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Platform Modules</h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
                                Unified modular applications working in sync to power the entire sports lifecycle.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {platformModules.map((item, idx) => (
                                <div key={idx} className="bg-[#0b0f19]/80 border border-white/[0.04] p-6 rounded-xl hover:border-blue-600/30 hover:bg-[#0c1428] transition-all duration-300 group flex flex-col justify-between">
                                    <div>
                                        <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-sm font-bold text-white mb-2 tracking-tight uppercase tracking-wider">{item.title}</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 5 — CTA */}
                <section className="relative z-0 py-20 sm:py-28 px-4 sm:px-8 md:px-12 border-b border-white/[0.04] overflow-hidden flex flex-col items-center text-center">
                    
                    {/* Glowing spotlight gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] to-[#05070c] -z-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none -z-10" />

                    <div className="max-w-2xl relative z-10 px-2">
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
                            Ready To Transform Sports Management?
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto mb-8">
                            Join athletes and organizations on a modern sports management platform.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm mx-auto">
                            <Button type="primary" size="large" className="w-full sm:w-auto uppercase tracking-widest shadow-lg shadow-blue-600/20">
                                <Link to="/register">Create Account</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* SECTION 6 — FOOTER */}
                <footer className="py-12 sm:py-16 px-4 sm:px-8 md:px-12 bg-[#05070c] text-xs text-slate-400 mt-auto">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Column 1: Brand Logo & Tagline */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                    <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm font-black tracking-wide text-white uppercase">APEX</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed max-w-[200px]">
                                Connecting athletes, teams, and organizations.
                            </p>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div className="space-y-3">
                            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[10px]">Quick Links</h4>
                            <ul className="space-y-2 font-medium">
                                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Platform categories */}
                        <div className="space-y-3">
                            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[10px]">Platform</h4>
                            <ul className="space-y-2 font-medium">
                                <li><a href="#" className="hover:text-white transition-colors">Athlete Management</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Recruitment</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Tournaments</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="max-w-6xl mx-auto border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
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
