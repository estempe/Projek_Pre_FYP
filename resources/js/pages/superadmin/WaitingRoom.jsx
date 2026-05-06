import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';

export default function WaitingRoomSuperadmin() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [teams, setTeams] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data sesi dan daftar tim secara real-time
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Ambil data sesi
      const resSession = await fetch(`/api/sessions/${id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      // Ambil daftar tim
      const resTeams = await fetch(`/api/sessions/${id}/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      const dataSession = await resSession.json();
      const dataTeams = await resTeams.json();
      
      if (resSession.ok && dataSession.success) setSessionData(dataSession.data);
      if (resTeams.ok && dataTeams.success) setTeams(dataTeams.data);

    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh tiap 3 detik 
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [id]);

  // Fungsi untuk KICK / DELETE Tim
  const handleDeleteTeam = async (teamId, teamName) => {
    const isConfirm = window.confirm(`Apakah kamu yakin ingin mengeluarkan tim "${teamName}" dari permainan?`);
    if (!isConfirm) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      
      const result = await response.json();
      if (response.ok && result.success) {
        fetchData(); // Langsung refresh UI setelah sukses delete
      } else {
        alert("Gagal menghapus tim: " + result.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // Fungsi untuk Memulai Permainan
  const handleStartSession = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sessions/${id}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const result = await response.json();

      if (response.ok && result.success) {
        navigate(`/superadmin/session/live/${id}`); 
      } else {
        alert("Gagal memulai sesi: " + result.message);
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#EBF2F8] flex items-center justify-center font-bold">Memuat...</div>;

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12">
        
        {/* HEADER */}
        <div className="flex items-center mb-8">
          <Link to="/superadmin/home" className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] z-10">
            <img src={BackArrowDark} alt="Kembali" className="w-5 h-5" /> Kembali
          </Link>
        </div>

        {/* TITLES */}
        <div className="flex flex-col items-center text-center mb-6">
          <p className="text-[#92A0AD] font-semibold text-[14px] mb-3">{sessionData?.name}</p>
          <h1 className="text-[34px] font-extrabold text-[#1D2B39] leading-tight mb-3">Menunggu Pemain</h1>
          <p className="text-[#546878] text-[15px] mb-6">
            Kode Sesi: <span className="font-bold tracking-widest text-[#1D2B39]">{sessionData?.session_code}</span>
          </p>
          <div className="bg-white px-5 py-2 rounded-xl shadow-sm border border-[#E4E9EF]">
            <p className="text-[#546878] font-semibold text-[14px]">{teams.length} Team telah masuk</p>
          </div>
        </div>

        {/* DAFTAR TEAM & TOMBOL KICK */}
        <div className="bg-white rounded-[32px] p-4 shadow-sm border border-white relative flex-1 max-h-[50vh] flex flex-col">
          <div className="overflow-y-auto hide-scrollbar grid grid-cols-2 gap-3 pb-6">
            {teams.length === 0 ? (
              <p className="col-span-2 text-center text-gray-400 text-sm py-4">Belum ada tim yang mendaftar.</p>
            ) : (
              teams.map((team) => (
                <div key={team.id} className="bg-[#F4F7FA] rounded-2xl p-3 flex flex-col items-center justify-center text-center h-[90px] relative group">
                  {/* Tombol X merah untuk Delete Tim */}
                  <button 
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 z-10"
                  >
                    X
                  </button>
                  <h3 className="text-[14px] font-bold text-[#1D2B39] leading-tight mb-1 w-full truncate px-1">{team.name}</h3>
                  <p className="text-[#92A0AD] text-[10px] leading-tight w-full truncate px-1">{team.major}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM BUTTON */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
          <button onClick={handleStartSession} className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-4 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-none active:translate-y-[6px] transition-all">
            Mulai Sekarang
          </button>
        </div>

      </div>
    </div>
  );
}