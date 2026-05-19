import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CoinIcon from "../../assets/Coin3D.png";
import HomeIcon from "../../assets/Home-Icon.svg";
import TrophyIcon from "../../assets/Trophy-Icon.svg";

export default function Leaderboard() {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const namaTeam = location.state?.nameTeam;
  const sessionCode = location.state?.sessionCode;
  const allowEndedLeaderboard = location.state?.allowEndedLeaderboard === true;

  const prevTeamsRef = useRef([]);

  // Mengambil data lama dari sessionStorage saat komponen pertama kali dimuat
  useEffect(() => {
    if (sessionCode) {
      try {
        const stored = sessionStorage.getItem(`lb_mhs_${sessionCode}`);
        if (stored) {
          prevTeamsRef.current = JSON.parse(stored);
        }
      } catch (e) { }
    }
  }, [sessionCode]);

  function goToGameplay() {
    navigate("/gameplay", { state: { nameTeam: namaTeam, sessionCode: sessionCode } });
  }

  async function fetchLeaderboard(isPolling = false) {
    if (!sessionCode) return;
    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ session_code: sessionCode }),
      });
      const data = await response.json();

      // Membaca status sesi yang sudah digabungkan di Backend Laravel
      if (data.session_status === "ended" && !allowEndedLeaderboard) {
        navigate("/result", { state: { sessionCode, nameTeam: namaTeam } });
        return;
      }

      if (data.status === "success" || data.success) {
        setTeams((current) => {
          if (isPolling && current.length > 0) {
            prevTeamsRef.current = current;
            try {
              sessionStorage.setItem(`lb_mhs_${sessionCode}`, JSON.stringify(current));
            } catch (e) { }
          }
          return data.data;
        });
      }
    } catch (error) { }
  }

  useEffect(() => {
    if (!sessionCode || !namaTeam) {
      navigate('/');
      return;
    }

    let isMounted = true;
    let leaderboardTimeoutId;

    const pollLeaderboard = async (isPolling) => {
      if (!isMounted) return;

      if (!document.hidden) {
        await fetchLeaderboard(isPolling);
      }

      if (isMounted) {
        leaderboardTimeoutId = setTimeout(() => pollLeaderboard(true), 30000);
      }
    };

    pollLeaderboard(false);

    return () => {
      isMounted = false;
      clearTimeout(leaderboardTimeoutId);
    };
  }, [sessionCode, namaTeam, navigate, allowEndedLeaderboard]);

  return (
    <div className="min-h-screen bg-[#E8F1F8] flex justify-center font-sans pb-32">
      <div className="w-full max-w-md min-h-screen flex flex-col relative">
        <div className="pt-16 pb-8 flex justify-center">
          <h1 className="text-[22px] font-extrabold text-[#1D2A34] tracking-widest">LEADERBOARD</h1>
        </div>

        <div className="px-6 flex flex-col gap-4">
          {teams.map((team, index) => {
            const currentRank = index + 1;
            const prevIndex = prevTeamsRef.current.findIndex(t => t.id === team.id);
            let trend = null;

            if (prevIndex !== -1 && prevTeamsRef.current.length > 0) {
              const prevRank = prevIndex + 1;
              if (currentRank < prevRank) trend = 'up';
              else if (currentRank > prevRank) trend = 'down';
            }

            const isMyTeam = team.name === namaTeam;

            return (
              <div key={team.id} className={`flex items-center bg-white rounded-[20px] p-4 shadow-sm transition-all hover:border-[#2E9AD7] ${isMyTeam ? "border-2 border-[#2E9AD7] ring-2 ring-[#2E9AD7]/20" : "border border-[#CBD5E1]"}`}>
                <div className="w-14 shrink-0 flex items-center justify-center gap-1.5">
                  <div className="w-3 flex justify-center">
                    {trend === 'up' && <span className="text-green-500 text-[12px] animate-bounce">▲</span>}
                    {trend === 'down' && <span className="text-red-500 text-[12px]">▼</span>}
                  </div>
                  <span className={`text-[18px] font-black ${currentRank === 1 ? 'text-[#E5A015]' : currentRank === 2 ? 'text-[#94A3B8]' : currentRank === 3 ? 'text-[#B45309]' : 'text-[#02101B]'}`}>
                    #{currentRank}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center min-w-0 pr-2 border-l border-[#F1F5F9] pl-3">
                  {team.isFinished && <div className="w-fit bg-[#8900E8] text-white px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide mb-1">Selesai</div>}
                  <p className="text-[#02101B] text-[15px] font-bold truncate w-full">{team.name}</p>
                  <p className="text-[#8C9BA5] text-[11px] font-semibold uppercase tracking-wide truncate w-full">{team.major}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 bg-[#FFF9E5] px-3 py-1.5 rounded-full border border-[#FEF08A]">
                  <img src={CoinIcon} alt="coin" className="w-4 h-4 object-contain" />
                  <span className="font-extrabold text-[#E5A015] text-[15px]">{team.total_coins}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-12 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50 border border-[#F1F5F9]">
          <button onClick={goToGameplay} className="opacity-30 hover:opacity-100 hover:scale-110 transition-all"><img src={HomeIcon} alt="Home" className="w-7 h-7" /></button>
          <button className="scale-110 opacity-100 drop-shadow-md" disabled><img src={TrophyIcon} alt="Reward" className="w-7 h-7" /></button>
        </div>
      </div>
    </div>
  );
}