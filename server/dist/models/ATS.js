import mongoose, { Schema } from 'mongoose';
const ATSSchema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
    },
    mobile: {
        type: String,
        required: false,
        trim: true,
        default: 'Not provided'
    },
    resumePath: {
        type: String,
        required: [true, 'Resume file path is required'],
    },
    atsScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    detailedReport: {
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    },
    jobDescription: {
        type: String,
        required: false,
        default: null
    },
    feedback: {
        strengths: {
            type: [String],
            default: []
        },
        improvements: {
            type: [String],
            default: []
        },
        suggestions: {
            type: [String],
            default: []
        }
    }
}, {
    timestamps: true,
});
const ATS = mongoose.model('ATS', ATSSchema);
export default ATS;
