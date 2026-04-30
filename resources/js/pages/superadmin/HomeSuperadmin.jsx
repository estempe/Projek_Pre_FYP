import React from 'react';
import { Link } from 'react-router-dom';

import HomeIcon from '../../assets/Home-Icon.svg';

// ALL DATA MASIH DUMMY, NANTI TINGGAL GANTI PAKAI API AJA
export default function HomeSuperadmin() {
  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-32">
      {/* Wrapper Mobile */}
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-16">
        
        {/* --- HEADER --- */}
        <h1 className="text-[32px] font-bold text-[#1D2B39] mb-10">
          Halo, Superadmin
        </h1>

        {/* ================================================== */}
        {/* SECTION 1: SESI YANG SEDANG BERJALAN             */}
        {/* ================================================== */}
        <div className="mb-10">
          <h2 className="text-[16px] font-bold text-[#1D2B39] flex items-center gap-2 mb-4">
            <span>⏳</span> Sesi yang sedang berjalan
          </h2>

          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-white">
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

            <div className="border border-[#E4E9EF] rounded-[16px] py-3 flex flex-col items-center justify-center mb-4">
              <p className="text-[#92A0AD] text-[12px] mb-1">Kode Sesi</p>
              <p className="text-[#1D2B39] text-[22px] font-bold leading-none tracking-widest">
                306523
              </p>
            </div>

            <Link to="/superadmin/session/live" className="block w-full">
              <button className="w-full bg-[#202E3C] text-white font-bold text-[16px] py-3.5 rounded-[14px] border-2 border-[#16212C] shadow-[0_5px_0_0_#101820] hover:bg-[#2a3c4e] active:shadow-[0_0px_0_0_#101820] active:translate-y-[5px] transition-all">
                Buka Sesi
              </button>
            </Link>
          </div>
        </div>

        {/* ================================================== */}
        {/* SECTION 2: SESI YANG AKAN DATANG                 */}
        {/* ================================================== */}
        <div>
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

              <Link to="/superadmin/session/detail/1" className="block w-full">
                <button className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[14px] border-2 border-[#1D2B39] shadow-[0_5px_0_0_#1D2B39] hover:bg-gray-50 active:shadow-[0_0px_0_0_#1D2B39] active:translate-y-[5px] transition-all">
                  Lihat Detail Sesi
                </button>
              </Link>
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

              <Link to="/superadmin/session/detail/2" className="block w-full">
                <button className="w-full bg-white text-[#1D2B39] font-bold text-[16px] py-3.5 rounded-[14px] border-2 border-[#1D2B39] shadow-[0_5px_0_0_#1D2B39] hover:bg-gray-50 active:shadow-[0_0px_0_0_#1D2B39] active:translate-y-[5px] transition-all">
                  Lihat Detail Sesi
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* BOTTOM NAVIGATION (SUPERADMIN)                     */}
        {/* ================================================== */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50">
          
          {/* Home Icon (Active) */}
          <Link to="/superadmin/home" className="hover:scale-110 transition-transform">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </Link>

          {/* Plus Icon (Inactive) -> Mengarah ke halaman Create Session */}
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