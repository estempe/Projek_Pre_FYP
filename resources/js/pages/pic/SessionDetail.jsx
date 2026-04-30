import React from 'react';

// DATA MASIH DUMMY, NANTI GANTI PAKAI API AJA

export default function SessionDetail() {
  // Simulasi data dari API (misalnya status, nama pos, dll)
  // Untuk mode READ-ONLY, kita nampilin data statis yang didapat dari API saja.
  const staticQrFileName = 'qr-form-prefyp-b30.png';

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-12">
      {/* Wrapper Mobile (max-w-md) agar posisinya di tengah layar saat dibuka di Web */}
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12 pb-10">
        
        {/* --- HEADER NAVIGASI --- */}
        <div className="flex justify-between items-center mb-6">
          <button className="flex items-center gap-1 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
            </svg>
            Kembali
          </button>
          
          {/* JURUS ANTI-EDIT: Tombol "Edit Sesi" sudah saya hapus permanen */}
        </div>

        {/* --- JUDUL HALAMAN --- */}
        <h1 className="text-[32px] font-bold text-[#1D2B39] mb-8">
          Detail Sesi
        </h1>

        {/* --- KODE SESI (HIGHLIGHT BOX) --- */}
        <div className="bg-white border border-[#E4E9EF] rounded-[16px] py-4 flex flex-col items-center justify-center mb-8 shadow-sm transition-all">
          <p className="text-[#92A0AD] text-[13px] mb-1">Kode Sesi</p>
          <p className="text-[#1D2B39] text-[24px] font-bold leading-none tracking-widest">
            306523
          </p>
        </div>

        {/* ========================================= */}
        {/* FORM BAGIAN 1: INFO UMUM SESI             */}
        {/* ========================================= */}
        <div className="flex flex-col gap-5 mb-10">
          <div>
            <label className="block text-[15px] font-bold text-[#1D2B39] mb-2">Nama Sesi</label>
            <input 
              type="text" 
              defaultValue="PRE FYP B30 - BATCH 1 TEST"
              readOnly
              className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]"
            />
          </div>

          <div>
            <label className="block text-[15px] font-bold text-[#1D2B39] mb-2">Tanggal</label>
            <input 
              type="text" 
              defaultValue="27 April 2026"
              readOnly
              className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]"
            />
          </div>

          <div>
            <label className="block text-[15px] font-bold text-[#1D2B39] mb-2">Durasi Permainan</label>
            <input 
              type="text" 
              defaultValue="03:00:00"
              readOnly
              className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3.5 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]"
            />
          </div>
        </div>

        {/* ========================================= */}
        {/* FORM BAGIAN 2: LIST POS (MODE READ-ONLY)  */}
        {/* ========================================= */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[20px] font-bold text-[#1D2B39]">Tambah Pos</h2>
            {/* JURUS ANTI-EDIT: Tombol "+ Tambah" sudah saya hapus permanen */}
          </div>

          {/* POS 1 */}
          <div className="mb-8 border border-[#CBD5E1]/50 rounded-[16px] bg-gray-50/20 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[16px] font-bold text-[#1D2B39]">POS 1</h3>
              {/* JURUS ANTI-DELETE: Tombol "Hapus Pos" sudah saya hapus permanen */}
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Nama Pos</label>
                <input type="text" defaultValue="Pos Kantin" readOnly className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]" />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Lokasi Pos</label>
                <input type="text" defaultValue="Lantai 1" readOnly className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]" />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Durasi Maks. Check In (Misi)</label>
                <input type="text" defaultValue="10:00" readOnly className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]" />
              </div>
            </div>
          </div>

          {/* POS 2 */}
          <div className="border border-[#CBD5E1]/50 rounded-[16px] bg-gray-50/20 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[16px] font-bold text-[#1D2B39]">POS 2</h3>
              {/* JURUS ANTI-DELETE: Tombol "Hapus Pos" sudah saya hapus permanen */}
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Nama Pos</label>
                <input type="text" defaultValue="Pos Lapangan" readOnly className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]" />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Lokasi Pos</label>
                <input type="text" defaultValue="Lapangan Lantai 1" readOnly className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]" />
              </div>
              <div>
                <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Durasi Maks. Check In (Misi)</label>
                <input type="text" defaultValue="10:00" readOnly className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* FORM BAGIAN 3: TEMPAT PENUKARAN HADIAH    */}
        {/* ========================================= */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[20px] font-bold text-[#1D2B39] leading-tight w-[60%]">
              Tambah Tempat<br/>Penukaran Hadiah
            </h2>
            {/* JURUS ANTI-EDIT: Tombol "+ Tambah Tempat" sudah saya hapus permanen */}
          </div>

          <div className="flex flex-col gap-4 border border-[#CBD5E1]/50 rounded-[16px] bg-gray-50/20 p-5">
            <div>
              <label className="block text-[14px] font-bold text-[#1D2B39] mb-0.5">Ubah Nama</label>
              <span className="block text-[11px] text-[#92A0AD] mb-1.5">*Optional</span>
              <input type="text" defaultValue="TUKAR HADIAH" readOnly className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]" />
            </div>
            
            <div>
              <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Lokasi</label>
              <input type="text" defaultValue="MMG (Lantai 2)" readOnly className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]" />
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* FORM BAGIAN 4: QR & LINK (MODE READ-ONLY) */}
        {/* ========================================= */}
        <div className="mb-10">
          <h2 className="text-[20px] font-bold text-[#1D2B39] mb-0.5">
            QR & Link
          </h2>
          <span className="block text-[13px] text-[#92A0AD] leading-tight mb-1">Untuk disesi akhir permainan</span>
          <span className="block text-[11px] text-[#92A0AD] mb-4">*Optional</span>

          <div className="flex flex-col gap-4 border border-[#CBD5E1]/50 rounded-[16px] bg-gray-50/20 p-5">
            <div>
              <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">Link</label>
              <input type="text" defaultValue="https://s.id/FW23d" readOnly className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 focus:outline-none focus:ring-0 focus:border-[#CBD5E1]" />
            </div>
            
            <div>
              <label className="block text-[14px] font-bold text-[#1D2B39] mb-1.5">QR Image</label>
              
              {/* JURUS ANTI-UPLOAD: Sekarang cuma input text biasa yang readOnly nampilin nama file */}
              <input 
                type="text" 
                defaultValue={staticQrFileName} // Nanti ini diisi dengan nama file asli dari API
                readOnly 
                className="w-full bg-white border border-[#CBD5E1] text-[#92A0AD] text-[15px] rounded-[12px] px-4 py-3 focus:outline-none focus:ring-0 focus:border-[#CBD5E1] cursor-default" 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}