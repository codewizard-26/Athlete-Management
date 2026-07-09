import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform ,} from "framer-motion";
import CountUpPkg from "react-countup";
const CountUp = CountUpPkg.default ? CountUpPkg.default : CountUpPkg;
import { 
    TrophyOutlined as Trophy, TeamOutlined as Users, UserOutlined as User, BarChartOutlined as Activity, CalendarOutlined as Calendar, SafetyOutlined as ShieldCheck,
    ArrowRightOutlined as ArrowRight, RightOutlined as ChevronRight, CheckCircleOutlined as CheckCircle2, PlayCircleOutlined as Play, GlobalOutlined as Globe
} from "@ant-design/icons";

// Particle Background Component
const ParticleBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Glowing Orbs */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] rounded-full bg-[#2563EB]/20 blur-[120px]" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-[#06B6D4]/15 blur-[120px]" 
            />
            
            {/* Floating Particles Network */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>
    );
};

// Logo Animation Component
const AnimatedLogo = ({ isComplete }) => {
    return (
        <motion.div 
            className="relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 mb-8"
            initial={{ scale: 2, filter: "blur(20px)", opacity: 0 }}
            animate={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]">
                {/* Network nodes collapsing (only visible at start) */}
                {!isComplete && (
                    <motion.g
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 1.5, delay: 1.5 }}
                    >
                        <circle cx="20" cy="20" r="2" fill="#06B6D4" />
                        <circle cx="80" cy="30" r="2" fill="#06B6D4" />
                        <circle cx="10" cy="70" r="2" fill="#06B6D4" />
                        <circle cx="90" cy="80" r="2" fill="#06B6D4" />
                        <line x1="20" y1="20" x2="50" y2="10" stroke="#06B6D4" strokeWidth="0.5" />
                        <line x1="80" y1="30" x2="50" y2="10" stroke="#06B6D4" strokeWidth="0.5" />
                    </motion.g>
                )}

                {/* The "A" Logo */}
                <motion.path
                    d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z"
                    fill="url(#blue-gradient)"
                    initial={{ pathLength: 0, fillOpacity: 0 }}
                    animate={{ pathLength: 1, fillOpacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.path
                    d="M38 65 L62 65"
                    stroke="#06B6D4"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
                />
                <defs>
                    <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                </defs>
            </svg>
            
            {/* Core Glow */}
            <motion.div 
                className="absolute inset-0 bg-[#2563EB] rounded-full blur-[40px] -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 2, delay: 1 }}
            />
        </motion.div>
    );
};

