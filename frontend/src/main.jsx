import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Participant from "./pages/Participant.jsx";
import ParticipantScan from "./pages/ParticipantScan.jsx";
import OrganizatorLogin from "./pages/OrganizatorLogin.jsx";
import OrganizatorDashboard from "./pages/OrganizatorDashboard.jsx";
import OrganizatorGrup from "./pages/OrganizatorGrup.jsx";
import OrganizatorEveniment from "./pages/OrganizatorEveniment.jsx";
import OrganizatorRegister from "./pages/OrganizatorRegister.jsx";

import "./styles.css";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/participant/scan" element={<ParticipantScan />} />
        <Route path="/participant" element={<Participant />} />

        <Route path="/organizator/login" element={<OrganizatorLogin />} />
        <Route path="/organizator/register" element={<OrganizatorRegister />} />

        <Route path="/organizator/dashboard" element={<OrganizatorDashboard />} />
        <Route path="/organizator/grup/:grupId" element={<OrganizatorGrup />} />


        {}
        <Route path="/organizator" element={<OrganizatorLogin />} />
        <Route path="/organizator/eveniment/:evenimentId" element={<OrganizatorEveniment />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
 