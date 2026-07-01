import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, Table, Spin, Empty, Button, Tag, Avatar, Modal, Select, Upload, Alert, Space, message } from "antd";
import { 
    BarChartOutlined, 
    UserOutlined, 
    UploadOutlined, 
    DownloadOutlined, 
    CheckCircleOutlined,
    WarningOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

const { Option } = Select;

function TeamPerformance() {
    const { teamData } = useOutletContext(); // Retrieve team detail state
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);

    // Upload Performance Modal states
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [allMatches, setAllMatches] = useState([]);
    const [matchesLoading, setMatchesLoading] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState(null);
    const [roster, setRoster] = useState([]);
    const [, setRosterLoading] = useState(false);

    // CSV Parse states
    const [fileList, setFileList] = useState([]);
    const [parsedData, setParsedData] = useState([]);
    const [parseErrors, setParseErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const fetchPerformances = async () => {
        if (!teamData?._id) return;
        try {
            setLoading(true);
            const res = await api.get(`/performance/team/${teamData._id}`);
            if (res.data) {
                setPerformances(res.data);
            }
        } catch (err) {
            console.error("Error fetching team performances:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformances();
    }, [teamData]);

    // Fetch matches and roster when opening modal
    const handleOpenUploadModal = async () => {
        setUploadModalOpen(true);
        setSelectedMatchId(null);
        setFileList([]);
        setParsedData([]);
        setParseErrors([]);
        
        try {
            setMatchesLoading(true);
            setRosterLoading(true);
            
            const [matchesRes, rosterRes] = await Promise.all([
                api.get("/match/all"),
                api.get(`/team/members/${teamData._id}`)
            ]);

            setAllMatches(matchesRes.data || []);
            setRoster(rosterRes.data || []);
        } catch (err) {
            console.error("Error loading upload modal dependencies:", err);
            message.error("Failed to load match fixtures or squad roster");
        } finally {
            setMatchesLoading(false);
            setRosterLoading(false);
        }
    };

    // Filter matches involving this team
    const teamMatches = allMatches.filter(m => 
        (m.homeTeamId?._id === teamData?._id || m.homeTeamId === teamData?._id ||
         m.awayTeamId?._id === teamData?._id || m.awayTeamId === teamData?._id)
    );

    const selectedMatch = allMatches.find(m => m._id === selectedMatchId);
    const sportCategory = selectedMatch?.tournamentId?.sport || teamData?.sport;

    // Triggered when file is uploaded or selected
    const handleFileChange = (info) => {
        const file = info.file;
        setFileList([file]);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const { data, errors } = parseCSV(text, sportCategory, roster);
            setParsedData(data);
            setParseErrors(errors);
        };
        reader.readAsText(file);
    };

    const parseCSV = (text, sport, rosterList) => {
        const lines = text.split(/\r?\n/);
        if (lines.length < 2) return { data: [], errors: ["CSV file is empty or missing data rows."] };
        
        const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
        const emailIndex = headers.indexOf("athleteemail");
        if (emailIndex === -1) {
            return { data: [], errors: ["Missing mandatory column: 'AthleteEmail'."] };
        }

        const data = [];
        const errors = [];

        const footballFields = ["goals", "assists", "passes", "tackles", "cleansheets"];
        const cricketFields = ["runs", "ballsfaced", "strikerate", "wickets", "economy"];
        const targetFields = sport?.toLowerCase() === "football" ? footballFields : cricketFields;

        const fieldIndices = {};
        targetFields.forEach(f => {
            fieldIndices[f] = headers.indexOf(f);
        });

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const cols = line.split(",").map(c => c.trim());
            const email = cols[emailIndex];
            if (!email) {
                errors.push(`Row ${i + 1}: AthleteEmail is missing.`);
                continue;
            }

            const rosterMember = rosterList.find(r => r.athleteId?.userId?.email?.toLowerCase() === email.toLowerCase());
            if (!rosterMember) {
                errors.push(`Row ${i + 1}: Athlete with email '${email}' is not in your squad roster.`);
                continue;
            }

            const stats = {};
            let rowHasError = false;

            targetFields.forEach(f => {
                const idx = fieldIndices[f];
                if (idx === -1 || idx >= cols.length || cols[idx] === "") {
                    stats[f] = 0;
                } else {
                    const val = parseFloat(cols[idx]);
                    if (isNaN(val)) {
                        errors.push(`Row ${i + 1}: Metric '${f}' must be a numeric value (got '${cols[idx]}').`);
                        rowHasError = true;
                    } else {
                        stats[f] = val;
                    }
                }
            });

            if (rowHasError) continue;

            const backendStats = {};
            if (sport?.toLowerCase() === "football") {
                backendStats.goals = stats.goals || 0;
                backendStats.assists = stats.assists || 0;
                backendStats.passes = stats.passes || 0;
                backendStats.tackles = stats.tackles || 0;
                backendStats.cleanSheets = stats.cleansheets || 0;
            } else {
                backendStats.runs = stats.runs || 0;
                backendStats.ballsFaced = stats.ballsfaced || 0;
                backendStats.strikeRate = stats.strikerate || 0;
                backendStats.wickets = stats.wickets || 0;
                backendStats.economy = stats.economy || 0;
            }

            data.push({
                key: i,
                athleteId: rosterMember.athleteId._id,
                athleteName: rosterMember.athleteId.userId?.name || "Player",
                athleteEmail: email,
                stats: backendStats
            });
        }

        return { data, errors };
    };

    const handleUploadSubmit = async () => {
        if (!selectedMatchId) {
            message.warning("Please select a match fixture first");
            return;
        }
        if (parsedData.length === 0) {
            message.warning("No valid player records found to upload");
            return;
        }

        try {
            setSubmitting(true);
            const payloadList = parsedData.map(d => ({
                athleteId: d.athleteId,
                matchId: selectedMatchId,
                teamId: teamData._id,
                tournamentId: selectedMatch.tournamentId?._id || selectedMatch.tournamentId,
                sport: sportCategory,
                stats: d.stats
            }));

            await api.post("/performance/bulk-create", { performances: payloadList });
            message.success("Roster match statistics uploaded successfully!");
            setUploadModalOpen(false);
            fetchPerformances();
        } catch (err) {
            console.error("Bulk upload performance submission failed:", err);
            message.error(err.response?.data?.message || "Failed to upload performance stats file");
        } finally {
            setSubmitting(false);
        }
    };

    const downloadCSVTemplate = () => {
        let headers = "AthleteEmail";
        if (sportCategory?.toLowerCase() === "football") {
            headers += ",Goals,Assists,Passes,Tackles,CleanSheets";
        } else {
            headers += ",Runs,BallsFaced,StrikeRate,Wickets,Economy";
        }
        
        let sampleRows = "";
        if (roster.length > 0) {
            roster.forEach(r => {
                const email = r.athleteId?.userId?.email || "";
                if (email) {
                    if (sportCategory?.toLowerCase() === "football") {
                        sampleRows += `\n${email},1,0,35,4,0`;
                    } else {
                        sampleRows += `\n${email},45,38,118.4,1,6.5`;
                    }
                }
            });
        } else {
            if (sportCategory?.toLowerCase() === "football") {
                sampleRows += "\nathlete1@gmail.com,2,1,45,3,1";
            } else {
                sampleRows += "\nathlete1@gmail.com,82,75,109.3,0,0";
            }
        }

        const blob = new Blob([headers + sampleRows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `performance_template_${sportCategory || "sport"}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const tableColumns = [
        {
            title: "ATHLETE",
            dataIndex: "athleteId",
            key: "athlete",
            render: (athlete) => (
                <div className="flex items-center space-x-2.5">
                    <Avatar size={24} icon={<UserOutlined />} className="bg-brand-primary shrink-0" />
                    <span className="text-xs font-semibold text-text-primary">{athlete?.userId?.name || "Squad Player"}</span>
                </div>
            )
        },
        {
            title: "SPORT CATEGORY",
            dataIndex: "sport",
            key: "sport",
            render: (sport) => (
                <Tag color={sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 font-semibold uppercase text-[9px]">
                    {sport}
                </Tag>
            )
        },
        {
            title: "MATCH STATS RECORDED",
            dataIndex: "stats",
            key: "stats",
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
            title: "RECORDED ON",
            dataIndex: "createdAt",
            key: "date",
            render: (date) => <span className="text-xs text-text-secondary">{date ? new Date(date).toLocaleDateString() : "N/A"}</span>
        }
    ];

    const previewColumns = [
        {
            title: "Player Name",
            dataIndex: "athleteName",
            key: "name",
            render: (text) => <span className="text-xs font-semibold text-text-primary">{text}</span>
        },
        {
            title: "Email",
            dataIndex: "athleteEmail",
            key: "email",
            render: (text) => <span className="text-xs font-mono text-text-secondary">{text}</span>
        },
        {
            title: "Metrics Parsed",
            key: "metrics",
            render: (_, record) => (
                <div className="flex flex-wrap gap-1">
                    {Object.entries(record.stats || {}).map(([k, v]) => (
                        <Tag key={k} color="blue" className="text-[9px] font-semibold border-0 uppercase px-1.5 py-0.5 rounded">
                            {k}: {v}
                        </Tag>
                    ))}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                        <BarChartOutlined className="text-brand-primary" />
                        <span>Squad Performance</span>
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">Review statistical updates, logs, and game metrics of active players.</p>
                </div>
                <Space>
                    <Button 
                        onClick={handleOpenUploadModal} 
                        type="primary" 
                        icon={<UploadOutlined className="text-xs" />} 
                        className="text-xs font-semibold h-9 rounded-md cursor-pointer"
                    >
                        Upload Performance File
                    </Button>
                    <Button 
                        onClick={fetchPerformances} 
                        type="text" 
                        size="small" 
                        className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium cursor-pointer"
                    >
                        Refresh Stats
                    </Button>
                </Space>
            </div>

            {/* List */}
            {loading ? (
                <div className="py-16 flex justify-center"><Spin size="middle" /></div>
            ) : performances.length === 0 ? (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-16 text-center shadow-sm rounded-xl">
                    <Empty description={<span className="text-text-secondary text-xs">No performance entries recorded for team players yet. Matches matches will update roster statistics here!</span>} />
                </Card>
            ) : (
                <Table 
                    columns={tableColumns}
                    dataSource={performances.map(p => ({ ...p, key: p._id }))}
                    className="custom-table border border-border-subtle bg-bg-surface rounded-xl overflow-hidden shadow-sm"
                    pagination={{ pageSize: 8 }}
                    size="small"
                />
            )}

            {/* UPLOAD PERFORMANCE MODAL */}
            <Modal
                title={<span className="text-xs font-bold uppercase text-text-primary tracking-wider flex items-center gap-1.5"><UploadOutlined className="text-brand-primary" /> Upload Match Performance</span>}
                open={uploadModalOpen}
                onCancel={() => setUploadModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setUploadModalOpen(false)} className="text-xs">
                        Cancel
                    </Button>,
                    <Button 
                        key="submit" 
                        type="primary" 
                        onClick={handleUploadSubmit} 
                        loading={submitting}
                        disabled={parsedData.length === 0}
                        icon={<CheckCircleOutlined className="text-xs" />}
                        className="text-xs font-semibold h-9 rounded-md cursor-pointer"
                    >
                        Submit Stats
                    </Button>
                ]}
                width={700}
                centered
            >
                <div className="space-y-5 mt-4">
                    {/* 1. Select Match */}
                    <div className="flex flex-col space-y-1.5">
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Select Match Fixture</span>
                        <Select 
                            placeholder="Select team fixture match" 
                            className="w-full"
                            value={selectedMatchId}
                            onChange={(val) => {
                                setSelectedMatchId(val);
                                setFileList([]);
                                setParsedData([]);
                                setParseErrors([]);
                            }}
                            loading={matchesLoading}
                        >
                            {teamMatches.map(m => {
                                const homeName = m.homeTeamId?.teamName || "Home Team";
                                const awayName = m.awayTeamId?.teamName || "Away Team";
                                const tourName = m.tournamentId?.name || "Tournament";
                                const dateStr = new Date(m.matchDate).toLocaleDateString();
                                return (
                                    <Option key={m._id} value={m._id}>
                                        {tourName}: {homeName} vs {awayName} ({dateStr})
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>

                    {selectedMatchId && (
                        <div className="space-y-4 animate-fadeIn">
                            
                            {/* 2. Download template section */}
                            <Alert
                                message={<span className="text-xs font-bold text-text-primary">Prepare Performance Data CSV</span>}
                                description={
                                    <div className="space-y-3 mt-1 text-xs text-text-secondary leading-relaxed">
                                        <p>
                                            Please format your CSV spreadsheet matching the dynamic fields of 
                                            sport category <strong className="text-brand-primary uppercase">{sportCategory}</strong>.
                                        </p>
                                        <div className="bg-bg-elevated border border-border-subtle p-2.5 rounded-lg font-mono text-[10px] select-all text-text-primary">
                                            {sportCategory?.toLowerCase() === "football" 
                                                ? "AthleteEmail,Goals,Assists,Passes,Tackles,CleanSheets"
                                                : "AthleteEmail,Runs,BallsFaced,StrikeRate,Wickets,Economy"
                                            }
                                        </div>
                                        <Button 
                                            type="dashed" 
                                            size="small" 
                                            icon={<DownloadOutlined className="text-xs" />} 
                                            onClick={downloadCSVTemplate}
                                            className="text-xs hover:border-brand-primary hover:text-brand-primary h-7 rounded cursor-pointer"
                                        >
                                            Download Template
                                        </Button>
                                    </div>
                                }
                                type="info"
                                showIcon
                                className="bg-brand-primary/5 border-brand-primary/15"
                            />

                            {/* 3. File upload drop area */}
                            <div className="flex flex-col space-y-1.5">
                                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Upload CSV File</span>
                                <Upload
                                    accept=".csv"
                                    beforeUpload={() => false}
                                    fileList={fileList}
                                    onChange={handleFileChange}
                                    maxCount={1}
                                    className="w-full"
                                >
                                    <Button icon={<UploadOutlined className="text-xs" />} className="w-full hover:border-brand-primary hover:text-brand-primary h-9 rounded cursor-pointer">
                                        Select CSV performance log file
                                    </Button>
                                </Upload>
                            </div>

                            {/* 4. Display parsing errors */}
                            {parseErrors.length > 0 && (
                                <Alert
                                    message={<span className="text-xs font-bold text-text-primary">File Parsing Warnings/Errors</span>}
                                    description={
                                        <ul className="list-disc list-inside space-y-1 text-xs text-status-error">
                                            {parseErrors.map((err, idx) => (
                                                <li key={idx}>{err}</li>
                                            ))}
                                        </ul>
                                    }
                                    type="warning"
                                    showIcon
                                    icon={<WarningOutlined className="text-brand-accent" />}
                                    className="bg-brand-accent/5 border-brand-accent/15"
                                />
                            )}

                            {/* 5. Parsed statistics data preview table */}
                            {parsedData.length > 0 && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">Parsed Player Records Preview</span>
                                    <Table 
                                        columns={previewColumns} 
                                        dataSource={parsedData} 
                                        pagination={{ pageSize: 5 }}
                                        size="small"
                                        className="custom-table border border-border-subtle rounded-lg overflow-hidden bg-bg-surface shadow-sm"
                                    />
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </Modal>

        </div>
    );
}

export default TeamPerformance;
