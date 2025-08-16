import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ⚡ Copy firebaseConfig từ firebase-config.js
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

// Lấy danh sách user
async function loadUsers() {
  const userList = document.getElementById("userList");
  userList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.name} - ${data.email}`;
    userList.appendChild(li);
  });
}

// Gọi hàm khi load trang
loadUsers();
