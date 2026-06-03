import mongoose from 'mongoose';

const recruiterBookmarkSchema = new mongoose.Schema(
    {
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        athleteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Athlete',
            required: true
        }
    },
    { timestamps: true }
);

recruiterBookmarkSchema.index(
    {
        recruiterId: 1,
        athleteId: 1
    },
    {
        unique: true
    }
);

const RecruiterBookmark = mongoose.model(
    'RecruiterBookmark',
    recruiterBookmarkSchema
);

export default RecruiterBookmark;