import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, Statistic, Table, Spin, Empty, Button, Row, Col, Progress, Tag } from "antd";
import { 
    BarChartOutlined, 
    TrophyOutlined, 
    CalendarOutlined, 
    DashboardOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function AthletePerformance() {
    const { athleteData } = useOutletContext(); // Get shared athlete profile sport info
    const [summary, setSummary] = useState({ totalMatches: 0, stats: {} });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [summaryRes, historyRes] = await Promise.all([
                api.get("/performance/my-performance-summary"),
                api.get("/performance/my-performance")
            ]);
            if (summaryRes.data) setSummary(summaryRes.data);
            if (historyRes.data) setHistory(historyRes.data);
        } catch (err) {
            console.error("Error fetching performance statistics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const sport = athleteData?.sport?.toLowerCase() || "football";

    const getMetricLabel = (key) => {
        const labels = {
            goals: "Goals Scored",
            assists: "Assists Delivered",
            passes: "Pass Completion",
            tackles: "Successful Tackles",
            cleanSheets: "Clean Sheets",
            runs: "Runs Scored",
            ballsFaced: "Balls Faced",
            strikeRate: "Batting Strike Rate",
            wickets: "Wickets Taken",
            economy: "Bowling Economy"
        };
        return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    // Table Column Config for Match Details (Stripe/GitHub style)
    const columns = [
        {
            title: "DATE",
            dataIndex: "matchId",
            key: "date",
            render: (match) => <span className="text-xs font-medium text-text-secondary">{match?.matchDate ? new Date(match.matchDate).toLocaleDateString() : "N/A"}</span>
        },
        {
            title: "TOURNAMENT",
            dataIndex: "matchId",
            key: "tournament",
            render: (match) => <span className="text-xs font-semibold text-text-primary">{match?.tournamentId?.name || "Friendly Match"}</span>
        },
        {
            title: "VENUE",
            dataIndex: "matchId",
            key: "venue",
            render: (match) => (
                <span className="text-xs text-text-secondary flex items-center">
                    <EnvironmentOutlined className="mr-1.5 text-brand-primary text-[10px]" />
                    {match?.venue || "N/A"}
                </span>
            )
        },
        {
            title: "SQUAD",
            dataIndex: "teamId",
            key: "team",
            render: (team) => <span className="text-xs text-brand-primary font-medium">{team?.teamName || "N/A"}</span>
        },
        {
            title: "METRICS",
            dataIndex: "stats",
            key: "stats",
            render: (stats) => (
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(stats || {}).map(([key, val]) => (
                        <Tag key={key} color="blue" className="m-0 border-0 text-[9px] font-semibold px-2 py-0.5 rounded uppercase">
                            {key}: {val}
                        </Tag>
                    ))}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight">Performance Analytics</h1>
                    <p className="text-xs text-text-secondary mt-0.5">Track career milestones, matches played, and match logs.</p>
                </div>
                <Button 
                    onClick={fetchData} 
                    type="text" 
                    size="small" 
                    className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium cursor-pointer"
                >
                    Refresh Stats
                </Button>
            </div>

            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="middle" />
                    <p className="text-xs text-text-secondary mt-3">Syncing career logs...</p>
                </div>
            ) : (
                <>
                    {/* Career Summary Metrics */}
                    <div className="space-y-3">
                        <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase flex items-center space-x-1.5">
                            <TrophyOutlined className="text-brand-primary text-xs" />
                            <span>Career Summary ({athleteData?.sport?.toUpperCase() || "Football"})</span>
                        </h2>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                <Statistic 
                                    title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Matches Played</span>}
                                    value={summary.totalMatches} 
                                    valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '22px' }}
                                    prefix={<CalendarOutlined className="text-brand-primary mr-1.5 text-base" />}
                                />
                            </Card>

                            {/* Render Sport Specific Cards */}
                            {sport === "football" ? (
                                <>
                                    <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                        <Statistic 
                                            title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Goals Scored</span>}
                                            value={summary.stats.goals || 0} 
                                            valueStyle={{ color: 'var(--color-secondary)', fontWeight: '750', fontSize: '22px' }}
                                            prefix={<BarChartOutlined className="text-brand-secondary mr-1.5 text-base" />}
                                        />
                                    </Card>
                                    <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                        <Statistic 
                                            title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Assists Delivered</span>}
                                            value={summary.stats.assists || 0} 
                                            valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '22px' }}
                                            prefix={<DashboardOutlined className="text-brand-primary mr-1.5 text-base" />}
                                        />
                                    </Card>
                                    <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                        <Statistic 
                                            title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Clean Sheets</span>}
                                            value={summary.stats.cleanSheets || 0} 
                                            valueStyle={{ color: 'var(--color-accent)', fontWeight: '750', fontSize: '22px' }}
                                            prefix={<TrophyOutlined className="text-brand-accent mr-1.5 text-base" />}
                                        />
                                    </Card>
                                </>
                            ) : (
                                <>
                                    <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                        <Statistic 
                                            title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Runs Scored</span>}
                                            value={summary.stats.runs || 0} 
                                            valueStyle={{ color: 'var(--color-secondary)', fontWeight: '750', fontSize: '22px' }}
                                            prefix={<BarChartOutlined className="text-brand-secondary mr-1.5 text-base" />}
                                        />
                                    </Card>
                                    <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                        <Statistic 
                                            title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Wickets Taken</span>}
                                            value={summary.stats.wickets || 0} 
                                            valueStyle={{ color: 'var(--color-primary)', fontWeight: '750', fontSize: '22px' }}
                                            prefix={<DashboardOutlined className="text-brand-primary mr-1.5 text-base" />}
                                        />
                                    </Card>
                                    <Card bordered={false} className="border border-border-subtle bg-bg-surface shadow-sm rounded-xl">
                                        <Statistic 
                                            title={<span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Strike Rate (Avg)</span>}
                                            value={summary.stats.strikeRate || 0} 
                                            valueStyle={{ color: 'var(--color-accent)', fontWeight: '750', fontSize: '22px' }}
                                            prefix={<TrophyOutlined className="text-brand-accent mr-1.5 text-base" />}
                                        />
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Progress Breakdown */}
                    {summary.totalMatches > 0 && (
                        <Card bordered={false} className="border border-border-subtle bg-bg-surface p-5 rounded-xl shadow-sm">
                            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-5">Metric Targets Progress</h3>
                            <Row gutter={[24, 20]}>
                                {Object.entries(summary.stats).map(([key, val]) => {
                                    if (typeof val !== "number") return null;
                                    const percentage = Math.min(Math.floor((val / (summary.totalMatches * 10)) * 100) + 10, 100);
                                    return (
                                        <Col xs={24} sm={12} key={key} className="space-y-1.5">
                                            <div className="flex justify-between text-[11px]">
                                                <span className="text-text-secondary font-medium">{getMetricLabel(key)}</span>
                                                <span className="text-text-primary font-bold">{val} total</span>
                                            </div>
                                            <Progress 
                                                percent={percentage} 
                                                showInfo={false} 
                                                strokeColor="var(--color-primary)" 
                                                trailColor="var(--color-border-subtle)" 
                                                size={{ height: 6 }}
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Card>
                    )}

                    {/* Detailed Match Logs */}
                    <div className="space-y-3">
                        <h2 className="text-xs font-bold text-text-secondary tracking-wider uppercase flex items-center space-x-1.5">
                            <BarChartOutlined className="text-brand-primary text-xs" />
                            <span>Detailed Match Logs</span>
                        </h2>

                        {history.length === 0 ? (
                            <Card bordered={false} className="border border-border-subtle bg-bg-surface py-12 text-center rounded-xl shadow-sm">
                                <Empty description={<span className="text-text-secondary text-xs">No match history records registered in the system.</span>} />
                            </Card>
                        ) : (
                            <Table 
                                columns={columns}
                                dataSource={history.map(item => ({ ...item, key: item._id }))}
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

export default AthletePerformance;
