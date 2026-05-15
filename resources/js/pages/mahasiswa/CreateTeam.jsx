import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const [teamMajor, setTeamMajor] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  
  const location = useLocation();
  const navigate = useNavigate();
  const sessionCode = location.state?.sessionCode;
  
  async function handleCheckTeams() {
    if (!teamName || !teamMajor) {
      alert("Nama Tim dan Jurusan wajib diisi!");
      return;
    }

    setIsLoading(true); // Kunci tombol saat ditekan

    try {
      const checkRes = await fetch(`/api/session-status/${sessionCode}`);
      const checkData = await checkRes.json();
      
      if (checkData.status === "live") {
          alert("Waktu habis! Pendaftaran ditutup karena permainan sudah dimulai.");
          navigate("/"); 
          return;
      }
      if (checkData.status === "ended") {
          alert("Sesi ini telah resmi berakhir.");
          navigate("/"); 
          return;
      }

      // Jika masih aman (upcoming), lanjut buat tim
      const response = await fetch("/api/create-teams", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
          session_code: sessionCode,
          team_name: teamName,
          team_major: teamMajor,
        }),
      });

      const data = await response.json();

      if (data.status === "team_created") {
          localStorage.setItem("active_user", JSON.stringify({
             sessionCode: sessionCode,
             nameTeam: teamName,
             emergencyCode: data.team.emergency_code
          }));

          navigate("/waiting", {
              state: { 
                  sessionCode: sessionCode, 
                  nameTeam: teamName, 
                  emergencyCode: data.team.emergency_code 
              },
          });
      } 
      else if (data.status === "team_exists") {
          alert("Nama tim di sesi ini sudah dipakai! Coba nama lain.");
      } 
      else if (data.status === "session_started") {
          alert("Waktu habis! Pendaftaran ditutup karena permainan sudah dimulai.");
          navigate("/"); 
      } 
      else if (data.status === "session_ended") {
          alert("Sesi ini telah resmi berakhir.");
          navigate("/"); 
      } 
      else if (data.status === "session_not_found") {
          alert("Sesi tidak valid atau sudah ditutup.");
      } 
      else {
          alert("Terjadi masalah saat menyimpan data tim.");
      }

    } catch (error) {
      console.error("Create Team Error:", error);
      alert("Terjadi kesalahan koneksi ke server!");
    } finally {
      setIsLoading(false); 
    }
  }

  return (
    <div className="min-h-screen bg-[#02101B] flex justify-center font-sans">
      <div className="w-full max-w-md bg-[#02101B] min-h-screen flex flex-col relative overflow-hidden">
        
        <div className="pt-12 pb-8 px-6">
          <Link to="../" className="flex items-center text-[#FFFFFF] font-bold text-[18px] hover:text-[#2E9AD7] transition-colors w-fit">
            <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            Kembali
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 mt-[2vh]">
          <h1 className="text-[32px] font-bold text-white text-center leading-tight mb-6">
            Daftarkan Team<br />Kalian!
          </h1>
          
          <div className="bg-[#1D2A34] rounded-3xl p-5 shadow-lg flex flex-col gap-5 mx-1">
            <div className="flex flex-col relative">
                <p className="text-[#FFFFFF] font-bold text-[14px] mb-2 px-2">Nama Team:</p>
                <input
                  type="text"
                  placeholder="Cth: Kelompok 1"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={isLoading}
                  className="w-full font-sans bg-transparent rounded-2xl py-3 px-5 text-white font-medium border-2 border-[#546878] focus:border-[#2E9AD7] outline-none transition-all disabled:opacity-50"
                />
            </div>

            <div className="flex flex-col relative">
                <p className="text-[#FFFFFF] font-bold text-[14px] mb-2 px-2">Jurusan:</p>
                <input
                  type="text"
                  placeholder="Cth: Business Information Technology"
                  value={teamMajor}
                  onChange={(e) => setTeamMajor(e.target.value)}
                  disabled={isLoading}
                  className="w-full font-sans bg-transparent rounded-2xl py-3 px-5 text-white font-medium border-2 border-[#546878] focus:border-[#2E9AD7] outline-none transition-all disabled:opacity-50"
                />
            </div>
          </div>
        </div>

        <div className="px-8 pb-12 flex flex-col items-center">
          <button 
            onClick={handleCheckTeams}
            disabled={isLoading}
            className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-3 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-none active:translate-y-[6px] transition-all disabled:bg-[#546878] disabled:border-[#3A4A57] disabled:shadow-none disabled:translate-y-[6px]"
          >
            {isLoading ? "Memproses..." : "Sudah? Lanjut!"}
          </button>
        </div>

      </div>
    </div>
  );
}