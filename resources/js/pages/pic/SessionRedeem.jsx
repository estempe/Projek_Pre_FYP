import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- IMPORT ASSETS KAMU ---
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';
import CoinIcon from '../../assets/Coin3D.png';
import HomeIcon from '../../assets/Home-Icon.svg';
import TrophyIcon from '../../assets/Trophy-Icon.svg';

// --- DUMMY DATA ---
const teamsData = [
  {
    id: "t1",
    name: "SehatSehatMaba",
    major: "Business Information Technology",
    totalCoins: 500,
    isRedeemed: true,
    redeemedAmount: 300
  },
  {
    id: "t2",
    name: "AdadehPokoknya",
    major: "Business Management",
    totalCoins: 400,
    isRedeemed: false,
    redeemedAmount: 0
  },
  {
    id: "t3",
    name: "TimHore",
    major: "Computer Science",
    totalCoins: 380,
    isRedeemed: false,
    redeemedAmount: 0
  },
  {
    id: "t4",
    name: "CariCuan",
    major: "Business Management",
    totalCoins: 320,
    isRedeemed: false,
    redeemedAmount: 0
  }
];

// --- KOMPONEN KARTU REDEEM (Layout persis seperti sesi berjalan) ---
const RedeemCard = ({ team, onTukarClick }) => {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-white flex flex-col mb-4 relative z-10">
      
      {/* Bagian Atas: Nama Tim & Koin */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[16px] font-bold text-[#1D2B39] leading-tight mb-1">{team.name}</h3>
          <p className="text-[#92A0AD] text-[11px] font-medium leading-none">{team.major}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FFF9E5] px-2.5 py-1.5 rounded-full">
          <img src={CoinIcon} alt="Coin" className="w-[14px] h-[14px] object-contain drop-shadow-sm" />
          <span className="text-[#E5A015] font-bold text-[13px]">{team.totalCoins}</span>
        </div>
      </div>

      <hr className="border-[#F1F5F9] mb-4" />

      {/* Bagian Bawah: Menggantikan area "Countdown" menjadi info Redeem */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[#92A0AD] text-[11px] mb-1">Status Koin</p>
          {team.isRedeemed ? (
            <div className="flex items-center gap-1">
              <span className="text-[#E53E3E] text-[18px] font-bold leading-none">- {team.redeemedAmount}</span>
              <span className="text-[#E53E3E] text-[12px] font-bold leading-none mt-1">Ditukar</span>
            </div>
          ) : (
            <p className="text-[#1D2B39] text-[18px] font-bold leading-none">Utuh</p>
          )}
        </div>
        
        {/* Tombol Aksi */}
        {team.isRedeemed ? (
          <button disabled className="w-fit bg-[#92A0AD] text-white font-bold text-[13px] px-8 py-2 rounded-[10px] cursor-not-allowed">
            Selesai
          </button>
        ) : (
          <button 
            onClick={() => onTukarClick(team)}
            className="w-fit bg-[#202E3C] text-white font-bold text-[13px] px-8 py-2 rounded-[10px] border border-[#16212C] shadow-[0_3px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[3px] transition-all"
          >
            Redeem
          </button>
        )}
      </div>

    </div>
  );
};


// --- KOMPONEN UTAMA ---
export default function SessionRedeem() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States: 'idle' | 'input' (Modal 1) | 'success' (Modal 2)
  const [modalState, setModalState] = useState('idle'); 
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [redeemInput, setRedeemInput] = useState('');

  // Handlers
  const handleTukarClick = (team) => {
    setSelectedTeam(team);
    setModalState('input'); // Buka Modal 1
  };

  const handleProsesTukar = () => {
    console.log(`Menukarkan ${redeemInput} koin untuk tim ${selectedTeam?.name}`);
    setModalState('success'); // Buka Modal 2
  };

  const handleSelesai = () => {
    setModalState('idle');
    setSelectedTeam(null);
    setRedeemInput('');
  };

  const filteredTeams = teamsData.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12">
        
        {/* --- HEADER --- */}
        <div className="flex items-center mb-8 relative z-10">
          <button className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity">
            <img src={BackArrowDark} alt="Kembali" className="w-5 h-5" />
            Kembali
          </button>
        </div>

        {/* --- NAMA SESI --- */}
        <h1 className="text-[16px] font-bold text-[#1D2B39] mb-10 leading-tight relative z-10">
          PRE FYP B30 - BATCH 1
        </h1>

        {/* --- STATUS BERAKHIR --- */}
        <div className="text-center mb-8 relative z-10">
          <p className="text-[#92A0AD] text-[13px] font-medium mb-1">Waktu Bermain Tersisa</p>
          <p className="text-[#1D2B39] text-[40px] font-bold leading-none tracking-tight">
            Sesi Berakhir
          </p>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="mb-6 relative z-10">
          <input 
            type="text" 
            placeholder="Cari team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#CBD5E1] rounded-[16px] py-3.5 px-5 text-[14px] text-[#1D2B39] placeholder-[#92A0AD] focus:outline-none focus:border-[#2E9AD7] shadow-sm transition-colors"
          />
        </div>

        {/* --- DAFTAR TEAM CARDS --- */}
        <div className="flex flex-col">
          {filteredTeams.map((team) => (
            <RedeemCard 
              key={team.id}
              team={team} 
              onTukarClick={handleTukarClick}
            />
          ))}
        </div>

        {/* --- BOTTOM NAVIGATION --- */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-40">
          <Link to="/pic/home" className="hover:scale-110 transition-transform">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </Link>
          <Link to="/pic/leaderboard" className="opacity-40 hover:opacity-100 hover:scale-110 transition-all">
            <img src={TrophyIcon} alt="Reward" className="w-7 h-7" />
          </Link>
        </div>


        {/* ================================================== */}
        {/* AREA MODAL / POP-UP OVERLAY                       */}
        {/* ================================================== */}
        {modalState !== 'idle' && (
          <div className="fixed inset-0 bg-[#EBF2F8]/80 backdrop-blur-[2px] z-50 flex items-center justify-center px-6">
            
            {/* MODAL 1: INPUT JUMLAH KOIN */}
            {modalState === 'input' && selectedTeam && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center text-center animate-fade-in-up">
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-6 leading-relaxed">
                  Kurangkan BeeCoin<br />
                  ({selectedTeam.name})
                </h2>
                
                <input 
                  type="number" 
                  placeholder="Jumlah koin yang ditukar..."
                  value={redeemInput}
                  onChange={(e) => setRedeemInput(e.target.value)}
                  className="w-full border border-[#CBD5E1] rounded-[14px] py-3.5 px-4 text-center text-[15px] text-[#1D2B39] font-medium placeholder-[#92A0AD] focus:outline-none focus:border-[#2E9AD7] mb-6"
                />

                <button 
                  onClick={handleProsesTukar}
                  className="w-full bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#2e84b6] shadow-[0_4px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[4px] transition-all"
                >
                  Tukarkan
                </button>
              </div>
            )}

            {/* MODAL 2: PENUKARAN BERHASIL */}
            {modalState === 'success' && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center text-center animate-fade-in-up">
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-8">
                  Penukaran Berhasil!
                </h2>

                <button 
                  onClick={handleSelesai}
                  className="w-full bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#2e84b6] shadow-[0_4px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[4px] transition-all"
                >
                  Oke, Lanjut
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}