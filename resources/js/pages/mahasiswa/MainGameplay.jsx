import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CoinIcon from "../../assets/Coin3D.png";
import CheckGreenIcon from "../../assets/Visited-Pos.png";
import FlagActiveIcon from "../../assets/Active-Pos.png";
import FlagLockedIcon from "../../assets/Locked-Pos.png";
import GiftBoxIcon from "../../assets/gift-box.png";
import HomeIcon from "../../assets/Home-Icon.svg";
import TrophyIcon from "../../assets/Trophy-Icon.svg";

export default function MainGameplay() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const savedUser = JSON.parse(localStorage.getItem("active_user")) || {};

  const namaTeam = location.state?.nameTeam || savedUser.nameTeam || "Tim";
  const sessionCode = location.state?.sessionCode || savedUser.sessionCode;
  const initialEmergencyCode = location.state?.emergencyCode || savedUser.emergencyCode;

  const cacheKey = `game_data_${sessionCode}_${namaTeam}`;
  const getCache = () => JSON.parse(localStorage.getItem(cacheKey)) || {};

  const [posts, setPosts] = useState(getCache().posts || []);
  const [coins, setCoins] = useState(getCache().coins || 0);
  const [sessionInfo, setSessionInfo] = useState(getCache().sessionInfo || {});
  const [timeLeftSec, setTimeLeftSec] = useState(getCache().timeLeftSec || null);
  const [emergencyCode, setEmergencyCode] = useState(
    initialEmergencyCode || getCache().emergencyCode || "KODE_TIDAK_DITEMUKAN"
  );
  
  const timeoutRef = useRef(null);

  function goToLeaderboard() {
    navigate("/leaderboard", { state: { sessionCode, nameTeam: namaTeam } });
  }

  function goToRecovery() {
    navigate("/recovery", { 
      state: { sessionCode, nameTeam: namaTeam, emergencyCode: emergencyCode } 
    });
  }

  const fetchAllData = async () => {
    if (!sessionCode || !namaTeam || namaTeam === "Tim") return;
    
    try {
      const response = await fetch("/api/student-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_code: sessionCode, team_name: namaTeam }),
      });
      const data = await response.json();

      if (data.status === "ended") return navigate("/result", { state: { sessionCode, nameTeam: namaTeam } });
      if (data.status === "upcoming") return navigate("/waiting", { state: { sessionCode, nameTeam: namaTeam, emergencyCode: emergencyCode } });

      if (data.success) {
        setCoins(data.team.total_coins);
        setPosts(data.posts);
        setSessionInfo(data.sessionInfo);
        setTimeLeftSec(data.remaining_seconds);
        setEmergencyCode(data.team.emergency_code);

        localStorage.setItem(cacheKey, JSON.stringify({
          posts: data.posts, coins: data.team.total_coins, sessionInfo: data.sessionInfo, timeLeftSec: data.remaining_seconds, emergencyCode: data.team.emergency_code
        }));
      }
    } catch (error) {}
  };


  useEffect(() => {
    if (!sessionCode || !namaTeam || namaTeam === "Tim") return navigate("/");
    
    let isMounted = true;
    const autoPollData = async () => {
      if (!isMounted) return;
      
      if (!document.hidden) {
        await fetchAllData();
      }
      if (isMounted) timeoutRef.current = setTimeout(autoPollData, 60000); 
    };
    
    autoPollData(); // Jalankan pertama kali saat masuk
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutRef.current);
    };
  }, [sessionCode, namaTeam]); 

  useEffect(() => {
    if (!sessionCode) return;
    
    let isMounted = true;
    let statusTimeoutId;

    const fastStatusCheck = async () => {
      if (!isMounted) return;
      
      if (!document.hidden) {
        try {
          const res = await fetch(`/api/session-status/${sessionCode}`, { 
              headers: { "Accept": "application/json" } 
          });
          const data = await res.json();
          
          if (data.status === "ended") {
            navigate("/result", { state: { sessionCode, nameTeam: namaTeam } });
            return; // Hentikan jika sudah ditutup
          }
        } catch (error) {}
      }
      
      if (isMounted) statusTimeoutId = setTimeout(fastStatusCheck, 15000);
    };

    statusTimeoutId = setTimeout(fastStatusCheck, 15000);

    return () => {
      isMounted = false;
      clearTimeout(statusTimeoutId);
    };
  }, [sessionCode, namaTeam, navigate]);

  // TIMER LOKAL (Menghitung detik)
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeftSec(prev => (prev === null || prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (sec) => {
    if (!sec || sec <= 0) return "00:00:00";
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
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
                <div className="flex flex-col items-center pt-12">
          <p className="text-[#8C9BA5] text-[15px] font-bold mb-2 tracking-wide uppercase">
            Halo, <span className="text-[#02101B]">{namaTeam}</span> 👋
          </p>

          <div className="flex items-center gap-3">
            <img src={CoinIcon} alt="BeeCoin" className="w-10 h-10" />
            <h1 className="text-[44px] font-bold text-[#02101B] leading-none tracking-tight mt-1">{coins}</h1>
          </div>
          <p className="font-mono text-[#8C9BA5] text-[18px] tracking-widest mt-1">BeeCoin</p>
        </div>

        {/* --- INFO CARD --- */}
        <div className="mx-6 mt-8 bg-white rounded-[20px] p-5 border border-dashed border-[#B5C5D1] shadow-sm relative z-10">
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="flex-1">
              <p className="text-[#546878] text-[13px] font-bold uppercase leading-snug">
                {sessionInfo.name || "Menyiapkan Sesi..."}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[#8C9BA5] text-[11px] mb-0.5">Sisa Waktu Sesi</p>
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
          {posts.map((pos, index) => (
            <div key={index} className="flex gap-5">
              <div className="flex flex-col items-center w-16 shrink-0">
                <img src={getIcon(pos.status)} alt="status" className="w-12 h-12 object-contain drop-shadow-md z-10" />
                <div className="flex-1 w-0 border-l-2 border-dashed border-[#A0B0BC] my-2 min-h-[40px]"></div>
              </div>

              <div className="flex-1 pb-10 pt-1">
                <h2 className="text-[18px] font-bold text-[#02101B]">{pos.name}</h2>
                <p className="text-[#8C9BA5] text-[12px] font-bold uppercase tracking-wide mb-2">📍 {pos.location}</p>

                {pos.status === "active" ? (
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E5A015] text-white text-[10px] px-2.5 py-1 rounded-full font-extrabold shadow-sm">CHECKED IN</span>
                    <span className="font-mono bg-[#FFF1F2] text-[#E11D48] px-2.5 py-1 rounded text-[11px] font-bold border border-[#FECDD3]">Sedang Mengerjakan</span>
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
          ))}

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

        {/* --- NAVBAR --- */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50">
          <button className="hover:scale-110 transition-transform" disabled><img src={HomeIcon} alt="Home" className="w-7 h-7" /></button>
          <button onClick={goToLeaderboard} className="opacity-40 hover:opacity-100 hover:scale-110 transition-all"><img src={TrophyIcon} alt="Reward" className="w-7 h-7" /></button>
        </div>
      </div>
    </div>
  );
}