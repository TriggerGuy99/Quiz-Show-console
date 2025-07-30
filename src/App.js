import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import AdminDashboard from "../components/AdminDashboard";
import ParticipantView from "../components/ParticipantView";
import PresentationView from "../components/PresentationView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/participant/:eventId" element={<ParticipantView />} />
        <Route path="/presentation/:eventId" element={<PresentationView />} />
      </Routes>
    </Router>
  );
}

export default App;
