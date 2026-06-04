import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Booking } from "../entities/Booking";
import { User } from "../entities/User";
import { Venue } from "../entities/Venue";

const bookingRepo = AppDataSource.getRepository(Booking);
const userRepo = AppDataSource.getRepository(User);
const venueRepo = AppDataSource.getRepository(Venue);

export const createBooking = async (req: Request, res: Response) => {
    const { hirerId, venueId, eventName, date, time, duration, capacity } = req.body;

    if (!hirerId || !venueId || !eventName || !date || !time || !duration) {
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    const hirer = await userRepo.findOne({ where: { id: hirerId } });
    if (!hirer) {
        return res.status(404).json({ error: "Hirer not found" });
    }

    const venue = await venueRepo.findOne({ where: { id: venueId } });
    if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
    }

    const booking = bookingRepo.create({
        hirer,
        venue,
        eventName,
        date,
        time,
        duration,
        bookingStatus: "pending"
    });

    await bookingRepo.save(booking);
    return res.status(201).json({ message: "Booking created successfully", booking });
};

export const getBookingsByHirer = async (req: Request, res: Response) => {
    const hirerId = Number(req.params.hirerId);

    const bookings = await bookingRepo.find({
        where: { 
            hirer: { 
                id: hirerId 
            } 
        },
        relations: { 
            venue: true 
        }
    });

    return res.json(bookings);
};