import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- IMPORT ASSETS ---
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';
import HomeIcon from '../../assets/Home-Icon.svg';

export default function CreateSession() {
  const navigate = useNavigate();

  // --- STATES ---
  const [sessionName, setSessionName] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionDuration, setSessionDuration] = useState('02:00');
  
  const [redeemName, setRedeemName] = useState('');
  const [redeemLocation, setRedeemLocation] = useState('');
  
  const [qrLink, setQrLink] = useState('');
  const [qrFile, setQrFile] = useState(null);
  const [fileName, setFileName] = useState('');

  // State untuk POS (Tampilannya tetap ada, logikanya akan kita sambung nanti)
  const [posList, setPosList] = useState([
    { id: Date.now(), name: '', location: '', duration: '00:00' }
  ]);

  // --- HANDLERS ---
  const handleAddPos = () => {
    setPosList([ ...posList, { id: Date.now(), name: '', location: '', duration: '00:00' } ]);
  };

  const handleRemovePos = (idToRemove) => {
    if (posList.length > 1) {
      setPosList(posList.filter(pos => pos.id !== idToRemove));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setQrFile(file);
    }
  };

  // --- FUNGSI SUBMIT (API CALL) ---
  const handleCreateSession = async (e) => {
    e.preventDefault(); // Mencegah halaman refresh saat submit form

    try {
      const token = localStorage.getItem('auth_token');

      // Gunakan FormData karena kita mengirim file gambar
      const formData = new FormData();
      formData.append('name', sessionName);
      formData.append('start_time', `${sessionDate} 00:00:00`); 
      formData.append('duration', sessionDuration);
      formData.append('redeem_name', redeemName);
      formData.append('redeem_location', redeemLocation);
      
      if (qrLink) formData.append('qr_link', qrLink);
      if (qrFile) formData.append('qr_image', qrFile);

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
          // Jangan tambahkan Content-Type di sini jika pakai FormData
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`Sesi berhasil dibuat! Kode Sesi: ${data.data.session_code}`);
        navigate('/superadmin/home');
      } else {
        alert("Gagal membuat sesi: " + (data.message || "Periksa kembali isian Anda."));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke server.");
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12">
        
        {/* --- HEADER --- */}
        <div className="flex items-center mb-6">
          <Link to="/superadmin/home" className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity">
            <img src={BackArrowDark} alt="Kembali" className="w-5 h-5" />
            Kembali
          </Link>
        </div>

        <h1 className="text-[32px] font-bold text-[#1D2B39] mb-10">Buat Sesi</h1>

        {/* BUNGKUS DENGAN FORM AGAR 'REQUIRED' BERFUNGSI */}
        <form onSubmit={handleCreateSession}>
          
          {/* ========================================= */}
          {/* FORM BAGIAN 1: INFO UMUM SESI             */}
          {/* ========================================= */}
          <div className="flex flex-col gap-5 mb-10">
            <div>
              <label className="block text-[15px] font-bold text-[#1D2B39] mb-2">Nama Sesi</label>
              <input 
                type="text" 
                placeholder="e.g. PRE FYP B30 - BATCH 1"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                required
                className="w-full bg-white border border-[#CBD5E1] text-[#1D2B39] placeholder-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:border-[#2E9AD7] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[15px] font-bold text-[#1D2B39] mb-2">Tanggal</label>
              <input 
                type="date" 
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                required
                className="w-full bg-white border border-[#CBD5E1] text-[#1D2B39] text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:border-[#2E9AD7] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[15px] font-bold text-[#1D2B39] mb-2">Durasi Permainan (Jam:Menit)</label>
              <input 
                type="time" 
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
                required
                className="w-full bg-white border border-[#CBD5E1] text-[#1D2B39] font-bold text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:border-[#2E9AD7] transition-colors"
              />
            </div>
          </div>

          {/* ========================================= */}
          {/* FORM BAGIAN 2: LIST POS (DINAMIS)         */}
          {/* ========================================= */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] font-bold text-[#1D2B39]">Tambah Pos</h2>
              <button 
                onClick={handleAddPos}
                type="button"
                className="bg-[#202E3C] text-white text-[13px] font-bold px-4 py-2 rounded-[10px] hover:bg-[#2a3c4e] transition-colors active:scale-95 shadow-sm"
              >
                + Tambah
              </button>
            </div>

            {posList.map((pos, index) => (
              <div key={pos.id} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[16px] font-bold text-[#1D2B39]">POS {index + 1}</h3>
                  {posList.length > 1 && (
                    <button 
                      onClick={() => handleRemovePos(pos.id)}
                      type="button"
                      className="flex items-center gap-1 text-[#E53E3E] text-[13px] font-bold hover:opacity-70 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      <span className="underline underline-offset-2">Hapus</span>
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Nama Pos</label>
                    <input type="text" placeholder="e.g. Pos Lapangan" className="w-full bg-white border border-[#CBD5E1] text-[#1D2B39] placeholder-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:border-[#2E9AD7]" />
                  </div>
                  <div>
                    <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Lokasi Pos</label>
                    <input type="text" placeholder="e.g. Lapangan (Lantai 1)" className="w-full bg-white border border-[#CBD5E1] text-[#1D2B39] placeholder-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:border-[#2E9AD7]" />
                  </div>
                  <div>
                    <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Durasi Maks. Check In (Misi)</label>
                    <input type="time" defaultValue="00:00" className="w-full bg-white border border-[#CBD5E1] text-[#1D2B39] font-bold text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:border-[#2E9AD7]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ========================================= */}
          {/* FORM BAGIAN 3: TEMPAT PENUKARAN HADIAH    */}
          {/* ========================================= */}
          <div className="mb-10">
            <h2 className="text-[20px] font-bold text-[#1D2B39] leading-tight mb-6">
              Tambah Tempat<br/>Penukaran Hadiah
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[14px] font-bold text-[#1D2B39] mb-0.5">Ubah Nama</label>
                <input 
                  type="text" 
                  placeholder="e.g. Tukar Hadiah" 
                  value={redeemName}
                  onChange={(e) => setRedeemName(e.target.value)}
                  required
                  className="w-full bg-white border border-[#CBD5E1] text-[#1D2B39] placeholder-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:border-[#2E9AD7]" 
                />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Lokasi</label>
                <input 
                  type="text" 
                  placeholder="e.g. MMG (Lantai 2)" 
                  value={redeemLocation}
                  onChange={(e) => setRedeemLocation(e.target.value)}
                  required
                  className="w-full bg-white border border-[#CBD5E1] text-[#1D2B39] placeholder-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:border-[#2E9AD7]" 
                />
              </div>
            </div>
          </div>

          {/* ========================================= */}
          {/* FORM BAGIAN 4: QR & LINK                  */}
          {/* ========================================= */}
          <div className="mb-12">
            <h2 className="text-[20px] font-bold text-[#1D2B39] mb-0.5">QR & Link</h2>
            <span className="block text-[13px] text-[#92A0AD] leading-tight mb-1">Untuk disesi akhir permainan</span>
            <span className="block text-[11px] text-[#92A0AD] mb-4">*Optional</span>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Link</label>
                <input 
                  type="text" 
                  value={qrLink}
                  onChange={(e) => setQrLink(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] text-[#1D2B39] text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:border-[#2E9AD7]" 
                />
              </div>
              
              <div>
                <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">QR Image</label>
                <div className="relative flex items-center w-full bg-white border border-[#CBD5E1] rounded-[12px] overflow-hidden focus-within:border-[#2E9AD7] transition-colors p-1.5">
                  <input 
                    type="text" 
                    value={fileName}
                    readOnly 
                    className="w-full px-3 py-2 text-[#1D2B39] text-[15px] focus:outline-none bg-transparent cursor-default" 
                  />
                  <div className="absolute right-2 bg-[#E2E8F0] text-[#1D2B39] text-[12px] font-bold px-4 py-2 rounded-lg pointer-events-none">
                    Upload Gambar
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Pilih gambar QR"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- TOMBOL SUBMIT --- */}
          <div className="mb-10">
            <button 
              type="submit" 
              className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-3.5 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[6px] transition-all"
            >
              Buat Sesi
            </button>
          </div>
        </form>

        {/* ================================================== */}
        {/* BOTTOM NAVIGATION (SUPERADMIN)                     */}
        {/* ================================================== */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50">
          <Link to="/superadmin/home" className="opacity-40 hover:opacity-100 hover:scale-110 transition-all">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </Link>
          <button className="hover:scale-110 transition-transform text-[#1D2B39]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}