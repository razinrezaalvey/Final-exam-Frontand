// Set your FastAPI backend URL in the .env file as VITE_API_URL.
export const baseUrl =
  import.meta.env.VITE_API_URL || 'https://final-exam-backend-2a39.onrender.com';

export default baseUrl;
