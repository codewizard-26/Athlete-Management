import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, Statistic, Table, Spin, Empty, Button, Row, Col, Progress, Tag } from "antd";
import { 
    BarChartOutlined, 
    TrophyOutlined, 
    CalendarOutlined, 
    DashboardOutlined,
    EnvironmentOutlined,
    SwapOutlined
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

    // Table Column Config for Match Details
    const columns = [
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Match Date</span>,
            dataIndex: "matchId",
            key: "date",
            render: (match) => <span className="text-xs font-semibold text-slate-300">{match?.matchDate ? new Date(match.matchDate).toLocaleDateString() : "N/A"}</span>
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Tournament</span>,
            dataIndex: "matchId",
            key: "tournament",
            render: (match) => <span className="text-xs font-semibold text-white">{match?.tournamentId?.name || "Friendly Match"}</span>
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Venue</span>,
            dataIndex: "matchId",
            key: "venue",
            render: (match) => (
                <span className="text-[10px] text-slate-400 flex items-center">
                    <EnvironmentOutlined className="mr-1 text-blue-500" />
                    {match?.venue || "N/A"}
                </span>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Squad</span>,
            dataIndex: "teamId",
            key: "team",
            render: (team) => <span className="text-xs text-blue-400 font-bold">{team?.teamName || "N/A"}</span>
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Performance Metrics</span>,
            dataIndex: "stats",
            key: "stats",
            render: (stats) => (
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(stats || {}).map(([key, val]) => (
                        <Tag key={key} color="blue" className="m-0 border-0 text-[9px] font-bold">
                            {key.toUpperCase()}: {val}
                        </Tag>
                    ))}
                </div>
            )
        }
    ];

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider">Performance Analytics</h1>
                    <p className="text-xs text-slate-400 mt-1">Track career milestones, matches played, and match logs.</p>
                </div>
                <Button onClick={fetchData} type="dashed" size="small" className="hover:border-blue-500 hover:text-blue-400 text-xs">
                    Refresh Stats
                </Button>
            </div>

            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="large" />
                    <p className="text-xs text-slate-400 mt-4">Syncing career logs...</p>
                </div>
            ) : (
                <>
                    {/* SECTION 1: Career Summary Metrics Cards */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                            <TrophyOutlined className="text-blue-500" />
                            <span>Career Summary ({athleteData?.sport?.toUpperCase() || "Football"})</span>
                        </h2>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 shadow-md">
                                <Statistic 
                                    title={<span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Matches Played</span>}
                                    value={summary.totalMatches} 
                                    valueStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                                    prefix={<CalendarOutlined className="text-blue-400 mr-1.5 text-base" />}
                                />
                            </Card>

                            {/* Render Sport Specific Cards */}
                            {sport === "football" ? (
                                <>
                                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 shadow-md">
                                        <Statistic 
                                            title={<span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Goals Scored</span>}
                                            value={summary.stats.goals || 0} 
                                            valueStyle={{ color: '#34d399', fontWeight: 'bold' }}
                                            prefix={<BarChartOutlined className="text-emerald-400 mr-1.5 text-base" />}
                                        />
                                    </Card>
                                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 shadow-md">
                                        <Statistic 
                                            title={<span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Assists Delivered</span>}
                                            value={summary.stats.assists || 0} 
                                            valueStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                                            prefix={<DashboardOutlined className="text-purple-400 mr-1.5 text-base" />}
                                        />
                                    </Card>
                                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 shadow-md">
                                        <Statistic 
                                            title={<span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Clean Sheets</span>}
                                            value={summary.stats.cleanSheets || 0} 
                                            valueStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                                            prefix={<TrophyOutlined className="text-amber-400 mr-1.5 text-base" />}
                                        />
                                    </Card>
                                </>
                            ) : (
                                <>
                                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 shadow-md">
                                        <Statistic 
                                            title={<span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Runs Scored</span>}
                                            value={summary.stats.runs || 0} 
                                            valueStyle={{ color: '#34d399', fontWeight: 'bold' }}
                                            prefix={<BarChartOutlined className="text-emerald-400 mr-1.5 text-base" />}
                                        />
                                    </Card>
                                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 shadow-md">
                                        <Statistic 
                                            title={<span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Wickets Taken</span>}
                                            value={summary.stats.wickets || 0} 
                                            valueStyle={{ color: '#c084fc', fontWeight: 'bold' }}
                                            prefix={<DashboardOutlined className="text-purple-400 mr-1.5 text-base" />}
                                        />
                                    </Card>
                                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 shadow-md">
                                        <Statistic 
                                            title={<span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Strike Rate (Avg)</span>}
                                            value={summary.stats.strikeRate || 0} 
                                            valueStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                                            prefix={<TrophyOutlined className="text-amber-400 mr-1.5 text-base" />}
                                        />
                                    </Card>
                                </>
                            )}
                        </div>
                    </div>

                    {/* SECTION 2: Graphical Breakdown */}
                    {summary.totalMatches > 0 && (
                        <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/30 p-4">
                            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-6">Longitudinal Goals Target Progress</h3>
                            <Row gutter={[24, 24]}>
                                {Object.entries(summary.stats).map(([key, val]) => {
                                    if (typeof val !== "number") return null;
                                    const percentage = Math.min(Math.floor((val / (summary.totalMatches * 10)) * 100) + 10, 100);
                                    return (
                                        <Col xs={24} sm={12} key={key} className="space-y-2">
                                            <div className="flex justify-between text-[11px] font-bold">
                                                <span className="text-slate-400">{getMetricLabel(key)}</span>
                                                <span className="text-white">{val} total</span>
                                            </div>
                                            <Progress 
                                                percent={percentage} 
                                                showInfo={false} 
                                                strokeColor="#2563eb" 
                                                trailColor="rgba(255, 255, 255, 0.05)" 
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Card>
                    )}

                    {/* SECTION 3: Career Match Logs */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-white/[0.04] pb-2 flex items-center space-x-2">
                            <BarChartOutlined className="text-blue-500" />
                            <span>Detailed Match Logs</span>
                        </h2>

                        {history.length === 0 ? (
                            <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-12 text-center">
                                <Empty description={<span className="text-slate-400 text-xs">No match history records registered in the system.</span>} />
                            </Card>
                        ) : (
                            <Table 
                                columns={columns}
                                dataSource={history.map(item => ({ ...item, key: item._id }))}
                                className="custom-table border border-white/[0.04] bg-[#0f172a]/30 rounded-xl overflow-hidden shadow-md"
                                pagination={{ pageSize: 5 }}
                            />
                        )}
                    </div>
                </>
            )}

        </main>
    );
}

export default AthletePerformance;
