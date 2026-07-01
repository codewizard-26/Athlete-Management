import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Button, DatePicker, InputNumber, Card, message, Divider } from "antd";
import { 
    TrophyOutlined, 
    CalendarOutlined, 
    EnvironmentOutlined, 
    PlusOutlined, 
    ArrowLeftOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

const { TextArea } = Input;
const { Option } = Select;

function CreateTournament() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [teams, setTeams] = useState([]);
    const [teamsLoading, setTeamsLoading] = useState(false);

    // Fetch organization's teams for the dropdowns
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setTeamsLoading(true);
                const res = await api.get("/team/myTeams");
                setTeams(res.data || []);
            } catch (err) {
                console.error("Error loading organization teams:", err);
                message.error("Failed to load organization teams list");
            } finally {
                setTeamsLoading(false);
            }
        };
        fetchTeams();
    }, []);

    const onFinish = async (values) => {
        try {
            setLoading(true);

            // 1. Format and create the tournament first
            const tournamentPayload = {
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

            const tournamentRes = await api.post("/tournament/create", tournamentPayload);
            const tournamentId = tournamentRes.data?.tournament?._id;

            if (!tournamentId) {
                throw new Error("Failed to retrieve tournament ID from creation response");
            }

            // 2. Schedule any configured initial matches
            if (values.matches && values.matches.length > 0) {
                const matchPromises = values.matches.map((matchVal) => {
                    if (!matchVal.homeTeamId || !matchVal.awayTeamId || !matchVal.matchDate || !matchVal.venue) {
                        return Promise.resolve();
                    }
                    
                    return api.post("/match/create", {
                        tournamentId,
                        homeTeamId: matchVal.homeTeamId,
                        awayTeamId: matchVal.awayTeamId,
                        matchDate: matchVal.matchDate.format("YYYY-MM-DD HH:mm"),
                        venue: matchVal.venue.trim()
                    });
                });

                await Promise.all(matchPromises);
            }

            message.success("Tournament and initial matches created successfully!");
            navigate("/organization/tournaments");
        } catch (err) {
            console.error("Error creating tournament and matches:", err);
            message.error(err.response?.data?.message || err.message || "Failed to save tournament");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Navigation Back */}
            <div className="flex items-center border-b border-border-subtle pb-4">
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined className="text-xs" />} 
                    onClick={() => navigate("/organization/tournaments")}
                    className="text-text-secondary hover:text-text-primary flex items-center p-0 h-auto cursor-pointer"
                >
                    Back to Tournaments
                </Button>
            </div>

            {/* Title */}
            <div className="text-center space-y-3 py-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/15">
                    <TrophyOutlined className="text-xs text-brand-primary" />
                    <span className="text-[10px] font-bold tracking-wider text-brand-primary uppercase">CHAMPIONSHIP ENGINE</span>
                </div>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                    Create Tournament
                </h1>
                <p className="text-xs text-text-secondary max-w-xl mx-auto leading-relaxed">
                    Initialize a new tournament, configure registry limits, and schedule fixtures.
                </p>
            </div>

            {/* Form Card */}
            <Card bordered={false} className="border border-border-subtle bg-bg-surface p-2 sm:p-4 shadow-sm rounded-xl">
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
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Tournament Name</span>}
                        rules={[{ required: true, message: "Please enter the tournament name" }]}
                    >
                        <Input placeholder="e.g. Apex Summer Championship" />
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 2. Sport */}
                        <Form.Item
                            name="sport"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Sport Type</span>}
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
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Age Bracket Limit</span>}
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
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Tournament Location / Venue</span>}
                        rules={[{ required: true, message: "Please specify the venue" }]}
                    >
                        <Input placeholder="e.g. Madison Square Field A, NY" prefix={<EnvironmentOutlined className="text-text-secondary mr-1" />} />
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* 5. Start Date */}
                        <Form.Item
                            name="startDate"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Start Date</span>}
                            rules={[{ required: true, message: "Choose start date" }]}
                        >
                            <DatePicker className="w-full" prefix={<CalendarOutlined className="text-text-secondary mr-1" />} />
                        </Form.Item>

                        {/* 6. End Date */}
                        <Form.Item
                            name="endDate"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">End Date</span>}
                            rules={[{ required: true, message: "Choose end date" }]}
                        >
                            <DatePicker className="w-full" prefix={<CalendarOutlined className="text-text-secondary mr-1" />} />
                        </Form.Item>

                        {/* 7. Registration Deadline */}
                        <Form.Item
                            name="registrationDeadline"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Registry Deadline</span>}
                            rules={[{ required: true, message: "Choose deadline" }]}
                        >
                            <DatePicker className="w-full" prefix={<CalendarOutlined className="text-text-secondary mr-1" />} />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* 8. Max Teams */}
                        <Form.Item
                            name="maxTeams"
                            label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Max Teams Limit</span>}
                            rules={[{ required: true, message: "Specify max teams" }]}
                        >
                            <InputNumber min={2} max={64} className="w-full" />
                        </Form.Item>
                    </div>

                    {/* 9. Description */}
                    <Form.Item
                        name="description"
                        label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Tournament Description</span>}
                    >
                        <TextArea rows={4} placeholder="Describe the format, rules, registration fees, and awards details..." className="rounded-lg" />
                    </Form.Item>

                    {/* INITIAL MATCH SCHEDULER SECTION */}
                    <Divider className="border-border-subtle my-6">
                        <span className="text-[10px] font-bold tracking-wider text-brand-primary uppercase">Initial Match Fixtures</span>
                    </Divider>

                    <div className="space-y-4">
                        <p className="text-[11px] text-text-secondary leading-relaxed -mt-2">
                            (Optional) Schedule the opening match fixtures directly within this tournament. These matches will be created automatically once the tournament is launched.
                        </p>

                        <Form.List name="matches">
                            {(fields, { add, remove }) => (
                                <div className="space-y-4">
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div 
                                            key={key} 
                                            className="p-4 bg-bg-elevated/40 border border-border-subtle rounded-xl relative space-y-4"
                                        >
                                            <Button 
                                                type="text" 
                                                danger 
                                                icon={<DeleteOutlined className="text-xs" />} 
                                                onClick={() => remove(name)}
                                                className="absolute top-2 right-2 text-text-secondary hover:text-status-error h-7 w-7 flex items-center justify-center cursor-pointer"
                                            />
                                            
                                            <div className="text-[9px] font-bold uppercase text-brand-primary tracking-wider">
                                                Match Fixture #{name + 1}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'homeTeamId']}
                                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Home Team</span>}
                                                    rules={[{ required: true, message: 'Please select home team' }]}
                                                >
                                                    <Select placeholder="Select Home Team" loading={teamsLoading}>
                                                        {teams.map(t => (
                                                            <Option key={t._id} value={t._id}>{t.teamName}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'awayTeamId']}
                                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Away Team</span>}
                                                    rules={[
                                                        { required: true, message: 'Please select away team' },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                if (!value || getFieldValue(['matches', name, 'homeTeamId']) !== value) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('Teams must be different'));
                                                            },
                                                        })
                                                    ]}
                                                >
                                                    <Select placeholder="Select Away Team" loading={teamsLoading}>
                                                        {teams.map(t => (
                                                            <Option key={t._id} value={t._id}>{t.teamName}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'matchDate']}
                                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Date & Time</span>}
                                                    rules={[{ required: true, message: 'Select date & time' }]}
                                                >
                                                    <DatePicker showTime format="YYYY-MM-DD HH:mm" className="w-full" />
                                                </Form.Item>

                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'venue']}
                                                    label={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Venue Location</span>}
                                                    rules={[{ required: true, message: 'Specify venue location' }]}
                                                >
                                                    <Input placeholder="e.g. Field Court B" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    ))}

                                    <Button 
                                        type="dashed" 
                                        onClick={() => add({ venue: form.getFieldValue("location") || "" })} 
                                        block 
                                        icon={<PlusOutlined className="text-xs" />}
                                        className="text-xs h-9 rounded-md cursor-pointer border-border-subtle hover:border-brand-primary hover:text-brand-primary"
                                    >
                                        Add Match Fixture
                                    </Button>
                                </div>
                            )}
                        </Form.List>
                    </div>

                    {/* Submit */}
                    <div className="pt-6 border-t border-border-subtle mt-6">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            className="w-full font-semibold text-xs h-10 rounded-md cursor-pointer"
                        >
                            Launch Tournament
                        </Button>
                    </div>
                </Form>
            </Card>

        </div>
    );
}

export default CreateTournament;
