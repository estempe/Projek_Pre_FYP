import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// --- IMPORT ASSETS ---
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';
import CoinIcon from '../../assets/Coin3D.png';
import HomeIcon from '../../assets/Home-Icon.svg';
import TrophyIcon from '../../assets/Trophy-Icon.svg';

const TeamCard = ({ team, selectedPosId, onSelesaiClick }) => {
  const currentPosData = team.posStatus ? team.posStatus[selectedPosId] : null;
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

      {state !== 'completed' && (
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[#92A0AD] text-[11px] mb-1">Status Tim</p>
            <p className="text-[#1D2B39] text-[14px] font-bold leading-none">Menunggu Penilaian</p>
          </div>
          <button 
            onClick={() => onSelesaiClick(team)}
            className="w-fit bg-[#202E3C] text-white font-bold text-[13px] px-8 py-2 rounded-[10px] border border-[#16212C] shadow-[0_3px_0_0_#101820] hover:bg-[#2a3c4e] active:translate-y-[3px] transition-all"
          >
            Nilai & Selesai
          </button>
        </div>
      )}

      {state === 'completed' && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
             <img src={CoinIcon} alt="Coin" className="w-[14px] h-[14px] object-contain drop-shadow-sm" />
             <span className="text-[#1D2B39] font-semibold text-[13px]">+ {currentPosData.earnedCoins} BeeCoin</span>
          </div>
          <button disabled className="bg-[#92A0AD] text-white font-bold text-[13px] px-4 py-2 rounded-lg cursor-not-allowed">
            Selesai Dinilai
          </button>
        </div>
      )}
    </div>
  );
};

