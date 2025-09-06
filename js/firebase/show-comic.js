import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const comicList = document.getElementById("comicList");

async function loadComics() {
  try {
    const querySnapshot = await getDocs(collection(db, "comics"));
    comicList.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const comic = doc.data();
      comicList.innerHTML += `
        <div class="card">
          <img src="${comic.image}" alt="${comic.title}">
          <div class="card-content">
            <h3>${comic.title}</h3>
            <p>Giá: ${comic.price}₫</p>
            <button class="btn-buy" onclick="addToCart('${doc.id}')">Thêm vào giỏ</button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Lỗi tải truyện:", error);
  }
}

window.addToCart = function (id) {
  alert(`Đã thêm truyện ID: ${id} vào giỏ hàng!`);
};

loadComics();
