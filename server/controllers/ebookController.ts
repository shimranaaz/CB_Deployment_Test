import { Request, Response } from "express";
import Ebook from "../models/Ebook.js";

// ==================== GET ALL EBOOKS (PUBLIC) ====================
export const getAllEbooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const ebooks = await Ebook.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, ebooks });
  } catch (error: any) {
    console.error("Get Ebooks Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch ebooks" });
  }
};

// ==================== GET ALL EBOOKS ADMIN (includes inactive) ====================
export const getAllEbooksAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const ebooks = await Ebook.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, ebooks });
  } catch (error: any) {
    console.error("Get Ebooks Admin Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch ebooks" });
  }
};

// ==================== CREATE EBOOK (ADMIN ONLY) ====================
export const createEbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, coverImage, pdfUrl, fileSize, isFree, color, order } = req.body;

    if (!title || !description || !pdfUrl) {
      res.status(400).json({ message: "Title, description and PDF URL are required" });
      return;
    }

    const ebook = await Ebook.create({
      title: title.trim(),
      description: description.trim(),
      coverImage: coverImage?.trim() || "",
      pdfUrl: pdfUrl.trim(),
      fileSize: fileSize?.trim() || "",
      isFree: Boolean(isFree),
      color: color?.trim() || "#2c2a63",
      order: Number(order) || 0,
      isActive: true,
    });

    console.log(`✅ Ebook created: ${ebook.title}`);
    res.status(201).json({ success: true, message: "Ebook created successfully", ebook });
  } catch (error: any) {
    console.error("Create Ebook Error:", error);
    res.status(500).json({ message: error.message || "Failed to create ebook" });
  }
};

// ==================== UPDATE EBOOK (ADMIN ONLY) ====================
export const updateEbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ebookId } = req.params;
    const { title, description, coverImage, pdfUrl, fileSize, isFree, color, order, isActive } = req.body;

    const ebook = await Ebook.findByIdAndUpdate(
      ebookId,
      {
        $set: {
          ...(title !== undefined && { title: title.trim() }),
          ...(description !== undefined && { description: description.trim() }),
          ...(coverImage !== undefined && { coverImage: coverImage.trim() }),
          ...(pdfUrl !== undefined && { pdfUrl: pdfUrl.trim() }),
          ...(fileSize !== undefined && { fileSize: fileSize.trim() }),
          ...(isFree !== undefined && { isFree: Boolean(isFree) }),
          ...(color !== undefined && { color: color.trim() }),
          ...(order !== undefined && { order: Number(order) }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!ebook) {
      res.status(404).json({ message: "Ebook not found" });
      return;
    }

    console.log(`✅ Ebook updated: ${ebook.title}`);
    res.status(200).json({ success: true, message: "Ebook updated successfully", ebook });
  } catch (error: any) {
    console.error("Update Ebook Error:", error);
    res.status(500).json({ message: error.message || "Failed to update ebook" });
  }
};

// ==================== DELETE EBOOK (ADMIN ONLY) ====================
export const deleteEbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ebookId } = req.params;

    const ebook = await Ebook.findByIdAndDelete(ebookId);

    if (!ebook) {
      res.status(404).json({ message: "Ebook not found" });
      return;
    }

    console.log(`✅ Ebook deleted: ${ebook.title}`);
    res.status(200).json({ success: true, message: "Ebook deleted successfully" });
  } catch (error: any) {
    console.error("Delete Ebook Error:", error);
    res.status(500).json({ message: error.message || "Failed to delete ebook" });
  }
};

// ==================== TOGGLE EBOOK ACTIVE STATUS (ADMIN ONLY) ====================
export const toggleEbookStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ebookId } = req.params;
    const { isActive } = req.body;

    const ebook = await Ebook.findByIdAndUpdate(
      ebookId,
      { $set: { isActive: Boolean(isActive) } },
      { new: true }
    );

    if (!ebook) {
      res.status(404).json({ message: "Ebook not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Ebook ${isActive ? "activated" : "deactivated"} successfully`,
      ebook,
    });
  } catch (error: any) {
    console.error("Toggle Ebook Status Error:", error);
    res.status(500).json({ message: error.message || "Failed to toggle ebook status" });
  }
};