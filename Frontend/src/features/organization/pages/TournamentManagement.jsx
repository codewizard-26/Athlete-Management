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
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-12 text-center rounded-xl shadow-sm">
                    <Empty description={<span className="text-text-secondary text-xs">No tournaments in this category.</span>} />
                </Card>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map(tour => (
                    <Card 
                        key={tour._id}
                        bordered={false} 
                        className="border border-border-subtle bg-bg-surface shadow-sm hover:border-brand-primary/25 transition-all duration-150 flex flex-col justify-between rounded-xl group"
                    >
                        <div className="space-y-4 flex-grow">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xs font-semibold text-text-primary truncate max-w-[70%]">{tour.name}</h3>
                                <Tag color={tour.sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 font-semibold uppercase text-[9px]">
                                    {tour.sport}
                                </Tag>
                            </div>

                            <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                                {tour.description || "No tournament description provided."}
                            </p>

                            <div className="bg-bg-elevated/50 border border-border-subtle p-3.5 rounded-lg text-[11px] space-y-2.5">
                                <div className="flex items-center text-text-primary">
                                    <EnvironmentOutlined className="mr-2 text-brand-primary shrink-0 text-[10px]" />
                                    <span className="truncate">{tour.location}</span>
                                </div>
                                <div className="flex items-center text-text-primary">
                                    <CalendarOutlined className="mr-2 text-brand-secondary shrink-0 text-[10px]" />
                                    <span>{new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-text-primary">
                                    <span className="flex items-center">
                                        <TeamOutlined className="mr-2 text-brand-primary shrink-0 text-[10px]" />
                                        <span>Max Teams:</span>
                                    </span>
                                    <span className="font-semibold text-brand-primary">{tour.maxTeams || 8} Teams</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Actions */}
                        <div className="mt-5 border-t border-border-subtle pt-4 flex gap-2">
                            <Button 
                                type="primary" 
                                icon={<EyeOutlined className="text-xs" />}
                                onClick={() => navigate(`/tournament/${tour._id}`)}
                                className="flex-grow text-xs h-9 font-semibold cursor-pointer"
                            >
                                Details
                            </Button>
                            <Button 
                                icon={<SettingOutlined className="text-xs" />}
                                onClick={() => handleOpenRegistrations(tour)}
                                className="h-9 border-border-subtle hover:border-brand-primary hover:text-brand-primary cursor-pointer"
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
            label: <span className="font-semibold text-xs">Upcoming ({upcoming.length})</span>,
            children: renderTournamentCards(upcoming)
        },
        {
            key: "ongoing",
            label: <span className="font-semibold text-xs">Ongoing ({ongoing.length})</span>,
            children: renderTournamentCards(ongoing)
        },
        {
            key: "completed",
            label: <span className="font-semibold text-xs">Completed ({completed.length})</span>,
            children: renderTournamentCards(completed)
        }
    ];

    const regColumns = [
        {
            title: "TEAM NAME",
            dataIndex: "teamId",
            key: "team",
            render: (t) => (
                <div className="flex items-center space-x-2.5">
                    {(t?.logo?.url || (typeof t?.logo === "string" && t?.logo)) ? (
                        <img src={t.logo?.url || t.logo} alt="Logo" className="w-6 h-6 rounded object-cover border border-border-subtle" />
                    ) : (
                        <Avatar size={24} icon={<TeamOutlined />} className="bg-brand-primary rounded" />
                    )}
                    <span className="text-xs font-semibold text-text-primary">{t?.teamName || "N/A"}</span>
                </div>
            )
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = "warning";
                if (status === "approved") color = "success";
                if (status === "rejected") color = "error";
                return <Tag color={color} className="m-0 border-0 font-semibold uppercase text-[9px] px-2 py-0.5 rounded">{status}</Tag>;
            }
        },
        {
            title: "ACTIONS",
            key: "actions",
            render: (_, record) => {
                if (record.status !== "pending") return <span className="text-xs text-text-secondary italic font-medium">Decision Made</span>;
                return (
                    <div className="flex space-x-2">
                        <Button 
                            type="primary" 
                            size="small" 
                            icon={<CheckOutlined className="text-xs" />} 
                            onClick={() => handleAction(record._id, "approve")}
                            loading={actionLoading[record._id]}
                            className="bg-status-success border-0 hover:bg-status-success/80 h-7 w-7 cursor-pointer flex items-center justify-center"
                        />
                        <Button 
                            danger 
                            size="small" 
                            icon={<CloseOutlined className="text-xs" />} 
                            onClick={() => handleAction(record._id, "reject")}
                            loading={actionLoading[record._id]}
                            className="h-7 w-7 cursor-pointer flex items-center justify-center"
                        />
                    </div>
                );
            }
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                        <TrophyOutlined className="text-brand-primary" />
                        <span>Tournament Management</span>
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">Organize and monitor championships, review team signups, and check schedules.</p>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined className="text-xs" />} 
                    onClick={() => navigate("/organization/tournaments/create")}
                    className="text-xs font-semibold h-9 rounded-md cursor-pointer"
                >
                    New Tournament
                </Button>
            </div>

            {/* List */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="middle" />
                    <p className="text-xs text-text-secondary mt-3">Syncing tournaments...</p>
                </div>
            ) : (
                <Tabs items={tabItems} className="custom-tabs" />
            )}

            {/* Registrations Review Modal */}
            <Modal
                title={<span className="text-xs font-bold uppercase text-text-primary tracking-wider">Registrations: {selectedTournament?.name}</span>}
                open={regModalOpen}
                onCancel={() => setRegModalOpen(false)}
                footer={null}
                width={650}
                centered
            >
                {regLoading ? (
                    <div className="py-12 flex justify-center"><Spin size="small" /></div>
                ) : registrations.length === 0 ? (
                    <div className="py-12 text-center text-text-secondary text-xs">No teams have registered for this tournament yet.</div>
                ) : (
                    <Table 
                        columns={regColumns} 
                        dataSource={registrations.map(r => ({ ...r, key: r._id }))} 
                        pagination={false}
                        size="small"
                        className="custom-table mt-3"
                    />
                )}
            </Modal>

        </div>
    );
}

export default TournamentManagement;
