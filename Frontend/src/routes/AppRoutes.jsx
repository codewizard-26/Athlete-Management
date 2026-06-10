import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Home from "../features/home/pages/Home";
import CreateProfile from "../features/athlete/pages/CreateProfile";
import CreateOrgProfile from "../features/organization/pages/CreateOrgProfile";
import AthleteDashboard from "../features/athlete/pages/AthleteDashboard";
import OrganizationDashboard from "../features/organization/pages/OrganizationDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

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
                navigate("/athlete/profile/create", { replace: true });
            }
        } else if (role === "organization") {
            if (isProfileCompleted) {
                navigate("/organization/dashboard", { replace: true });
            } else {
                navigate("/organization/profile/create", { replace: true });
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


const TeamDashboard = () => (
    <div className="min-h-screen bg-[#080b11] text-white p-8">
        <h1 className="text-2xl font-bold">Team Workspace</h1>
        <p className="text-emerald-400 mt-2">Protected page accessible to Teams only.</p>
    </div>
);

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

            {/* Role-Based Protected Routes */}
            <Route
                path="/athlete/profile/create"
                element={
                    <RoleProtectedRoute allowedRole="athlete">
                        <CreateProfile />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/athlete/*"
                element={
                    <RoleProtectedRoute allowedRole="athlete">
                        <AthleteDashboard />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/organization/profile/create"
                element={
                    <RoleProtectedRoute allowedRole="organization">
                        <CreateOrgProfile />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/organization/*"
                element={
                    <RoleProtectedRoute allowedRole="organization">
                        <OrganizationDashboard />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/team/*"
                element={
                    <RoleProtectedRoute allowedRole="team">
                        <TeamDashboard />
                    </RoleProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;