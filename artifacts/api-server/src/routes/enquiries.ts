import { Router, type IRouter } from "express";
import { Enquiry } from "../models";

const router: IRouter = Router();

// Create a new enquiry
router.post("/", async (req, res): Promise<void> => {
  try {
    const { companyName, email, phone, message, status } = req.body;
    
    if (!companyName || !email || !message) {
      res.status(400).json({ error: "CompanyName, email, and message are required" });
      return;
    }

    const enquiry = new Enquiry({ companyName, email, phone, message, status });
    await enquiry.save();
    
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(500).json({ error: "Failed to create enquiry" });
  }
});

// Get all enquiries
router.get("/", async (_req, res): Promise<void> => {
  try {
    const enquiries = await Enquiry.find();
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
});

// Get a single enquiry by ID
router.get("/:id", async (req, res): Promise<void> => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    
    if (!enquiry) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }
    
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enquiry" });
  }
});

// Update an enquiry
router.put("/:id", async (req, res): Promise<void> => {
  try {
    const { companyName, email, phone, message, status } = req.body;
    
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { companyName, email, phone, message, status },
      { new: true, runValidators: true }
    );
    
    if (!enquiry) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }
    
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ error: "Failed to update enquiry" });
  }
});

// Delete an enquiry
router.delete("/:id", async (req, res): Promise<void> => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    
    if (!enquiry) {
      res.status(404).json({ error: "Enquiry not found" });
      return;
    }
    
    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete enquiry" });
  }
});

export default router;
