const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads", "proofs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("proof"), async (req, res) => {
  try {
    const { userId, name, email, tripPlace, bookingDate, persons, totalPrice } =
      req.body;

    if (
      !userId ||
      !name ||
      !email ||
      !tripPlace ||
      !bookingDate ||
      !persons ||
      !totalPrice
    ) {
      return res
        .status(400)
        .json({ message: "Missing required booking fields." });
    }

    const bookingDateObj = new Date(bookingDate);
    if (isNaN(bookingDateObj)) {
      return res.status(400).json({ message: "Invalid bookingDate." });
    }

    const bookingData = {
      userId,
      tripPlace,
      name,
      email,
      bookingDate: bookingDateObj,
      persons: Number(persons),
      totalPrice: Number(totalPrice),
    };

    if (req.file) {
      bookingData.proof = req.file.filename;
    }

    const booking = new Booking(bookingData);
    await booking.save();

    res
      .status(201)
      .json({ message: "Booking confirmed successfully!", booking });
  } catch (error) {
    console.error("Booking save error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.proof) {
      const filePath = path.join(uploadDir, booking.proof);
      fs.unlink(filePath, (err) => {
        if (err) console.warn("Failed to delete proof file:", err);
      });
    }

    await Booking.deleteOne({ _id: id });

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
});

module.exports = router;
