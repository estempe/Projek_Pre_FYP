import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- IMPORT ASSETS ---
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';
import CoinIcon from '../../assets/Coin3D.png';
import HomeIcon from '../../assets/Home-Icon.svg';
import TrophyIcon from '../../assets/Trophy-Icon.svg';

// --- DUMMY DATA: Simulasi Data dari Database Superadmin ---
// 1. Data Sesi & Pos
const sessionData = {
  id: "306523",
  name: "PRE FYP B30 - BATCH 1",
  globalCountdown: "01:34:00",
  // Nama pos didapat dari setting superadmin
  posList: [
    { id: "pos_1", name: "Story 1" },
    { id: "pos_2", name: "Story 2" },
    { id: "pos_3", name: "Story 3" }
  ]
};

// 2. Data Tim & Status Mereka per-Pos
const teamsData = [
  {
    id: "t1",
    name: "AdadehPokoknya",
    major: "Business Management",
    totalCoins: 310,
    // Status tim ini di setiap pos yang ada
    posStatus: {
      "pos_1": { state: "done", earnedCoins: 150 }, // Udah kelar di Story 1
      "pos_2": { state: "ongoing", countdown: "08:43" }, // Lagi ngerjain Story 2
      "pos_3": { state: "ready" } // Belum ke Game Area
    }
  },
  {
    id: "t2",
    name: "SehatSehatMaba",
    major: "Business Information Technology",
    totalCoins: 190,
    posStatus: {
      "pos_1": { state: "done", earnedCoins: 190 },
      "pos_2": { state: "ready" },
      "pos_3": { state: "ready" }
    }
  },
  {
    id: "t3",
    name: "TimHore",
    major: "Computer Science",
    totalCoins: 0,
    posStatus: {
      "pos_1": { state: "ready" },
      "pos_2": { state: "ready" },
      "pos_3": { state: "ongoing", countdown: "12:10" }
    }
  }
];

// --- KOMPONEN CARD TIM ---
const TeamCard = ({ team, selectedPosId, onSelesaiClick }) => {
  // Ambil status tim ini berdasarkan Pos yang sedang dipilih PIC
  const currentPosData = team.posStatus[selectedPosId];
  const state = currentPosData?.state || "ready";

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-white flex flex-col mb-4 relative z-10">
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

      {state !== 'ready' && <hr className="border-[#F1F5F9] mb-4" />}

      {/* STATE: ONGOING */}
      {state === 'ongoing' && (
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[#92A0AD] text-[11px] mb-1">Countdown</p>
            <p className="text-[#1D2B39] text-[20px] font-bold leading-none">{currentPosData.countdown}</p>
          </div>
          <button 
            onClick={() => onSelesaiClick(team)}
            // GANTI JADI DARK BLUE 3D SOLID
            className="w-fit bg-[#202E3C] text-white font-bold text-[13px] px-8 py-2 rounded-[10px] border border-[#16212C] shadow-[0_3px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[3px] transition-all"
          >
            Selesai
          </button>
        </div>
      )}

      {/* STATE: DONE */}
      {state === 'done' && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
             <img src={CoinIcon} alt="Coin" className="w-[14px] h-[14px] object-contain drop-shadow-sm" />
             <span className="text-[#1D2B39] font-semibold text-[13px]">+ {currentPosData.earnedCoins} BeeCoin</span>
          </div>
          <button disabled className="bg-[#92A0AD] text-white font-bold text-[13px] px-4 py-2 rounded-lg cursor-not-allowed">
            Sudah Check In
          </button>
        </div>
      )}

      {/* STATE: READY */}
      {state === 'ready' && (
        <div className="flex justify-center mt-2">
          {/* Tombol Check In (Biru, sesuai request: "yang belum buttonnya masih warna biru 'checkin'") */}
          <button className="w-fit bg-[#2E9AD7] text-white font-bold text-[13px] px-10 py-2.5 rounded-[10px] border border-[#2e84b6] shadow-[0_3px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0px_0_0_#1C6B99] active:translate-y-[3px] transition-all">
            Check In
          </button>
        </div>
      )}
    </div>
  );
};


