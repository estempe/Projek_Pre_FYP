import React from "react";
import { Link } from "react-router-dom";
// Ganti path import ini menyesuaikan nama file yang kamu simpan di folder assets
import CoinIcon from "../../assets/coin3D.png";
import CheckGreenIcon from "../../assets/Visited-Pos.png";
import FlagActiveIcon from "../../assets/Active-Pos.png";
import FlagLockedIcon from "../../assets/Locked-Pos.png";
import GiftBoxIcon from "../../assets/gift-box.png";
import HomeIcon from "../../assets/Home-Icon.svg";
import TrophyIcon from "../../assets/Trophy-Icon.svg";

export default function MainGameplay() {
  // MOCK DATA: Status timeline (Nanti diatur sama backend/state)
  const pos_item = [
    {
      id: 1,
      title: "STORY 1",
      location: "LANTAI 1",
      status: "completed", // completed | active | locked | reward
      reward: "+ 220 BeeCoin",
    },
    {
      id: 2,
      title: "STORY 2",
      location: "LANTAI 1",
      status: "active",
      countdown: "8:43",
    },
    {
      id: 3,
      title: "STORY 3",
      location: "LANTAI 2 - WING A",
      status: "locked",
    },
    {
      id: 4,
      title: "STORY 4",
      location: "LANTAI 3 - DEPAN LKC",
      status: "locked",
    },
    {
      id: 5,
      title: "STORY 5",
      location: "LANTAI 4 - WING B",
      status: "locked",
    },
    {
      id: 6,
      title: "TUKAR HADIAH",
      location: "MMG (Lantai 2)",
      status: "reward",
    },
  ];

  // Helper untuk menentukan icon berdasarkan status
  const getIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckGreenIcon;
      case "active":
        return FlagActiveIcon;
      case "locked":
        return FlagLockedIcon;
      case "reward":
        return GiftBoxIcon;
      default:
        return FlagLockedIcon;
    }
  };

  return (
    // Background Light Blue sesuai desain awal
    <div className="min-h-screen bg-[#E8F1F8] flex justify-center font-sans pb-28">
      <div className="w-full max-w-md min-h-screen flex flex-col relative">
        {/* --- 1. TOP HEADER SECTION (BeeCoin Score) --- */}
        <div className="flex flex-col items-center pt-12">
          <div className="flex items-center gap-3">
            <img src={CoinIcon} alt="BeeCoin" className="w-10 h-10" />
            <h1 className="text-[44px] font-bold text-[#02101B] leading-none tracking-tight mt-1">
              220
            </h1>
          </div>
          {/* Font mono untuk tulisan BeeCoin agar mirip typewriter di desain */}
          <p className="font-mono text-[#8C9BA5] text-[18px] tracking-widest mt-1">
            BeeCoin
          </p>
        </div>

        {/* --- 2. INFO CARD SECTION --- */}
        <div className="mx-6 mt-8 bg-white rounded-[20px] p-5 border border-dashed border-[#B5C5D1] shadow-sm relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[#546878] text-[13px] font-bold uppercase">
                PRE FYP B30 - BATCH 1
              </p>
              <p className="text-[#546878] text-[13px] font-bold uppercase">
                
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#8C9BA5] text-[11px] mb-0.5">Waktu Tersisa</p>
              <p className="text-[#02101B] text-[18px] font-bold">01:34:00</p>
            </div>
          </div>

          <button className="w-full bg-[#1D2A34] text-white py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H14v4h4v-4h3v-4h-8.35zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
            Akses Cadangan Tim
          </button>
        </div>

        {/* --- 3. TIMELINE SECTION --- */}
        <div className="px-8 mt-10">
          {pos_item.map((pos, index) => {
            const isLast = index === pos_item.length - 1;

            return (
              <div key={pos.id} className="flex gap-5">
                {/* Kolom Kiri: Ikon & Garis Putus-putus */}
                <div className="flex flex-col items-center w-16 shrink-0">
                  <img
                    src={getIcon(pos.status)}
                    alt="status icon"
                    className="w-14 h-14 object-contain drop-shadow-md z-10"
                  />
                  {/* Render garis putus-putus KECUALI di item terakhir */}
                  {!isLast && (
                    <div className="flex-1 w-0 border-l-2 border-dashed border-[#A0B0BC] my-2 min-h-[40px]"></div>
                  )}
                </div>

                {/* Kolom Kanan: Detail Konten */}
                <div className={`flex-1 ${!isLast ? "pb-8" : "pb-4"} pt-1`}>
                  <h2 className="text-[18px] font-bold text-[#02101B]">
                    {pos.title}
                  </h2>

                  <div className="flex items-center gap-1.5 mt-0.5 mb-2">
                    <span className="text-[#D7392E] text-[12px]">📍</span>
                    <p className="text-[#8C9BA5] text-[12px] font-bold uppercase tracking-wide">
                      {pos.location}
                    </p>
                  </div>

                  {/* Pills Status */}
                  {pos.status === "completed" && (
                    <div className="inline-flex items-center gap-1.5 bg-[#A3C756] px-3 py-1 rounded-full text-white text-[12px] font-bold shadow-sm">
                      <img src={CoinIcon} alt="coin" className="w-4 h-4" />
                      <p className="font-light">{pos.reward}</p>
                    </div>
                  )}

                  {pos.status === "active" && (
                    <>
                      <div className="inline-flex items-center gap-1 bg-[#2E9AD7] px-3 py-1 rounded-full text-white text-[12px] font-bold shadow-sm">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <p className="font-light">Checked In</p>
                      </div>

                      {/* Kotak Countdown khusus state active */}
                      <div className="bg-white rounded-xl p-3 mt-3 shadow-sm max-w-[200px]">
                        <p className="text-[#8C9BA5] text-[10px] uppercase font-light mb-0.5">
                          Countdown
                        </p>
                        <p className="text-[#02101B] text-[20px] font-bold leading-none">
                          {pos.countdown}
                        </p>
                      </div>
                    </>
                  )}

                  {pos.status === "locked" && (
                    <div className="inline-flex items-center gap-1 bg-[#BFBFBF] px-3 py-1 rounded-full text-[#FFFFFF] text-[12px] font-bold shadow-sm">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                      <p className="font-light">Belum Checked In</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- 4. FLOATING BOTTOM NAVIGATION --- */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50">
          {/* Home Icon (Active) - Tetap tombol biasa karena kita sedang di Home */}
          <button className="hover:scale-110 transition-transform">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </button>

          {/* Trophy Icon (Inactive) - Ganti jadi Link menuju /leaderboard */}
          <Link to="/leaderboard" className="opacity-40 hover:opacity-100 hover:scale-110 transition-all">
            <img src={TrophyIcon} alt="Reward" className="w-7 h-7" />
          </Link>
        </div>
      </div>
    </div>
  );
}
