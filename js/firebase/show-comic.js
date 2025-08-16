import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } 
  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNHeF2yGDf3MDd6bRuSq47Gmcei3bndLI",
  authDomain: "end-term-23d47.firebaseapp.com",
  projectId: "end-term-23d47",
  storageBucket: "end-term-23d47.appspot.com",
  messagingSenderId: "370557866713",
  appId: "1:370557866713:web:c31b37081afac84e5ba4c8",
  measurementId: "G-KRBGK13R6H"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Hiển thị danh sách truyện
async function loadComics(user) {
  const listContainer = document.getElementById("comicList");
  listContainer.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "comics"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${data.cover}" alt="${data.title}" />
      <h3>${data.title}</h3>
      <p>Tác giả: ${data.author}</p>
      <p>Giá: ${data.price.toLocaleString()} VND</p>
      <button class="buy-btn">Mua ngay</button>
    `;

    // Bắt sự kiện mua
    card.querySelector(".buy-btn").addEventListener("click", async () => {
      if (!user) {
        alert("Bạn cần đăng nhập để mua truyện!");
        return;
      }

      try {
        await addDoc(collection(db, "orders"), {
          comicId: docSnap.id,
          title: data.title,
          price: data.price,
          buyer: user.uid,
          buyerEmail: user.email,
          createdAt: new Date()
        });
        alert(`Bạn đã mua thành công: ${data.title}`);
      } catch (err) {
        console.error("Lỗi khi lưu đơn hàng:", err);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    });

    listContainer.appendChild(card);
  });
}

// Kiểm tra trạng thái đăng nhập trước khi load truyện
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadComics(user);
  } else {
    alert("Bạn chưa đăng nhập, vui lòng quay lại trang login!");
    window.location.href = "login.html";
  }
});
