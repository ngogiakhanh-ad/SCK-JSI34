// add-product.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// ✅ Firebase config của bạn
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ✅ Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Cloudinary config
const CLOUD_NAME = "YOUR_CLOUD_NAME";
const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

const form = document.getElementById("addProductForm");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

// Hiển thị ảnh preview
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.innerHTML = `<img src="${reader.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const price = parseFloat(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value);
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const file = imageInput.files[0];

  if (!file) {
    alert("Vui lòng chọn ảnh bìa!");
    return;
  }

  try {
    // ✅ Upload ảnh lên Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const cloudinaryData = await cloudinaryRes.json();
    const imageUrl = cloudinaryData.secure_url;

    // ✅ Lưu sản phẩm vào Firestore
    await addDoc(collection(db, "products"), {
      title,
      price,
      stock,
      category,
      description,
      imageUrl,
      createdAt: new Date()
    });

    alert("✅ Thêm sản phẩm thành công!");
    form.reset();
    preview.innerHTML = "";
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    alert("❌ Có lỗi xảy ra. Vui lòng thử lại!");
  }
});
