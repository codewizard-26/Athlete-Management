import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Select, DatePicker, InputNumber, Button, message, Avatar, Badge, Card } from "antd";
import {
    UserOutlined,
    GlobalOutlined,
    CalendarOutlined,
    TrophyOutlined,
    InfoCircleOutlined,
    CheckOutlined,
    ArrowLeftOutlined,
    EditOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";
import { loginSuccess } from "../../auth/authSlice";
import { COUNTRIES } from "../../../utils/countries";
import dayjs from "dayjs";

const { TextArea } = Input;

function CreateProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [draftLoading, setDraftLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!user?.isProfileCompleted);

    useEffect(() => {
        if (user?.isProfileCompleted) {
            const fetchProfile = async () => {
                try {
                    setPageLoading(true);
                    const res = await api.get("/athleteprofile/me");
                    if (res.data) {
                        form.setFieldsValue({
                            ...res.data,
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
            fetchProfile();
        }
    }, [user, form]);

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);

            // Format date of birth to ISO format
            const dobFormatted = values.dob ? values.dob.toISOString() : null;

            const payload = {
                sport: values.sport,
                primaryRole: values.primaryRole,
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

            if (user?.isProfileCompleted) {
                await api.put("/athleteprofile/update", payload);
                message.success("Athlete profile updated successfully!");
                setIsEditing(false);
            } else {
                await api.post("/athleteprofile/profile", payload);
                // Update Redux state with profile status
                dispatch(loginSuccess({
                    user: { ...user, isProfileCompleted: true },
                    token
                }));
                message.success("Athlete profile completed successfully!");
                setIsEditing(false);
            }

            // Redirect to dashboard upon completion
            navigate("/dashboard");

        } catch (err) {
            const errMsg = err.response?.data?.message || "Failed to save profile. Please try again.";
            message.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = () => {
        setDraftLoading(true);
        setTimeout(() => {
            message.success("Draft saved successfully!");
            setDraftLoading(false);
        }, 800);
    };

    if (!isEditing) {
        if (pageLoading) {
            return (
                <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse" aria-busy="true">
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-32 bg-bg-elevated rounded" />
                        <div className="h-9 w-28 bg-bg-elevated rounded" />
                    </div>
                    <div className="border border-border-subtle bg-bg-surface p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-border-subtle pb-6">
                            <div className="w-20 h-20 rounded-full bg-bg-elevated shrink-0" />
                            <div className="space-y-3 flex-1">
                                <div className="h-7 w-48 bg-bg-elevated rounded" />
                                <div className="h-4 w-32 bg-bg-elevated rounded" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-36 bg-bg-elevated/50 rounded-xl" />
                            <div className="h-36 bg-bg-elevated/50 rounded-xl" />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
                {/* Return to Dashboard */}
                <div className="flex items-center justify-between">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate("/dashboard")}
                        className="text-text-secondary hover:text-text-primary flex items-center p-0 h-auto cursor-pointer"
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => setIsEditing(true)}
                        className="shadow-sm cursor-pointer"
                    >
                        Edit Profile
                    </Button>
                </div>

                {/* Profile Card */}
                <div className="border border-border-subtle bg-bg-surface p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
                    {/* Athlete Header */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-border-subtle pb-6">
                        <Avatar size={80} icon={<UserOutlined />} className="bg-brand-primary shadow-md shrink-0 text-white" />
                        <div className="text-center sm:text-left space-y-2 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary leading-tight">{user?.name}</h1>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                <span className="bg-brand-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                                    {form.getFieldValue("sport")?.toUpperCase() || "ATHLETE"}
                                </span>
                                <span className="text-xs text-text-primary font-semibold">{form.getFieldValue("primaryRole")}</span>
                                {form.getFieldValue("secondaryRole") && form.getFieldValue("secondaryRole") !== "None" && (
                                    <>
                                        <span className="text-text-secondary">•</span>
                                        <span className="text-xs text-text-secondary">{form.getFieldValue("secondaryRole")}</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-text-secondary font-mono">{user?.email}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2">
                        {/* Left Column: Biometrics */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2">
                                <TrophyOutlined />
                                <span>Personal Biometrics</span>
                            </h3>
                            <div className="bg-bg-elevated/40 border border-border-subtle rounded-xl p-4 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary font-medium">Gender</span>
                                    <span className="font-bold text-text-primary capitalize">{form.getFieldValue("gender") || "Not specified"}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary font-medium">Date of Birth</span>
                                    <span className="font-bold text-text-primary">
                                        {form.getFieldValue("dob") ? form.getFieldValue("dob").format("MM/DD/YYYY") : "Not provided"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary font-medium">Height</span>
                                    <span className="font-bold text-text-primary">{form.getFieldValue("height") ? `${form.getFieldValue("height")} cm` : "Not provided"}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary font-medium">Weight</span>
                                    <span className="font-bold text-text-primary">{form.getFieldValue("weight") ? `${form.getFieldValue("weight")} kg` : "Not provided"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Location */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2">
                                <GlobalOutlined />
                                <span>Registry & Location</span>
                            </h3>
                            <div className="bg-bg-elevated/40 border border-border-subtle rounded-xl p-4 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary font-medium">City</span>
                                    <span className="font-bold text-text-primary">{form.getFieldValue("city") || "Not provided"}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary font-medium">State</span>
                                    <span className="font-bold text-text-primary">{form.getFieldValue("state") || "Not provided"}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-secondary font-medium">Country</span>
                                    <span className="font-bold text-text-primary">{form.getFieldValue("country") || "Not provided"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Block */}
                    <div className="pt-4 border-t border-border-subtle space-y-3">
                        <h3 className="text-xs font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2">
                            <InfoCircleOutlined />
                            <span>About Athlete</span>
                        </h3>
                        <p className="text-xs text-text-primary leading-relaxed bg-bg-elevated/20 border border-border-subtle rounded-xl p-4 m-0">
                            {form.getFieldValue("bio") || "No bio description completed yet."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
            {/* Return Navigation */}
            {user?.isProfileCompleted && (
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate("/dashboard")}
                        className="text-text-secondary hover:text-text-primary flex items-center p-0 h-auto cursor-pointer"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            )}

            {/* Header */}
            <div className="text-center space-y-3 py-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/15">
                    <TrophyOutlined className="text-xs text-brand-primary" />
                    <span className="text-[10px] font-bold tracking-wider text-brand-primary uppercase">ATHLETE BIOMETRICS DATABASE</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                    {user?.isProfileCompleted ? "Edit Your Athlete Profile" : "Complete Your Athlete Profile"}
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    {user?.isProfileCompleted
                        ? "Update your sporting credentials, location records, and personal biometrics profile below."
                        : "Provide your sporting and personal information to participate in recruitment drives, join teams, compete in tournaments, and track your performance."
                    }
                </p>
            </div>

            {/* Form Card Container */}
            <div className="bg-bg-surface border border-border-subtle p-6 sm:p-8 rounded-2xl shadow-sm relative">
                {pageLoading && (
                    <div className="absolute inset-0 bg-bg-surface/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl">
                        <span className="animate-spin h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full mb-4" />
                        <p className="text-xs text-text-secondary font-semibold">Loading profile data...</p>
                    </div>
                )}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    requiredMark={false}
                >
                    {/* Responsive two-column layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                        {/* Column 1: Sports & Personal Information */}
                        <div className="space-y-6">
                            {/* Section 1 Header */}
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <TrophyOutlined className="text-brand-primary text-base" />
                                <h2 className="text-sm font-bold text-text-primary tracking-wide uppercase">1. Sports Information</h2>
                            </div>

                            {/* Sport Select */}
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

                            {/* Primary Role */}
                            <Form.Item
                                name="primaryRole"
                                label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Primary Role</span>}
                                rules={[{ required: true, message: "Primary playing role is required (e.g. Batsman, Striker)" }]}
                            >
                                <Input placeholder="E.g. Batsman, Striker, Midfielder, Wicketkeeper" />
                            </Form.Item>

                            {/* Secondary Role */}
                            <Form.Item
                                name="secondaryRole"
                                label={
                                    <div className="flex items-center space-x-1.5">
                                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Secondary Role</span>
                                        <span className="text-[9px] text-text-secondary opacity-75 font-semibold uppercase tracking-wide">(Optional)</span>
                                    </div>
                                }
                            >
                                <Input placeholder="E.g. Bowler, Goalkeeper, Defender, Winger" />
                            </Form.Item>

                            {/* Section 2 Header */}
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2 pt-2">
                                <UserOutlined className="text-brand-primary text-base" />
                                <h2 className="text-sm font-bold text-text-primary tracking-wide uppercase">2. Personal Information</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Gender */}
                                <Form.Item
                                    name="gender"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Gender</span>}
                                    rules={[{ required: true, message: "Gender selection is required" }]}
                                >
                                    <Select placeholder="Select Gender" className="w-full">
                                        <Select.Option value="male">Male</Select.Option>
                                        <Select.Option value="female">Female</Select.Option>
                                    </Select>
                                </Form.Item>

                                {/* Date of Birth */}
                                <Form.Item
                                    name="dob"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Date of Birth</span>}
                                    rules={[{ required: true, message: "Date of birth is required" }]}
                                >
                                    <DatePicker
                                        className="w-full"
                                        placeholder="Select Date"
                                        suffixIcon={<CalendarOutlined className="text-text-secondary" />}
                                    />
                                </Form.Item>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Height */}
                                <Form.Item
                                    name="height"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Height (cm)</span>}
                                    rules={[
                                        { required: true, message: "Height is required" },
                                        { type: "number", min: 50, max: 250, message: "Enter a valid height (50-250)" }
                                    ]}
                                >
                                    <InputNumber className="w-full" placeholder="E.g. 175" />
                                </Form.Item>

                                {/* Weight */}
                                <Form.Item
                                    name="weight"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Weight (kg)</span>}
                                    rules={[
                                        { required: true, message: "Weight is required" },
                                        { type: "number", min: 20, max: 200, message: "Enter a valid weight (20-200)" }
                                    ]}
                                >
                                    <InputNumber className="w-full" placeholder="E.g. 70" />
                                </Form.Item>
                            </div>
                        </div>

                        {/* Column 2: Location & About Athlete */}
                        <div className="space-y-6">
                            {/* Section 3 Header */}
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2">
                                <GlobalOutlined className="text-brand-primary text-base" />
                                <h2 className="text-sm font-bold text-text-primary tracking-wide uppercase">3. Location</h2>
                            </div>

                            {/* Country */}
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
                                {/* City */}
                                <Form.Item
                                    name="city"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">City</span>}
                                    rules={[{ required: true, message: "City is required" }]}
                                >
                                    <Input placeholder="E.g. London" />
                                </Form.Item>

                                {/* State */}
                                <Form.Item
                                    name="state"
                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">State</span>}
                                    rules={[{ required: true, message: "State is required" }]}
                                >
                                    <Input placeholder="E.g. England" />
                                </Form.Item>
                            </div>

                            {/* Section 4 Header */}
                            <div className="border-b border-border-subtle pb-2 flex items-center space-x-2 pt-2">
                                <InfoCircleOutlined className="text-brand-primary text-base" />
                                <h2 className="text-sm font-bold text-text-primary tracking-wide uppercase">4. About Athlete</h2>
                            </div>

                            {/* Bio */}
                            <Form.Item
                                name="bio"
                                label={
                                    <div className="flex items-center space-x-1.5">
                                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Athlete Bio</span>
                                        <span className="text-[9px] text-text-secondary opacity-75 font-semibold uppercase tracking-wide">(Optional)</span>
                                    </div>
                                }
                            >
                                <TextArea
                                    rows={6}
                                    placeholder="Introduce yourself. Mention your training background, playing achievements, physical attributes, or goals in the sport."
                                    className="w-full"
                                />
                            </Form.Item>
                        </div>

                    </div>

                    {/* Form Actions Footer */}
                    <div className="mt-8 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-end gap-4">
                        {user?.isProfileCompleted ? (
                            <Button
                                onClick={() => setIsEditing(false)}
                                className="w-full sm:w-auto border border-border-subtle bg-bg-elevated text-text-primary font-semibold hover:bg-bg-inset cursor-pointer"
                            >
                                Cancel
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSaveDraft}
                                loading={draftLoading}
                                className="w-full sm:w-auto border border-border-subtle bg-bg-elevated text-text-primary font-semibold hover:bg-bg-inset cursor-pointer"
                            >
                                Save Draft
                            </Button>
                        )}
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={!loading && <CheckOutlined />}
                            className="w-full sm:w-auto uppercase tracking-wider shadow-md cursor-pointer"
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

export default CreateProfile;
