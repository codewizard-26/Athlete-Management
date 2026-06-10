import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import roleMiddleware from '../../middleware/role.middleware.js';
import Team from '../team/team.model.js';
import TeamMembership from '../team/teamMembership.model.js';
import Athlete from '../athlete/athlete.model.js';
import Performance from '../performance/performance.model.js';
import RecruitmentApplication from '../recruiter/recruitmentApplication.model.js';
import Organization from '../organization/organization.model.js';
import Tournament from '../tournament/tournament.model.js';
import Match from '../match/match.model.js';
import RecruitmentDrive from '../recruiter/recruitmentDrive.model.js';

const router = express.Router();

router.get("/team", authMiddleware, async (req, res) => {
    try {
        const team = await Team.findOne({
            userId: req.user.id
        });

        if (!team) {
            return res.status(200).json({
                members: 0,
                pendingRequests: 0
            });
        }

        const members = await TeamMembership.countDocuments({
            teamId: team._id,
            status: "active"
        });

        const pendingRequests = await TeamMembership.countDocuments({
            teamId: team._id,
            status: "pending"
        });

        return res.status(200).json({
            members,
            pendingRequests
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/athlete", authMiddleware, async (req, res) => {
    try {
        const athlete = await Athlete.findOne({
            userId: req.user.id
        });

        if (!athlete) {
            return res.status(200).json({
                matches: 0,
                teams: 0,
                applications: 0,
                records: 0,
                activities: []
            });
        }

        const matches = await Performance.countDocuments({
            athleteId: athlete._id
        });

        const teams = await TeamMembership.countDocuments({
            athleteId: athlete._id,
            status: "active"
        });

        const applications = await RecruitmentApplication.countDocuments({
            athleteId: athlete._id
        });

        // Fetch actual activities
        const recentApplications = await RecruitmentApplication.find({ athleteId: athlete._id })
            .populate({
                path: 'recruitmentDriveId',
                select: 'title',
                populate: { path: 'teamId', select: 'teamName' }
            })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentMemberships = await TeamMembership.find({ athleteId: athlete._id })
            .populate({ path: 'teamId', select: 'teamName' })
            .sort({ createdAt: -1 })
            .limit(5);

        const activities = [];

        recentApplications.forEach(app => {
            if (app.recruitmentDriveId) {
                activities.push({
                    id: app._id,
                    type: 'application',
                    title: `Applied to ${app.recruitmentDriveId.title}`,
                    description: `Scouting application status is ${app.status}`,
                    date: app.createdAt || app.appliedAt
                });
            }
        });

        recentMemberships.forEach(mem => {
            if (mem.teamId) {
                activities.push({
                    id: mem._id,
                    type: 'team',
                    title: `${mem.status === 'active' ? 'Joined' : 'Requested to join'} ${mem.teamId.teamName}`,
                    description: mem.status === 'active' ? `Approved as player` : `Membership request pending`,
                    date: mem.joinedAt || mem.createdAt
                });
            }
        });

        activities.push({
            id: athlete._id + '_profile',
            type: 'profile',
            title: 'Completed Athlete Profile',
            description: 'Added biometrics, country registry, and player roles',
            date: athlete.createdAt
        });

        // Sort by date descending
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.status(200).json({
            matches,
            teams,
            applications,
            records: matches, // Use matches count for performance records
            activities: activities.slice(0, 5) // Limit to top 5
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/organization", authMiddleware, roleMiddleware("organization"), async (req, res) => {
    try {
        const organization = await Organization.findOne({
            ownerId: req.user.id
        });

        if (!organization) {
            return res.status(200).json({
                teamsCount: 0,
                recruitmentCount: 0,
                tournamentsCount: 0,
                matchesCount: 0,
                activities: []
            });
        }

        const teamsCount = await Team.countDocuments({
            organizationId: organization._id
        });

        const tournamentsCount = await Tournament.countDocuments({
            organizationId: organization._id
        });

        const teams = await Team.find({ organizationId: organization._id }, '_id');
        const teamIds = teams.map(t => t._id);

        const recruitmentCount = await RecruitmentDrive.countDocuments({
            teamId: { $in: teamIds },
            status: "open"
        });

        const tournaments = await Tournament.find({ organizationId: organization._id }, '_id');
        const tournamentIds = tournaments.map(t => t._id);

        const matchesCount = await Match.countDocuments({
            tournamentId: { $in: tournamentIds }
        });

        // Fetch recent activities
        const recentTeams = await Team.find({ organizationId: organization._id })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentDrives = await RecruitmentDrive.find({ teamId: { $in: teamIds } })
            .populate({ path: 'teamId', select: 'teamName' })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentTournaments = await Tournament.find({ organizationId: organization._id })
            .sort({ createdAt: -1 })
            .limit(5);

        const activities = [];

        recentTeams.forEach(team => {
            activities.push({
                id: team._id,
                type: 'team',
                title: `Created Team: ${team.teamName}`,
                description: `Sport: ${team.sport.toUpperCase()} • Category: ${team.ageCategory}`,
                date: team.createdAt
            });
        });

        recentDrives.forEach(drive => {
            activities.push({
                id: drive._id,
                type: 'recruitment',
                title: `Launched Recruitment Drive: ${drive.title}`,
                description: `Team: ${drive.teamId?.teamName || 'Unknown'} • Vacancies: ${drive.vacancies || 0}`,
                date: drive.createdAt
            });
        });

        recentTournaments.forEach(tour => {
            activities.push({
                id: tour._id,
                type: 'tournament',
                title: `Scheduled Tournament: ${tour.name}`,
                description: `Location: ${tour.location} • Status: ${tour.status.toUpperCase()}`,
                date: tour.createdAt
            });
        });

        // Sort by date descending
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.status(200).json({
            teamsCount,
            recruitmentCount,
            tournamentsCount,
            matchesCount,
            activities: activities.slice(0, 6) // limit to top 6 activities
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

export default router;