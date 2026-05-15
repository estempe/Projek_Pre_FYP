import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';
import CoinIcon from '../../assets/Coin3D.png';
import HomeIcon from '../../assets/Home-Icon.svg';
import TrophyIcon from '../../assets/Trophy-Icon.svg';

const RedeemCardPIC = ({ team, sessionStatus, onTukarClick }) => {
  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm border border-white flex flex-col mb-4 relative z-10">
      <div className="mb-4">
        <h3 className="text-[16px] font-bold text-[#1D2B39] leading-tight mb-1">{team.name}</h3>
        <p className="text-[#92A0AD] text-[11px] font-medium leading-none">{team.major}</p>
      </div>
      <hr className="border-[#F1F5F9] mb-4" />
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <img src={CoinIcon} alt="Coin" className="w-[14px] h-[14px] object-contain drop-shadow-sm" />
            <span className="text-[#E5A015] font-bold text-[12px]">{team.balance} BeeCoin</span>
          </div>
          {team.isRedeemed ? (
            <div className="flex items-center gap-1.5">
              <img src={CoinIcon} alt="Coin" className="w-[14px] h-[14px] object-contain drop-shadow-sm" />
              <span className="text-[#E53E3E] font-bold text-[12px]">- {team.redeemedAmount} BeeCoin</span>
            </div>
          ) : null}
        </div>
        
        {team.isRedeemed ? (
          <button disabled className="bg-[#b1b8c0] text-white font-bold text-[11px] px-4 py-2.5 rounded-lg cursor-not-allowed">
            Sudah Ditukar
          </button>
        ) : (
          <button 
            onClick={() => onTukarClick(team)}
            className="bg-[#E5A015] text-white font-bold text-[12px] px-5 py-2.5 rounded-lg border border-[#D48A10] shadow-[0_3px_0_0_#B47608] hover:bg-[#d89613] active:shadow-[0_0px_0_0_#B47608] active:translate-y-[3px] transition-all"
          >
            Tukar Hadiah
          </button>
        )}
      </div>
    </div>
  );
};

export default function SessionRedeem() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [sessionName, setSessionName] = useState('Memuat Sesi...');
  const [sessionStatus, setSessionStatus] = useState(''); 
  const [teamsData, setTeamsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [modalState, setModalState] = useState('idle'); 
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [redeemInput, setRedeemInput] = useState('');

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const resLeaderboard = await fetch(`/api/sessions/${id}/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resSession = await fetch(`/api/sessions/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const dataLeaderboard = await resLeaderboard.json();
      const dataSession = await resSession.json();

      if (resLeaderboard.ok && dataLeaderboard.success) {
        setTeamsData(dataLeaderboard.data);
      }
      if (resSession.ok && dataSession.success) {
        setSessionName(dataSession.data.name);
        setSessionStatus(dataSession.data.status); 
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTukarClick = (team) => {
    setSelectedTeam(team);
    setModalState('input'); 
  };

  const handleProsesTukar = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sessions/${id}/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ team_id: selectedTeam.id, amount: redeemInput })
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setModalState('success');
        fetchData(); 
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Gagal memproses penukaran.");
    }
  };
  
  const closeModal = () => {
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
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity">
            <img src={BackArrowDark} alt="Kembali" className="w-5 h-5" />
            Kembali ke Leaderboard
          </button>
        </div>

        <h2 className="text-[14px] font-bold text-[#1D2B39] mb-8 leading-tight relative z-10">
          {sessionName}
        </h2>

        <h1 className="text-[36px] font-bold text-[#1D2B39] text-center mb-10 leading-none tracking-tight relative z-10">
          Kasir Redeem
        </h1>

        <div className="mb-6 relative z-10">
          <input 
            type="text" placeholder="Cari team..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#CBD5E1] rounded-[16px] py-3.5 px-5 text-[14px] text-[#1D2B39] placeholder-[#92A0AD] focus:outline-none focus:border-[#2E9AD7] shadow-sm transition-colors"
          />
        </div>

        <div className="flex flex-col">
          {filteredTeams.map((team) => (
            <RedeemCardPIC 
              key={team.id} 
              team={team} 
              sessionStatus={sessionStatus} 
              onTukarClick={handleTukarClick} 
            />
          ))}
          {filteredTeams.length === 0 && <p className="text-center text-gray-500 mt-4">Tim tidak ditemukan.</p>}
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-40 border border-[#F1F5F9]">
          <Link to={`/pic/session-live/${id}`} className="hover:scale-110 transition-transform">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </Link>
          <Link to={`/pic/leaderboard/${id}`} className="opacity-40 hover:opacity-100 hover:scale-110 transition-all">
            <img src={TrophyIcon} alt="Reward" className="w-7 h-7" />
          </Link>
        </div>

        {modalState !== 'idle' && (
          <div className="fixed inset-0 bg-[#EBF2F8]/80 backdrop-blur-[2px] z-50 flex items-center justify-center px-6">
            
            {modalState === 'input' && selectedTeam && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center text-center animate-fade-in-up">
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-6 leading-relaxed">
                  Tukar BeeCoin<br />({selectedTeam.name})
                </h2>
                <input 
                  type="number" placeholder="Jumlah koin..." value={redeemInput} onChange={(e) => setRedeemInput(e.target.value)}
                  className="w-full border border-[#CBD5E1] rounded-[14px] py-3.5 px-4 text-center text-[15px] text-[#1D2B39] font-medium placeholder-[#92A0AD] focus:outline-none focus:border-[#2E9AD7] mb-6"
                />
                <button onClick={handleProsesTukar} className="w-full bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#2e84b6] shadow-[0_4px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[4px] transition-all mb-3">
                  Proses Penukaran
                </button>
                <button onClick={closeModal} className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#1D2B39] hover:bg-gray-50 transition-all">
                  Batal
                </button>
              </div>
            )}

            {modalState === 'success' && (
              <div className="w-full max-w-[340px] bg-white rounded-[24px] p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center text-center animate-fade-in-up">
                <h2 className="text-[18px] font-bold text-[#1D2B39] mb-8">Penukaran Berhasil!</h2>
                <button onClick={closeModal} className="w-full bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#2e84b6] shadow-[0_4px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[4px] transition-all">
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