import React,{useState,useEffect} from "react";
import { Link ,useNavigate,useLocation} from "react-router-dom";
// Pastikan path import ini sesuai dengan struktur folder assets-mu
import CoinIcon from "../../assets/coin3D.png";
import HomeIcon from "../../assets/Home-Icon.svg";
import TrophyIcon from "../../assets/Trophy-Icon.svg";

export default function Leaderboard() {
  // MOCK DATA: Nanti data ini di-fetch dari backend/database
  // isCurrentUser digunakan untuk menandai baris milik mahasiswa yang sedang buka app
  // isFinished digunakan untuk memunculkan badge ungu "Selesai"
  
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const namaTeam = location.state?.nameTeam;
  const sessionCode = location.state?.sessionCode;
  function goToGameplay() {
    navigate("/gameplay", {
      state: {
        nameTeam: namaTeam,
        sessionCode: sessionCode,
      },
    });
}
const checkStatus = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/session-status/${sessionCode}`
      );
      const data = await res.json();

      console.log("Status:", data.status);

      if (data.status === "ended") {
        
        navigate("/result", {
        state: {
          sessionCode: sessionCode,
          nameTeam: namaTeam,
        },
      });
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
  async function fetchLeaderboard() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_code: sessionCode,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setTeams(data.data);
      }

    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
  if (!sessionCode || !namaTeam) return;

  const fetchAll = () => {
    fetchLeaderboard();
    
    
  };

  fetchAll();

  const interval = setInterval(fetchAll, 2000);

  return () => clearInterval(interval);

}, [sessionCode, namaTeam]);

  
  console.log(sessionCode,namaTeam);
  
  
  return (
    <div className="min-h-screen bg-[#E8F1F8] flex justify-center font-sans pb-32">
      <div className="w-full max-w-md min-h-screen flex flex-col relative">
        
        {/* --- HEADER --- */}
        <div className="pt-16 pb-8 flex justify-center">
          <h1 className="text-[22px] font-bold text-[#1D2A34] tracking-wide">
            LEADERBOARD
          </h1>
        </div>

        {/* --- LIST KLASEMEN --- */}
        <div className="px-6 flex flex-col gap-4">
          {teams.map((team,index) => (
            <div
              key={team.id}
              // Logika Dinamis: Jika isCurrentUser true, border hitam solid tebal. Kalau tidak, putus-putus.
              className={`flex items-center bg-white rounded-[20px] p-4 ${
                team.name === namaTeam
                  ? "border-2 border-[#02101B] shadow-sm"
                  : "border border-dashed border-[#A0B0BC] shadow-sm"
              }`}
            >
              
              {/* Kolom Rank (Kiri) */}
              <div className="w-10 shrink-0">
                <span 
                  className={`text-[18px] font-bold ${
                    team.name === namaTeam ? "text-[#02101B]" : "text-[#8C9BA5]"
                  }`}
                >
                  #{index+1}
                </span>
              </div>

              {/* Kolom Info Tim (Tengah) */}
              <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
                
                {/* Badge Selesai (Ungu) */}
                {team.isFinished && (
                  <div className="w-fit bg-[#8900E8] text-white px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wide mb-1">
                    Selesai
                  </div>
                )}
                
                {/* Nama Tim */}
                <p className="text-[#02101B] text-[16px] font-medium truncate w-full">
                  {team.name}
                </p>
                
                {/* Jurusan */}
                <p className="text-[#8C9BA5] text-[11px] font-light truncate w-full">
                  {team.major}
                </p>
              </div>

              {/* Kolom Skor/Koin (Kanan) */}
              <div className="flex items-center gap-1.5 shrink-0">
                <img src={CoinIcon} alt="coin" className="w-4 h-4 object-contain" />
                <span className="font-medium text-[#E5A015] text-[16px]">
                  {team.total_coins}
                </span>
              </div>
              
            </div>
          ))}
        </div>

        {/* --- FLOATING BOTTOM NAVIGATION --- */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full px-10 py-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-12 z-50">
          {/* Home Icon (Inactive) - Ganti jadi Link menuju /gameplay */}
          <button 
          onClick={goToGameplay}
          className="opacity-40 hover:opacity-100 hover:scale-110 transition-all">
            <img src={HomeIcon} alt="Home" className="w-7 h-7" />
          </button>

          {/* Trophy Icon (Active) - Tetap tombol biasa karena kita sedang di Leaderboard */}
          <button className="hover:scale-110 opacity-100 transition-transform" disabled>
            <img src={TrophyIcon} alt="Reward" className="w-7 h-7" />
          </button>
        </div>

      </div>
    </div>
  );
}