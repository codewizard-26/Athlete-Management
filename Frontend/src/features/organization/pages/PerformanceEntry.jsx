import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Select, InputNumber, Button, Card, message, Spin, ConfigProvider, theme, Space, Divider } from "antd";
import { CalendarOutlined, TrophyOutlined, UserOutlined, SaveOutlined, ArrowLeftOutlined, ThunderboltOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

const { Option } = Select;

function PerformanceEntry() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Core data states
    const [tournaments, setTournaments] = useState([]);
    const [matches, setMatches] = useState([]);
    const [athletes, setAthletes] = useState([]);
    const [matchPerformances, setMatchPerformances] = useState([]);
    const [selectedSport, setSelectedSport] = useState("");

    // Loading states
    const [toursLoading, setToursLoading] = useState(false);
    const [matchesLoading, setMatchesLoading] = useState(false);
    const [athletesLoading, setAthletesLoading] = useState(false);

    // Initial query params
    const initialTournamentId = searchParams.get("tournamentId");
    const initialMatchId = searchParams.get("matchId");

    // Custom Ant Design theme matching the dark sports-tech portal aesthetic
    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: "#2563eb", // Sports corporate blue
            colorBgContainer: "#0f172a", // Slate-900
            colorBorder: "rgba(255, 255, 255, 0.08)",
            colorText: "#f3f4f6",
            colorTextSecondary: "#9ca3af",
            borderRadius: 8,
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        },
        components: {
            Button: {
                colorPrimary: "#2563eb",
                colorPrimaryHover: "#1d4ed8",
                borderRadius: 8,
                controlHeight: 42,
                fontWeight: 600,
            },
            Input: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            },
            Select: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
            },
            InputNumber: {
                colorBgContainer: "#0b0f19",
                colorBorder: "rgba(255, 255, 255, 0.08)",
                controlHeight: 40,
            }
        }
    };

    // 1. Fetch Tournaments on Load
    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                setToursLoading(true);
                const res = await api.get("/tournament/my-tournaments");
                setTournaments(res.data || []);

                // If tournamentId query parameter exists, set it and fetch matches
                if (initialTournamentId) {
                    form.setFieldsValue({ tournamentId: initialTournamentId });
                    fetchMatchesForTournament(initialTournamentId);
                }
            } catch (err) {
                console.error("Error fetching tournaments:", err);
                message.error("Failed to load tournaments list");
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
            setAthletes([]);
            setMatchPerformances([]);
            setSelectedSport("");
            form.setFieldsValue({ matchId: undefined, athleteId: undefined });

            const res = await api.get(`/match/tournament/${tourId}`);
            setMatches(res.data || []);

            // If matchId exists in query params and matches load, preselect it
            if (initialMatchId && res.data?.some(m => m._id === initialMatchId)) {
                form.setFieldsValue({ matchId: initialMatchId });
                const matched = res.data.find(m => m._id === initialMatchId);
                if (matched) {
                    handleMatchChange(initialMatchId, matched);
                }
            }
        } catch (err) {
            console.error("Error fetching tournament matches:", err);
            message.error("Failed to load tournament matches");
        } finally {
            setMatchesLoading(false);
        }
    };

    // 3. Handle Match Selection: Determine Sport and load combined rosters
    const handleMatchChange = async (matchId, selectedMatchObj) => {
        const match = selectedMatchObj || matches.find(m => m._id === matchId);
        if (!match) return;

        // Reset athlete fields
        form.setFieldsValue({ athleteId: undefined });
        setAthletes([]);
        setMatchPerformances([]);

        // Determine sport
        const sport = match.tournamentId?.sport || "football";
        setSelectedSport(sport.toLowerCase());

        try {
            setAthletesLoading(true);
            const homeId = match.homeTeamId?._id || match.homeTeamId;
            const awayId = match.awayTeamId?._id || match.awayTeamId;

            // Fetch rosters for both teams and performances in parallel
            const [homeRes, awayRes, perfRes] = await Promise.all([
                api.get(`/team/members/${homeId}`),
                api.get(`/team/members/${awayId}`),
                api.get(`/performance/match/${matchId}`)
            ]);

            const homeRoster = (homeRes.data || []).map(m => ({
                ...m,
                teamName: match.homeTeamId?.teamName || "Home Team",
                teamId: homeId
            }));

            const awayRoster = (awayRes.data || []).map(m => ({
                ...m,
                teamName: match.awayTeamId?.teamName || "Away Team",
                teamId: awayId
            }));

            const combined = [...homeRoster, ...awayRoster];
            setAthletes(combined);
            setMatchPerformances(perfRes.data || []);

            // Handle query param athleteId if preset
            const initialAthleteId = searchParams.get("athleteId");
            if (initialAthleteId && combined.some(a => a.athleteId?._id === initialAthleteId)) {
                form.setFieldsValue({ athleteId: initialAthleteId });
                handleAthleteChange(initialAthleteId, combined, perfRes.data || [], sport.toLowerCase());
            }
        } catch (err) {
            console.error("Error loading team rosters:", err);
            message.error("Failed to load match player rosters");
        } finally {
            setAthletesLoading(false);
        }
    };

    // Check for existing performance when athlete changes
    const handleAthleteChange = (athleteId, customAthletes, customPerfs, customSport) => {
        const list = customAthletes || athletes;
        const perfs = customPerfs || matchPerformances;
        const currentSport = customSport || selectedSport;

        const existing = perfs.find(p => p.athleteId?._id === athleteId || p.athleteId === athleteId);
        if (existing) {
            form.setFieldsValue({
                ...existing.stats
            });
            message.info("Loaded existing stats for selected athlete");
        } else {
            // Reset to defaults
            const sportFields = currentSport === "football"
                ? { goals: 0, assists: 0, passes: 0, tackles: 0, cleanSheets: 0 }
                : { runs: 0, ballsFaced: 0, strikeRate: 0, wickets: 0, economy: 0 };
            form.setFieldsValue(sportFields);
        }
    };

    // 4. Submit Performance
    const onFinish = async (values) => {
        // Find selected athlete metadata to get the teamId they belong to
        const selectedAth = athletes.find(a => a.athleteId?._id === values.athleteId);
        if (!selectedAth) {
            message.error("Invalid athlete selected");
            return;
        }

        const existing = matchPerformances.find(p => p.athleteId?._id === values.athleteId || p.athleteId === values.athleteId);

        try {
            setLoading(true);

            // Construct stats payload based on sport dynamically
            const stats = {};
            if (selectedSport === "football") {
                stats.goals = Number(values.goals || 0);
                stats.assists = Number(values.assists || 0);
                stats.passes = Number(values.passes || 0);
                stats.tackles = Number(values.tackles || 0);
                stats.cleanSheets = Number(values.cleanSheets || 0);
            } else if (selectedSport === "cricket") {
                stats.runs = Number(values.runs || 0);
                stats.ballsFaced = Number(values.ballsFaced || 0);
                stats.strikeRate = Number(values.strikeRate || 0);
                stats.wickets = Number(values.wickets || 0);
                stats.economy = Number(values.economy || 0);
            }

            if (existing) {
                // Update existing
                await api.put(`/performance/${existing._id}`, { stats });
                message.success("Performance stats updated successfully!");
            } else {
                // Create new record
                const payload = {
                    tournamentId: values.tournamentId,
                    matchId: values.matchId,
                    athleteId: values.athleteId,
                    teamId: selectedAth.teamId,
                    sport: selectedSport,
                    stats
                };
                await api.post("/performance/create", payload);
                message.success("Performance stats registered successfully!");
            }

            // Sync performances list
            const perfRes = await api.get(`/performance/match/${values.matchId}`);
            setMatchPerformances(perfRes.data || []);
        } catch (err) {
            console.error("Error recording performance:", err);
            message.error(err.response?.data?.message || "Failed to record performance stats");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="min-h-screen w-full bg-[#080b11] text-slate-100 font-sans selection:bg-blue-600 selection:text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
                        <div className="space-y-1">
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate("/organization/matches")}
                                className="text-slate-400 hover:text-white flex items-center p-0 h-auto mb-2"
                            >
                                Back to Matches
                            </Button>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                                <ThunderboltOutlined className="text-blue-500" />
                                <span>Single Performance Entry</span>
                            </h1>
                            <p className="text-slate-400 text-xs">
                                Record detailed biometrics and stats for a single athlete after a tournament match.
                            </p>
                        </div>
                    </div>

                    <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/40 backdrop-blur-md p-4 sm:p-6 shadow-2xl">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            requiredMark={false}
                        >
                            {/* GENERAL FIELDS SECTION */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Form.Item
                                    name="tournamentId"
                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tournament</span>}
                                    rules={[{ required: true, message: "Select Tournament" }]}
                                >
                                    <Select
                                        placeholder="Select Tournament"
                                        loading={toursLoading}
                                        onChange={fetchMatchesForTournament}
                                    >
                                        {tournaments.map(t => (
                                            <Option key={t._id} value={t._id}>{t.name} ({t.sport})</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="matchId"
                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Match Fixture</span>}
                                    rules={[{ required: true, message: "Select Match" }]}
                                >
                                    <Select
                                        placeholder="Select Match"
                                        loading={matchesLoading}
                                        onChange={(val) => handleMatchChange(val)}
                                        disabled={matches.length === 0}
                                    >
                                        {matches.map(m => (
                                            <Option key={m._id} value={m._id}>
                                                {m.homeTeamId?.teamName} vs {m.awayTeamId?.teamName}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="athleteId"
                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Athlete</span>}
                                    rules={[{ required: true, message: "Select Athlete" }]}
                                >
                                    <Select
                                        placeholder="Select Athlete"
                                        loading={athletesLoading}
                                        disabled={athletes.length === 0}
                                        onChange={(val) => handleAthleteChange(val)}
                                    >
                                        {athletes.map(a => (
                                            <Option key={a.athleteId?._id} value={a.athleteId?._id}>
                                                {a.athleteId?.userId?.name} ({a.teamName} - {a.athleteId?.primaryRole})
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            {selectedSport && (
                                <>
                                    <Divider className="border-white/[0.06] my-6" />

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center space-x-2">
                                            <TrophyOutlined />
                                            <span>Dynamic Stats Form ({selectedSport.toUpperCase()})</span>
                                        </h3>

                                        {selectedSport === "football" && (
                                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                                <Form.Item
                                                    name="goals"
                                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Goals</span>}
                                                    rules={[{ type: 'integer', min: 0, message: "Must be positive" }]}
                                                >
                                                    <InputNumber min={0} className="w-full" placeholder="0" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="assists"
                                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assists</span>}
                                                    rules={[{ type: 'integer', min: 0, message: "Must be positive" }]}
                                                >
                                                    <InputNumber min={0} className="w-full" placeholder="0" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="passes"
                                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passes Completed</span>}
                                                    rules={[{ type: 'integer', min: 0, message: "Must be positive" }]}
                                                >
                                                    <InputNumber min={0} className="w-full" placeholder="0" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="tackles"
                                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tackles</span>}
                                                    rules={[{ type: 'integer', min: 0, message: "Must be positive" }]}
                                                >
                                                    <InputNumber min={0} className="w-full" placeholder="0" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="cleanSheets"
                                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clean Sheets</span>}
                                                    rules={[{ type: 'integer', min: 0, max: 1, message: "Must be 0 or 1" }]}
                                                >
                                                    <InputNumber min={0} max={1} className="w-full" placeholder="0 or 1" />
                                                </Form.Item>
                                            </div>
                                        )}

                                        {selectedSport === "cricket" && (
                                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                                <Form.Item
                                                    name="runs"
                                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Runs</span>}
                                                    rules={[{ type: 'integer', min: 0, message: "Must be positive" }]}
                                                >
                                                    <InputNumber min={0} className="w-full" placeholder="0" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="ballsFaced"
                                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balls Faced</span>}
                                                    rules={[{ type: 'integer', min: 0, message: "Must be positive" }]}
                                                >
                                                    <InputNumber min={0} className="w-full" placeholder="0" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="strikeRate"
                                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Strike Rate</span>}
                                                    rules={[{ type: 'number', min: 0, message: "Must be positive" }]}
                                                >
                                                    <InputNumber min={0} step={0.1} className="w-full" placeholder="0.0" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="wickets"
                                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wickets</span>}
                                                    rules={[{ type: 'integer', min: 0, max: 10, message: "Must be 0 to 10" }]}
                                                >
                                                    <InputNumber min={0} max={10} className="w-full" placeholder="0" />
                                                </Form.Item>

                                                <Form.Item
                                                    name="economy"
                                                    label={<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Economy</span>}
                                                    rules={[{ type: 'number', min: 0, message: "Must be positive" }]}
                                                >
                                                    <InputNumber min={0} step={0.01} className="w-full" placeholder="0.0" />
                                                </Form.Item>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Submit Button */}
                            <div className="mt-8 pt-6 border-t border-white/[0.04] flex justify-end">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                    disabled={!selectedSport}
                                    className="px-6 w-full sm:w-auto uppercase tracking-wider shadow-lg shadow-blue-600/10"
                                >
                                    Submit Performance
                                </Button>
                            </div>
                        </Form>
                    </Card>

                </div>
            </div>
        </ConfigProvider>
    );
}

export default PerformanceEntry;
