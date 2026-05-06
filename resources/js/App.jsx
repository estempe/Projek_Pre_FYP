import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import JoinSession from "./pages/mahasiswa/JoinSession";
import CreateTeam from "./pages/mahasiswa/CreateTeam";
import WaitingRoom from "./pages/mahasiswa/WaitingRoom";
import MainGameplay from "./pages/mahasiswa/MainGameplay";
import Leaderboard from "./pages/mahasiswa/Leaderboard";
import RecoveryAccess from "./pages/mahasiswa/RecoveryAccess";
import RejoinSession from "./pages/mahasiswa/RejoinSession";
import GameResult from "./pages/mahasiswa/GameResult";
import RedeemSuccess from "./pages/mahasiswa/RedeemSuccess";

// PIC
import LoginPIC from "./pages/pic/LoginPIC";
import HomePIC from "./pages/pic/HomePIC";
import SessionDetail from "./pages/pic/SessionDetail";
import SessionLive from "./pages/pic/SessionLive";
import LeaderboardPIC from "./pages/pic/LeaderboardPIC";
import SessionRedeem from "./pages/pic/SessionRedeem";

// SuperAdmin
import LoginSuperadmin from "./pages/superadmin/LoginSuperadmin";
import HomeSuperadmin from "./pages/superadmin/HomeSuperadmin";
import CreateSession from "./pages/superadmin/CreateSession";
import SessionDetailSuperadmin from "./pages/superadmin/SessionDetailSuperadmin"; // <-- Import Tambahan Baru
import WaitingRoomSuperadmin from "./pages/superadmin/WaitingRoom";
import SessionLiveSuperadmin from "./pages/superadmin/SessionLive";
import LeaderboardSuperadmin from "./pages/superadmin/LeaderboardSuperadmin";
import SessionRedeemSuperadmin from "./pages/superadmin/SessionRedeem";
import EditSessionSuperadmin from './pages/superadmin/EditSessionSuperadmin';


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Mahasiswa */}
        <Route path="/" element={<JoinSession />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/waiting" element={<WaitingRoom />} />
        <Route path="/gameplay" element={<MainGameplay />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/recovery" element={<RecoveryAccess />} />
        <Route path="/rejoin" element={<RejoinSession />} />
        <Route path="/result" element={<GameResult />} />
        <Route path="/redeem-success" element={<RedeemSuccess />} />

        {/* PIC */}
        <Route path="/pic/login" element={<LoginPIC />} />
        <Route path="/pic/home" element={<ProtectedRoute><HomePIC /></ProtectedRoute>} />
        <Route path="/pic/session-detail/:id" element={<ProtectedRoute><SessionDetail /></ProtectedRoute>} />
        <Route path="/pic/session-live/:id" element={<ProtectedRoute><SessionLive /></ProtectedRoute>} />
        <Route path="/pic/leaderboard/:id" element={<ProtectedRoute><LeaderboardPIC /></ProtectedRoute>} />
        <Route path="/pic/session-redeem/:id" element={<ProtectedRoute><SessionRedeem /></ProtectedRoute>} />

        {/* SuperAdmin */}
        <Route path="/superadmin/login" element={<LoginSuperadmin />} />
        <Route path="/superadmin/home" element={<ProtectedRoute><HomeSuperadmin /></ProtectedRoute>} />
        <Route path="/superadmin/create-session" element={<ProtectedRoute><CreateSession /></ProtectedRoute>} />
        <Route path="/superadmin/session/detail/:id" element={<ProtectedRoute><SessionDetailSuperadmin /></ProtectedRoute>} />        
        <Route path="/superadmin/waiting/:id" element={<ProtectedRoute><WaitingRoomSuperadmin /></ProtectedRoute>} />
        <Route path="/superadmin/session/live/:id" element={<ProtectedRoute><SessionLiveSuperadmin /></ProtectedRoute>} />
        <Route path="/superadmin/leaderboard/:id" element={<ProtectedRoute><LeaderboardSuperadmin /></ProtectedRoute>} />
        <Route path="/superadmin/session/redeem/:id" element={<ProtectedRoute><SessionRedeemSuperadmin /></ProtectedRoute>} />
        <Route path="/superadmin/session/edit/:id" element={<EditSessionSuperadmin />} />
      </Routes>
    </Router>
  );
}