function Home() {
    const [splashComplete, setSplashComplete] = useState(false);

    useEffect(() => {
        // Enforce dark theme for the landing page
        document.documentElement.classList.add("dark");
        document.body.style.backgroundColor = "#050816";
        document.body.style.color = "#FFFFFF";

        // Splash screen timing
        const timer = setTimeout(() => {
            setSplashComplete(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const features = [
        { icon: <Trophy style={{ fontSize: 24 }} />, title: "Tournament Management", desc: "Automate brackets, scheduling, and league standings effortlessly." },
        { icon: <Users style={{ fontSize: 24 }} />, title: "Team Recruitment", desc: "Discover top talent and manage applications with AI-driven insights." },
        { icon: <User style={{ fontSize: 24 }} />, title: "Athlete Profiles", desc: "Showcase stats, highlights, and career progression in one place." },
        { icon: <Activity style={{ fontSize: 24 }} />, title: "Performance Analytics", desc: "Track longitudinal data and key performance indicators." },
        { icon: <Calendar style={{ fontSize: 24 }} />, title: "Match Scheduling", desc: "Coordinate fixtures, referees, and venues seamlessly." },
        { icon: <ShieldCheck style={{ fontSize: 24 }} />, title: "Secure Authentication", desc: "Role-based access ensuring data privacy and security." }
    ];

    const workflowNodes = [
        "Organization",
        "Creates Tournament",
        "Teams Register",
        "Athletes Join",
        "Matches",
        "Performance Analytics"
    ];

    const stats = [
        { value: 5000, label: "Athletes" },
        { value: 500, label: "Teams" },
        { value: 120, label: "Organizations" },
        { value: 1000, label: "Matches" }
    ];

    const { scrollYProgress } = useScroll();
    const yTransform = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <div className="min-h-screen bg-[#050816] text-white font-sans overflow-hidden selection:bg-[#2563EB] selection:text-white">
            <ParticleBackground />

            {/* Navbar (Fades in after splash) */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: splashComplete ? 1 : 0, y: splashComplete ? 0 : -20 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-12 py-5 bg-[#050816]/60 backdrop-blur-xl border-b border-white/5"
            >
                <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 100 100">
                        <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" fill="#2563EB" />
                        <path d="M38 65 L62 65" stroke="#06B6D4" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                    <span className="text-xl font-bold tracking-widest text-white">ATHLETIX</span>
                </div>
                <div className="flex items-center space-x-6">
                    <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link to="/register" className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all">
                        Register
                    </Link>
                </div>
            </motion.header>

            {/* HERO SECTION */}
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-6 z-10">
                <AnimatedLogo isComplete={splashComplete} />

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: splashComplete ? 1 : 0, y: splashComplete ? 0 : 30 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-center max-w-4xl mx-auto space-y-6"
                >
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60">ATHLETIX</span>
                    </h1>
                    
                    <h2 className="text-xl sm:text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                        Connecting Talent. Teams. Tournaments.
                    </h2>
                    
                    <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        The complete platform for athlete recruitment, team management, tournament organization, match scheduling, and performance analytics.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link to="/register">
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(37,99,235,0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-8 py-3.5 bg-[#2563EB] text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                            >
                                Get Started <ArrowRight style={{ fontSize: 18 }} />
                            </motion.button>
                        </Link>
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-full flex items-center justify-center gap-2 backdrop-blur-md transition-all"
                            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                        >
                            Explore Platform
                        </motion.button>
                    </div>
                </motion.div>
            </section>

            {/* FEATURE SECTION */}
            <section className="py-32 px-6 sm:px-12 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#050816] to-[#0a0f25]">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
                            Powered for Performance
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Advanced tools engineered for the modern sports ecosystem.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -10, boxShadow: "0 10px 40px -10px rgba(37,99,235,0.3)", borderColor: "rgba(37,99,235,0.5)" }}
                                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl group transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Subtle Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#06B6D4] mb-6 group-hover:scale-110 group-hover:bg-[#2563EB]/20 transition-all duration-300">
                                    {feat.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-slate-100">{feat.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WORKFLOW SECTION */}
            <section className="py-32 px-6 sm:px-12 relative z-10 overflow-hidden bg-[#050816]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)]" />
                <div className="max-w-7xl mx-auto relative">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-white">
                            The Complete Journey
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            A seamless flow from organization setup to final match analytics.
                        </p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0 relative">
                        {/* Connecting Line (Desktop Base) */}
                        <div className="hidden md:block absolute top-[2rem] left-[2rem] right-[2rem] h-0.5 bg-white/10" />
                        
                        {/* Animated Connecting Line */}
                        <motion.div 
                            className="hidden md:block absolute top-[2rem] left-[2rem] right-[2rem] h-0.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] origin-left"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        />

                        {workflowNodes.map((node, idx) => (
                            <React.Fragment key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: 0.3 + idx * 0.2, type: "spring", stiffness: 100, damping: 15 }}
                                    className="relative z-10 w-full md:w-auto"
                                >
                                    <div className="flex flex-col items-center gap-4 group">
                                        <motion.div 
                                            whileHover={{ scale: 1.15 }}
                                            className="w-16 h-16 rounded-full bg-[#050816] border-2 border-[#2563EB]/50 flex items-center justify-center text-white relative group-hover:border-[#06B6D4] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300"
                                        >
                                            <span className="font-mono text-sm font-bold z-10">{`0${idx + 1}`}</span>
                                            
                                            {/* Pulse ring */}
                                            <motion.div 
                                                className="absolute inset-0 rounded-full border border-[#06B6D4]"
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0] }}
                                                transition={{ duration: 2.5, repeat: Infinity, delay: idx * 0.4 }}
                                            />
                                        </motion.div>
                                        <span className="text-sm font-bold text-slate-400 text-center w-32 group-hover:text-[#06B6D4] transition-colors">{node}</span>
                                    </div>
                                </motion.div>
                                
                                {/* Mobile connector */}
                                {idx < workflowNodes.length - 1 && (
                                    <motion.div 
                                        initial={{ scaleY: 0 }}
                                        whileInView={{ scaleY: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.4 + idx * 0.2 }}
                                        className="md:hidden h-10 w-0.5 bg-gradient-to-b from-[#2563EB] to-[#06B6D4] my-2 origin-top" 
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-24 px-6 sm:px-12 relative z-10 border-t border-b border-white/5 bg-[#0a0f25]/50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-3"
                            >
                                <div className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                    <CountUp 
                                        end={stat.value} 
                                        duration={2.5} 
                                        enableScrollSpy 
                                        scrollSpyOnce
                                        separator=","
                                    />
                                    <span className="text-[#06B6D4]">+</span>
                                </div>
                                <div className="text-sm sm:text-base font-medium text-slate-400 uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-40 px-6 sm:px-12 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(37,99,235,0.15)_0%,transparent_60%)] pointer-events-none" />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center p-12 sm:p-20 rounded-[3rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/10 backdrop-blur-sm relative"
                >
                    <div className="absolute inset-0 bg-[#2563EB]/5 blur-3xl -z-10 rounded-full" />
                    <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8 text-white">
                        Ready to Build the Future of Sports?
                    </h2>
                    <Link to="/register">
                        <motion.button 
                            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37,99,235,0.6)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-4 bg-white text-[#050816] font-bold text-lg rounded-full flex items-center justify-center gap-3 mx-auto transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-slate-100"
                        >
                            Launch Athletix <ArrowRight style={{ fontSize: 20 }} />
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 px-6 sm:px-12 border-t border-white/5 bg-[#03050c] relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6" viewBox="0 0 100 100">
                            <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" fill="#2563EB" />
                        </svg>
                        <span className="text-lg font-bold tracking-widest text-slate-300">ATHLETIX</span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-slate-500">
                        <a href="#" className="hover:text-white transition-colors"><Globe style={{ fontSize: 20 }} /></a>
                        <a href="#" className="hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>

                    <div className="text-sm text-slate-600">
                        © {new Date().getFullYear()} Athletix. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
