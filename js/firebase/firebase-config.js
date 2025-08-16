import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } 
  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Đăng ký ---
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const verifyPassword = document.getElementById("verifyPassword").value;

    if (password !== verifyPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      // 🔥 Lưu vào Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        uid: userCredential.user.uid,
        createdAt: new Date()
      });

      alert("Đăng ký thành công!");
      window.location.href = "login.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// --- Đăng nhập ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        uid: user.uid
      }));

      // 🔥 Cập nhật Firestore
      await updateDoc(doc(db, "users", user.uid), {
        lastLogin: new Date()
      });

      alert(`Đăng nhập thành công! Xin chào ${user.displayName || "bạn"}`);
      window.location.href = "index.html";
    } catch (error) {
      alert("Đăng nhập thất bại: " + error.message);
    }
  });
}
