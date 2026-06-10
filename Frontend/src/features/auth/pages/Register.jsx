import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { Form, Input, Button, ConfigProvider, theme } from "antd";
import { 
    UserOutlined, 
    MailOutlined, 
    PhoneOutlined, 
    LockOutlined, 
    TeamOutlined, 
    TrophyOutlined, 
    ArrowRightOutlined,
    CheckCircleFilled
} from "@ant-design/icons";

function Register() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [success, setSuccess] = useState(false);

    // Watch the role form field to dynamically style and update elements
    const role = Form.useWatch("role", form) || "athlete";

    // Ant Design theme configuration for a professional sports database portal
    const portalTheme = {
        algorithm: theme.defaultAlgorithm,
        token: {
            colorPrimary: "#2563eb", // Sports corporate blue
            colorBgContainer: "#ffffff",
            colorBorder: "#cbd5e1", // Slate-300
            colorText: "#1e293b", // Slate-800
            colorTextSecondary: "#475569", // Slate-600
            borderRadius: 6,
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
            colorInputPlaceholder: "#94a3b8",
        },
        components: {
            Input: {
                colorBgContainer: "#ffffff",
                activeBorderColor: "#2563eb",
                hoverBorderColor: "rgba(37, 99, 235, 0.5)",
                colorBorder: "#cbd5e1",
                paddingBlock: 10,
            },
            Button: {
                colorPrimary: "#2563eb",
                colorPrimaryHover: "#1d4ed8",
                colorPrimaryActive: "#1e40af",
                borderRadius: 6,
                controlHeight: 46,
                fontWeight: 600,
            },
            Form: {
                itemMarginBottom: 16, // Clean spacing without compounding margins
            }
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            setApiError("");

            // Directly post core authentication fields aligned with the backend User model
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
            }, 3000);

        } catch (err) {
            setApiError(
                err.response?.data?.message ||
                "Registration failed. Please check your credentials and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Dynamic Header values for the Registration Card depending on the selected role
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
                subtitle: "Create teams, organize tournaments, manage matches, record athlete performances, and oversee sporting operations from a single platform."
            };
        }
        return {
            title: "Create Your Account",
            subtitle: "Join the platform and begin your sporting journey."
        };
    };

    const cardHeader = getCardHeader();

    return (
        <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] text-slate-800 font-sans overflow-x-hidden lg:overflow-hidden">
            
            {/* Left Side: Supporting Branding Banner (Professional Dark Blue Corporate Theme) */}
            <div className="relative z-0 w-full lg:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-16 bg-[#0b0f19] text-white border-b lg:border-b-0 lg:border-r border-slate-900/40 overflow-hidden min-h-[30vh] lg:min-h-0 lg:h-full">
                
                {/* Sports Themed Dark Background Stadium lights gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0b1224] via-[#080d1a] to-[#04060b] -z-20" />
                
                {/* Subtle light glow elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none -z-10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none -z-10" />

                {/* Subtle tactical sports field vector overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] -z-10">
                    <svg className="w-4/5 h-4/5 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <rect x="5" y="5" width="90" height="90" rx="3" strokeWidth="0.6" />
                        <line x1="5" y1="50" x2="95" y2="50" strokeWidth="0.6" />
                        <circle cx="50" cy="50" r="15" strokeWidth="0.6" />
                        <rect x="30" y="5" width="40" height="15" strokeWidth="0.6" />
                        <rect x="30" y="80" width="40" height="15" strokeWidth="0.6" />
                        <circle cx="50" cy="12" r="1.2" fill="currentColor" />
                        <circle cx="50" cy="88" r="1.2" fill="currentColor" />
                    </svg>
                </div>

                {/* Brand Header */}
                <div className="relative z-10 flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/35">
                        <svg className="w-5.5 h-5.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-lg font-black tracking-wide text-white uppercase">APEX</span>
                        <span className="text-[9px] uppercase tracking-widest block text-blue-400 font-bold -mt-1">Athlete Management Platform</span>
                    </div>
                </div>

                {/* Headline and Description */}
                <div className="relative z-10 my-auto py-6 lg:py-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white mb-4 lg:mb-5">
                        Discover Talent.<br />
                        Develop Athletes.<br />
                        Manage Competitions.
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mb-6 lg:mb-8">
                        A complete athlete management platform connecting athletes, teams, organizations, tournaments, recruitment, matches, and performance analytics in one unified ecosystem.
                    </p>

                    {/* Clean Professional Bullet Features */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2.5 text-[11px] sm:text-xs text-slate-300">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>Athlete Profile Management</span>
                        </div>
                        <div className="flex items-center space-x-2.5 text-[11px] sm:text-xs text-slate-300">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>Team Recruitment & Applications</span>
                        </div>
                        <div className="flex items-center space-x-2.5 text-[11px] sm:text-xs text-slate-300">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>Tournament & Match Management</span>
                        </div>
                        <div className="flex items-center space-x-2.5 text-[11px] sm:text-xs text-slate-300">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>Performance Tracking & Analytics</span>
                        </div>
                    </div>
                </div>

                {/* Footer Brand Info - Professional sports tagline */}
                <div className="relative z-10 pt-4 flex items-center space-x-2 text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                    <span>Connecting Athletes, Teams, and Organizations</span>
                </div>
            </div>

            {/* Right Side: Primary Registration Form Panel (Clean, Light Theme) */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-4 sm:p-8 lg:py-6 lg:px-12 bg-[#f8fafc] lg:h-full lg:overflow-y-auto">
                <div className="w-full max-w-[480px]">
                    
                    {success ? (
                        <div className="bg-white p-6 sm:p-8 rounded-xl border border-emerald-200 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
                            <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-5">
                                <CheckCircleFilled className="text-xl" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">Registration Successful</h2>
                            <p className="text-slate-500 text-xs mb-6">Your registration profile has been recorded in the platform database.</p>
                            <div className="flex items-center justify-center space-x-2 text-blue-600 font-semibold text-xs tracking-wider">
                                <span className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                                <span>Redirecting to login portal...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-5 sm:p-8 rounded-xl border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                            
                            <div className="mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight transition-all duration-300">
                                    {cardHeader.title}
                                </h2>
                                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed transition-all duration-300 min-h-[36px]">
                                    {cardHeader.subtitle}
                                </p>
                            </div>

                            {/* Alert for Backend errors */}
                            {apiError && (
                                <div className="mb-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold animate-fade-in">
                                    {apiError}
                                </div>
                            )}

                            {/* Ant Design wrapper with portalTheme configuration */}
                            <ConfigProvider theme={portalTheme}>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={handleSubmit}
                                    requiredMark={false}
                                >
                                    {/* Role Selector Buttons Container (Responsive side-by-side grid) */}
                                    <div className="mb-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            
                                            {/* Athlete Card */}
                                            <button
                                                type="button"
                                                onClick={() => form.setFieldValue("role", "athlete")}
                                                className={`flex items-center justify-between p-3.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                                                    role === "athlete"
                                                        ? "border-blue-600 bg-blue-50/40 text-blue-900 font-semibold shadow-sm"
                                                        : "border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300 hover:bg-slate-100/30"
                                                }`}
                                            >
                                                <div className="flex items-center space-x-2.5">
                                                    <TeamOutlined className={`text-base ${role === 'athlete' ? 'text-blue-600' : 'text-slate-400'}`} />
                                                    <span className="text-xs">Athlete</span>
                                                </div>
                                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${role === 'athlete' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
                                                    {role === 'athlete' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </div>
                                            </button>

                                            {/* Organization Card */}
                                            <button
                                                type="button"
                                                onClick={() => form.setFieldValue("role", "organization")}
                                                className={`flex items-center justify-between p-3.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                                                    role === "organization"
                                                        ? "border-blue-600 bg-blue-50/40 text-blue-900 font-semibold shadow-sm"
                                                        : "border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300 hover:bg-slate-100/30"
                                                }`}
                                            >
                                                <div className="flex items-center space-x-2.5">
                                                    <TrophyOutlined className={`text-base ${role === 'organization' ? 'text-blue-600' : 'text-slate-400'}`} />
                                                    <span className="text-xs">Organization</span>
                                                </div>
                                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${role === 'organization' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
                                                    {role === 'organization' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Role Form Item (Hidden input to maintain state tracking in Form instance) */}
                                    <Form.Item 
                                        name="role" 
                                        initialValue="athlete"
                                        rules={[{ required: true }]}
                                        className="hidden"
                                    >
                                        <Input type="hidden" />
                                    </Form.Item>

                                    {/* Primary Common Fields Block */}
                                    <div className="space-y-4 animate-fade-in">
                                        {/* Name (Adapts label dynamically depending on selected role) */}
                                        <Form.Item
                                            name="name"
                                            label={<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{role === 'athlete' ? 'Full Name' : 'Organization Name'}</span>}
                                            rules={[
                                                { required: true, message: role === 'athlete' ? "Full name is required" : "Organization name is required" },
                                                { min: 2, message: "Name must be at least 2 characters" }
                                            ]}
                                        >
                                            <Input 
                                                prefix={<UserOutlined className="text-slate-400 mr-2" />} 
                                                placeholder={role === 'athlete' ? "Enter your full name" : "Enter organization name"} 
                                                className="w-full"
                                            />
                                        </Form.Item>

                                        {/* Email Address Field */}
                                        <Form.Item
                                            name="email"
                                            label={<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</span>}
                                            rules={[
                                                { required: true, message: "Email address is required" },
                                                { type: "email", message: "Please enter a valid email address" }
                                            ]}
                                        >
                                            <Input 
                                                prefix={<MailOutlined className="text-slate-400 mr-2" />} 
                                                placeholder="name@domain.com" 
                                                className="w-full"
                                            />
                                        </Form.Item>

                                        {/* Phone Number Field */}
                                        <Form.Item
                                            name="phoneNumber"
                                            label={<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</span>}
                                            rules={[
                                                { required: true, message: "Phone number is required" },
                                                { pattern: /^\+?[0-9]{10,15}$/, message: "Enter a valid phone number (10-15 digits)" }
                                            ]}
                                        >
                                            <Input 
                                                prefix={<PhoneOutlined className="text-slate-400 mr-2" />} 
                                                placeholder="E.g. +1555000000" 
                                                className="w-full"
                                            />
                                        </Form.Item>

                                        {/* Password Field */}
                                        <Form.Item
                                            name="password"
                                            label={<span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Password</span>}
                                            rules={[
                                                { required: true, message: "Password is required" },
                                                { min: 6, message: "Password must be at least 6 characters" }
                                            ]}
                                        >
                                            <Input.Password 
                                                prefix={<LockOutlined className="text-slate-400 mr-2" />} 
                                                placeholder="••••••••" 
                                                className="w-full"
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* Submit Button */}
                                    <Form.Item className="pt-2 mb-0">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            icon={!loading && <ArrowRightOutlined />}
                                            iconPosition="end"
                                            className="w-full uppercase tracking-wider shadow-sm"
                                        >
                                            {loading ? "Creating Account..." : "Create Account"}
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </ConfigProvider>

                            {/* Login Redirect */}
                            <div className="mt-4 text-center border-t border-slate-100 pt-4">
                                <p className="text-slate-500 text-xs">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="text-blue-600 hover:text-blue-700 font-bold transition-colors ml-1 inline-flex items-center space-x-0.5 group"
                                    >
                                        <span>Sign In</span>
                                        <ArrowRightOutlined className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5" />
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;