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
        <div className="space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="pb-4 border-b border-border-subtle">
                <h1 className="text-lg font-bold text-text-primary tracking-tight">Recruitment Campaigns</h1>
                <p className="text-xs text-text-secondary mt-0.5">Discover, filter, and apply to open scouting calls from elite teams.</p>
            </div>

            {/* Filter Section */}
            <div className="bg-bg-surface border border-border-subtle p-3 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-grow">
                        <Input 
                            placeholder="Search by drive title or team..." 
                            prefix={<SearchOutlined className="text-text-secondary mr-2" />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full h-10 bg-bg-base border-transparent hover:border-brand-primary focus:border-brand-primary rounded-xl"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <Select 
                            value={sportFilter} 
                            onChange={setSportFilter}
                            className="w-full h-10 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!bg-bg-base [&_.ant-select-selector]:!border-transparent hover:[&_.ant-select-selector]:!border-brand-primary"
                            popupClassName="rounded-xl"
                        >
                            <Option value="all">All Sports</Option>
                            <Option value="football">Football</Option>
                            <Option value="cricket">Cricket</Option>
                        </Select>
                    </div>
                    <div className="w-full md:w-56">
                        <Input 
                            placeholder="Filter by city..." 
                            prefix={<EnvironmentOutlined className="text-text-secondary mr-2" />}
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="w-full h-10 bg-bg-base border-transparent hover:border-brand-primary focus:border-brand-primary rounded-xl"
                        />
                    </div>
                    <div className="w-full md:w-auto">
                        <Button 
                            type="primary"
                            onClick={fetchDrives} 
                            className="w-full md:w-auto h-10 px-6 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
                        >
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {filteredDrives.map(drive => (
                        <div 
                            key={drive._id}
                            className="border border-border-subtle bg-bg-surface shadow-sm hover:border-brand-primary/30 hover:shadow-md transition-all duration-200 rounded-xl flex flex-col group overflow-hidden"
                        >
                            {/* Card Body - Flex Grow to push footer down */}
                            <div className="p-5 flex-grow flex flex-col space-y-4">
                                
                                {/* Header: Avatar, Title, Team & Tag */}
                                <div className="flex items-center gap-4">
                                    {(drive.teamId?.logo?.url || (typeof drive.teamId?.logo === "string" && drive.teamId?.logo)) ? (
                                        <img src={drive.teamId?.logo?.url || drive.teamId?.logo} alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-border-subtle shrink-0 shadow-sm" />
                                    ) : (
                                        <Avatar size={48} icon={<UserOutlined />} className="bg-brand-primary rounded-xl font-bold shrink-0 shadow-sm" />
                                    )}
                                    <div className="min-w-0 flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-sm font-bold text-text-primary leading-tight truncate">{drive.title}</h3>
                                            <Tag color={drive.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 text-[9px] font-bold uppercase shrink-0 px-2 py-0.5 rounded-md">
                                                {drive.sport}
                                            </Tag>
                                        </div>
                                        <p className="text-[11.5px] font-semibold text-text-secondary truncate">{drive.teamId?.teamName || "Apex Team"}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed flex-grow">
                                    {drive.description}
                                </p>

                                {/* Stats & Info Grid (Clean, no heavy borders) */}
                                <div className="grid grid-cols-2 gap-2.5 pt-2">
                                    <div className="flex items-center space-x-2 bg-bg-elevated/40 p-2 rounded-md border border-border-subtle/50">
                                        <div className="bg-bg-surface p-1.5 rounded text-brand-primary shadow-sm border border-border-subtle/30">
                                            <EnvironmentOutlined className="text-[10px]" />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[9px] font-bold text-text-secondary uppercase block leading-none">Location</span>
                                            <span className="text-[11px] font-semibold text-text-primary truncate block mt-0.5 leading-none">{drive.location}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-bg-elevated/40 p-2 rounded-md border border-border-subtle/50">
                                        <div className="bg-bg-surface p-1.5 rounded text-brand-secondary shadow-sm border border-border-subtle/30">
                                            <TrophyOutlined className="text-[10px]" />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[9px] font-bold text-text-secondary uppercase block leading-none">Age Group</span>
                                            <span className="text-[11px] font-semibold text-text-primary truncate block mt-0.5 leading-none">{drive.ageCategory}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Deadline & Spots */}
                                <div className="flex items-center justify-between text-[11px] font-medium pt-1">
                                    <span className="flex items-center text-text-secondary bg-bg-elevated px-2 py-1 rounded-full border border-border-subtle/50">
                                        <CalendarOutlined className="mr-1.5 text-[10px]" />
                                        Ends: {drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                                    </span>
                                    <span className="text-brand-accent bg-brand-accent/10 px-2 py-1 rounded-full border border-brand-accent/20 font-bold">
                                        {drive.vacancies || 0} Spots
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer Actions (Pinned to bottom) */}
                            <div className="p-4 bg-bg-elevated/30 border-t border-border-subtle mt-auto">
                                <Button 
                                    type="primary" 
                                    className="w-full flex items-center justify-center font-bold text-[13px] h-9 rounded-lg shadow-sm transition-transform active:scale-[0.98] cursor-pointer"
                                    onClick={() => handleApply(drive._id)}
                                    loading={submitting[drive._id]}
                                >
                                    Apply for Scouting
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default RecruitmentDrives;
