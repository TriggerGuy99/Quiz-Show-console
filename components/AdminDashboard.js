import React, { useState } from "react";
import RoleManagement from "./RoleManagement";
import QuizManagement from "./QuizManagement";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("quizManagement");

  const renderTabContent = () => {
    switch (activeTab) {
      case "roleManagement":
        return <RoleManagement />;
      case "quizManagement":
        return <QuizManagement />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Admin Dashboard</h2>
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setActiveTab("quizManagement")}
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "quizManagement" ? "#ccc" : "#eee",
            border: "1px solid #999",
            cursor: "pointer",
          }}
        >
          Quiz/Event Management
        </button>
        <button
          onClick={() => setActiveTab("roleManagement")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "roleManagement" ? "#ccc" : "#eee",
            border: "1px solid #999",
            cursor: "pointer",
          }}
        >
          Role Management
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
}

export default AdminDashboard;
