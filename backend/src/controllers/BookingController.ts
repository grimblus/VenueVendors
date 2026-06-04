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
        expectedGuests: String(capacity),
        date,
        time,
        duration,
        bookingStatus: "pending"
    });

    await bookingRepo.save(booking);
    return res.status(201).json({ message: "Booking created successfully", booking });
};

// for hirer
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

// for vendor
export const getBookingsByVenue = async (req: Request, res: Response) => {
    const venueId = Number(req.params.venueId);

    const bookings = await bookingRepo.find({
        where: { 
            venue: { 
                id: venueId 
            } 
        },
        relations: { 
            hirer: true 
        }
    });

    return res.json(bookings);
};

export const updateBooking = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { selected, approved, rejected } = req.body;

    const booking = await bookingRepo.findOne({ where: { id } });
    if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
    }

    // translate frontend booleans to bookingStatus string
    if (rejected) {
        booking.bookingStatus = "rejected";
    } else if (approved) {
        booking.bookingStatus = "approved";
    }

    await bookingRepo.save(booking);
    return res.status(200).json({ message: "Booking updated successfully", booking });
};