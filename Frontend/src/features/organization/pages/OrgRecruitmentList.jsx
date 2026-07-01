import React, { useState, useEffect } from "react";
import { Card, Table, Tag, Spin, Empty, Button, message } from "antd";
import { NotificationOutlined, EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

function OrgRecruitmentList() {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [drivesRes, teamsRes] = await Promise.all([
                api.get("/recruitment/all"),
                api.get("/team/myTeams")
            ]);
            
            const myTeamIds = (teamsRes.data || []).map(t => t._id);
            
            // Filter drives belonging to my organization's teams
            const filtered = (drivesRes.data || []).filter(drive => 
                drive.teamId && myTeamIds.includes(drive.teamId._id || drive.teamId)
            );
            setDrives(filtered);
        } catch (err) {
            console.error("Error loading recruitment drives:", err);
            message.error("Failed to load recruitment data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: "CAMPAIGN TITLE",
            key: "title",
            render: (_, record) => (
                <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-text-primary">{record.title}</p>
                    <p className="text-[10px] text-text-secondary">Team: {record.teamId?.teamName || "N/A"}</p>
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
            title: "AGE CATEGORY",
            dataIndex: "ageCategory",
            key: "ageCategory",
            render: (v) => <span className="text-xs font-semibold text-text-secondary">{v}</span>
        },
        {
            title: "SPOTS",
            dataIndex: "vacancies",
            key: "vacancies",
            render: (v) => <span className="text-xs text-brand-primary font-semibold font-mono">{v || 0} Open</span>
        },
        {
            title: "TRIAL VENUE",
            dataIndex: "location",
            key: "location",
            render: (loc) => (
                <span className="text-xs text-text-secondary flex items-center">
                    <EnvironmentOutlined className="mr-1.5 text-text-secondary/50 text-[10px]" />
                    {loc}
                </span>
            )
        },
        {
            title: "DEADLINE",
            dataIndex: "applicationDeadline",
            key: "deadline",
            render: (date) => (
                <span className="text-xs text-text-secondary flex items-center">
                    <CalendarOutlined className="mr-1.5 text-brand-primary text-[10px]" />
                    {date ? new Date(date).toLocaleDateString() : "N/A"}
                </span>
            )
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                    <h1 className="text-lg font-bold text-text-primary tracking-tight flex items-center space-x-2">
                        <NotificationOutlined className="text-brand-primary" />
                        <span>Recruitment Tracker</span>
                    </h1>
                    <p className="text-xs text-text-secondary mt-0.5">Review active talent searches and player vacancies across all affiliated teams.</p>
                </div>
                <Button 
                    onClick={fetchData} 
                    type="text" 
                    size="small" 
                    className="text-xs text-brand-primary hover:text-brand-primary-hover font-medium cursor-pointer"
                >
                    Sync Campaigns
                </Button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center">
                    <Spin size="middle" />
                    <p className="text-xs text-text-secondary mt-3">Syncing recruitment registries...</p>
                </div>
            ) : drives.length === 0 ? (
                <Card bordered={false} className="border border-border-subtle bg-bg-surface py-16 text-center shadow-sm rounded-xl">
                    <Empty description={<span className="text-text-secondary text-xs">No active recruitment drives created by your teams.</span>} />
                </Card>
            ) : (
                <Table 
                    columns={columns}
                    dataSource={drives.map(d => ({ ...d, key: d._id }))}
                    className="custom-table border border-border-subtle bg-bg-surface rounded-xl overflow-hidden shadow-sm"
                    pagination={{ pageSize: 8 }}
                    size="small"
                />
            )}

        </div>
    );
}

export default OrgRecruitmentList;
