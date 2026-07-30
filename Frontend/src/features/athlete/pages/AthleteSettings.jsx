import React, { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker, InputNumber, Button, Card, message, Tabs, Spin } from "antd";
import { SettingOutlined, TrophyOutlined, GlobalOutlined, CheckOutlined, CalendarOutlined } from "@ant-design/icons";
import api from "../../../api/axios";
import { COUNTRIES } from "../../../utils/countries";
import dayjs from "dayjs";

const { TextArea } = Input;

function AthleteSettings() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const fetchAthleteProfile = async () => {
        try {
            setPageLoading(true);
            const res = await api.get("/athleteprofile/me");
            if (res.data) {
                form.setFieldsValue({
                    ...res.data,
                    sport: res.data.sport ? res.data.sport.toLowerCase() : undefined,
                    gender: res.data.gender ? res.data.gender.toLowerCase() : undefined,
                    dob: res.data.dob ? dayjs(res.data.dob) : null
                });
            }
        } catch (err) {
            console.error("Error loading athlete profile:", err);
            message.error("Failed to load your profile details");
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchAthleteProfile();
    }, []);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const dobFormatted = values.dob ? values.dob.toISOString() : null;

            const payload = {
                sport: values.sport,
                primaryRole: values.primaryRole.trim(),
                secondaryRole: values.secondaryRole ? values.secondaryRole.trim() : "None",
                gender: values.gender,
                dob: dobFormatted,
                height: Number(values.height),
                weight: Number(values.weight),
                city: values.city.trim(),
                state: values.state.trim(),
                country: values.country.trim(),
                bio: values.bio ? values.bio.trim() : "No bio provided"
            };

            await api.put("/athleteprofile/update", payload);
            message.success("Athlete profile settings updated successfully!");
            fetchAthleteProfile();
        } catch (err) {
            console.error("Error updating athlete profile:", err);
            message.error(err.response?.data?.message || "Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: "profile",
            label: <span className="font-semibold text-xs">Biometrics & Roster</span>,
            children: (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                    className="mt-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Sports info */}
                        <div className="space-y-5">
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <TrophyOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">1. Sports Details</h2>
                            </div>

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
                                name="primaryRole"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Primary Role</span>}
                                rules={[{ required: true, message: "Primary playing role is required" }]}
                            >
                                <Input placeholder="E.g. Batsman, Striker" />
                            </Form.Item>

                            <Form.Item
                                name="secondaryRole"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Secondary Role (Optional)</span>}
                            >
                                <Input placeholder="E.g. Bowler, Goalkeeper" />
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    name="gender"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Gender</span>}
                                    rules={[{ required: true, message: "Gender is required" }]}
                                >
                                    <Select placeholder="Select Gender">
                                        <Select.Option value="male">Male</Select.Option>
                                        <Select.Option value="female">Female</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="dob"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Date of Birth</span>}
                                    rules={[{ required: true, message: "Date of birth is required" }]}
                                >
                                    <DatePicker className="w-full" placeholder="Select Date" suffixIcon={<CalendarOutlined className="text-text-secondary" />} />
                                </Form.Item>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    name="height"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Height (cm)</span>}
                                    rules={[
                                        { required: true, message: "Height is required" },
                                        { type: "number", min: 50, max: 250, message: "Valid height is 50-250" }
                                    ]}
                                >
                                    <InputNumber className="w-full" placeholder="E.g. 175" />
                                </Form.Item>

                                <Form.Item
                                    name="weight"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Weight (kg)</span>}
                                    rules={[
                                        { required: true, message: "Weight is required" },
                                        { type: "number", min: 20, max: 200, message: "Valid weight is 20-200" }
                                    ]}
                                >
                                    <InputNumber className="w-full" placeholder="E.g. 70" />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Location and Bio */}
                        <div className="space-y-5">
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <GlobalOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">2. Location & Bio</h2>
                            </div>

                            <Form.Item
                                name="country"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Country</span>}
                                rules={[{ required: true, message: "Country is required" }]}
                            >
                                <Select showSearch placeholder="Search and select country">
                                    {COUNTRIES.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                                </Select>
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    name="city"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">City</span>}
                                    rules={[{ required: true, message: "City is required" }]}
                                >
                                    <Input placeholder="E.g. London" />
                                </Form.Item>

                                <Form.Item
                                    name="state"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">State</span>}
                                    rules={[{ required: true, message: "State is required" }]}
                                >
                                    <Input placeholder="E.g. England" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="bio"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Athlete Bio</span>}
                            >
                                <TextArea rows={5} placeholder="Introduce yourself. Mention your achievements, physical attributes, or sporting goals..." className="rounded-lg" />
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
                        <span>Athlete Settings</span>
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">Configure your personal physical attributes, location details, and bio profile.</p>
                </div>
            </div>

            {pageLoading ? (
                <div className="py-16 flex justify-center"><Spin size="middle" /></div>
            ) : (
                <div className="border border-border-subtle bg-bg-surface p-6 sm:p-8 rounded-2xl shadow-sm">
                    <Tabs defaultActiveKey="profile" items={tabItems} className="custom-tabs" />
                </div>
            )}
        </div>
    );
}

export default AthleteSettings;
