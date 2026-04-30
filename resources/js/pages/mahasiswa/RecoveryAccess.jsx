import React from "react";
import { Link } from "react-router-dom";

import Lock from "../../assets/Lock.svg";

// DATA MASIH DUMMY, NANTI GANTI PAKAI API AJA

export default function RecoveryAccess() {
  return (
    <div className="min-h-screen bg-[#E8F1F8] flex justify-center font-sans pb-10">
      <div className="w-full max-w-md min-h-screen flex flex-col relative px-8">
        
        {/* --- HEADER: Tombol Kembali --- */}
        <div className="pt-12 pb-8">
          <Link 
            to="/gameplay" 
            className="flex items-center text-[#02101B] font-bold text-[18px] hover:text-[#2E9AD7] transition-colors w-fit"
          >
            <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
            </svg>
            Kembali
          </Link>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1 flex flex-col items-center mt-4">
          
          {/* Lock Icon (SVG Inline) */}
          <div className="text-[#8C9BA5] mb-6">
            <img src={Lock} alt="lock" />
          </div>

          {/* Subtitle */}
          <div className="text-center mb-10">
            <p className="text-[#8C9BA5] text-[16px] font-medium leading-relaxed">
              Takut sesi terputus?<br />
              Masuk kembali dengan detail di bawah.
            </p>
          </div>

          {/* --- RECOVERY CARD --- */}
          <div className="w-full bg-white rounded-[32px] pt-8 pb-8 px-6 shadow-sm relative">
            
            {/* Input 1: Nama Team */}
            <div className="relative mb-8">
              {/* Floating Label */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D2A34] text-white px-4 py-1 rounded-md text-[12px] font-bold z-10 shadow-sm">
                Nama team
              </div>
              {/* Input Box */}
              <div className="w-full border border-[#B5C5D1] rounded-[16px] py-4 text-center text-[#02101B] font-bold text-[18px]">
                Tes1234
              </div>
            </div>

            {/* Garis Pemisah (Divider) */}
            <div className="w-full h-px bg-[#E8F1F8] mb-8"></div>

            {/* Input 2: Kode Masuk */}
            <div className="relative">
              {/* Floating Label */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D2A34] text-white px-4 py-1 rounded-md text-[12px] font-bold z-10 shadow-sm">
                Kode masuk
              </div>
              {/* Input Box */}
              <div className="w-full border border-[#B5C5D1] rounded-[16px] py-4 text-center text-[#02101B] font-bold text-[20px] tracking-[0.2em]">
                673452
              </div>
            </div>

          </div>

          {/* Footer Notes */}
          <p className="text-[#8C9BA5] text-[13px] text-center mt-10 px-4 leading-relaxed">
            Simpan/Screenshot halaman ini agar tidak kehilangan akses tim.
          </p>

        </div>

      </div>
    </div>
  );
}