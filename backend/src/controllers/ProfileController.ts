// backend/controllers/ProfileController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export const getProfile = async (req: Request, res: Response) => {
    const email = req.params.email as string;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        dateCreated: user.dateCreated,
    });
};

export const updateProfile = async (req: Request, res: Response) => {
    const { email } = req.params;
    const { firstName, lastName, phone } = req.body;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    await userRepository.save(user);

    return res.status(200).json({
        message: "Profile updated successfully",
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            dateCreated: user.dateCreated,
        }
    });
};