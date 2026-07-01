import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, message, Modal, Alert, Card } from "antd";
import {
    TeamOutlined,
    InfoCircleOutlined,
    CheckOutlined,
    ArrowLeftOutlined,
    MailOutlined,
    PhoneOutlined,
    CopyOutlined,
    CheckCircleFilled,
    PictureOutlined
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

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);

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
        <div className="space-y-6 animate-fadeIn">
            {/* Header bar / Breadcrumb */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined className="text-xs" />} 
                    onClick={() => navigate("/dashboard")}
                    className="text-text-secondary hover:text-text-primary flex items-center p-0 h-auto cursor-pointer"
                >
                    Back to Dashboard
                </Button>
            </div>

            {/* Title */}
            <div className="text-center space-y-3 py-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/15">
                    <TeamOutlined className="text-xs text-brand-primary" />
                    <span className="text-[10px] font-bold tracking-wider text-brand-primary uppercase">ROSTER CREATOR ENGINE</span>
                </div>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                    Create Team
                </h1>
                <p className="text-xs text-text-secondary max-w-xl mx-auto leading-relaxed">
                    Create a new team under your organization and start recruiting athletes.
                </p>
            </div>

            {/* Form Card Container */}
            <Card bordered={false} className="border border-border-subtle bg-bg-surface p-2 sm:p-4 shadow-sm rounded-xl">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    requiredMark={false}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Section 1: Team General Details */}
                        <div className="space-y-5">
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <TeamOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">1. Team Information</h2>
                            </div>

                            <Form.Item
                                name="teamName"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Team Name</span>}
                                rules={[
                                    { required: true, message: "Team name is required" },
                                    { min: 2, message: "Name must be at least 2 characters" }
                                ]}
                            >
                                <Input placeholder="E.g. Apex Football Club U-18" />
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    name="sport"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Sport</span>}
                                    rules={[{ required: true, message: "Sport selection is required" }]}
                                >
                                    <Select placeholder="Select Sport" className="w-full">
                                        <Select.Option value="football">Football</Select.Option>
                                        <Select.Option value="cricket">Cricket</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="ageCategory"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Age Category</span>}
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

                            <Form.Item
                                name="logo"
                                label={
                                    <div className="flex items-center space-x-1">
                                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Team Logo Image URL</span>
                                        <span className="text-[9px] text-text-secondary/50 font-semibold uppercase tracking-wide">(Optional)</span>
                                    </div>
                                }
                                rules={[{ type: "url", message: "Please enter a valid image URL" }]}
                            >
                                <Input placeholder="E.g. https://domain.com/team-logo.png" prefix={<PictureOutlined className="text-text-secondary mr-1" />} />
                            </Form.Item>
                        </div>

                        {/* Section 2: Contact Details & Bio Description */}
                        <div className="space-y-5">
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <InfoCircleOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">2. Team Details & Access</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Form.Item
                                    name="teamEmail"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Team Login Email</span>}
                                    rules={[
                                        { required: true, message: "Team email is required" },
                                        { type: "email", message: "Please enter a valid email" }
                                    ]}
                                >
                                    <Input 
                                        prefix={<MailOutlined className="text-text-secondary mr-1 text-[11px]" />} 
                                        placeholder="team-auth@domain.com" 
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="teamPhone"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Team Contact Phone</span>}
                                    rules={[
                                        { required: true, message: "Team phone is required" },
                                        { pattern: /^\+?[0-9]{10,15}$/, message: "Enter a valid phone (10-15 digits)" }
                                    ]}
                                >
                                    <Input 
                                        prefix={<PhoneOutlined className="text-text-secondary mr-1 text-[11px]" />} 
                                        placeholder="E.g. +15551234" 
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="description"
                                label={
                                    <div className="flex items-center space-x-1">
                                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Description</span>
                                        <span className="text-[9px] text-text-secondary/50 font-semibold uppercase tracking-wide">(Optional)</span>
                                    </div>
                                }
                            >
                                <TextArea
                                    rows={5}
                                    placeholder="Describe your team's vision, goals, and requirements."
                                    className="w-full rounded-lg"
                                />
                            </Form.Item>
                        </div>

                    </div>

                    {/* Actions Footer */}
                    <div className="mt-6 pt-5 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-end gap-3">
                        <Button
                            onClick={() => navigate("/organization/teams")}
                            className="w-full sm:w-auto text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={!loading && <CheckOutlined className="text-xs" />}
                            className="w-full sm:w-auto font-semibold text-xs h-9 rounded-md cursor-pointer"
                        >
                            {loading ? "Creating Team..." : "Create Team"}
                        </Button>
                    </div>
                </Form>
            </Card>

            {/* Success Credentials Modal */}
            <Modal
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" type="primary" onClick={handleCloseModal} className="w-full font-semibold text-xs h-9 rounded-md cursor-pointer">
                        Done & Proceed
                    </Button>
                ]}
                centered
                closable={false}
                width={400}
            >
                <div className="text-center py-2">
                    <div className="mx-auto w-12 h-12 bg-brand-secondary/10 text-brand-secondary rounded-full flex items-center justify-center mb-4">
                        <CheckCircleFilled className="text-xl" />
                    </div>
                    <h2 className="text-base font-bold text-text-primary tracking-tight m-0">Team Created Successfully</h2>
                    <p className="text-text-secondary text-xs mt-1.5 leading-relaxed">
                        Your team has been created and is ready to start recruiting athletes.
                    </p>

                    <div className="mt-5 p-4 bg-bg-elevated border border-border-subtle rounded-xl text-left space-y-4">
                        <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider m-0">Team Login Credentials</h3>
                        
                        {/* Email Row */}
                        <div className="flex flex-col space-y-1">
                            <span className="text-[9px] uppercase font-bold text-text-secondary tracking-wider">Email Address</span>
                            <div className="flex items-center justify-between bg-bg-surface border border-border-subtle rounded-lg p-2.5">
                                <span className="text-xs font-mono text-text-primary select-all truncate mr-2">{credentials?.email}</span>
                                <Button 
                                    type="text" 
                                    size="small"
                                    icon={<CopyOutlined className="text-xs" />} 
                                    onClick={() => handleCopy(credentials?.email, "Email")}
                                    className="text-text-secondary hover:text-text-primary shrink-0"
                                />
                            </div>
                        </div>

                        {/* Password Row */}
                        <div className="flex flex-col space-y-1">
                            <span className="text-[9px] uppercase font-bold text-text-secondary tracking-wider">Password</span>
                            <div className="flex items-center justify-between bg-bg-surface border border-border-subtle rounded-lg p-2.5">
                                <span className="text-xs font-mono text-text-primary select-all truncate mr-2">{credentials?.password}</span>
                                <Button 
                                    type="text" 
                                    size="small"
                                    icon={<CopyOutlined className="text-xs" />} 
                                    onClick={() => handleCopy(credentials?.password, "Password")}
                                    className="text-text-secondary hover:text-text-primary shrink-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Alert Warning */}
                    <div className="mt-4">
                        <Alert
                            message={<span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider">Security Notice</span>}
                            description={
                                <span className="text-[10px] text-text-secondary leading-normal block mt-0.5">
                                    Please save these credentials securely. They will be required for team access and management.
                                </span>
                            }
                            type="warning"
                            showIcon
                            className="bg-brand-accent/5 border border-brand-accent/15 text-left rounded-lg"
                        />
                    </div>
                </div>
            </Modal>

        </div>
    );
}

export default CreateTeam;
