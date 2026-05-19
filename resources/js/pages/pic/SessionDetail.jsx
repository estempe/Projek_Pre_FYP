import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function SessionDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

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
        console.error("Gagal mengambil detail sesi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionDetail();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#EBF2F8] flex justify-center items-center font-bold text-[#92A0AD]">Memuat data...</div>;
  }

  if (!sessionData) {
    return <div className="min-h-screen bg-[#EBF2F8] flex justify-center items-center font-bold text-[#E53E3E]">Sesi tidak ditemukan!</div>;
  }

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-12">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12 pb-10">
        
        {/* --- HEADER NAVIGASI --- */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/pic/home')} 
            className="flex items-center gap-1 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
            </svg>
            Beranda
          </button>
        </div>

        <h1 className="text-[32px] font-bold text-[#1D2B39] mb-8">Detail Sesi</h1>

        {/* --- KODE SESI (HIGHLIGHT BOX) --- */}
        <div className="bg-white border border-[#E4E9EF] rounded-[16px] py-4 flex flex-col items-center justify-center mb-8 shadow-sm">
          <p className="text-[#92A0AD] text-[13px] mb-1">Kode Sesi</p>
          <p className="text-[#1D2B39] text-[24px] font-bold leading-none tracking-widest">
            {sessionData.session_code}
          </p>
        </div>

        {/* --- INFO UMUM SESI (HANYA BACA, TIDAK BISA EDIT) --- */}
        <div className="flex flex-col gap-5 mb-10">
          <div>
            <label className="block text-[15px] font-bold text-[#1D2B39] mb-2">Nama Sesi</label>
            <input type="text" value={sessionData.name} readOnly className="w-full bg-gray-50 border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 cursor-not-allowed focus:outline-none" />
          </div>
          <div>
            <label className="block text-[15px] font-bold text-[#1D2B39] mb-2">Tanggal</label>
            <input type="text" value={formatTanggal(sessionData.start_time)} readOnly className="w-full bg-gray-50 border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 cursor-not-allowed focus:outline-none" />
          </div>
          <div>
            <label className="block text-[15px] font-bold text-[#1D2B39] mb-2">Durasi Permainan</label>
            <input type="text" value={sessionData.duration} readOnly className="w-full bg-gray-50 border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 cursor-not-allowed focus:outline-none" />
          </div>
        </div>

        {/* --- LIST POS --- */}
        <div className="mb-10">
          <h2 className="text-[20px] font-bold text-[#1D2B39] mb-6">Daftar Pos</h2>
          
          {sessionData.posts && sessionData.posts.length > 0 ? (
            sessionData.posts.map((pos, index) => (
              <div key={pos.id} className="mb-8 border border-[#CBD5E1]/50 rounded-[16px] bg-white shadow-sm p-5">
                <h3 className="text-[16px] font-bold text-[#1D2B39] mb-4">POS {index + 1}</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Nama Pos</label>
                    <input type="text" value={pos.name} readOnly className="w-full bg-gray-50 border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 cursor-not-allowed focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Lokasi Pos</label>
                    <input type="text" value={pos.location} readOnly className="w-full bg-gray-50 border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 cursor-not-allowed focus:outline-none" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#92A0AD] text-[14px]">Tidak ada Pos yang didaftarkan.</p>
          )}
        </div>

        {/* --- TEMPAT PENUKARAN HADIAH --- */}
        <div className="mb-10">
          <h2 className="text-[20px] font-bold text-[#1D2B39] mb-6 leading-tight">Tempat Penukaran<br/>Hadiah</h2>
          <div className="flex flex-col gap-4 border border-[#CBD5E1]/50 rounded-[16px] bg-white shadow-sm p-5">
            <div>
              <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Nama</label>
              <input type="text" value={sessionData.redeem_name} readOnly className="w-full bg-gray-50 border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 cursor-not-allowed focus:outline-none" />
            </div>
            <div>
              <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Lokasi</label>
              <input type="text" value={sessionData.redeem_location} readOnly className="w-full bg-gray-50 border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 cursor-not-allowed focus:outline-none" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}