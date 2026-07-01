import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Table, Select, Button, Card, message, Spin, InputNumber } from "antd";
import { SaveOutlined, ArrowLeftOutlined, ThunderboltOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

const { Option } = Select;

function BulkPerformanceEntry() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});

    // Selection states
    const [tournaments, setTournaments] = useState([]);
    const [matches, setMatches] = useState([]);
    const [selectedTournamentId, setSelectedTournamentId] = useState(undefined);
    const [selectedMatchId, setSelectedMatchId] = useState(undefined);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [sport, setSport] = useState("");

    // Combined roster of both teams with editable stats
    const [rosterData, setRosterData] = useState([]);

    // Loading states
    const [toursLoading, setToursLoading] = useState(false);
    const [matchesLoading, setMatchesLoading] = useState(false);
    const [rosterLoading, setRosterLoading] = useState(false);

    // Initial query params
    const initialTournamentId = searchParams.get("tournamentId");
    const initialMatchId = searchParams.get("matchId");

    // 1. Fetch Tournaments on Load
    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                setToursLoading(true);
                const res = await api.get("/tournament/my-tournaments");
                setTournaments(res.data || []);
                
                if (initialTournamentId) {
                    setSelectedTournamentId(initialTournamentId);
                    fetchMatchesForTournament(initialTournamentId);
                }
            } catch (err) {
                console.error("Error fetching tournaments:", err);
                message.error("Failed to load tournaments");
            } finally {
                setToursLoading(false);
            }
        };
        fetchTournaments();
    }, [initialTournamentId]);

    // 2. Fetch Matches when tournament changes
    const fetchMatchesForTournament = async (tourId) => {
        try {
            setMatchesLoading(true);
            setMatches([]);
            setRosterData([]);
            setSport("");
            setSelectedMatchId(undefined);
            setSelectedMatch(null);
            
            const res = await api.get(`/match/tournament/${tourId}`);
            setMatches(res.data || []);

            if (initialMatchId && res.data?.some(m => m._id === initialMatchId)) {
                setSelectedMatchId(initialMatchId);
                const matched = res.data.find(m => m._id === initialMatchId);
                if (matched) {
                    setSelectedMatch(matched);
                    handleMatchChange(initialMatchId, matched);
                }
            }
        } catch (err) {
            console.error("Error fetching matches:", err);
            message.error("Failed to load tournament matches");
        } finally {
            setMatchesLoading(false);
        }
    };

    // 3. Load Combined Rosters and Merge with Existing Performances
    const handleMatchChange = async (matchId, selectedMatchObj) => {
        const match = selectedMatchObj || matches.find(m => m._id === matchId);
        if (!match) return;

        setSelectedMatch(match);
        setRosterData([]);
        
        const matchSport = (match.tournamentId?.sport || "football").toLowerCase();
        setSport(matchSport);

        try {
            setRosterLoading(true);
            const homeId = match.homeTeamId?._id || match.homeTeamId;
            const awayId = match.awayTeamId?._id || match.awayTeamId;

            // Fetch rosters and existing match performances in parallel
            const [homeRes, awayRes, perfRes] = await Promise.all([
                api.get(`/team/members/${homeId}`),
                api.get(`/team/members/${awayId}`),
                api.get(`/performance/match/${matchId}`)
            ]);

            const homeRoster = homeRes.data || [];
            const awayRoster = awayRes.data || [];
            const existingPerformances = perfRes.data || [];

            // Combine both rosters and map stats
            const combined = [];
            const defaultStats = matchSport === "football" 
                ? { goals: 0, assists: 0, passes: 0, tackles: 0, cleanSheets: 0 }
                : { runs: 0, ballsFaced: 0, strikeRate: 0, wickets: 0, economy: 0 };

            const processMember = (m, teamName, teamId) => {
                const athleteId = m.athleteId?._id;
                const name = m.athleteId?.userId?.name || "Squad Player";
                const role = m.athleteId?.primaryRole || "N/A";
                
                const existing = existingPerformances.find(p => p.athleteId?._id === athleteId || p.athleteId === athleteId);
                
                combined.push({
                    key: athleteId,
                    athleteId,
                    name,
                    role,
                    teamName,
                    teamId,
                    performanceId: existing ? existing._id : null,
                    stats: existing ? { ...defaultStats, ...existing.stats } : { ...defaultStats }
                });
            };

            homeRoster.forEach(m => processMember(m, match.homeTeamId?.teamName || "Home Team", homeId));
            awayRoster.forEach(m => processMember(m, match.awayTeamId?.teamName || "Away Team", awayId));

            setRosterData(combined);
        } catch (err) {
            console.error("Error loading match data:", err);
            message.error("Failed to load match player roster and existing stats");
        } finally {
            setRosterLoading(false);
        }
    };

    // 4. Handle Inline Input Edits
    const handleStatChange = (value, athleteId, statKey) => {
        setRosterData(prev => prev.map(row => {
            if (row.athleteId === athleteId) {
                return {
                    ...row,
                    stats: {
                        ...row.stats,
                        [statKey]: value
                    }
                };
            }
            return row;
        }));
    };

    // 5. Save Single Row (Athlete)
    const handleSaveRow = async (record) => {
        if (!selectedMatch) return;
        try {
            setActionLoading(prev => ({ ...prev, [record.athleteId]: true }));

            if (record.performanceId) {
                await api.put(`/performance/${record.performanceId}`, { stats: record.stats });
                message.success(`Updated performance for ${record.name}`);
            } else {
                const payload = {
                    athleteId: record.athleteId,
                    matchId: selectedMatch._id,
                    teamId: record.teamId,
                    tournamentId: selectedMatch.tournamentId?._id || selectedMatch.tournamentId,
                    sport: sport,
                    stats: record.stats
                };
                const res = await api.post("/performance/create", payload);
                
                setRosterData(prev => prev.map(row => {
                    if (row.athleteId === record.athleteId) {
                        return { ...row, performanceId: res.data?.performance?._id || null };
                    }
                    return row;
                }));
                message.success(`Saved performance for ${record.name}`);
            }
        } catch (err) {
            console.error("Error saving row performance:", err);
            message.error(err.response?.data?.message || `Failed to save stats for ${record.name}`);
        } finally {
            setActionLoading(prev => ({ ...prev, [record.athleteId]: false }));
        }
    };

    // 6. Save All (Bulk Submit)
    const handleSaveAll = async () => {
        if (!selectedMatch || rosterData.length === 0) return;
        try {
            setLoading(true);

            const performances = rosterData.map(row => ({
                athleteId: row.athleteId,
                matchId: selectedMatch._id,
                teamId: row.teamId,
                tournamentId: selectedMatch.tournamentId?._id || selectedMatch.tournamentId,
                sport: sport,
                stats: row.stats
            }));

            await api.post("/performance/bulk-create", { performances });
            message.success("All match roster performances saved successfully!");
            
            handleMatchChange(selectedMatchId, selectedMatch);
        } catch (err) {
            console.error("Error saving all performances:", err);
            message.error(err.response?.data?.message || "Bulk performance storage failed");
        } finally {
            setLoading(false);
        }
    };

    // 7. Dynamic Table Columns configuration based on sport
    const baseColumns = [
        {
            title: "ATHLETE",
            key: "athlete",
            fixed: "left",
            width: 180,
            render: (_, record) => (
                <div>
                    <p className="text-xs font-semibold text-text-primary leading-none mb-1">{record.name}</p>
                    <span className="text-[9px] bg-brand-primary/10 text-brand-primary font-bold uppercase px-1.5 py-0.5 rounded border border-brand-primary/15 shrink-0">
                        {record.teamName}
                    </span>
                    <p className="text-[10px] text-text-secondary mt-1 m-0">{record.role}</p>
                </div>
            )
        }
    ];

    const footballStatColumns = [
        {
            title: "GOALS",
            key: "goals",
            render: (_, record) => (
                <InputNumber 
                    min={0} 
                    value={record.stats.goals} 
                    onChange={(val) => handleStatChange(val, record.athleteId, "goals")} 
                    className="w-full max-w-[80px]"
                />
            )
        },
        {
            title: "ASSISTS",
            key: "assists",
            render: (_, record) => (
                <InputNumber 
                    min={0} 
                    value={record.stats.assists} 
                    onChange={(val) => handleStatChange(val, record.athleteId, "assists")} 
                    className="w-full max-w-[80px]"
                />
            )
        },
        {
            title: "PASSES",
            key: "passes",
            render: (_, record) => (
                <InputNumber 
                    min={0} 
                    value={record.stats.passes} 
                    onChange={(val) => handleStatChange(val, record.athleteId, "passes")} 
                    className="w-full max-w-[85px]"
                />
            )
        },
        {
            title: "TACKLES",
            key: "tackles",
            render: (_, record) => (
                <InputNumber 
                    min={0} 
                    value={record.stats.tackles} 
                    onChange={(val) => handleStatChange(val, record.athleteId, "tackles")} 
                    className="w-full max-w-[80px]"
                />
            )
        },
        {
            title: "CLEAN SHEET",
            key: "cleanSheets",
            render: (_, record) => (
                <InputNumber 
                    min={0} 
                    max={1}
                    value={record.stats.cleanSheets} 
                    onChange={(val) => handleStatChange(val, record.athleteId, "cleanSheets")} 
                    className="w-full max-w-[80px]"
                    placeholder="0 or 1"
                />
            )
        }
    ];

    const cricketStatColumns = [
        {
            title: "RUNS",
            key: "runs",
            render: (_, record) => (
                <InputNumber 
                    min={0} 
                    value={record.stats.runs} 
                    onChange={(val) => handleStatChange(val, record.athleteId, "runs")} 
                    className="w-full max-w-[80px]"
                />
            )
        },
        {
            title: "BALLS FACED",
            key: "ballsFaced",
            render: (_, record) => (
                <InputNumber 
                    min={0} 
                    value={record.stats.ballsFaced} 
                    onChange={(val) => handleStatChange(val, record.athleteId, "ballsFaced")} 
                    className="w-full max-w-[85px]"
                />
            )
        },
        {
            title: "STRIKE RATE",
            key: "strikeRate",
            render: (_, record) => (
                <InputNumber 
                    min={0} 
                    step={0.1}
                    value={record.stats.strikeRate} 
                    onChange={(val) => handleStatChange(val, record.athleteId, "strikeRate")} 
                    className="w-full max-w-[90px]"
                />
            )
        },
        {
            title: "WICKETS",
            key: "wickets",
            render: (_, record) => (
                <InputNumber 
                    min={0} 
                    max={10}
                    value={record.stats.wickets} 
                    onChange={(val) => handleStatChange(val, record.athleteId, "wickets")} 
                    className="w-full max-w-[80px]"
                />
            )
        },
        {
            title: "ECONOMY",
            key: "economy",
            render: (_, record) => (
                <InputNumber 
                    min={0} 
                    step={0.01}
                    value={record.stats.economy} 
                    onChange={(val) => handleStatChange(val, record.athleteId, "economy")} 
                    className="w-full max-w-[85px]"
                />
            )
        }
    ];

    const actionsColumn = {
        title: "ACTIONS",
        key: "actions",
        fixed: "right",
        width: 120,
        render: (_, record) => (
            <Button 
                type="primary" 
                size="small" 
                icon={<CheckOutlined className="text-[10px]" />} 
                loading={actionLoading[record.athleteId]}
                onClick={() => handleSaveRow(record)}
                className="bg-brand-secondary border-0 hover:bg-brand-secondary/90 text-xs flex items-center h-8 cursor-pointer font-semibold"
            >
                Save Player
            </Button>
        )
    };

    const columns = [
        ...baseColumns,
        ...(sport === "football" ? footballStatColumns : sport === "cricket" ? cricketStatColumns : []),
        actionsColumn
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
                <div className="space-y-1">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined className="text-xs" />} 
                        onClick={() => navigate("/organization/matches")}
                        className="text-text-secondary hover:text-text-primary flex items-center p-0 h-auto mb-2 cursor-pointer"
                    >
                        Back to Matches
                    </Button>
                    <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2 m-0">
                        <ThunderboltOutlined className="text-brand-primary" />
                        <span>Bulk Performance Entry</span>
                    </h1>
                    <p className="text-text-secondary text-xs m-0">
                        Record matches scoreboard stats for all athletes from home & away teams simultaneously.
                    </p>
                </div>
            </div>

            {/* SELECT CONTROLS CARD */}
            <Card bordered={false} className="border border-border-subtle bg-bg-surface p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">1. Select Tournament</span>
                        <Select 
                            className="w-full"
                            placeholder="Choose Tournament"
                            loading={toursLoading}
                            value={selectedTournamentId}
                            onChange={(val) => {
                                setSelectedTournamentId(val);
                                fetchMatchesForTournament(val);
                            }}
                        >
                            {tournaments.map(t => (
                                <Option key={t._id} value={t._id}>{t.name} ({t.sport})</Option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">2. Select Match</span>
                        <Select 
                            className="w-full"
                            placeholder={selectedTournamentId ? "Choose Match" : "Select tournament first"}
                            loading={matchesLoading}
                            disabled={!selectedTournamentId || matches.length === 0}
                            value={selectedMatchId}
                            onChange={(val) => {
                                setSelectedMatchId(val);
                                handleMatchChange(val);
                            }}
                        >
                            {matches.map(m => (
                                <Option key={m._id} value={m._id}>
                                    {m.homeTeamId?.teamName} vs {m.awayTeamId?.teamName}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </Card>

            {/* BULK PERFORMANCE TABLE CARD */}
            {rosterLoading ? (
                <div className="py-16 text-center">
                    <Spin size="middle" />
                    <p className="text-xs text-text-secondary mt-3 font-semibold">Loading athletes and existing performances...</p>
                </div>
            ) : selectedMatchId && rosterData.length === 0 ? (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface text-center py-16">
                    <p className="text-text-secondary text-xs italic m-0">No active athletes found in home or away team rosters.</p>
                </Card>
            ) : selectedMatchId && rosterData.length > 0 ? (
                <div className="space-y-6">
                    
                    {/* Score Display summary banner */}
                    <div className="bg-bg-elevated border border-border-subtle p-4 rounded-xl flex items-center justify-between">
                        <div className="text-xs">
                            <span className="text-text-secondary">Sport Division: </span>
                            <strong className="text-brand-primary uppercase font-mono">{sport}</strong>
                        </div>
                        <div className="text-xs font-semibold text-text-primary">
                            {selectedMatch?.homeTeamId?.teamName} vs {selectedMatch?.awayTeamId?.teamName}
                        </div>
                        <div className="text-xs">
                            <span className="text-text-secondary">Venue: </span>
                            <strong className="text-text-primary">{selectedMatch?.venue}</strong>
                        </div>
                    </div>

                    {/* Table */}
                    <Card bordered={false} className="border border-border-subtle bg-bg-surface p-0 shadow-sm overflow-hidden">
                        <Table 
                            columns={columns}
                            dataSource={rosterData}
                            pagination={false}
                            scroll={{ x: 800 }}
                            size="small"
                            className="custom-table"
                        />
                    </Card>

                    {/* Save All Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-primary/5 border border-brand-primary/10 p-5 rounded-xl">
                        <div className="flex items-center space-x-2 text-xs text-text-secondary">
                            <ExclamationCircleOutlined className="text-brand-primary text-base" />
                            <span>Review all inline cells before submission. Clicking Save All updates or creates records for every athlete.</span>
                        </div>
                        <Button
                            type="primary"
                            icon={<SaveOutlined className="text-xs" />}
                            loading={loading}
                            onClick={handleSaveAll}
                            className="w-full sm:w-auto font-semibold text-xs h-9 rounded-md cursor-pointer"
                        >
                            Save All Performances
                        </Button>
                    </div>
                </div>
            ) : (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface text-center py-16">
                    <p className="text-text-secondary text-xs italic m-0">Select a tournament and a match to initialize bulk entry sheet.</p>
                </Card>
            )}

        </div>
    );
}

export default BulkPerformanceEntry;
