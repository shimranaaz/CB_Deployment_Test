import dummy_profile from './dummy_profile.png'

interface PersonalInfo {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    profession: string;
    image: string;
}

interface Experience {
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
    is_current: boolean;
    _id: string;
}

interface Education {
    institution: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string;       // ✅ FIXED (was graduation_date)
    is_current: boolean;    // ✅ NEW (needed to show "Present")
    gpa: string;
    _id: string;
}

interface Project {
    name: string;
    type: string;
    description: string;
    _id: string;
}

interface Resume {
    personal_info: PersonalInfo;
    _id: string;
    userId: string;
    title: string;
    public: boolean;
    professional_summary: string;
    skills: string[];
    experience: Experience[];
    education: Education[];
    template: string;
    accent_color: string;
    project: Project[];
    updatedAt: string;
    createdAt: string;
}

export const dummyResumeData: Resume[] = [
    {
        personal_info: {
            full_name: "Alex Smith",
            email: "alex@example.com",
            phone: "0 123456789",
            location: "NY, USA",
            linkedin: "https://www.linkedin.com",
            website: "https://www.example.com",
            profession: "Full Stack Developer",
            image: dummy_profile
        },
        _id: "68d2a31a1c4dd38875bb037e",
        userId: "68c180acdf1775dfd02c6d87",
        title: "Alex's Resume",
        public: true,
        professional_summary: "Highly analytical Data Analyst with 6 years of experience transforming complex datasets into actionable insights using SQL, Python, and advanced visualization tools.",
        skills: ["JavaScript", "React JS", "Full Stack Development", "Git", "GitHub", "NextJS", "Express", "NodeJS", "TypeScript"],
        experience: [
            {
                company: "Example Technologies",
                position: "Senior Full Stack Developer",
                start_date: "2023-06",
                end_date: "",
                description: "Architected and developed full-stack applications.",
                is_current: true,
                _id: "68d2a31a1c4dd38875bb037f"
            }
        ],
        education: [
            {
                institution: "Example Institute of Technology",
                degree: "B.TECH",
                field: "CSE",
                start_date: "2019-06",
                end_date: "2023-05", // ✅ now matches backend
                is_current: false,
                gpa: "8.7",
                _id: "68d2a31a1c4dd38875bb0380"
            }
        ],
        template: "minimal-image",
        accent_color: "#14B8A6",
        project: [
            {
                name: "Team Task Management System",
                type: "Web Application",
                description: "TaskTrackr is a collaborative task system.",
                _id: "68d4f882c8f0d46dc8a8b139"
            }
        ],
        updatedAt: "2025-09-23T13:39:38.395Z",
        createdAt: "2025-09-23T13:39:38.395Z"
    }
];
