import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Form, Input, Button, DatePicker, InputNumber, Card, message } from "antd";
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

    return (
        <div className="max-w-2xl w-full mx-auto space-y-6 animate-fadeIn">
            
            {/* Back Button */}
            <div className="flex items-center">
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined className="text-xs" />} 
                    onClick={() => navigate("/team/dashboard")}
                    className="text-text-secondary hover:text-text-primary p-0 h-auto cursor-pointer"
                >
                    Back to Dashboard
                </Button>
            </div>

            {/* Header */}
            <div className="border-b border-border-subtle pb-4">
                <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                    <NotificationOutlined className="text-brand-primary" />
                    <span>Create Recruitment Drive</span>
                </h1>
                <p className="text-xs text-text-secondary mt-0.5">
                    Post an open roster scouting search for team <strong className="text-brand-primary">{teamData?.teamName}</strong>.
                </p>
            </div>

            {/* Form Card */}
            <Card bordered={false} className="border border-border-subtle bg-bg-surface p-2 sm:p-4 shadow-sm rounded-xl">
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
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Campaign Title</span>}
                        rules={[{ required: true, message: "Please enter the drive title" }]}
                    >
                        <Input placeholder="e.g. Tryouts for Midfield Defenses" />
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 2. Application Deadline */}
                        <Form.Item
                            name="applicationDeadline"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Application Deadline</span>}
                            rules={[{ required: true, message: "Choose deadline date" }]}
                        >
                            <DatePicker className="w-full" prefix={<CalendarOutlined className="text-text-secondary mr-1" />} />
                        </Form.Item>

                        {/* 3. Vacancies */}
                        <Form.Item
                            name="vacancies"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Number of Vacant Spots</span>}
                            rules={[{ required: true, message: "Please enter number of spots" }]}
                        >
                            <InputNumber min={1} max={50} className="w-full" />
                        </Form.Item>
                    </div>

                    {/* 4. Location */}
                    <Form.Item
                        name="location"
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Scouting Trial Location</span>}
                        rules={[{ required: true, message: "Please enter the trials location" }]}
                    >
                        <Input placeholder="e.g. Academy Main Pitch C, Manhattan" prefix={<EnvironmentOutlined className="text-text-secondary mr-1" />} />
                    </Form.Item>

                    {/* 5. Description */}
                    <Form.Item
                        name="description"
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Drive Details / Requirements</span>}
                        rules={[{ required: true, message: "Specify drive details and player requirements" }]}
                    >
                        <TextArea rows={4} placeholder="Detail the trials process, specific position skills needed, and practice schedule expectations..." className="rounded-lg" />
                    </Form.Item>

                    {/* Submit */}
                    <div className="pt-4 border-t border-border-subtle mt-4">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            className="w-full font-semibold text-xs h-9 rounded-md cursor-pointer"
                        >
                            Launch Scouting Search
                        </Button>
                    </div>
                </Form>
            </Card>

        </div>
    );
}

export default CreateRecruitmentDrive;
