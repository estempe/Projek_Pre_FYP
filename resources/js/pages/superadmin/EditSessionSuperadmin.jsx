import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';

export default function EditSessionSuperadmin() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sessionName, setSessionName] = useState('');
    const [duration, setDuration] = useState('');
    const [redeemName, setRedeemName] = useState('');
    const [redeemLocation, setRedeemLocation] = useState('');
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Ambil data lama saat halaman dibuka
    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch(`/api/sessions/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    const s = result.data;
                    setSessionName(s.name);
                    setDuration(s.duration);
                    setRedeemName(s.redeem_name);
                    setRedeemLocation(s.redeem_location);
                    setPosts(s.posts || []);
                }
            } catch (error) {
                console.error("Gagal ambil data edit:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSessionData();
    }, [id]);

    // 2. Logika Tambah/Hapus Pos
    const addPost = () => setPosts([...posts, { name: '', location: '' }]);
    const removePost = (index) => setPosts(posts.filter((_, i) => i !== index));
    const handlePostChange = (index, field, value) => {
        const newPosts = [...posts];
        newPosts[index][field] = value;
        setPosts(newPosts);
    };

    // 3. Simpan Perubahan
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`/api/sessions/${id}`, {
                method: 'PUT', // Menggunakan PUT untuk update[cite: 5]
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: sessionName,
                    duration,
                    redeem_name: redeemName,
                    redeem_location: redeemLocation,
                    posts
                })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                alert("Sesi berhasil diperbarui!");
                navigate(`/superadmin/session/detail/${id}`);
            } else {
                alert("Gagal update: " + result.message);
            }
        } catch (error) {
            console.error("Error updating session:", error);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-[#EBF2F8] flex justify-center items-center">Memuat...</div>;

    return (
        <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-20">
            <div className="w-full max-w-md bg-[#EBF2F8] px-6 pt-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[#1D2B39] font-bold mb-8">
                    <img src={BackArrowDark} alt="Back" className="w-5 h-5" /> Kembali
                </button>

                <h1 className="text-[32px] font-bold text-[#1D2B39] mb-8">Edit Sesi</h1>

                <form onSubmit={handleUpdate} className="space-y-6">
                    {/* INFO UTAMA */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[14px] font-bold text-[#1D2B39] mb-2">Nama Sesi</label>
                            <input type="text" value={sessionName} onChange={(e) => setSessionName(e.target.value)} className="w-full bg-white border border-[#CBD5E1] rounded-[12px] px-4 py-3" required />
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#1D2B39] mb-2">Durasi (HH:MM:SS)</label>
                            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-white border border-[#CBD5E1] rounded-[12px] px-4 py-3" placeholder="01:30:00" required />
                        </div>
                    </div>

                    {/* EDIT POS */}
                    <div className="pt-4">
                        <h2 className="text-[18px] font-bold text-[#1D2B39] mb-4">Pengaturan Pos</h2>
                        {posts.map((pos, index) => (
                            <div key={index} className="bg-white p-4 rounded-[16px] mb-4 border border-[#E4E9EF] relative shadow-sm">
                                <button type="button" onClick={() => removePost(index)} className="absolute top-2 right-2 text-red-500 font-bold px-2">✕</button>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Nama Pos" value={pos.name} onChange={(e) => handlePostChange(index, 'name', e.target.value)} className="w-full border-b border-[#F1F5F9] py-1 font-bold focus:outline-none" required />
                                    <input type="text" placeholder="📍 Lokasi Pos" value={pos.location} onChange={(e) => handlePostChange(index, 'location', e.target.value)} className="w-full text-[13px] text-[#92A0AD] focus:outline-none" required />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addPost} className="w-full py-3 border-2 border-dashed border-[#CBD5E1] rounded-[16px] text-[#92A0AD] font-bold text-[14px]">+ Tambah Pos Baru</button>
                    </div>

                    {/* REDEEM INFO */}
                    <div className="pt-4 space-y-4">
                        <h2 className="text-[18px] font-bold text-[#1D2B39] mb-2">Info Penukaran Hadiah</h2>
                        <input type="text" placeholder="Nama Tempat Redeem" value={redeemName} onChange={(e) => setRedeemName(e.target.value)} className="w-full bg-white border border-[#CBD5E1] rounded-[12px] px-4 py-3" />
                        <input type="text" placeholder="Lokasi Lengkap" value={redeemLocation} onChange={(e) => setRedeemLocation(e.target.value)} className="w-full bg-white border border-[#CBD5E1] rounded-[12px] px-4 py-3" />
                    </div>

                    <button type="submit" className="w-full bg-[#202E3C] text-white font-bold py-4 rounded-[16px] shadow-lg mt-8">
                        Simpan Perubahan
                    </button>
                </form>
            </div>
        </div>
    );
}