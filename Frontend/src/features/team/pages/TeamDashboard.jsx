import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Card, Statistic, Timeline, Button, Tag, Avatar, message } from "antd";
import { 
    TeamOutlined, 
    NotificationOutlined, 
    SolutionOutlined, 
    CalendarOutlined, 
    ArrowRightOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    PlayCircleOutlined,
    UserAddOutlined,
    PlusOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function TeamDashboard() {
    const navigate = useNavigate();
    const { teamData } = useOutletContext(); // Retrieve team detail state shared from Layout

    const [stats, setStats] = useState({
        members: 0,
        pendingRequests: 0,
        drivesCount: 0,
        matchesCount: 0,
        activities: []
    });
    const [loading, setLoading] = useState(true);
    const [openDrives, setOpenDrives] = useState([]);
    const [pendingApps, setPendingApps] = useState([]);
    const [recentMembers, setRecentMembers] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [dashRes, drivesRes, pendingRes, membersRes] = await Promise.all([
                    api.get("/dashboard/team"),
                    api.get("/recruitment/my-drives"),
                    api.get("/team/pending-members"),
                    api.get("/team/me/members")
                ]);
                if (isMounted) {
                    if (dashRes.data) setStats(dashRes.data);
                    if (drivesRes.data) {
                        const open = drivesRes.data.filter(d => d.status === "open");
                        setOpenDrives(open);
                    }
                    if (pendingRes.data) setPendingApps(pendingRes.data);
                    if (membersRes.data) setRecentMembers(membersRes.data);
                }
            } catch (err) {
                console.error("Error fetching team dashboard stats:", err);
                message.error("Failed to fetch dashboard metrics");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    const getRelativeTimeString = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 30) return `${diffDays} days ago`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getTimelineItems = () => {
        if (!stats.activities || stats.activities.length === 0) {
            return [
                {
                    color: "gray",
                    children: (
                        <div>
                            <span className="text-text-secondary text-[11px] italic">No recent activities recorded.</span>
                        </div>
                    )
                }
            ];
        }

        return stats.activities.map((act) => {
            let color = "#6366F1";
            if (act.type === "membership") {
                color = act.description.includes("ACTIVE") ? "#059669" : "#D97706";
            } else if (act.type === "application") {
                color = "#4F46E5";
            }

            return {
                color: color,
                children: (
                    <div key={act.id} className="pb-1">
                        <span className="font-semibold text-text-primary text-xs">{act.title}</span>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                            {act.description} • {getRelativeTimeString(act.date)}
                        </p>
                    </div>
                )
            };
        });
    };

    const handleActionClick = (section) => {
        const sec = section.toLowerCase();
        if (sec.includes("recruitment") || sec.includes("campaign") || sec.includes("drive")) {
            navigate("/team/recruitment");
        } else if (sec.includes("application") || sec.includes("review")) {
            navigate("/team/applications");
        } else if (sec.includes("roster")) {
            navigate("/team/roster");
        } else if (sec.includes("performance") || sec.includes("stats")) {
            navigate("/team/performance");
        } else {
            message.info(`${section} workspace is under development`);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Welcome Banner */}
            <div className="bg-bg-surface border border-border-subtle p-6 sm:p-8 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden animate-slideUp stagger-1">
                <div className="space-y-1.5 relative z-10">
                    <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                        Welcome Back, {teamData?.teamName || "Coach"}
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
                        Manage your squad, recruitment drives, athlete applications, and performance tracking.
                    </p>
                </div>
                {teamData && (
                    <div className="shrink-0 flex items-center space-x-3 bg-brand-primary/10 border border-brand-primary/20 px-4 py-3 rounded-xl relative z-10">
                        <Avatar size={36} src={.logo?.url || .logo} icon={<TeamOutlined />} className="bg-brand-primary rounded" />
                        <div>
                            <p className="text-[9px] text-brand-primary uppercase tracking-wider font-semibold leading-none">Category</p>
                            <p className="text-xs font-bold text-text-primary mt-1.5 leading-none">{teamData.ageCategory}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-slideUp stagger-2">
                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Active Players</span>}
                        value={loading ? "..." : stats.members} 
                        valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<TeamOutlined className="text-brand-primary mr-2 text-base" />}
                    />
                </Card>

                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Recruitment Drives</span>}
                        value={loading ? "..." : stats.drivesCount} 
                        valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<NotificationOutlined className="text-brand-primary mr-2 text-base" />}
                    />
                </Card>

                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Pending Applications</span>}
                        value={loading ? "..." : stats.pendingRequests} 
                        valueStyle={{ color: 'var(--color-accent)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<SolutionOutlined className="text-brand-accent mr-2 text-base" />}
                    />
                </Card>

                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Matches Played</span>}
                        value={loading ? "..." : stats.matchesCount} 
                        valueStyle={{ color: 'var(--color-secondary)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<CalendarOutlined className="text-brand-secondary mr-2 text-base" />}
                    />
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 animate-slideUp stagger-3">
                <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase border-b border-border-subtle pb-2 flex items-center space-x-1.5">
                    <PlayCircleOutlined className="text-brand-primary text-xs" />
                    <span>Quick Actions</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Action 1 */}
                    <div 
                        onClick={() => handleActionClick("Create Recruitment Drive")}
                        className="p-3 sm:p-4 bg-bg-surface border border-border-subtle rounded-xl hover:border-brand-primary/30 transition-all duration-150 shadow-sm cursor-pointer flex flex-col space-y-2 sm:space-y-3 group"
                    >
                        <div className="h-8 w-8 rounded bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                            <NotificationOutlined className="text-sm text-brand-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors flex items-center justify-between">
                                <span>Recruitment Drives</span>
                                <ArrowRightOutlined className="text-[9px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </h3>
                            <p className="text-[11px] text-text-secondary leading-relaxed">Launch scouting campaigns for position vacancies.</p>
                        </div>
                    </div>

                    {/* Action 2 */}
                    <div 
                        onClick={() => handleActionClick("View Applications")}
                        className="p-3 sm:p-4 bg-bg-surface border border-border-subtle rounded-xl hover:border-brand-primary/30 transition-all duration-150 shadow-sm cursor-pointer flex flex-col space-y-2 sm:space-y-3 group"
                    >
                        <div className="h-8 w-8 rounded bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                            <SolutionOutlined className="text-sm text-brand-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors flex items-center justify-between">
                                <span>View Applications</span>
                                <ArrowRightOutlined className="text-[9px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </h3>
                            <p className="text-[11px] text-text-secondary leading-relaxed">Review incoming athlete trials and registrations.</p>
                        </div>
                    </div>

                    {/* Action 3 */}
                    <div 
                        onClick={() => handleActionClick("Manage Roster")}
                        className="p-3 sm:p-4 bg-bg-surface border border-border-subtle rounded-xl hover:border-brand-primary/30 transition-all duration-150 shadow-sm cursor-pointer flex flex-col space-y-2 sm:space-y-3 group"
                    >
                        <div className="h-8 w-8 rounded bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                            <TeamOutlined className="text-sm text-brand-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors flex items-center justify-between">
                                <span>Manage Roster</span>
                                <ArrowRightOutlined className="text-[9px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </h3>
                            <p className="text-[11px] text-text-secondary leading-relaxed">Update squad player lists and manage player status.</p>
                        </div>
                    </div>

                    {/* Action 4 */}
                    <div 
                        onClick={() => handleActionClick("View Team Performance")}
                        className="p-3 sm:p-4 bg-bg-surface border border-border-subtle rounded-xl hover:border-brand-primary/30 transition-all duration-150 shadow-sm cursor-pointer flex flex-col space-y-2 sm:space-y-3 group"
                    >
                        <div className="h-8 w-8 rounded bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                            <CalendarOutlined className="text-sm text-brand-secondary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors flex items-center justify-between">
                                <span>Team Performance</span>
                                <ArrowRightOutlined className="text-[9px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </h3>
                            <p className="text-[11px] text-text-secondary leading-relaxed">Track analytics, scores, and individual logs.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 animate-slideUp stagger-4">
                
                {/* Team Info & Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Team Information */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase border-b border-border-subtle pb-2 flex items-center space-x-1.5">
                            <InfoCircleOutlined className="text-brand-primary text-xs" />
                            <span>Team Information</span>
                        </h2>
                        {teamData ? (
                            <Card bordered={false} className="border border-border-subtle bg-bg-surface p-4 shadow-sm rounded-xl">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex flex-col space-y-1 bg-bg-elevated/50 border border-border-subtle p-3.5 rounded-lg">
                                        <span className="text-[9px] text-text-secondary font-semibold uppercase tracking-wider">Team Name</span>
                                        <span className="text-xs font-bold text-text-primary">{teamData.teamName}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1 bg-bg-elevated/50 border border-border-subtle p-3.5 rounded-lg">
                                        <span className="text-[9px] text-text-secondary font-semibold uppercase tracking-wider">Sport Category</span>
                                        <span className="text-xs font-bold text-brand-primary uppercase tracking-wide">{teamData.sport}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1 bg-bg-elevated/50 border border-border-subtle p-3.5 rounded-lg">
                                        <span className="text-[9px] text-text-secondary font-semibold uppercase tracking-wider">Age Group Limit</span>
                                        <span className="text-xs font-bold text-brand-secondary">{teamData.ageCategory}</span>
                                    </div>
                                </div>
                                <div className="mt-4 bg-bg-elevated/20 border border-border-subtle p-4 rounded-lg">
                                    <h3 className="text-[9px] text-text-secondary font-semibold uppercase tracking-wider mb-1.5">Workspace Description</h3>
                                    <p className="text-xs text-text-secondary leading-relaxed italic">
                                        {teamData.description || "No description set. Edit your team details in Organization settings to describe the squad values, schedule, and home venue details."}
                                    </p>
                                </div>
                            </Card>
                        ) : (
                            <Card bordered={false} loading className="border border-border-subtle bg-bg-surface rounded-xl" />
                        )}
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase border-b border-border-subtle pb-2 flex items-center space-x-1.5">
                            <ClockCircleOutlined className="text-brand-primary text-xs" />
                            <span>Recent Activity</span>
                        </h2>
                        <Card bordered={false} className="border border-border-subtle bg-bg-surface p-5 shadow-sm rounded-xl">
                            <Timeline items={getTimelineItems()} className="custom-timeline mt-2 text-xs" />
                        </Card>
                    </div>

                </div>

                {/* Side Panels */}
                <div className="space-y-6">
                    <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase border-b border-border-subtle pb-2 flex items-center space-x-1.5">
                        <CheckCircleOutlined className="text-brand-primary text-xs" />
                        <span>Upcoming Actions</span>
                    </h2>

                    {/* Open Recruitment Drives */}
                    <Card 
                        title={<span className="text-xs font-semibold text-text-primary tracking-wide uppercase">Open Recruitment Drives</span>} 
                        bordered={false} 
                        className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl"
                        extra={<Tag color="purple" className="m-0 border-0 font-semibold text-[9px] px-2 py-0.5 rounded">ACTIVE</Tag>}
                    >
                        <div className="space-y-4">
                            {openDrives.length === 0 ? (
                                <p className="text-[11px] text-text-secondary italic py-2">No active recruitment drives.</p>
                            ) : (
                                openDrives.map(drive => (
                                    <div key={drive._id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated/40 border border-border-subtle">
                                        <div>
                                            <p className="text-xs font-semibold text-text-primary">{drive.title}</p>
                                            <p className="text-[10px] text-text-secondary mt-0.5">Expires: {new Date(drive.applicationDeadline).toLocaleDateString()}</p>
                                        </div>
                                        <span className="text-xs text-brand-primary font-semibold">{drive.vacancies || 0} Spots</span>
                                    </div>
                                ))
                            )}
                            <Button 
                                type="dashed" 
                                size="small" 
                                icon={<PlusOutlined className="text-xs" />} 
                                onClick={() => handleActionClick("Add Campaign")}
                                className="w-full text-xs hover:border-brand-primary hover:text-brand-primary cursor-pointer h-8 rounded-md"
                            >
                                New Drive
                            </Button>
                        </div>
                    </Card>

                    {/* Pending Applications */}
                    <Card 
                        title={<span className="text-xs font-semibold text-text-primary tracking-wide uppercase">Pending Applications</span>} 
                        bordered={false} 
                        className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl"
                        extra={<Tag color="orange" className="m-0 border-0 font-semibold text-[9px] px-2 py-0.5 rounded">{pendingApps.length} REVIEW</Tag>}
                    >
                        <div className="space-y-4">
                            {pendingApps.length === 0 ? (
                                <p className="text-[11px] text-text-secondary italic py-2">No pending applications.</p>
                            ) : (
                                pendingApps.map(app => (
                                    <div key={app._id} className="flex items-center space-x-3 p-3 rounded-lg bg-bg-elevated/40 border border-border-subtle">
                                        <Avatar size="small" icon={<UserAddOutlined className="text-xs" />} className="bg-brand-primary shrink-0" />
                                        <div className="flex-grow min-w-0">
                                            <p className="text-xs font-semibold text-text-primary truncate">{app.athleteId?.userId?.name || "Squad Player"}</p>
                                            <p className="text-[10px] text-text-secondary truncate mt-0.5">{app.athleteId?.sport?.toUpperCase()} • {app.athleteId?.primaryRole}</p>
                                        </div>
                                        <span className="text-[10px] text-text-secondary shrink-0 font-medium">{getRelativeTimeString(app.createdAt)}</span>
                                    </div>
                                ))
                            )}
                            <Button 
                                type="dashed" 
                                size="small" 
                                onClick={() => handleActionClick("Review Applications")}
                                className="w-full text-xs hover:border-brand-primary hover:text-brand-primary cursor-pointer h-8 rounded-md"
                            >
                                View Applications
                            </Button>
                        </div>
                    </Card>

                    {/* Recent Team Members */}
                    <Card 
                        title={<span className="text-xs font-semibold text-text-primary tracking-wide uppercase">Recent Team Members</span>} 
                        bordered={false} 
                        className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl"
                        extra={<Tag color="green" className="m-0 border-0 font-semibold text-[9px] px-2 py-0.5 rounded">NEW</Tag>}
                    >
                        <div className="space-y-4">
                            {recentMembers.length === 0 ? (
                                <p className="text-[11px] text-text-secondary italic py-2">No active team members.</p>
                            ) : (
                                recentMembers.slice(0, 3).map(mem => (
                                    <div key={mem._id} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated/40 border border-border-subtle">
                                        <div className="flex items-center space-x-3 min-w-0">
                                            <Avatar size="small" className="bg-brand-secondary font-bold text-xs shrink-0 rounded">
                                                {(mem.athleteId?.userId?.name || "SP").substring(0, 2).toUpperCase()}
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-text-primary truncate">{mem.athleteId?.userId?.name || "Squad Player"}</p>
                                                <p className="text-[10px] text-text-secondary mt-0.5 truncate">{mem.athleteId?.primaryRole}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-brand-secondary font-semibold shrink-0">Approved</span>
                                    </div>
                                ))
                            )}
                            <Button 
                                type="dashed" 
                                size="small" 
                                onClick={() => handleActionClick("Manage Roster")}
                                className="w-full text-xs hover:border-brand-primary hover:text-brand-primary cursor-pointer h-8 rounded-md"
                            >
                                Manage Roster
                            </Button>
                        </div>
                    </Card>

                </div>

            </div>
        </div>
    );
}

export default TeamDashboard;
