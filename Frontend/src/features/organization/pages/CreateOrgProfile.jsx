import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Select, Button, ConfigProvider, theme, message } from "antd";
import {
    GlobalOutlined,
    TrophyOutlined,
    InfoCircleOutlined,
    LinkOutlined,
    PictureOutlined,
    CheckOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";
import { loginSuccess } from "../../auth/authSlice";
import { COUNTRIES } from "../../../utils/countries";

const { TextArea } = Input;

function CreateOrgProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);

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
            TextArea: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            }
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);

            // Structure request body for the backend (description is required by the route)
            const payload = {
                organizationName: values.organizationName.trim(),
                description: values.description.trim(),
                logo: values.logo ? values.logo.trim() : "",
                city: values.city.trim(),
                state: values.state.trim(),
                country: values.country.trim(),
                website: values.website ? values.website.trim() : ""
            };

            await api.post("/organization/profile", payload);

            // Update Redux state with profile status
            dispatch(loginSuccess({
                user: { ...user, isProfileCompleted: true },
                token
            }));

            message.success("Organization profile completed successfully!");
            
            // Redirect to Organization Dashboard
            navigate("/organization/dashboard");

        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to complete organization profile. Please try again.";
            message.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = () => {
        setDraftLoading(true);
        setTimeout(() => {
            message.success("Draft saved successfully! (UI Only)");
            setDraftLoading(false);
        }, 1000);
    };

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="min-h-screen w-full bg-[#080b11] text-slate-100 font-sans selection:bg-blue-600 selection:text-white py-12 px-4 sm:px-6 lg:px-8">

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 mb-4">
                            <TrophyOutlined className="text-xs text-blue-400" />
                            <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">ORGANIZATION REGISTRY PORTAL</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                            Complete Your Organization Profile
                        </h1>
                        <p className="mt-3 text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Set up your organization to create teams, manage tournaments, organize matches, and track athlete development.
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
                            {/* Responsive two-column layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                                {/* Column 1: Organization details & Branding */}
                                <div className="space-y-6">
                                    {/* Section 1 Header */}
                                    <div className="border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                                        <TrophyOutlined className="text-blue-500 text-base" />
                                        <h2 className="text-base font-bold text-white tracking-wide uppercase">1. Organization Information</h2>
                                    </div>

                                    {/* Organization Name */}
                                    <Form.Item
                                        name="organizationName"
                                        label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization Name</span>}
                                        rules={[
                                            { required: true, message: "Organization name is required" },
                                            { min: 2, message: "Name must be at least 2 characters" }
                                        ]}
                                    >
                                        <Input placeholder="E.g. Apex Football Academy, Golden Bat Association" />
                                    </Form.Item>

                                    {/* Description */}
                                    <Form.Item
                                        name="description"
                                        label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</span>}
                                        rules={[
                                            { required: true, message: "A brief description of your organization is required" },
                                            { min: 10, message: "Description must be at least 10 characters" }
                                        ]}
                                    >
                                        <TextArea
                                            rows={5}
                                            placeholder="Tell us about your organization's mission, sports offered, facilities, or history."
                                            className="w-full"
                                        />
                                    </Form.Item>

                                    {/* Section 2 Header */}
                                    <div className="border-b border-white/[0.04] pb-2 flex items-center space-x-2 pt-2">
                                        <PictureOutlined className="text-blue-500 text-base" />
                                        <h2 className="text-base font-bold text-white tracking-wide uppercase">2. Branding</h2>
                                    </div>

                                    {/* Logo URL */}
                                    <Form.Item
                                        name="logo"
                                        label={
                                            <div className="flex items-center space-x-1.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logo Image URL</span>
                                                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">(Optional)</span>
                                            </div>
                                        }
                                        rules={[{ type: "url", message: "Please enter a valid image URL" }]}
                                    >
                                        <Input placeholder="E.g. https://domain.com/logo.png" />
                                    </Form.Item>
                                </div>

                                {/* Column 2: Location & Online Presence */}
                                <div className="space-y-6">
                                    {/* Section 3 Header */}
                                    <div className="border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                                        <GlobalOutlined className="text-blue-500 text-base" />
                                        <h2 className="text-base font-bold text-white tracking-wide uppercase">3. Location</h2>
                                    </div>

                                    {/* Country */}
                                    <Form.Item
                                        name="country"
                                        label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Country</span>}
                                        rules={[{ required: true, message: "Country is required" }]}
                                    >
                                        <Select 
                                            showSearch 
                                            placeholder="Search and select country"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                (option?.value ?? "").toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {COUNTRIES.map((c) => (
                                                <Select.Option key={c} value={c}>{c}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* City */}
                                        <Form.Item
                                            name="city"
                                            label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</span>}
                                            rules={[{ required: true, message: "City is required" }]}
                                        >
                                            <Input placeholder="E.g. London" />
                                        </Form.Item>

                                        {/* State */}
                                        <Form.Item
                                            name="state"
                                            label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State</span>}
                                            rules={[{ required: true, message: "State is required" }]}
                                        >
                                            <Input placeholder="E.g. England" />
                                        </Form.Item>
                                    </div>

                                    {/* Section 4 Header */}
                                    <div className="border-b border-white/[0.04] pb-2 flex items-center space-x-2 pt-2">
                                        <LinkOutlined className="text-blue-500 text-base" />
                                        <h2 className="text-base font-bold text-white tracking-wide uppercase">4. Online Presence</h2>
                                    </div>

                                    {/* Website */}
                                    <Form.Item
                                        name="website"
                                        label={
                                            <div className="flex items-center space-x-1.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Website</span>
                                                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide">(Optional)</span>
                                            </div>
                                        }
                                        rules={[{ type: "url", message: "Please enter a valid URL (E.g. https://domain.com)" }]}
                                    >
                                        <Input placeholder="E.g. https://apexacademy.com" />
                                    </Form.Item>
                                </div>

                            </div>

                            {/* Form Actions Footer */}
                            <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-end gap-4">
                                <Button
                                    onClick={handleSaveDraft}
                                    loading={draftLoading}
                                    className="w-full sm:w-auto border border-white/[0.08] hover:border-white/[0.16] bg-white/[0.02] text-slate-300 font-semibold hover:text-white"
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={!loading && <CheckOutlined />}
                                    className="w-full sm:w-auto uppercase tracking-wider shadow-lg shadow-blue-600/20"
                                >
                                    {loading ? "Completing Profile..." : "Complete Profile"}
                                </Button>
                            </div>
                        </Form>
                    </div>

                </div>
            </div>
        </ConfigProvider>
    );
}

export default CreateOrgProfile;
