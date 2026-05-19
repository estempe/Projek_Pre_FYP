import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as htmlToImage from 'html-to-image'; 
import CoinIcon from "../../assets/Coin3D.png"; 
import FallbackQR from "../../assets/qr-example.png"; 
import GhostHappy from "../../assets/ghost-happy.png";
import GhostHorror from "../../assets/ghost-horror.png";
import GhostLove from "../../assets/ghost-love.png"; 

const BACKEND_URL = "http://127.0.0.1:8000";

export default function GameResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionCode = location.state?.sessionCode || "";
  const actualTeamName = location.state?.nameTeam || "Nama Tim";

  const [score, setScore] = useState(0); 
  const [teamName, setTeamName] = useState(actualTeamName);
  const [isQROpen, setIsQROpen] = useState(false); 
  
  const [qrLink, setQrLink] = useState("");
  const [qrImage, setQrImage] = useState(FallbackQR);
  const [redeemLocation, setRedeemLocation] = useState("MMG (Lantai 2)");

  const [isRedeemed, setIsRedeemed] = useState(false);
  const [redeemedAmount, setRedeemedAmount] = useState(0);
  const hasAutoRedirected = useRef(location.state?.fromRedeem || false);

  useEffect(() => {
    if (!sessionCode) return;

    fetch("/api/sessionData", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ session_code: sessionCode }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success" && data.data) {
        const session = data.data;
        
        if (session.qr_link && session.qr_link !== "null" && session.qr_link.trim() !== "") {
          setQrLink(session.qr_link);
        }

        if (session.qr_image_path && session.qr_image_path !== "null" && session.qr_image_path.trim() !== "") {
          let path = session.qr_image_path.replace(/^public\//, '');
          if (!path.startsWith('storage/')) path = `storage/${path}`;
          setQrImage(`${BACKEND_URL}/${path}`);
        }
        
        setRedeemLocation(session.redeem_location || "Pos Tukar");
      }
    })
    .catch(err => console.error("Gagal load session data:", err));
  }, [sessionCode]);

  useEffect(() => {
    if (!sessionCode || !actualTeamName) return;

    const checkTeamStatus = () => {
      if (document.hidden) return;

      fetch("/api/getTeamCoins", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ session_code: sessionCode, team_name: actualTeamName }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success" && data.team) {
          setScore(data.total_coins);
          
          if (data.team.is_redeemed === true || data.team.is_redeemed === 1) {
             setIsRedeemed(true);
             setRedeemedAmount(data.team.redeemed_amount);
             
             if (!hasAutoRedirected.current) {
                hasAutoRedirected.current = true;
                navigate("/redeem-success", { 
                  state: { sessionCode: sessionCode, nameTeam: actualTeamName, redeemedCoins: data.team.redeemed_amount } 
                });
             }
          }
        }
      })
      .catch(err => console.error("Gagal load skor:", err));
    };

    checkTeamStatus();
    let intervalId;
    const loopCheck = () => {
       checkTeamStatus();
       intervalId = setTimeout(loopCheck, 15000);
    }
    intervalId = setTimeout(loopCheck, 15000);
    
    return () => clearTimeout(intervalId);
  }, [sessionCode, actualTeamName, navigate]);

  const isLove = score > 800;
  const isHappy = score >= 500 && score <= 800;
  const isHorror = score < 500;

  const theme = {
    pageBg: isLove ? "bg-[#FFF5F7]" : isHappy ? "bg-[#EBF2F8]" : "bg-[#151921]",
    mainTitleColor: isLove ? "text-[#9D174D]" : isHappy ? "text-[#1D2B39]" : "text-white",
    subTitleColor: isLove ? "text-[#BE185D]" : isHappy ? "text-[#92A0AD]" : "text-[#7A8A9E]",
    pageTitle: isLove ? "Perjalanan Selesai! 💖" : "Perjalanan Selesai! 🏁",
    pageSubtitle: isLove ? "Kalian menemukan akhir kisah yang langka." : "Inilah akhir kisah tim kalian.",
    cardBg: isLove 
      ? "bg-gradient-to-b from-[#FFF1F2] to-[#FFFFFF] border-2 border-[#FCE7E4] shadow-[0_20px_40px_-10px_rgba(225,29,72,0.25)]"
      : isHappy 
      ? "bg-gradient-to-b from-[#EBF2F8] to-[#E8EFF7] border border-white shadow-lg" 
      : "bg-gradient-to-b from-[#2A3140] to-[#151921] border border-[#374151] shadow-2xl",
    cardTopText: isLove ? "The chapter closes in romance" : isHappy ? "The chapter closes in victory" : "The chapter closes in darkness",
    cardTextColor: isLove ? "text-[#831843]" : isHappy ? "text-[#1D2B39]" : "text-white",
    cardSubTextColor: isLove ? "text-[#FB7185]" : isHappy ? "text-[#92A0AD]" : "text-[#9CA3AF]",
    teamMessage: "Total wealth acquired",
    ghostImage: isLove ? GhostLove : isHappy ? GhostHappy : GhostHorror,
    ghostGlow: isLove ? "bg-rose-200" : isHappy ? "bg-blue-100" : "bg-white/5",
    btnBg: isLove 
      ? "bg-[#E11D48] text-white border-2 border-[#BE185D] shadow-[0_4px_0_0_#9D174D] hover:bg-[#BE185D] active:shadow-[0_0_0_0_#9D174D]"
      : "bg-[#2E9AD7] text-white border-2 border-[#2e84b6] shadow-[0_4px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99]"
  };

  const cardRef = useRef(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const el = cardRef.current;
        const dataUrl = await htmlToImage.toPng(el, {
          quality: 1, pixelRatio: 3, backgroundColor: isHorror ? "#151921" : "#FFFFFF", width: 280, height: 400, style: { margin: '0', transform: 'none', left: '0', top: '0' }
        });
        const link = document.createElement("a");
        link.download = `Story-${teamName}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) { alert("Gagal menyimpan gambar. Coba screenshot manual ya!"); }
    }
  };

  const hasValidLink = qrLink && qrLink !== "";
  const hasValidImage = qrImage !== FallbackQR;

  return (
    <div className={`min-h-screen ${theme.pageBg} flex justify-center font-sans pb-12 transition-colors duration-500`}>
      <div className="w-full max-w-md min-h-screen flex flex-col items-center pt-16 px-6 relative">
        
        <div className="text-center mb-6">
          <h1 className={`text-[24px] font-bold ${theme.mainTitleColor} mb-1 tracking-wide transition-colors`}>{theme.pageTitle}</h1>
          <p className={`${theme.subTitleColor} text-[13px] font-medium transition-colors`}>{theme.pageSubtitle}</p>
        </div>

        <div className="w-full flex justify-center">
          <div ref={cardRef} className={`w-[280px] h-[400px] ${theme.cardBg} relative flex flex-col items-center justify-between py-6 px-4 shrink-0 rounded-sm overflow-hidden transition-all duration-500`}>
            <h2 className={`${theme.cardTextColor} text-[15px] font-bold text-center leading-snug px-4 z-10 transition-colors`}>{theme.cardTopText}</h2>
            <img src={theme.ghostImage} alt="Ghost" className="top-5 left-2.5 object-contain h-full relative z-10" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', maskImage: 'linear-gradient(to bottom right, black 70%, transparent 100%)' }} />
            <div className="absolute inset-0 flex items-center justify-center z-0 opacity-80 pointer-events-none mt-4">
               <div className={`w-48 h-48 rounded-full blur-2xl absolute transition-colors duration-500 ${theme.ghostGlow}`}></div>
            </div>
            <div className="text-center z-20 flex flex-col items-center w-full mt-auto">
              <p className={`${theme.cardSubTextColor} text-[11px] mb-0.5 transition-colors`}>Team</p>
              <h3 className={`${theme.cardTextColor} text-[22px] font-bold mb-1 leading-none transition-colors`}>{teamName}</h3>
              <p className={`${theme.cardSubTextColor} text-[10px] mb-3 max-w-[150px] leading-tight transition-colors`}>{theme.teamMessage}</p>
              <div className="flex items-center justify-center gap-1.5">
                <img src={CoinIcon} alt="coin" className="w-[22px] h-[22px] object-contain" />
                <span className="font-bold text-[#E5A015] text-[28px] leading-none">{score}</span>
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleDownload} className={`mt-6 font-bold text-[14px] px-6 py-3 rounded-xl transition-all w-fit min-w-[240px] active:translate-y-[4px] ${theme.btnBg}`}>
          Download & Share Ceritamu
        </button>

        {isRedeemed && (
          <button 
            onClick={() => navigate("/redeem-success", { state: { sessionCode, nameTeam: actualTeamName, redeemedCoins: redeemedAmount } })} 
            className="mt-4 font-bold text-[14px] px-6 py-3 rounded-xl transition-all w-fit min-w-[240px] active:translate-y-[4px] bg-[#1D2B39] text-white border-2 border-[#16212C] shadow-[0_4px_0_0_#0F172A] hover:bg-[#2A3948] active:shadow-none"
          >
            Selanjutnya ➔
          </button>
        )}

        {(hasValidLink || hasValidImage) && (
          <div onClick={() => setIsQROpen(true)} className="mt-6 bg-white rounded-[14px] p-2 flex items-center gap-3 w-[240px] shadow-sm border border-gray-100 cursor-pointer hover:scale-105 active:scale-95 transition-all">
            {hasValidImage && (
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-100 p-1 overflow-hidden">
                <img src={qrImage} alt="QR Code" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
            <div className="flex-1 min-w-0 flex items-center h-full"> 
              <span className="block text-[13px] font-semibold text-[#1D2B39] underline underline-offset-2 truncate w-full text-center">
                {hasValidLink ? "Buka Link Tautan" : "Klik Untuk Perbesar QR"}
              </span>
            </div>
          </div>
        )}

        {!isRedeemed && (
          <p className={`${theme.subTitleColor} text-[11px] text-center mt-6 max-w-[220px] leading-relaxed transition-colors`}>
            Tunjukkan layar ini ke Kakak PIC di <br/><span className="font-bold text-[#E5A015] text-[13px]">{redeemLocation}</span><br/> untuk klaim hadiahmu!
          </p>
        )}

      </div>

      {isQROpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6 transition-opacity duration-300" onClick={() => setIsQROpen(false)}>
          <div className="w-full max-w-[320px] p-8 rounded-[32px] shadow-2xl flex flex-col items-center transform scale-100 transition-transform duration-300 bg-white" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[20px] font-bold mb-6 text-center text-[#1D2B39]">Jangan lupa isi form dulu ya</h2>
            
            {hasValidImage && (
              <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center p-2 mb-6 shadow-inner border border-gray-100 overflow-hidden">
                <img src={qrImage} alt="Large QR Code" className="w-full h-full object-contain" />
              </div>
            )}

            {hasValidLink && (
              <div className="w-full text-center mb-8">
                  <a href={qrLink.startsWith('http') ? qrLink : `https://${qrLink}`} target="_blank" rel="noreferrer" className="block text-[15px] font-bold underline truncate px-2 text-[#2E9AD7] hover:text-[#1D2B39] transition-colors">
                    {qrLink}
                  </a>
              </div>
            )}

            <button onClick={() => setIsQROpen(false)} className="w-full py-3 rounded-xl font-bold text-[15px] border-2 transition-all bg-[#EBF2F8] border-[#B5C5D1] text-[#1D2B39] hover:bg-[#DCEEFF]">
              Tutup
            </button>
          </div>
        </div>
      )}

    </div>
  );
}