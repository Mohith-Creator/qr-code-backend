const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const qr = require("qr-image");

const app = express();
app.use(cors({ origin: "*" })); // Allow all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // ✅ Serve uploaded files

// ✅ Configure file storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// ✅ File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  const fileUrl = `http://192.168.1.66:5000/uploads/${req.file.filename}`;
  console.log("✅ File uploaded:", fileUrl);
  res.json({ fileUrl }); // Return the file URL
});

// ✅ Generate QR Code
app.post("/generate", (req, res) => {
  const { url } = req.body;
  console.log("🔹 Received request with URL:", url);

  if (!url) {
    console.error("❌ Error: No URL received");
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    console.log("✅ Generating QR for:", url);
    const qrImage = qr.image(url, { type: "png" });
    res.setHeader("Content-Type", "image/png");
    qrImage.pipe(res);
  } catch (error) {
    console.error("❌ Error generating QR code:", error);
    res.status(500).json({ error: "Error generating QR code" });
  }
});

// ✅ Start Server
app.listen(5000, "192.168.1.66", () =>
  console.log("✅ Server running at http://192.168.1.66:5000")
);
