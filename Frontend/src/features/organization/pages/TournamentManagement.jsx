import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Tabs, Button, Tag, Table, Modal, Avatar, message, Spin, Empty } from "antd";
import { 
    TrophyOutlined, 
    EnvironmentOutlined, 
    CalendarOutlined, 
    TeamOutlined, 
    CheckOutlined, 
    CloseOutlined,
    PlusOutlined,
    EyeOutlined,
    SettingOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function TournamentManagement() {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Registration Modal state
    const [regModalOpen, setRegModalOpen] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [regLoading, setRegLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});

    const fetchTournaments = async () => {
        try {
            setLoading(true);
            const res = await api.get("/tournament/my-tournaments");
            if (res.data) {
                setTournaments(res.data);
            }
        } catch (err) {
            console.error("Error fetching tournaments:", err);
            message.error("Failed to load tournaments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchRegistrations = async (tournamentId) => {
        try {
            setRegLoading(true);
            const res = await api.get(`/tournament/registrations/${tournamentId}`);
            if (res.data) {
                setRegistrations(res.data);
            }
        } catch (err) {
            console.error("Error fetching tournament registrations:", err);
            message.error("Failed to load team registrations");
        } finally {
            setRegLoading(false);
        }
    };

    const handleOpenRegistrations = (tournament) => {
        setSelectedTournament(tournament);
        setRegModalOpen(true);
        fetchRegistrations(tournament._id);
    };

    const handleAction = async (registrationId, action) => {
        try {
            setActionLoading(prev => ({ ...prev, [registrationId]: true }));
            const res = await api.put(`/tournament/${action}/${registrationId}`);
            message.success(res.data?.message || `Registration successfully ${action}ed!`);
            if (selectedTournament) {
                fetchRegistrations(selectedTournament._id); // Reload registrations
            }
        } catch (err) {
            console.error(`Error updating registration to ${action}:`, err);
            message.error(err.response?.data?.message || `Failed to update registration`);
        } finally {
            setActionLoading(prev => ({ ...prev, [registrationId]: false }));
        }
    };

    // Date calculations to classify status
    const now = new Date();
    const upcoming = tournaments.filter(t => new Date(t.startDate) > now);
    const ongoing = tournaments.filter(t => {
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        return start <= now && now <= end;
    });
    const completed = tournaments.filter(t => new Date(t.endDate) < now);

    const renderTournamentCards = (list) => {
        if (list.length === 0) {
            return (
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-12 text-center">
                    <Empty description={<span className="text-slate-400 text-xs">No tournaments in this category.</span>} />
                </Card>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map(tour => (
                    <Card 
                        key={tour._id}
                        bordered={false} 
                        className="border border-white/[0.04] bg-[#0f172a]/40 backdrop-blur-sm shadow-md hover:border-blue-500/20 transition-all flex flex-col justify-between"
                    >
                        <div className="space-y-4 flex-grow">
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm font-black text-white truncate max-w-[70%]">{tour.name}</h3>
                                <Tag color={tour.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 font-bold uppercase text-[9px]">
                                    {tour.sport}
                                </Tag>
                            </div>

                            <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                                {tour.description || "No tournament description provided."}
                            </p>

                            <div className="bg-[#0b0f19]/40 border border-white/[0.03] p-3 rounded-lg text-[10px] space-y-2.5">
                                <div className="flex items-center text-slate-300">
                                    <EnvironmentOutlined className="mr-2 text-blue-500 shrink-0" />
                                    <span className="truncate">{tour.location}</span>
                                </div>
                                <div className="flex items-center text-slate-300">
                                    <CalendarOutlined className="mr-2 text-emerald-500 shrink-0" />
                                    <span>{new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-300">
                                    <span className="flex items-center">
                                        <TeamOutlined className="mr-2 text-purple-500 shrink-0" />
                                        <span>Max Teams:</span>
                                    </span>
                                    <span className="font-extrabold text-blue-400">{tour.maxTeams || 8} Teams</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Actions */}
                        <div className="mt-5 border-t border-white/[0.03] pt-4 flex gap-2">
                            <Button 
                                type="primary" 
                                icon={<EyeOutlined />}
                                onClick={() => navigate(`/tournament/${tour._id}`)}
                                className="flex-grow text-xs h-9 font-bold"
                            >
                                Details
                            </Button>
                            <Button 
                                type="dashed" 
                                icon={<SettingOutlined />}
                                onClick={() => handleOpenRegistrations(tour)}
                                className="h-9 hover:border-blue-500 hover:text-blue-400"
                            />
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    const tabItems = [
        {
            key: "upcoming",
            label: <span className="font-bold text-xs">Upcoming Championships ({upcoming.length})</span>,
            children: renderTournamentCards(upcoming)
        },
        {
            key: "ongoing",
            label: <span className="font-bold text-xs">Ongoing Competitions ({ongoing.length})</span>,
            children: renderTournamentCards(ongoing)
        },
        {
            key: "completed",
            label: <span className="font-bold text-xs">Completed Tournaments ({completed.length})</span>,
            children: renderTournamentCards(completed)
        }
    ];

    const regColumns = [
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Team Name</span>,
            dataIndex: "teamId",
            key: "team",
            render: (team) => (
                <div className="flex items-center space-x-2.5">
                    {team?.logo ? (
                        <img src={team.logo} alt="Logo" className="w-8 h-8 rounded object-cover border border-white/5" />
                    ) : (
                        <Avatar size="small" icon={<TeamOutlined />} className="bg-blue-600 rounded" />
                    )}
                    <span className="text-xs font-bold text-white">{team?.teamName || "N/A"}</span>
                </div>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Status</span>,
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = "warning";
                if (status === "approved") color = "success";
                if (status === "rejected") color = "error";
                return <Tag color={color} className="m-0 border-0 font-bold uppercase text-[9px]">{status}</Tag>;
            }
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Actions</span>,
            key: "actions",
            render: (_, record) => {
                if (record.status !== "pending") return <span className="text-[10px] text-slate-500 italic">Decision Made</span>;
                return (
                    <div className="flex space-x-2">
                        <Button 
                            type="primary" 
                            size="small" 
                            icon={<CheckOutlined />} 
                            onClick={() => handleAction(record._id, "approve")}
                            loading={actionLoading[record._id]}
                            className="bg-emerald-600 border-0 hover:bg-emerald-500"
                        />
                        <Button 
                            danger 
                            size="small" 
                            icon={<CloseOutlined />} 
                            onClick={() => handleAction(record._id, "reject")}
                            loading={actionLoading[record._id]}
                        />
                    </div>
                );
            }
        }
    ];

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                        <TrophyOutlined className="text-blue-500" />
                        <span>Tournament Management</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Organize and monitor championships, review team signups, and check schedules.</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate("/organization/tournaments/create")}
                    className="shadow-lg shadow-blue-600/10 font-bold text-xs"
                >
                    New Tournament
                </Button>
            </div>

            {/* List */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="large" />
                    <p className="text-xs text-slate-400 mt-4">Syncing tournaments...</p>
                </div>
            ) : (
                <Tabs items={tabItems} className="custom-tabs" />
            )}

            {/* Registrations Review Modal */}
            <Modal
                title={<span className="text-sm font-extrabold uppercase text-white tracking-wider">Registrations: {selectedTournament?.name}</span>}
                open={regModalOpen}
                onCancel={() => setRegModalOpen(false)}
                footer={null}
                width={650}
                className="custom-modal"
            >
                {regLoading ? (
                    <div className="py-12 flex justify-center"><Spin /></div>
                ) : registrations.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">No teams have registered for this tournament yet.</div>
                ) : (
                    <Table 
                        columns={regColumns} 
                        dataSource={registrations.map(r => ({ ...r, key: r._id }))} 
                        pagination={false}
                        className="custom-table mt-4"
                    />
                )}
            </Modal>

        </main>
    );
}

export default TournamentManagement;
