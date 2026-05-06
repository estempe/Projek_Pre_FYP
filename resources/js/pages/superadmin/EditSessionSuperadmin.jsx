import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackArrowDark from '../../assets/Back-Arrow-Icon-Dark.svg';

export default function EditSessionSuperadmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    redeem_name: '',
    redeem_location: '',
    qr_link: '',
    qr_image_path: '' 
  });
  
  const [posts, setPosts] = useState([]);
  const [qrFile, setQrFile] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`/api/sessions/${id}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        const result = await res.json();
        
        if (res.ok && result.success) {
          const data = result.data;
          setFormData({
            name: data.name || '',
            duration: data.duration || '',
            redeem_name: data.redeem_name || '',
            redeem_location: data.redeem_location || '',
            qr_link: data.qr_link || '',
            qr_image_path: data.qr_image_path || '' 
          });
          setPosts(data.posts || []);
        } else {
          alert("Gagal memuat data sesi.");
        }
      } catch (error) {
        alert("Koneksi bermasalah.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setQrFile(e.target.files[0]);
    }
  };

  const handleAddPost = () => {
    setPosts([...posts, { name: '', location: '' }]);
  };

  const handleRemovePost = (index) => {
    const newPosts = posts.filter((_, i) => i !== index);
    setPosts(newPosts);
  };

  const handlePostChange = (index, field, value) => {
    const newPosts = [...posts];
    newPosts[index][field] = value;
    setPosts(newPosts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const payload = new FormData();
      payload.append('_method', 'PUT'); 
      
      payload.append('name', formData.name);
      payload.append('duration', formData.duration);
      payload.append('redeem_name', formData.redeem_name);
      payload.append('redeem_location', formData.redeem_location);
      payload.append('qr_link', formData.qr_link || '');
      
      // PERBAIKAN: Gunakan 'qr_image' agar selaras dengan fungsi store dan update di Laravel
      if (qrFile) {
          payload.append('qr_image', qrFile); 
      }

      posts.forEach((post, index) => {
        if (post.id) {
          payload.append(`posts[${index}][id]`, post.id);
        }
        payload.append(`posts[${index}][name]`, post.name);
        payload.append(`posts[${index}][location]`, post.location);
      });

      const res = await fetch(`/api/sessions/${id}`, {
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: payload
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert("Detail Sesi dan Pos berhasil diperbarui!");
        navigate(`/superadmin/session/detail/${id}`);
      } else {
        alert(result.message || "Gagal memperbarui sesi.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#EBF2F8] flex items-center justify-center font-bold text-[#92A0AD]">Memuat form edit...</div>;

  return (
    <div className="min-h-screen bg-[#EBF2F8] font-sans flex justify-center pb-12">
      <div className="w-full max-w-md bg-[#EBF2F8] min-h-screen flex flex-col relative px-6 pt-12">
        
        <div className="flex items-center mb-8 relative">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[#1D2B39] font-bold text-[15px] hover:opacity-70 transition-opacity">
            <img src={BackArrowDark} alt="Batal" className="w-5 h-5" />
            Batal
          </button>
        </div>

        <h1 className="text-[32px] font-bold text-[#1D2B39] mb-8 leading-tight">Edit Detail<br/>Sesi</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="flex flex-col">
            <label className="text-[#92A0AD] font-bold text-[13px] mb-2 px-1">Nama Sesi</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-[#CBD5E1] rounded-[16px] py-3.5 px-4 text-[15px] text-[#1D2B39] font-medium focus:outline-none focus:border-[#2E9AD7] shadow-sm"/>
          </div>

          <div className="flex flex-col">
            <label className="text-[#92A0AD] font-bold text-[13px] mb-2 px-1">Durasi Sesi (HH:MM:SS)</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} required placeholder="Contoh: 02:30:00" className="w-full border border-[#CBD5E1] rounded-[16px] py-3.5 px-4 text-[15px] text-[#1D2B39] font-medium focus:outline-none focus:border-[#2E9AD7] shadow-sm"/>
          </div>

          <div className="flex flex-col">
            <label className="text-[#92A0AD] font-bold text-[13px] mb-2 px-1">Nama Pos Tukar (Redeem)</label>
            <input type="text" name="redeem_name" value={formData.redeem_name} onChange={handleChange} required className="w-full border border-[#CBD5E1] rounded-[16px] py-3.5 px-4 text-[15px] text-[#1D2B39] font-medium focus:outline-none focus:border-[#2E9AD7] shadow-sm"/>
          </div>

          <div className="flex flex-col">
            <label className="text-[#92A0AD] font-bold text-[13px] mb-2 px-1">Lokasi Pos Tukar</label>
            <input type="text" name="redeem_location" value={formData.redeem_location} onChange={handleChange} required className="w-full border border-[#CBD5E1] rounded-[16px] py-3.5 px-4 text-[15px] text-[#1D2B39] font-medium focus:outline-none focus:border-[#2E9AD7] shadow-sm"/>
          </div>

          <div className="w-full h-px bg-[#D0D9E0] my-2"></div>

          <div className="flex flex-col gap-3">
            <h2 className="text-[#1D2B39] font-bold text-[18px] mb-2">Daftar Pos Game</h2>
            
            {posts.map((post, index) => (
              <div key={index} className="bg-white p-4 rounded-[16px] border border-[#CBD5E1] shadow-sm relative flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="bg-[#EBF2F8] text-[#2E9AD7] font-bold text-[12px] px-3 py-1 rounded-full">Pos {index + 1}</span>
                  <button type="button" onClick={() => handleRemovePost(index)} className="text-[#E53E3E] text-[12px] font-bold hover:underline">Hapus</button>
                </div>
                <input 
                  type="text" placeholder="Nama Pos" value={post.name} onChange={(e) => handlePostChange(index, 'name', e.target.value)} required
                  className="w-full border border-[#E4E9EF] rounded-[10px] py-2.5 px-3 text-[14px] text-[#1D2B39] focus:outline-none focus:border-[#2E9AD7]"
                />
                <input 
                  type="text" placeholder="Lokasi Pos" value={post.location} onChange={(e) => handlePostChange(index, 'location', e.target.value)} required
                  className="w-full border border-[#E4E9EF] rounded-[10px] py-2.5 px-3 text-[14px] text-[#1D2B39] focus:outline-none focus:border-[#2E9AD7]"
                />
              </div>
            ))}

            <button type="button" onClick={handleAddPost} className="w-full mt-2 bg-[#EBF2F8] text-[#2E9AD7] font-bold py-3.5 rounded-[12px] border border-dashed border-[#2E9AD7] hover:bg-[#d8e8f5] transition-colors">
              + Tambah Pos Lainnya
            </button>
          </div>

          <div className="w-full h-px bg-[#D0D9E0] my-2"></div>

          <div className="flex flex-col">
            <label className="text-[#92A0AD] font-bold text-[13px] mb-2 px-1">Link Grup / Tautan Ekstra (Opsional)</label>
            <input type="text" name="qr_link" value={formData.qr_link} onChange={handleChange} placeholder="Masukkan URL..." className="w-full border border-[#CBD5E1] rounded-[16px] py-3.5 px-4 text-[15px] text-[#1D2B39] font-medium focus:outline-none focus:border-[#2E9AD7] shadow-sm"/>
          </div>

          <div className="flex flex-col">
            <label className="text-[#92A0AD] font-bold text-[13px] mb-2 px-1">Upload Gambar QR Baru (Opsional)</label>
            {formData.qr_image_path && (
              <div className="mb-3 px-1">
                <p className="text-[#22C55E] text-[12px] font-bold flex items-center gap-1"><span>✅</span> Gambar QR sebelumnya sudah tersimpan.</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full bg-white border border-[#CBD5E1] rounded-[16px] py-3 px-4 text-[14px] text-[#92A0AD] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EBF2F8] file:text-[#2E9AD7] hover:file:bg-[#d8e8f5] shadow-sm"/>
            <p className="text-[#92A0AD] text-[11px] mt-2 px-1">*Biarkan kosong jika tidak ingin mengubah gambar saat ini.</p>
          </div>

          <button type="submit" disabled={isSaving} className={`w-full mt-6 text-white font-bold text-[18px] py-4 rounded-[16px] border-2 shadow-[0_6px_0_0_#1C6B99] transition-all ${isSaving ? 'bg-[#92A0AD] border-[#7A8A99] shadow-[0_6px_0_0_#627382] cursor-not-allowed' : 'bg-[#2E9AD7] border-[#2e84b6] hover:bg-[#268bc4] active:shadow-none active:translate-y-[6px]'}`}>
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

        </form>
      </div>
    </div>
  );
}