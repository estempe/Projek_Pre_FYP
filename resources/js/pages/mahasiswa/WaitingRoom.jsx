import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function WaitingRoom() {
  const location = useLocation();
  const navigate = useNavigate();

  const savedUser = JSON.parse(localStorage.getItem("active_user")) || {};

  const nameTeam = location.state?.nameTeam || savedUser.nameTeam || "Tim";
  const sessionCode = location.state?.sessionCode || savedUser.sessionCode;
  const emergencyCode = location.state?.emergencyCode || savedUser.emergencyCode;

  const [teams, setTeams] = useState([]);

  const fetchDataRealtime = async () => {
    try {
      const resStatus = await fetch(`/api/session-status/${sessionCode}`, { 
          headers: { "Accept": "application/json" } 
      });
      const dataStatus = await resStatus.json();

      if (dataStatus.status === "live") {
        navigate("/gameplay", {
          state: { sessionCode, nameTeam, emergencyCode },
        });
        return; 
      }

      if (dataStatus.status === "ended") {
        alert("Sesi permainan ini telah ditutup atau diakhiri.");
        navigate("/");
        return; 
      }

      const resTeams = await fetch(`/api/getTeams?session_code=${sessionCode}`, { 
          headers: { "Accept": "application/json" }
      });
      const dataTeams = await resTeams.json();

      if (Array.isArray(dataTeams)) {
        const isTeamStillExists = dataTeams.some(team => team.name === nameTeam);
        
        if (!isTeamStillExists) {
           localStorage.removeItem("active_user");
           alert("Tim kamu telah dihapus oleh Admin! Silakan daftar kembali.");
           navigate("/"); 
           return;
        }

        setTeams(dataTeams);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // kembaliin ke depan
    if (!sessionCode || !nameTeam || nameTeam === "Tim") {
        navigate("/");
        return;
    }

    let isMounted = true;
    let timeoutId;

    const pollData = async () => {
      if (!isMounted) return;
      
      await fetchDataRealtime(); 
      
      if (isMounted) {
        timeoutId = setTimeout(pollData, 10000); 
      }
    };

    pollData(); // Jalankan pertama kali
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [sessionCode, nameTeam, navigate]);

  return (
    <div className="min-h-screen bg-[#02101B] flex justify-center font-sans">
      <div className="w-full max-w-md bg-[#02101B] min-h-screen flex flex-col relative overflow-hidden">
        
        <div className="pt-20 px-6 flex flex-col items-center">
          <p className="text-[#546878] font-bold tracking-widest text-[13px] mb-4 uppercase">
            PRE FYP B30 - BATCH 1
          </p>
          <h1 className="text-[32px] font-bold text-white text-center leading-tight mb-4">
            Tunggu Dulu Disini<br />yaa!
          </h1>
          <p className="text-white/70 text-[16px] text-center font-light leading-relaxed px-4 mb-6">
            Masih nunggu hostnya memulai permainannya
          </p>

          <div className="bg-[#1D2A34] text-white px-5 py-2.5 rounded-xl text-[15px] font-medium mb-8">
            {teams.length} Team telah masuk
          </div>
        </div>

        <div className="flex-1 px-4 pb-8 overflow-hidden flex flex-col">
          <div className="bg-[#1D2A34] rounded-[32px] max-h-[450px] p-4 flex-1 relative overflow-hidden flex flex-col shadow-xl">
            <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="grid grid-cols-2 gap-3 pb-4">
                {teams.map((team) => (
                  <div key={team.id} className="bg-[#2A3948] rounded-[16px] p-3.5 flex flex-col justify-center items-center text-center shadow-sm">
                    <span className="text-white font-bold text-[15px] w-full truncate block mb-0.5">
                      {team.name}
                    </span>
                    <span className="text-white/60 font-light text-[11px] w-full truncate block">
                      {team.major}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Gradasi Bawah */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#1D2A34] to-transparent pointer-events-none rounded-b-[32px]"></div>
          </div>
        </div>

      </div>
    </div>
  );
}