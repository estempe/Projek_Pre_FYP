import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function RedeemSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const redeemedCoins = location.state?.redeemedCoins || 0;
  const nameTeam = location.state?.nameTeam || "Tim Kamu";
  const sessionCode = location.state?.sessionCode || "";

  const handleKembali = () => {
    navigate("/result", { state: { sessionCode, nameTeam, fromRedeem: true } });
  };

  const handleTutupSesi = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-sans flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen flex flex-col relative px-6 pt-12 pb-8">
        
        <button 
          onClick={handleKembali}
          className="flex items-center gap-2 text-[#02101B] font-bold text-[15px] hover:opacity-70 transition-opacity self-start z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
          </svg>
          Kembali
        </button>

        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          
          <h1 className="text-[28px] font-bold text-[#02101B] text-center leading-[1.3] mb-8">
            Penukaran Hadiah<br />Berhasil
          </h1>

          <div className="mb-8 w-40 h-40 flex items-center justify-center">
            <div className="text-[100px] leading-none drop-shadow-xl hover:scale-110 transition-transform duration-500 animate-bounce">
              🎁
            </div>
          </div>

          <p className="text-[20px] text-[#02101B] text-center mb-5">
            Sebanyak <span className="font-bold text-[#E5A015]">{redeemedCoins} BeeCoin</span> telah ditukarkan.
          </p>

          <p className="text-[15px] text-[#546878] text-center leading-relaxed px-4">
            "Terima kasih <span className="font-bold">{nameTeam}</span> sudah berjuang hari ini. Sampai jumpa di keseruan berikutnya!"
          </p>
          
        </div>

        <div className="w-full pt-6 mt-auto pb-4">
          <button 
            onClick={handleTutupSesi}
            className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-3 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[6px] transition-all"
          >
            Tutup Sesi
          </button>
        </div>

      </div>
    </div>
  );
}