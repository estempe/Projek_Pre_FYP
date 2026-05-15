import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function JoinSession() {
  const [sessionCode, setSessionCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!sessionCode) {
      alert("Masukkan kode sesi terlebih dahulu!");
      return;
    }

    try {
      const res = await fetch("/api/check-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ session_code: sessionCode }),
      });
      
      const data = await res.json();

      if (res.ok && data.status === "found") {
        const sessionStatus = data.data?.status;
        
        if (sessionStatus === "live") {
          alert("Maaf, pendaftaran ditutup karena permainan sudah dimulai!");
          return; // Hentikan fungsi di sini!
        }
        if (sessionStatus === "ended") {
          alert("Sesi ini telah berakhir. Terima kasih telah berpartisipasi!");
          return; // Hentikan fungsi di sini!
        }
        navigate("/create-team", { state: { sessionCode } });
      } 
      else if (data.status === "session_started") {
        alert("Maaf, pendaftaran ditutup karena permainan sudah dimulai!");
      } 
      else if (data.status === "session_ended") {
        alert("Sesi ini telah berakhir. Terima kasih telah berpartisipasi!");
      } 
      else {
        alert("Sesi tidak ditemukan atau kode salah.");
      }
    } catch (error) {
      console.error("Join Error:", error);
      alert("Gagal terhubung ke server. Pastikan server berjalan.");
    }
  };

  return (
    <div className="min-h-screen bg-[#E3F2FF] flex justify-center font-sans">
      <div className="w-full max-w-md bg-[#E3F2FF] min-h-screen flex flex-col relative overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-8 mt-[12vh]">
          <h1 className="text-[32px] font-bold text-[#02101B] text-center leading-tight mb-8">
            Masukkan Kode<br />Sesi Permainan
          </h1>

          <input
            type="text"
            placeholder="Ketik kodenya disini!"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
            className="w-full font-sans bg-white rounded-[18px] py-4 px-6 text-center text-lg text-[#02101B] font-medium border-2 border-[#cbdbe7] placeholder-[#02101b47] focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] transition-all"
          />
        </div>

        <div className="px-8 pb-12 flex flex-col items-center">
          <div className="text-center mb-16">
            <p className="text-[#202D36] text-[15px] mb-1">Keluar dari Sesi permainan?</p>
            <Link to="/rejoin" className="text-[#202D36] text-[15px] font-bold underline decoration-2 underline-offset-4 hover:text-[#2E9AD7] transition-colors">
              Masuk Kembali
            </Link>
          </div>

          <button 
            onClick={handleJoin}  
            className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-3 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-none active:translate-y-[6px] transition-all">
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}