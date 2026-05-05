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

export default function SessionLivePIC() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [sessionData, setSessionData] = useState(null);
    const [teamsData, setTeamsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    // --- PERBAIKAN: DEFINISIKAN STATE TIMER ---
    const [timeLeftSec, setTimeLeftSec] = useState(null);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPos, setSelectedPos] = useState(null);
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
                setSelectedPos(prev => prev || (result.session.posts.length > 0 ? result.session.posts[0] : null));
                
                // Sinkronisasi Waktu Server
                const serverTime = result.remaining_seconds;
                setTimeLeftSec(prev => {
                    if (prev === null || Math.abs(prev - serverTime) > 3) {
                        return serverTime;
                    }
                    return prev;
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

    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeLeftSec(prev => (prev === null || prev <= 0 ? 0 : prev - 1));
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    const formatTime = (totalSeconds) => {
        if (!totalSeconds || totalSeconds <= 0) return "00:00:00";
        const safeSec = Math.floor(totalSeconds);
        const h = Math.floor(safeSec / 3600);
        const m = Math.floor((safeSec % 3600) / 60);
        const s = safeSec % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
                setModalState('idle');
                fetchLiveData(); 
            }
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    const displayTime = formatTime(timeLeftSec);
    const filteredTeams = teamsData.filter(team => team.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!sessionData || !selectedPos) return <div className="min-h-screen bg-[#EBF2F8] flex justify-center items-center font-bold text-[#92A0AD]">Menyiapkan Sesi...</div>;

    return (
        <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32">
            <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12">
                
                <div className="flex items-center mb-8">
                    <button onClick={() => navigate('/pic/home')} className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] absolute left-6 z-10">
                        <img src={BackArrowDark} alt="Back" className="w-5 h-5" /> Beranda
                    </button>
                </div>

                <div className="flex justify-between items-center mb-10 mt-4 relative z-30">
                    <h1 className="text-[16px] font-bold text-[#1D2B39] w-[55%] leading-tight">{sessionData.name}</h1>
                    <div className="relative">
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm">
                            <span className="text-[#92A0AD] font-semibold text-[13px]">{selectedPos.name}</span>
                        </button>
                    </div>
                </div>

                <div className="text-center mb-8 relative z-10">
                    <p className="text-[#92A0AD] text-[13px] font-medium mb-1">Sisa Waktu</p>
                    <p className={`text-[48px] font-bold leading-none tracking-tight ${timeLeftSec === 0 ? 'text-[#E53E3E]' : 'text-[#1D2B39]'}`}>
                        {displayTime}
                    </p>
                </div>

                <div className="mb-6 relative z-10">
                    <input 
                        type="text" 
                        placeholder="Cari team..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full bg-white border border-[#CBD5E1] rounded-[16px] py-3.5 px-5 text-[14px]" 
                    />
                </div>

                <div className="flex flex-col">
                    {filteredTeams.map((team) => (
                        <TeamCard 
                            key={team.id} 
                            team={team} 
                            selectedPosId={selectedPos.id} 
                            onSelesaiClick={(t) => { setSelectedTeam(t); setModalState('confirm'); }} 
                        />
                    ))}
                </div>

                {/* Bottom Nav */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-lg flex items-center gap-12 z-40">
                    <Link to="/pic/home"><img src={HomeIcon} alt="Home" className="w-7 h-7" /></Link>
                    <Link to={`/pic/leaderboard/${id}`} className="opacity-40"><img src={TrophyIcon} alt="Leaderboard" className="w-7 h-7" /></Link>
                </div>

                {/* Modal Penilaian */}
                {modalState !== 'idle' && (
                    <div className="fixed inset-0 bg-[#EBF2F8]/80 backdrop-blur-[2px] z-50 flex items-center justify-center px-6">
                        <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-2xl flex flex-col items-center">
                            {modalState === 'confirm' ? (
                                <>
                                    <h2 className="text-[18px] font-bold text-[#1D2B39] mb-8 text-center">Akhiri Pos untuk<br/>{selectedTeam?.name}?</h2>
                                    <button onClick={() => setModalState('scoring')} className="w-full bg-[#2E9AD7] text-white font-bold py-3.5 rounded-[12px] mb-3">Ya, Beri Nilai</button>
                                    <button onClick={() => setModalState('idle')} className="w-full bg-white text-[#1D2B39] font-bold py-3.5 rounded-[12px] border-2 border-[#1D2B39]">Batal</button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-[18px] font-bold text-[#1D2B39] mb-6 text-center">Beri BeeCoin</h2>
                                    <input type="number" value={scoreInput} onChange={(e) => setScoreInput(e.target.value)} className="w-full border border-[#CBD5E1] rounded-[14px] py-3.5 text-center text-[18px] font-bold mb-4" />
                                    <button onClick={handleSaveScore} className="w-full bg-[#2E9AD7] text-white font-bold py-3.5 rounded-[12px]">Simpan Nilai</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}