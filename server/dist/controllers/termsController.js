import Terms from "../models/Terms.js";
// ==================== GET ALL TERMS (PUBLIC) ====================
export const getAllTerms = async (req, res) => {
    try {
        const terms = await Terms.find().sort({ section: 1 });
        res.status(200).json({
            success: true,
            terms,
        });
    }
    catch (error) {
        console.error("Get Terms Error:", error);
        res.status(500).json({ message: error.message || "Failed to fetch terms" });
    }
};
// ==================== GET SINGLE TERM (PUBLIC) ====================
export const getTerm = async (req, res) => {
    try {
        const { section } = req.params;
        const term = await Terms.findOne({ section });
        if (!term) {
            res.status(404).json({ message: "Term not found" });
            return;
        }
        res.status(200).json({
            success: true,
            term,
        });
    }
    catch (error) {
        console.error("Get Term Error:", error);
        res.status(500).json({ message: error.message || "Failed to fetch term" });
    }
};
// ==================== UPDATE TERM (ADMIN ONLY) ====================
export const updateTerm = async (req, res) => {
    try {
        const { section } = req.params;
        const { content } = req.body;
        const userId = req.userId;
        if (!content) {
            res.status(400).json({ message: "Content is required" });
            return;
        }
        // Find and update, or create if doesn't exist
        const term = await Terms.findOneAndUpdate({ section }, {
            content,
            lastUpdated: new Date(),
            updatedBy: userId,
        }, {
            new: true,
            upsert: true,
            runValidators: true,
        });
        console.log(`✅ Term "${section}" updated by admin`);
        res.status(200).json({
            success: true,
            message: "Term updated successfully",
            term,
        });
    }
    catch (error) {
        console.error("Update Term Error:", error);
        res.status(500).json({ message: error.message || "Failed to update term" });
    }
};
// ==================== INITIALIZE DEFAULT TERMS (ADMIN ONLY) ====================
export const initializeTerms = async (req, res) => {
    try {
        const defaultTerms = [
            {
                section: "Terms of Service",
                content: `Career Blueprint provides AI-powered resume creation, resume enhancement, and career support tools.

By creating an account and using our services, users agree to abide by all platform rules and guidelines.

Users must provide accurate and honest information while creating a profile and uploading resumes.

Users are responsible for maintaining confidentiality of their account login credentials.

The AI-generated resume content is created based on user input and uploaded files; users are responsible for reviewing and finalizing it.

Career Blueprint reserves the right to suspend or terminate accounts that violate terms or engage in fraudulent activities.

Users agree not to misuse the platform for illegal activities, spam, or harassment.`,
            },
            {
                section: "Privacy & Data Protection Policy",
                content: `We highly value user privacy and are committed to protecting personal and professional information.

We collect only necessary data to provide services—such as name, email, login credentials, and resume details.

All user data is stored securely and is accessed only for service delivery and platform improvement.

We do not sell or share user data with third parties without explicit consent, except as required by law.

Users have the right to request data deletion or download their personal information at any time.

We use industry-standard encryption and security measures to protect user data from unauthorized access.`,
            },
            {
                section: "Information Collection & Usage",
                content: `We collect the following types of information:
- Personal Information: Name, email address, phone number, and login credentials
- Professional Information: Resume data, work experience, education, skills, and career preferences
- Usage Data: How you interact with our platform, features used, and time spent
- Payment Information: Billing details for subscription plans (securely processed through third-party payment gateways)

This information is used to:
- Provide and improve our AI-powered resume building services
- Personalize your experience and provide relevant recommendations
- Process payments and manage subscriptions
- Send important updates, notifications, and support communications
- Analyze platform usage to enhance features and user experience`,
            },
            {
                section: "Your Rights & Control Over Data",
                content: `You have complete control over your personal data:

Right to Access: You can request a copy of all personal data we hold about you at any time.

Right to Correction: You can update or correct your information through your account settings or by contacting support.

Right to Deletion: You can request permanent deletion of your account and all associated data. Note that some data may be retained for legal or security purposes.

Right to Data Portability: You can download your resume data and export it in standard formats.

Right to Opt-Out: You can unsubscribe from marketing emails and notifications at any time.

To exercise these rights, contact our support team at support@careerblueprint.com`,
            },
            {
                section: "Subscription & Billing Terms",
                content: `Career Blueprint offers multiple subscription plans:

Free Plan: Access to basic resume creation features with limited templates.

Basic Plan: Enhanced features with more templates and AI assistance.

Advanced Plan: Premium templates, advanced AI tools, and priority support.

Professional Plan: All features unlocked, unlimited resumes, and personalized career coaching.

Billing & Payment:
- Subscriptions are billed monthly or annually based on your selection
- Payments are processed securely through Razorpay or other trusted payment gateways
- You can upgrade, downgrade, or cancel your plan at any time from account settings
- Refunds are handled according to our Cancellation & Refund Policy`,
            },
            {
                section: "Support & Contact Details",
                content: `We are here to help you succeed in your career journey.

Customer Support:
- Email: support@careerblueprint.com
- Response Time: Within 24-48 hours for general inquiries
- Priority Support: Available for Professional Plan subscribers

Technical Issues:
- Report bugs or technical problems through the in-app feedback form
- Our team works to resolve issues as quickly as possible

Career Guidance:
- Professional Plan users get access to one-on-one career coaching sessions
- Schedule consultations through your dashboard

General Inquiries:
- For partnership, business, or media inquiries: contact@careerblueprint.com`,
            },
            {
                section: "Cancellation & Refund Policy",
                content: `Cancellation:
- You can cancel your subscription at any time from your account settings
- Upon cancellation, you will retain access until the end of your current billing period
- No automatic renewal will occur after cancellation
- You can reactivate your subscription anytime

Refund Policy:
- Full refund available within 7 days of purchase if no significant usage has occurred
- Refunds for annual plans are prorated based on unused months
- One-time template purchases are non-refundable after download
- Refund requests can be submitted through support@careerblueprint.com

Processing Time:
- Approved refunds are processed within 7-10 business days
- Refunds are credited to the original payment method`,
            },
            {
                section: "Digital Delivery Policy",
                content: `All Career Blueprint services are delivered digitally:

Resume Templates:
- Instantly accessible upon purchase or subscription activation
- Available for download in PDF, DOCX, and editable formats
- Lifetime access to purchased templates even after subscription ends

AI-Generated Content:
- Resume enhancements and AI suggestions are delivered in real-time
- All generated content is saved automatically to your account

Account Access:
- Login credentials are sent via email upon successful registration
- Access to dashboard and features is immediate after payment confirmation

Technical Requirements:
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- PDF reader for downloading resumes

No physical products are shipped. All services are cloud-based and accessible from any device.`,
            },
            {
                section: "AI & Data Privacy Commitment",
                content: `Career Blueprint uses advanced AI technology to enhance your resume and career prospects. We are committed to responsible AI usage and data privacy:

AI Technology:
- Our AI analyzes your resume to provide intelligent suggestions and improvements
- All AI processing is done securely on our servers with encrypted data
- We do not train our AI models on your personal resume data without explicit consent

Data Privacy:
- Your resume data is never shared with third-party AI providers
- We implement strict access controls to protect your information
- AI-generated suggestions are created in isolated, secure environments

Transparency:
- You have full control over which AI suggestions to accept or reject
- All AI-enhanced content is clearly marked in your dashboard
- We regularly update our AI models to improve accuracy and fairness

Ethical AI:
- Our AI is designed to be unbiased and provide equal opportunities to all users
- We continuously monitor and improve AI outputs to prevent discriminatory suggestions
- Your feedback helps us make our AI more helpful and ethical`,
            },
        ];
        const promises = defaultTerms.map((term) => Terms.findOneAndUpdate({ section: term.section }, term, { upsert: true, new: true }));
        await Promise.all(promises);
        res.status(200).json({
            success: true,
            message: "Default terms initialized successfully",
        });
    }
    catch (error) {
        console.error("Initialize Terms Error:", error);
        res.status(500).json({ message: error.message || "Failed to initialize terms" });
    }
};
