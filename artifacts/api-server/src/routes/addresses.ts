import { Router, type IRouter } from "express";
import { Address } from "../models/Address.js";

const router: IRouter = Router();

// Get all addresses for a user
router.get("/:userId", async (req, res): Promise<void> => {
  try {
    const addresses = await Address.find({ userId: req.params.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// Create a new address
router.post("/:userId", async (req, res): Promise<void> => {
  try {
    const { type, name, line1, line2, phone, isDefault } = req.body;
    
    if (!name || !line1 || !line2 || !phone) {
      res.status(400).json({ error: "Name, line1, line2, and phone are required" });
      return;
    }

    // If setting as default, unset all other default addresses for this user
    if (isDefault) {
      await Address.updateMany(
        { userId: req.params.userId },
        { isDefault: false }
      );
    }

    const address = new Address({
      userId: req.params.userId,
      type: type || 'Office',
      name,
      line1,
      line2,
      phone,
      isDefault: isDefault || false,
    });
    
    await address.save();
    res.status(201).json({ success: true, address });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ error: "Failed to create address" });
  }
});

// Update an address
router.put("/:userId/:addressId", async (req, res): Promise<void> => {
  try {
    const { type, name, line1, line2, phone, isDefault } = req.body;
    
    // If setting as default, unset all other default addresses for this user
    if (isDefault) {
      await Address.updateMany(
        { userId: req.params.userId, _id: { $ne: req.params.addressId } },
        { isDefault: false }
      );
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.addressId, userId: req.params.userId },
      { type, name, line1, line2, phone, isDefault },
      { new: true, runValidators: true }
    );
    
    if (!address) {
      res.status(404).json({ error: "Address not found" });
      return;
    }
    
    res.json({ success: true, address });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Failed to update address" });
  }
});

// Set address as default
router.patch("/:userId/:addressId/default", async (req, res): Promise<void> => {
  try {
    // Unset all other default addresses for this user
    await Address.updateMany(
      { userId: req.params.userId },
      { isDefault: false }
    );

    // Set this address as default
    const address = await Address.findOneAndUpdate(
      { _id: req.params.addressId, userId: req.params.userId },
      { isDefault: true },
      { new: true }
    );
    
    if (!address) {
      res.status(404).json({ error: "Address not found" });
      return;
    }
    
    res.json({ success: true, address });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ error: "Failed to set default address" });
  }
});

// Delete an address
router.delete("/:userId/:addressId", async (req, res): Promise<void> => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.addressId,
      userId: req.params.userId,
    });
    
    if (!address) {
      res.status(404).json({ error: "Address not found" });
      return;
    }
    
    // If the deleted address was default, set another address as default if available
    if (address.isDefault) {
      const remainingAddresses = await Address.find({ userId: req.params.userId });
      if (remainingAddresses.length > 0) {
        await Address.findByIdAndUpdate(remainingAddresses[0]._id, { isDefault: true });
      }
    }
    
    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Failed to delete address" });
  }
});

export default router;
