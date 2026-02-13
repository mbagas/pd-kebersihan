# PRODUCT REQUIREMENT DOCUMENT (PRD)

**Project Name:** SIM-PALD (Sistem Informasi Manajemen Pengelolaan Air Limbah Domestik)
**Client:** PD. Kebersihan Tapis Berseri Kota Bandar Lampung
**Platform:** Web Application & Progressive Web App (PWA)
**Stack:** Laravel 12 + React 19
**Version:** 6.0 (Master Release)
**Date:** 2026-02-13
**Status:** Approved for Development

---

## 1. PENDAHULUAN

### 1.1 Latar Belakang
PD. Kebersihan Tapis Berseri memerlukan solusi digital untuk mengatasi masalah kebocoran pendapatan dan ketidaktertiban administrasi dalam layanan sedot tinja. Saat ini, pesanan sering masuk langsung ke mitra swasta tanpa tercatat di pusat, dan pembayaran tunai (COD) rawan tidak disetor. Selain itu, sebagai BUMD, perusahaan memerlukan transparansi data untuk keperluan audit pemerintahan.

### 1.2 Tujuan Sistem
1.  **Sentralisasi (One Gate System):** Mewajibkan seluruh pesanan (Rumah Tangga & Instansi) masuk melalui Web Portal Pusat.
2.  **Manajemen Operasional:** Memudahkan Admin dalam mendistribusikan tugas (Dispatch) ke armada yang tepat (Pusat/Mitra).
3.  **Identifikasi Sumber Daya:** Melabeli setiap petugas berdasarkan induknya (Pusat/Mitra) untuk keperluan statistik kinerja dan bagi hasil, tanpa memberikan akses login kepada pemilik mitra.
4.  **Validasi Lapangan:** Menggunakan teknologi PWA untuk memastikan petugas bekerja di lokasi yang benar (Geotagging) dan mengunggah bukti kerja.

### 1.3 Lingkup Sistem
* **Web Public:** Portal pemesanan bagi masyarakat.
* **Web Admin:** Pusat kontrol operasional dan keuangan.
* **PWA Petugas:** Aplikasi berbasis web untuk petugas lapangan (Mobile View).
* **Auditor Dashboard:** Akses khusus pemantauan kinerja.

---

## 2. ARSITEKTUR & TEKNOLOGI

### 2.1 Tech Stack (Latest Standards)
* **Backend:** **Laravel 12** (PHP 8.4+).
    * *Core:* API Resources, Sanctum Auth, Job Queues, Policy Gates.
* **Frontend:** **React 19** (via Vite).
    * *UI:* Tailwind CSS v4 + Shadcn UI (Responsive Design).
    * *State:* TanStack Query v5 (Data Fetching & Caching).
    * *Maps:* Leaflet JS / Google Maps JS API.
* **Database:** **PostgreSQL** (via Supabase).
* **Infrastructure:** Docker (Nginx, PHP-FPM, Redis for Queue).

### 2.2 Desain PWA (Web-Only)
* **Konsep:** Single Page Application (SPA) yang responsif.
* **Service Workers:** Mengizinkan petugas untuk "Add to Home Screen" dan bekerja dalam kondisi sinyal lemah (Offline Support).
* **Capability:** Mengakses Kamera & GPS Browser untuk validasi operasional.

---

## 3. USER ROLES & PERSONA

### 3.1 Admin (Superuser)
* **Fungsi:** Pengelola tunggal sistem.
* **Wewenang:**
    * Mengelola Data Master (Armada, Tarif, Data Mitra, User Petugas).
    * Dispatching (Assign Order ke Petugas).
    * Validasi Pembayaran Transfer.
    * Konfirmasi Setoran Tunai (Clearing Deposit Petugas).

### 3.2 Customer (Pelanggan)
Terbagi menjadi 2 segmen dengan kebutuhan data berbeda:
1.  **Rumah Tangga:**
    * *Data:* Nama, WA, Alamat, Pinpoint Peta. (Simple).
    * *Kebutuhan:* Armada kecil (akses gang), Tarif Subsidi.
