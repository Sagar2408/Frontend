import axios from "axios";
const API_BASE_URL = "https://crm-backend1-2bru.onrender.com/api";
const apiService = axios.create({
  baseURL: "https://crm-backend1-2bru.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

// ✅ Automatically attach token to requests (if available)
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ONLY executive/admin token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // Remove malformed header
    }    
    // 🔥 Add x-company-id (hardcoded or from localStorage)
    config.headers["x-company-id"] = "2f8a9845-9c11-11f0-9f2a-a2aa35fea29c"; // Hardcoded
  
    return config;
  },
  (error) => Promise.reject(error)
);

export const updateUserLoginStatus = async (userId, canLogin) => {
  try {
    const response = await apiService.put("/login-status", { userId, canLogin });
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating login status for user ${userId}:`, error);
    throw error;
  }
};

export const getAllConvertedClientsApi = async () => {
  try {
    const response = await apiService.get("/converted"); // 👉 No params
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching all converted leads:", error.response?.data || error.message);
    throw error;
  }
};
// Toggle Manager Login Access
export const toggleManagerLoginAccess = async (managerId, can_login) => {
  return await apiService.post("/manager/toggle-login", { managerId, can_login });
};

// Toggle HR Login Access
export const toggleHrLoginAccess = async (hrId, can_login) => {
  return await apiService.post("/hr/toggle-login", { hrId, can_login });
};

// Toggle Process Person Login Access
export const toggleProcessPersonLoginAccess = async (processPersonId, can_login) => {
  return await apiService.post("/processperson/toggle-login", { processPersonId, can_login });
};

export const toggleTeamLeadLoginAccess = async (userId, can_login) => {
  try {
    const response = await apiService.post("/admin/toggle-login", { userId, can_login });
    return response.data;
  } catch (err) {
    console.error("❌ Error toggling Team Lead login:", err);
    throw err;
  }
};
// ✅ Function to fetch all leads
export const fetchLeadsAPI = async (limit = 10, offset = 0) => {
  try {
    const response = await apiService.get(`/client-leads/getClients?limit=${limit}&offset=${offset}`);
    return response.data; // Return the full response (including leads and pagination metadata)
  } catch (error) {
    console.error("❌ Error fetching leads:", error);
    throw error;
  }
};

// ✅ Function to fetch assigned leads by executive name
export const fetchAssignedLeads = async (executiveName) => {
  try {
    if (!executiveName) {
      console.error("🚨 Executive name is missing!");
      throw new Error("Executive name not provided!");
    }
    const response = await apiService.get(
      `/client-leads/executive?executiveName=${executiveName}`
    );
    return response.data.leads;
  } catch (error) {
    console.error("❌ Error fetching assigned leads:", error);
    throw error;
  }
};
// ✅ Function to fetch leads with status "Follow-Up"
export const fetchFollowUpLeadsAPI = async () => {
  try {
    const response = await apiService.get("/client-leads/followup-leads");
    return response.data.leads || []; // Assuming you're using only the leads array
  } catch (error) {
    console.error("❌ Error fetching follow-up leads:", error);
    throw error;
  }
};

// ✅ Fetch notifications for a specific user (executive)
export const fetchNotificationsByUser = async ({ userId, userRole }) => {
  try {
    const response = await apiService.post(`/notification/user`, {
      userId,
      userRole,
    });
    return response.data.notifications;
  } catch (error) {
    console.error(`❌ Error fetching notifications for user ${userId}:`, error);
    throw error;
  }
};
export const createCopyNotification = async ({ userId, userRole, message }) => {
  try {
    const response = await apiService.post("/notification/copy-event", {
      userId,
      message,
      userRole,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creating copy notification:", error);
    throw error;
  }
};
// ✅ Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiService.put(
      `/notification/mark-read/${notificationId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error marking notification ${notificationId} as read:`,
      error
    );
    throw error;
  }
};

// ✅ Delete a notification
export const deleteNotificationById = async (notificationId) => {
  try {
    const response = await apiService.delete(`/notification/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting notification ${notificationId}:`, error);
    throw error;
  }
};

// ✅ Function to fetch all executives
export const fetchExecutivesAPI = async () => {
  try {
    const response = await apiService.get("/executives");
    return response.data.executives;
  } catch (error) {
    console.error("❌ Error fetching executives:", error);
    throw error;
  }
};
// ✅ Fetch executive details by ID
export const fetchExecutiveInfo = async (executiveId) => {
  try {
    const response = await apiService.get(`/executives/${executiveId}`);
    return response;
  } catch (error) {
    console.error("API error in fetchExecutiveInfo:", error);
    throw error;
  }
};
// ✅ Fetch online executives
export const fetchOnlineExecutives = async () => {
  try {
    const response = await apiService.get("/online");
    return response.data.onlineExecutives;
  } catch (error) {
    console.error("❌ Error fetching online executives:", error);
    throw error;
  }
};

// ✅ Fetch admin profile
export const fetchAdminProfile = async () => {
  try {
    const response = await apiService.get("/admin/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw error;
  }
};

export const updateAdminProfile = async (profileData) => {
  const response = await apiService.put("/admin/profile", profileData);
  return response.data;
};

// Change Password
export const changeAdminPassword = async (currentPassword, newPassword) => {
  const response = await apiService.post("/admin/change_pass", {
    currentPassword,
    newPassword,
  });
  return response.data;
};
// ✅ Function to assign leads to an executive
export const assignLeadAPI = async (leadId, executiveName) => {
  try {
    const response = await apiService.put(
      `/client-leads/assign-executive`,
      {
        id: Number(leadId),       // ✅ Explicitly cast to integer
        executiveName,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error assigning Lead ID ${leadId}:`, error);
    throw error;
  }
};