// --- KOMPONEN UTAMA ---
export default function SessionLive() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk Dropdown Custom (Biar tampilannya bisa dikustom mirip dark-grey menu)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Default pilih pos pertama dari list
  const [selectedPos, setSelectedPos] = useState(sessionData.posList[0]);
  
  const dropdownRef = useRef(null);

  // Modal States
  const [modalState, setModalState] = useState('idle'); 
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scoreInput, setScoreInput] = useState('');

  // Menutup dropdown kalau klik di luar area
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  // Modal Handlers
  const handleSelesaiClick = (team) => {
    setSelectedTeam(team);
    setModalState('confirm');
  };
  const handleProceedToScoring = () => setModalState('scoring');
  const closeModal = () => {
    setModalState('idle');
    setSelectedTeam(null);
    setScoreInput('');
  };
  const handleSaveScore = () => {
    console.log(`Menyimpan koin ${scoreInput} untuk tim ${selectedTeam?.name} di ${selectedPos.name}`);
    closeModal();
  };

  // Filter tim berdasarkan search query
  const filteredTeams = teamsData.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12">
        
        {/* --- HEADER --- */}
        <div className="flex items-center mb-8">
          <button className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity absolute left-6 z-10">
            <img src={BackArrowDark} alt="Kembali" className="w-5 h-5" />
            Kembali
          </button>
        </div>

        {/* --- TITLE & CUSTOM DROPDOWN POS --- */}
        <div className="flex justify-between items-center mb-10 mt-4 relative z-30">
          <h1 className="text-[16px] font-bold text-[#1D2B39] w-[55%] leading-tight">
            {sessionData.name}
          </h1>
          
          {/* Custom Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm focus:outline-none"
            >
              <span className="text-[#92A0AD] font-semibold text-[13px] truncate max-w-[80px]">
                {selectedPos.name}
              </span>
              <svg className={`w-3 h-3 text-[#92A0AD] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            {/* Dropdown Menu (Dark Mode ala Figma) */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-max min-w-[120px] bg-[#4B5563] border border-[#374151] rounded-xl shadow-lg py-1.5 flex flex-col animate-fade-in">
                {sessionData.posList.map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => {
                      setSelectedPos(pos);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium hover:bg-[#374151] transition-colors w-full text-left
                      ${selectedPos.id === pos.id ? 'text-white' : 'text-gray-300'}
                    `}
                  >
                    {/* Centang (Hanya muncul di opsi yang aktif) */}
                    <svg className={`w-3.5 h-3.5 ${selectedPos.id === pos.id ? 'opacity-100' : 'opacity-0'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    {pos.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- GLOBAL TIMER --- */}
        <div className="text-center mb-8 relative z-10">
          <p className="text-[#92A0AD] text-[13px] font-medium mb-1">Waktu Bermain Tersisa</p>
          <p className="text-[#1D2B39] text-[48px] font-bold leading-none tracking-tight">
            {sessionData.globalCountdown}
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
            <TeamCard 
              key={team.id}
              team={team} 
              selectedPosId={selectedPos.id}
              onSelesaiClick={handleSelesaiClick}
            />
          ))}
          {filteredTeams.length === 0 && (
            <p className="text-center text-[#92A0AD] text-sm mt-4">Tim tidak ditemukan.</p>
          )}
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

        {/* --- AREA MODAL / POP-UP OVERLAY (Disembunyikan untuk ringkas, kodenya sama persis dengan versi sebelumnya) --- */}
        {/* ... (Paste ulang blok kode {modalState !== 'idle' && ( ... )} dari pesan sebelumnya ke sini) ... */}
        {modalState !== 'idle' && (
          <div className="fixed inset-0 bg-[#EBF2F8]/80 backdrop-blur-[2px] z-50 flex items-center justify-center px-6">
            
            {/* MODAL 1: KONFIRMASI AKHIRI SESI */}
            {modalState === 'confirm' && selectedTeam && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center text-center animate-fade-in-up">
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-8 leading-relaxed">
                  Akhiri sesi untuk team<br />
                  <span className="underline underline-offset-4 decoration-2">{selectedTeam.name}</span>?
                </h2>
                
                <div className="w-full flex flex-col gap-3">
                  <button 
                    onClick={handleProceedToScoring}
                    className="w-full bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#2e84b6] shadow-[0_4px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[4px] transition-all"
                  >
                    Ya, Akhiri
                  </button>
                  
                  <button 
                    onClick={closeModal}
                    className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#1D2B39] shadow-[0_4px_0_0_#1D2B39] hover:bg-gray-50 active:shadow-[0_0_0_0_#1D2B39] active:translate-y-[4px] transition-all"
                  >
                    Tidak Jadi
                  </button>
                </div>
              </div>
            )}

            {/* MODAL 2: TAMBAH/KURANG BeeCoin */}
            {modalState === 'scoring' && selectedTeam && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center animate-fade-in-up">
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-6 text-center leading-tight">
                  Tambah/Kurangkan<br />BeeCoin
                </h2>
                
                <input 
                  type="number" 
                  placeholder="0"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="w-full border border-[#CBD5E1] rounded-[14px] py-3.5 px-4 text-center text-[18px] text-[#1D2B39] font-bold placeholder-[#92A0AD] focus:outline-none focus:border-[#2E9AD7] mb-4"
                />

                <div className="w-full grid grid-cols-2 gap-4 mb-4">
                  <button 
                    onClick={() => setScoreInput((prev) => String(Number(prev || 0) - 5))}
                    className="bg-[#202E3C] text-white font-bold text-[20px] py-2 rounded-[12px] border border-[#16212C] shadow-[0_3px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[3px] transition-all"
                  >
                    -
                  </button>
                  <button 
                    onClick={() => setScoreInput((prev) => String(Number(prev || 0) + 5))}
                    className="bg-[#202E3C] text-white font-bold text-[20px] py-2 rounded-[12px] border border-[#16212C] shadow-[0_3px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[3px] transition-all"
                  >
                    +
                  </button>
                </div>

                <p className="text-center text-[#92A0AD] text-[10.5px] leading-relaxed px-2 mb-6">
                  Gunakan (-) untuk mengurangi jumlah BeeCoin, lalu Gunakan (+) untuk menambahkan jumlah BeeCoin
                </p>

                <button 
                  onClick={handleSaveScore}
                  className="w-full bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#2e84b6] shadow-[0_4px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[4px] transition-all"
                >
                  Selesai
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}