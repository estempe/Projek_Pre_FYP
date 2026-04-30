import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginSuperadmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Mencoba login SuperAdmin dengan:", username, password);
    // Nanti tinggal tambahin logika auth dan navigate ke Home SuperAdmin di sini
  };

  return (
    <div className="min-h-screen bg-[#02101B] flex justify-center font-sans">
      {/* Mobile Container (Dark Blue) persis Design System kamu */}
      <div className="w-full max-w-md bg-[#02101B] min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-8 mt-[4vh]">
          
          <h1 className="text-[32px] font-bold text-white text-center leading-tight mb-8">
            Masuk (SuperAdmin)
          </h1>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
            
            {/* --- INPUT GROUP 1: USERNAME --- */}
            <div className="bg-[#1D2A34] rounded-3xl p-3 shadow-lg flex flex-col mx-1">
              <div className="w-fit mx-auto px-4 py-1.5 bg-[#979DA1] rounded-t-[10px] flex justify-center items-center relative z-10 -mb-px">
                <p className="text-[#FFFFFF] font-bold text-[14px]">Username</p>
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full font-sans bg-transparent rounded-[18px] py-4 px-6 text-center text-lg text-white font-medium border-2 border-[#546878] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] focus:border-transparent transition-all"
              />
            </div>

            {/* --- INPUT GROUP 2: PASSWORD --- */}
            <div className="bg-[#1D2A34] rounded-3xl p-3 shadow-lg flex flex-col mx-1">
              <div className="w-fit mx-auto px-4 py-1.5 bg-[#979DA1] rounded-t-[10px] flex justify-center items-center relative z-10 -mb-px">
                <p className="text-[#FFFFFF] font-bold text-[14px]">Password</p>
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full font-sans bg-transparent rounded-[18px] py-4 px-6 text-center text-lg text-white font-medium border-2 border-[#546878] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] focus:border-transparent transition-all"
              />
            </div>

          </form>
        </div>

        {/* --- BOTTOM SECTION (Link Email & Tombol Masuk) --- */}
        <div className="px-8 pb-12 flex flex-col items-center">
          
          {/* Teks Bantuan Superadmin */}
          <div className="text-center mb-6">
            <p className="text-[#FFFFFF] text-[14px] font-medium mb-1">
              Ingin buat akun superadmin baru?
            </p>
            {/* Menggunakan tag <a> dengan mailto agar otomatis buka aplikasi Email */}
            <a 
              href="mailto:abdul.hidayat@binus.ac.id"
              className="text-[#FFFFFF] text-[14px] font-bold underline underline-offset-4 hover:text-[#2E9AD7] transition-colors cursor-pointer"
            >
              Kirim Email
            </a>
          </div>

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