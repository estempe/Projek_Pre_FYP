import React from "react";
import { Link } from "react-router-dom";
// Pastikan path import ini sesuai dengan struktur folder assets-mu
import CoinIcon from "../../assets/coin3D.png";
import HomeIcon from "../../assets/Home-Icon.svg";
import TrophyIcon from "../../assets/Trophy-Icon.svg";

export default function Leaderboard() {
  // MOCK DATA: Nanti data ini di-fetch dari backend/database
  // isCurrentUser digunakan untuk menandai baris milik mahasiswa yang sedang buka app
  // isFinished digunakan untuk memunculkan badge ungu "Selesai"
  const leaderboardData = [
    { id: 1, rank: 1, name: "TeamPalingOke", major: "Business Management", score: 930, isFinished: true },
    { id: 2, rank: 2, name: "JagonyaBinus", major: "Creative Communication", score: 852, isFinished: true },
    { id: 3, rank: 3, name: "AdadehPokoknya", major: "Business Management", score: 310 },
    { id: 4, rank: 4, name: "Tes1234", major: "Business Information Technology", score: 220, isCurrentUser: true },
    { id: 5, rank: 5, name: "SehatSehatMaba", major: "Business Information Technology", score: 190 },
    { id: 6, rank: 6, name: "SokSuciGitu", major: "Creative Communication", score: 184 },
    { id: 7, rank: 7, name: "KanKitaMahPinter", major: "Business Hotel Management", score: 100 },
    { id: 8, rank: 8, name: "LahKokGitu!", major: "Computer Science", score: 80 },
  ];

  return (
    <div className="min-h-screen bg-[#E8F1F8] flex justify-center font-sans pb-32">
      <div className="w-full max-w-md min-h-screen flex flex-col relative">
        
        {/* --- HEADER --- */}
        <div className="pt-16 pb-8 flex justify-center">
          <h1 className="text-[22px] font-bold text-[#1D2A34] tracking-wide">
            LEADERBOARD
          </h1>
        </div>

        {/* --- LIST KLASEMEN --- */}
        <div className="px-6 flex flex-col gap-4">
          {leaderboardData.map((team) => (
            <div
              key={team.id}
              // Logika Dinamis: Jika isCurrentUser true, border hitam solid tebal. Kalau tidak, putus-putus.
              className={`flex items-center bg-white rounded-[20px] p-4 ${
                team.isCurrentUser
                  ? "border-2 border-[#02101B] shadow-sm"
                  : "border border-dashed border-[#A0B0BC] shadow-sm"
              }`}
            >
              
              {/* Kolom Rank (Kiri) */}
              <div className="w-10 shrink-0">
                <span 
                  className={`text-[18px] font-bold ${
                    team.isCurrentUser ? "text-[#02101B]" : "text-[#8C9BA5]"
                  }`}
                >
                  #{team.rank}
                </span>
              </div>

              {/* Kolom Info Tim (Tengah) */}
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
                
                {/* Badge Selesai (Ungu) */}
                {team.isFinished && (
                  <div className="w-fit bg-[#8900E8] text-white px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wide mb-1">
                    Selesai
                  </div>
                )}
                
                {/* Nama Tim */}
                <p className="text-[#02101B] text-[16px] font-medium truncate w-full">
                  {team.name}
                </p>
                
                {/* Jurusan */}
                <p className="text-[#8C9BA5] text-[11px] font-light truncate w-full">
                  {team.major}
                </p>
              </div>

              {/* Kolom Skor/Koin (Kanan) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <img src={CoinIcon} alt="coin" className="w-4 h-4 object-contain" />
                <span className="font-medium text-[#E5A015] text-[16px]">
                  {team.score}
                </span>
              </div>
              
            </div>
          ))}
        </div>

        {/* --- FLOATING BOTTOM NAVIGATION --- */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50">
          {/* Home Icon (Inactive) - Ganti jadi Link menuju /gameplay */}
          <Link to="/gameplay" className="opacity-40 hover:opacity-100 hover:scale-110 transition-all">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </Link>

          {/* Trophy Icon (Active) - Tetap tombol biasa karena kita sedang di Leaderboard */}
          <button className="hover:scale-110 opacity-100 transition-transform">
            <img src={TrophyIcon} alt="Reward" className="w-7 h-7" />
          </button>
        </div>

      </div>
    </div>
  );
}