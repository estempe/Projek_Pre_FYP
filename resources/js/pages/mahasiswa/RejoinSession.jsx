import React, { useState } from "react";
import { Link,useNavigate} from "react-router-dom";

export default function RejoinSession() {
  const [teamName, setTeamName] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const navigate = useNavigate();
  const handleRejoin = async () => {
  const res = await fetch("http://127.0.0.1:8000/api/rejoin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: teamName,
      session_code: sessionCode,
    }),
  });

  const data = await res.json();
  if (res.status === 404) {
      if (data.status === "session_not_found") {
        alert("Session tidak ditemukan");
      } else if (data.status === "team_not_found") {
        alert("Team tidak ditemukan");
      }
      return;
    }
  if (data.status === "found") {
    
    navigate("/gameplay", {
      state: {
        nameTeam:teamName,
        sessionCode
      }
    });
  } 
};
  return (
    <div className="min-h-screen bg-[#02101B] flex justify-center font-sans">
      {/* Mobile Container (Dark Blue) */}
      <div className="w-full max-w-md bg-[#02101B] min-h-screen flex flex-col relative overflow-hidden">
        
        {/* --- HEADER: Tombol Kembali --- */}
        {/* KUNCI: relative z-50 biar dia 1000% aman di paling depan */}
        <div className="pt-12 pb-4 px-6 relative z-50">
          <Link
            to="/"
            className="inline-flex items-center text-[#FFFFFF] font-bold text-[18px] hover:text-[#2E9AD7] transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Kembali
          </Link>
        </div>

        {/* --- MAIN CONTENT --- */}
        {/* KUNCI: relative z-10 biar dia posisinya di bawah Header */}
        <div className="flex-1 flex flex-col justify-center px-6 mt-[-8vh] relative z-10">
          <h1 className="text-[32px] font-bold text-white text-center leading-tight mb-4">
            Mau Masuk Lagi Yaa?
          </h1>

          <p className="text-white/70 text-[15px] text-center font-medium mb-8 leading-relaxed px-2">
            Masukkan nama team kalian serta kata sandi yang diberikan sebelumnya
            yaa...
          </p>

          {/* Form Input Container */}
          <div className="bg-[#1D2A34] rounded-[24px] p-4 shadow-lg flex flex-col mx-1">
            
            {/* Input 1: Nama Team */}
            <div className="flex flex-col relative">
              <div className="w-fit mx-auto px-4 py-1.5 bg-[#979DA1] rounded-t-[10px] flex justify-center items-center relative z-10 -mb-px">
                <p className="text-[#FFFFFF] font-bold text-[13px]">
                  Nama team
                </p>
              </div>
              <input
                type="text"
                placeholder="Ketik nama teammu disini!"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full font-sans bg-transparent rounded-[18px] py-4 px-6 text-center text-lg text-white font-medium border-2 border-[#546878] placeholder-white/40 placeholder:font-sans placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] focus:border-transparent transition-all"
              />
            </div>

            {/* Divider */}
            <div className="w-full h-[2px] bg-[#0C1720] my-5 rounded-full"></div>

            {/* Input 2: Kode Masuk */}
            <div className="flex flex-col relative">
              <div className="w-fit mx-auto px-4 py-1.5 bg-[#979DA1] rounded-t-[10px] flex justify-center items-center relative z-10 -mb-px">
                <p className="text-[#FFFFFF] font-bold text-[13px]">
                  Kode masuk
                </p>
              </div>
              <input
                type="text"
                placeholder="Ketik kodenya disini!"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                className="w-full font-sans bg-transparent rounded-[18px] py-4 px-6 text-center text-lg text-white font-medium border-2 border-[#546878] placeholder-white/40 placeholder:font-sans placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] focus:border-transparent transition-all"
              />
            </div>

          </div>
        </div>

        {/* --- BOTTOM BUTTON --- */}
        <div className="px-8 pb-12 flex flex-col items-center relative z-20">
          <button 
          onClick={handleRejoin}
          className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-3 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[6px] transition-all">
            Masuk kembali!
          </button>
        </div>

      </div>
    </div>
  );
}