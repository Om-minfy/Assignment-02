import User from '../models/user.model.js';
import { z } from 'zod';

const searchQuerySchema = z.object({
  email: z.string().email({ message: "Invalid email address" })
});

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = await User.find({}).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

export const searchUser = async (req, res) => {
  try {
    const validationResult = searchQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.issues[0].message });
    }

    const { email } = validationResult.data;
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({ message: "Phew! Your partner is not on the list." });
    }

    return res.status(200).json(foundUser);
  } catch (error) {
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, age, city, picture } = req.body;

    if (!firstName || !lastName || !email || !age || !city || !picture) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists." });
    }

    const newUser = new User({ firstName, lastName, email, age, city, picture });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User successfully deleted." });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user." });
  }
};