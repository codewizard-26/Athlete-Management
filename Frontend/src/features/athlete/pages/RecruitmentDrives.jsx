import React, { useState, useEffect } from "react";
import { Card, Input, Select, Button, Tag, Avatar, message, Row, Col, Space, Empty } from "antd";
import { 
    SearchOutlined, 
    EnvironmentOutlined, 
    TrophyOutlined, 
    UserOutlined, 
    CalendarOutlined,
    NotificationOutlined,
    CheckCircleOutlined
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
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-wider">Recruitment Campaigns</h1>
                <p className="text-xs text-slate-400 mt-1">Discover, filter, and apply to open scouting calls from apex teams.</p>
            </div>

            {/* Filter Section */}
            <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm p-4">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={8}>
                        <Input 
                            placeholder="Search by drive title or team..." 
                            prefix={<SearchOutlined className="text-slate-400" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="bg-[#0b0f19] border-white/[0.06] hover:border-blue-500/50"
                        />
                    </Col>
                    <Col xs={12} md={5}>
                        <Select 
                            value={sportFilter} 
                            onChange={setSportFilter}
                            className="w-full"
                            dropdownClassName="bg-[#0f172a]"
                        >
                            <Option value="all">All Sports</Option>
                            <Option value="football">Football</Option>
                            <Option value="cricket">Cricket</Option>
                        </Select>
                    </Col>
                    <Col xs={12} md={5}>
                        <Input 
                            placeholder="Filter by city/location..." 
                            prefix={<EnvironmentOutlined className="text-slate-400" />}
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="bg-[#0b0f19] border-white/[0.06] hover:border-blue-500/50"
                        />
                    </Col>
                    <Col xs={24} md={6} className="text-right">
                        <Button type="primary" onClick={fetchDrives} className="w-full sm:w-auto">
                            Refresh Drives
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Drives Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <Card key={i} loading bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25" />
                    ))}
                </div>
            ) : filteredDrives.length === 0 ? (
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-16 text-center">
                    <Empty description={<span className="text-slate-400 text-xs">No active recruitment drives found matching the filters.</span>} />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDrives.map(drive => (
                        <Card 
                            key={drive._id}
                            bordered={false} 
                            className="border border-white/[0.04] bg-[#0f172a]/40 backdrop-blur-sm shadow-md hover:border-blue-500/25 transition-all flex flex-col justify-between"
                        >
                            {/* Card Body */}
                            <div className="space-y-4 flex-grow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3 min-w-0">
                                        {drive.teamId?.logo ? (
                                            <img src={drive.teamId.logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                                        ) : (
                                            <Avatar size={40} icon={<UserOutlined />} className="bg-blue-600 rounded-lg font-bold shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-white leading-tight truncate">{drive.title}</h3>
                                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{drive.teamId?.teamName || "Apex Team"}</p>
                                        </div>
                                    </div>
                                    <Tag color={drive.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 text-[9px] font-black uppercase">
                                        {drive.sport}
                                    </Tag>
                                </div>

                                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                                    {drive.description}
                                </p>

                                <div className="grid grid-cols-2 gap-3 bg-[#0b0f19]/40 border border-white/[0.03] p-3 rounded-lg text-[10px]">
                                    <div>
                                        <span className="text-slate-500 block uppercase font-bold text-[8px]">Location</span>
                                        <span className="text-slate-300 font-semibold flex items-center mt-0.5 truncate">
                                            <EnvironmentOutlined className="mr-1 text-blue-400" />
                                            {drive.location}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block uppercase font-bold text-[8px]">Age Group</span>
                                        <span className="text-slate-300 font-semibold flex items-center mt-0.5">
                                            <TrophyOutlined className="mr-1 text-emerald-400" />
                                            {drive.ageCategory}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[10px] border-t border-white/[0.03] pt-3 text-slate-400">
                                    <span className="flex items-center">
                                        <CalendarOutlined className="mr-1" />
                                        Deadline: {drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString() : "N/A"}
                                    </span>
                                    <span className="font-bold text-blue-400">
                                        {drive.vacancies || 0} Open Spots
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="mt-5 border-t border-white/[0.03] pt-4">
                                <Button 
                                    type="primary" 
                                    className="w-full flex items-center justify-center font-bold tracking-wide"
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

        </main>
    );
}

export default RecruitmentDrives;
