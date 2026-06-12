import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Form, Input, Button, Card, message, ConfigProvider, theme, Avatar } from "antd";
import { TeamOutlined, EditOutlined, CheckOutlined, GlobalOutlined, InfoCircleOutlined, PictureOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

const { TextArea } = Input;

function TeamProfile() {
    const { teamData, fetchTeamData } = useOutletContext(); // Retrieve team data and fetch helper from layout context
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (teamData) {
            form.setFieldsValue({
                teamName: teamData.teamName,
                sport: teamData.sport,
                ageCategory: teamData.ageCategory,
                description: teamData.description || "",
                logo: teamData.logo || ""
            });
        }
    }, [teamData, form]);

    const handleFormSubmit = async (values) => {
        if (!teamData?._id) return;
        try {
            setLoading(true);
            const payload = {
                teamName: values.teamName.trim(),
                description: values.description ? values.description.trim() : "",
                logo: values.logo ? values.logo.trim() : ""
            };

            await api.put(`/team/${teamData._id}`, payload);
            message.success("Team profile updated successfully!");
            setIsEditing(false);
            fetchTeamData(); // Refresh layout context state
        } catch (err) {
            console.error("Error updating team profile:", err);
            message.error(err.response?.data?.message || "Failed to update team profile");
        } finally {
            setLoading(false);
        }
    };

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
                borderRadius: 8,
                controlHeight: 44,
                fontWeight: 600,
            },
            Input: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            }
        }
    };

    if (!isEditing) {
        return (
            <ConfigProvider theme={darkTheme}>
                <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                                <TeamOutlined className="text-blue-500" />
                                <span>Team Profile</span>
                            </h1>
                            <p className="text-xs text-slate-400 mt-1">View your current sports credentials, age groups, and identity logos.</p>
                        </div>
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />}
                            onClick={() => setIsEditing(true)}
                            className="shadow-md text-xs font-bold"
                        >
                            Edit Profile
                        </Button>
                    </div>

                    {/* Profile Card */}
                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl">
                        
                        {/* Team Identity Banner */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-white/[0.04] pb-6">
                            {teamData?.logo ? (
                                <img src={teamData.logo} alt="Logo" className="w-20 h-20 rounded-xl object-cover border border-white/10 shadow-lg shrink-0" />
                            ) : (
                                <Avatar size={80} icon={<TeamOutlined />} className="bg-blue-600 rounded-xl shadow-lg shrink-0" />
                            )}
                            <div className="text-center sm:text-left space-y-1.5 min-w-0">
                                <h1 className="text-2xl font-black text-white leading-tight">{teamData?.teamName}</h1>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                    <span className="text-[10px] bg-blue-600/20 text-blue-400 font-extrabold uppercase px-2 py-0.5 rounded border border-blue-500/20 tracking-wider">
                                        {teamData?.sport}
                                    </span>
                                    <span className="text-[10px] bg-emerald-600/20 text-emerald-400 font-extrabold uppercase px-2 py-0.5 rounded border border-emerald-500/20 tracking-wider">
                                        {teamData?.ageCategory}
                                    </span>
                                </div>
                                {teamData?.organizationId?.organizationName && (
                                    <p className="text-xs text-slate-400">
                                        Affiliated to: <strong className="text-slate-300 font-bold">{teamData.organizationId.organizationName}</strong>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-6">
                            {/* Roster settings */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                    <GlobalOutlined />
                                    <span>Workspace Details</span>
                                </h3>
                                <div className="bg-[#080b11]/30 border border-white/[0.02] rounded-xl p-4 space-y-3">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Sport Category</span>
                                        <span className="font-bold text-white uppercase">{teamData?.sport}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Age Division</span>
                                        <span className="font-bold text-white">{teamData?.ageCategory}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Status</span>
                                        <span className="font-bold text-emerald-400 uppercase">Active</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description text */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                    <InfoCircleOutlined />
                                    <span>Mission & Bio</span>
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed bg-[#080b11]/20 border border-white/[0.02] rounded-xl p-4 m-0 min-h-[110px] italic">
                                    {teamData?.description || "No squad biography has been set yet."}
                                </p>
                            </div>
                        </div>
                    </Card>
                </main>
            </ConfigProvider>
        );
    }

    return (
        <ConfigProvider theme={darkTheme}>
            <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
                
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                        <TeamOutlined className="text-blue-500" />
                        <span>Edit Team Profile</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Modify team description and squad logos.</p>
                </div>

                {/* Form Card */}
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm p-4 sm:p-6 shadow-xl">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFormSubmit}
                        requiredMark={false}
                    >
                        {/* 1. Team Name */}
                        <Form.Item
                            name="teamName"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Team Name</span>}
                            rules={[{ required: true, message: "Please enter your team name" }]}
                        >
                            <Input placeholder="e.g. Apex Falcons FC" />
                        </Form.Item>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Locked Sport Category */}
                            <Form.Item
                                label={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sport Category (Locked)</span>}
                            >
                                <Input value={teamData?.sport?.toUpperCase()} disabled className="bg-[#0b0f19]/30 border-white/[0.02] text-slate-400 font-bold" />
                            </Form.Item>

                            {/* Locked Age Bracket */}
                            <Form.Item
                                label={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age Bracket (Locked)</span>}
                            >
                                <Input value={teamData?.ageCategory} disabled className="bg-[#0b0f19]/30 border-white/[0.02] text-slate-400 font-bold" />
                            </Form.Item>
                        </div>

                        {/* Logo Image URL */}
                        <Form.Item
                            name="logo"
                            label={
                                <div className="flex items-center space-x-1.5">
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Branding Logo URL</span>
                                    <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">(Optional)</span>
                                </div>
                            }
                            rules={[{ type: "url", message: "Please enter a valid URL" }]}
                        >
                            <Input placeholder="e.g. https://domain.com/team-logo.png" prefix={<PictureOutlined className="text-slate-500" />} />
                        </Form.Item>

                        {/* Description */}
                        <Form.Item
                            name="description"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Team Description / Mission</span>}
                        >
                            <TextArea rows={5} placeholder="Describe the team philosophy, squad records, or practice schedules..." />
                        </Form.Item>

                        {/* Form Actions Footer */}
                        <div className="pt-4 flex items-center justify-end gap-3">
                            <Button onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                icon={<CheckOutlined />}
                            >
                                Save Profile
                            </Button>
                        </div>
                    </Form>
                </Card>
            </main>
        </ConfigProvider>
    );
}

export default TeamProfile;
