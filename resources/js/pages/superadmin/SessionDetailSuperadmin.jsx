import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';

export default function SessionDetailSuperadmin() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // State tambahan untuk menangkap error

  useEffect(() => {
    const fetchDetail = async () => {
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
          // Pastikan mengambil result.data sesuai struktur API Laravel kita
          setSessionData(result.data);
        } else {
          setError(result.message || "Gagal memuat data");
        }
      } catch (err) {
        console.error("Error fetch detail:", err);
        setError("Koneksi ke server terputus");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
        fetchDetail();
    }
  }, [id]);

  // TAMPILAN LOADING
  if (isLoading) {
    return <div className="min-h-screen bg-[#EBF2F8] flex justify-center items-center font-bold text-[#92A0AD]">Memuat data sesi...</div>;
  }

  // TAMPILAN ERROR (Jika ID salah atau API mati)
  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-[#EBF2F8] flex flex-col justify-center items-center p-6 text-center">
        <p className="text-red-500 font-bold mb-4">{error || "Data tidak ditemukan"}</p>
        <button onClick={() => navigate('/superadmin/home')} className="bg-[#1D2B39] text-white px-6 py-2 rounded-lg">Kembali ke Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-12">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col px-6 pt-12">
        
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/superadmin/home')} className="flex items-center gap-1 text-[#1D2B39] font-bold text-[15px]">
            <img src={BackArrowDark} alt="Back" className="w-5 h-5" /> Beranda
          </button>
        </div>

        <h1 className="text-[32px] font-bold text-[#1D2B39] mb-8">Detail Sesi</h1>

        <div className="bg-white border border-[#E4E9EF] rounded-[24px] p-6 shadow-sm mb-8">
            <div className="flex flex-col items-center justify-center border-b border-[#F1F5F9] pb-6 mb-6">
                <p className="text-[#92A0AD] text-[13px] mb-1">Kode Sesi</p>
                <p className="text-[#1D2B39] text-[28px] font-bold tracking-widest">{sessionData.session_code || '-'}</p>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-[#92A0AD] text-[12px] font-medium mb-1">Nama Sesi</p>
                    <p className="text-[#1D2B39] font-bold text-[16px]">{sessionData.name || '-'}</p>
                </div>
                <div className="flex gap-10">
                    <div>
                        <p className="text-[#92A0AD] text-[12px] font-medium mb-1">Durasi</p>
                        <p className="text-[#1D2B39] font-bold text-[16px]">{sessionData.duration || '-'}</p>
                    </div>
                    <div>
                        <p className="text-[#92A0AD] text-[12px] font-medium mb-1">Status</p>
                        <span className="bg-[#EBF2F8] text-[#2E9AD7] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">
                            {sessionData.status || '-'}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <h2 className="text-[18px] font-bold text-[#1D2B39] mb-4">Daftar Pos</h2>
        <div className="flex flex-col gap-3 mb-10">
            {sessionData.posts && sessionData.posts.length > 0 ? (
                sessionData.posts.map((pos, idx) => (
                    <div key={pos.id} className="bg-white border border-white rounded-[16px] p-4 shadow-sm">
                        <p className="text-[14px] font-bold text-[#1D2B39]">Pos {idx + 1}: {pos.name}</p>
                        <p className="text-[#92A0AD] text-[12px]">📍 {pos.location}</p>
                    </div>
                ))
            ) : (
                <p className="text-[#92A0AD] text-sm italic text-center">Belum ada pos yang ditambahkan.</p>
            )}
        </div>

        <Link to={`/superadmin/leaderboard/${id}`}>
          <button className="w-full bg-[#202E3C] text-white font-bold py-4 rounded-[16px] border-2 border-[#16212C] shadow-[0_5px_0_0_#101820] active:translate-y-[5px] active:shadow-none transition-all">
            Lihat Leaderboard Sesi
          </button>
        </Link>

      </div>
    </div>
  );
}