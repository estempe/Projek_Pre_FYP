import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";

export default function JoinSession() {
  const [sessionCode, setSessionCode] = useState("");
  // const [soal,setSoal] = useState([]);
  //  useEffect(() => {
  //   fetch("http://127.0.0.1:8000/api/soal")
  //     .then(res => res.json())
  //     .then(data => setSoal(data));
  // }, []);
  
  return (
    // Kita udah nggak perlu nulis font-['...'] lagi di sini, cukup font-sans
    <div className="min-h-screen bg-[#E3F2FF] flex justify-center font-sans">
      <div className="w-full max-w-md bg-[#E3F2FF] min-h-screen flex flex-col relative overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-8 mt-[12vh]">
          <h1 className="text-[32px] font-bold text-[#02101B] text-center leading-tight mb-8">
            {/* {soal.map((item)=>(
              <h1>{item.Pertanyaan_Soal}</h1>
            ))} */}
            Masukkan Kode
            <br />
            Sesi Permainan
          </h1>

          <input
            type="text"
            placeholder="Ketik kodenya disini!"
            value={sessionCode}
            onChange={(e) => setSessionCode(e.target.value)}
            // Tambahkan placeholder:font-sans biar dia nurut sama global font
            className="w-full font-sans bg-white rounded-[18px] py-4 px-6 text-center text-lg text-[#02101B] font-medium border-2 border-[#cbdbe7] placeholder-[#02101b47] placeholder:font-sans placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] focus:border-transparent transition-all"
          />
        </div>

        <div className="px-8 pb-12 flex flex-col items-center">
          

        <div className="text-center mb-16">
          <p className="text-[#202D36] text-[15px] mb-1">
            Keluar dari Sesi permainan?
          </p>
          {/* Ubah tag button ini menjadi Link 👇 */}
          <Link 
            to="/rejoin" 
            className="text-[#202D36] text-[15px] font-bold underline decoration-2 underline-offset-4 hover:text-[#2E9AD7] transition-colors"
          >
            Masuk Kembali
          </Link>
        </div>

          <button className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-3 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[6px] transition-all">
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
