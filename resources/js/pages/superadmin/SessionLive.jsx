import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- IMPORT ASSETS ---
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';
import CoinIcon from '../../assets/Coin3D.png';
import HomeIcon from '../../assets/Home-Icon.svg';
import TrophyIcon from '../../assets/Trophy-Icon.svg';

// --- DUMMY DATA ---
const sessionData = {
  id: "306523",
  name: "PRE FYP B30 - BATCH 1",
  globalCountdown: "01:34:00",
  posList: [
    { id: "pos_1", name: "POS 1" },
    { id: "pos_2", name: "POS 2" }
  ]
};

const teamsData = [
  {
    id: "t1",
    name: "AdadehPokoknya",
    major: "Business Management",
    totalCoins: 310,
    posStatus: { "pos_1": { state: "ongoing", countdown: "8:43" } }
  },
  {
    id: "t2",
    name: "SehatSehatMaba",
    major: "Business Information Technology",
    totalCoins: 190,
    posStatus: { "pos_1": { state: "done", earnedCoins: 190 } }
  },
  {
    id: "t3",
    name: "AdadehPokoknya",
    major: "Business Management",
    totalCoins: 310,
    posStatus: { "pos_1": { state: "ready" } }
  },
  {
    id: "t4",
    name: "AdadehPokoknya",
    major: "Business Management",
    totalCoins: 310,
    posStatus: { "pos_1": { state: "ready" } }
  }
];

