import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, Table, Spin, Empty, Button, Tag, Avatar } from "antd";
import { BarChartOutlined, TrophyOutlined, UserOutlined } from "@ant-design/icons";
import api from "../../../api/axios";

function TeamPerformance() {
    const { teamData } = useOutletContext(); // Retrieve team detail state
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const columns = [
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Athlete</span>,
            dataIndex: "athleteId",
            key: "athlete",
            render: (athlete) => (
                <div className="flex items-center space-x-2">
                    <Avatar size="small" icon={<UserOutlined />} className="bg-blue-600" />
                    <span className="text-xs font-bold text-white">{athlete?.userId?.name || "Squad Player"}</span>
                </div>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Sport Category</span>,
            dataIndex: "sport",
            key: "sport",
            render: (sport) => (
                <Tag color={sport?.toLowerCase() === "football" ? "blue" : "gold"} className="m-0 border-0 font-bold uppercase text-[9px]">
                    {sport}
                </Tag>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Match Stats Recorded</span>,
            dataIndex: "stats",
            key: "stats",
            render: (stats) => (
                <div className="flex flex-wrap gap-1">
                    {Object.entries(stats || {}).map(([key, val]) => (
                        <Tag key={key} color="blue" className="m-0 border-0 font-bold text-[9px] uppercase">
                            {key}: {val}
                        </Tag>
                    ))}
                </div>
            )
        },
        {
            title: <span className="text-xs uppercase font-bold text-slate-400">Recorded On</span>,
            dataIndex: "createdAt",
            key: "date",
            render: (date) => <span className="text-xs text-slate-400 font-semibold">{date ? new Date(date).toLocaleDateString() : "N/A"}</span>
        }
    ];

    return (
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center space-x-2">
                        <BarChartOutlined className="text-blue-500" />
                        <span>Squad Performance</span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Review statistical updates, logs, and game metrics of active players.</p>
                </div>
                <Button onClick={fetchPerformances} type="dashed" size="small" className="hover:border-blue-500 hover:text-blue-400 text-xs">
                    Refresh Stats
                </Button>
            </div>

            {/* List */}
            {loading ? (
                <div className="py-16 flex justify-center"><Spin size="large" /></div>
            ) : performances.length === 0 ? (
                <Card bordered={false} className="border border-white/[0.04] bg-[#0f172a]/25 py-16 text-center">
                    <Empty description={<span className="text-slate-400 text-xs">No performance entries recorded for team players yet. Matches matches will update roster statistics here!</span>} />
                </Card>
            ) : (
                <Table 
                    columns={columns}
                    dataSource={performances.map(p => ({ ...p, key: p._id }))}
                    className="custom-table border border-white/[0.04] bg-[#0f172a]/30 rounded-xl overflow-hidden shadow-md"
                />
            )}

        </main>
    );
}

export default TeamPerformance;
