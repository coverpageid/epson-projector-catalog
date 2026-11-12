"""Build assets/data/products.js from scraped Epson Indonesia Projector data.

Usage: python scripts/build_data.py <epson_projectors.json> <proj1.html>
Downloads product images into assets/img/ and writes assets/data/products.js.
"""
import html, json, re, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
OUT = ROOT / "assets" / "data" / "products.js"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"}

# model -> (category, tagline, resolution, aspect, lumens_int, lumens_str, contrast, light_source, hdmi_count, wifi_mode, lan, short_throw, mirroring, speaker)
CURATED = {
    "EB-E01":    ("xga",   "Proyektor XGA paling ekonomis dan ringan untuk kelas & ruang rapat kecil.", "XGA", "4:3", 3300, "3.300 lm", "15.000:1", "Lampu", 1, "none", False, False, False, "2W"),
    "EB-E600":   ("xga",   "Proyektor TKDN (55,70%) XGA 3.400 lumens untuk pendidikan dan instansi.", "XGA", "4:3", 3400, "3.400 / 2.200 lm", "15.000:1", "Lampu", 1, "none", False, False, False, "2W"),
    "EB-E12":    ("xga",   "Generasi baru XGA 3.600 lumens dengan 2 port HDMI dalam bodi ringkas 2,4 kg.", "XGA", "4:3", 3600, "3.600 / 2.200 lm", "15.000:1", "Lampu", 2, "none", False, False, False, "2W"),
    "EB-X06":    ("xga",   "Proyektor XGA 3.600 lumens dengan koreksi keystone otomatis dan opsi Wi-Fi.", "XGA", "4:3", 3600, "3.600 lm", "16.000:1", "Lampu", 1, "optional", False, False, False, "2W"),
    "EB-X600":   ("xga",   "Proyektor TKDN (55,02%) XGA 3.600 lumens dilengkapi RJ45 LAN & opsi Wi-Fi.", "XGA", "4:3", 3600, "3.600 / 2.400 lm", "16.000:1", "Lampu", 1, "optional", True, False, False, "2W"),
    "EB-X52":    ("xga",   "Generasi baru XGA 3.800 lumens dengan 2× HDMI untuk ruang rapat terang.", "XGA", "4:3", 3800, "3.800 / 2.500 lm", "16.000:1", "Lampu", 2, "optional", False, False, False, "2W"),
    "EB-972":    ("xga",   "Proyektor korporat/pendidikan XGA 4.100 lumens dengan speaker 16W & RJ45 LAN.", "XGA", "4:3", 4100, "4.100 lm", "16.000:1", "Lampu", 2, "optional", True, False, False, "16W"),
    "EB-W50":    ("wxga",  "Proyektor WXGA 3.800 lumens kontras tinggi 20.000:1 untuk korporat & signage.", "WXGA", "16:10", 3800, "3.800 lm", "20.000:1", "Lampu", 2, "builtin", True, False, False, "—"),
    "EB-W53":    ("wxga",  "Generasi baru layar lebar WXGA 4.000 lumens dengan 2 port HDMI.", "WXGA", "16:10", 4000, "4.000 / 2.600 lm", "16.000:1", "Lampu", 2, "none", False, False, False, "2W"),
    "EB-W55":    ("wxga",  "Generasi baru WXGA 4.000 lumens dengan Wi-Fi Built-in untuk presentasi nirkabel.", "WXGA", "16:10", 4000, "4.000 / 2.600 lm", "16.000:1", "Lampu", 2, "builtin", False, False, False, "2W"),
    "EB-982W":   ("wxga",  "Proyektor WXGA 4.200 lumens dengan speaker 16W, 2× HDMI, dan RJ45 LAN.", "WXGA", "16:10", 4200, "4.200 lm", "16.000:1", "Lampu", 2, "optional", True, False, False, "16W"),
    "EB-FH54":   ("fhd",   "Generasi baru Full HD 1080p 4.100 lumens dengan Wi-Fi Built-in & speaker 16W.", "Full HD", "16:9", 4100, "4.100 / 2.300 lm", "16.000:1", "Lampu", 2, "builtin", False, False, True, "16W"),
    "EB-U50":    ("fhd",   "Proyektor WUXGA (1920×1200) 3.700 lumens dengan detail tajam & Wi-Fi.", "WUXGA", "16:10", 3700, "3.700 lm", "16.000:1", "Lampu", 2, "builtin", True, False, False, "5W"),
    "EB-W56S":   ("short", "Generasi baru Short Throw WXGA 3.700 lumens dengan speaker 16W & RJ45 LAN.", "WXGA", "16:10", 3700, "3.700 / 2.000 lm", "16.000:1", "Lampu", 2, "optional", True, True, False, "16W"),
    "EB-L210SW": ("short", "Proyektor Laser Short Throw WXGA 4.000 lumens dengan Wi-Fi & Screen Mirroring.", "WXGA", "16:10", 4000, "4.000 / 2.800 lm", "> 5.000.000:1", "Laser", 2, "builtin", True, True, True, "16W"),
    "EB-L210SF": ("short", "Proyektor Laser Short Throw Full HD 1080p 4.000 lumens dengan Screen Mirroring.", "Full HD", "16:9", 4000, "4.000 / 2.800 lm", "> 5.000.000:1", "Laser", 2, "builtin", True, True, True, "16W"),
    "EB-L210W":  ("laser", "Proyektor Laser WXGA 4.500 lumens bebas perawatan hingga 20.000 jam.", "WXGA", "16:10", 4500, "4.500 / 3.100 lm", "> 5.000.000:1", "Laser", 2, "builtin", True, False, True, "16W"),
    "EB-L260F":  ("laser", "Proyektor Laser Full HD 1080p 4.600 lumens dengan Wi-Fi, Mirroring & Edge Blending.", "Full HD", "16:9", 4600, "4.600 / 3.200 lm", "> 5.000.000:1", "Laser", 2, "builtin", True, False, True, "16W"),
    "EB-2065":   ("venue", "Proyektor ruangan besar XGA 5.500 lumens dengan jaringan LAN & speaker 16W.", "XGA", "4:3", 5500, "5.500 / 3.800 lm", "15.000:1", "Lampu", 2, "optional", True, False, False, "16W"),
    "EB-2155W":  ("venue", "Proyektor ruangan besar WXGA 5.000 lumens untuk aula dan ruang konferensi.", "WXGA", "16:10", 5000, "5.000 / 3.600 lm", "15.000:1", "Lampu", 2, "optional", True, False, False, "16W"),
    "EB-2265U":  ("venue", "Flagship WUXGA 5.500 lumens dengan HDBaseT, Screen Mirroring & 2× HDMI.", "WUXGA", "16:10", 5500, "5.500 / 3.800 lm", "15.000:1", "Lampu", 2, "optional", True, False, True, "16W"),
}
NEW_2026 = {"EB-E12", "EB-X52", "EB-W53", "EB-W55", "EB-W56S", "EB-FH54"}
# Data resmi TKDN Epson (Valid efektif per 28 Agustus 2026): model -> (kode, nilai_tkdn, nilai_bmp, total, no_sertifikat)
TKDN = {
    "EB-E600": ("V11H981055", "42,05%", "13,65%", "55,70%", "8453/SJ-IND.8/E-TKDN/9/2024"),
    "EB-X600": ("V11H982055", "41,37%", "13,65%", "55,02%", "8509/SJ-IND.8/E-TKDN/9/2024"),
}
DISCONTINUED = {"EB-X500"}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()


