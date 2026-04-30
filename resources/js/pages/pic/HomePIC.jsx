import React from 'react';

// DATA MASIH DUMMY, NANTI GANTI PAKAI API AJA
export default function HomePIC() {
  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center">
      {/* Wrapper ukuran Mobile (max-w-md) agar posisinya di tengah layar saat dibuka di Web */}
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-16 pb-10">
        
        {/* --- HEADER --- */}
        <h1 className="text-[32px] font-bold text-[#1D2B39] mb-10">
          Halo, Seany
        </h1>

        {/* ================================================== */}
        {/* SECTION 1: SESI YANG SEDANG BERJALAN             */}
        {/* ================================================== */}
        <div className="mb-10">
          {/* Judul Section */}
          <h2 className="text-[16px] font-bold text-[#1D2B39] flex items-center gap-2 mb-4">
            <span>⏳</span> Sesi yang sedang berjalan
          </h2>

          {/* CARD ONGOING */}
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
            
            {/* Header Card (Judul & Waktu) */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[#92A0AD] font-medium text-[16px] leading-tight w-[60%]">
                PRE FYP B30 -<br />BATCH 1
              </h3>
              <div className="text-right">
                <p className="text-[#92A0AD] text-[12px] mb-0.5">Waktu Tersisa</p>
                <p className="text-[#1D2B39] text-[20px] font-bold leading-none tracking-wide">
                  01:34:00
                </p>
              </div>
            </div>

            {/* Kotak Kode Sesi */}
            <div className="border border-[#E4E9EF] rounded-[16px] py-3 flex flex-col items-center justify-center mb-4">
              <p className="text-[#92A0AD] text-[12px] mb-1">Kode Sesi</p>
              <p className="text-[#1D2B39] text-[22px] font-bold leading-none tracking-widest">
                306523
              </p>
            </div>

            {/* TOMBOL GELAP (3D Solid Shadow) */}
            <button className="w-full bg-[#202E3C] text-white font-bold text-[16px] py-3.5 rounded-[14px] border-2 border-[#16212C] shadow-[0_5px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[5px] transition-all">
              Buka Sesi
            </button>
          </div>
        </div>


        {/* ================================================== */}
        {/* SECTION 2: SESI YANG AKAN DATANG                 */}
        {/* ================================================== */}
        <div>
          {/* Judul Section */}
          <h2 className="text-[16px] font-bold text-[#1D2B39] flex items-center gap-2 mb-4">
            <span>⌚</span> Sesi yang akan datang
          </h2>

          <div className="flex flex-col gap-5">
            
            {/* CARD UPCOMING 1 */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-[#92A0AD] font-medium text-[16px] leading-tight w-[60%]">
                  PRE FYP B30 -<br />BATCH 1 TEST
                </h3>
                <div className="text-right">
                  <p className="text-[#92A0AD] text-[12px] mb-0.5">Mulai Pada</p>
                  <p className="text-[#1D2B39] text-[14px] font-semibold leading-tight">
                    27 April 2026<br />
                    <span className="text-[16px] font-bold">15:30</span>
                  </p>
                </div>
              </div>

              {/* TOMBOL TERANG (3D Solid Shadow dengan Border Gelap) */}
              <button className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[14px] border-2 border-[#1D2B39] shadow-[0_5px_0_0_#1D2B39] hover:bg-gray-50 active:shadow-[0_0px_0_0_#1D2B39] active:translate-y-[5px] transition-all">
                Lihat Detail Sesi
              </button>
            </div>

            {/* CARD UPCOMING 2 */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-[#92A0AD] font-medium text-[16px] leading-tight w-[60%]">
                  PRE FYP B30 -<br />BATCH 2
                </h3>
                <div className="text-right">
                  <p className="text-[#92A0AD] text-[12px] mb-0.5">Mulai Pada</p>
                  <p className="text-[#1D2B39] text-[14px] font-semibold leading-tight">
                    03 May 2026<br />
                    <span className="text-[16px] font-bold">15:30</span>
                  </p>
                </div>
              </div>

              {/* TOMBOL TERANG (3D Solid Shadow dengan Border Gelap) */}
              <button className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[14px] border-2 border-[#1D2B39] shadow-[0_5px_0_0_#1D2B39] hover:bg-gray-50 active:shadow-[0_0px_0_0_#1D2B39] active:translate-y-[5px] transition-all">
                Lihat Detail Sesi
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}