import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Select, Button, message, Avatar, Card } from "antd";
import {
    GlobalOutlined,
    TrophyOutlined,
    InfoCircleOutlined,
    LinkOutlined,
    PictureOutlined,
    CheckOutlined,
    ArrowLeftOutlined,
    EditOutlined,
    UploadOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";
import { uploadImage } from "../../../api/uploadImage";
import { loginSuccess } from "../../auth/authSlice";
import { COUNTRIES } from "../../../utils/countries";

const { TextArea } = Input;

function CreateOrgProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!user?.isProfileCompleted);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (user?.isProfileCompleted) {
            const fetchOrgProfile = async () => {
                try {
                    setPageLoading(true);
                    const res = await api.get("/organization/me");
                    if (res.data) {
                        form.setFieldsValue(res.data);
                    }
                } catch (err) {
                    console.error("Error loading org profile:", err);
                    message.error("Failed to load organization profile details");
                } finally {
                    setPageLoading(false);
                }
            };
            fetchOrgProfile();
        }
    }, [user, form]);

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);

            let uploadedLogo = isEditing && form.getFieldValue("logo"); // keep existing if not changed
            if (fileList.length > 0) {
                uploadedLogo = await uploadImage(fileList[0], "organization-logos");
            }

            // Structure request body for the backend
            const payload = {
                organizationName: values.organizationName.trim(),
                description: values.description.trim(),
                logo: uploadedLogo,
                city: values.city.trim(),
                state: values.state.trim(),
                country: values.country.trim(),
                website: values.website ? values.website.trim() : ""
            };

            if (user?.isProfileCompleted) {
                await api.put("/organization/update", payload);
                message.success("Organization profile updated successfully!");
                setIsEditing(false);
            } else {
                await api.post("/organization/profile", payload);
                dispatch(loginSuccess({
                    user: { ...user, isProfileCompleted: true },
                    token
                }));
                message.success("Organization profile completed successfully!");
                setIsEditing(false);
            }

            navigate("/dashboard");

        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to save organization profile. Please try again.";
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

    if (!isEditing) {
        return (
            <div className="max-w-4xl w-full mx-auto space-y-6 animate-fadeIn">
                {/* Return to Dashboard */}
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined className="text-xs" />} 
                        onClick={() => navigate("/dashboard")}
                        className="text-text-secondary hover:text-text-primary flex items-center p-0 h-auto cursor-pointer"
                    >
                        Back to Dashboard
                    </Button>
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
                <div className="pt-2 sm:pt-4">
                    {/* Org Header */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-border-subtle pb-5">
                        <Avatar size={64} src={form.getFieldValue("logo")?.url || undefined} icon={!form.getFieldValue("logo")?.url && <TrophyOutlined />} className="bg-brand-primary rounded shadow-sm shrink-0" />
                        <div className="text-center sm:text-left space-y-2 min-w-0">
                            <h2 className="text-base font-bold text-text-primary leading-tight m-0">{form.getFieldValue("organizationName")}</h2>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className="text-[10px] bg-brand-primary/10 text-brand-primary font-semibold uppercase px-2 py-0.5 rounded border border-brand-primary/15 tracking-wider">{user?.role}</span>
                                {form.getFieldValue("website") && (
                                    <>
                                        <span className="text-text-secondary/30">•</span>
                                        <a href={form.getFieldValue("website")} target="_blank" rel="noreferrer" className="text-xs text-brand-primary hover:underline flex items-center gap-1">
                                            <LinkOutlined className="text-[10px]" />
                                            <span>{form.getFieldValue("website")}</span>
                                        </a>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-text-secondary font-mono m-0">{user?.email}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                        {/* Location */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                                <GlobalOutlined className="text-brand-primary" />
                                <span>Registered Location</span>
                            </h3>
                            <div className="bg-bg-elevated/40 border border-border-subtle rounded-xl p-4 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary">City</span>
                                    <span className="font-semibold text-text-primary">{form.getFieldValue("city")}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary">State</span>
                                    <span className="font-semibold text-text-primary">{form.getFieldValue("state")}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary">Country</span>
                                    <span className="font-semibold text-text-primary">{form.getFieldValue("country")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                                <InfoCircleOutlined className="text-brand-primary" />
                                <span>Mission & Description</span>
                            </h3>
                            <p className="text-xs text-text-secondary leading-relaxed bg-bg-elevated/20 border border-border-subtle rounded-xl p-4 m-0 min-h-[105px]">
                                {form.getFieldValue("description") || "No description configured yet."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl w-full mx-auto space-y-6 animate-fadeIn">
            {/* Return Navigation */}
            {user?.isProfileCompleted && (
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
            )}

            {/* Header */}
            <div className="text-center space-y-3 py-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/15">
                    <TrophyOutlined className="text-xs text-brand-primary" />
                    <span className="text-[10px] font-bold tracking-wider text-brand-primary uppercase">ORGANIZATION REGISTRY PORTAL</span>
                </div>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                    {user?.isProfileCompleted ? "Edit Your Organization Profile" : "Complete Your Organization Profile"}
                </h1>
                <p className="text-xs text-text-secondary max-w-xl mx-auto leading-relaxed">
                    {user?.isProfileCompleted 
                        ? "Update your organization name, description, location details, branding logo and official website below."
                        : "Set up your organization to create teams, manage tournaments, organize matches, and track athlete development."
                    }
                </p>
            </div>

            {/* Form Container */}
            <div className="pt-2 sm:pt-4 relative">
                {pageLoading && (
                    <div className="absolute inset-0 bg-bg-base/75 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-xl">
                        <span className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full mb-4" />
                        <p className="text-xs text-text-secondary font-semibold">Loading organization data...</p>
                    </div>
                )}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    requiredMark={false}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Column 1: Organization details & Branding */}
                        <div className="space-y-5">
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <TrophyOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">1. Organization Information</h2>
                            </div>

                            <Form.Item
                                name="organizationName"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Organization Name</span>}
                                rules={[
                                    { required: true, message: "Organization name is required" },
                                    { min: 2, message: "Name must be at least 2 characters" }
                                ]}
                            >
                                <Input placeholder="E.g. Apex Football Academy, Golden Bat Association" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Description</span>}
                                rules={[
                                    { required: true, message: "A brief description of your organization is required" },
                                    { min: 10, message: "Description must be at least 10 characters" }
                                ]}
                            >
                                <TextArea
                                    rows={5}
                                    placeholder="Tell us about your organization's mission, sports offered, facilities, or history."
                                    className="w-full rounded-lg"
                                />
                            </Form.Item>

                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2 pt-2">
                                <PictureOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">2. Branding</h2>
                            </div>

                            <Form.Item
                                label={
                                    <div className="flex items-center space-x-1">
                                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Logo Image</span>
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
                                        Select Image
                                    </Button>
                                </Upload>
                                {isEditing && form.getFieldValue("logo")?.url && (
                                    <div className="mt-2 text-[10px] text-text-secondary">Current logo will be kept if no new image is selected.</div>
                                )}
                            </Form.Item>
                        </div>

                        {/* Column 2: Location & Online Presence */}
                        <div className="space-y-5">
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <GlobalOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">3. Location</h2>
                            </div>

                            <Form.Item
                                name="country"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Country</span>}
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

                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2 pt-2">
                                <LinkOutlined className="text-brand-primary text-xs" />
                                <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">4. Online Presence</h2>
                            </div>

                            <Form.Item
                                name="website"
                                label={
                                    <div className="flex items-center space-x-1">
                                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Official Website</span>
                                        <span className="text-[9px] text-text-secondary/50 font-semibold uppercase tracking-wide">(Optional)</span>
                                    </div>
                                }
                                rules={[{ type: "url", message: "Please enter a valid URL (E.g. https://domain.com)" }]}
                            >
                                <Input placeholder="E.g. https://apexacademy.com" prefix={<LinkOutlined className="text-text-secondary mr-1" />} />
                            </Form.Item>
                        </div>

                    </div>

                    {/* Form Actions Footer */}
                    <div className="mt-6 pt-5 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-end gap-3">
                        {user?.isProfileCompleted ? (
                            <Button
                                onClick={() => setIsEditing(false)}
                                className="w-full sm:w-auto text-xs"
                            >
                                Cancel
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSaveDraft}
                                loading={draftLoading}
                                className="w-full sm:w-auto text-xs"
                            >
                                Save Draft
                            </Button>
                        )}
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={!loading && <CheckOutlined className="text-xs" />}
                            className="w-full sm:w-auto font-semibold text-xs h-9 rounded-md cursor-pointer"
                        >
                            {loading 
                                ? (user?.isProfileCompleted ? "Updating Profile..." : "Completing Profile...") 
                                : (user?.isProfileCompleted ? "Update Profile" : "Complete Profile")
                            }
                        </Button>
                    </div>
                </Form>
            </div>

        </div>
    );
}

export default CreateOrgProfile;
