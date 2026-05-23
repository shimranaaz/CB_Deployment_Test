import mongoose, { Schema } from 'mongoose';
const coverLetterSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Cover Letter'
    },
    contact_info: {
        full_name: String,
        phone: String,
        email: String,
        linkedin: String,
        city: String,
        state: String,
        postal_code: String,
        date: String
    },
    recipient_info: {
        manager_name: String,
        job_title: String,
        company_name: String,
        company_address: String,
        city: String,
        state: String,
        postal_code: String
    },
    opening: {
        position_title: String,
        how_found: String,
        summary: String
    },
    body: {
        skill_1: String,
        skill_2: String,
        experience_summary: String,
        why_company: String
    },
    closing: {
        enthusiasm: String,
        next_step: String,
        sign_off: String
    },
    header_color: {
        type: String,
        default: '#2c2a63'
    }
}, {
    timestamps: true
});
const CoverLetter = mongoose.model('CoverLetter', coverLetterSchema);
export default CoverLetter;
