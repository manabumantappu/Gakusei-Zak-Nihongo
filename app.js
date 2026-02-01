// ===============================
// FIREBASE INIT (FINAL & AMAN)
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyC6hSNmpkCxVZNdko_BXC1VW7OV7XH2yWw",
  authDomain: "zak-nihongo-app.firebaseapp.com",
  projectId: "zak-nihongo-app",
  storageBucket: "zak-nihongo-app.appspot.com",
  messagingSenderId: "853006734673",
  appId: "1:853006734673:web:6b4d1a3207b0544650af70"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

 /* =========================
   LOGIN FIREBASE
========================= */
function loginUser(){
  const email = loginEmail.value;
  const password = loginPassword.value;

  if(!email || !password){
    alert("Email dan password wajib diisi");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(()=>{
      console.log("LOGIN BERHASIL");
    })
    .catch(err=>{
      alert(err.message);
    });
}

function logout(){
  auth.signOut();
}

/* =========================
   AUTH STATE
========================= */
auth.onAuthStateChanged(user=>{
  if(user){
    loginSection.style.display = "none";
    appContent.style.display = "block";
    renderPengumuman();
    renderPDF();
  }else{
    loginSection.style.display = "block";
    appContent.style.display = "none";
  }
});
/* =========================
   PENGUMUMAN (FIRESTORE)
========================= */
function tambahPengumuman(){
  const isi = pengumumanInput.value;
  if(!isi) return;

  db.collection("pengumuman").add({
    isi,
    waktu: firebase.firestore.FieldValue.serverTimestamp()
  });

  pengumumanInput.value = "";
}


/* =========================
   DATA STORAGE
========================= */
let jadwalList = JSON.parse(localStorage.getItem("jadwal")) || [];
let materiList = JSON.parse(localStorage.getItem("materi")) || [];
let kursusList = JSON.parse(localStorage.getItem("kursus")) || [];
let pdfList = JSON.parse(localStorage.getItem("pdf")) || [];


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

function backupData(){
  const data = {
    siswa: JSON.parse(localStorage.getItem("siswa")),
    jadwal: JSON.parse(localStorage.getItem("jadwal")) || [],
    materi: JSON.parse(localStorage.getItem("materi")) || [],
    kursus: JSON.parse(localStorage.getItem("kursus")) || [],
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
      localStorage.setItem("pdf", JSON.stringify(data.pdf || []));

      alert("✅ Restore berhasil. Aplikasi akan dimuat ulang.");
      location.reload();

    }catch(err){
      alert("❌ File backup tidak valid");
    }
  };
  reader.readAsText(file);
}

function renderDashboard(){
  /* === DATA SISWA === */
  const siswa = JSON.parse(localStorage.getItem("siswa")) || {};
  dashNama.innerText = siswa.nama || "-";
  dashLevel.innerText = siswa.level || "-";
  dashTarget.innerText = siswa.target || "-";

  /* === PROGRES MATERI === */
  const total = materiList.length;
  const selesai = materiList.filter(m => m.status).length;
  const persen = total ? Math.round((selesai / total) * 100) : 0;

  dashMateriTotal.innerText = total;
  dashMateriSelesai.innerText = selesai;
  dashProgress.style.width = persen + "%";

  /* === KURSUS HARI INI === */
  const today = new Date().toISOString().split("T")[0];
  const todayCourses = kursusList.filter(k => k.tanggal === today);

  dashKursusHariIni.innerHTML = "";
  if(todayCourses.length === 0){
    dashKursusHariIni.innerHTML = "<li>Tidak ada kursus hari ini</li>";
  }else{
    todayCourses.forEach(k=>{
      dashKursusHariIni.innerHTML += `
        <li>${k.nama} (${k.jam})</li>
      `;
    });
  }
db.collection("pengumuman")
  .orderBy("waktu","desc")
  .limit(1)
  .get()
  .then(snap=>{
    if(!snap.empty){
      dashPengumuman.innerText = snap.docs[0].data().isi;
    }else{
      dashPengumuman.innerText = "Tidak ada pengumuman";
    }
  });
 }
   
/* =========================
   PDF (STORAGE)
========================= */
function uploadPDF(){
  const file = pdfFile.files[0];
  if(!file) return;

  const ref = storage.ref("pdf/" + file.name);
  ref.put(file).then(()=>{
    ref.getDownloadURL().then(url=>{
      db.collection("pdf").add({
        judul: file.name,
        link: url
      });
    });
  });
}
function renderPDF(){
  listPDF.innerHTML = "";

  db.collection("pdf")
    .onSnapshot(snapshot=>{
      listPDF.innerHTML = "";
      snapshot.forEach(doc=>{
        const p = doc.data();
        listPDF.innerHTML += `
          <li>
            📄 ${p.judul}<br>
            <a href="${p.link}" target="_blank">⬇️ Unduh PDF</a>
          </li>
        `;
      });
    });
}



/* =========================
   INIT
========================= */
renderDashboard();
renderJadwal();
renderMateri();
renderKursus();
reminderHariIni();
