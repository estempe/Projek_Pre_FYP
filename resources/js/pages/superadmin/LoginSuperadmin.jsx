import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState(''); // Ubah email jadi username
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 
        
        if (!username || !password) {
            alert('Username dan Password wajib diisi!');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password }) // Kirim username
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('auth_token', data.token);
                
                if (data.data.role === 'superadmin') {
                    navigate('/superadmin/home');
                } else if (data.data.role === 'pic') {
                    navigate('/pic/home');
                } else {
                    alert('Role tidak dikenali.');
                }
            } else {
                alert(data.message || 'Login gagal, pastikan Username dan Password benar.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Gagal terhubung ke server Laravel.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#02101B] flex justify-center font-sans">
            <div className="w-full max-w-md bg-[#02101B] min-h-screen flex flex-col justify-center px-8 relative">
                
                <div className="text-center mb-10">
                    <h1 className="text-[32px] font-bold text-white leading-tight mb-2">
                        Selamat Datang!
                    </h1>
                    <p className="text-white/70 text-[15px] font-medium">
                        Silakan masuk sebagai Admin
                    </p>
                </div>

                <form onSubmit={handleLogin} className="bg-[#1D2A34] rounded-[24px] p-6 shadow-lg flex flex-col gap-5">
                    
                    <div className="flex flex-col">
                        <label className="text-[#FFFFFF] font-bold text-[13px] mb-2 px-1">Username</label>
                        <input
                            type="text" // Ubah dari email ke text
                            placeholder="Contoh: superadmin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-transparent rounded-[16px] py-3.5 px-5 text-white font-medium border-2 border-[#546878] focus:border-[#2E9AD7] outline-none transition-all"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[#FFFFFF] font-bold text-[13px] mb-2 px-1">Kata Sandi</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent rounded-[16px] py-3.5 px-5 text-white font-medium border-2 border-[#546878] focus:border-[#2E9AD7] outline-none transition-all"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 bg-[#2E9AD7] text-white font-bold text-[16px] py-3.5 rounded-[16px] border-2 border-[#2e84b6] shadow-[0_6px_0_0_#1C6B99] hover:bg-[#268bc4] active:shadow-none active:translate-y-[6px] transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Memproses..." : "Masuk"}
                    </button>

                </form>
            </div>
        </div>
    );
}