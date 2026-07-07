import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Form, Input, Button, Card, message, Avatar, Upload } from "antd";
import { TeamOutlined, EditOutlined, CheckOutlined, GlobalOutlined, InfoCircleOutlined, PictureOutlined, UploadOutlined } from "@ant-design/icons";
import api from "../../../api/axios";
import { uploadImage } from "../../../api/uploadImage";

const { TextArea } = Input;

function TeamProfile() {
    const { teamData, fetchTeamData } = useOutletContext(); // Retrieve team data and fetch helper from layout context
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [fileList, setFileList] = useState([]);

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

            let uploadedLogo = teamData.logo;
            if (fileList.length > 0) {
                uploadedLogo = await uploadImage(fileList[0], "team-logos");
            }

            const payload = {
                teamName: values.teamName.trim(),
                description: values.description ? values.description.trim() : "",
                logo: uploadedLogo
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

    if (!isEditing) {
        return (
            <div className="max-w-4xl w-full mx-auto space-y-6 animate-fadeIn">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                    <div>
                        <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                            <TeamOutlined className="text-brand-primary" />
                            <span>Team Profile</span>
                        </h1>
                        <p className="text-xs text-text-secondary mt-0.5">View your current sports credentials, age groups, and identity logos.</p>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined className="text-xs" />}
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-semibold h-9 rounded-md cursor-pointer"
                    >
                        Edit Profile
                    </Button>
                </div>

                {/* Profile Container */}
                <div className="border border-border-subtle bg-bg-surface p-4 sm:p-6 shadow-sm rounded-xl">
                    
                    {/* Team Identity Banner */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-border-subtle pb-5">
                        {teamData?.logo?.url ? (
                            <img src={teamData.logo.url} alt="Logo" className="w-16 h-16 rounded object-cover border border-border-subtle shadow-sm shrink-0" />
                        ) : teamData?.logo ? (
                            <img src={teamData.logo} alt="Logo" className="w-16 h-16 rounded object-cover border border-border-subtle shadow-sm shrink-0" />
                        ) : (
                            <Avatar size={64} icon={<TeamOutlined />} className="bg-brand-primary rounded shadow-sm shrink-0" />
                        )}
                        <div className="text-center sm:text-left space-y-2 min-w-0">
                            <h2 className="text-base font-bold text-text-primary leading-tight m-0">{teamData?.teamName}</h2>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className="text-[10px] bg-brand-primary/10 text-brand-primary font-semibold uppercase px-2 py-0.5 rounded border border-brand-primary/15 tracking-wider">
                                    {teamData?.sport}
                                </span>
                                <span className="text-[10px] bg-brand-secondary/10 text-brand-secondary font-semibold uppercase px-2 py-0.5 rounded border border-brand-secondary/15 tracking-wider">
                                    {teamData?.ageCategory}
                                </span>
                            </div>
                            {teamData?.organizationId?.organizationName && (
                                <p className="text-xs text-text-secondary m-0">
                                    Affiliated to: <strong className="text-text-primary font-semibold">{teamData.organizationId.organizationName}</strong>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                        {/* Roster settings */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                                <GlobalOutlined className="text-brand-primary" />
                                <span>Workspace Details</span>
                            </h3>
                            <div className="bg-bg-elevated/40 border border-border-subtle rounded-xl p-4 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary">Sport Category</span>
                                    <span className="font-semibold text-text-primary uppercase">{teamData?.sport}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary">Age Division</span>
                                    <span className="font-semibold text-text-primary">{teamData?.ageCategory}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary">Status</span>
                                    <span className="font-semibold text-brand-secondary uppercase">Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Description text */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                                <InfoCircleOutlined className="text-brand-primary" />
                                <span>Mission & Bio</span>
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed bg-bg-elevated/20 border border-border-subtle rounded-xl p-4 m-0 min-h-[105px] italic">
                                {teamData?.description || "No squad biography has been set yet."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl w-full mx-auto space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="border-b border-border-subtle pb-4">
                <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                    <TeamOutlined className="text-brand-primary" />
                    <span>Edit Team Profile</span>
                </h1>
                <p className="text-xs text-text-secondary mt-0.5">Modify team description and squad logos.</p>
            </div>

            {/* Form Container */}
            <div className="border border-border-subtle bg-bg-surface p-4 sm:p-6 shadow-sm rounded-xl">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    requiredMark={false}
                >
                    <Form.Item
                        name="teamName"
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Team Name</span>}
                        rules={[{ required: true, message: "Please enter your team name" }]}
                    >
                        <Input placeholder="e.g. Apex Falcons FC" />
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Locked Sport Category */}
                        <Form.Item
                            label={<span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-wider">Sport Category (Locked)</span>}
                        >
                            <Input value={teamData?.sport?.toUpperCase()} disabled className="bg-bg-elevated/50 border-border-subtle text-text-secondary font-semibold" />
                        </Form.Item>

                        {/* Locked Age Bracket */}
                        <Form.Item
                            label={<span className="text-[10px] font-bold text-text-secondary/50 uppercase tracking-wider">Age Bracket (Locked)</span>}
                        >
                            <Input value={teamData?.ageCategory} disabled className="bg-bg-elevated/50 border-border-subtle text-text-secondary font-semibold" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={
                            <div className="flex items-center space-x-1">
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Branding Logo</span>
                                <span className="text-[9px] text-text-secondary/50 font-semibold uppercase tracking-wide">(Optional)</span>
                            </div>
                        }
                    >
                        <Upload
                            beforeUpload={(file) => {
                                setFileList([file]);
                                return false;
                            }}
                            onRemove={() => setFileList([])}
                            fileList={fileList}
                            accept="image/*"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined className="text-xs" />} className="text-xs h-9">
                                Change Logo
                            </Button>
                        </Upload>
                        {teamData?.logo && (
                            <div className="mt-2 text-[10px] text-text-secondary">Current logo will be kept if no new image is selected.</div>
                        )}
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Team Description / Mission</span>}
                    >
                        <TextArea rows={5} placeholder="Describe the team philosophy, squad records, or practice schedules..." className="rounded-lg" />
                    </Form.Item>

                    {/* Form Actions Footer */}
                    <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-3 mt-4">
                        <Button onClick={() => setIsEditing(false)} className="text-xs">
                            Cancel
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            icon={<CheckOutlined className="text-xs" />}
                            className="text-xs font-semibold h-9 rounded-md cursor-pointer"
                        >
                            Save Profile
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default TeamProfile;
