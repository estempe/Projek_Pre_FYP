import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CoinIcon from "../../assets/Coin3D.png";
import CheckGreenIcon from "../../assets/Visited-Pos.png";
import FlagActiveIcon from "../../assets/Active-Pos.png";
import FlagLockedIcon from "../../assets/Locked-Pos.png";
import GiftBoxIcon from "../../assets/gift-box.png";
import HomeIcon from "../../assets/Home-Icon.svg";
import TrophyIcon from "../../assets/Trophy-Icon.svg";

// =======================================================
// KOMPONEN TIMER UNTUK MASING-MASING POS (Saat "active")
// =======================================================
const PostTimer = ({ checkInTime, maxDuration }) => {
  const [timeLeft, setTimeLeft] = useState("00:00");

  useEffect(() => {
    if (!checkInTime || !maxDuration) return;
    const interval = setInterval(() => {
      const checkInMs = new Date(checkInTime.replace(' ', 'T')).getTime();
      const [h, m, s] = maxDuration.split(':').map(Number);
      const durationMs = (h * 3600 + m * 60 + s) * 1000;
      
      const endMs = checkInMs + durationMs;
      const nowMs = new Date().getTime();
      const diffSec = Math.floor((endMs - nowMs) / 1000);

      if (diffSec <= 0) {
        setTimeLeft("Waktu Habis!");
        clearInterval(interval);
      } else {
        const dm = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
        const ds = (diffSec % 60).toString().padStart(2, '0');
        setTimeLeft(`${dm}:${ds}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [checkInTime, maxDuration]);

  return <span className="font-mono bg-[#FFF1F2] text-[#E11D48] px-2 py-0.5 rounded text-[11px] font-bold border border-[#FECDD3]">{timeLeft}</span>;
};


// =======================================================
// KOMPONEN UTAMA
// =======================================================
export default function MainGameplay() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const namaTeam = location.state?.nameTeam;
  const sessionCode = location.state?.sessionCode;
  
  const [posts, setPosts] = useState([]);
  const [coins, setCoins] = useState(0);
  const [sessionInfo, setSessionInfo] = useState({});
  const [teamData, setTeamData] = useState(null); 
  const [timeLeftSec, setTimeLeftSec] = useState(null);

  function goToLeaderboard() {
    navigate("/leaderboard", { state: { sessionCode, nameTeam: namaTeam } });
  }

  function goToRecovery() {
    const finalEmergencyCode = teamData?.emergency_code || "KODE_TIDAK_DITEMUKAN";
    navigate("/recovery", { state: { sessionCode, nameTeam: namaTeam, emergencyCode: finalEmergencyCode } });
  }

  const fetchAllData = async () => {
    try {
      const resStatus = await fetch(`/api/session-status/${sessionCode}`);
      const dataStatus = await resStatus.json();
      
      if (dataStatus.status === "ended") {
        navigate("/result", { state: { sessionCode, nameTeam: namaTeam } });
        return;
      }
      
      setTimeLeftSec(Math.floor(dataStatus.remaining_seconds));

      const resCoin = await fetch("/api/getTeamCoins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_code: sessionCode, team_name: namaTeam }),
      });
      const dataCoin = await resCoin.json();
      if (dataCoin.status === "success") {
        setCoins(dataCoin.total_coins);
        setTeamData(dataCoin.team); 
      }

      const resPosts = await fetch("/api/team-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_code: sessionCode, team_name: namaTeam }),
      });
      const dataPosts = await resPosts.json();
      if (dataPosts.status === "success") {
        setPosts(dataPosts.data);
      }

      const resSess = await fetch("/api/sessionData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_code: sessionCode }),
      });
      const dataSess = await resSess.json();
      if (dataSess.status === "success") setSessionInfo(dataSess.data);

    } catch (error) {
      console.error("Gagal sinkronisasi data:", error);
    }
  };

  useEffect(() => {
    if (!sessionCode || !namaTeam) return navigate("/");
    
    fetchAllData();     
    const interval = setInterval(fetchAllData, 3000); 
    return () => clearInterval(interval);
  }, [sessionCode, namaTeam]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeftSec(prev => (prev === null || prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (sec) => {
    if (!sec || sec <= 0) return "00:00:00";
    const safeSec = Math.floor(sec);
    const h = Math.floor(safeSec / 3600).toString().padStart(2, '0');
    const m = Math.floor((safeSec % 3600) / 60).toString().padStart(2, '0');
    const s = (safeSec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getIcon = (status) => {
    switch (status) {
      case "completed": return CheckGreenIcon;
      case "active": return FlagActiveIcon;
      default: return FlagLockedIcon;
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F1F8] flex justify-center font-sans pb-28">
      <div className="w-full max-w-md min-h-screen flex flex-col relative">
        
        {/* --- HEADER COIN --- */}
        <div className="flex flex-col items-center pt-12">
          <div className="flex items-center gap-3">
            <img src={CoinIcon} alt="BeeCoin" className="w-10 h-10" />
            <h1 className="text-[44px] font-bold text-[#02101B] leading-none tracking-tight mt-1">{coins}</h1>
          </div>
          <p className="font-mono text-[#8C9BA5] text-[18px] tracking-widest mt-1">BeeCoin</p>
        </div>

        {/* --- INFO CARD SECTION --- */}
        <div className="mx-6 mt-8 bg-white rounded-[20px] p-5 border border-dashed border-[#B5C5D1] shadow-sm relative z-10">
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="flex-1">
              <p className="text-[#546878] text-[13px] font-bold uppercase leading-snug">
                {sessionInfo.name || "Memuat..."}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[#8C9BA5] text-[11px] mb-0.5">Waktu Tersisa Sesi</p>
              <p className={`text-[18px] font-bold ${timeLeftSec === 0 ? "text-red-500" : "text-[#02101B]"}`}>
                {formatTime(timeLeftSec)}
              </p>
            </div>
          </div>

          <button onClick={goToRecovery} className="w-full bg-[#1D2A34] text-white py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform">
             Akses Cadangan Tim
          </button>
        </div>

        {/* --- TIMELINE POS --- */}
        <div className="px-8 mt-10">
          {posts.length === 0 && <p className="text-center text-gray-500 text-sm mt-4">Memuat urutan pos...</p>}
          
          {posts.map((pos, index) => {
            return (
              <div key={index} className="flex gap-5">
                
                <div className="flex flex-col items-center w-16 shrink-0">
                  <img src={getIcon(pos.status)} alt="status" className="w-12 h-12 object-contain drop-shadow-md z-10" />
                  {/* Garis putus-putus selalu ditampilkan karena di ujung ada Pos Tukar Hadiah */}
                  <div className="flex-1 w-0 border-l-2 border-dashed border-[#A0B0BC] my-2 min-h-[40px]"></div>
                </div>

                <div className="flex-1 pb-10 pt-1">
                  <h2 className="text-[18px] font-bold text-[#02101B]">{pos.name}</h2>
                  <p className="text-[#8C9BA5] text-[12px] font-bold uppercase tracking-wide mb-2">📍 {pos.location}</p>

                  {/* LOGIKA STATUS POS */}
                  {pos.status === "active" ? (
                    <div className="flex items-center gap-2">
                      <span className="bg-[#E5A015] text-white text-[10px] px-2.5 py-1 rounded-full font-extrabold shadow-sm">CHECKED IN</span>
                      <PostTimer checkInTime={pos.check_in_time} maxDuration={pos.max_duration} />
                    </div>
                  ) : pos.status === "completed" ? (
                    <div className="inline-flex items-center gap-1.5 bg-[#A3C756] px-3 py-1 rounded-full text-white text-[12px] font-bold shadow-sm">
                      <img src={CoinIcon} alt="coin" className="w-4 h-4" />
                      <p className="font-light">+ {pos.earned_coins} BeeCoin</p>
                    </div>
                  ) : (
                    <span className="bg-[#CBD5E1] text-white text-[10px] px-2.5 py-1 rounded-full font-extrabold shadow-sm">BELUM SELESAI</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* ================================================= */}
          {/* --- POS REDEEM / PENUKARAN HADIAH (KADO) ---        */}
          {/* ================================================= */}
          {sessionInfo.redeem_name && (
            <div className="flex gap-5">
              <div className="flex flex-col items-center w-16 shrink-0">
                <img src={GiftBoxIcon} alt="reward" className="w-12 h-12 object-contain drop-shadow-md z-10" />
              </div>

              <div className="flex-1 pb-4 pt-1">
                <h2 className="text-[18px] font-bold text-[#02101B]">{sessionInfo.redeem_name}</h2>
                <p className="text-[#8C9BA5] text-[12px] font-bold uppercase tracking-wide mb-2">📍 {sessionInfo.redeem_location}</p>
                <span className="bg-[#2E9AD7] text-white text-[10px] px-3 py-1 rounded-full font-extrabold shadow-sm tracking-wider">TUJUAN AKHIR</span>
              </div>
            </div>
          )}

        </div>

        {/* --- BOTTOM NAVIGATION --- */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50">
          <button className="hover:scale-110 transition-transform" disabled><img src={HomeIcon} alt="Home" className="w-7 h-7" /></button>
          <button onClick={goToLeaderboard} className="opacity-40 hover:opacity-100 hover:scale-110 transition-all"><img src={TrophyIcon} alt="Reward" className="w-7 h-7" /></button>
        </div>
      </div>
    </div>
  );
}