// ================== 📊 Executive Activity APIs ==================

// ✅ Fetch all executive activities
export const fetchAllExecutivesActivities = async () => {
  try {
    const response = await apiService.get("/executive-activities");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching all executive activities:", error);
    throw error;
  }
};

// ✅ Fetch activity data for a single executive
export const fetchExecutiveActivity = async (executiveId) => {
  try {
    const response = await apiService.get(
      `/executive-activities/${executiveId}`
    );
    
    console.log('✅ API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error fetching activity data for executive ${executiveId}:`,
      error
    );
    throw error;
  }
};

// ✅ Fetch lead section visits for a single executive
export const fetchLeadSectionVisits = async (executiveId) => {
  try {
    const response = await apiService.get(
      `/executive-activities/${executiveId}`
    );
    return response.data.leadSectionVisits;
  } catch (error) {
    console.error(
      `❌ Error fetching lead section visits for executive ${executiveId}:`,
      error
    );
    throw error;
  }
};

// ✅ Create a new lead
export const createLeadAPI = async (leadData) => {
  try {
    const response = await apiService.post("/leads", leadData); 
    return response.data; 
  } catch (error) {
    console.error(
      "❌ Error creating lead:",
      error.response?.data || error.message
    ); 
    throw error; 
  }
};

// ✅ Function to fetch fresh leads for the executive
export const fetchFreshLeads = async () => {
  try {
    const response = await apiService.get("/freshleads"); 
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching fresh leads:", error);
    throw error; 
  }
};

