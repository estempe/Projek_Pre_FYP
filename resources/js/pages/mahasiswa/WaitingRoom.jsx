import React,{useState,useEffect} from "react";
import { useLocation,useNavigate } from "react-router-dom";
export default function WaitingRoom() {
  // MOCK DATA / DATA DUMMY, NANTI GANTI PAKAI API AJA
  const location = useLocation();
  const sessionCode = location.state?.sessionCode;
 const navigate = useNavigate();
  const [teams,setTeams] = useState([]);
   useEffect(() => {
    fetch("http://127.0.0.1:8000/api/getTeams")
      .then(res => res.json())
      .then(data => setTeams(data));
  }, []);
  const checkStatus = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/session-status/${sessionCode}`
      );
      const data = await res.json();

      console.log("Status:", data.status);

      if (data.status === "started") {
        console.log("game dimulai");
        navigate("/gameplay");
      }
    } catch (error) {
      console.error("Error cek status:", error);
    }
  };


    useEffect(() => {
      if (!sessionCode) return;

      const interval = setInterval(() => {
        checkStatus();
      }, 2000); // cek tiap 2 detik

      return () => clearInterval(interval);
    }, [sessionCode]);
  return (
    <div className="min-h-screen bg-[#02101B] flex justify-center font-sans">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-[#02101B] min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Top Section (Header & Text) */}
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

          {/* Pill Counter */}
          <div className="bg-[#1D2A34] text-white px-5 py-2.5 rounded-xl text-[15px] font-medium mb-8">
            {teams.length} Team telah masuk
          </div>
        </div>

        {/* Bottom Section (Grid Container) */}
        {/* flex-1 agar memenuhi sisa layar, overflow-hidden agar scroll hanya di dalam */}
        <div className="flex-1 px-4 pb-8 overflow-hidden flex flex-col">
          
          <div className="bg-[#1D2A34] rounded-[32px] max-h-[450px] p-4 flex-1 relative overflow-hidden flex flex-col shadow-xl">
            
            {/* Scrollable Area (Sembunyikan scrollbar bawaan browser) */}
            <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              {/* CSS Grid Setup: 2 Kolom, jarak (gap) 3 */}
              <div className="grid grid-cols-2 gap-3 pb-4">
                
                {/* Looping data dari Array */}
                {teams.map((team) => (
                  <div 
                    key={team.id} 
                    className="bg-[#2A3948] rounded-[16px] p-3.5 flex flex-col justify-center items-center text-center shadow-sm"
                  >
                    {/* Class truncate memastikan teks panjang jadi "..." */}
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

            {/* Gradient Overlay di bawah grid biar kelihatan efek fading/kepotong estetik */}
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#1D2A34] to-transparent pointer-events-none rounded-b-[32px]"></div>
          </div>

        </div>

      </div>
    </div>
  );
}