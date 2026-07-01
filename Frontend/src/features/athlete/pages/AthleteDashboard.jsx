import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Statistic, Timeline, Button } from "antd";
import { 
    UserOutlined, 
    TeamOutlined, 
    TrophyOutlined, 
    BarChartOutlined, 
    ArrowRightOutlined,
    EditOutlined,
    NotificationOutlined,
    HistoryOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function AthleteDashboard() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [stats, setStats] = useState({
        teams: 0,
        applications: 0,
        matches: 0,
        records: 0,
        activities: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/dashboard/athlete");
                if (isMounted) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching athlete dashboard stats:", error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    const quickActions = [
        {
            title: "Edit Profile",
            desc: "Update details and sporting biometrics",
            icon: <EditOutlined className="text-sm text-brand-primary" />,
            link: "/athlete/profile"
        },
        {
            title: "Browse Recruitment Drives",
            desc: "Discover new team scouting calls",
            icon: <NotificationOutlined className="text-sm text-brand-secondary" />,
            link: "/athlete/recruitment"
        },
        {
            title: "View Teams",
            desc: "Check active rosters and team sheets",
            icon: <TeamOutlined className="text-sm text-brand-secondary" />,
            link: "/athlete/teams"
        },
        {
            title: "View Performance Statistics",
            desc: "Track longitudinal match history and growth",
            icon: <BarChartOutlined className="text-sm text-brand-accent" />,
            link: "/athlete/performance"
        }
    ];

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
            if (act.type === "profile") color = "#D97706";
            if (act.type === "application") color = "#6366F1";

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
                        <span className="text-text-secondary text-xs">No recent activities found.</span>
                    </div>
                )
            }
        ];

    return (
        <div className="space-y-8 animate-fadeIn">
            
            {/* Welcome Banner */}
            <div className="bg-bg-surface border border-border-subtle p-6 sm:p-8 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-1.5 relative z-10">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                        Welcome back, {user?.name || "Athlete"}
                    </h1>
                    <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
                        Review your metrics, update your bio profiles, or check active recruitment calls from teams.
                    </p>
                </div>
                <div className="shrink-0 flex gap-3 relative z-10">
                    <Button 
                        type="primary" 
                        icon={<EditOutlined className="text-xs" />}
                        onClick={() => navigate("/athlete/profile")}
                        className="bg-brand-primary border-brand-primary text-xs font-semibold h-9 rounded-md"
                    >
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Teams Joined</span>}
                        value={loading ? "..." : stats.teams} 
                        valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<TeamOutlined className="text-brand-primary mr-2 text-base" />}
                    />
                </Card>

                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Applications Sent</span>}
                        value={loading ? "..." : stats.applications} 
                        valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<NotificationOutlined className="text-brand-primary mr-2 text-base" />}
                    />
                </Card>

                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Matches Played</span>}
                        value={loading ? "..." : stats.matches} 
                        valueStyle={{ color: 'var(--color-secondary)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<TrophyOutlined className="text-brand-secondary mr-2 text-base" />}
                    />
                </Card>

                <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                    <Statistic 
                        title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Performance Records</span>}
                        value={loading ? "..." : stats.records} 
                        valueStyle={{ color: 'var(--color-accent)', fontWeight: '750', fontSize: '24px' }}
                        prefix={<BarChartOutlined className="text-brand-accent mr-2 text-base" />}
                    />
                </Card>
            </div>

            {/* Quick Actions & Activity Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase border-b border-border-subtle pb-2">
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {quickActions.map((action, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => navigate(action.link)}
                                className="p-4 bg-bg-surface border border-border-subtle rounded-xl hover:border-brand-primary/30 transition-all duration-150 shadow-sm cursor-pointer flex items-start space-x-3.5 group"
                            >
                                <div className="h-8 w-8 rounded bg-bg-elevated border border-border-subtle flex items-center justify-center shrink-0">
                                    {action.icon}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors flex items-center justify-between">
                                        <span>{action.title}</span>
                                        <ArrowRightOutlined className="text-[9px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </h3>
                                    <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{action.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="space-y-4">
                    <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase border-b border-border-subtle pb-2">
                        Recent Activity
                    </h2>

                    <Card bordered={false} className="border border-border-subtle bg-bg-surface p-5 shadow-sm rounded-xl">
                        <Timeline items={timelineItems} className="custom-timeline mt-2 text-xs" />
                    </Card>
                </div>

            </div>
        </div>
    );
}

export default AthleteDashboard;
