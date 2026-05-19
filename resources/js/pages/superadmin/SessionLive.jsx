import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';
import CoinIcon from '../../assets/Coin3D.png';
import HomeIcon from '../../assets/Home-Icon.svg';
import TrophyIcon from '../../assets/Trophy-Icon.svg';

const TeamCard = React.memo(({ team, selectedPosId, teamRoute, onCheckInClick, onSelesaiClick }) => {
  const currentPosData = team.posStatus ? team.posStatus[selectedPosId] : null;
  const state = currentPosData?.status || "locked";

  let eligiblePosId = teamRoute.length > 0 ? teamRoute[0].id : null;
  let activePosId = null;

  for (let i = 0; i < teamRoute.length; i++) {
    const pId = teamRoute[i].id;
    const pStatus = team.posStatus?.[pId]?.status || "locked";

    if (pStatus === "active") {
      activePosId = pId;
      eligiblePosId = pId;
      break;
    }

    if (pStatus === "completed") {
      if (i + 1 < teamRoute.length) {
        eligiblePosId = teamRoute[i + 1].id;
      } else {
        eligiblePosId = null;
      }
    } else {
      eligiblePosId = pId;
      break;
    }
  }

  const isEligible = (selectedPosId === eligiblePosId);

  return (
    <div className="bg-white rounded-[16px] py-3 px-5 shadow-sm border border-white flex flex-col mb-3 shrink-0">
      <div className="mb-2">
        <h3 className="text-[14px] font-bold text-[#1D2B39] leading-tight mb-0.5">{team.name}</h3>
        <p className="text-[#92A0AD] text-[10px] font-medium leading-none">{team.major}</p>
      </div>

      <hr className="border-[#F1F5F9] mb-2" />

      {state === 'locked' && (
        <div className="flex justify-between items-center">
          <p className="text-[#92A0AD] text-[11px]">
            {isEligible ? "Siap Check-In" : activePosId ? "Sedang di pos lain" : "Belum urutannya"}
          </p>

          {isEligible ? (
            <button
              onClick={() => onCheckInClick(team)}
              className="bg-[#E5A015] text-white font-bold text-[12px] px-5 py-1.5 rounded-lg shadow-sm active:translate-y-[1px] transition-all"
            >
              Check In
            </button>
          ) : (
            <button disabled className="bg-[#CBD5E1] text-white font-bold text-[12px] px-5 py-1.5 rounded-lg cursor-not-allowed">
              Terkunci
            </button>
          )}
        </div>
      )}

      {state === 'active' && (
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-[#92A0AD] text-[11px] mb-0.5 font-semibold">Status</p>
            <span className="font-mono bg-[#FFF1F2] text-[#E11D48] px-2 py-0.5 rounded text-[10px] font-bold border border-[#FECDD3]">Sedang Bermain</span>
          </div>
          <button onClick={() => onSelesaiClick(team)} className="bg-[#2E9AD7] text-white font-bold text-[13px] px-6 py-2 rounded-[10px] border-2 border-[#2e84b6] shadow-[0_3px_0_0_#1C6B99] active:translate-y-[3px] transition-all">
            Selesai
          </button>
        </div>
      )}

      {state === 'completed' && (
        <div className="flex justify-between items-center bg-[#F0FDF4] p-2 rounded-lg border border-[#DCFCE7]">
          <p className="text-[#166534] font-bold text-[11px]">Selesai Dinilai</p>
          <div className="flex items-center gap-1.5">
            <img src={CoinIcon} alt="BeeCoin" className="w-3.5 h-3.5 object-contain" />
            <span className="text-[#1D2B39] font-extrabold text-[12px]">+{currentPosData.earnedCoins}</span>
          </div>
        </div>
      )}
    </div>
  );
});

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
  const [searchQuery, setSearchQuery] = useState('');

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
    } catch (e) { }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const pollData = async () => {
      if (!isMounted) return;

      if (!document.hidden) {
        await fetchLiveData();
      }

      if (isMounted) timeoutId = setTimeout(pollData, 30000);
    };

    pollData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [id, selectedPos]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeftSec(prev => (prev === null || prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleCheckIn = async (team) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sessions/${id}/checkin-pos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ team_id: team.id, post_id: selectedPos.id })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        await fetchLiveData();
      } else {
        alert(resData.message || "Gagal melakukan Check In.");
      }
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
      setModalState('idle'); setScoreInput(''); fetchLiveData();
    } catch (e) { }
  };

  const processCloseEvent = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sessions/${id}/end`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert("Permainan resmi ditutup! Tombol Redeem sekarang terbuka.");
        fetchLiveData();
        setModalState('idle');
      }
    } catch (error) { alert("Gagal menutup sesi."); }
  };

  const formatSessionTime = (sec) => {
    if (!sec || sec <= 0) return "00:00:00";
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const filteredTeams = teamsData.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!sessionData || !selectedPos) return <div className="min-h-screen bg-[#EBF2F8] flex justify-center items-center font-bold text-[#92A0AD]">Memuat...</div>;

  return (
    <div className="min-h-screen bg-[#EBF2F8] pb-32">
      <div className="w-full max-w-md lg:max-w-5xl mx-auto px-6 pt-12">

        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate('/superadmin/home')} className="flex items-center gap-1.5 font-bold text-[#1D2B39] text-[14px]">
            <img src={BackArrowDark} className="w-5 h-5" alt="Back" /> Kembali
          </button>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate(`/superadmin/session/redeem/${id}`)} className="bg-[#2E9AD7] text-white text-[12px] lg:text-[14px] font-bold px-5 py-2.5 rounded-xl shadow-[0_3px_0_0_#1C6B99] active:translate-y-[3px] active:shadow-none hover:bg-[#268bc4] transition-all">
              {sessionData?.status === 'ended' ? 'Redeem Hadiah' : 'Redeem (Tim Selesai)'}
            </button>
            {sessionData?.status !== 'ended' && (
              <button onClick={() => setModalState('end_event')} className="bg-[#E53E3E] text-white text-[12px] lg:text-[14px] font-bold px-5 py-2.5 rounded-xl shadow-[0_3px_0_0_#B91C1C] active:translate-y-[3px] active:shadow-none hover:bg-[#DC2626] transition-all">
                Akhiri Sesi
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 relative z-30">
          <div className="w-[55%] flex flex-col items-start gap-1">
            <h1 className="text-[14px] lg:text-[18px] font-bold text-[#1D2B39] truncate w-full">{sessionData.name}</h1>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-white border border-[#CBD5E1] rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm text-[12px] font-bold text-[#92A0AD]">
              <span className="truncate max-w-[80px] lg:max-w-[120px]">{selectedPos.name}</span>
              <svg className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-max min-w-[160px] bg-[#4B5563] rounded-2xl shadow-xl py-2 flex flex-col z-50 overflow-hidden">
                {sessionData.posts.map((pos) => (
                  <button key={pos.id} onClick={() => { setSelectedPos(pos); setIsDropdownOpen(false); }} className={`px-5 py-3 text-[12px] font-bold transition-colors w-full text-left ${selectedPos.id === pos.id ? 'bg-[#374151] text-white' : 'text-gray-300 hover:bg-[#374151]'}`}>
                    {pos.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-[#92A0AD] text-[11px] lg:text-[13px] font-bold mb-1 uppercase tracking-widest">Sisa Waktu Sesi</p>
          <p className="text-[36px] lg:text-[46px] font-bold text-[#1D2B39] leading-none">{formatSessionTime(timeLeftSec)}</p>
        </div>

        <div className="mb-12">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari nama tim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-[16px] py-3 px-4 text-[14px] text-[#1D2B39] placeholder-[#92A0AD] focus:outline-none focus:border-[#2E9AD7] shadow-sm transition-colors"
            />
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto max-h-[750px] pr-2 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-thumb]:rounded-full">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => {
                const teamIdx = teamsData.findIndex(t => t.id === team.id);

                const numPosts = sessionData.posts.length;
                const chunkSize = Math.ceil(teamsData.length / numPosts) || 1;
                const chunkIndex = Math.floor(teamIdx / chunkSize);

                const teamRoute = [];
                for (let stepIdx = 0; stepIdx < numPosts; stepIdx++) {
                  const postIdx = (chunkIndex + stepIdx) % numPosts;
                  teamRoute.push(sessionData.posts[postIdx]);
                }

                return (
                  <TeamCard
                    key={`${team.id}-${selectedPos.id}-${team.posStatus?.[selectedPos.id]?.status}`}
                    team={team}
                    selectedPosId={selectedPos.id}
                    teamRoute={teamRoute}
                    onCheckInClick={handleCheckIn}
                    onSelesaiClick={(t) => { setSelectedTeam(t); setModalState('scoring'); }}
                  />
                );
              })
            ) : (
              <p className="text-center text-[#92A0AD] text-[13px] py-6">Tim tidak ditemukan.</p>
            )}
          </div>
        </div>

        <div className="mt-10 mb-10">
          <h2 className="text-[17px] font-bold text-[#1D2B39] mb-4 flex items-center gap-2">
            <span>🔄</span> Rute Perjalanan Setiap Tim
          </h2>
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white overflow-hidden">
            <div className="overflow-auto max-h-[300px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-thumb]:rounded-full">
              <table className="w-full text-left border-collapse min-w-[600px] relative">
                <thead className="sticky top-0 z-20 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                  <tr>
                    <th className="py-3 px-3 text-[11px] font-bold text-[#92A0AD] uppercase sticky left-0 bg-white z-30">Nama Tim</th>
                    {sessionData.posts.map((_, idx) => (
                      <th key={idx} className="py-3 px-3 text-[11px] font-bold text-[#92A0AD] uppercase tracking-wider text-center">
                        Tempat ke-{idx + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamsData.map((team, teamIdx) => {
                    const numPosts = sessionData.posts.length;
                    const chunkSize = Math.ceil(teamsData.length / numPosts) || 1;
                    const chunkIndex = Math.floor(teamIdx / chunkSize);

                    return (
                      <tr key={team.id} className="border-b border-gray-50 last:border-0 hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 px-3 text-[12px] font-bold text-[#1D2B39] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                          {team.name}
                        </td>
                        {sessionData.posts.map((_, stepIdx) => {
                          const postIdx = (chunkIndex + stepIdx) % numPosts;
                          const assignedPost = sessionData.posts[postIdx];
                          return (
                            <td key={stepIdx} className="py-3 px-3 text-[11px] font-semibold text-[#546878] text-center">
                              <span className="bg-[#EBF2F8] text-[#2E9AD7] px-2.5 py-1 rounded-full whitespace-nowrap">
                                {assignedPost.name}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-8 mb-10">
          <h2 className="text-[17px] font-bold text-[#1D2B39] mb-4 flex items-center gap-2">
            <span>📊</span> Progres Pos Seluruh Tim
          </h2>
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white overflow-hidden">
            <div className="overflow-auto max-h-[300px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-thumb]:rounded-full">
              <table className="w-full text-left border-collapse min-w-[450px] relative">
                <thead className="sticky top-0 z-20 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                  <tr>
                    <th className="py-3 px-2 text-[10px] font-bold text-[#92A0AD] uppercase sticky left-0 bg-white z-30">Tim</th>
                    {sessionData.posts.map((pos) => (
                      <th key={pos.id} className="py-3 px-2 text-[10px] font-bold text-[#92A0AD] uppercase text-center">
                        {pos.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamsData.map((team) => (
                    <tr key={team.id} className="border-b border-gray-50 last:border-0 hover:bg-[#F8FAFC]">
                      <td className="py-3 px-2 text-[12px] font-bold text-[#1D2B39] truncate max-w-[120px] lg:max-w-full sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                        {team.name}
                      </td>
                      {sessionData.posts.map((pos) => {
                        const status = team.posStatus?.[pos.id]?.status || "locked";
                        return (
                          <td key={pos.id} className="py-3 px-2 text-center">
                            {status === "completed" ? (
                              <span className="text-green-500 text-[16px]">✅</span>
                            ) : status === "active" ? (
                              <span className="animate-pulse text-orange-500 text-[16px]">⏳</span>
                            ) : (
                              <span className="text-gray-200 text-[16px]">🔒</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex gap-4 justify-center text-[9px] font-bold text-[#92A0AD] uppercase tracking-widest">
              <div className="flex items-center gap-1"><span>✅</span> Beres</div>
              <div className="flex items-center gap-1"><span>⏳</span> Aktif</div>
              <div className="flex items-center gap-1"><span>🔒</span> Belum</div>
            </div>
          </div>
        </div>

        {modalState === 'scoring' && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-6">
            <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-2xl flex flex-col items-center">
              <h2 className="text-[18px] font-bold mb-6 text-[#1D2B39]">{selectedTeam?.name}</h2>
              <input type="number" value={scoreInput} onChange={(e) => setScoreInput(e.target.value)} className="w-full border rounded-xl py-4 text-center text-[24px] font-bold mb-6 outline-none focus:border-[#2E9AD7]" />
              <div className="w-full grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => setScoreInput(String(Number(scoreInput || 0) - 5))} className="bg-[#202E3C] text-white font-bold text-[22px] py-3 rounded-xl">-</button>
                <button onClick={() => setScoreInput(String(Number(scoreInput || 0) + 5))} className="bg-[#202E3C] text-white font-bold text-[22px] py-3 rounded-xl">+</button>
              </div>
              <button onClick={handleSaveScore} className="w-full bg-[#2E9AD7] text-white font-bold py-4 rounded-xl shadow-lg">Simpan Nilai</button>
              <button onClick={() => setModalState('idle')} className="w-full py-2 mt-2 text-[#92A0AD] font-bold">Batal</button>
            </div>
          </div>
        )}

        {modalState === 'end_event' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-6">
            <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-2xl flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#FEE2E2] text-[#E53E3E] rounded-full flex items-center justify-center mb-5">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h2 className="text-[18px] font-bold text-[#1D2B39] mb-3">Akhiri Seluruh<br />Permainan?</h2>
              <p className="text-[#92A0AD] text-[12px] mb-8">Data pos tim akan diarsipkan. <br /><span className="text-[#1D2B39] font-bold">Redeem tetap bisa dilakukan untuk tim yang sudah selesai.</span></p>
              <div className="w-full flex flex-col gap-3">
                <button onClick={processCloseEvent} className="w-full bg-[#E53E3E] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#C53030] shadow-[0_4px_0_0_#9B2C2C] active:shadow-none active:translate-y-[4px] transition-all">Ya, Akhiri Permainan</button>
                <button onClick={() => setModalState('idle')} className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#1D2B39] hover:bg-gray-50 transition-all">Batal</button>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-12 py-5 shadow-xl flex items-center gap-12 z-40 border border-[#F1F5F9]">
          <Link to="/superadmin/home"><img src={HomeIcon} alt="Home" className="w-7 h-7" /></Link>
          <Link to={`/superadmin/leaderboard/${id}`} className="opacity-30"><img src={TrophyIcon} alt="Leaderboard" className="w-7 h-7" /></Link>
        </div>

      </div>
    </div>
  );
}