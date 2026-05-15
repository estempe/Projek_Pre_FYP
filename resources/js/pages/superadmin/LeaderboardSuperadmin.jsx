import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CoinIcon from "../../assets/Coin3D.png";
import HomeIcon from "../../assets/Home-Icon.svg";
import TrophyIcon from "../../assets/Trophy-Icon.svg";

export default function LeaderboardSuperadmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevLeaderboardRef = useRef(JSON.parse(sessionStorage.getItem(`lb_admin_${id}`)) || []);
  
  const [sessionStatus, setSessionStatus] = useState('');
  const [modalState, setModalState] = useState('idle');

  const fetchLeaderboardAndStatus = async (isPolling = false) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const resLeaderboard = await fetch(`/api/sessions/${id}/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const dataLeaderboard = await resLeaderboard.json();
      if (resLeaderboard.ok && dataLeaderboard.success) {
        setLeaderboardData((current) => {
          if (isPolling && current.length > 0) {
            prevLeaderboardRef.current = current;
            sessionStorage.setItem(`lb_admin_${id}`, JSON.stringify(current));
          }
          return dataLeaderboard.data;
        });
      }

      const resSession = await fetch(`/api/sessions/${id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const dataSession = await resSession.json();
      if (resSession.ok && dataSession.success) {
        setSessionStatus(dataSession.data.status);
      }

    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const pollData = async (isPolling) => {
      if (!isMounted) return;
      await fetchLeaderboardAndStatus(isPolling);
      if (isMounted) {
        timeoutId = setTimeout(() => pollData(true), 30000); 
      }
    };

    pollData(false);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [id]);

  const processCloseEvent = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sessions/${id}/end`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert("Permainan resmi ditutup!");
        setSessionStatus('ended');
        setModalState('idle'); 
      }
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-[#E8F1F8] flex justify-center font-sans pb-32">
      <div className="w-full max-w-md lg:max-w-6xl xl:max-w-7xl mx-auto min-h-screen flex flex-col relative">
        
        <div className="pt-12 px-6 flex justify-between items-center mb-8">
           <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            Kembali
          </button>
          
          <div className="flex items-center gap-2">
            {sessionStatus !== 'ended' && (
              <button onClick={() => setModalState('end_event')} className="bg-[#E53E3E] text-white text-[12px] font-bold px-4 py-2 rounded-lg shadow-[0_3px_0_0_#B91C1C] active:translate-y-[3px] active:shadow-none transition-all">
                Akhiri Sesi
              </button>
            )}
            <button 
              onClick={() => sessionStatus === 'ended' && navigate(`/superadmin/session/redeem/${id}`)}
              disabled={sessionStatus !== 'ended'}
              className={`${sessionStatus === 'ended' ? 'bg-[#2E9AD7] shadow-[0_3px_0_0_#1C6B99] active:translate-y-[3px] active:shadow-none' : 'bg-[#CBD5E1] cursor-not-allowed'} text-white text-[12px] font-bold px-4 py-2 rounded-lg transition-all`}
            >
              {sessionStatus === 'ended' ? 'Redeem Hadiah' : 'Redeem Terkunci'}
            </button>
          </div>
        </div>

        <div className="pt-2 pb-8 flex justify-center">
          <h1 className="text-[22px] font-extrabold text-[#1D2A34] tracking-widest">LEADERBOARD</h1>
        </div>

        <div className="px-6 lg:px-12 flex flex-col gap-3 lg:gap-4 w-full">
          {isLoading ? <p className="text-center text-[#92A0AD] font-semibold mt-10 animate-pulse">Memuat klasemen...</p> : leaderboardData.length === 0 ? <p className="text-center text-[#92A0AD] font-semibold mt-10">Belum ada tim.</p> : null}
          
          {leaderboardData.map((team) => {
            const currentRank = team.rank;
            const prevTeam = prevLeaderboardRef.current.find(t => t.id === team.id);
            let trend = null;
            
            if (prevTeam && prevLeaderboardRef.current.length > 0) {
              if (currentRank < prevTeam.rank) trend = 'up';
              else if (currentRank > prevTeam.rank) trend = 'down';
            }

            const isTeamFinished = team.isFinished || team.is_finished || team.status === 'completed' || team.status === 'finished';

            return (
              <div key={team.id} className="flex items-center bg-white rounded-[16px] py-2 px-4 lg:py-3 lg:px-8 border border-[#CBD5E1] shadow-sm hover:border-[#2E9AD7] hover:shadow-md transition-all group">
                <div className="w-14 lg:w-20 shrink-0 flex items-center justify-center gap-1.5">
                  <div className="w-3 lg:w-4 flex justify-center">
                    {trend === 'up' && <span className="text-green-500 text-[10px] lg:text-[12px] animate-bounce">▲</span>}
                    {trend === 'down' && <span className="text-red-500 text-[10px] lg:text-[12px]">▼</span>}
                  </div>
                  <span className={`text-[16px] lg:text-[20px] font-black ${currentRank === 1 ? 'text-[#E5A015]' : currentRank === 2 ? 'text-[#94A3B8]' : currentRank === 3 ? 'text-[#B45309]' : 'text-[#02101B]'}`}>
                    #{currentRank}
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col justify-center min-w-0 pr-4 lg:pr-8 border-l border-[#F1F5F9] pl-3 lg:pl-6 ml-2 lg:ml-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[#02101B] text-[14px] lg:text-[18px] font-bold truncate">{team.name}</p>
                    {isTeamFinished && (
                      <span className="bg-[#8900E8] text-white px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide shrink-0">
                        Selesai
                      </span>
                    )}
                  </div>
                  <p className="text-[#8C9BA5] text-[10px] lg:text-[12px] font-semibold uppercase tracking-wide truncate w-full">{team.major}</p>
                </div>

                <div className="flex items-center gap-1.5 lg:gap-2 shrink-0 bg-[#FFF9E5] px-3 py-1 lg:px-6 lg:py-2 rounded-full border border-[#FEF08A]">
                  <img src={CoinIcon} alt="coin" className="w-3.5 h-3.5 lg:w-5 lg:h-5 object-contain" />
                  <span className="font-extrabold text-[#E5A015] text-[14px] lg:text-[20px]">{team.score}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-full px-12 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50 border border-[#F1F5F9]">
          <Link to={`/superadmin/session/live/${id}`} className="opacity-30 hover:opacity-100 transition-all"><img src={HomeIcon} alt="Home" className="w-7 h-7" /></Link>
          <button className="scale-110 opacity-100 drop-shadow-md cursor-default"><img src={TrophyIcon} alt="Reward" className="w-7 h-7" /></button>
        </div>

        {modalState === 'end_event' && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-6">
            <div className="w-full max-w-[340px] bg-white rounded-[24px] p-6 shadow-2xl flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[#FEE2E2] text-[#E53E3E] rounded-full flex items-center justify-center mb-5">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h2 className="text-[18px] font-bold text-[#1D2B39] mb-3">Akhiri Seluruh<br />Permainan?</h2>
              <p className="text-[#92A0AD] text-[12px] mb-8">Data pos tim akan diarsipkan. <br/><span className="text-[#1D2B39] font-bold">Tombol Redeem akan terbuka setelah ini.</span></p>
              <div className="w-full flex flex-col gap-3">
                <button onClick={processCloseEvent} className="w-full bg-[#E53E3E] text-white font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#C53030] shadow-[0_4px_0_0_#9B2C2C] active:shadow-none active:translate-y-[4px] transition-all">Ya, Akhiri Permainan</button>
                <button onClick={() => setModalState('idle')} className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[12px] border-2 border-[#1D2B39] hover:bg-gray-50 transition-all">Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}