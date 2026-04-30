import React from 'react';
import { Link } from 'react-router-dom';

import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';

export default function WaitingRoom() {
  // Dummy Data Tim yang sudah masuk (9 Tim)
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
            PRE FYP B30 - BATCH 1 TEST
          </p>
          <h1 className="text-[34px] font-extrabold text-[#1D2B39] leading-tight mb-3">
            Menunggu Pemain
          </h1>
          <p className="text-[#546878] text-[15px] mb-6">
            Masih nunggu semua team masuk
          </p>
          
          {/* Badge Jumlah Team */}
          <div className="bg-white px-5 py-2 rounded-xl shadow-sm border border-[#E4E9EF]">
            <p className="text-[#546878] font-semibold text-[14px]">
              {teams.length} Team telah masuk
            </p>
          </div>
        </div>

        {/* --- DAFTAR TEAM (DENGAN SCROLL & FADE EFFECT) --- */}
        {/* Container Putih Besar */}
        <div className="bg-white rounded-[32px] p-4 shadow-sm border border-white relative flex-1 max-h-[50vh] flex flex-col">
          
          {/* Area Scrollable */}
          <div className="overflow-y-auto hide-scrollbar pb-6 grid grid-cols-2 gap-3 pb-4">
            {teams.map((team) => (
              <div 
                key={team.id} 
                className="bg-[#F4F7FA] rounded-2xl p-3 flex flex-col items-center justify-center text-center h-[85px]"
              >
                {/* Truncate agar teks yang panjang berubah jadi "..." */}
                <h3 className="text-[14px] font-bold text-[#1D2B39] leading-tight mb-1 w-full truncate px-1">
                  {team.name}
                </h3>
                <p className="text-[#92A0AD] text-[10px] leading-tight w-full truncate px-1">
                  {team.major}
                </p>
              </div>
            ))}
          </div>

          {/* Efek Pudar Putih di Bagian Bawah List */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-[32px]"></div>

        </div>

        {/* --- BOTTOM BUTTON (MULAI SEKARANG) --- */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6 z-50">
          <button className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-4 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[6px] transition-all">
            Mulai Sekarang
          </button>
        </div>

      </div>
      
      {/* --- STYLE CSS TAMBAHAN UNTUK HIDE SCROLLBAR BAWAAN BROWSER --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}