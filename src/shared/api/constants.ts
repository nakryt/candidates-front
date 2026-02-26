const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!apiUrl) {
  throw new Error(
    "VITE_API_URL environment variable is not set. " +
    "Create a .env file with VITE_API_URL=http://localhost:3001/api"
  );
}

export const API_URL = apiUrl;
// export const API_URL = "https://candidates-api-production.up.railway.app/api";
