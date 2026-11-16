# Katalog Digital Proyektor Epson 3LCD

Katalog statis bergaya macOS / Apple untuk **21 proyektor Epson Corporate & Education**. Data diambil dari
[epson.co.id › Corporate and Education Projectors](https://www.epson.co.id/For-Work/Projectors/Corporate-and-Education/c/w310id).

## Fitur
- Tampilan jendela ala macOS + navigasi mobile *Apple ChapterNav*
- Mode terang/gelap otomatis mengikuti sistem operasi perangkat (Laptop / HP)
- Filter berdasarkan kategori, fitur (Sumber Laser, Wi-Fi Built-in, RJ45 LAN, Short Throw, Screen Mirroring, Speaker 16W, ≥ 4.000 Lumens, TKDN, Baru 2026) dan resolusi (`XGA`, `WXGA`, `Full HD`, `WUXGA`)
- Urutan berdasarkan kecerahan (Lumens), nama, terbaru atau bobot teringan
- Pencarian Spotlight (`⌘K` / `Ctrl+K` / `/`)
- Halaman detail spesifikasi lengkap (`#/p/EB-FH54`) & perbandingan hingga 4 proyektor (`#/compare/EB-W55,EB-FH54,EB-L210W`)
- Popup *Detail Sertifikat TKDN* saat mengklik nomor sertifikat (`EB-E600` & `EB-X600`)
- Tanpa build step dan tanpa dependensi eksternal

## Menjalankan secara lokal
```bash
python -m http.server 8000
```

## Struktur
```
index.html
assets/css/style.css
assets/js/app.js
assets/js/cert-popup.js   # popup detail sertifikat TKDN
assets/data/products.js   # data proyektor (dibuat otomatis)
assets/data/certs.js      # data sertifikat TKDN
assets/img/*.jpg          # foto produk
scripts/build_data.py
```

## Disclaimer
Gambar produk adalah merek/hak milik Seiko Epson Corporation. Situs ini tidak berafiliasi dengan Epson. Harga tidak tersedia di situs resmi; selalu verifikasi spesifikasi di situs resmi Epson.
