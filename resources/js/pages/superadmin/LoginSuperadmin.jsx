import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginSuperadmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Username dan Password wajib diisi!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.data?.role !== "superadmin") {
          alert("Akun ini bukan superadmin.");
          return;
        }

        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("username", data.data.username);
        localStorage.setItem("role", data.data.role);
        navigate("/superadmin/home");
      } else {
        alert(data.message || "Login gagal, periksa kembali username dan password!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke server. Pastikan backend menyala!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02101B] flex justify-center font-sans">
      <div className="w-full max-w-md bg-[#02101B] min-h-screen flex flex-col relative overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-8 mt-[4vh]">
          <h1 className="text-[32px] font-bold text-white text-center leading-tight mb-8">
            Masuk (Superadmin)
          </h1>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
            <div className="bg-[#1D2A34] rounded-3xl p-3 shadow-lg flex flex-col mx-1">
              <div className="w-fit mx-auto px-4 py-1.5 bg-[#979DA1] rounded-t-[10px] flex justify-center items-center relative z-10 -mb-px">
                <p className="text-[#FFFFFF] font-bold text-[14px]">Username</p>
              </div>
              <input
                type="text"
                placeholder="Ketik username disini"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full font-sans bg-transparent rounded-[18px] py-4 px-6 text-center text-lg text-white font-medium border-2 border-[#546878] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] transition-all"
              />
            </div>

            <div className="bg-[#1D2A34] rounded-3xl p-3 shadow-lg flex flex-col mx-1">
              <div className="w-fit mx-auto px-4 py-1.5 bg-[#979DA1] rounded-t-[10px] flex justify-center items-center relative z-10 -mb-px">
                <p className="text-[#FFFFFF] font-bold text-[14px]">Password</p>
              </div>
              <input
                type="password"
                placeholder="Ketik password disini"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full font-sans bg-transparent rounded-[18px] py-4 px-6 text-center text-lg text-white font-medium border-2 border-[#546878] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E9AD7] transition-all"
              />
            </div>

            <div className="pt-6 flex flex-col items-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2E9AD7] text-white font-bold text-[18px] py-3 rounded-2xl border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-none active:translate-y-[6px] transition-all disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}