import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../../api/axios";
import { loginSuccess } from "../authSlice";
import { Form, Input, ConfigProvider, theme, Card } from "antd";
import { 
    MailOutlined, 
    LockOutlined, 
    CheckCircleFilled,
    SunOutlined,
    MoonOutlined
} from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState(false);
    const { themeMode, toggleTheme } = useTheme();

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            setApiError("");

            const res = await api.post("/auth/login", {
                email: values.email,
                password: values.password
            });

            localStorage.setItem("token", res.data.token);

            dispatch(loginSuccess({
                user: res.data.user,
                token: res.data.token
            }));

            setSuccess(true);
            setTimeout(() => {
                const user = res.data.user;
                if (user?.role === "athlete" && !user?.isProfileCompleted) {
                    navigate("/athlete/profile");
                } else if (user?.role === "organization" && !user?.isProfileCompleted) {
                    navigate("/organization/profile");
                } else {
                    navigate("/dashboard");
                }
            }, 1500);

        } catch (err) {
            setApiError(
                err.response?.data?.message ||
                "Login failed. Please check your credentials and try again."
            );
        } finally {
            setLoading(false);
        }
    };

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
                controlHeight: 38,
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
            <div className="min-h-screen lg:h-screen w-full flex flex-col bg-bg-base text-text-primary font-sans overflow-y-auto lg:overflow-hidden transition-colors duration-200">
                
                {/* Navbar Header (Fixed 52px height) */}
                <header className="h-13 shrink-0 w-full flex items-center justify-between px-4 sm:px-10 bg-bg-surface border-b border-border-subtle z-20">
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
                        <Link to="/register" className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
                            Create Account
                        </Link>
                    </div>
                </header>

                {/* Main Content Split */}
                <div className="flex-grow flex flex-col lg:flex-row w-full lg:h-[calc(100vh-52px)]">
                    
                    {/* Left Side Banner (Desktop Only) */}
                    <div className="relative z-0 hidden lg:flex w-full lg:w-1/2 flex-col justify-between p-8 lg:p-12 bg-bg-surface text-text-primary border-b lg:border-b-0 lg:border-r border-border-subtle overflow-hidden h-full">
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
                                <span>ATHLETIX ECOSYSTEM</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-[38px] font-extrabold tracking-tight leading-[1.1] text-text-primary mb-3">
                                Welcome Back.
                            </h1>

                            <p className="text-xs text-text-secondary leading-relaxed font-normal max-w-sm mb-6">
                                Access your athlete, team, and competition management workspace with real-time analytics and scouting insights.
                            </p>

                            <ul className="space-y-2.5">
                                <li className="flex items-start space-x-2.5 text-xs">
                                    <svg className="w-3.5 h-3.5 text-text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium text-text-primary leading-snug">Longitudinal Athlete Metrics & Biometrics</span>
                                </li>
                                <li className="flex items-start space-x-2.5 text-xs">
                                    <svg className="w-3.5 h-3.5 text-text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium text-text-primary leading-snug">Scouting & Recruitment Callouts</span>
                                </li>
                                <li className="flex items-start space-x-2.5 text-xs">
                                    <svg className="w-3.5 h-3.5 text-text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium text-text-primary leading-snug">Tournament Brackets & Automated Fixtures</span>
                                </li>
                                <li className="flex items-start space-x-2.5 text-xs">
                                    <svg className="w-3.5 h-3.5 text-text-primary mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="font-medium text-text-primary leading-snug">Role-Based Secure Multi-Tenant Portals</span>
                                </li>
                            </ul>
                        </div>

                        <div className="relative z-10 pt-4 border-t border-border-subtle/50 text-[9px] text-text-muted font-mono tracking-widest uppercase text-center lg:text-left shrink-0">
                            <span>Connecting Athletes, Teams, and Organizations</span>
                        </div>
                    </div>

                    {/* Right Side Form */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-bg-base flex-grow">
                        <div className="w-full max-w-[400px] py-4">
                            
                            {success ? (
                                <Card className="border border-border-subtle bg-bg-surface text-center shadow-sm rounded-xl py-6">
                                    <div className="mx-auto w-10 h-10 bg-status-success/10 text-status-success rounded-full flex items-center justify-center mb-3">
                                        <CheckCircleFilled className="text-base" />
                                    </div>
                                    <h2 className="text-sm font-bold text-text-primary mb-1">Welcome Back!</h2>
                                    <p className="text-text-secondary text-xs mb-4">Login successful. Loading your sports workspace...</p>
                                    <div className="flex items-center justify-center space-x-2 text-text-primary font-semibold text-xs tracking-wider font-mono">
                                        <span className="animate-spin h-3.5 w-3.5 border-2 border-text-primary border-t-transparent rounded-full" />
                                        <span>Redirecting...</span>
                                    </div>
                                </Card>
                            ) : (
                                <div className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl p-5 sm:p-6">
                                    
                                    <div className="mb-4">
                                        <h2 className="text-lg font-bold text-text-primary tracking-tight">
                                            Sign In
                                        </h2>
                                        <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">
                                            Access your account and continue your sporting journey.
                                        </p>
                                    </div>

                                    {apiError && (
                                        <div className="mb-3 p-2.5 bg-status-danger/10 border border-status-danger/20 rounded-lg text-xs text-status-danger font-medium">
                                            {apiError}
                                        </div>
                                    )}

                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={handleSubmit}
                                        requiredMark={false}
                                    >
                                        <Form.Item
                                            name="email"
                                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Email Address</span>}
                                            rules={[
                                                { required: true, message: "Please enter your email" },
                                                { type: "email", message: "Please enter a valid email address" }
                                            ]}
                                            className="mb-3"
                                        >
                                            <Input placeholder="name@domain.com" prefix={<MailOutlined className="text-text-secondary/50 mr-1" />} autoComplete="email" />
                                        </Form.Item>

                                        <Form.Item
                                            name="password"
                                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Password</span>}
                                            rules={[{ required: true, message: "Please enter your password" }]}
                                            className="mb-3"
                                        >
                                            <Input.Password placeholder="••••••••" prefix={<LockOutlined className="text-text-secondary/50 mr-1" />} autoComplete="current-password" />
                                        </Form.Item>

                                        <Form.Item className="mt-5 mb-2">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full h-9 bg-[#1A1A1A] text-white hover:bg-[#333333] dark:bg-white dark:text-[#0A0A0A] dark:hover:bg-[#E5E5E5] font-bold text-xs rounded-md shadow-sm transition-all cursor-pointer flex items-center justify-center"
                                            >
                                                {loading ? <span className="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full" /> : "Sign In"}
                                            </button>
                                        </Form.Item>

                                        <div className="text-center pt-1">
                                            <span className="text-xs text-text-secondary">Don't have an account? </span>
                                            <Link to="/register" className="text-xs font-semibold text-text-primary hover:underline">
                                                Sign Up
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

export default Login;
