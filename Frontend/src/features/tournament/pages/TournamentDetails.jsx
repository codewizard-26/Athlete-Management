import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Tabs, Button, Tag, Avatar, Table, Spin, Empty, Descriptions } from "antd";
import { 
    TrophyOutlined, 
    EnvironmentOutlined, 
    CalendarOutlined, 
    TeamOutlined, 
    ArrowLeftOutlined,
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
            title: "POS",
            key: "pos",
            render: (_, __, index) => <span className="text-xs font-semibold text-text-secondary">{index + 1}</span>
        },
        {
            title: "TEAM",
            key: "team",
            render: (_, record) => (
                <div className="flex items-center space-x-2.5">
                    {(record.logo?.url || (typeof record.logo === "string" && record.logo)) ? (
                        <img src={.logo?.url || .logo} alt="Logo" className="w-6 h-6 rounded object-cover border border-border-subtle" />
                    ) : (
                        <Avatar size={24} icon={<TeamOutlined />} className="bg-brand-primary rounded" />
                    )}
                    <span className="text-xs font-semibold text-text-primary">{record.teamName}</span>
                </div>
            )
        },
        {
            title: "P",
            dataIndex: "played",
            key: "played",
            render: (v) => <span className="text-xs text-text-primary font-mono font-semibold">{v}</span>
        },
        {
            title: "W",
            dataIndex: "won",
            key: "won",
            render: (v) => <span className="text-xs text-brand-secondary font-mono font-semibold">{v}</span>
        },
        {
            title: "L",
            dataIndex: "lost",
            key: "lost",
            render: (v) => <span className="text-xs text-status-error font-mono font-semibold">{v}</span>
        },
        {
            title: "D",
            dataIndex: "drawn",
            key: "drawn",
            render: (v) => <span className="text-xs text-text-secondary font-mono font-semibold">{v}</span>
        },
        {
            title: "PTS",
            dataIndex: "points",
            key: "points",
            render: (v) => <span className="text-xs text-brand-primary font-mono font-semibold">{v}</span>
        }
    ];

    const matchColumns = [
        {
            title: "MATCH DETAILS",
            key: "teams",
            render: (_, record) => (
                <span className="text-xs font-semibold text-text-primary">
                    {record.homeTeamId?.teamName} vs {record.awayTeamId?.teamName}
                </span>
            )
        },
        {
            title: "SCHEDULE",
            key: "schedule",
            render: (_, record) => (
                <div className="space-y-0.5 text-xs text-text-secondary">
                    <p className="font-semibold text-text-primary"><CalendarOutlined className="mr-1.5 text-brand-primary text-[10px]" />{new Date(record.matchDate).toLocaleString()}</p>
                    <p><EnvironmentOutlined className="mr-1.5 text-text-secondary/50 text-[10px]" />{record.venue}</p>
                </div>
            )
        },
        {
            title: "SCORE",
            key: "score",
            render: (_, record) => (
                <span className="text-xs font-bold text-brand-primary font-mono">
                    {record.homeScore !== undefined ? record.homeScore : "-"} : {record.awayScore !== undefined ? record.awayScore : "-"}
                </span>
            )
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "completed" ? "success" : "processing"} className="m-0 border-0 font-semibold uppercase text-[9px] px-2 py-0.5 rounded">
                    {status}
                </Tag>
            )
        },
        {
            title: "LINK",
            key: "link",
            render: (_, record) => (
                <Button size="small" type="link" onClick={() => navigate(`/match/${record._id}`)} className="text-xs font-semibold text-brand-primary p-0 h-auto cursor-pointer">
                    Stats
                </Button>
            )
        }
    ];

    const tabItems = [
        {
            key: "overview",
            label: <span className="font-semibold text-xs">Overview</span>,
            children: (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface p-4 sm:p-6 rounded-xl shadow-sm">
                    <Descriptions column={{ xs: 1, sm: 2 }} className="custom-descriptions">
                        <Descriptions.Item label="Sport Limit">{tournament?.sport?.toUpperCase()}</Descriptions.Item>
                        <Descriptions.Item label="Age Bracket">{tournament?.ageCategory}</Descriptions.Item>
                        <Descriptions.Item label="Start Date">{tournament?.startDate ? new Date(tournament.startDate).toLocaleDateString() : "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="End Date">{tournament?.endDate ? new Date(tournament.endDate).toLocaleDateString() : "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Trials Venue">{tournament?.location}</Descriptions.Item>
                        <Descriptions.Item label="Max Teams Limit">{tournament?.maxTeams} Teams</Descriptions.Item>
                    </Descriptions>
                    <div className="mt-5 border-t border-border-subtle pt-4 space-y-1.5">
                        <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider block">Description</span>
                        <p className="text-xs text-text-secondary leading-relaxed m-0">{tournament?.description || "No description set by organization manager."}</p>
                    </div>
                </Card>
            )
        },
        {
            key: "teams",
            label: <span className="font-semibold text-xs">Approved Teams ({approvedTeams.length})</span>,
            children: (
                approvedTeams.length === 0 ? (
                    <Card bordered={false} className="border border-border-subtle bg-bg-surface py-12 text-center rounded-xl shadow-sm">
                        <Empty description={<span className="text-text-secondary text-xs">No teams approved in this tournament yet.</span>} />
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                        {approvedTeams.map(t => (
                            <Card key={t._id} bordered={false} className="border border-border-subtle bg-bg-surface rounded-xl shadow-sm p-4">
                                <div className="flex items-center space-x-3">
                                    {(t.logo?.url || (typeof t.logo === "string" && t.logo)) ? (
                                        <img src={.logo?.url || .logo} alt="Logo" className="w-10 h-10 rounded object-cover border border-border-subtle" />
                                    ) : (
                                        <Avatar size={40} icon={<TeamOutlined />} className="bg-brand-primary rounded" />
                                    )}
                                    <div>
                                        <span className="text-xs font-semibold text-text-primary">{t.teamName}</span>
                                        <p className="text-[10px] text-text-secondary mt-1 uppercase tracking-wider">{t.ageCategory} • {t.sport}</p>
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
            label: <span className="font-semibold text-xs">Matches & Fixtures ({matches.length})</span>,
            children: (
                matches.length === 0 ? (
                    <Card bordered={false} className="border border-border-subtle bg-bg-surface py-12 text-center rounded-xl shadow-sm">
                        <Empty description={<span className="text-text-secondary text-xs">No matches scheduled for this tournament yet.</span>} />
                    </Card>
                ) : (
                    <Table 
                        columns={matchColumns}
                        dataSource={matches.map(m => ({ ...m, key: m._id }))}
                        pagination={false}
                        size="small"
                        className="custom-table border border-border-subtle bg-bg-surface rounded-xl overflow-hidden shadow-sm"
                    />
                )
            )
        },
        {
            key: "standings",
            label: <span className="font-semibold text-xs">Standings</span>,
            children: (
                approvedTeams.length === 0 ? (
                    <Card bordered={false} className="border border-border-subtle bg-bg-surface py-12 text-center rounded-xl shadow-sm">
                        <Empty description={<span className="text-text-secondary text-xs">Standings will be calculated once teams are approved.</span>} />
                    </Card>
                ) : (
                    <Table 
                        columns={standingsColumns}
                        dataSource={getStandingsData()}
                        pagination={false}
                        size="small"
                        className="custom-table border border-border-subtle bg-bg-surface rounded-xl overflow-hidden shadow-sm animate-fadeIn"
                    />
                )
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Nav */}
            <div className="flex items-center">
                <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined className="text-xs" />} 
                    onClick={() => navigate(-1)}
                    className="text-text-secondary hover:text-text-primary p-0 h-auto cursor-pointer"
                >
                    Go Back
                </Button>
            </div>

            {loading ? (
                <div className="py-16 flex justify-center"><Spin size="middle" /></div>
            ) : (
                <>
                    {/* Header Banner */}
                    <div className="bg-bg-surface border border-border-subtle p-6 sm:p-8 rounded-xl flex items-center justify-between relative overflow-hidden">
                        <div className="space-y-2 relative z-10">
                            <div className="flex items-center space-x-2">
                                <TrophyOutlined className="text-lg text-brand-primary" />
                                <h1 className="text-lg sm:text-xl font-bold text-text-primary uppercase tracking-wider m-0">{tournament?.name}</h1>
                            </div>
                            <p className="text-[10px] text-text-secondary flex items-center m-0">
                                <GlobalOutlined className="mr-1 text-text-secondary/50 text-[10px]" />
                                Organized by: <strong className="text-text-primary ml-1">{tournament?.organizationId?.organizationName}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Content Tabs */}
                    <Tabs items={tabItems} className="custom-tabs" />
                </>
            )}
        </div>
    );
}

export default TournamentDetails;
