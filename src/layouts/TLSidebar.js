import React, { useEffect, useState,useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/adminsidebar.css";
import {
  Gauge,
  ClipboardList,
  UserCheck,
  UserPlus,
  ActivitySquare,
  FileText,
  UserCircle,
  CalendarDays,
  LifeBuoy,
  Settings,
} from "lucide-react";

const TLSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem("adminSidebarExpanded");
    return stored === "true";
  });

const toggleSidebar = useCallback(() => {
  setIsExpanded((prevState) => {
    const newState = !prevState;
    localStorage.setItem("adminSidebarExpanded", newState.toString());
    window.dispatchEvent(new Event("sidebarToggle"));
    document.body.classList.toggle("sidebar-mobile-active", !newState);
    return newState;
  });
}, []);

  useEffect(() => {
    document.body.classList.toggle("sidebar-expanded", isExpanded);
    document.body.classList.toggle("sidebar-collapsed", !isExpanded);
    document.body.classList.toggle("sidebar-mobile-active", !isExpanded);

    const handleSidebarToggle = () => {
      const updated = localStorage.getItem("adminSidebarExpanded") === "true";
      setIsExpanded(updated);
    };

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold && isExpanded) {
        toggleSidebar();
      }
      if (touchEndX - touchStartX > swipeThreshold && !isExpanded) {
        toggleSidebar();
      }
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isExpanded, toggleSidebar]);

  return (
    <section>
      <button
        className="admin-menu_toggle"
        onClick={toggleSidebar}
        aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        <Gauge className="admin-aside-icon" />
      </button>
      <aside
        className={`admin-sidebar ${
          isExpanded ? "expanded active" : "collapsed"
        }`}
      >
        <div className="admin-header-wrapper">
          <h2>
            <span className="highlight">Atozee Visas</span>
          </h2>
        </div>

        <nav>
          <p className="sidebar-section sidebar-label">General</p>
          <ul>
            <li className="active">
              <Link to="/team-lead" className="admin-aside-link" data-tooltip="Overview">
                <Gauge className="admin-aside-icon" />
                <span className="sidebar-label">Overview</span>
              </Link>
            </li>
            <li>
              <Link to="/team-lead/assign-task" className="admin-aside-link" data-tooltip="Upload Leads">
                <ClipboardList className="admin-aside-icon" />
                <span className="sidebar-label">Upload Leads</span>
              </Link>
            </li>
            <li>
              <Link to="/team-lead/leadassign" className="admin-aside-link" data-tooltip="Lead Assign">
                <UserCheck className="admin-aside-icon" />
                <span className="sidebar-label">Lead Assign</span>
              </Link>
            </li>
            <li>
              <Link to="/team-lead/executiveform" className="admin-aside-link" data-tooltip="Create Executive">
                <UserPlus className="admin-aside-icon" />
                <span className="sidebar-label">Create Executive</span>
              </Link>
            </li>
            <li>
              <Link to="/team-lead/monitoring" className="admin-aside-link" data-tooltip="Monitoring">
                <ActivitySquare className="admin-aside-icon" />
                <span className="sidebar-label">Monitoring</span>
              </Link>
            </li>
          </ul>

          <p className="sidebar-section sidebar-label">Reports</p>
          <ul>
            <li>
              <Link to="/team-lead/eod-report" className="admin-aside-link" data-tooltip="EOD">
                <FileText className="admin-aside-icon" />
                <span className="sidebar-label">EOD Report</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/team-lead/executive-details" className="admin-aside-link" data-tooltip="Executive Details">
                <UserCircle className="admin-aside-icon" />
                <span className="sidebar-label">Executive Details</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/team-lead/executive-attendance" className="admin-aside-link" data-tooltip="Attendance">
                <CalendarDays className="admin-aside-icon" />
                <span className="sidebar-label">Attendance</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to="/team-lead/help-support" className="admin-aside-link" data-tooltip="Help & Support">
                <LifeBuoy className="admin-aside-icon" />
                <span className="sidebar-label">Help & Supports</span>
              </Link>
            </li>
            <li>
              <Link to="/team-lead/settings" className="admin-aside-link" data-tooltip="Settings">
                <Settings className="admin-aside-icon" />
                <span className="sidebar-label">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </section>
  );
};

export default TLSidebar;
