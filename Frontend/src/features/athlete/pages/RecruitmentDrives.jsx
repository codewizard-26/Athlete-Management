import React, { useState, useEffect } from "react";
import { Card, Input, Select, Button, Tag, Avatar, message, Row, Col, Empty } from "antd";
import { 
    SearchOutlined, 
    EnvironmentOutlined, 
    TrophyOutlined, 
    UserOutlined, 
    CalendarOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

const { Option } = Select;

function RecruitmentDrives() {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState({});
    
    // Filter states
    const [sportFilter, setSportFilter] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const fetchDrives = async () => {
        try {
            setLoading(true);
            const res = await api.get("/recruitment/all");
            if (res.data) {
                setDrives(res.data);
            }
        } catch (err) {
            console.error("Error fetching recruitment drives:", err);
            message.error("Failed to load recruitment drives");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrives();
    }, []);

    const handleApply = async (driveId) => {
        try {
            setSubmitting(prev => ({ ...prev, [driveId]: true }));
            const res = await api.post(`/recruitment/apply/${driveId}`);
            message.success(res.data?.message || "Scouting application submitted successfully!");
            fetchDrives(); // Reload to update states if needed
        } catch (err) {
            console.error("Error applying to recruitment drive:", err);
            message.error(err.response?.data?.message || "Failed to submit application");
        } finally {
            setSubmitting(prev => ({ ...prev, [driveId]: false }));
        }
    };

    // Filter logic
    const filteredDrives = drives.filter(drive => {
        const matchesSport = sportFilter === "all" || drive.sport?.toLowerCase() === sportFilter.toLowerCase();
        
        const driveTitle = drive.title?.toLowerCase() || "";
        const teamName = drive.teamId?.teamName?.toLowerCase() || "";
        const matchesSearch = driveTitle.includes(searchText.toLowerCase()) || teamName.includes(searchText.toLowerCase());

        const driveLoc = drive.location?.toLowerCase() || "";
        const matchesLocation = !locationFilter || driveLoc.includes(locationFilter.toLowerCase());

        return matchesSport && matchesSearch && matchesLocation;
    });

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="pb-4 border-b border-border-subtle">
                <h1 className="text-lg font-bold text-text-primary tracking-tight">Recruitment Campaigns</h1>
                <p className="text-xs text-text-secondary mt-0.5">Discover, filter, and apply to open scouting calls from elite teams.</p>
            </div>

            {/* Filter Section */}
            <Card bordered={false} className="border border-border-subtle bg-bg-surface p-4 rounded-xl shadow-sm">
                <Row gutter={[12, 12]} align="middle">
                    <Col xs={24} md={8}>
                        <Input 
                            placeholder="Search by drive title or team..." 
                            prefix={<SearchOutlined className="text-text-secondary mr-1" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="bg-bg-surface border-border-subtle hover:border-brand-primary"
                        />
                    </Col>
                    <Col xs={12} md={5}>
                        <Select 
                            value={sportFilter} 
                            onChange={setSportFilter}
                            className="w-full"
                        >
                            <Option value="all">All Sports</Option>
                            <Option value="football">Football</Option>
                            <Option value="cricket">Cricket</Option>
                        </Select>
                    </Col>
                    <Col xs={12} md={5}>
                        <Input 
                            placeholder="Filter by city/location..." 
                            prefix={<EnvironmentOutlined className="text-text-secondary mr-1" />}
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="bg-bg-surface border-border-subtle hover:border-brand-primary"
                        />
                    </Col>
                    <Col xs={24} md={6} className="text-right">
                        <Button 
                            onClick={fetchDrives} 
                            className="w-full border-border-subtle hover:border-brand-primary hover:text-brand-primary text-xs font-semibold cursor-pointer"
                        >
                            Refresh Drives
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Drives Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Card key={i} loading bordered={false} className="border border-border-subtle bg-bg-surface rounded-xl shadow-sm" />
                    ))}
                </div>
            ) : filteredDrives.length === 0 ? (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-16 text-center rounded-xl shadow-sm">
                    <Empty description={<span className="text-text-secondary text-xs">No active recruitment drives found matching the filters.</span>} />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDrives.map(drive => (
                        <Card 
                            key={drive._id}
                            bordered={false} 
                            className="border border-border-subtle bg-bg-surface shadow-sm hover:border-brand-primary/25 hover:shadow-md transition-all duration-150 rounded-xl flex flex-col justify-between group"
                        >
                            {/* Card Body */}
                            <div className="space-y-4 flex-grow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3 min-w-0">
                                        {(drive.teamId?.logo?.url || (typeof drive.teamId?.logo === "string" && drive.teamId?.logo)) ? (
                                            <img src={drive.teamId?.logo?.url || drive.teamId?.logo} alt="Logo" className="w-9 h-9 rounded object-cover border border-border-subtle shrink-0" />
                                        ) : (
                                            <Avatar size={36} icon={<UserOutlined />} className="bg-brand-primary rounded font-bold shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="text-xs font-semibold text-text-primary leading-tight truncate">{drive.title}</h3>
                                            <p className="text-[10px] text-text-secondary truncate mt-0.5">{drive.teamId?.teamName || "Apex Team"}</p>
                                        </div>
                                    </div>
                                    <Tag color={drive.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 text-[9px] font-semibold uppercase">
                                        {drive.sport}
                                    </Tag>
                                </div>

                                <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                                    {drive.description}
                                </p>

                                <div className="grid grid-cols-2 gap-3.5 bg-bg-elevated/50 border border-border-subtle p-3.5 rounded-lg text-[11px]">
                                    <div>
                                        <span className="text-text-secondary block uppercase font-semibold text-[8px]">Location</span>
                                        <span className="text-text-primary font-medium flex items-center mt-0.5 truncate">
                                            <EnvironmentOutlined className="mr-1 text-brand-primary" />
                                            {drive.location}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-text-secondary block uppercase font-semibold text-[8px]">Age Group</span>
                                        <span className="text-text-primary font-medium flex items-center mt-0.5">
                                            <TrophyOutlined className="mr-1 text-brand-secondary" />
                                            {drive.ageCategory}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] border-t border-border-subtle pt-3 text-text-secondary">
                                    <span className="flex items-center text-xs">
                                        <CalendarOutlined className="mr-1 text-[10px]" />
                                        Deadline: {drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString() : "N/A"}
                                    </span>
                                    <span className="font-semibold text-brand-primary">
                                        {drive.vacancies || 0} Open Spots
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="mt-5 border-t border-border-subtle pt-4">
                                <Button 
                                    type="primary" 
                                    className="w-full flex items-center justify-center font-semibold text-xs h-9 rounded-md cursor-pointer"
                                    onClick={() => handleApply(drive._id)}
                                    loading={submitting[drive._id]}
                                >
                                    Apply for Scouting
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

        </div>
    );
}

export default RecruitmentDrives;
