import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Form, Input, Button, Card, message, Tabs, Upload } from "antd";
import { SettingOutlined, TeamOutlined, CheckOutlined, InfoCircleOutlined, PictureOutlined, UploadOutlined } from "@ant-design/icons";
import api from "../../../api/axios";
import { uploadImage } from "../../../api/uploadImage";

const { TextArea } = Input;

function TeamSettings() {
    const { teamData, fetchTeamData } = useOutletContext(); // Retrieve team data and fetch helper from layout context
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (teamData) {
            form.setFieldsValue({
                teamName: teamData.teamName,
                description: teamData.description || "",
                logo: teamData.logo || ""
            });
        }
    }, [teamData, form]);

    const onFinish = async (values) => {
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
            message.success("Team settings saved successfully!");
            fetchTeamData(); // Refresh layout context state
        } catch (err) {
            console.error("Error saving team settings:", err);
            message.error(err.response?.data?.message || "Failed to save team settings");
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: "profile",
            label: <span className="font-semibold text-xs">Squad Details</span>,
            children: (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    className="mt-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <TeamOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">1. Roster Identity</h2>
                            </div>

                            <Form.Item
                                name="teamName"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Team Name</span>}
                                rules={[{ required: true, message: "Please enter your team name" }]}
                            >
                                <Input placeholder="e.g. Falcons Football Club" />
                            </Form.Item>

                            <Form.Item
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Squad Logo</span>}
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
                        </div>

                        <div className="space-y-5">
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <InfoCircleOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">2. Roster Description</h2>
                            </div>

                            <Form.Item
                                name="description"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Team Description</span>}
                            >
                                <TextArea rows={5} placeholder="Describe the team philosophy, roster records, or practice schedules..." className="rounded-lg" />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="pt-5 border-t border-border-subtle flex justify-end mt-6">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading} 
                            icon={<CheckOutlined className="text-xs" />} 
                            className="w-full sm:w-auto font-semibold text-xs h-9 rounded-md cursor-pointer"
                        >
                            Save Settings
                        </Button>
                    </div>
                </Form>
            )
        }
    ];

    return (
        <div className="max-w-4xl w-full mx-auto space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                        <SettingOutlined className="text-brand-primary" />
                        <span>Team Settings</span>
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">Configure your squad roster settings, description, and team branding.</p>
                </div>
            </div>

            <Card bordered={false} className="premium-card p-2 sm:p-4">
                <Tabs defaultActiveKey="profile" items={tabItems} className="custom-tabs" />
            </Card>

        </div>
    );
}

export default TeamSettings;
