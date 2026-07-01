import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Tabs, Select, Spin } from "antd";
import { SettingOutlined, GlobalOutlined, LinkOutlined, PictureOutlined, TrophyOutlined } from "@ant-design/icons";
import api from "../../../api/axios";
import { COUNTRIES } from "../../../utils/countries";

const { TextArea } = Input;

function OrgSettings() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [, setProfile] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    const fetchOrgProfile = async () => {
        try {
            setPageLoading(true);
            const res = await api.get("/organization/me");
            if (res.data) {
                setProfile(res.data);
                form.setFieldsValue(res.data);
            }
        } catch (err) {
            console.error("Error loading org profile:", err);
            message.error("Failed to load profile details");
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchOrgProfile();
    }, []);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const payload = {
                organizationName: values.organizationName.trim(),
                description: values.description.trim(),
                logo: values.logo ? values.logo.trim() : "",
                city: values.city.trim(),
                state: values.state.trim(),
                country: values.country.trim(),
                website: values.website ? values.website.trim() : ""
            };

            await api.put("/organization/update", payload);
            message.success("Organization settings updated successfully!");
            fetchOrgProfile();
        } catch (err) {
            console.error("Error updating organization:", err);
            message.error(err.response?.data?.message || "Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: "profile",
            label: <span className="font-semibold text-xs">Profile Details</span>,
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
                                <TrophyOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">1. Brand Identity</h2>
                            </div>

                            <Form.Item
                                name="organizationName"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Organization Name</span>}
                                rules={[{ required: true, message: "Organization name is required" }]}
                            >
                                <Input placeholder="E.g. Apex Football Club" />
                            </Form.Item>

                            <Form.Item
                                name="logo"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Logo Image URL</span>}
                                rules={[{ type: "url", message: "Please enter a valid image URL" }]}
                            >
                                <Input placeholder="E.g. https://domain.com/logo.png" prefix={<PictureOutlined className="text-text-secondary mr-1.5" />} />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Description</span>}
                                rules={[{ required: true, message: "A brief description is required" }]}
                            >
                                <TextArea rows={4} placeholder="Describe your organization's history, mission, or facilities..." className="rounded-lg" />
                            </Form.Item>
                        </div>

                        <div className="space-y-5">
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <GlobalOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">2. Location & Web</h2>
                            </div>

                            <Form.Item
                                name="country"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Country</span>}
                                rules={[{ required: true, message: "Country is required" }]}
                            >
                                <Select showSearch placeholder="Select Country">
                                    {COUNTRIES.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                                </Select>
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    name="city"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">City</span>}
                                    rules={[{ required: true, message: "City is required" }]}
                                >
                                    <Input placeholder="E.g. NY" />
                                </Form.Item>
                                <Form.Item
                                    name="state"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">State</span>}
                                    rules={[{ required: true, message: "State is required" }]}
                                >
                                    <Input placeholder="E.g. New York" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="website"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Official Website</span>}
                                rules={[{ type: "url", message: "Please enter a valid URL" }]}
                            >
                                <Input placeholder="E.g. https://apex.com" prefix={<LinkOutlined className="text-text-secondary mr-1.5" />} />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="pt-5 border-t border-border-subtle flex justify-end mt-6">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading} 
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
                        <span>Workspace Settings</span>
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">Configure your organization portal, location, website details, and logo branding.</p>
                </div>
            </div>

            {pageLoading ? (
                <div className="py-16 flex justify-center"><Spin size="middle" /></div>
            ) : (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface p-2 sm:p-4 shadow-sm rounded-xl">
                    <Tabs defaultActiveKey="profile" items={tabItems} className="custom-tabs" />
                </Card>
            )}

        </div>
    );
}

export default OrgSettings;
