import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, DatePicker, InputNumber, Card, message, ConfigProvider, theme } from "antd";
import { TrophyOutlined, CalendarOutlined, EnvironmentOutlined, PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

const { TextArea } = Input;
const { Option } = Select;

function CreateTournament() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);

            // Format dates for backend
            const payload = {
                name: values.name.trim(),
                sport: values.sport,
                ageCategory: values.ageCategory,
                location: values.location.trim(),
                startDate: values.startDate.format("YYYY-MM-DD"),
                endDate: values.endDate.format("YYYY-MM-DD"),
                registrationDeadline: values.registrationDeadline.format("YYYY-MM-DD"),
                maxTeams: values.maxTeams,
                description: values.description ? values.description.trim() : ""
            };

            await api.post("/tournament/create", payload);
            message.success("Tournament created successfully!");
            navigate("/organization/tournaments");
        } catch (err) {
            console.error("Error creating tournament:", err);
            message.error(err.response?.data?.message || "Failed to create tournament");
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
            Select: {
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
            <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
                
                {/* Navigation Back */}
                <div className="flex items-center space-x-3">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => navigate("/organization/tournaments")}
                        className="text-slate-400 hover:text-white"
                    >
                        Back to Tournaments
                    </Button>
                </div>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                        <TrophyOutlined className="text-blue-500" />
                        <span>Create Tournament</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Initialize a new tournament, configure registry limits, and schedule fixtures.</p>
                </div>

                {/* Form Card */}
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm p-4 sm:p-6 shadow-xl">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                        initialValues={{ maxTeams: 8 }}
                    >
                        {/* 1. Name */}
                        <Form.Item
                            name="name"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tournament Name</span>}
                            rules={[{ required: true, message: "Please enter the tournament name" }]}
                        >
                            <Input placeholder="e.g. Apex Summer Championship" />
                        </Form.Item>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* 2. Sport */}
                            <Form.Item
                                name="sport"
                                label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sport Type</span>}
                                rules={[{ required: true, message: "Select a sport category" }]}
                            >
                                <Select placeholder="Select Sport">
                                    <Option value="football">Football</Option>
                                    <Option value="cricket">Cricket</Option>
                                </Select>
                            </Form.Item>

                            {/* 3. Age Category */}
                            <Form.Item
                                name="ageCategory"
                                label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Age Bracket Limit</span>}
                                rules={[{ required: true, message: "Select an age bracket" }]}
                            >
                                <Select placeholder="Select Bracket">
                                    <Option value="U-14">U-14</Option>
                                    <Option value="U-16">U-16</Option>
                                    <Option value="U-18">U-18</Option>
                                    <Option value="U-21">U-21</Option>
                                    <Option value="Senior">Senior</Option>
                                </Select>
                            </Form.Item>
                        </div>

                        {/* 4. Location */}
                        <Form.Item
                            name="location"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tournament Location / Venue</span>}
                            rules={[{ required: true, message: "Please specify the venue" }]}
                        >
                            <Input placeholder="e.g. Madison Square Field A, NY" prefix={<EnvironmentOutlined className="text-slate-500" />} />
                        </Form.Item>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* 5. Start Date */}
                            <Form.Item
                                name="startDate"
                                label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Start Date</span>}
                                rules={[{ required: true, message: "Choose start date" }]}
                            >
                                <DatePicker className="w-full" prefix={<CalendarOutlined className="text-slate-500" />} />
                            </Form.Item>

                            {/* 6. End Date */}
                            <Form.Item
                                name="endDate"
                                label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">End Date</span>}
                                rules={[{ required: true, message: "Choose end date" }]}
                            >
                                <DatePicker className="w-full" prefix={<CalendarOutlined className="text-slate-500" />} />
                            </Form.Item>

                            {/* 7. Registration Deadline */}
                            <Form.Item
                                name="registrationDeadline"
                                label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Registry Deadline</span>}
                                rules={[{ required: true, message: "Choose deadline" }]}
                            >
                                <DatePicker className="w-full" prefix={<CalendarOutlined className="text-slate-500" />} />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* 8. Max Teams */}
                            <Form.Item
                                name="maxTeams"
                                label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Max Teams Limit</span>}
                                rules={[{ required: true, message: "Specify max teams" }]}
                            >
                                <InputNumber min={2} max={64} className="w-full" />
                            </Form.Item>
                        </div>

                        {/* 9. Description */}
                        <Form.Item
                            name="description"
                            label={<span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tournament Description</span>}
                        >
                            <TextArea rows={4} placeholder="Describe the format, rules, registration fees, and awards details..." />
                        </Form.Item>

                        {/* Submit */}
                        <div className="pt-4">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                className="w-full font-bold uppercase tracking-wider shadow-lg shadow-blue-600/10"
                            >
                                Launch Tournament
                            </Button>
                        </div>
                    </Form>
                </Card>

            </main>
        </ConfigProvider>
    );
}

export default CreateTournament;
