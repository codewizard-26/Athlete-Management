import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Form, InputNumber, Select, Spin, message, Row, Col, Divider, Table } from "antd";
import { ArrowLeftOutlined, SaveOutlined, TrophyOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

const { Option } = Select;

const SPORT_CONFIG = {
    football: {
        matchStats: [
            { key: "possessionHome", label: "Home Possession (%)", type: "number" },
            { key: "possessionAway", label: "Away Possession (%)", type: "number" },
            { key: "cornersHome", label: "Home Corners", type: "number" },
            { key: "cornersAway", label: "Away Corners", type: "number" },
            { key: "foulsHome", label: "Home Fouls", type: "number" },
            { key: "foulsAway", label: "Away Fouls", type: "number" },
        ],
        playerStats: [
            { key: "minutesPlayed", label: "MIN", type: "number" },
            { key: "goals", label: "GLS", type: "number" },
            { key: "assists", label: "AST", type: "number" },
            { key: "yellowCards", label: "YC", type: "number" },
            { key: "redCards", label: "RC", type: "number" },
            { key: "rating", label: "RTG", type: "number", step: 0.1 },
        ]
    },
    cricket: {
        matchStats: [
            { key: "oversBowledHome", label: "Home Overs", type: "number", step: 0.1 },
            { key: "oversBowledAway", label: "Away Overs", type: "number", step: 0.1 },
            { key: "extrasHome", label: "Home Extras", type: "number" },
            { key: "extrasAway", label: "Away Extras", type: "number" },
        ],
        playerStats: [
            { key: "runsScored", label: "R", type: "number" },
            { key: "ballsFaced", label: "B", type: "number" },
            { key: "fours", label: "4s", type: "number" },
            { key: "sixes", label: "6s", type: "number" },
            { key: "wickets", label: "W", type: "number" },
            { key: "oversBowled", label: "O", type: "number", step: 0.1 },
            { key: "runsConceded", label: "RC", type: "number" },
        ]
    },
    default: {
        matchStats: [],
        playerStats: [
            { key: "points", label: "PTS", type: "number" },
            { key: "rating", label: "RTG", type: "number", step: 0.1 }
        ]
    }
};

function MatchReportEntry() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [match, setMatch] = useState(null);
    const [homeRoster, setHomeRoster] = useState([]);
    const [awayRoster, setAwayRoster] = useState([]);
    const [config, setConfig] = useState(SPORT_CONFIG.default);

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/match/${matchId}/rosters`);
                const matchData = res.data.match;
                setMatch(matchData);
                setHomeRoster(res.data.homeRoster || []);
                setAwayRoster(res.data.awayRoster || []);
                
                const sport = matchData.tournamentId?.sport?.toLowerCase() || 'default';
                setConfig(SPORT_CONFIG[sport] || SPORT_CONFIG.default);

                // Set default values if already saved
                if (matchData.hasReport) {
                    message.info("This match report has already been submitted. You are viewing it in read-only mode.");
                }

                form.setFieldsValue({
                    homeScore: matchData.homeScore,
                    awayScore: matchData.awayScore,
                    winner: matchData.winner,
                    matchStats: matchData.matchStats || {}
                });
            } catch (err) {
                console.error("Failed to load match report data", err);
                message.error("Could not load match data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchMatchData();
    }, [matchId, form]);

    const handleFinish = async (values) => {
        if (match?.hasReport) {
            return message.warning("Report already submitted.");
        }

        try {
            setSubmitting(true);
            
            // Format player stats for payload
            const playerStats = [];
            
            // Loop through home players
            homeRoster.forEach(member => {
                const athleteId = member.athleteId?._id;
                if (!athleteId) return;
                const stats = values.playerStats?.home?.[athleteId] || {};
                playerStats.push({ athleteId, teamId: match.homeTeamId._id, stats });
            });

            // Loop through away players
            awayRoster.forEach(member => {
                const athleteId = member.athleteId?._id;
                if (!athleteId) return;
                const stats = values.playerStats?.away?.[athleteId] || {};
                playerStats.push({ athleteId, teamId: match.awayTeamId._id, stats });
            });

            const payload = {
                homeScore: values.homeScore,
                awayScore: values.awayScore,
                winner: values.winner,
                matchStats: values.matchStats,
                playerStats
            };

            await api.post(`/match/${matchId}/report`, payload);
            message.success("Match report submitted successfully!");
            navigate("/organization/matches");
        } catch (err) {
            console.error("Submit error:", err);
            message.error(err.response?.data?.message || "Failed to submit report");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="py-24 flex justify-center"><Spin size="large" /></div>;
    }

    if (!match) {
        return <div className="py-24 text-center">Match not found.</div>;
    }

    const homeTeamName = match.homeTeamId?.teamName || "Home Team";
    const awayTeamName = match.awayTeamId?.teamName || "Away Team";
    const readOnly = match.hasReport;

    const renderPlayerTable = (roster, side) => {
        const columns = [
            {
                title: "Player Name",
                key: "name",
                render: (_, record) => <span className="text-xs font-semibold">{record.athleteId?.userId?.name || "Unknown"}</span>
            },
            ...config.playerStats.map(stat => ({
                title: <span className="text-[10px] text-text-secondary" title={stat.label}>{stat.label}</span>,
                key: stat.key,
                render: (_, record) => (
                    <Form.Item
                        name={['playerStats', side, record.athleteId?._id, stat.key]}
                        className="m-0"
                    >
                        <InputNumber 
                            size="small" 
                            disabled={readOnly}
                            step={stat.step || 1}
                            className="w-full text-xs font-mono bg-bg-elevated" 
                        />
                    </Form.Item>
                )
            }))
        ];

        return (
            <Table 
                dataSource={roster}
                rowKey="_id"
                pagination={false}
                columns={columns}
                size="small"
                className="custom-table border border-border-subtle rounded-xl overflow-hidden"
            />
        );
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-12">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div className="space-y-1">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined className="text-xs" />} 
                        onClick={() => navigate("/organization/matches")}
                        className="text-text-secondary hover:text-text-primary flex items-center p-0 h-auto mb-2 cursor-pointer"
                    >
                        Back to Matches
                    </Button>
                    <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
                        <TrophyOutlined className="text-brand-primary" />
                        <span>Official Match Report</span>
                    </h1>
                    <p className="text-xs text-text-secondary">
                        {match.tournamentId?.name} • {new Date(match.matchDate).toLocaleString()} • {match.venue}
                    </p>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                requiredMark={false}
            >
                <Card bordered={false} className="border border-border-subtle bg-bg-surface rounded-xl shadow-sm mb-6">
                    <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Final Result</h2>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Form.Item name="homeScore" label={<span className="text-xs font-semibold">{homeTeamName} Score</span>} rules={[{required: true}]}>
                                <InputNumber disabled={readOnly} className="w-full font-mono text-lg" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="awayScore" label={<span className="text-xs font-semibold">{awayTeamName} Score</span>} rules={[{required: true}]}>
                                <InputNumber disabled={readOnly} className="w-full font-mono text-lg" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="winner" label={<span className="text-xs font-semibold">Match Winner</span>}>
                                <Select disabled={readOnly} allowClear placeholder="Select Winner or Draw">
                                    <Option value={match.homeTeamId?._id}>{homeTeamName}</Option>
                                    <Option value={match.awayTeamId?._id}>{awayTeamName}</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {config.matchStats.length > 0 && (
                    <Card bordered={false} className="border border-border-subtle bg-bg-surface rounded-xl shadow-sm mb-6">
                        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Match Statistics</h2>
                        <Row gutter={16}>
                            {config.matchStats.map(stat => (
                                <Col span={6} key={stat.key} className="mb-4">
                                    <Form.Item name={['matchStats', stat.key]} label={<span className="text-[10px] uppercase font-semibold text-text-secondary">{stat.label}</span>}>
                                        <InputNumber disabled={readOnly} step={stat.step || 1} className="w-full font-mono" />
                                    </Form.Item>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                )}

                <div className="space-y-8">
                    <div>
                        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-3">
                            {homeTeamName} Roster Performance
                        </h2>
                        {renderPlayerTable(homeRoster, 'home')}
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-brand-secondary uppercase tracking-wider mb-3">
                            {awayTeamName} Roster Performance
                        </h2>
                        {renderPlayerTable(awayRoster, 'away')}
                    </div>
                </div>

                {!readOnly && (
                    <div className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-subtle p-4 z-50 flex justify-end shadow-xl">
                        <div className="container max-w-7xl mx-auto flex justify-end gap-4 px-6">
                            <Button onClick={() => navigate("/organization/matches")} className="font-semibold rounded-md">Cancel</Button>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={submitting} className="font-semibold rounded-md h-10 px-6">
                                Submit Official Report
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    );
}

export default MatchReportEntry;
