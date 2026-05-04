import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

export default function LoginPIC() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 2. Aktifkan navigasi

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // 3. Tembak data ke API Laravel
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      // 4. Cek keberhasilan
      if (response.ok && data.success) {
        alert("Login PIC Berhasil! Selamat bertugas, " + data.data.name);
        
        // Simpan token ke localStorage
        localStorage.setItem('auth_token', data.token);
        
        // Arahkan ke halaman Home khusus PIC
        navigate('/pic/home');
      } else {
        alert(data.message || "Login gagal, periksa kembali username dan password!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke server. Pastikan backend menyala!");
    }
  };

  return (
    <div className="min-h-screen bg-[#02101B] flex justify-center font-sans">
      {/* Mobile Container (Dark Blue) persis CreateTeam */}
      <div className="w-full max-w-md bg-[#02101B] min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-8 mt-[4vh]">
          
          <h1 className="text-[32px] font-bold text-white text-center leading-tight mb-8">
            Masuk (PIC)
          </h1>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
            
            {/* --- INPUT GROUP 1: USERNAME --- */}
            <div className="bg-[#1D2A34] rounded-3xl p-3 shadow-lg flex flex-col mx-1">
              {/* Label "Username" dengan gaya topi persis CreateTeam */}
              <div className="w-fit mx-auto px-4 py-1.5 bg-[#979DA1] rounded-t-[10px] flex justify-center items-center relative z-10 -mb-px">
                <p className="text-[#FFFFFF] font-bold text-[14px]">Username</p>
              </div>

              {/* Input Field Username */}
              <input
                type="text"
                placeholder="Ketik username disini"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full font-sans bg-transparent rounded-[18px] py-4 px-6 text-center text-lg text-white font-medium border-2 border-[#546878] placeholder-white/40 placeholder:font-sans placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] focus:border-transparent transition-all"
              />
            </div>

            {/* --- INPUT GROUP 2: PASSWORD --- */}
            <div className="bg-[#1D2A34] rounded-3xl p-3 shadow-lg flex flex-col mx-1">
              {/* Label "Password" dengan gaya topi persis CreateTeam */}
              <div className="w-fit mx-auto px-4 py-1.5 bg-[#979DA1] rounded-t-[10px] flex justify-center items-center relative z-10 -mb-px">
                <p className="text-[#FFFFFF] font-bold text-[14px]">Password</p>
              </div>

              {/* Input Field Password */}
              <input
                type="password"
                placeholder="Ketik password disini"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full font-sans bg-transparent rounded-[18px] py-4 px-6 text-center text-lg text-white font-medium border-2 border-[#546878] placeholder-white/40 placeholder:font-sans placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] focus:border-transparent transition-all"
              />
            </div>

          </form>
        </div>

        {/* --- BOTTOM BUTTON (Persis Design System kamu) --- */}
        <div className="px-8 pb-12 flex flex-col items-center">
          <button 
            onClick={handleLogin}
            type="button"
            className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-3 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-[0_0_0_0_#1C6B99] active:translate-y-[6px] transition-all"
          >
            Masuk
          </button>
        </div>

      </div>
    </div>
  );
}