import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Mengecek apakah ada tiket masuk di ingatan browser
  const token = localStorage.getItem('auth_token');

  // Kalau tidak ada tiket, tendang kembali ke halaman utama
  if (!token) {
    alert("Hayo, kamu belum login ya! Tidak boleh masuk.");
    return <Navigate to="/" replace />;
  }

  // Kalau tiketnya ada, silakan masuk ke halamannya
  return children;
}