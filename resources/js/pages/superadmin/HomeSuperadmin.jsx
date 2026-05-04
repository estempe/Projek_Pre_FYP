import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '../../assets/Home-Icon.svg';

export default function HomeSuperadmin() {
  // State untuk menyimpan data sesi dari Laravel
  const [liveSessions, setLiveSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi pembantu untuk memformat tanggal (misal: "27 April 2026", "15:30")
  const formatTanggal = (dateString) => {
    if (!dateString) return { tanggal: "-", jam: "-" };
    const date = new Date(dateString);
    const optionsDate = { day: '2-digit', month: 'long', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    
    return {
      tanggal: date.toLocaleDateString('id-ID', optionsDate),
      jam: date.toLocaleTimeString('id-ID', optionsTime).replace('.', ':')
    };
  };

  // Mengambil data saat halaman pertama kali dimuat
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
          // Memisahkan data berdasarkan statusnya
          const live = result.data.filter(session => session.status === 'live');
          const upcoming = result.data.filter(session => session.status === 'upcoming');
          
          setLiveSessions(live);
          setUpcomingSessions(upcoming);
        }
      } catch (error) {
        console.error("Gagal mengambil data sesi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-16">
        
        {/* --- HEADER --- */}
        <h1 className="text-[32px] font-bold text-[#1D2B39] mb-10">
          Halo, Superadmin
        </h1>

        {isLoading ? (
          <p className="text-center text-[#92A0AD] mt-10">Memuat data sesi...</p>
        ) : (
          <>
            {/* ================================================== */}
            {/* SECTION 1: SESI YANG SEDANG BERJALAN             */}
            {/* ================================================== */}
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
                      <h3 className="text-[#92A0AD] font-medium text-[16px] leading-tight w-[60%]">
                        {session.name}
                      </h3>
                      <div className="text-right">
                        <p className="text-[#92A0AD] text-[12px] mb-0.5">Waktu Tersisa</p>
                        <p className="text-[#1D2B39] text-[20px] font-bold leading-none tracking-wide">
                          {session.duration || "00:00"}
                        </p>
                      </div>
                    </div>

                    <div className="border border-[#E4E9EF] rounded-[16px] py-3 flex flex-col items-center justify-center mb-4">
                      <p className="text-[#92A0AD] text-[12px] mb-1">Kode Sesi</p>
                      <p className="text-[#1D2B39] text-[22px] font-bold leading-none tracking-widest">
                        {session.session_code}
                      </p>
                    </div>

                    <Link to="/superadmin/session/live" className="block w-full">
                      <button className="w-full bg-[#202E3C] text-white font-bold text-[16px] py-3.5 rounded-[14px] border-2 border-[#16212C] shadow-[0_5px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[5px] transition-all">
                        Buka Sesi
                      </button>
                    </Link>
                  </div>
                ))
              )}
            </div>

            {/* ================================================== */}
            {/* SECTION 2: SESI YANG AKAN DATANG                 */}
            {/* ================================================== */}
            <div>
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
                    const formatWaktu = formatTanggal(session.start_time);
                    
                    return (
                      <div key={session.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
                        <div className="flex justify-between items-start mb-5">
                          <h3 className="text-[#92A0AD] font-medium text-[16px] leading-tight w-[60%]">
                            {session.name}
                          </h3>
                          <div className="text-right">
                            <p className="text-[#92A0AD] text-[12px] mb-0.5">Mulai Pada</p>
                            <p className="text-[#1D2B39] text-[14px] font-semibold leading-tight">
                              {formatWaktu.tanggal}<br />
                              <span className="text-[16px] font-bold">{formatWaktu.jam}</span>
                            </p>
                          </div>
                        </div>

                        {/* Mengarahkan ke halaman waiting room atau detail */}
                        <Link to={`/superadmin/waiting/${session.id}`} className="block w-full">
                          <button className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[14px] border-2 border-[#1D2B39] shadow-[0_5px_0_0_#1D2B39] hover:bg-gray-50 active:shadow-[0_0px_0_0_#1D2B39] active:translate-y-[5px] transition-all">
                            Lihat Detail Sesi
                          </button>
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {/* ================================================== */}
        {/* BOTTOM NAVIGATION (SUPERADMIN)                     */}
        {/* ================================================== */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50">
          
          <Link to="/superadmin/home" className="hover:scale-110 transition-transform">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </Link>

          <Link to="/superadmin/create-session" className="opacity-40 hover:opacity-100 hover:scale-110 transition-all text-[#92A0AD]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </Link>
          
        </div>

      </div>
    </div>
  );
}