2.  **Instansi/Niaga (Hotel, Resto, RS):**
    * *Data:* Nama Instansi, NPWP, Nama PIC, Kontak PIC, Jenis Usaha.
    * *Kebutuhan:* Estimasi Volume ($m^3$), Info Grease Trap, Armada Besar, Tarif Komersil.

### 3.3 Petugas (Driver/Operator)
* **Fungsi:** Eksekutor lapangan.
* **Atribut:** Memiliki label **"Asal Mitra"** (Misal: UPT Pusat / CV. Swasta A).
* **Wewenang:** Melihat tugas sendiri, Navigasi, Upload Bukti, Input Volume, Terima COD.

### 3.4 Auditor (Pemerintah)
* **Fungsi:** Pengawas Internal/Eksternal.
* **Wewenang:** **Read-Only**. Hanya bisa melihat Dashboard Statistik, Peta Sebaran, dan Laporan Keuangan untuk audit performa BUMD.

---

## 4. SPESIFIKASI MODUL & FITUR

### 4.1 Modul Customer (Public Web)
* **Form Order Cerdas:** Field input berubah dinamis berdasarkan pilihan tipe pelanggan (Rumah Tangga vs Instansi).
* [cite_start]**Estimasi Tarif:** Menampilkan perkiraan biaya berdasarkan kategori pelanggan [cite: 152-154].
* **Tracking Status:** Input No Tiket/HP untuk melihat progres (*Menunggu -> Jalan -> Proses -> Selesai*).
* **Payment Upload:** Form upload bukti transfer jika memilih metode Non-Tunai.

### 4.2 Modul Admin (Dashboard Operasional)
* **Dispatch Console:**
    * Tabel Order Masuk (Status: Pending).
    * Fitur **Assign**: Admin memilih Petugas. Sistem menampilkan label mitra petugas (misal: *"Budi - CV. Maju"*).
* **Payment Validation:**
    * Verifikasi bukti transfer pelanggan.
    * Terima setoran tunai dari petugas (Menu: *Cash Settlement*).
* **Master Data Management:**
    * **Mitra:** Input Nama CV & Kontak (sebagai referensi data petugas).
    * **Armada:** Input Plat No & Kapasitas Tangki.
    * **Tarif:** Setting harga per $m^3$ / Trip.

### 4.3 Modul Petugas (PWA Interface)
* **Job List:** Hanya menampilkan order yang ditugaskan Admin kepadanya.
* **Geotagging Check:**
    * Tombol "Sampai Lokasi" mengambil GPS Browser.
    * Validasi radius < 500m. Jika diluar radius, sistem meminta alasan (Flagging).
* **Evidence Upload:**
    * [cite_start]Wajib upload foto **Sebelum** dan **Sesudah** pengerjaan [cite: 118-120].
* **Volume Input:**
    * Petugas input volume realisasi ($m^3$).
    * Validasi: Tidak boleh melebihi kapasitas tangki armada.
* **Offline Sync:** Data disimpan di browser jika sinyal hilang, auto-upload saat online.

### 4.4 Modul Auditor (Monitoring)
* **Statistik Kinerja:**
    * Grafik Pie: Total Order Pusat vs Mitra.
    * Grafik Bar: Pendapatan Bulanan.
* **Audit Trail:** Melihat detail order, siapa petugasnya, jam berapa sampai, dan foto buktinya.
* **Export Data:** Download Laporan Excel (Harian/Bulanan).

---

## 5. ALUR KERJA UTAMA (BUSINESS LOGIC)

### 5.1 Alur Pemesanan & Dispatching
1.  **Pelanggan** mengisi form order di Web.
2.  **Sistem** membuat tiket status `Pending`.
3.  **Admin** menerima notifikasi. Cek lokasi & kebutuhan armada.
4.  **Admin** melakukan *Assign* ke **Petugas A (Mitra X)**.
5.  **Sistem** ubah status ke `Assigned`. Notifikasi masuk ke PWA Petugas A.