// ✅ Create a new fresh lead
export const createFreshLead = async (leadData) => {
  try {
    const response = await apiService.post("/freshleads", leadData);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating fresh lead:",
      error.response?.data || error.message
    ); 
    throw error;
  }
};
// ✅ Create a follow-up
export const createFollowUp = async (followUpData) => {
  try {
    const response = await apiService.post("/followup/create", followUpData);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating follow-up:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// ✅ Get all follow-ups
export const fetchAllFollowUps = async () => {
  try {
    const response = await apiService.get("/followup/");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching follow-ups:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// ✅ Update a follow-up inside a fresh lead
export const updateFreshLeadFollowUp = async (followUpId, updatedData) => {
  try {
    const response = await apiService.put(
      `/freshleads/update-followup/${followUpId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error updating follow-up ID ${followUpId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
// ✅ Update a follow-up by ID
export const updateFollowUp = async (followUpId, updatedData) => {
  try {
    const response = await apiService.put(
      `/followup/${followUpId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error updating follow-up ID ${followUpId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createFollowUpHistory = async (historyData) => {
  try {
    const response = await apiService.post(
      "/followuphistory/create",
      historyData
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating follow-up history:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Fetch all follow-up histories for an executive
export const fetchFollowUpHistories = async () => {
  try {
    const response = await apiService.get("/followuphistory/");
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching follow-up histories:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchFollowUpHistoryByLeadId = async (freshLeadId) => {
  try {
    const response = await apiService.get(`/followuphistory/${freshLeadId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching follow-up history:", error);
    throw error;
  }
};
// ✅ Fetch user settings (GET)
export const fetchUserSettings = async () => {
  try {
    const response = await apiService.get("/settings"); 
    return response.data; 
  } catch (error) {
    console.error("❌ Error fetching user settings:", error);
    throw error; 
  }
};

// ✅ Update user settings (PUT)
export const updateUserSettings = async (updatedSettings) => {
  try {
    const response = await apiService.put("/settings", updatedSettings); 
    return response.data; 
  } catch (error) {
    console.error("❌ Error updating user settings:", error);
    throw error; 
  }
};
export const fetchMeetings = async () => {
  try {
    const response = await apiService.get("/meetings/exec");
    return response.data.data; 
  } catch (error) {
    console.error("❌ Error fetching meetings:", error.response?.data || error.message);
    throw error;
  }
};

export const createMeetingAPI = (meetingData) =>
  apiService.post("/meetings", meetingData).then(res => res.data);

// ✅ Create a new converted client (using fresh_lead_id)
export const createConvertedClient = async (convertedData) => {
  try {
    const response = await apiService.post("/converted", convertedData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating converted client:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch converted clients dynamically based on executiveId or username
export const fetchConvertedClients = async (executiveId = null) => {
  try {
    // const endpoint = executiveId ? '/converted/exec' : '/converted';
    const response = await apiService.get("/converted/exec", {
      headers: executiveId ? { 'x-executive-id': executiveId } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching converted clients:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Function to create a Close Lead (POST)
export const createCloseLead = async (closeLeadData) => {
  try {
    const response = await apiService.post("/close-leads/", {
      ...closeLeadData,
      clientLead: closeLeadData.clientLead, 
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creating close lead:", error.response?.data || error.message);
    throw error;
  }
};

// Function to fetch all close leads
export const fetchAllCloseLeads = async () => {
  try {
    const response = await apiService.get("/close-leads/"); // 👉 No params
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching all close leads:", error.response?.data || error.message);
    throw error;
  }
};

export const adminMeeting = async () => {
  try {
    const response = await apiService.get("/meetings");
    if (response && response.data && response.data.meetings) {
      return response.data.meetings;  // Ensure we are returning meetings data
    } else {
      console.error("Error: Meetings data is not available in the correct format:", response.data);
      return [];  // Return an empty array if data is not valid
    }
  } catch (error) {
    console.error("❌ Error fetching admin meetings:", error.response?.data || error.message);
    throw error;  // Ensure errors are thrown to handle them in the component
  }
};

// ✅ Fetch executive activity summary for admin dashboard
export const fetchAdminExecutiveDashboard = async () => {
  try {
    const response = await apiService.get("/executive-activities/adminDashboard");
    return response.data.executives; // returns array of executives with activity data
  } catch (error) {
    console.error("❌ Error fetching admin executive dashboard data:", error);
    throw error;
  }
};

// ✅ Fetch revenue chart data
export const fetchRevenueChartData = async () => {
  try {
    const response = await apiService.get("/revenue/revenue-data");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching revenue chart data:", error);
    throw error;
  }
};
export const fetchDealFunnelData = async (executiveId = null) => {
  try {
    const url = executiveId
      ? `/client-leads/dealfunnel?executiveId=${executiveId}`
      : "/client-leads/dealfunnel";
    const response = await apiService.get(url);
    return response.data.data; // Returns { statusCounts, totalLeads }
  } catch (error) {
    console.error("❌ Error fetching deal funnel data:", error);
    throw error;
  }
};

//Reassigned Leads 
export const reassignLead = async (clientLeadId, newExecutive) => {
  try {
    const response = await apiService.put(`leads/reassign`, {
      clientLeadId: Number(clientLeadId),
      newExecutive,
    });
    return response.data;
  } catch (error) {
    console.error("Error in reassignLead API:", error);
    throw error;
  }
};

// Function to fetch all opportunities
export const fetchOpportunities = async () => {
  try {
    const response = await apiService.get("/opportunities");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching opportunities:", error);
    throw error;
  }
};
export const verifyNumber = async (number) => {
  try {
    const cleanedNumber = number.replace(/\D/g, "");
    const response = await apiService.get(`/get-name?number1=${cleanedNumber}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error verifying number:", error);
    throw error;
  }
};
// ✅ Update a meeting by ID
export const updateMeeting = async (meetingId, updatedData) => {
  try {
    const response = await apiService.put(
      `/meetings/${meetingId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Error updating meeting ID ${meetingId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
// New function to update ClientLead status
export const updateClientLead = async (clientLeadId, updateFields) => {
  try {
    const response = await apiService.patch(
      `/client-leads/${clientLeadId}`,
      updateFields
    );
    return response.data;
  } catch (error) {
    console.error("Error updating client lead:", error);
    throw error;
  }
};

export const updateClientLeads = async (leadId, updatedData) => {
  try {
    const response = await apiService.patch(`/client-leads/${leadId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating lead ID ${leadId}:`, error);
    throw error;
  }
};

export const deleteClientLead = async (leadId) => {
  try {
    const response = await apiService.delete(`/client-leads/${leadId}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting lead ID ${leadId}:`, error);
    throw error;
  }
};
//EOD Report
export const sendEodReport = async ({  executiveId,executiveName,email,fields,startDate,endDate,time }) => {
  try {
    const response = await apiService.post(
      "/eod-report/schedule",
      JSON.stringify({ email, executiveName,executiveId,fields,startDate,endDate,time }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
        return response.data;
  } catch (error) {
    console.error("❌ Error sending EOD report:", error);
    throw error;
  }
};
export const createExecutiveAPI = async (executiveData) => {
  const response = await apiService.post("/create-executive", executiveData);
  return response.data;
};


// Add verifyExecutiveOTP function
export const verifyExecutiveOTP = async (email, otp) => {
  try {
    const response = await apiService.post("/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    console.error("❌ Error verifying OTP:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Resend OTP for Executive
export const resendExecutiveOtp = async (email) => {
  try {
    const response = await apiService.post("/resend-otp", { email });
    return response.data;
  } catch (error) {
    console.error("❌ Error resending OTP:", error.response?.data || error.message);
    throw error;
  }
};
export const fetchAllClientLeads = async () => {
  try {
    const response = await apiService.get("/client-leads/getAllClientLeads");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching all executive activities:", error);
    throw error;
  }
};
export const createTeamLeadApi = async (adminData) => {
  try {
    const response = await apiService.post("/create-tl",adminData);
    return response.data;
  } catch (error) {
    console.error("❌ Error ", error);
    throw error;
  }
};
export const createAdminApi = async (adminData) => {
  try {
    const response = await apiService.post("/create-admin",adminData);
    return response.data;
  } catch (error) {
    console.error("❌ Error ", error);
    throw error;
  }
};
export const createManagerApi = async (managerData) => {
  try {
    const response = await apiService.post("manager/signup",managerData);
    return response.data;
  } catch (error) {
    console.error("❌ Error ", error);
    throw error;
  }
};
export const createHrApi = async (hrData) => {
  try {
    const response = await apiService.post("hr/signup",hrData);
    return response.data;
  } catch (error) {
    console.error("❌ Error ", error);
    throw error;
  }
};
export const getHr = async () => {
  try {
    const response = await apiService.get("/hr/profile");
    return response.data; // Assuming you're using only the leads array
  } catch (error) {
    console.error("❌ Error fetching follow-up leads:", error);
    throw error;
  }
};
export const getManager = async () => {
  try {
    const response = await apiService.get("/manager/profile");
    return response.data; // Assuming you're using only the leads array
  } catch (error) {
    console.error("❌ Error fetching follow-up leads:", error);
    console.error("❌ Error fetching manager profile:", error.response?.data || error.message);
    throw error;
  }
};
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await apiService.put(`/user/profile/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating user profile for user ${userId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateManagerProfile = async (managerId, profileData) => {
  try {
    const response = await apiService.put(`/manager/${managerId}`, profileData);
    return response.data.manager; // Return the updated manager object
  } catch (error) {
    console.error("❌ Error updating manager profile:", error.response?.data || error.message);
    throw error;
  }
};


export const fetchAllExecutiveActivitiesByDate = async () => {
  try {
    const response = await apiService.get("/executive-activities/daily-activity");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching all executive activities by date:", error);
    throw error;
  }
};
export const getUserProfile = async () => {
  try {
    const response = await apiService.get("/profile");
    return response.data; // Assuming you're using only the leads array
  } catch (error) {
    console.error("❌ Error fetching follow-up leads:", error);
    throw error;
  }
};

export const createEmailTemplate = async (templateData) => {
  try {
    const response = await apiService.post("/template", templateData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating email template:", error);
    throw error;
  }
};
// ✅ Fetch all email templates
export const getAllEmailTemplates = async () => {
  try {
    const response = await apiService.get("/template/");
    return response.data; // Expecting an array of templates
  } catch (error) {
    console.error("❌ Error fetching all email templates:", error);
    throw error;
  }
};

// ✅ Fetch a single template by ID
export const getEmailTemplateById = async (templateId) => {
  try {
    const response = await apiService.get(`/template/${templateId}`);
    return response.data; // Expecting a single template object
  } catch (error) {
    console.error(`❌ Error fetching email template ID ${templateId}:`, error);
    throw error;
  }
};

// ✅ Fetch weekly call durations for a given executive
export const fetchExecutiveCallDurations = async (executiveId) => {
  try {
    const response = await apiService.get(`/calldetails/call-duration-weekly/${executiveId}`);
    return response.data; 
  } catch (error) {
    console.error(`❌ Error fetching call durations for executive ${executiveId}:`, error);
    throw error;
  }
};
export const markMultipleNotificationsAsRead = async (notificationIds) => {
  try {
    const response = await apiService.post("/notification/mark-multiple-read", {
      notificationIds,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error marking multiple notifications as read:", error);
    throw error;
  }
};


// Function to create a new leave application
export const createLeaveApplication = async (leaveData) => {
  try {
    const response = await apiService.post("/leave/apply", leaveData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating leave application:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchLeaveApplications = async (employeeId = null) => {
  try {
    const url = employeeId ? `/leave?employeeId=${employeeId}` : '/leave';
    const response = await apiService.get(url);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching leave applications:", error);
    throw error;
  }
};

export const updateLeaveApplicationStatus = async (leaveId, status, hrComment = '') => {
  try {
    const response = await apiService.patch('/leave/leave/status', {
      leaveId,
      status,
      hrComment
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating leave application ${leaveId} status:`, error);
    throw error;
  }
};

export const fetchAllHRs = async () => {
  const response = await apiService.get("/hr");
  return response.data.hrs || [];
};

export const fetchAllManagers = async () => {
  const response = await apiService.get("/manager");
  return response.data.managers || [];
};

export const fetchAllProcessPersons = async () => {
  const response = await apiService.get("/processperson");
  return response.data.processPersons || [];
};

// ✅ Fetch all Team Leads (Admin-only)
export const fetchAllTeamLeads = async () => {
  try {
    const response = await apiService.get("/team-leads");
    return response.data.teamLeads || []; // Adjust key based on actual backend response
  } catch (error) {
    console.error("❌ Error fetching team leads:", error);
    throw error;
  }
};
// ================== 👥 Manager Team APIs ==================

// ✅ Create a new Team (Manager only)
export const createTeam = async (teamData) => {
  try {
    const response = await apiService.post("/manager/teams", teamData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating team:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTeamAPI = async (teamId) => {
  try {
    const response = await apiService.delete(`/manager/${teamId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
};

export const getManagerTeamsById = async (managerId) => {
  try {
    const response = await apiService.post("/manager/get-teams", {
      managerId,
    });
    return response.data.teams || [];
  } catch (error) {
    console.error("❌ Error fetching manager's teams:", error.response?.data || error.message);
    throw error;
  }
};
// ✅ Fetch all team members for a given team ID (Manager only)
export const getTeamMembersById = async (teamId) => {
  try {
    const response = await apiService.post("/manager/get-team", {
      team_id: teamId,
    });
    return response.data; // array of team members
  } catch (error) {
    console.error("❌ Error fetching team members:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get all teams (Admin or Manager)
export const getAllTeams = async () => {
  try {
    const response = await apiService.get("/manager/all-teams");
    return response.data.teams; // returns the array of teams
  } catch (error) {
    console.error("❌ Error fetching all teams:", error.response?.data || error.message);
    throw error;
  }
};
// ✅ Add an executive to a team (Manager only)
export const addExecutiveToTeam = async ({ teamId, executiveId, managerId }) => {
  try {
    const response = await apiService.post("/manager/addExecutive", {
      team_id: teamId,
      user_id: executiveId,
      managerId: managerId,
    });

    // Check status manually (only throw if necessary)
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.error("❌ Non-success status:", response.status, response.data);
      throw new Error("Failed to add executive to team.");
    }

  } catch (error) {
    console.error("❌ Error adding executive to team:", error.response?.data || error.message);
    throw error; // This should now only happen when it’s truly an error
  }
};



export const getAllTeamMembers = async (team_id) => {
  try {
    const response = await apiService.post("/manager/get-team", { team_id });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching team members:", error);
    throw error;
  } 
};
export const fetchMeetingsByExecutive = async (executiveName) => {
  try {
    const response = await apiService.get(`/meetings/admin/${encodeURIComponent(executiveName)}`);
    return response.data.data;
  } catch (error) {
    console.error("❌ Error fetching meetings by executive:", error);
    throw error;
  }
};
// Get HR profile by ID
export const getHrById = async (hrId) => {
  try {
    const response = await apiService.get(`/hr/${hrId}`);
    return response.data.hr;
  } catch (error) {
    console.error("❌ Error fetching HR by ID:", error);
    throw error;
  }
};

// Update HR profile by ID
export const updateHrProfile = async (hrId, updateData) => {
  try {
    const response = await apiService.put(`/hr/${hrId}`, updateData);
    return response.data.hr;
  } catch (error) {
    console.error("❌ Error updating HR profile:", error);
    throw error;
  }
};

// ---- CONVERTED ----
export const fetchConvertedByExecutive = async (execName) => {
  const res = await apiService.get(`/converted/admin/${encodeURIComponent(execName.trim())}`);
  return res.data.data;
};

export const fetchClosedByExecutive = async (execName) => {
  const res = await apiService.get(`/close-leads/by-executive/${encodeURIComponent(execName)}`);
  return res.data.data;
};

export const fetchFollowUpsByExecutive = async (execName) => {
  const res = await apiService.get(`/followup/by-executive/${encodeURIComponent(execName)}`);
  return res.data.data;
};
export const fetchCallTimeByRange = async (executiveIds, startDate, endDate) => {
  try {
    const results = [];

    for (const id of executiveIds) {
      const response = await apiService.get(
        `/calldetails/call-time/${id}?startDate=${startDate}&endDate=${endDate}`
      );
      results.push({
        executiveId: id,
        totalCallTimeHours: response.data.totalCallTimeHours || 0,
      });
    }

    return results;
  } catch (error) {
    console.error("❌ Error fetching call time by range (GET):", error);
    throw error;
  }
};
export const fetchExecutiveSummaryByRange = async (
  executiveId,
  startDate,
  endDate
) => {
  try {
    const url = `/executive-activities/summary/${executiveId}?startDate=${startDate}&endDate=${endDate}`;
    const res = await apiService.get(url);
    return res.data; // [{ activityDate, workTime, breakTime, ... }]
  } catch (err) {
    console.error("❌ Error fetching summary by range:", err);
    throw err;
  }
};
// ✅ Fetch organization hierarchy
export const fetchOrganizationHierarchy = async () => {
  try {
    const response = await apiService.get("/organization/graph");
    return response.data.hierarchy; // Return only the hierarchy array
  } catch (error) {
    console.error("❌ Error fetching organization hierarchy:", error.response?.data || error.message);
    throw error;
  }
};
// ✅ Schedule a follow-up notification
export const scheduleFollowUpNotification = async ({ userId, clientName, date, time, targetRole = "executive" }) => {
  try {
    const response = await apiService.post("/schedule/notification", {
      userId,
      clientName,
      date,
      time,
      targetRole,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error scheduling follow-up notification:", error.response?.data || error.message);
    throw error;
  }
};
export const changeHrPassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiService.post("/hr/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error changing HR password:", error.response?.data || error.message);
    throw error;
  }
};

export const changeManagerPassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiService.post("/manager/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error changing manager password:", error.response?.data || error.message);
    throw error;
  }
};
export default apiService;
