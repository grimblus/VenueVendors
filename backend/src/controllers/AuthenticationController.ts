import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isStrongPassword = (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&^#\-_]).{6,}$/;
    return strongPasswordRegex.test(password);
};

export const signUp = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Email, password, first name and last name are required" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isStrongPassword(password)) {
        return res.status(400).json({ message: "Password must be at least 6 characters and contain uppercase, lowercase, and special character" });
    }

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }

    const user = userRepository.create({ email, password, firstName, lastName, phone });
    await userRepository.save(user);

    return res.status(201).json({ message: "User registered successfully" });
};

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (!isStrongPassword(password)) {
        return res.status(400).json({ message: "Password must be at least 6 characters and contain uppercase, lowercase, and special character" });
    }

    const user = await userRepository.findOne({ where: { email, password } });
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
        message: "Login successful",
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