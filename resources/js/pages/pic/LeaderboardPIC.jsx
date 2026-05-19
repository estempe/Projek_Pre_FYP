import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CoinIcon from "../../assets/Coin3D.png";
import HomeIcon from "../../assets/Home-Icon.svg";
import TrophyIcon from "../../assets/Trophy-Icon.svg";

export default function LeaderboardPIC() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStatus, setSessionStatus] = useState('');

  useEffect(() => {
    const fetchLeaderboardAndStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');

        const resLeaderboard = await fetch(`/api/sessions/${id}/leaderboard`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const dataLeaderboard = await resLeaderboard.json();
        if (resLeaderboard.ok && dataLeaderboard.success) {
          setLeaderboardData(dataLeaderboard.data);

          if (dataLeaderboard.session_status) {
            setSessionStatus(dataLeaderboard.session_status);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    let isMounted = true;
    let timeoutId;


    const pollData = async () => {
      if (!isMounted) return;

      if (!document.hidden) {
        await fetchLeaderboardAndStatus();
      }

      if (isMounted) {
        timeoutId = setTimeout(pollData, 30000);
      }
    };

    pollData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-[#E8F1F8] flex justify-center font-sans pb-32">
      <div className="w-full max-w-md min-h-screen flex flex-col relative">

        <div className="pt-12 px-6 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            Kembali
          </button>

          <button onClick={() => navigate(`/pic/session-redeem/${id}`)} className="bg-[#2E9AD7] text-white text-[12px] font-bold px-4 py-2 rounded-lg shadow-[0_3px_0_0_#1C6B99] hover:bg-[#268bc4] active:translate-y-[3px] active:shadow-none transition-all">
            {sessionStatus === 'ended' ? 'Redeem' : 'Redeem (Tim Selesai)'}
          </button>
        </div>

        <div className="pt-8 pb-8 flex justify-center">
          <h1 className="text-[22px] font-extrabold text-[#1D2A34] tracking-widest">LEADERBOARD</h1>
        </div>

        <div className="px-6 flex flex-col gap-4">
          {isLoading ? (
            <p className="text-center text-[#92A0AD] font-semibold mt-10 animate-pulse">Memuat klasemen...</p>
          ) : leaderboardData.length === 0 ? (
            <p className="text-center text-[#92A0AD] font-semibold mt-10">Belum ada tim yang mendaftar.</p>
          ) : null}

          {leaderboardData.map((team) => (
            <div key={team.id} className="flex items-center bg-white rounded-[20px] p-4 border border-[#CBD5E1] shadow-sm hover:border-[#2E9AD7] transition-colors">
              <div className="w-12 shrink-0 flex justify-center">
                <span className={`text-[18px] font-black ${team.rank === 1 ? 'text-[#E5A015]' : team.rank === 2 ? 'text-[#94A3B8]' : team.rank === 3 ? 'text-[#B45309]' : 'text-[#02101B]'}`}>
                  #{team.rank}
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-2 border-l border-[#F1F5F9] pl-3">
                <p className="text-[#02101B] text-[15px] font-bold truncate w-full">{team.name}</p>
                <p className="text-[#8C9BA5] text-[11px] font-semibold uppercase tracking-wide truncate w-full">{team.major}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 bg-[#FFF9E5] px-3 py-1.5 rounded-full border border-[#FEF08A]">
                <img src={CoinIcon} alt="coin" className="w-4 h-4 object-contain" />
                <span className="font-extrabold text-[#E5A015] text-[15px]">{team.score}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-12 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50 border border-[#F1F5F9]">
          <Link to={`/pic/session-live/${id}`} className="opacity-30 hover:opacity-100 hover:scale-110 transition-all">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </Link>
          <button className="scale-110 opacity-100 drop-shadow-md">
            <img src={TrophyIcon} alt="Reward" className="w-7 h-7" />
          </button>
        </div>

      </div>
    </div>
  );
}