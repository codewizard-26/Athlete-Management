import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../../../api/axios";
import { loginSuccess } from "../authSlice";
import { Form, Input, Button, ConfigProvider, theme, Card } from "antd";
import { 
    MailOutlined, 
    LockOutlined, 
    CheckCircleFilled
} from "@ant-design/icons";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState(false);
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
            <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-bg-base text-text-primary font-sans overflow-x-hidden lg:overflow-hidden transition-colors duration-150 animate-fadeIn">
                
                {/* Left Side Banner */}
                <div className="relative z-0 w-full lg:w-5/12 flex flex-col justify-between p-8 sm:p-10 lg:p-16 bg-[#0B0E14] text-white border-b lg:border-b-0 lg:border-r border-border-subtle overflow-hidden min-h-[30vh] lg:min-h-0 lg:h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0B0E14] via-[#121826] to-[#0B0E14] -z-20" />
                    
                    <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none -z-10" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none -z-10" />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] -z-10">
                        <svg className="w-4/5 h-4/5 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                            <rect x="5" y="5" width="90" height="90" rx="3" strokeWidth="0.6" />
                            <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.6" />
                            <circle cx="50" cy="50" r="15" strokeWidth="0.6" />
                            <rect x="30" y="5" width="40" height="15" strokeWidth="0.6" />
                            <rect x="30" y="80" width="40" height="15" strokeWidth="0.6" />
                        </svg>
                    </div>

                    {/* Brand Header */}
                    <div className="relative z-10 flex items-center space-x-3">
                        <div className="h-9 w-9 rounded bg-brand-primary flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-base font-bold tracking-wider text-white uppercase leading-none block">APEX</span>
                            <span className="text-[8px] uppercase tracking-widest block text-brand-primary font-semibold">Athlete Management Platform</span>
                        </div>
                    </div>

                    {/* Headline and Description */}
                    <div className="relative z-10 my-auto py-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white mb-4">
                            Welcome Back.
                        </h1>
                        <h2 className="text-xs sm:text-sm font-semibold text-brand-primary mb-3 leading-normal">
                            Access your athlete, team, and competition management workspace.
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mb-6 sm:mb-8">
                            Sign in to manage athlete profiles, recruitment drives, tournaments, matches, and performance analytics.
                        </p>

                        <div className="space-y-2.5">
                            <div className="flex items-center space-x-2 text-xs text-slate-300">
                                <span className="text-brand-secondary font-bold shrink-0">✓</span>
                                <span>Athlete Profile Management</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-300">
                                <span className="text-brand-secondary font-bold shrink-0">✓</span>
                                <span>Team Recruitment</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-300">
                                <span className="text-brand-secondary font-bold shrink-0">✓</span>
                                <span>Tournament Management</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-300">
                                <span className="text-brand-secondary font-bold shrink-0">✓</span>
                                <span>Performance Analytics</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-4 flex items-center space-x-2 text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
                        <span>Connecting Athletes, Teams, and Organizations</span>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-8 lg:py-6 lg:px-12 bg-bg-base lg:h-full lg:overflow-y-auto">
                    <div className="w-full max-w-[440px]">
                        
                        {success ? (
                            <Card className="border border-brand-secondary/20 bg-bg-surface text-center shadow-sm rounded-xl py-8">
                                <div className="mx-auto w-12 h-12 bg-brand-secondary/10 text-brand-secondary rounded-full flex items-center justify-center mb-4">
                                    <CheckCircleFilled className="text-lg" />
                                </div>
                                <h2 className="text-base font-bold text-text-primary mb-1">Welcome Back!</h2>
                                <p className="text-text-secondary text-xs mb-6">Login successful. Loading your sports workspace...</p>
                                <div className="flex items-center justify-center space-x-2 text-brand-primary font-semibold text-xs tracking-wider">
                                    <span className="animate-spin h-4 w-4 border-2 border-brand-primary border-t-transparent rounded-full" />
                                    <span>Redirecting...</span>
                                </div>
                            </Card>
                        ) : (
                            <Card className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl p-2">
                                
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-text-primary tracking-tight">
                                        Sign In
                                    </h2>
                                    <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                                        Access your account and continue your sporting journey.
                                    </p>
                                </div>

                                {apiError && (
                                    <div className="mb-4 p-3 bg-status-error/5 border border-status-error/15 rounded-lg text-xs text-status-error">
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
                                    >
                                        <Input placeholder="name@domain.com" prefix={<MailOutlined className="text-text-secondary/50 mr-1" />} />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Password</span>}
                                        rules={[{ required: true, message: "Please enter your password" }]}
                                    >
                                        <Input.Password placeholder="••••••••" prefix={<LockOutlined className="text-text-secondary/50 mr-1" />} />
                                    </Form.Item>

                                    <Form.Item className="mt-6 mb-2">
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={loading} 
                                            className="w-full font-semibold text-xs h-10 rounded-md cursor-pointer"
                                        >
                                            Sign In
                                        </Button>
                                    </Form.Item>
                                </Form>

                                <div className="mt-4 text-center">
                                    <p className="text-xs text-text-secondary">
                                        Don't have an account?{" "}
                                        <Link to="/register" className="text-brand-primary hover:text-brand-primary-hover font-semibold">
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
}

export default Login;
