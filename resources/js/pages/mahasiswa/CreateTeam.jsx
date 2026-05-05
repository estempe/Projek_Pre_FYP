import React, { useState } from "react";
import { Link,useLocation,useNavigate } from "react-router-dom";


export default function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const [teamMajor,setTeamMajor] = useState("");
  const [inputUser,setInputUser] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const sessionCode = location.state?.sessionCode;
  
  async function handleCheckTeams() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/create-teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_code: sessionCode,
        team_name: teamName,
        team_major: teamMajor,
      }),
    });

    const data = await response.json();

    console.log("RESPONSE:", data);

  
    if (data.status === "invalid_input") {
      alert("Semua field harus diisi!");
      return;
    }

    // 🔴 SESSION GA ADA
    if (data.status === "session_not_found") {
      alert("Session tidak ditemukan!");
      return;
    }

    // 🟡 TEAM SUDAH ADA
    if (data.status === "team_exists") {
      alert("Nama tim sudah digunakan!");
      return;
    }

    // 🟢 SUCCESS (TEAM BARU DIBUAT)
    if (data.status === "team_created") {
      navigate("/waiting", {
        state: {
          sessionCode,
          nameTeam: teamName,
        },
      });
      return;
    }

    // ⚠️ fallback (kalau ada status aneh)
    alert("Terjadi kondisi tidak diketahui");

  } catch (error) {
    console.error("Error:", error);

    // 🔥 ini untuk error jaringan / server crash
    alert("Terjadi kesalahan koneksi / server!");
  }
}
  return (
    <div className="min-h-screen bg-[#02101B] flex justify-center font-sans">
      {/* Mobile Container (Dark Blue) */}
      <div className="w-full max-w-md bg-[#02101B] min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Header: Tombol Keluar */}
        <div className="pt-12 pb-8 px-6">
          <Link 
            to="../" 
            className="flex items-center text-[#FFFFFF] font-bold text-[18px] hover:text-[#2E9AD7] transition-colors w-fit"
          >
            <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
            </svg>
            Kembali
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-8 mt-[4vh]">
          
          <h1 className="text-[32px] font-bold text-white text-center leading-tight mb-4">
            Masukkan Nama<br />Team Kalian!
          </h1>
          
          {/* <p className="text-white/70 text-[16px] text-center font-light mb-10 leading-relaxed px-1">
            Masukkan nama team kalian
          </p> */}

          {/* Form Input Container */}
          {/* Tambahkan 'flex' sebelum 'flex-col' agar layout flexbox-nya jalan */}
          <div className="bg-[#1D2A34] rounded-3xl p-3 shadow-lg flex flex-col mx-1 mt-2 ">
            
            {/* Label "Nama team" Floating */}
            {/* KUNCI: Pakai w-fit dan mx-auto biar dia otomatis ke tengah */}
            <div className="w-fit mx-auto px-4 py-1.5 bg-[#979DA1] rounded-t-[10px] flex justify-center items-center relative z-10 -mb-px">
              <p className="text-[#FFFFFF] font-bold text-[14px]">Nama team</p>
            </div>

            {/* Input Field */}
            <input
              type="text"
              placeholder="Ketik nama teammu disini!"
              value={inputUser}
              onChange={(e) => {
              const value = e.target.value;
              setInputUser(value);
              

              const [major,team] = value.split("_");

              setTeamMajor(major || "");
              setTeamName(team || "");
            }}
              className="w-full font-sans bg-transparent rounded-[18px] py-4 px-6 text-center text-lg text-white font-medium border-2 border-[#546878] placeholder-white/40 placeholder:font-sans placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Bottom Button */}
        <div className="px-8 pb-12 flex flex-col items-center">
          <button 
          onClick={handleCheckTeams}
          className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-3 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[6px] transition-all">
            Sudah? Lanjut!
          </button>
        </div>

      </div>
    </div>
  );
}