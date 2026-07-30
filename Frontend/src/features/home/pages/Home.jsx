import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import CountUpPkg from "react-countup";
const CountUp = CountUpPkg.default ? CountUpPkg.default : CountUpPkg;
import { 
    TrophyOutlined as Trophy, TeamOutlined as Users, UserOutlined as User, BarChartOutlined as Activity, CalendarOutlined as Calendar, SafetyOutlined as ShieldCheck,
    ArrowRightOutlined as ArrowRight, GlobalOutlined as Globe, SunOutlined, MoonOutlined
} from "@ant-design/icons";

// Official ATHLETIX "A" Emblem Component
export const AthletixEmblem = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" />
        <path d="M38 65 L62 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
    </svg>
);

// Interactive Kinetic Canvas Background Component
const KineticParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        // Mouse position for interaction
        const mouse = { x: width / 2, y: height / 2, active: false };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Generate particles
        const numParticles = Math.min(Math.floor(width / 22), 65);
        const particles = Array.from({ length: numParticles }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 1.8 + 1,
            alpha: Math.random() * 0.3 + 0.1,
        }));

        const render = () => {
            const isDark = document.documentElement.classList.contains("dark");
            ctx.clearRect(0, 0, width, height);

            const particleColor = isDark ? "255, 255, 255" : "30, 30, 30";
            const lineColor = isDark ? "255, 255, 255" : "40, 40, 40";

            // Update & Draw Particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Mouse interaction - gentle pull
                if (mouse.active) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 160) {
                        p.x += dx * 0.015;
                        p.y += dy * 0.015;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
                ctx.fill();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// Animated Hero "A" Emblem
const AnimatedHeroLogo = () => {
    return (
        <motion.div 
            className="relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Ambient Pulse Ring */}
            <motion.div 
                className="absolute inset-0 rounded-full border border-text-primary/20"
                animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* The Official "A" Logo with Path Drawing */}
            <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full text-text-primary flex items-center justify-center"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                    <motion.path
                        d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z"
                        fill="currentColor"
                        initial={{ pathLength: 0, fillOpacity: 0 }}
                        animate={{ pathLength: 1, fillOpacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M38 65 L62 65"
                        stroke="currentColor"
                        strokeWidth="7"
                        strokeLinecap="round"
                        opacity="0.6"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
                    />
                </svg>
            </motion.div>
        </motion.div>
    );
};

export default function Home() {
    const { themeMode, toggleTheme } = useTheme();

    const features = [
        { icon: <Trophy style={{ fontSize: 22 }} />, title: "Tournament Management", desc: "Automate brackets, scheduling, and league standings effortlessly." },
        { icon: <Users style={{ fontSize: 22 }} />, title: "Team Recruitment", desc: "Discover top talent and manage applications with AI-driven insights." },
        { icon: <User style={{ fontSize: 22 }} />, title: "Athlete Profiles", desc: "Showcase stats, highlights, and career progression in one place." },
        { icon: <Activity style={{ fontSize: 22 }} />, title: "Performance Analytics", desc: "Track longitudinal data and key performance indicators." },
        { icon: <Calendar style={{ fontSize: 22 }} />, title: "Match Scheduling", desc: "Coordinate fixtures, referees, and venues seamlessly." },
        { icon: <ShieldCheck style={{ fontSize: 22 }} />, title: "Secure Authentication", desc: "Role-based access ensuring data privacy and security." }
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
    const yTransform = useTransform(scrollYProgress, [0, 1], [0, -60]);

    return (
        <div className="min-h-screen bg-bg-base text-text-primary font-sans overflow-hidden relative">
            <KineticParticleCanvas />

            {/* Navbar */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-12 py-4 bg-bg-surface/90 backdrop-blur-md border-b border-border-subtle"
            >
                <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center shadow-sm shrink-0">
                        <AthletixEmblem className="w-4 h-4" />
                    </div>
                    <span className="text-base font-extrabold tracking-wider text-text-primary uppercase">ATHLETIX</span>
                </div>

                <div className="flex items-center space-x-4">
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-md bg-bg-elevated hover:bg-bg-inset text-text-primary border border-border-subtle transition-all cursor-pointer flex items-center justify-center"
                        title="Toggle Light/Dark Theme"
                    >
                        {themeMode === "dark" ? <SunOutlined className="text-amber-400 text-sm" /> : <MoonOutlined className="text-slate-600 text-sm" />}
                    </button>
                    <Link to="/login" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5">
                        Sign In
                    </Link>
                    <Link 
                        to="/register" 
                        className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#E5E5E5] rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        Register
                    </Link>
                </div>
            </motion.header>

            {/* HERO SECTION */}
            <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 z-10">
                <AnimatedHeroLogo />

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center max-w-3xl mx-auto space-y-6"
                >
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-text-primary uppercase">
                        ATHLETIX
                    </h1>
                    
                    <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-text-secondary">
                        Connecting Talent. Teams. Tournaments.
                    </h2>
                    
                    <p className="text-xs sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
                        The complete platform for athlete recruitment, team management, tournament organization, match scheduling, and performance analytics.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-6">
                        <Link to="/register" className="w-full sm:w-auto">
                            <motion.button 
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#F0F0F0] font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                                Get Started <ArrowRight style={{ fontSize: 14 }} />
                            </motion.button>
                        </Link>
                        <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto px-8 py-3.5 bg-bg-surface border border-border-subtle hover:border-text-primary/40 text-text-primary font-semibold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                        >
                            Explore Platform
                        </motion.button>
                    </div>
                </motion.div>
            </section>

            {/* FEATURE SECTION */}
            <section className="py-24 px-6 sm:px-12 relative z-10 border-t border-border-subtle bg-bg-surface">
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-text-primary">
                            Powered for Performance
                        </h2>
                        <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
                            Advanced tools engineered for the modern sports ecosystem.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08 }}
                                whileHover={{ y: -6, scale: 1.01 }}
                                className="p-6 rounded-lg bg-bg-base border border-border-subtle hover:border-border-hover transition-all duration-200"
                            >
                                <div className="w-10 h-10 rounded-md bg-bg-surface border border-border-subtle flex items-center justify-center text-text-primary mb-4 shadow-sm">
                                    {feat.icon}
                                </div>
                                <h3 className="text-base font-semibold mb-2 text-text-primary">{feat.title}</h3>
                                <p className="text-text-secondary text-xs leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WORKFLOW SECTION */}
            <section className="py-24 px-6 sm:px-12 relative z-10 overflow-hidden bg-bg-base">
                <div className="max-w-6xl mx-auto relative">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 text-text-primary">
                            The Complete Journey
                        </h2>
                        <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
                            A seamless flow from organization setup to final match analytics.
                        </p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative">
                        {/* Connecting Line (Desktop Base) */}
                        <div className="hidden md:block absolute top-[2rem] left-[2rem] right-[2rem] h-0.5 bg-border-subtle" />
                        
                        {/* Animated Connecting Line */}
                        <motion.div 
                            className="hidden md:block absolute top-[2rem] left-[2rem] right-[2rem] h-0.5 bg-text-primary origin-left"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        />

                        {workflowNodes.map((node, idx) => (
                            <React.Fragment key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + idx * 0.15 }}
                                    className="relative z-10 w-full md:w-auto"
                                >
                                    <div className="flex flex-col items-center gap-3 group">
                                        <motion.div 
                                            whileHover={{ scale: 1.1 }}
                                            className="w-14 h-14 rounded-full bg-bg-surface border-2 border-border-subtle flex items-center justify-center text-text-primary group-hover:border-text-primary transition-all duration-200 shadow-sm"
                                        >
                                            <span className="font-mono text-xs font-bold">{`0${idx + 1}`}</span>
                                        </motion.div>
                                        <span className="text-xs font-semibold text-text-secondary text-center w-28 group-hover:text-text-primary transition-colors">{node}</span>
                                    </div>
                                </motion.div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-20 px-6 sm:px-12 relative z-10 border-t border-b border-border-subtle bg-bg-surface">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="text-3xl sm:text-5xl font-black font-mono text-text-primary">
                                    <CountUp 
                                        end={stat.value} 
                                        duration={2} 
                                        enableScrollSpy 
                                        scrollSpyOnce
                                        separator=","
                                    />
                                    <span>+</span>
                                </div>
                                <div className="text-xs font-medium text-text-secondary uppercase tracking-wider font-mono">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-28 px-6 sm:px-12 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center p-8 sm:p-14 rounded-xl bg-bg-surface border border-border-subtle shadow-sm"
                >
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-6 text-text-primary">
                        Ready to Build the Future of Sports?
                    </h2>
                    <Link to="/register">
                        <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="px-8 py-3.5 bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#F0F0F0] font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2.5 mx-auto transition-all shadow-md hover:shadow-lg cursor-pointer"
                        >
                            Launch Athletix <ArrowRight style={{ fontSize: 16 }} />
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* FOOTER */}
            <footer className="py-8 px-6 sm:px-12 border-t border-border-subtle bg-bg-surface relative z-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-7 w-7 rounded-lg bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center shadow-sm shrink-0">
                            <AthletixEmblem className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-extrabold tracking-wider text-text-primary uppercase">ATHLETIX</span>
                    </div>
                    
                    <div className="flex items-center space-x-5 text-text-secondary">
                        <a href="#" className="hover:text-text-primary transition-colors"><Globe style={{ fontSize: 18 }} /></a>
                    </div>

                    <div className="text-xs text-text-secondary font-mono">
                        © {new Date().getFullYear()} Athletix. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
