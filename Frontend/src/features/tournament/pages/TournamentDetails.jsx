import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tabs, Button, Tag, Avatar, Table, Spin, Empty, Descriptions, Row, Col } from "antd";
import { 
    TrophyOutlined, 
    EnvironmentOutlined, 
    CalendarOutlined, 
    TeamOutlined, 
    ArrowLeftOutlined,
    ClockCircleOutlined,
    GlobalOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function TournamentDetails() {
    const { tournamentId } = useParams();
    const navigate = useNavigate();

    const [tournament, setTournament] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const [tourRes, regRes, matchRes] = await Promise.all([
                api.get(`/tournament/${tournamentId}`),
                api.get(`/tournament/registrations/${tournamentId}`),
                api.get(`/match/tournament/${tournamentId}`)
            ]);
            if (tourRes.data) setTournament(tourRes.data);
            if (regRes.data) setRegistrations(regRes.data);
            if (matchRes.data) setMatches(matchRes.data);
        } catch (err) {
            console.error("Error fetching tournament details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tournamentId) {
            fetchDetails();
        }
    }, [tournamentId]);

    const approvedTeams = registrations.filter(r => r.status === "approved").map(r => r.teamId);

    // Calculate Standings Table Dynamically
    const getStandingsData = () => {
        const standings = {};
        
        // Initialize all approved teams
        approvedTeams.forEach(team => {
            if (team && team._id) {
                standings[team._id] = {
                    key: team._id,
                    teamName: team.teamName,
                    logo: team.logo,
                    played: 0,
                    won: 0,
                    lost: 0,
                    drawn: 0,
                    points: 0
                };
            }
        });

        // Calculate from completed matches
        matches.forEach(m => {
            if (m.status === "completed" && m.homeScore !== undefined && m.awayScore !== undefined) {
                const homeId = m.homeTeamId?._id;
                const awayId = m.awayTeamId?._id;

                if (standings[homeId] && standings[awayId]) {
                    standings[homeId].played += 1;
                    standings[awayId].played += 1;

                    if (m.homeScore > m.awayScore) {
                        standings[homeId].won += 1;
                        standings[homeId].points += 3;
                        standings[awayId].lost += 1;
                    } else if (m.awayScore > m.homeScore) {
                        standings[awayId].won += 1;
                        standings[awayId].points += 3;
                        standings[homeId].lost += 1;
                    } else {
                        standings[homeId].drawn += 1;
                        standings[homeId].points += 1;
                        standings[awayId].drawn += 1;
                        standings[awayId].points += 1;
                    }
                }
            }
        });

        return Object.values(standings).sort((a, b) => b.points - a.points);
    };

    const standingsColumns = [
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">Pos</span>,
            key: "pos",
            render: (_, __, index) => <span className="text-xs font-bold text-slate-400">{index + 1}</span>
        },
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">Team</span>,
            key: "team",
            render: (_, record) => (
                <div className="flex items-center space-x-2">
                    {record.logo ? (
                        <img src={record.logo} alt="Logo" className="w-6 h-6 rounded object-cover border border-white/5" />
                    ) : (
                        <Avatar size="small" icon={<TeamOutlined />} className="bg-blue-600 rounded" />
                    )}
                    <span className="text-xs font-bold text-white">{record.teamName}</span>
                </div>
            )
        },
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">P</span>,
            dataIndex: "played",
            key: "played",
            render: (v) => <span className="text-xs text-slate-300 font-mono font-bold">{v}</span>
        },
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">W</span>,
            dataIndex: "won",
            key: "won",
            render: (v) => <span className="text-xs text-emerald-400 font-mono font-bold">{v}</span>
        },
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">L</span>,
            dataIndex: "lost",
            key: "lost",
            render: (v) => <span className="text-xs text-red-400 font-mono font-bold">{v}</span>
        },
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">D</span>,
            dataIndex: "drawn",
            key: "drawn",
            render: (v) => <span className="text-xs text-slate-400 font-mono font-bold">{v}</span>
        },
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">Pts</span>,
            dataIndex: "points",
            key: "points",
            render: (v) => <span className="text-xs text-blue-400 font-mono font-bold">{v}</span>
        }
    ];

    const matchColumns = [
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">Match Details</span>,
            key: "teams",
            render: (_, record) => (
                <span className="text-xs font-bold text-white">
                    {record.homeTeamId?.teamName} vs {record.awayTeamId?.teamName}
                </span>
            )
        },
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">Schedule</span>,
            key: "schedule",
            render: (_, record) => (
                <div className="space-y-0.5 text-[10px] text-slate-300">
                    <p className="font-semibold"><CalendarOutlined className="mr-1 text-blue-500" />{new Date(record.matchDate).toLocaleString()}</p>
                    <p><EnvironmentOutlined className="mr-1 text-slate-500" />{record.venue}</p>
                </div>
            )
        },
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>,
            key: "score",
            render: (_, record) => (
                <span className="text-xs font-black text-blue-400 font-mono">
                    {record.homeScore !== undefined ? record.homeScore : "-"} : {record.awayScore !== undefined ? record.awayScore : "-"}
                </span>
            )
        },
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>,
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "completed" ? "success" : "processing"} className="m-0 border-0 font-bold uppercase text-[8px]">
                    {status}
                </Tag>
            )
        },
        {
            title: <span className="text-[10px] uppercase font-bold text-slate-400">Link</span>,
            key: "link",
            render: (_, record) => (
                <Button size="small" type="link" onClick={() => navigate(`/match/${record._id}`)} className="text-xs font-bold">
                    Stats
                </Button>
            )
        }
    ];

    const tabItems = [
        {
            key: "overview",
            label: <span className="font-bold text-xs">Overview</span>,
            children: (
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/45 backdrop-blur-sm p-4">
                    <Descriptions column={{ xs: 1, sm: 2 }} className="custom-descriptions">
                        <Descriptions.Item label="Sport Limit">{tournament?.sport?.toUpperCase()}</Descriptions.Item>
                        <Descriptions.Item label="Age Bracket">{tournament?.ageCategory}</Descriptions.Item>
                        <Descriptions.Item label="Start Date">{tournament?.startDate ? new Date(tournament.startDate).toLocaleDateString() : "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="End Date">{tournament?.endDate ? new Date(tournament.endDate).toLocaleDateString() : "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Trials Venue">{tournament?.location}</Descriptions.Item>
                        <Descriptions.Item label="Max Teams Limit">{tournament?.maxTeams} Teams</Descriptions.Item>
                    </Descriptions>
                    <div className="mt-6 border-t border-white/[0.04] pt-4 space-y-2">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Description</span>
                        <p className="text-xs text-slate-300 leading-relaxed">{tournament?.description || "No description set by organization manager."}</p>
                    </div>
                </Card>
            )
        },
        {
            key: "teams",
            label: <span className="font-bold text-xs">Approved Teams ({approvedTeams.length})</span>,
            children: (
                approvedTeams.length === 0 ? (
                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-12 text-center">
                        <Empty description={<span className="text-slate-400 text-xs">No teams approved in this tournament yet.</span>} />
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                        {approvedTeams.map(t => (
                            <Card key={t._id} bordered={false} className="border border-white/[0.04] bg-[#0f172a]/30">
                                <div className="flex items-center space-x-3">
                                    {t.logo ? (
                                        <img src={t.logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                                    ) : (
                                        <Avatar size={40} icon={<TeamOutlined />} className="bg-blue-600 rounded-lg" />
                                    )}
                                    <div>
                                        <span className="text-xs font-black text-white">{t.teamName}</span>
                                        <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">{t.ageCategory} • {t.sport}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )
            )
        },
        {
            key: "fixtures",
            label: <span className="font-bold text-xs">Matches & Fixtures ({matches.length})</span>,
            children: (
                matches.length === 0 ? (
                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-12 text-center">
                        <Empty description={<span className="text-slate-400 text-xs">No matches scheduled for this tournament yet.</span>} />
                    </Card>
                ) : (
                    <Table 
                        columns={matchColumns}
                        dataSource={matches.map(m => ({ ...m, key: m._id }))}
                        pagination={false}
                        className="custom-table border border-white/[0.04] bg-[#0f172a]/30 rounded-xl overflow-hidden shadow-md"
                    />
                )
            )
        },
        {
            key: "standings",
            label: <span className="font-bold text-xs">Standings</span>,
            children: (
                approvedTeams.length === 0 ? (
                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-12 text-center">
                        <Empty description={<span className="text-slate-400 text-xs">Standings will be calculated once teams are approved.</span>} />
                    </Card>
                ) : (
                    <Table 
                        columns={standingsColumns}
                        dataSource={getStandingsData()}
                        pagination={false}
                        className="custom-table border border-white/[0.04] bg-[#0f172a]/30 rounded-xl overflow-hidden shadow-md animate-fadeIn"
                    />
                )
            )
        }
    ];

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Nav */}
            <div className="flex items-center space-x-2">
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate(-1)}
                    className="text-slate-400 hover:text-white"
                >
                    Go Back
                </Button>
            </div>

            {loading ? (
                <div className="py-16 flex justify-center"><Spin size="large" /></div>
            ) : (
                <>
                    {/* Header Banner */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-slate-900/30 to-[#0f172a]/60 border border-blue-500/10 p-6 sm:p-8 rounded-2xl shadow-xl flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <TrophyOutlined className="text-xl text-blue-500" />
                                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">{tournament?.name}</h1>
                            </div>
                            <p className="text-[10px] text-slate-400 flex items-center">
                                <GlobalOutlined className="mr-1 text-slate-500" />
                                Organized by: <strong className="text-slate-300 ml-1">{tournament?.organizationId?.organizationName}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <Tabs items={tabItems} className="custom-tabs" />
                </>
            )}

        </main>
    );
}

export default TournamentDetails;
