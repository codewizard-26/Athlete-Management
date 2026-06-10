import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, ConfigProvider, theme, message, Row, Col, Badge, Avatar, Skeleton, Empty } from "antd";
import { 
    TeamOutlined, 
    PlusOutlined, 
    ArrowLeftOutlined, 
    GlobalOutlined, 
    TrophyOutlined, 
    MailOutlined,
    LockOutlined
} from "@ant-design/icons";
import api from "../../../api/axios";

function TeamsList() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    // Custom Ant Design theme matching the dark sports-tech portal aesthetic
    const darkTheme = {
        algorithm: theme.darkAlgorithm,
        token: {
            colorPrimary: "#2563eb", // Sports corporate blue
            colorBgContainer: "#0f172a", // Slate-900
            colorBorder: "rgba(255, 255, 255, 0.08)",
            colorText: "#f3f4f6",
            colorTextSecondary: "#9ca3af",
            borderRadius: 12,
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        },
        components: {
            Card: {
                colorBgContainer: "#0f172a", // Dark slate
            },
            Button: {
                colorPrimary: "#2563eb",
                colorPrimaryHover: "#1d4ed8",
                borderRadius: 8,
                controlHeight: 40,
                fontWeight: 600,
            }
        }
    };

    useEffect(() => {
        let isMounted = true;
        const fetchTeams = async () => {
            try {
                const response = await api.get("/team/myTeams");
                if (isMounted) {
                    setTeams(response.data || []);
                }
            } catch (error) {
                console.error("Error fetching teams list:", error);
                message.error("Failed to load teams list");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTeams();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <ConfigProvider theme={darkTheme}>
            <div className="min-h-screen w-full bg-[#080b11] text-slate-100 font-sans selection:bg-blue-600 selection:text-white py-12 px-4 sm:px-6 lg:px-8">
                
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
                        <div className="space-y-1">
                            <Button 
                                type="text" 
                                icon={<ArrowLeftOutlined />} 
                                onClick={() => navigate("/dashboard")}
                                className="text-slate-400 hover:text-white flex items-center p-0 h-auto mb-2"
                            >
                                Back to Dashboard
                            </Button>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                                <TeamOutlined className="text-blue-500" />
                                <span>Organization Teams</span>
                            </h1>
                            <p className="text-slate-400 text-xs">
                                Oversee and manage the active team rosters and age divisions created under your organization.
                            </p>
                        </div>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => navigate("/organization/teams/create")}
                            className="shadow-lg shadow-blue-600/10 shrink-0 uppercase tracking-wider text-xs"
                        >
                            Create Team
                        </Button>
                    </div>

                    {/* Content Section */}
                    {loading ? (
                        <Row gutter={[20, 20]}>
                            {[1, 2, 3].map((n) => (
                                <Col xs={24} sm={12} lg={8} key={n}>
                                    <Card bordered={false} className="border border-white/[0.04]">
                                        <Skeleton active avatar paragraph={{ rows: 3 }} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : teams.length === 0 ? (
                        <div className="py-16 bg-[#0f172a]/20 border border-white/[0.04] rounded-2xl flex flex-col items-center justify-center text-center p-6">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <span className="text-slate-400 text-xs block">
                                        No teams created yet. Get started by creating your first roster!
                                    </span>
                                }
                            >
                                <Button 
                                    type="primary" 
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate("/organization/teams/create")}
                                    className="mt-2 text-xs"
                                >
                                    Create First Team
                                </Button>
                            </Empty>
                        </div>
                    ) : (
                        <Row gutter={[20, 20]}>
                            {teams.map((team) => (
                                <Col xs={24} sm={12} lg={8} key={team._id}>
                                    <Card 
                                        bordered={false} 
                                        className="border border-white/[0.04] bg-[#0f172a]/40 hover:border-blue-500/25 transition-all duration-300 shadow-md h-full flex flex-col justify-between"
                                        title={
                                            <div className="flex items-center space-x-3 py-1">
                                                <Avatar 
                                                    src={team.logo || undefined} 
                                                    icon={!team.logo && <TeamOutlined />} 
                                                    className="bg-blue-600/20 text-blue-400 border border-blue-500/20 shrink-0" 
                                                />
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-bold text-white truncate m-0">{team.teamName}</h3>
                                                    <span className="text-[9px] uppercase tracking-wider font-semibold text-blue-400">
                                                        {team.sport}
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <div className="space-y-4 text-xs">
                                            {/* Description snippet */}
                                            <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 min-h-[54px] m-0">
                                                {team.description || "No description configured for this team roster profile."}
                                            </p>

                                            {/* Category badges */}
                                            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                                                <Badge 
                                                    count={team.ageCategory} 
                                                    color="#2563eb" 
                                                    className="font-bold text-[10px]"
                                                />
                                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                                                    Age Division
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>

            </div>
        </ConfigProvider>
    );
}

export default TeamsList;
