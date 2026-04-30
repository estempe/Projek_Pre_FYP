import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- IMPORT ASSETS KAMU (Pastikan path ../../ benar) ---
import CoinIcon from '../../assets/Coin3D.png';
import HomeIcon from '../../assets/Home-Icon.svg';
import TrophyIcon from '../../assets/Trophy-Icon.svg';

// --- DUMMY DATA LEADERBOARD ---
const leaderboardData = [
  { id: "t1", rank: 1, name: "TeamPalingOke", major: "Business Management", score: 930, status: "Selesai" },
  { id: "t2", rank: 2, name: "JagonyaBinus", major: "Creative Communication", score: 852, status: "Selesai" },
  { id: "t3", rank: 3, name: "AdadehPokoknya", major: "Business Management", score: 310, status: null },
  { id: "t4", rank: 4, name: "Tes1234", major: "Business Information Technology", score: 220, status: null },
  { id: "t5", rank: 5, name: "SehatSehatMaba", major: "Business Information Technology", score: 190, status: null },
  { id: "t6", rank: 6, name: "SokSuciGitu", major: "Creative Communication", score: 184, status: null },
  { id: "t7", rank: 7, name: "KanKitaMahPinter", major: "Business Hotel Management", score: 100, status: null },
  { id: "t8", rank: 8, name: "LahKokGitu!", major: "Computer Science", score: 80, status: null },
];

export default function LeaderboardSuperadmin() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fungsi untuk Trigger Fullscreen Browser
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Listener untuk mendeteksi perubahan Fullscreen (misal user pencet ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={`min-h-screen bg-[#EBF2F8] font-sans flex justify-center transition-all duration-300 ${isFullscreen ? 'py-12' : 'pb-32'}`}>
      
      {/* Wrapper dinamis: Mode HP (max-w-md) vs Mode Proyektor (max-w-4xl) */}
      <div className={`w-full bg-[#EBF2F8] min-h-screen flex flex-col relative transition-all duration-500 ${isFullscreen ? 'max-w-4xl px-8' : 'max-w-md px-6 pt-16'}`}>
        
        {/* --- HEADER --- */}
        <div className="flex justify-center items-center mb-10 relative">
          <h1 className="text-[24px] font-bold text-[#1D2B39] tracking-wide">
            LEADERBOARD
          </h1>
          
          {/* Tombol Expand / Collapse Fullscreen */}
          <button 
            onClick={toggleFullScreen}
            className="absolute right-0 text-[#1D2B39] hover:opacity-70 transition-opacity p-2"
          >
            {isFullscreen ? (
              // Icon Collapse (Keluar Fullscreen)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9L4 4m0 5h5V4m6 5l5-5m-5 0h5v5m-5 6l5 5m0-5h-5v5m-6-5l-5 5m5 0H4v-5"></path></svg>
            ) : (
              // Icon Expand (Masuk Fullscreen)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
            )}
          </button>
        </div>

        {/* --- DAFTAR RANKING --- */}
        <div className="flex flex-col gap-3">
          {leaderboardData.map((team) => (
            <div 
              key={team.id}
              // Card styling pakai border-dashed sesuai desain
              className={`relative flex items-center justify-between p-4 rounded-2xl bg-white transition-all
                ${team.rank === 4 && !isFullscreen ? 'border-2 border-solid border-[#1D2B39] shadow-md' : 'border border-dashed border-[#CBD5E1] shadow-sm'}
              `}
            >
              <div className="flex items-center gap-4 w-full">
                {/* Ranking Angka */}
                <span className="text-[#92A0AD] font-bold text-[18px] w-6 text-center">
                  #{team.rank}
                </span>

                {/* Info Tim */}
                <div className="flex-1">
                  {/* Badge Selesai (Ungu) */}
                  {team.status === 'Selesai' && (
                    <span className="inline-block bg-[#8B18D6] text-white text-[10px] font-bold px-3 py-0.5 rounded-full mb-1">
                      Selesai
                    </span>
                  )}
                  <h3 className="text-[16px] font-bold text-[#1D2B39] leading-tight mb-0.5">
                    {team.name}
                  </h3>
                  <p className="text-[#92A0AD] text-[11px] font-medium leading-none">
                    {team.major}
                  </p>
                </div>

                {/* Score */}
                <div className="flex items-center gap-1.5 bg-[#FFF9E5] px-3 py-1.5 rounded-full">
                  <img src={CoinIcon} alt="Coin" className="w-[14px] h-[14px] object-contain drop-shadow-sm" />
                  <span className="text-[#E5A015] font-bold text-[14px]">{team.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- BOTTOM NAVIGATION (SUPERADMIN) --- */}
        {/* Sembunyikan navigasi bawah saat Fullscreen Mode (TV/Proyektor) */}
        {!isFullscreen && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50">
            
            {/* Home Icon (Inactive) */}
            <Link to="/superadmin/session/live" className="opacity-40 hover:opacity-100 hover:scale-110 transition-all">
              <img src={HomeIcon} alt="Home" className="w-7 h-7" />
            </Link>

            {/* Trophy Icon (Active) - Mengarah ke Leaderboard */}
            <button className="hover:scale-110 transition-transform">
              <img src={TrophyIcon} alt="Reward" className="w-7 h-7" />
            </button>
            
          </div>
        )}

      </div>
    </div>
  );
}