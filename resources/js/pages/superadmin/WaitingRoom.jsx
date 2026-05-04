import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';

export default function WaitingRoom() {
  const { id } = useParams(); // Menangkap ID dari URL
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dummy Data Tim yang sudah masuk (Tetap dipertahankan untuk tampilan UI sementara)
  const teams = [
    { id: 1, name: "TeamPalingOke", major: "Business Management" },
    { id: 2, name: "JagonyaBinus", major: "Creative Communication" },
    { id: 3, name: "AdadehPokoknya", major: "Business Management" },
    { id: 4, name: "Tes1234", major: "Business Information Technology" },
    { id: 5, name: "SehatSehatMaba", major: "Business Information Technology" },
    { id: 6, name: "SokSuciGitu", major: "Creative Communication" },
    { id: 7, name: "KanKitaMahPintar", major: "Business Hotel Management" },
    { id: 8, name: "KanKitaMahPintar", major: "Business Hotel Management" },
    { id: 9, name: "LahKokGitu!", major: "Computer Science" },
  ];

  // Mengambil data sesi spesifik dari Laravel
  useEffect(() => {
    const fetchSessionDetail = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`/api/sessions/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        const result = await response.json();
        
        if (response.ok && result.success) {
          setSessionData(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data sesi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionDetail();
  }, [id]);

  // Fungsi untuk mengeklik tombol "Mulai Sekarang"
  const handleStartSession = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/sessions/${id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (response.ok && result.success) {
        // Jika sukses diubah statusnya jadi live, pindah ke halaman Session Live
        navigate('/superadmin/session/live');
      } else {
        alert("Gagal memulai sesi: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke server.");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#EBF2F8] flex items-center justify-center text-[#92A0AD] font-bold">Memuat data sesi...</div>;
  }

  if (!sessionData) {
    return <div className="min-h-screen bg-[#EBF2F8] flex items-center justify-center text-[#E53E3E] font-bold">Sesi tidak ditemukan!</div>;
  }

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32">
      {/* Wrapper Mobile */}
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12">
        
        {/* --- HEADER --- */}
        <div className="flex items-center mb-8">
          <Link to="/superadmin/home" className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity z-10">
            <img src={BackArrowDark} alt="Kembali" className="w-5 h-5" />
            Kembali
          </Link>
        </div>

        {/* --- TITLES & HEADINGS --- */}
        <div className="flex flex-col items-center text-center mb-6">
          <p className="text-[#92A0AD] font-semibold text-[14px] tracking-wide mb-3">
            {sessionData.name} {/* Nama sesi dari Database */}
          </p>
          <h1 className="text-[34px] font-extrabold text-[#1D2B39] leading-tight mb-3">
            Menunggu Pemain
          </h1>
          <p className="text-[#546878] text-[15px] mb-6">
            Kode Sesi: <span className="font-bold tracking-widest text-[#1D2B39]">{sessionData.session_code}</span>
          </p>
          
          {/* Badge Jumlah Team */}
          <div className="bg-white px-5 py-2 rounded-xl shadow-sm border border-[#E4E9EF]">
            <p className="text-[#546878] font-semibold text-[14px]">
              {teams.length} Team telah masuk
            </p>
          </div>
        </div>

        {/* --- DAFTAR TEAM --- */}
        <div className="bg-white rounded-[32px] p-4 shadow-sm border border-white relative flex-1 max-h-[50vh] flex flex-col">
          <div className="overflow-y-auto hide-scrollbar pb-6 grid grid-cols-2 gap-3 pb-4">
            {teams.map((team) => (
              <div key={team.id} className="bg-[#F4F7FA] rounded-2xl p-3 flex flex-col items-center justify-center text-center h-[85px]">
                <h3 className="text-[14px] font-bold text-[#1D2B39] leading-tight mb-1 w-full truncate px-1">
                  {team.name}
                </h3>
                <p className="text-[#92A0AD] text-[10px] leading-tight w-full truncate px-1">
                  {team.major}
                </p>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-[32px]"></div>
        </div>

        {/* --- BOTTOM BUTTON (MULAI SEKARANG) --- */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
          <button 
            onClick={handleStartSession}
            className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-4 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[6px] transition-all"
          >
            Mulai Sekarang
          </button>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}