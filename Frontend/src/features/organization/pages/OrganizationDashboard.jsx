import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Statistic, Timeline, Button, message } from "antd";
import { 
    TeamOutlined, 
    TrophyOutlined, 
    ArrowRightOutlined,
    PlusCircleOutlined,
    CalendarOutlined,
    NotificationOutlined,
    UserOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function OrganizationDashboard() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [stats, setStats] = useState({
        teamsCount: 0,
        recruitmentCount: 0,
        tournamentsCount: 0,
        matchesCount: 0,
        activities: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchOrgDashboardData = async () => {
            try {
                const response = await api.get("/dashboard/organization");
                if (isMounted) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching organization stats:", error);
                message.error("Failed to fetch dashboard data. Please try again.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchOrgDashboardData();

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
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 30) return `${diffDays} days ago`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const timelineItems = stats.activities && stats.activities.length > 0 
        ? stats.activities.map((act) => {
            let color = "#4F46E5";
            if (act.type === "team") color = "#059669";
            if (act.type === "recruitment") color = "#6366F1";
            if (act.type === "tournament") color = "#D97706";

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
        })
        : [
            {
                color: "gray",
                children: (
                    <div key="empty">
                        <span className="text-text-secondary text-xs">No recent activities. Create teams or schedule tournaments to get started!</span>
                    </div>
                )
            }
        ];

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Welcome Banner */}
            <div className="bg-bg-surface border border-border-subtle p-6 sm:p-8 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-1.5 relative z-10">
                    <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                        Welcome back, {user?.name || "Organization Manager"}
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
                        Review organizational metrics, coordinate active teams, manage recruitment campaigns, and organize tournaments.
                    </p>
                </div>
                <div className="shrink-0 flex gap-3 relative z-10">
                    <Button 
                        type="primary" 
                        icon={<UserOutlined className="text-xs" />}
                        onClick={() => navigate("/organization/settings")}
                        className="bg-brand-primary border-brand-primary text-xs font-semibold h-9 rounded-md cursor-pointer"
                    >
                        Settings
                    </Button>
                </div>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Teams Created</span>}
                        value={loading ? "..." : stats.teamsCount} 
                        valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<TeamOutlined className="text-brand-primary mr-2 text-base" />}
                    />
                </Card>

                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Active Drives</span>}
                        value={loading ? "..." : stats.recruitmentCount} 
                        valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<NotificationOutlined className="text-brand-primary mr-2 text-base" />}
                    />
                </Card>

                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Tournaments</span>}
                        value={loading ? "..." : stats.tournamentsCount} 
                        valueStyle={{ color: 'var(--color-secondary)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<TrophyOutlined className="text-brand-secondary mr-2 text-base" />}
                    />
                </Card>

                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Matches Scheduled</span>}
                        value={loading ? "..." : stats.matchesCount} 
                        valueStyle={{ color: 'var(--color-accent)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<CalendarOutlined className="text-brand-accent mr-2 text-base" />}
                    />
                </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase border-b border-border-subtle pb-2 flex items-center space-x-1.5">
                        <PlusCircleOutlined className="text-brand-primary text-xs" />
                        <span>Quick Actions</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Action 1 */}
                        <div 
                            onClick={() => navigate("/organization/teams/create")}
                            className="p-4 bg-bg-surface border border-border-subtle rounded-xl hover:border-brand-primary/30 transition-all duration-150 shadow-sm cursor-pointer flex flex-col space-y-3 group"
                        >
                            <div className="h-8 w-8 rounded bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                                <TeamOutlined className="text-sm text-brand-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors flex items-center justify-between">
                                    <span>Create Team</span>
                                    <ArrowRightOutlined className="text-[9px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </h3>
                                <p className="text-[11px] text-text-secondary leading-relaxed">Initialize a new team roster, add age filters, and configure colors.</p>
                            </div>
                        </div>

                        {/* Action 2 */}
                        <div 
                            onClick={() => navigate("/organization/teams")}
                            className="p-4 bg-bg-surface border border-border-subtle rounded-xl hover:border-brand-primary/30 transition-all duration-150 shadow-sm cursor-pointer flex flex-col space-y-3 group"
                        >
                            <div className="h-8 w-8 rounded bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                                <NotificationOutlined className="text-sm text-brand-primary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors flex items-center justify-between">
                                    <span>Manage Teams</span>
                                    <ArrowRightOutlined className="text-[9px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </h3>
                                <p className="text-[11px] text-text-secondary leading-relaxed">Check team roster structures, positions, and active recruitment calls.</p>
                            </div>
                        </div>

                        {/* Action 3 */}
                        <div 
                            onClick={() => navigate("/organization/tournaments/create")}
                            className="p-4 bg-bg-surface border border-border-subtle rounded-xl hover:border-brand-primary/30 transition-all duration-150 shadow-sm cursor-pointer flex flex-col space-y-3 group"
                        >
                            <div className="h-8 w-8 rounded bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                                <TrophyOutlined className="text-sm text-brand-secondary" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors flex items-center justify-between">
                                    <span>Create Tournament</span>
                                    <ArrowRightOutlined className="text-[9px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </h3>
                                <p className="text-[11px] text-text-secondary leading-relaxed">Schedule a sports championship, invite team registries, and set fixtures.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase border-b border-border-subtle pb-2 flex items-center space-x-1.5">
                        <CalendarOutlined className="text-brand-primary text-xs" />
                        <span>Recent Activity</span>
                    </h2>

                    <Card bordered={false} className="border border-border-subtle bg-bg-surface p-5 shadow-sm rounded-xl">
                        <Timeline items={timelineItems} className="custom-timeline mt-2 text-xs" />
                    </Card>
                </div>

            </div>
        </div>
    );
}

export default OrganizationDashboard;
