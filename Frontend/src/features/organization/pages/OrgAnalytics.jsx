import React, { useState, useEffect } from "react";
import { Card, Spin, Row, Col, Statistic, Table, Tag, Empty, message, Avatar } from "antd";
import { BarChartOutlined, TrophyOutlined, TeamOutlined, CalendarOutlined, StarOutlined, UserOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

function OrgAnalytics() {
    const [stats, setStats] = useState(null);
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [dashboardRes, teamsRes] = await Promise.all([
                api.get("/dashboard/organization"),
                api.get("/team/myTeams")
            ]);
            
            setStats(dashboardRes.data);

            // Fetch performances for all organization teams
            const teamIds = (teamsRes.data || []).map(t => t._id);
            const performancePromises = teamIds.map(id => api.get(`/performance/team/${id}`));
            const performanceResponses = await Promise.all(performancePromises);
            
            const allPerf = [];
            performanceResponses.forEach(res => {
                if (res.data) {
                    allPerf.push(...res.data);
                }
            });
            setPerformances(allPerf);

        } catch (err) {
            console.error("Error loading organization analytics:", err);
            message.error("Failed to load organization analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: "ATHLETE",
            key: "athlete",
            render: (_, record) => (
                <div className="flex items-center space-x-2.5">
                    <Avatar size={24} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                    <div>
                        <p className="text-xs font-semibold text-text-primary leading-none">{record.athleteId?.userId?.name || "Player"}</p>
                        <p className="text-[10px] text-text-secondary mt-1">{record.teamId?.teamName}</p>
                    </div>
                </div>
            )
        },
        {
            title: "SPORT",
            dataIndex: "sport",
            key: "sport",
            render: (s) => <Tag color={s === "football" ? "blue" : "gold"} className="m-0 border-0 font-semibold uppercase text-[9px]">{s}</Tag>
        },
        {
            title: "PERFORMANCE METRICS",
            dataIndex: "stats",
            key: "metrics",
            render: (stats) => (
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(stats || {}).map(([key, val]) => (
                        <Tag key={key} color="blue" className="m-0 border-0 font-semibold text-[9px] uppercase px-1.5 py-0.5 rounded">
                            {key}: {val}
                        </Tag>
                    ))}
                </div>
            )
        },
        {
            title: "RECORDED DATE",
            dataIndex: "createdAt",
            key: "date",
            render: (d) => <span className="text-xs text-text-secondary">{d ? new Date(d).toLocaleDateString() : "N/A"}</span>
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                        <BarChartOutlined className="text-brand-primary" />
                        <span>Performance Analytics</span>
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">Monitor squad stats and aggregate performance records from tournament games.</p>
                </div>
            </div>

            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="middle" />
                    <p className="text-xs text-text-secondary mt-3">Syncing career analytics...</p>
                </div>
            ) : (
                <>
                    {/* Statistics Grid */}
                    <Row gutter={[16, 16]}>
                        <Col xs={12} md={6}>
                            <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                <Statistic 
                                    title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Total Teams</span>}
                                    value={stats?.teamsCount || 0}
                                    valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '22px' }}
                                    prefix={<TeamOutlined className="text-brand-primary mr-1.5 text-base" />}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} md={6}>
                            <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                <Statistic 
                                    title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Tournaments</span>}
                                    value={stats?.tournamentsCount || 0}
                                    valueStyle={{ color: 'var(--color-secondary)', fontWeight: '750', fontSize: '22px' }}
                                    prefix={<TrophyOutlined className="text-brand-secondary mr-1.5 text-base" />}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} md={6}>
                            <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                <Statistic 
                                    title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Scheduled Matches</span>}
                                    value={stats?.matchesCount || 0}
                                    valueStyle={{ color: 'var(--color-accent)', fontWeight: '750', fontSize: '22px' }}
                                    prefix={<CalendarOutlined className="text-brand-accent mr-1.5 text-base" />}
                                />
                            </Card>
                        </Col>
                        <Col xs={12} md={6}>
                            <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                <Statistic 
                                    title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Roster Entries</span>}
                                    value={performances.length}
                                    valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '22px' }}
                                    prefix={<StarOutlined className="text-brand-primary mr-1.5 text-base" />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Performances List */}
                    <div className="space-y-3">
                        <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase flex items-center space-x-1.5">
                            <StarOutlined className="text-brand-primary text-xs" />
                            <span>Recent Athlete Performances</span>
                        </h2>
                        {performances.length === 0 ? (
                            <Card bordered={false} className="border border-border-subtle bg-bg-surface py-12 text-center shadow-sm rounded-xl">
                                <Empty description={<span className="text-text-secondary text-xs">No performance entries recorded for your team rosters.</span>} />
                            </Card>
                        ) : (
                            <Table 
                                columns={columns}
                                dataSource={performances.map(p => ({ ...p, key: p._id }))}
                                className="custom-table border border-border-subtle bg-bg-surface rounded-xl overflow-hidden shadow-sm"
                                pagination={{ pageSize: 5 }}
                                size="small"
                            />
                        )}
                    </div>
                </>
            )}

        </div>
    );
}

export default OrgAnalytics;