// --- KOMPONEN CARD TIM (VERSI SUPERADMIN) ---
const TeamCardSuperadmin = ({ team, selectedPosId, onSelesaiClick, onEditPoinClick, onHapusClick }) => {
  const currentPosData = team.posStatus[selectedPosId] || { state: "ready" };
  const state = currentPosData.state;

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-white flex flex-col mb-4 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[16px] font-bold text-[#1D2B39] leading-tight mb-1">{team.name}</h3>
          <p className="text-[#92A0AD] text-[11px] font-medium leading-none mb-2.5">{team.major}</p>
          
          {/* FITUR DEWA 1: HAPUS TEAM */}
          <button 
            onClick={() => onHapusClick(team)}
            className="flex items-center gap-1.5 text-[#E53E3E] text-[12px] font-bold hover:opacity-70 transition-opacity w-fit"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            <span className="underline underline-offset-2">Hapus Team</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FFF9E5] px-2.5 py-1.5 rounded-full">
          <img src={CoinIcon} alt="Coin" className="w-[14px] h-[14px] object-contain drop-shadow-sm" />
          <span className="text-[#E5A015] font-bold text-[13px]">{team.totalCoins}</span>
        </div>
      </div>

      <hr className="border-[#F1F5F9] mb-4" />

      {state === 'ongoing' && (
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[#92A0AD] text-[11px] mb-1">Countdown</p>
            <p className="text-[#1D2B39] text-[20px] font-bold leading-none">{currentPosData.countdown}</p>
          </div>
          <button onClick={() => onSelesaiClick(team)} className="w-fit bg-[#2E9AD7] text-white font-bold text-[13px] px-8 py-2.5 rounded-[10px] border border-[#2e84b6] shadow-[0_3px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0px_0_0_#1C6B99] active:translate-y-[3px] transition-all">
            Selesai
          </button>
        </div>
      )}

      {state === 'done' && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
             <img src={CoinIcon} alt="Coin" className="w-[14px] h-[14px] object-contain drop-shadow-sm" />
             <span className="text-[#1D2B39] font-semibold text-[13px]">+ {currentPosData.earnedCoins} BeeCoin</span>
          </div>
          <button onClick={() => onEditPoinClick(team)} className="w-fit bg-[#E5A015] text-white font-bold text-[13px] px-6 py-2 rounded-[10px] border border-[#D48A10] shadow-[0_3px_0_0_#B47608] hover:bg-[#d89613] active:shadow-[0_0px_0_0_#B47608] active:translate-y-[3px] transition-all">
            Edit Poin
          </button>
        </div>
      )}

      {state === 'ready' && (
        <div className="flex justify-center mt-2">
          <button className="w-fit bg-[#202E3C] text-white font-bold text-[13px] px-10 py-2.5 rounded-[10px] border border-[#16212C] shadow-[0_3px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[3px] transition-all">
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
  // const navigate = useNavigate(); // <-- Nanti nyalakan ini untuk auto-redirect
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPos, setSelectedPos] = useState(sessionData.posList[0]);
  const dropdownRef = useRef(null);

  // Modal States ('idle', 'confirm', 'scoring', 'end_session')
  const [modalState, setModalState] = useState('idle'); 
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scoreInput, setScoreInput] = useState('');

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelesaiClick = (team) => { setSelectedTeam(team); setModalState('confirm'); };
  const handleEditPoinClick = (team) => { setSelectedTeam(team); setModalState('scoring'); };
  const handleHapusClick = (team) => alert(`Fitur Hapus Team ${team.name} ditekan!`);
  const handleProceedToScoring = () => setModalState('scoring');
  const handleEndSessionClick = () => setModalState('end_session'); // Trigger Modal End Session
  
  const closeModal = () => {
    setModalState('idle');
    setSelectedTeam(null);
    setScoreInput('');
  };

  const handleSaveScore = () => {
    console.log(`Menyimpan koin ${scoreInput} untuk tim ${selectedTeam?.name}`);
    closeModal();
  };

  const processEndSession = () => {
    console.log("Sesi diakhiri secara manual oleh Superadmin!");
    closeModal();
    // navigate('/superadmin/session/redeem'); // <-- Nanti jalankan ini untuk pindah ke halaman Redeem
    alert("Sesi Berhasil Diakhiri! (Simulasi redirect ke halaman Redeem)");
  };

  const filteredTeams = teamsData.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12">
        
        {/* HEADER & DROPDOWN ... */}
        <div className="flex items-center mb-8">
          <Link to="/superadmin/home" className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity absolute left-6 z-10">
            <img src={BackArrowDark} alt="Kembali" className="w-5 h-5" />
            Kembali
          </Link>
        </div>

        <div className="flex justify-between items-center mb-10 mt-4 relative z-30">
          <h1 className="text-[16px] font-bold text-[#1D2B39] w-[60%] leading-tight">{sessionData.name}</h1>
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm focus:outline-none">
              <span className="text-[#92A0AD] font-semibold text-[13px] truncate max-w-[80px]">{selectedPos.name}</span>
              <svg className={`w-3 h-3 text-[#92A0AD] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-max min-w-[120px] bg-[#4B5563] border border-[#374151] rounded-xl shadow-lg py-1.5 flex flex-col animate-fade-in">
                {sessionData.posList.map((pos) => (
                  <button key={pos.id} onClick={() => { setSelectedPos(pos); setIsDropdownOpen(false); }} className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium hover:bg-[#374151] transition-colors w-full text-left ${selectedPos.id === pos.id ? 'text-white' : 'text-gray-300'}`}>
                    <svg className={`w-3.5 h-3.5 ${selectedPos.id === pos.id ? 'opacity-100' : 'opacity-0'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    {pos.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-8 relative z-10">
          <p className="text-[#92A0AD] text-[13px] font-medium mb-1">Waktu Bermain Tersisa</p>
          <p className="text-[#1D2B39] text-[48px] font-bold leading-none tracking-tight">{sessionData.globalCountdown}</p>
        </div>

        <div className="mb-6 relative z-10">
          <input type="text" placeholder="Cari team..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-[#CBD5E1] rounded-[16px] py-3.5 px-5 text-[14px] text-[#1D2B39] placeholder-[#92A0AD] focus:outline-none focus:border-[#2E9AD7] shadow-sm transition-colors" />
        </div>

        <div className="flex flex-col">
          {filteredTeams.map((team) => (
            <TeamCardSuperadmin key={team.id} team={team} selectedPosId={selectedPos.id} onSelesaiClick={handleSelesaiClick} onEditPoinClick={handleEditPoinClick} onHapusClick={handleHapusClick} />
          ))}
        </div>

        {/* --- TOMBOL AKHIRI SESI SEKARANG (KHUSUS SUPERADMIN) --- */}
        <div className="mt-6 mb-10">
          <button 
            onClick={handleEndSessionClick}
            className="w-full bg-[#E53E3E] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#C53030] shadow-[0_4px_0_0_#9B2C2C] hover:bg-[#C53030] active:shadow-[0_0_0_0_#9B2C2C] active:translate-y-[4px] transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg>
            Akhiri Sesi Sekarang
          </button>
        </div>

        {/* BOTTOM NAVIGATION ... */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-40">
          <Link to="/superadmin/home" className="hover:scale-110 transition-transform"><img src={HomeIcon} alt="Home" className="w-7 h-7" /></Link>
          <Link to="/superadmin/leaderboard" className="opacity-40 hover:opacity-100 hover:scale-110 transition-all"><img src={TrophyIcon} alt="Reward" className="w-7 h-7" /></Link>
        </div>

        {/* ================================================== */}
        {/* AREA MODAL / POP-UP OVERLAY                       */}
        {/* ================================================== */}
        {modalState !== 'idle' && (
          <div className="fixed inset-0 bg-[#EBF2F8]/80 backdrop-blur-[2px] z-50 flex items-center justify-center px-6">
            
            {/* MODAL 1: KONFIRMASI SELSAI TEAM ... */}
            {modalState === 'confirm' && selectedTeam && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center text-center animate-fade-in-up">
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-8 leading-relaxed">
                  Akhiri sesi untuk team<br /><span className="underline underline-offset-4 decoration-2">{selectedTeam.name}</span>?
                </h2>
                <div className="w-full flex flex-col gap-3">
                  <button onClick={handleProceedToScoring} className="w-full bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#2e84b6] shadow-[0_4px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[4px] transition-all">Ya, Akhiri</button>
                  <button onClick={closeModal} className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#1D2B39] shadow-[0_4px_0_0_#1D2B39] hover:bg-gray-50 active:shadow-[0_0_0_0_#1D2B39] active:translate-y-[4px] transition-all">Tidak Jadi</button>
                </div>
              </div>
            )}

            {/* MODAL 2: SCORING ... */}
            {modalState === 'scoring' && selectedTeam && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center animate-fade-in-up">
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-6 text-center leading-tight">Tambah/Kurangkan<br />BeeCoin</h2>
                <input type="number" placeholder="0" value={scoreInput} onChange={(e) => setScoreInput(e.target.value)} className="w-full border border-[#CBD5E1] rounded-[14px] py-3.5 px-4 text-center text-[18px] text-[#1D2B39] font-bold placeholder-[#92A0AD] focus:outline-none focus:border-[#2E9AD7] mb-4" />
                <div className="w-full grid grid-cols-2 gap-4 mb-4">
                  <button onClick={() => setScoreInput((prev) => String(Number(prev || 0) - 5))} className="bg-[#202E3C] text-white font-bold text-[20px] py-2 rounded-[12px] border border-[#16212C] shadow-[0_3px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[3px] transition-all">-</button>
                  <button onClick={() => setScoreInput((prev) => String(Number(prev || 0) + 5))} className="bg-[#202E3C] text-white font-bold text-[20px] py-2 rounded-[12px] border border-[#16212C] shadow-[0_3px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[3px] transition-all">+</button>
                </div>
                <p className="text-center text-[#92A0AD] text-[10.5px] leading-relaxed px-2 mb-6">Gunakan (-) untuk mengurangi jumlah BeeCoin, lalu Gunakan (+) untuk menambahkan jumlah BeeCoin</p>
                <button onClick={handleSaveScore} className="w-full bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#2e84b6] shadow-[0_4px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[4px] transition-all">Selesai</button>
              </div>
            )}

            {/* MODAL 3: KONFIRMASI END SESSION DARURAT (KHUSUS SUPERADMIN) */}
            {modalState === 'end_session' && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center text-center animate-fade-in-up">
                
                {/* Warning Icon Container */}
                <div className="w-14 h-14 bg-[#FEE2E2] text-[#E53E3E] rounded-full flex items-center justify-center mb-5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-3 leading-relaxed">
                  Yakin ingin mengakhiri<br />sesi sekarang?
                </h2>
                
                <p className="text-[#92A0AD] text-[12px] mb-8 px-2">
                  Semua tim akan langsung diarahkan ke halaman penukaran hadiah. Tindakan ini tidak bisa dibatalkan.
                </p>
                
                <div className="w-full flex flex-col gap-3">
                  <button 
                    onClick={processEndSession}
                    className="w-full bg-[#E53E3E] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#C53030] shadow-[0_4px_0_0_#9B2C2C] hover:bg-[#C53030] active:shadow-[0_0_0_0_#9B2C2C] active:translate-y-[4px] transition-all"
                  >
                    Ya, Akhiri Sesi
                  </button>
                  
                  <button 
                    onClick={closeModal}
                    className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#1D2B39] shadow-[0_4px_0_0_#1D2B39] hover:bg-gray-50 active:shadow-[0_0_0_0_#1D2B39] active:translate-y-[4px] transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}