def model_of(name):
    return name.replace("Epson", "").strip()


def find(specs, *pats):
    for kv in specs.values():
        for k, v in kv.items():
            if any(re.search(p, k, re.I) for p in pats):
                return v
    return ""


def main():
    data = json.load(open(sys.argv[1], encoding="utf-8"))
    images = {}
    for f in sys.argv[2:]:
        h = open(f, encoding="utf-8").read()
        for m in re.finditer(r"data-sku='([^']+)' data-element_type='img'>\s*<img class=\"lazyOwl\" src=\"([^\"]+)\"", h):
            images[m.group(1)] = html.unescape(m.group(2))

    IMG.mkdir(parents=True, exist_ok=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out = []
    for p in data:
        model = model_of(p["name"])
        if model in DISCONTINUED or model not in CURATED:
            continue
        specs = p["specs"]
        cat, tagline, res, aspect, lm_int, lm_str, contrast, light, hdmi, wifi_mode, lan, short_throw, mirroring, speaker = CURATED[model]
        img_file = ""
        img_url = p.get("img_url") or images.get(p["sku"], "")
        if img_url:
            img_file = f"assets/img/{p['sku']}.jpg"
            dest = ROOT / img_file
            if not dest.exists():
                try:
                    dest.write_bytes(get(img_url))
                except Exception as e:
                    print("img fail", model, e); img_file = ""
        clean_specs = {}
        if model in TKDN:
            tk_code, tk_val, tk_bmp, tk_tot, tk_cert = TKDN[model]
            clean_specs["Sertifikasi TKDN Kemenperin RI"] = {
                "Nomor Sertifikat TKDN": tk_cert,
                "Kode Produk TKDN": tk_code,
                "Nilai TKDN": tk_val,
                "Nilai BMP": tk_bmp,
                "Total Nilai TKDN + BMP": tk_tot,
                "Masa Pakai Lampu (Normal / Eco)": "6.000 jam / 12.000 jam",
                "Fitur Unggulan": "Split Screen" if model == "EB-E600" else "Split Screen, Auto Vertical Keystone, Horizontal Keystone Adjuster, Wireless Projection (Epson iProjection)",
            }
        for c, kv in specs.items():
            if c.startswith("_") or c == "Projectors Facets": continue
            clean_specs[c] = kv
        weight_raw = find(specs, r"^Berat$|^Weight$").replace("Approx.", "").strip()
        dim_raw = find(specs, r"Dimension Excluding")
        out.append({
            "model": model,
            "name": f"Epson {model}",
            "sku": p["sku"],
            "url": p["url"],
            "image": img_file,
            "category": cat,
            "tagline": tagline,
            "resolution": res,
            "aspect": aspect,
            "lumens": lm_int,
            "lumensText": lm_str,
            "contrast": contrast,
            "lightSource": light,
            "hdmi": hdmi,
            "wifiMode": wifi_mode,
            "wifi": wifi_mode in ("builtin", "optional"),
            "wifiBuiltin": wifi_mode == "builtin",
            "lan": lan,
            "shortThrow": short_throw,
            "mirroring": mirroring,
            "speaker": speaker,
            "isNew": model in NEW_2026,
            "tkdn": model in TKDN,
            "tkdnScore": TKDN[model][3] if model in TKDN else "",
            "tkdnCert": TKDN[model][4] if model in TKDN else "",
            "dimensions": dim_raw,
            "weight": weight_raw,
            "specs": clean_specs,
        })
    order = ["xga", "wxga", "fhd", "short", "laser", "venue"]
    out.sort(key=lambda r: (order.index(r["category"]), r["lumens"], r["model"]))
    OUT.write_text("// Generated by scripts/build_data.py — data source: epson.co.id\nwindow.PRODUCTS = "
                   + json.dumps(out, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    print(len(out), "projectors,", sum(1 for r in out if r["image"]), "images")


if __name__ == "__main__":
    main()
