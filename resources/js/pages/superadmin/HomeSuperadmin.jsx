import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '../../assets/Home-Icon.svg';

export default function HomeSuperadmin() {
  const [liveSessions, setLiveSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [endedSessions, setEndedSessions] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Modal Hapus
  const [modalState, setModalState] = useState('idle');
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // PERBAIKAN: Hanya menampilkan tanggal tanpa jam
  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const optionsDate = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', optionsDate);
  };

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/sessions', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setLiveSessions(result.data.filter(session => session.status === 'live'));
        setUpcomingSessions(result.data.filter(session => session.status === 'upcoming'));
        setEndedSessions(result.data.filter(session => session.status === 'ended'));
      }
    } catch (error) {
      console.error("Gagal mengambil data sesi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // --- LOGIKA HAPUS SESI ---
  const triggerDelete = (id) => {
    setSelectedSessionId(id);
    setModalState('confirm');
  };

  const executeDelete = async () => {
    setModalState('deleting');
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sessions/${selectedSessionId}/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setModalState('success');
        fetchSessions(); // Reload data
      } else {
        alert("Gagal menghapus sesi.");
        setModalState('idle');
      }
    } catch (error) {
      alert("Terjadi kesalahan.");
      setModalState('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32 relative">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-16">
        
        <h1 className="text-[32px] font-bold text-[#1D2B39] mb-10">
          Halo, Superadmin
        </h1>

        {isLoading ? (
          <p className="text-center text-[#92A0AD] mt-10">Memuat data sesi...</p>
        ) : (
          <>
            {/* SECTION 1: SESI SEDANG BERJALAN */}
            <div className="mb-10">
              <h2 className="text-[16px] font-bold text-[#1D2B39] flex items-center gap-2 mb-4">
                <span>⏳</span> Sesi yang sedang berjalan
              </h2>

              {liveSessions.length === 0 ? (
                <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white text-center">
                  <p className="text-[#92A0AD] text-[14px]">Belum ada sesi yang sedang berjalan.</p>
                </div>
              ) : (
                liveSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-white mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-[#92A0AD] font-medium text-[16px] leading-tight w-[60%]">{session.name}</h3>
                      <div className="text-right">
                        <p className="text-[#92A0AD] text-[12px] mb-0.5">Durasi</p>
                        <p className="text-[#1D2B39] text-[20px] font-bold leading-none tracking-wide">{session.duration}</p>
                      </div>
                    </div>
                    <div className="border border-[#E4E9EF] rounded-[16px] py-3 flex flex-col items-center justify-center mb-4">
                      <p className="text-[#92A0AD] text-[12px] mb-1">Kode Sesi</p>
                      <p className="text-[#1D2B39] text-[22px] font-bold leading-none tracking-widest">{session.session_code}</p>
                    </div>
                    <Link to={`/superadmin/session/live/${session.id}`} className="block w-full">
                      <button className="w-full bg-[#202E3C] text-white font-bold text-[16px] py-3.5 rounded-[14px] border-2 border-[#16212C] shadow-[0_5px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[5px] transition-all">
                        Buka Sesi
                      </button>
                    </Link>
                  </div>
                ))
              )}
            </div>

            {/* SECTION 2: SESI AKAN DATANG */}
            <div className="mb-10">
              <h2 className="text-[16px] font-bold text-[#1D2B39] flex items-center gap-2 mb-4">
                <span>⌚</span> Sesi yang akan datang
              </h2>

              <div className="flex flex-col gap-5">
                {upcomingSessions.length === 0 ? (
                  <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white text-center">
                    <p className="text-[#92A0AD] text-[14px]">Belum ada sesi yang akan datang.</p>
                  </div>
                ) : (
                  upcomingSessions.map((session) => {
                    const tanggalSaja = formatTanggal(session.start_time);
                    return (
                      <div key={session.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
                        <div className="flex justify-between items-start mb-5">
                          <h3 className="text-[#92A0AD] font-medium text-[16px] leading-tight w-[60%]">{session.name}</h3>
                          <div className="text-right">
                            <p className="text-[#92A0AD] text-[12px] mb-0.5">Tanggal</p>
                            <p className="text-[#1D2B39] text-[15px] font-bold leading-tight">
                              {tanggalSaja}
                            </p>
                          </div>
                        </div>

                        {/* TOMBOL AKSI */}
                        <div className="flex flex-col gap-3">
                          <Link to={`/superadmin/waiting/${session.id}`} className="block w-full">
                            <button className="w-full bg-[#202E3C] text-white font-bold text-[15px] py-3.5 rounded-[14px] border-2 border-[#16212C] shadow-[0_5px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-none active:translate-y-[5px] transition-all">
                              Buka Waiting Room
                            </button>
                          </Link>
                          
                          <div className="flex gap-2 w-full">
                            <Link to={`/superadmin/session/detail/${session.id}`} className="flex-1">
                              <button className="w-full bg-white text-[#1D2B39] font-bold text-[14px] py-3 rounded-[14px] border border-[#CBD5E1] hover:bg-gray-50 transition-all">
                                Detail / Edit
                              </button>
                            </Link>
                            <button 
                              onClick={() => triggerDelete(session.id)}
                              className="w-[80px] bg-[#FEF2F2] text-[#E53E3E] font-bold text-[14px] py-3 rounded-[14px] border border-[#FECACA] hover:bg-[#FEE2E2] transition-colors flex justify-center items-center"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* SECTION 3: SESI SUDAH LEWAT */}
            <div>
              <h2 className="text-[16px] font-bold text-[#1D2B39] flex items-center gap-2 mb-4">
                <span>✅</span> Sesi yang sudah lewat
              </h2>

              <div className="flex flex-col gap-5">
                {endedSessions.length === 0 ? (
                  <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white text-center">
                    <p className="text-[#92A0AD] text-[14px]">Belum ada riwayat sesi.</p>
                  </div>
                ) : (
                  endedSessions.map((session) => (
                    <div key={session.id} className="bg-[#E4E9EF]/50 rounded-[24px] p-5 shadow-sm border border-[#CBD5E1]">
                      <div className="flex justify-between items-start mb-5">
                        <h3 className="text-[#546878] font-bold text-[16px] leading-tight w-[60%] line-through opacity-70">{session.name}</h3>
                        <div className="bg-[#CBD5E1] text-[#1D2B39] text-[11px] font-bold px-3 py-1 rounded-full">
                          Selesai
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Link to={`/superadmin/session/detail/${session.id}`} className="flex-1">
                          <button className="w-full bg-white text-[#546878] font-bold text-[13px] py-2.5 rounded-[10px] border border-[#CBD5E1] hover:bg-gray-50 transition-colors">
                            Lihat Detail
                          </button>
                        </Link>
                        <Link to={`/superadmin/leaderboard/${session.id}`} className="flex-1">
                          <button className="w-full bg-[#1D2B39] text-white font-bold text-[13px] py-2.5 rounded-[10px] hover:bg-[#2a3c4e] transition-colors">
                            Hasil Akhir
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </>
        )}

        {/* BOTTOM NAVIGATION */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-40 border border-[#F1F5F9]">
          <Link to="/superadmin/home" className="hover:scale-110 transition-transform">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </Link>
          <Link to="/superadmin/create-session" className="opacity-40 hover:opacity-100 hover:scale-110 transition-all text-[#92A0AD]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </Link>
        </div>

        {/* ======================================= */}
        {/* MODAL KONFIRMASI HAPUS                 */}
        {/* ======================================= */}
        {modalState !== 'idle' && (
          <div className="fixed inset-0 bg-[#EBF2F8]/80 backdrop-blur-sm z-50 flex items-center justify-center px-6">
            <div className="w-full max-w-[320px] bg-white rounded-[24px] p-6 shadow-2xl flex flex-col items-center text-center">
              
              {modalState === 'confirm' && (
                <>
                  <div className="w-12 h-12 bg-[#FEE2E2] text-[#E53E3E] rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </div>
                  <h2 className="text-[18px] font-bold text-[#1D2B39] mb-2">Hapus Sesi Ini?</h2>
                  <p className="text-[#92A0AD] text-[13px] mb-6">Sesi beserta seluruh daftar pos dan file QR-nya akan dihapus permanen.</p>
                  
                  <button onClick={executeDelete} className="w-full bg-[#E53E3E] text-white font-bold py-3.5 rounded-xl border border-[#DC2626] shadow-[0_4px_0_0_#B91C1C] hover:bg-[#DC2626] active:translate-y-[4px] active:shadow-none transition-all mb-3">
                    Ya, Hapus Sesi
                  </button>
                  <button onClick={() => setModalState('idle')} className="w-full py-3 text-[#92A0AD] font-bold">
                    Batal
                  </button>
                </>
              )}

              {modalState === 'deleting' && (
                 <p className="text-[#92A0AD] font-bold py-8 animate-pulse">Menghapus sesi...</p>
              )}

              {modalState === 'success' && (
                <>
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h2 className="text-[18px] font-bold text-[#1D2B39] mb-6">Berhasil Dihapus!</h2>
                  <button onClick={() => setModalState('idle')} className="w-full bg-[#1D2B39] text-white font-bold py-3.5 rounded-xl border border-[#16212C] shadow-[0_4px_0_0_#0F172A] active:translate-y-[4px] active:shadow-none transition-all">
                    Oke
                  </button>
                </>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}