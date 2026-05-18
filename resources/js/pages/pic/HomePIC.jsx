import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function HomePIC() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format tanggal untuk tampilan UI
  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('/api/sessions', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const result = await response.json();
        
        if (response.ok && result.success) {
          setSessions(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data sesi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/pic/login');
  };

  // Pisahkan sesi berdasarkan status
  const liveSessions = sessions.filter(s => s.status === 'live');
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const endedSessions = sessions.filter(s => s.status === 'ended'); // ✅ Menambahkan filter sesi yang sudah selesai

  const usernamePIC = localStorage.getItem('username') || "PIC";

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-20">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-[24px] font-bold text-[#1D2B39] leading-tight">Halo,</h1>
            <h2 className="text-[28px] font-bold text-[#2E9AD7] leading-tight">{usernamePIC}! 👋</h2>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white border border-[#CBD5E1] text-[#E53E3E] font-bold text-[12px] px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
          >
            Keluar
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <p className="text-[#92A0AD] font-bold animate-pulse">Memuat daftar sesi...</p>
          </div>
        ) : (
          <>
            {/* --- SECTION 1: SEDANG BERJALAN (LIVE) --- */}
            <div className="mb-10">
              <h3 className="text-[18px] font-bold text-[#1D2B39] mb-4 flex items-center gap-2"><span>⏳</span> Sesi Sedang Berjalan</h3>
              
              {liveSessions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {liveSessions.map(session => (
                    <div key={session.id} className="bg-white rounded-[20px] p-5 shadow-sm border-l-4 border-l-[#E5A015]">
                      <h4 className="text-[16px] font-bold text-[#1D2B39] mb-1 truncate">{session.name}</h4>
                      <p className="text-[#92A0AD] text-[12px] font-medium mb-4">{formatTanggal(session.start_time)}</p>
                      <button 
                        onClick={() => navigate(`/pic/session-live/${session.id}`)}
                        className="w-full bg-[#E5A015] text-white font-bold text-[14px] py-3 rounded-[12px] hover:bg-[#c98c12] transition-colors shadow-sm active:translate-y-[2px]"
                      >
                        Masuk ke Sesi
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-dashed border-[#CBD5E1] rounded-[20px] p-6 text-center">
                  <p className="text-[#92A0AD] text-[13px] font-medium">Belum ada sesi yang dimulai.</p>
                </div>
              )}
            </div>

            {/* --- SECTION 2: AKAN DATANG (UPCOMING) --- */}
            <div className="mb-10">
              <h3 className="text-[18px] font-bold text-[#1D2B39] mb-4 flex items-center gap-2"><span>⌚</span> Sesi Akan Datang</h3>
              
              {upcomingSessions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="bg-white rounded-[20px] p-5 shadow-sm border border-[#E4E9EF]">
                      <h4 className="text-[16px] font-bold text-[#1D2B39] mb-1 truncate">{session.name}</h4>
                      <p className="text-[#92A0AD] text-[12px] font-medium mb-4">{formatTanggal(session.start_time)}</p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => navigate(`/pic/session-detail/${session.id}`)}
                          className="flex-1 bg-white border-2 border-[#1D2B39] text-[#1D2B39] font-bold text-[13px] py-2.5 rounded-[10px] hover:bg-gray-50 transition-colors"
                        >
                          Lihat Detail Sesi
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-dashed border-[#CBD5E1] rounded-[20px] p-6 text-center">
                  <p className="text-[#92A0AD] text-[13px] font-medium">Belum ada sesi yang dijadwalkan.</p>
                </div>
              )}
            </div>

            {/* --- SECTION 3: SUDAH SELESAI (ENDED / REDEEM) --- */}
            <div className="mb-8">
              <h3 className="text-[18px] font-bold text-[#1D2B39] mb-4 flex items-center gap-2"><span>✅</span> Sesi yang Sudah Lewat</h3>
              
              {endedSessions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {endedSessions.map(session => (
                    <div key={session.id} className="bg-[#E4E9EF]/50 rounded-[20px] p-5 shadow-sm border border-[#CBD5E1]">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-[16px] font-bold text-[#546878] mb-1 truncate line-through opacity-70 w-[70%]">{session.name}</h4>
                        <span className="bg-[#CBD5E1] text-[#1D2B39] text-[11px] font-bold px-3 py-1 rounded-full">Selesai</span>
                      </div>
                      <p className="text-[#92A0AD] text-[12px] font-medium mb-4">{formatTanggal(session.start_time)}</p>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/pic/leaderboard/${session.id}`)}
                          className="flex-1 bg-white border border-[#CBD5E1] text-[#546878] font-bold text-[12px] py-2.5 rounded-[10px] hover:bg-gray-50 transition-colors"
                        >
                          Leaderboard
                        </button>
                        <button 
                          onClick={() => navigate(`/pic/session-redeem/${session.id}`)}
                          className="flex-1 bg-[#2E9AD7] text-white font-bold text-[12px] py-2.5 rounded-[10px] border-2 border-[#2e84b6] shadow-[0_3px_0_0_#1C6B99] active:translate-y-[3px] active:shadow-none hover:bg-[#268bc4] transition-all"
                        >
                          Kasir Redeem
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-dashed border-[#CBD5E1] rounded-[20px] p-6 text-center">
                  <p className="text-[#92A0AD] text-[13px] font-medium">Belum ada riwayat sesi yang selesai.</p>
                </div>
              )}
            </div>

          </>
        )}

      </div>
    </div>
  );
}