### 5.2 Alur Eksekusi & Pembayaran COD
1.  **Petugas A** klik "Jalan" $\rightarrow$ "Sampai" (Cek GPS).
2.  **Petugas A** melakukan penyedotan. Upload Foto. Input Volume Real (misal 3 $m^3$).
3.  **Sistem** hitung: 3 $m^3$ x Tarif Rumah Tangga = Rp 450.000.
4.  **Petugas A** menagih tunai ke Pelanggan.
5.  **Petugas A** klik "Terima Tunai Rp 450.000" di PWA.
6.  **Sistem**:
    * Status Order: `Completed`.
    * Status Bayar: `Deposit_Held` (Uang di Petugas).
    * Saldo Hutang Petugas A bertambah Rp 450.000.

### 5.3 Alur Setoran (Settlement)
1.  **Petugas A** kembali ke kantor, menyerahkan uang fisik ke Admin.
2.  **Admin** buka menu "Kasir". Cari nama Petugas A.
3.  **Admin** klik "Terima Setoran".
4.  **Sistem** mereset Saldo Hutang Petugas A menjadi 0. Status Bayar order berubah jadi `Paid_Verified`.

---

## 6. DESAIN DATABASE (SCHEMA)

### A. Tabel Referensi (Master)
* **`partners`**:
    * `id`, `name` (e.g. UPT Pusat, CV. Maju), `type` (Internal/External).
* **`fleets`**:
    * `id`, `plate_number`, `capacity` ($m^3$), `status`.
* **`tariffs`**:
    * `id`, `customer_type` (Household/Commercial), `price_per_m3`.

### B. Tabel User
* **`users`**:
    * `id`, `role` (admin, driver, auditor, customer).
    * `partner_id` (FK partners - **Wajib untuk Driver**).
    * `name`, `email/phone`, `password`.
* **`customer_profiles`**:
    * `user_id` (FK).
    * `type` (Household/Commercial).
    * `identity_number` (NPWP - Nullable).
    * `company_name` (Nullable).
    * `address`, `lat`, `long`.
    * `septic_info` (Text).

### C. Tabel Transaksi
* **`service_orders`**:
    * `id` (UUID), `ticket_number`.
    * `customer_id` (FK), `driver_id` (FK), `fleet_id` (FK).
    * `partner_snapshot_id` (FK - Menyimpan data mitra saat order terjadi).
    * `status` (Pending, Assigned, Processing, Done, Cancelled).
    * `payment_method` (COD/Transfer).
    * `payment_status` (Unpaid, Paid, Deposit_Held).
    * `est_volume`, `final_volume`.
    * `total_price`.
* **`service_evidences`**:
    * `order_id`, `photo_before`, `photo_after`.
* **`tracking_logs`**:
    * `order_id`, `action` (Arrived/Finished), `lat`, `long`, `is_valid` (Radius check), `recorded_at`.

---

## 7. RENCANA IMPLEMENTASI (MVP ROADMAP)

### Minggu 1: Foundation & Database
* Setup Laravel 12 & React 19 Monorepo.
* Migrasi Database Supabase (Schema User, Partner, Order).
* Setup Auth (Sanctum) & Role Management.

### Minggu 2: Modul Customer (Public)
* Form Order Responsif (Logic Rumah Tangga vs Instansi).
* Integrasi Peta (Leaflet) untuk Pinpoint lokasi.
* Logic Estimasi Tarif.

### Minggu 3: Modul Admin (Core)
* CRUD Master Data (Mitra, Armada, Tarif).
* Dispatching System (Assign Order).
* Manajemen User Petugas (Mapping ke Mitra).

### Minggu 4: Modul Petugas (PWA)
* Job List UI.
* Fitur Kamera Browser & Geolocation.
* Logic Pembayaran COD & Input Volume.
* Offline Sync Mechanism.

### Minggu 5: Auditor & Finalisasi
* Dashboard Statistik (Chart Pusat vs Mitra).
* Laporan Excel Keuangan.
* User Acceptance Test (UAT) & Deployment.