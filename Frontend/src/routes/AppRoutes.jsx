import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth Components
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

// Public Page
import Home from "../features/home/pages/Home";

// Shared Protected Detail Views
import TournamentDetails from "../features/tournament/pages/TournamentDetails";
import MatchDetails from "../features/match/pages/MatchDetails";

// Athlete Pages & Layout
import AthleteLayout from "../layouts/AthleteLayout";
import CreateProfile from "../features/athlete/pages/CreateProfile";
import AthleteDashboard from "../features/athlete/pages/AthleteDashboard";
import MyTeams from "../features/athlete/pages/MyTeams";
import AthleteRecruitmentDrives from "../features/athlete/pages/RecruitmentDrives";
import MyApplications from "../features/athlete/pages/MyApplications";
import AthletePerformance from "../features/athlete/pages/AthletePerformance";
import AthleteSettings from "../features/athlete/pages/AthleteSettings";

// Organization Pages & Layout
import OrganizationLayout from "../layouts/OrganizationLayout";
import CreateOrgProfile from "../features/organization/pages/CreateOrgProfile";
import OrganizationDashboard from "../features/organization/pages/OrganizationDashboard";
import TeamsList from "../features/organization/pages/TeamsList";
import CreateTeam from "../features/organization/pages/CreateTeam";
import TournamentManagement from "../features/organization/pages/TournamentManagement";
import CreateTournament from "../features/organization/pages/CreateTournament";
import MatchManagement from "../features/organization/pages/MatchManagement";
import OrgRecruitmentList from "../features/organization/pages/OrgRecruitmentList";
import OrgAnalytics from "../features/organization/pages/OrgAnalytics";
import OrgSettings from "../features/organization/pages/OrgSettings";
import PerformanceEntry from "../features/organization/pages/PerformanceEntry";
import BulkPerformanceEntry from "../features/organization/pages/BulkPerformanceEntry";

// Team Pages & Layout
import TeamLayout from "../layouts/TeamLayout";
import TeamDashboard from "../features/team/pages/TeamDashboard";
import TeamProfile from "../features/team/pages/TeamProfile";
import CreateRecruitmentDrive from "../features/team/pages/CreateRecruitmentDrive";
import TeamRecruitmentDrives from "../features/team/pages/RecruitmentDrives";
import TeamApplications from "../features/team/pages/TeamApplications";
import TeamRoster from "../features/team/pages/TeamRoster";
import TeamPerformance from "../features/team/pages/TeamPerformance";
import TeamSettings from "../features/team/pages/TeamSettings";

// Dashboard Redirector Component (centralized role-based routing)
const DashboardRedirector = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate("/login", { replace: true });
            return;
        }

        const { role, isProfileCompleted } = user;

        if (role === "athlete") {
            if (isProfileCompleted) {
                navigate("/athlete/dashboard", { replace: true });
            } else {
                navigate("/athlete/profile", { replace: true });
            }
        } else if (role === "organization") {
            if (isProfileCompleted) {
                navigate("/organization/dashboard", { replace: true });
            } else {
                navigate("/organization/profile", { replace: true });
            }
        } else if (role === "team") {
            navigate("/team/dashboard", { replace: true });
        } else {
            navigate("/", { replace: true });
        }
    }, [user, isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-[#080b11] flex flex-col items-center justify-center text-white font-sans">
            <span className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
            <p className="text-sm text-slate-400 tracking-wide">Loading workspace...</p>
        </div>
    );
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (Accessible to any authenticated user) */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardRedirector />
                    </ProtectedRoute>
                }
            />

            {/* Shared Detail Views (requires auth) */}
            <Route
                path="/tournament/:tournamentId"
                element={
                    <ProtectedRoute>
                        <TournamentDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/match/:matchId"
                element={
                    <ProtectedRoute>
                        <MatchDetails />
                    </ProtectedRoute>
                }
            />

            {/* Athlete Role Routes */}
            <Route
                path="/athlete/profile"
                element={
                    <RoleProtectedRoute allowedRole="athlete">
                        <CreateProfile />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/athlete"
                element={
                    <RoleProtectedRoute allowedRole="athlete">
                        <AthleteLayout />
                    </RoleProtectedRoute>
                }
            >
                <Route index element={<AthleteDashboard />} />
                <Route path="dashboard" element={<AthleteDashboard />} />
                <Route path="teams" element={<MyTeams />} />
                <Route path="recruitment" element={<AthleteRecruitmentDrives />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="performance" element={<AthletePerformance />} />
                <Route path="settings" element={<AthleteSettings />} />
            </Route>

            {/* Organization Role Routes */}
            <Route
                path="/organization/profile"
                element={
                    <RoleProtectedRoute allowedRole="organization">
                        <CreateOrgProfile />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/organization"
                element={
                    <RoleProtectedRoute allowedRole="organization">
                        <OrganizationLayout />
                    </RoleProtectedRoute>
                }
            >
                <Route index element={<OrganizationDashboard />} />
                <Route path="dashboard" element={<OrganizationDashboard />} />
                <Route path="teams" element={<TeamsList />} />
                <Route path="teams/create" element={<CreateTeam />} />
                <Route path="tournaments" element={<TournamentManagement />} />
                <Route path="tournaments/create" element={<CreateTournament />} />
                <Route path="matches" element={<MatchManagement />} />
                <Route path="recruitment" element={<OrgRecruitmentList />} />
                <Route path="analytics" element={<OrgAnalytics />} />
                <Route path="settings" element={<OrgSettings />} />
                <Route path="performance/single" element={<PerformanceEntry />} />
                <Route path="performance/bulk" element={<BulkPerformanceEntry />} />
            </Route>

            {/* Team Role Routes */}
            <Route
                path="/team"
                element={
                    <RoleProtectedRoute allowedRole="team">
                        <TeamLayout />
                    </RoleProtectedRoute>
                }
            >
                <Route index element={<TeamDashboard />} />
                <Route path="dashboard" element={<TeamDashboard />} />
                <Route path="profile" element={<TeamProfile />} />
                <Route path="recruitment" element={<TeamRecruitmentDrives />} />
                <Route path="recruitment/create" element={<CreateRecruitmentDrive />} />
                <Route path="applications" element={<TeamApplications />} />
                <Route path="roster" element={<TeamRoster />} />
                <Route path="performance" element={<TeamPerformance />} />
                <Route path="settings" element={<TeamSettings />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;