export default function SessionLiveSuperadmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- PASTIKAN BARIS INI ADA ---
  const [timeLeftSec, setTimeLeftSec] = useState(null); 
  // ------------------------------

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPos, setSelectedPos] = useState(null);
  const dropdownRef = useRef(null);

  const [modalState, setModalState] = useState('idle'); 
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scoreInput, setScoreInput] = useState('');


  // 1. STATE SISA WAKTU (DALAM DETIK)
  const fetchLiveData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sessions/${id}/live`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setSessionData(result.session);
        setTeamsData(result.teams);
        setSelectedPos(prev => prev || (result.session.posts.length > 0 ? result.session.posts[0] : null));
        
        // --- LOGIKA SINKRONISASI ANTI-LOMPAT ---
        const serverTime = result.remaining_seconds;
        
        setTimeLeftSec(prev => {
          // Jika ini pertama kali ambil data, langsung pakai data server
          if (prev === null) return serverTime;

          // Hitung selisih antara timer di layar vs timer di server
          const diff = Math.abs(prev - serverTime);

          // Jika selisihnya kecil (di bawah 3 detik), abaikan data server.
          // Biarkan timer lokal yang jalan terus supaya tidak melompat.
          if (diff < 3) {
            return prev; 
          }

          // Jika selisih jauh (misal karena lag internet parah), paksa ikut server.
          return serverTime;
        });
      }
    } catch (error) {
      console.error("Gagal mengambil data live:", error);
    }
  };
  useEffect(() => {
    fetchLiveData();
    const intervalId = setInterval(() => { fetchLiveData(); }, 2000);
    return () => clearInterval(intervalId);
  }, [id]);

  // 3. EFEK LOKAL: MENGURANGI DETIK SETIAP 1 DETIK
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeftSec(prev => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // 4. FORMAT DETIK KE HH:MM:SS
  const formatTime = (totalSeconds) => {
    // Jika tidak valid atau waktu sudah habis, kembalikan 00:00:00
    if (!totalSeconds || totalSeconds <= 0) return "00:00:00";
    
    const safeSec = Math.floor(totalSeconds); 
    
    const h = Math.floor(safeSec / 3600);
    const m = Math.floor((safeSec % 3600) / 60);
    const s = safeSec % 60;
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };


  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeftSec(prev => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1; // Murni hanya dikurang 1 detik bulat
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

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

  const handleSaveScore = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sessions/${id}/finish-pos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ team_id: selectedTeam.id, post_id: selectedPos.id, coins: scoreInput || 0 })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        closeModal();
        fetchLiveData(); 
      } else {
        alert("Gagal menyimpan: " + result.message);
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const filteredTeams = teamsData.filter(team => team.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!sessionData || !selectedPos) return <div className="min-h-screen bg-[#EBF2F8] flex justify-center items-center font-bold text-[#92A0AD]">Menyiapkan Sesi Live...</div>;

  const displayTime = formatTime(timeLeftSec); 
  
  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12">
        
        <div className="flex items-center mb-8">
          <button onClick={() => navigate('/superadmin/home')} className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity absolute left-6 z-10">
            <img src={BackArrowDark} alt="Kembali" className="w-5 h-5" />
            Beranda
          </button>
        </div>

        <div className="flex justify-between items-center mb-10 mt-4 relative z-30">
          <h1 className="text-[16px] font-bold text-[#1D2B39] w-[55%] leading-tight">{sessionData.name}</h1>
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm focus:outline-none">
              <span className="text-[#92A0AD] font-semibold text-[13px] truncate max-w-[80px]">{selectedPos.name}</span>
              <svg className={`w-3 h-3 text-[#92A0AD] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-max min-w-[120px] bg-[#4B5563] border border-[#374151] rounded-xl shadow-lg py-1.5 flex flex-col z-50">
                {sessionData.posts.map((pos) => (
                  <button key={pos.id} onClick={() => { setSelectedPos(pos); setIsDropdownOpen(false); }} className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium hover:bg-[#374151] transition-colors w-full text-left ${selectedPos.id === pos.id ? 'text-white' : 'text-gray-300'}`}>
                    <svg className={`w-3.5 h-3.5 ${selectedPos.id === pos.id ? 'opacity-100' : 'opacity-0'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    {pos.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DI SINI LETAK TIMER BERDETAKNYA (SUDAH DIPERBAIKI) */}
        <div className="text-center mb-8 relative z-10">
          <p className="text-[#92A0AD] text-[13px] font-medium mb-1">Sisa Waktu</p>
          <p className={`text-[48px] font-bold leading-none tracking-tight ${timeLeftSec === 0 ? 'text-[#E53E3E]' : 'text-[#1D2B39]'}`}>
            {displayTime}
          </p>
        </div>

        <div className="mb-6 relative z-10">
          <input type="text" placeholder="Cari team..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-[#CBD5E1] rounded-[16px] py-3.5 px-5 text-[14px] text-[#1D2B39] placeholder-[#92A0AD] focus:outline-none focus:border-[#2E9AD7] shadow-sm transition-colors" />
        </div>

        <div className="flex flex-col">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} selectedPosId={selectedPos.id} onSelesaiClick={handleSelesaiClick} />
          ))}
          {filteredTeams.length === 0 && <p className="text-center text-[#92A0AD] text-sm mt-4">Belum ada tim yang mendaftar.</p>}
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-40">
          <Link to="/superadmin/home" className="hover:scale-110 transition-transform">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </Link>
          <Link to={`/superadmin/leaderboard/${id}`} className="opacity-40 hover:opacity-100 hover:scale-110 transition-all">
            <img src={TrophyIcon} alt="Reward" className="w-7 h-7" />
          </Link>
        </div>

        {modalState !== 'idle' && (
          <div className="fixed inset-0 bg-[#EBF2F8]/80 backdrop-blur-[2px] z-50 flex items-center justify-center px-6">
            {modalState === 'confirm' && selectedTeam && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-2xl flex flex-col items-center text-center">
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-8 leading-relaxed">Akhiri Pos untuk team<br /><span className="underline underline-offset-4 decoration-2">{selectedTeam.name}</span>?</h2>
                <div className="w-full flex flex-col gap-3">
                  <button onClick={handleProceedToScoring} className="w-full bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[12px] shadow-sm hover:bg-[#268bc4]">Ya, Beri Nilai</button>
                  <button onClick={closeModal} className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#1D2B39] hover:bg-gray-50">Batal</button>
                </div>
              </div>
            )}
            {modalState === 'scoring' && selectedTeam && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-2xl flex flex-col items-center">
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-6 text-center leading-tight">Beri / Kurangkan<br />BeeCoin</h2>
                <input type="number" placeholder="0" value={scoreInput} onChange={(e) => setScoreInput(e.target.value)} className="w-full border border-[#CBD5E1] rounded-[14px] py-3.5 px-4 text-center text-[18px] font-bold focus:outline-none focus:border-[#2E9AD7] mb-4" />
                <div className="w-full grid grid-cols-2 gap-4 mb-4">
                  <button onClick={() => setScoreInput(String(Number(scoreInput || 0) - 5))} className="bg-[#202E3C] text-white font-bold text-[20px] py-2 rounded-[12px]">-</button>
                  <button onClick={() => setScoreInput(String(Number(scoreInput || 0) + 5))} className="bg-[#202E3C] text-white font-bold text-[20px] py-2 rounded-[12px]">+</button>
                </div>
                <button onClick={handleSaveScore} className="w-full bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[12px] shadow-sm hover:bg-[#268bc4] mt-4">Simpan Nilai</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}