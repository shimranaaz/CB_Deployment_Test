import Groq from "groq-sdk";
if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY is not set in environment variables');
    console.error('Please add GROQ_API_KEY to your .env file');
    console.error('Get your API key from: https://console.groq.com/');
    process.exit(1);
}
// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
console.log('✅ Groq AI initialized successfully');
export default groq;
