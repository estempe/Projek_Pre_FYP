import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import semua halaman yang udah kamu buat
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
import WaitingRoomSuperadmin from "./pages/superadmin/WaitingRoom";
import SessionLiveSuperadmin from "./pages/superadmin/SessionLive";
import LeaderboardSuperadmin from "./pages/superadmin/LeaderboardSuperadmin";
import SessionRedeemSuperadmin from "./pages/superadmin/SessionRedeem";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ini artinya: Kalau URL-nya "/", buka halaman JoinSession */}
        <Route path="/" element={<JoinSession />} />
        
        {/* Sisanya menyesuaikan path masing-masing */}
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
        <Route path="/pic/home" element={<HomePIC />} />
        <Route path="/pic/session-detail" element={<SessionDetail />} />
        <Route path="/pic/session-live" element={<SessionLive />} />
        <Route path="/pic/leaderboard" element={<LeaderboardPIC />} />
        <Route path="/pic/session-redeem" element={<SessionRedeem />} />

        {/* SuperAdmin */}
        <Route path="/superadmin/login" element={<LoginSuperadmin />} />
        <Route path="/superadmin/home" element={<HomeSuperadmin />} />
        <Route path="/superadmin/create-session" element={<CreateSession />} />
        <Route path="/superadmin/waiting" element={<WaitingRoomSuperadmin />} />
        <Route path="/superadmin/session/live" element={<SessionLiveSuperadmin />} />
        <Route path="/superadmin/leaderboard" element={<LeaderboardSuperadmin />} />
        <Route path="/superadmin/session/redeem" element={<SessionRedeemSuperadmin />} />
      </Routes>
    </Router>
  );
}