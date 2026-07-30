import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api/axios";
import { Form, Input, Radio, Card, ConfigProvider, theme } from "antd";
import { 
    UserOutlined, 
    MailOutlined, 
    PhoneOutlined, 
    LockOutlined, 
    CheckCircleFilled,
    SunOutlined,
    MoonOutlined
} from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";

const Register = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState(false);
    const { themeMode, toggleTheme } = useTheme();

    const role = Form.useWatch("role", form) || "athlete";

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            setApiError("");

            await api.post("/auth/register", {
                name: values.name,
                email: values.email,
                phoneNumber: values.phoneNumber,
                password: values.password,
                role: values.role
            });

            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 2500);

        } catch (err) {
            setApiError(
                err.response?.data?.message ||
                "Registration failed. Please check your credentials and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const getCardHeader = () => {
        if (role === "athlete") {
            return {
                title: "Create Your Athlete Profile",
                subtitle: "Showcase your talent, join teams, compete in tournaments, and track your performance throughout your sporting journey."
            };
        }
        if (role === "organization") {
            return {
                title: "Register Your Organization",
                subtitle: "Create teams, organize tournaments, manage matches, record athlete performances, and oversee sporting operations."
            };
        }
        return {
            title: "Create Your Account",
            subtitle: "Join the platform and begin your sporting journey."
        };
    };

    const cardHeader = getCardHeader();

    const antdTheme = {
        algorithm: themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: themeMode === "dark" ? "#FFFFFF" : "#1A1A1A",
            colorBgLayout: "transparent",
            colorBgContainer: themeMode === "dark" ? "#121212" : "#FFFFFF",
            colorBorder: themeMode === "dark" ? "#222222" : "#E5E3DC",
            colorText: themeMode === "dark" ? "#EDEDED" : "#1A1A1A",
            colorTextSecondary: themeMode === "dark" ? "#888888" : "#555555",
            borderRadius: 6,
            fontFamily: "Geist, -apple-system, BlinkMacSystemFont, sans-serif",
        },
        components: {
            Button: {
                borderRadius: 6,
                controlHeight: 36,
                fontWeight: 600,
                boxShadow: "none",
                colorTextLightSolid: themeMode === "dark" ? "#0A0A0A" : "#FFFFFF",
            },
            Card: {
                borderRadius: 8,
            },
            Input: {
                colorText: themeMode === "dark" ? "#EDEDED" : "#1A1A1A",
                colorTextPlaceholder: themeMode === "dark" ? "#666666" : "#777777",
                colorBgContainer: themeMode === "dark" ? "#161616" : "#F4F2EC",
                colorBorder: themeMode === "dark" ? "#222222" : "#E5E3DC",
            }
        }
    };

    return (
        <ConfigProvider theme={antdTheme}>
            <div className="h-screen max-h-screen w-full flex flex-col bg-bg-base text-text-primary font-sans overflow-hidden transition-colors duration-200">
                
                {/* Navbar Header (Fixed 52px height) */}
                <header className="h-13 shrink-0 w-full flex items-center justify-between px-6 sm:px-10 bg-bg-surface border-b border-border-subtle z-20">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="h-7 w-7 rounded-lg bg-[#1A1A1A] dark:bg-white text-white dark:text-[#0A0A0A] flex items-center justify-center shadow-sm shrink-0">
                            <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 fill-current">
                                <path d="M50 15 L15 85 L32 85 L50 45 L68 85 L85 85 Z" />
                                <path d="M38 65 L62 65" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
                            </svg>
                        </div>
                        <span className="text-sm font-extrabold tracking-wider text-text-primary uppercase">ATHLETIX</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={toggleTheme}
                            className="p-1.5 rounded-md bg-bg-elevated hover:bg-bg-inset text-text-primary border border-border-subtle transition-all cursor-pointer flex items-center justify-center"
                            title="Toggle Light/Dark Theme"
                        >
                            {themeMode === "dark" ? <SunOutlined className="text-amber-400 text-xs" /> : <MoonOutlined className="text-slate-600 text-xs" />}
                        </button>
                        <Link to="/login" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
                            Sign In
                        </Link>
                    </div>
                </header>

                {/* Main Content Split */}
                <div className="flex-grow flex flex-col lg:flex-row w-full h-[calc(100vh-52px)] overflow-hidden">
                    
                    {/* Left Side Banner */}
                    <div className="relative z-0 w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-bg-surface text-text-primary border-b lg:border-b-0 lg:border-r border-border-subtle overflow-hidden h-full">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

                        {/* Centered Pitch Watermark Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] dark:opacity-[0.07] z-0">
                            <svg className="w-3/4 h-3/4 text-text-primary" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                                <rect x="5" y="5" width="90" height="90" rx="3" strokeWidth="0.6" />
                                <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.6" />
                                <circle cx="50" cy="50" r="15" strokeWidth="0.6" />
                                <rect x="30" y="5" width="40" height="15" strokeWidth="0.6" />
                                <rect x="30" y="80" width="40" height="15" strokeWidth="0.6" />
                            </svg>
                        </div>

                        {/* Optical Center Aligned Text Block */}
                        <div className="relative z-10 my-auto max-w-md w-full mx-auto flex flex-col justify-center py-2">
                            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-md bg-bg-elevated border border-border-subtle text-text-secondary text-[10px] font-mono font-semibold uppercase tracking-widest w-fit mb-3">
                                <span>JOIN THE PLATFORM</span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight leading-[1.15] text-text-primary mb-3">
                                Discover Talent.<br />
                                Develop Athletes.<br />
                                Manage Competitions.
                            </h1>

                            <p className="text-xs text-text-secondary leading-relaxed font-normal max-w-sm mb-5">
                                A complete athlete management platform connecting athletes, teams, organizations, tournaments, recruitment, matches, and performance analytics.
                            </p>

                            <ul className="space-y-2.5">
                                <li className="flex items-start space-x-2.5 text-xs">
                                    <svg className="w-3.5 h-3.5 text-text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium text-text-primary leading-snug">Athlete Profile Management & Showcases</span>
                                </li>
                                <li className="flex items-start space-x-2.5 text-xs">
                                    <svg className="w-3.5 h-3.5 text-text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium text-text-primary leading-snug">Team Recruitment Drives & Applications</span>
                                </li>
                                <li className="flex items-start space-x-2.5 text-xs">
                                    <svg className="w-3.5 h-3.5 text-text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium text-text-primary leading-snug">Tournament Brackets & League Schedules</span>
                                </li>
                                <li className="flex items-start space-x-2.5 text-xs">
                                    <svg className="w-3.5 h-3.5 text-text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium text-text-primary leading-snug">Longitudinal Performance Tracking</span>
                                </li>
                            </ul>
                        </div>

                        <div className="relative z-10 pt-4 border-t border-border-subtle/50 text-[9px] text-text-muted font-mono tracking-widest uppercase text-center lg:text-left shrink-0">
                            <span>Connecting Athletes, Teams, and Organizations</span>
                        </div>
                    </div>

                    {/* Right Side Form */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-bg-base h-full overflow-y-auto lg:overflow-hidden">
                        <div className="w-full max-w-[420px]">
                            
                            {success ? (
                                <div className="border border-border-subtle bg-bg-surface text-center shadow-sm rounded-xl py-6 animate-fadeIn">
                                    <div className="mx-auto w-10 h-10 bg-status-success/10 text-status-success rounded-full flex items-center justify-center mb-3">
                                        <CheckCircleFilled className="text-base" />
                                    </div>
                                    <h2 className="text-sm font-bold text-text-primary mb-1">Registration Successful</h2>
                                    <p className="text-text-secondary text-xs mb-4">Your account has been created. Redirecting to login...</p>
                                    <div className="flex items-center justify-center space-x-2 text-text-primary font-semibold text-xs tracking-wider font-mono">
                                        <span className="animate-spin h-3.5 w-3.5 border-2 border-text-primary border-t-transparent rounded-full" />
                                        <span>Redirecting...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl p-4 sm:p-5">
                                    
                                    {/* Smooth Motion Header Header with Fixed Height Budget */}
                                    <div className="mb-3 min-h-[48px] flex flex-col justify-center">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={role}
                                                initial={{ opacity: 0, y: 3 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -3 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                            >
                                                <h2 className="text-base font-bold text-text-primary tracking-tight">
                                                    {cardHeader.title}
                                                </h2>
                                                <p className="text-text-secondary text-[11px] mt-0.5 leading-snug">
                                                    {cardHeader.subtitle}
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {apiError && (
                                        <div className="mb-3 p-2 bg-status-danger/10 border border-status-danger/20 rounded-lg text-xs text-status-danger font-medium">
                                            {apiError}
                                        </div>
                                    )}

                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={handleSubmit}
                                        requiredMark={false}
                                        initialValues={{ role: "athlete" }}
                                    >
                                        <Form.Item name="role" className="mb-3">
                                            <Segmented
                                                block
                                                options={[
                                                    { label: "Athlete", value: "athlete" },
                                                    { label: "Team Manager", value: "team" },
                                                    { label: "Organization", value: "organization" }
                                                ]}
                                                className="w-full text-xs font-semibold uppercase tracking-wider"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="name"
                                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Full Name / Org Name</span>}
                                            rules={[{ required: true, message: "Please enter your name" }]}
                                            className="mb-2"
                                        >
                                            <Input placeholder="e.g. Alex Morgan or Apex Club" prefix={<UserOutlined className="text-text-secondary/50 mr-1 text-xs" />} />
                                        </Form.Item>

                                        <Form.Item
                                            name="email"
                                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Email Address</span>}
                                            rules={[
                                                { required: true, message: "Please enter your email" },
                                                { type: "email", message: "Please enter a valid email" }
                                            ]}
                                            className="mb-2"
                                        >
                                            <Input placeholder="name@domain.com" prefix={<MailOutlined className="text-text-secondary/50 mr-1 text-xs" />} />
                                        </Form.Item>

                                        <Form.Item
                                            name="phoneNumber"
                                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Phone Number</span>}
                                            rules={[{ required: true, message: "Please enter your phone number" }]}
                                            className="mb-2"
                                        >
                                            <Input placeholder="+1 (555) 000-0000" prefix={<PhoneOutlined className="text-text-secondary/50 mr-1 text-xs" />} />
                                        </Form.Item>

                                        <Form.Item
                                            name="password"
                                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Password</span>}
                                            rules={[{ required: true, message: "Please enter a password" }]}
                                            className="mb-3"
                                        >
                                            <Input.Password placeholder="••••••••" prefix={<LockOutlined className="text-text-secondary/50 mr-1 text-xs" />} />
                                        </Form.Item>

                                        <Form.Item className="mt-3 mb-2">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full h-9 bg-[#1A1A1A] text-white hover:bg-[#333333] dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#E5E5E5] font-bold text-xs rounded-md shadow-sm transition-all cursor-pointer flex items-center justify-center"
                                            >
                                                {loading ? <span className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full" /> : "Create Account"}
                                            </button>
                                        </Form.Item>

                                        <div className="text-center pt-0.5">
                                            <span className="text-xs text-text-secondary">Already have an account? </span>
                                            <Link to="/login" className="text-xs font-semibold text-text-primary hover:underline">
                                                Sign In
                                            </Link>
                                        </div>
                                    </Form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
}

export default Register;