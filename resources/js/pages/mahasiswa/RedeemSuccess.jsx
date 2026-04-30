import React from 'react';
// Nanti uncomment dan import gambar kado 3D aslimu di sini
// import GiftIcon from '../assets/gift3D.png'; 

// DATA MASIH DUMMY, NANTI GANTI PAKAI API AJA

export default function RedeemSuccess() {
  // Data ini nantinya didapat dari state/database secara realtime
  const redeemedCoins = 200;

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-sans flex flex-col items-center">
      {/* Wrapper pembatas lebar layar */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative px-6 pt-12 pb-8">
        
        {/* --- TOMBOL KEMBALI --- */}
        <button 
          onClick={() => {/* Tambahkan navigasi kembali */}}
          className="flex items-center gap-2 text-[#02101B] font-bold text-[15px] hover:opacity-70 transition-opacity self-start z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
          </svg>
          Kembali
        </button>

        {/* --- KONTEN UTAMA (Tengah Vertikal) --- */}
        {/* flex-1 bikin kotak ini mengisi sisa ruang, jadi isinya otomatis ke tengah */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          
          <h1 className="text-[28px] font-bold text-[#02101B] text-center leading-[1.3] mb-8">
            Penukaran Hadiah<br />Berhasil
          </h1>

          {/* AREA GAMBAR KADO */}
          <div className="mb-8 w-40 h-40 flex items-center justify-center">
            {/* Ganti emoji ini dengan tag img kado aslimu */}
            {/* <img src={GiftIcon} alt="Kado" className="w-full h-full object-contain" /> */}
            <div className="text-[100px] leading-none drop-shadow-xl hover:scale-105 transition-transform duration-500">
              🎁
            </div>
          </div>

          {/* TEKS INFO COIN */}
          <p className="text-[20px] text-[#02101B] text-center mb-5">
            Sebanyak <span className="font-bold text-[#E5A015]">{redeemedCoins} BeeCoin</span> telah ditukarkan.
          </p>

          {/* TEKS UCAPAN TERIMA KASIH */}
          <p className="text-[15px] text-[#546878] text-center leading-relaxed px-4">
            "Terima kasih sudah berjuang bersama timmu hari ini. Sampai jumpa di keseruan berikutnya!"
          </p>
          
        </div>

        {/* --- TOMBOL TUTUP SESI (Nempel di bawah) --- */}
        <div className="w-full pt-6 mt-auto pb-4">
          <button 
            onClick={() => {/* Fungsi untuk reset state atau kembali ke Home */}}
            className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-3 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[6px] transition-all"
          >
            Tutup Sesi
          </button>
        </div>

      </div>
    </div>
  );
}