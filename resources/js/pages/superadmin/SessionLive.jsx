import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';
import CoinIcon from '../../assets/Coin3D.png';
import HomeIcon from '../../assets/Home-Icon.svg';
import TrophyIcon from '../../assets/Trophy-Icon.svg';

const PostTimer = ({ checkInTime, maxDuration }) => {
  const [timeLeft, setTimeLeft] = useState("00:00");

  useEffect(() => {
    if (!checkInTime || !maxDuration) return;
    const interval = setInterval(() => {
      const checkInMs = new Date(checkInTime.replace(' ', 'T')).getTime();
      const parts = maxDuration.split(':').map(Number);
      const durationMs = ((parts[0] * 3600) + (parts[1] * 60) + parts[2]) * 1000;
      const endMs = checkInMs + durationMs;
      const nowMs = new Date().getTime();
      const diffSec = Math.floor((endMs - nowMs) / 1000);

      if (diffSec <= 0) {
        setTimeLeft("00:00");
        clearInterval(interval);
      } else {
        const m = Math.floor(diffSec / 60).toString().padStart(2, '0');
        const s = (diffSec % 60).toString().padStart(2, '0');
        setTimeLeft(`${m}:${s}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [checkInTime, maxDuration]);

  return <p className="text-[28px] font-bold text-[#1D2B39] leading-none">{timeLeft}</p>;
};

const TeamCard = ({ team, selectedPosId, onCheckInClick, onSelesaiClick }) => {
  const currentPosData = team.posStatus ? team.posStatus[selectedPosId] : null;
  const state = currentPosData?.status || "locked"; 

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-white flex flex-col mb-4">
      <div className="mb-4">
        <h3 className="text-[16px] font-bold text-[#1D2B39] leading-tight mb-1">{team.name}</h3>
        <p className="text-[#92A0AD] text-[11px] font-medium leading-none">{team.major}</p>
      </div>
      
      <hr className="border-[#F1F5F9] mb-4" />

      {state === 'locked' && (
        <div className="flex justify-between items-center">
          <p className="text-[#92A0AD] text-[12px]">Tim belum check-in</p>
          <button 
            onClick={() => onCheckInClick(team)} 
            className="bg-[#E5A015] text-white font-bold text-[13px] px-6 py-2.5 rounded-lg shadow-md active:translate-y-[2px] transition-all"
          >
            Check In
          </button>
        </div>
      )}

      {state === 'active' && (
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-[#92A0AD] text-[12px] mb-1 font-semibold">Countdown</p>
            <PostTimer checkInTime={currentPosData.check_in_time} maxDuration={currentPosData.max_duration} />
          </div>
          <button 
            onClick={() => onSelesaiClick(team)} 
            className="bg-[#2E9AD7] text-white font-bold text-[15px] px-8 py-3.5 rounded-[12px] border-2 border-[#2e84b6] shadow-[0_4px_0_0_#1C6B99] active:shadow-none active:translate-y-[4px] transition-all"
          >
            Selesai
          </button>
        </div>
      )}

      {/* PERBAIKAN: Menambahkan Logo BeeCoin di Tampilan Selesai Dinilai */}
      {state === 'completed' && (
        <div className="flex justify-between items-center bg-[#F0FDF4] p-3 rounded-lg border border-[#DCFCE7]">
          <p className="text-[#166534] font-bold text-[13px]">Selesai Dinilai</p>
          <div className="flex items-center gap-1.5">
            <img src={CoinIcon} alt="BeeCoin" className="w-4 h-4 object-contain drop-shadow-sm" />
            <span className="text-[#1D2B39] font-extrabold text-[14px]">+{currentPosData.earnedCoins} BeeCoin</span>
          </div>
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
  const [selectedPos, setSelectedPos] = useState(null);
  const [timeLeftSec, setTimeLeftSec] = useState(null); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [modalState, setModalState] = useState('idle'); 
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scoreInput, setScoreInput] = useState('');

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
        if (!selectedPos) setSelectedPos(result.session.posts[0]);
        setTimeLeftSec(Math.floor(result.remaining_seconds));
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 3000);
    return () => clearInterval(interval);
  }, [id, selectedPos]);

  const handleCheckIn = async (team) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sessions/${id}/checkin-pos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ team_id: team.id, post_id: selectedPos.id })
      });
      if (response.ok) await fetchLiveData(); 
    } catch (e) { alert("Check-in gagal."); }
  };

  const handleSaveScore = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`/api/sessions/${id}/finish-pos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ team_id: selectedTeam.id, post_id: selectedPos.id, coins: scoreInput || 0 })
      });
      setModalState('idle');
      setScoreInput('');
      fetchLiveData();
    } catch (e) { console.error(e); }
  };

  const formatSessionTime = (sec) => {
    if (!sec || sec <= 0) return "00:00:00";
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (!sessionData || !selectedPos) return <div className="min-h-screen bg-[#EBF2F8] flex justify-center items-center font-bold text-[#92A0AD]">Menyiapkan Sesi...</div>;

  return (
    <div className="min-h-screen bg-[#EBF2F8] pb-32">
      <div className="w-full max-w-md mx-auto px-6 pt-12">
        <button onClick={() => navigate('/superadmin/home')} className="flex items-center gap-1.5 font-bold mb-8">
           <img src={BackArrowDark} className="w-5 h-5" alt="Back" /> Kembali
        </button>
        
        {/* DROPDOWN POS (Kanan Atas) */}
        <div className="flex justify-between items-center mb-10 mt-4 relative z-30">
          <h1 className="text-[15px] font-bold text-[#1D2B39] w-[55%] leading-tight uppercase tracking-tight">{sessionData.name}</h1>
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-white border border-[#CBD5E1] rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm text-[13px] font-bold text-[#92A0AD]">
              <span className="truncate max-w-[80px]">{selectedPos.name}</span>
              <svg className={`w-3 h-3 text-[#92A0AD] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-max min-w-[160px] bg-[#4B5563] rounded-2xl shadow-xl py-2 flex flex-col z-50 overflow-hidden animate-fade-in">
                {sessionData.posts.map((pos) => (
                  <button key={pos.id} onClick={() => { setSelectedPos(pos); setIsDropdownOpen(false); }} className={`flex items-center gap-3 px-5 py-3 text-[13px] font-bold transition-colors w-full text-left ${selectedPos.id === pos.id ? 'bg-[#374151] text-white' : 'text-gray-300 hover:bg-[#374151]'}`}>
                    {pos.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-10 text-center">
          <p className="text-[#92A0AD] text-[12px] font-bold mb-1 uppercase tracking-widest">Sisa Waktu Sesi</p>
          <p className="text-[48px] font-bold text-[#1D2B39] leading-none">
            {formatSessionTime(timeLeftSec)}
          </p>
        </div>

        <div className="flex flex-col">
          {teamsData.map((team) => (
            <TeamCard 
              key={`${team.id}-${selectedPos.id}-${team.posStatus?.[selectedPos.id]?.status}`} 
              team={team} 
              selectedPosId={selectedPos.id} 
              onCheckInClick={handleCheckIn} 
              onSelesaiClick={(t) => { setSelectedTeam(t); setModalState('scoring'); }} 
            />
          ))}
        </div>

        {/* Modal Nilai */}
        {modalState === 'scoring' && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-6">
            <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-2xl flex flex-col items-center">
              <h2 className="text-[18px] font-bold mb-6 text-[#1D2B39]">Beri BeeCoin: {selectedTeam?.name}</h2>
              <input 
                type="number" 
                value={scoreInput} 
                onChange={(e) => setScoreInput(e.target.value)} 
                className="w-full border rounded-xl py-4 text-center text-[24px] font-bold mb-6 outline-none focus:border-[#2E9AD7]" 
              />
              
              <div className="w-full grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => setScoreInput(String(Number(scoreInput || 0) - 5))} 
                  className="bg-[#202E3C] text-white font-bold text-[22px] py-3 rounded-xl hover:bg-[#16212c]"
                >
                  -
                </button>
                <button 
                  onClick={() => setScoreInput(String(Number(scoreInput || 0) + 5))} 
                  className="bg-[#202E3C] text-white font-bold text-[22px] py-3 rounded-xl hover:bg-[#16212c]"
                >
                  +
                </button>
              </div>

              <button 
                onClick={handleSaveScore} 
                className="w-full bg-[#2E9AD7] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#268bc4]"
              >
                Simpan & Selesaikan
              </button>
              <button onClick={() => setModalState('idle')} className="w-full py-2 mt-2 text-[#92A0AD] font-bold">Batal</button>
            </div>
          </div>
        )}

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-12 py-5 shadow-xl flex items-center gap-12 z-40 border border-[#F1F5F9]">
          <Link to="/superadmin/home"><img src={HomeIcon} alt="Home" className="w-7 h-7" /></Link>
          <Link to={`/superadmin/leaderboard/${id}`} className="opacity-30"><img src={TrophyIcon} alt="Reward" className="w-7 h-7" /></Link>
        </div>
      </div>
    </div>
  );
}