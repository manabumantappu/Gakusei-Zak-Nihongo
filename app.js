/* =========================
   DATA STORAGE
========================= */
let jadwalList = JSON.parse(localStorage.getItem("jadwal")) || [];
let materiList = JSON.parse(localStorage.getItem("materi")) || [];
let kursusList = JSON.parse(localStorage.getItem("kursus")) || [];
let pengumumanList = JSON.parse(localStorage.getItem("pengumuman")) || [];
let pdfList = JSON.parse(localStorage.getItem("pdf")) || [];

/* =========================
   ELEMENTS
========================= */
const jadwalInput = document.getElementById("jadwalInput");
const materiInput = document.getElementById("materiInput");
const jenis = document.getElementById("jenis");

const nama = document.getElementById("nama");
const level = document.getElementById("level");
const target = document.getElementById("target");

const kursusNama = document.getElementById("kursusNama");
const kursusTanggal = document.getElementById("kursusTanggal");
const kursusJam = document.getElementById("kursusJam");
const kursusPengajar = document.getElementById("kursusPengajar");
const kursusKelas = document.getElementById("kursusKelas");

const listJadwal = document.getElementById("listJadwal");
const listMateri = document.getElementById("listMateri");
const listKursus = document.getElementById("listKursus");

const progress = document.getElementById("progress");
const progresText = document.getElementById("progresText");

/* =========================
   SISWA
========================= */
function simpanSiswa(){
  const siswa = {
    nama: nama.value,
    level: level.value,
    target: target.value
  };
  localStorage.setItem("siswa", JSON.stringify(siswa));
  alert("✅ Data siswa tersimpan");
}

/* =========================
   JADWAL BELAJAR
========================= */
function tambahJadwal(){
  if(!jadwalInput.value) return;

  jadwalList.push(jadwalInput.value);
  localStorage.setItem("jadwal", JSON.stringify(jadwalList));
  jadwalInput.value = "";
  renderJadwal();
}

function renderJadwal(){
  listJadwal.innerHTML = "";
  jadwalList.forEach(j => {
    listJadwal.innerHTML += `<li>${j}</li>`;
  });
}

/* =========================
   MATERI BELAJAR
========================= */
function tambahMateri(){
  if(!materiInput.value) return;

  materiList.push({
    judul: materiInput.value,
    jenis: jenis.value,
    status: false
  });

  localStorage.setItem("materi", JSON.stringify(materiList));
  materiInput.value = "";
  renderMateri();
}

function renderMateri(){
  listMateri.innerHTML = "";
  materiList.forEach((m,i)=>{
    listMateri.innerHTML += `
      <li>
        <input type="checkbox" onchange="toggleMateri(${i})" ${m.status ? "checked" : ""}>
        ${m.judul} (${m.jenis})
      </li>`;
  });
  updateProgres();
}

function toggleMateri(i){
  materiList[i].status = !materiList[i].status;
  localStorage.setItem("materi", JSON.stringify(materiList));
  updateProgres();
}

function updateProgres(){
  const selesai = materiList.filter(m=>m.status).length;
  const persen = materiList.length ? Math.round((selesai / materiList.length) * 100) : 0;

  progress.style.width = persen + "%";
  progresText.innerText = `${persen}% selesai`;
}

/* =========================
   JADWAL KURSUS
========================= */
function tambahKursus(){
  if(!kursusNama.value || !kursusTanggal.value || !kursusJam.value){
    alert("⚠️ Nama, tanggal, dan jam kursus wajib diisi");
    return;
  }

  kursusList.push({
    nama: kursusNama.value,
    tanggal: kursusTanggal.value,
    jam: kursusJam.value,
    pengajar: kursusPengajar.value,
    kelas: kursusKelas.value
  });

  localStorage.setItem("kursus", JSON.stringify(kursusList));
  renderKursus();

  kursusNama.value = "";
  kursusTanggal.value = "";
  kursusJam.value = "";
  kursusPengajar.value = "";
  kursusKelas.value = "";
}

