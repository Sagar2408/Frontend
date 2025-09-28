import axios from "axios";

const API_BASE_URL = "https://crm-backend1-2bru.onrender.com/api";

const payrollService = axios.create({
  baseURL:"https://crm-backend1-2bru.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

// ✅ Automatically attach token to requests (if available)
payrollService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ONLY executive/admin token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // Remove malformed header
    }

    // 🔥 Add x-company-id (hardcoded or from localStorage)
    config.headers["x-company-id"] = "5cece72e-9b8e-11f0-b48b-3c5282470eb6"; // Hardcoded
    // Or use:
    // config.headers["x-company-id"] = localStorage.getItem("Company-Id") || "1";

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Generate payroll for an executive
export const generateExecutivePayroll = async (payload) => {
  try {
    const response = await payrollService.post("/payroll/executive", payload);
    return response.data;
  } catch (error) {
    console.error("❌ Payroll generation failed:", error.response?.data || error.message);
    throw error.response?.data || { error: "Unknown error occurred" };
  }
};

// ✅ Get payroll for a single executive (usually self)
export const getPayrollForExecutive = async () => {
  try {
    const response = await payrollService.get("/payroll/one");
    return response.data;
  } catch (error) {
    console.error("❌ Fetching executive payroll failed:", error.response?.data || error.message);
    throw error.response?.data || { error: "Unknown error occurred" };
  }
};

// ✅ Get payroll by filters (e.g., user_id, month, date range)
export const getPayrollByFilters = async (filters) => {
  try {
    const response = await payrollService.get("/payroll/filter", { params: filters });
    return response.data;
  } catch (error) {
    console.error("❌ Fetching filtered payroll failed:", error.response?.data || error.message);
    throw error.response?.data || { error: "Unknown error occurred" };
  }
};
