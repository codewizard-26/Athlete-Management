import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, ConfigProvider, theme, message, Modal, Alert } from "antd";
import {
    TeamOutlined,
    TrophyOutlined,
    InfoCircleOutlined,
    LinkOutlined,
    CheckOutlined,
    ArrowLeftOutlined,
    MailOutlined,
    PhoneOutlined,
    CopyOutlined,
    CheckCircleFilled
} from "@ant-design/icons";
import api from "../../../api/axios";

const { TextArea } = Input;

function CreateTeam() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [credentials, setCredentials] = useState(null);

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
            },
            Input: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            },
            Select: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            }
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);

            // Prepare API payload matching POST /team/create schema requirements
            const payload = {
                teamName: values.teamName.trim(),
                sport: values.sport,
                ageCategory: values.ageCategory,
                description: values.description ? values.description.trim() : "",
                logo: values.logo ? values.logo.trim() : "",
                teamEmail: values.teamEmail.trim().toLowerCase(),
                teamPhone: values.teamPhone.trim()
            };

            const response = await api.post("/team/create", payload);

            if (response.data && response.data.teamLogin) {
                // Success: store credentials and display modal
                setCredentials(response.data.teamLogin);
                setModalVisible(true);
            } else {
                message.success("Team created successfully!");
                navigate("/organization/teams");
            }

        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to create team. Please verify details and try again.";
            message.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        message.success(`${type} copied to clipboard!`);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        navigate("/organization/teams");
    };

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="min-h-screen w-full bg-[#080b11] text-slate-100 font-sans selection:bg-blue-600 selection:text-white py-12 px-4 sm:px-6 lg:px-8">
                
                <div className="max-w-4xl mx-auto">
                    {/* Header bar / Breadcrumb */}
                    <div className="mb-6 flex items-center justify-between">
                        <Button 
                            type="text" 
                            icon={<ArrowLeftOutlined />} 
                            onClick={() => navigate("/dashboard")}
                            className="text-slate-400 hover:text-white flex items-center p-0 h-auto"
                        >
                            Back to Dashboard
                        </Button>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 mb-4">
                            <TeamOutlined className="text-xs text-blue-400" />
                            <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase font-sans">ROSTER CREATOR ENGINE</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                            Create Team
                        </h1>
                        <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Create a new team under your organization and start recruiting athletes.
                        </p>
                    </div>

                    {/* Form Card Container */}
                    <div className="bg-[#0f172a]/40 border border-white/[0.04] p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-md">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFormSubmit}
                            requiredMark={false}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                
                                {/* Section 1: Team General Details */}
                                <div className="space-y-6">
                                    <div className="border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                                        <TeamOutlined className="text-blue-500 text-base" />
                                        <h2 className="text-base font-bold text-white tracking-wide uppercase">1. Team Information</h2>
                                    </div>

                                    {/* Team Name */}
                                    <Form.Item
                                        name="teamName"
                                        label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team Name</span>}
                                        rules={[
                                            { required: true, message: "Team name is required" },
                                            { min: 2, message: "Name must be at least 2 characters" }
                                        ]}
                                    >
                                        <Input placeholder="E.g. Apex Football Club U-18" />
                                    </Form.Item>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Sport Select */}
                                        <Form.Item
                                            name="sport"
                                            label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sport</span>}
                                            rules={[{ required: true, message: "Sport selection is required" }]}
                                        >
                                            <Select placeholder="Select Sport" className="w-full">
                                                <Select.Option value="football">Football</Select.Option>
                                                <Select.Option value="cricket">Cricket</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        {/* Age Category */}
                                        <Form.Item
                                            name="ageCategory"
                                            label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age Category</span>}
                                            rules={[{ required: true, message: "Age category is required" }]}
                                        >
                                            <Select placeholder="Select Category" className="w-full">
                                                <Select.Option value="U-14">U-14</Select.Option>
                                                <Select.Option value="U-16">U-16</Select.Option>
                                                <Select.Option value="U-18">U-18</Select.Option>
                                                <Select.Option value="U-21">U-21</Select.Option>
                                                <Select.Option value="Senior">Senior</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    {/* Team Logo URL */}
                                    <Form.Item
                                        name="logo"
                                        label={
                                            <div className="flex items-center space-x-1.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team Logo Image URL</span>
                                                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">(Optional)</span>
                                            </div>
                                        }
                                        rules={[{ type: "url", message: "Please enter a valid image URL" }]}
                                    >
                                        <Input placeholder="E.g. https://domain.com/team-logo.png" />
                                    </Form.Item>
                                </div>

                                {/* Section 2: Contact Details & Bio Description */}
                                <div className="space-y-6">
                                    <div className="border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                                        <InfoCircleOutlined className="text-blue-500 text-base" />
                                        <h2 className="text-base font-bold text-white tracking-wide uppercase">2. Team Details & Access</h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Team Email */}
                                        <Form.Item
                                            name="teamEmail"
                                            label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team Login Email</span>}
                                            rules={[
                                                { required: true, message: "Team email is required" },
                                                { type: "email", message: "Please enter a valid email" }
                                            ]}
                                        >
                                            <Input 
                                                prefix={<MailOutlined className="text-slate-400 mr-2" />} 
                                                placeholder="team-auth@domain.com" 
                                            />
                                        </Form.Item>

                                        {/* Team Phone */}
                                        <Form.Item
                                            name="teamPhone"
                                            label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Team Contact Phone</span>}
                                            rules={[
                                                { required: true, message: "Team phone is required" },
                                                { pattern: /^\+?[0-9]{10,15}$/, message: "Enter a valid phone (10-15 digits)" }
                                            ]}
                                        >
                                            <Input 
                                                prefix={<PhoneOutlined className="text-slate-400 mr-2" />} 
                                                placeholder="E.g. +15551234" 
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* Description */}
                                    <Form.Item
                                        name="description"
                                        label={
                                            <div className="flex items-center space-x-1.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</span>
                                                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">(Optional)</span>
                                            </div>
                                        }
                                    >
                                        <TextArea
                                            rows={5}
                                            placeholder="Describe your team's vision, goals, and requirements."
                                            className="w-full"
                                        />
                                    </Form.Item>
                                </div>

                            </div>

                            {/* Actions Footer */}
                            <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-end gap-4">
                                <Button
                                    onClick={() => navigate("/dashboard")}
                                    className="w-full sm:w-auto border border-white/[0.08] hover:border-white/[0.16] bg-white/[0.02] text-slate-300 font-semibold hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={!loading && <CheckOutlined />}
                                    className="w-full sm:w-auto uppercase tracking-wider shadow-lg shadow-blue-600/20"
                                >
                                    {loading ? "Creating Team..." : "Create Team"}
                                </Button>
                            </div>
                        </Form>
                    </div>

                </div>

                {/* Success Credentials Modal */}
                <Modal
                    open={modalVisible}
                    onCancel={handleCloseModal}
                    footer={[
                        <Button key="close" type="primary" onClick={handleCloseModal} className="w-full uppercase tracking-wider">
                            Done & Proceed
                        </Button>
                    ]}
                    centered
                    closable={false}
                    className="custom-credential-modal"
                    styles={{
                        body: { background: "#0f172a", padding: "24px" },
                        mask: { backdropFilter: "blur(6px)" }
                    }}
                >
                    <div className="text-center">
                        <div className="mx-auto w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircleFilled className="text-2xl" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Team Created Successfully</h2>
                        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                            Your team has been created and is ready to start recruiting athletes.
                        </p>

                        <div className="mt-6 p-4 bg-[#080b11] border border-white/[0.04] rounded-xl text-left space-y-4">
                            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Team Login Credentials</h3>
                            
                            {/* Email Row */}
                            <div className="flex flex-col space-y-1">
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Email Address</span>
                                <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-lg p-2.5">
                                    <span className="text-xs font-mono text-slate-200 select-all truncate mr-2">{credentials?.email}</span>
                                    <Button 
                                        type="text" 
                                        size="small"
                                        icon={<CopyOutlined />} 
                                        onClick={() => handleCopy(credentials?.email, "Email")}
                                        className="text-slate-400 hover:text-white shrink-0 hover:bg-white/[0.04]"
                                    />
                                </div>
                            </div>

                            {/* Password Row */}
                            <div className="flex flex-col space-y-1">
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Password</span>
                                <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-lg p-2.5">
                                    <span className="text-xs font-mono text-slate-200 select-all truncate mr-2">{credentials?.password}</span>
                                    <Button 
                                        type="text" 
                                        size="small"
                                        icon={<CopyOutlined />} 
                                        onClick={() => handleCopy(credentials?.password, "Password")}
                                        className="text-slate-400 hover:text-white shrink-0 hover:bg-white/[0.04]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Alert Warning */}
                        <div className="mt-5">
                            <Alert
                                message={<span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Security Notice</span>}
                                description={
                                    <span className="text-[10px] text-slate-300 leading-normal block mt-0.5">
                                        Please save these credentials securely. They will be required for team access and management.
                                    </span>
                                }
                                type="warning"
                                showIcon
                                className="bg-amber-500/5 border border-amber-500/20 text-left rounded-lg"
                            />
                        </div>
                    </div>
                </Modal>

            </div>
        </ConfigProvider>
    );
}

export default CreateTeam;
