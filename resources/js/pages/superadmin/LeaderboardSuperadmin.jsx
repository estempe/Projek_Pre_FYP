import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CoinIcon from "../../assets/Coin3D.png";
import HomeIcon from "../../assets/Home-Icon.svg";
import TrophyIcon from "../../assets/Trophy-Icon.svg";

export default function LeaderboardSuperadmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/sessions/${id}/leaderboard`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const result = await response.json();
        if (response.ok && result.success) {
          setLeaderboardData(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 1. Panggil data pertama kali saat halaman dibuka
    fetchLeaderboard();

    // 2. Buat interval untuk memanggil data ulang setiap 5 detik (5000 ms)
    const intervalId = setInterval(() => {
      fetchLeaderboard();
    }, 2000);

    // 3. Bersihkan interval saat Superadmin pindah ke halaman lain agar tidak bocor (memory leak)
    return () => clearInterval(intervalId);
  }, [id]);

  return (
    <div className="min-h-screen bg-[#E8F1F8] flex justify-center font-sans pb-32">
      <div className="w-full max-w-md min-h-screen flex flex-col relative">
        <div className="pt-12 px-6 flex justify-between items-center">
           <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#1D2B39] font-bold text-[15px]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            Kembali
          </button>
          {/* Tombol Menuju Halaman Redeem Kasir */}
          <button onClick={() => navigate(`/superadmin/session/redeem/${id}`)} className="bg-[#2E9AD7] text-white text-[12px] font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-[#268bc4]">
            Buka Kasir Redeem
          </button>
        </div>

        <div className="pt-8 pb-8 flex justify-center">
          <h1 className="text-[22px] font-bold text-[#1D2A34] tracking-wide">LEADERBOARD</h1>
        </div>

        <div className="px-6 flex flex-col gap-4">
          {isLoading ? <p className="text-center text-gray-500">Memuat klasemen...</p> : leaderboardData.length === 0 ? <p className="text-center text-gray-500">Belum ada tim.</p> : null}
          {leaderboardData.map((team) => (
            <div key={team.id} className="flex items-center bg-white rounded-[20px] p-4 border border-[#CBD5E1] shadow-sm">
              <div className="w-10 shrink-0">
                <span className="text-[18px] font-bold text-[#02101B]">#{team.rank}</span>
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
                <p className="text-[#02101B] text-[16px] font-medium truncate w-full">{team.name}</p>
                <p className="text-[#8C9BA5] text-[11px] font-light truncate w-full">{team.major}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <img src={CoinIcon} alt="coin" className="w-4 h-4 object-contain" />
                <span className="font-medium text-[#E5A015] text-[16px]">{team.score}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50">
          <Link to={`/superadmin/session/live/${id}`} className="opacity-40 hover:opacity-100 hover:scale-110 transition-all">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </Link>
          <button className="hover:scale-110 opacity-100 transition-transform">
            <img src={TrophyIcon} alt="Reward" className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}