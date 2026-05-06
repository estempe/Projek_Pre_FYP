import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('auth_token');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // hook untuk membaca posisi URL saat ini
  const location = useLocation(); 
  
  // useRef untuk mencegah alert muncul 2 kali karena efek React Strict Mode
  const alertShown = useRef(false); 

  useEffect(() => {
    // Jika tidak ada token dan alert belum pernah ditampilkan
    if (!token && !alertShown.current) {
      alert("Hayo, kamu belum login ya! Silakan login terlebih dahulu.");
      alertShown.current = true; // Tandai bahwa alert sudah muncul
      setShouldRedirect(true);
    }
  }, [token]);

  // Jika tidak ada token, cegah render dan arahkan ke jalan yang benar
  if (!token) {
    if (shouldRedirect) {
      // Cek awalan URL-nya untuk menentukan arah tendangan
      if (location.pathname.startsWith('/superadmin')) {
        return <Navigate to="/superadmin/login" replace />;
      } else if (location.pathname.startsWith('/pic')) {
        return <Navigate to="/pic/login" replace />;
      } else {
        return <Navigate to="/" replace />; // Default ke mahasiswa jika tidak jelas
      }
    }
    // Tampilkan layar kosong sedetik saat alert muncul
    return null; 
  }

  // Kalau tiketnya ada, silakan masuk ke halamannya
  return children;
}