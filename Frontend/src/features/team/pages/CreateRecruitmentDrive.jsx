import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Form, Input, Button, DatePicker, InputNumber, Card, message, ConfigProvider, theme } from "antd";
import { NotificationOutlined, CalendarOutlined, EnvironmentOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

const { TextArea } = Input;

function CreateRecruitmentDrive() {
    const navigate = useNavigate();
    const { teamData } = useOutletContext(); // Fetch logged-in team details (sport & ageCategory)
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);

            // Structure request body
            const payload = {
                title: values.title.trim(),
                description: values.description.trim(),
                sport: teamData?.sport || "football",
                ageCategory: teamData?.ageCategory || "Senior",
                applicationDeadline: values.applicationDeadline.format("YYYY-MM-DD"),
                location: values.location.trim(),
                vacancies: values.vacancies
            };

            await api.post("/recruitment/create", payload);
            message.success("Recruitment drive launched successfully!");
            navigate("/team/dashboard"); // Navigate back
        } catch (err) {
            console.error("Error creating recruitment drive:", err);
            message.error(err.response?.data?.message || "Failed to create recruitment drive");
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
            },
            DatePicker: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            },
            InputNumber: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            }
        }
    };

    return (
        <ConfigProvider theme={darkTheme}>
            <main className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
                
                {/* Back Button */}
                <div className="flex items-center">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => navigate("/team/dashboard")}
                        className="text-slate-400 hover:text-white"
                    >
                        Back to Dashboard
                    </Button>
                </div>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                        <NotificationOutlined className="text-blue-500" />
                        <span>Create Recruitment Drive</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                        Post an open roster scouting search for team <strong className="text-blue-400">{teamData?.teamName}</strong>.
                    </p>
                </div>

                {/* Form Card */}
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm p-4 sm:p-6 shadow-xl">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                        initialValues={{ vacancies: 1 }}
                    >
                        {/* 1. Title */}
                        <Form.Item
                            name="title"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Campaign Title</span>}
                            rules={[{ required: true, message: "Please enter the drive title" }]}
                        >
                            <Input placeholder="e.g. Tryouts for Midfield Defenses" />
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* 2. Application Deadline */}
                            <Form.Item
                                name="applicationDeadline"
                                label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Application Deadline</span>}
                                rules={[{ required: true, message: "Choose deadline date" }]}
                            >
                                <DatePicker className="w-full" prefix={<CalendarOutlined className="text-slate-500" />} />
                            </Form.Item>

                            {/* 3. Vacancies */}
                            <Form.Item
                                name="vacancies"
                                label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Number of Vacant Spots</span>}
                                rules={[{ required: true, message: "Please enter number of spots" }]}
                            >
                                <InputNumber min={1} max={50} className="w-full" />
                            </Form.Item>
                        </div>

                        {/* 4. Location */}
                        <Form.Item
                            name="location"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Scouting Trial Location</span>}
                            rules={[{ required: true, message: "Please enter the trials location" }]}
                        >
                            <Input placeholder="e.g. Academy Main Pitch C, Manhattan" prefix={<EnvironmentOutlined className="text-slate-500" />} />
                        </Form.Item>

                        {/* 5. Description */}
                        <Form.Item
                            name="description"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Drive Details / Requirements</span>}
                            rules={[{ required: true, message: "Specify drive details and player requirements" }]}
                        >
                            <TextArea rows={4} placeholder="Detail the trials process, specific position skills needed, and practice schedule expectations..." />
                        </Form.Item>

                        {/* Submit */}
                        <div className="pt-4">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                className="w-full font-bold uppercase tracking-wider shadow-lg shadow-blue-600/10"
                            >
                                Launch Scouting Search
                            </Button>
                        </div>
                    </Form>
                </Card>

            </main>
        </ConfigProvider>
    );
}

export default CreateRecruitmentDrive;
