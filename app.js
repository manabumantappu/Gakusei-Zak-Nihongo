let jadwal = JSON.parse(localStorage.getItem("jadwal")) || [];
let materi = JSON.parse(localStorage.getItem("materi")) || [];
let kursus = JSON.parse(localStorage.getItem("kursus")) || [];

function simpanSiswa(){
  const siswa = {
    nama: nama.value,
    level: level.value,
    target: target.value
  };
  localStorage.setItem("siswa", JSON.stringify(siswa));
  alert("Data siswa tersimpan");
}

function tambahJadwal(){
  jadwal.push(jadwal.value);
  localStorage.setItem("jadwal", JSON.stringify(jadwal));
  renderJadwal();
}

function renderJadwal(){
  listJadwal.innerHTML = "";
  jadwal.forEach(j => {
    listJadwal.innerHTML += `<li>${j}</li>`;
  });
}

function tambahMateri(){
  materi.push({
    judul: materi.value,
    jenis: jenis.value,
    status: false
  });
  localStorage.setItem("materi", JSON.stringify(materi));
  renderMateri();
}

function renderMateri(){
  listMateri.innerHTML = "";
  materi.forEach((m,i)=>{
    listMateri.innerHTML += `
      <li>
        <input type="checkbox" onchange="toggleMateri(${i})" ${m.status?'checked':''}>
        ${m.judul} (${m.jenis})
      </li>`;
  });
  updateProgres();
}

function toggleMateri(i){
  materi[i].status = !materi[i].status;
  localStorage.setItem("materi", JSON.stringify(materi));
  updateProgres();
}

function updateProgres(){
  const selesai = materi.filter(m=>m.status).length;
  const persen = materi.length ? Math.round((selesai/materi.length)*100) : 0;
  progress.style.width = persen+"%";
  progresText.innerText = `${persen}% selesai`;
}

function tambahKursus(){
  const data = {
    nama: kursusNama.value,
    tanggal: kursusTanggal.value,
    jam: kursusJam.value,
    pengajar: kursusPengajar.value,
    kelas: kursusKelas.value
  };

  if(!data.nama || !data.tanggal || !data.jam){
    alert("Nama kursus, tanggal, dan jam wajib diisi");
    return;
  }

  kursus.push(data);
  localStorage.setItem("kursus", JSON.stringify(kursus));
  renderKursus();

  kursusNama.value = "";
  kursusTanggal.value = "";
  kursusJam.value = "";
  kursusPengajar.value = "";
  kursusKelas.value = "";
}

renderJadwal();
renderMateri();
