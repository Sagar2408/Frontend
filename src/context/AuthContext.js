import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import * as authService from "../services/auth";
import { recordStartWork, recordStopWork } from "../services/executiveService";
import useWorkTimer from "../features/executive/useLoginTimer";
import { ThemeContext } from "../features/admin/ThemeContext";
// Removed unused import: import { useBreakTimer } from "./breakTimerContext";

// 1. Create Auth Context
const AuthContext = createContext();

// 2. Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clearTimer, setClearTimer] = useState(false); // Used by workTimer
  const navigate = useNavigate();
  const { forceLightTheme } = useContext(ThemeContext);

  // Initialize work timer with clearTimer and setClearTimer
  useWorkTimer(clearTimer, setClearTimer);
   
  // Initialize user session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  // -----------------------
  // LOGIN
  // -----------------------
  const login = async (email, password,role) => {
    if (!email || !password) {
      toast.error(<div className="textToast">All fields are required</div>, {
        className: "custom-toast-error",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await authService.loginUser(email, password,role);
      const user = response.user;

      // Save session data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("executiveId", user.id);
 
      setUser(user);

      toast.success(
        <div className="toast-content">
          <div className="textToast">Login Successful</div>
        </div>,
        {
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
        }
      );

      // Start work time if not already started
      const alreadyStarted = localStorage.getItem("workStartTime");
      if (!alreadyStarted) {
        recordStartWork()
          .then((res) => {
            if (res?.activity?.startWorkTime) {
              localStorage.setItem("workStartTime", res.activity.startWorkTime);
            }
          })
          .catch((err) =>
            console.warn("Start work failed after navigation:", err.message)
          );
      }

      // Navigate based on role
      setTimeout(() => {
        const role = user.role.toLowerCase();
        if (role === "admin") navigate("/admin");
        else if (role === "executive") navigate("/executive");
        else if (role === "Manager") navigate("/manager");
        else if (role === "hr") navigate("/hr");
        else if (role === "tl") navigate("/team-lead");
      }, 2000);
    } catch (err) {
      toast.error(
        <div className="textToast">{err.message || "Login Failed"}</div>,
        {
          className: "custom-toast-error",
        }
      );
    } finally {
      setLoading(false);
    }
  };


  const handleLoginManager = async (email, password,role) => {
    if (!email || !password) {
      toast.error(<div className="textToast">All fields are required</div>, {
        className: "custom-toast-error",
      });
      return;
    }

    try {
      setLoading(true);
         const response = await authService.loginManager(email, password);
      const manager = response.manager;
        setUser(manager);

      // Save session data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(manager));
     
 
      setUser(manager);

      toast.success(
        <div className="toast-content">
          <div className="textToast">Login Successful</div>
        </div>,
        {
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
        }
      );

      // Start work time if not already started
      const alreadyStarted = localStorage.getItem("workStartTime");
      if (!alreadyStarted) {
        recordStartWork()
          .then((res) => {
            if (res?.activity?.startWorkTime) {
              localStorage.setItem("workStartTime", res.activity.startWorkTime);
            }
          })
          .catch((err) =>
            console.warn("Start work failed after navigation:", err.message)
          );
      }

      // Navigate based on role
    setTimeout(() => {
  const role = manager.role?.toLowerCase();
  if (role === "manager") navigate("/manager");
}, 2000);
    } catch (err) {
      toast.error(
        <div className="textToast">{err.message || "Login Failed"}</div>,
        {
          className: "custom-toast-error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Inside AuthProvider

const handleLogoutManager = async () => {
  try {
    setLoading(true);

    await authService.logoutManager(); // <-- call the logout API

    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("workStartTime");

    // Reset user state
    setUser(null);
    setClearTimer(true); // stop work timer
    forceLightTheme(); // reset theme if needed
    setTimeout(() => {
      navigate("/manager/login");
    }, 100);
    } catch (err) {
    console.error("Logout failed:", err.message);
    toast.error(
      <div className="textToast">{err.message || "Logout failed"}</div>,
      {
        className: "custom-toast-error",
      }
    );
  } finally {
    setLoading(false);
  }
};


const handleLoginHr = async (email, password,role) => {
  if (!email || !password) {
    toast.error(<div className="textToast">All fields are required</div>, {
      className: "custom-toast-error",
    });
    return;
  }

  try {
    setLoading(true);
       const response = await authService.loginHr(email, password);
    const hr = response.hr;
      setUser(hr);

    // Save session data
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(hr));
   

    setUser(hr);

    toast.success(
      <div className="toast-content">
        <div className="textToast">Login Successful</div>
      </div>,
      {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      }
    );

    // Start work time if not already started
    const alreadyStarted = localStorage.getItem("workStartTime");
    if (!alreadyStarted) {
      recordStartWork()
        .then((res) => {
          if (res?.activity?.startWorkTime) {
            localStorage.setItem("workStartTime", res.activity.startWorkTime);
          }
        })
        .catch((err) =>
          console.warn("Start work failed after navigation:", err.message)
        );
    }

    // Navigate based on role
  setTimeout(() => {
const role = hr.role?.toLowerCase();
if (role === "hr") navigate("/hr");
}, 2000);
  } catch (err) {
    toast.error(
      <div className="textToast">{err.message || "Login Failed"}</div>,
      {
        className: "custom-toast-error",
      }
    );
  } finally {
    setLoading(false);
  }
};
  // -----------------------
  // SIGNUP
  // -----------------------
  const signup = async (username, email, password, role) => {
    if (!username || !email || !password || !role) {
      toast.error(<div className="textToast">All fields are required!</div>, {
        className: "custom-toast-error",
      });
      return;
    }

    if (password.length < 6) {
      toast.error(
        <div className="textToast">
          Password must be at least 6 characters long.
        </div>,
        {
          className: "custom-toast-error",
          bodyClassName: "custom-toast-body-error",
        }
      );
      return;
    }

    try {
      setLoading(true);
      const data = await authService.signupUser(username, email, password, role);

      toast.success(
        <div className="toast-content">
          <div className="textToast">Signup successful! Redirecting...</div>
        </div>,
        {
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("theme", "light");

      forceLightTheme();

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
        })
      );

      setTimeout(() => {
        const redirectPath =
          data.user.role === "Admin" || data.user.role === "Executive"
            ? "/login"
            : "/user";
        navigate(redirectPath);
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        <div className="textToast">{error.message || "Signup failed"}</div>,
        {
          className: "custom-toast-error",
          bodyClassName: "custom-toast-body-error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutHr = async () => {
    try {
      setLoading(true);
  
      await authService.logoutHr(); // <-- call the logout API
  
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("workStartTime");
  
      // Reset user state
      setUser(null);
      setClearTimer(true); // stop work timer
      forceLightTheme(); // reset theme if needed
      setTimeout(() => {
        navigate("/hr/login");
      }, 100);   
     } catch (err) {
      console.error("Logout failed:", err.message);
      toast.error(
        <div className="textToast">{err.message || "Logout failed"}</div>,
        {
          className: "custom-toast-error",
        }
      );
    } finally {
      setLoading(false);
    }
  };
  // -----------------------
  // LOGOUT
  // -----------------------
  const logout = async () => {
    try {
      await recordStopWork();

      // Clear localStorage and session data
      localStorage.removeItem("workStartTime");
      localStorage.removeItem("breakStartTime");
      localStorage.removeItem("accumulatedBreakTime");
     
     await authService.logoutUser();
     
     localStorage.removeItem("token");
     localStorage.removeItem("user");
     localStorage.removeItem("executiveId");

      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // -----------------------
  // FORGOT PASSWORD
  // -----------------------
  const forgotPassword = async (email) => {
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    try {
      setLoading(true);
      const data = await authService.forgotPassword(email);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // RESET PASSWORD
  // -----------------------
  const resetPassword = async (token, newPassword) => {
    if (!newPassword) {
      toast.error("Please enter a new password!");
      return;
    }

    try {
      setLoading(true);
      const data = await authService.resetPassword(token, newPassword);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // CONTEXT RETURN
  // -----------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        forgotPassword,
        resetPassword,
        signup,
        handleLoginManager,
        handleLogoutManager,
        handleLoginHr,
        handleLogoutHr,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook for Context Access
export const useAuth = () => useContext(AuthContext);