function renderKursus(){
  listKursus.innerHTML = "";
  kursusList.forEach((k,i)=>{
    listKursus.innerHTML += `
      <li>
        <strong>${k.nama}</strong><br>
        📅 ${k.tanggal} | ⏰ ${k.jam}<br>
        👨‍🏫 ${k.pengajar || "-"}<br>
        🏫 ${k.kelas || "-"}<br><br>

        <button onclick="editKursus(${i})">✏️ Edit</button>
        <button onclick="hapusKursus(${i})">🗑 Hapus</button>
      </li>
    `;
  });
}

function editKursus(i){
  const k = kursusList[i];

  kursusNama.value = k.nama;
  kursusTanggal.value = k.tanggal;
  kursusJam.value = k.jam;
  kursusPengajar.value = k.pengajar;
  kursusKelas.value = k.kelas;

  kursusList.splice(i,1);
  localStorage.setItem("kursus", JSON.stringify(kursusList));
  renderKursus();
}

function hapusKursus(i){
  if(confirm("Yakin hapus jadwal kursus ini?")){
    kursusList.splice(i,1);
    localStorage.setItem("kursus", JSON.stringify(kursusList));
    renderKursus();
  }
}

/* =========================
   REMINDER HARI INI
========================= */
function reminderHariIni(){
  const today = new Date().toISOString().split("T")[0];
  const todayCourses = kursusList.filter(k => k.tanggal === today);

  if(todayCourses.length){
    let msg = "📢 Kursus Hari Ini:\n\n";
    todayCourses.forEach(k=>{
      msg += `• ${k.nama} (${k.jam})\n`;
    });
    alert(msg);
  }
}
function tambahPengumuman(){
  if(!pengumumanInput.value) return;

  pengumumanList.unshift({
    isi: pengumumanInput.value,
    waktu: new Date().toLocaleString("id-ID")
  });

  localStorage.setItem("pengumuman", JSON.stringify(pengumumanList));
  pengumumanInput.value = "";
  renderPengumuman();
}

function renderPengumuman(){
  listPengumuman.innerHTML = "";
  pengumumanList.forEach((p,i)=>{
    listPengumuman.innerHTML += `
      <li>
        <strong>📢 Pengumuman</strong><br>
        ${p.isi}<br>
        <small>🕒 ${p.waktu}</small><br><br>
        <button onclick="hapusPengumuman(${i})">🗑 Hapus</button>
      </li>
    `;
  });
}

function hapusPengumuman(i){
  if(confirm("Hapus pengumuman ini?")){
    pengumumanList.splice(i,1);
    localStorage.setItem("pengumuman", JSON.stringify(pengumumanList));
    renderPengumuman();
  }
}
function backupData(){
  const data = {
    siswa: JSON.parse(localStorage.getItem("siswa")),
    jadwal: JSON.parse(localStorage.getItem("jadwal")) || [],
    materi: JSON.parse(localStorage.getItem("materi")) || [],
    kursus: JSON.parse(localStorage.getItem("kursus")) || [],
    pengumuman: JSON.parse(localStorage.getItem("pengumuman")) || [],
    pdf: JSON.parse(localStorage.getItem("pdf")) || []
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "backup-siswa-bahasa-jepang.json";
  a.click();
  URL.revokeObjectURL(url);
}
function restoreData(){
  const fileInput = document.getElementById("restoreFile");
  const file = fileInput.files[0];

  if(!file){
    alert("Pilih file backup terlebih dahulu");
    return;
  }

  if(!confirm("Restore akan mengganti SEMUA data lama. Lanjutkan?")){
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const data = JSON.parse(e.target.result);

      localStorage.setItem("siswa", JSON.stringify(data.siswa || {}));
      localStorage.setItem("jadwal", JSON.stringify(data.jadwal || []));
      localStorage.setItem("materi", JSON.stringify(data.materi || []));
      localStorage.setItem("kursus", JSON.stringify(data.kursus || []));
      localStorage.setItem("pengumuman", JSON.stringify(data.pengumuman || []));
      localStorage.setItem("pdf", JSON.stringify(data.pdf || []));

      alert("✅ Restore berhasil. Aplikasi akan dimuat ulang.");
      location.reload();

    }catch(err){
      alert("❌ File backup tidak valid");
    }
  };
  reader.readAsText(file);
}

/* =========================
   INIT
========================= */
renderPengumuman();
renderPDF();
renderJadwal();
renderMateri();
renderKursus();
reminderHariIni();
