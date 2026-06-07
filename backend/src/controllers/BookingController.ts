import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Booking } from "../entities/Booking";
import { User } from "../entities/User";
import { Venue } from "../entities/Venue";

const bookingRepo = AppDataSource.getRepository(Booking);
const userRepo = AppDataSource.getRepository(User);
const venueRepo = AppDataSource.getRepository(Venue);

export const createBooking = async (req: Request, res: Response) => {
    const { 
        hirerId, 
        venueId, 
        eventName, 
        date, 
        time, 
        duration, 
        capacity,
        driversLicense,
        publicLiabilityInsurance,
        isBusinessApplication,
        abnNumber,
        businessRegistration
    } = req.body;

    if (!hirerId || !venueId || !eventName || !date || !time || !duration) {
        return res.status(400).json({ error: "Please fill in all required fields" });
    }

    const hirer = await userRepo.findOne({ where: { id: hirerId } });
    if (!hirer) {
        return res.status(404).json({ error: "Hirer not found" });
    }

    const venue = await venueRepo.findOne({ where: { id: venueId } });
    if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
    }

    //Timeblock stuff
    const blocked = venue.blockedTimeslots
    ? JSON.parse(venue.blockedTimeslots)
    : [];

    const bookingStart = time;

    const bookingEndDate = new Date(`2000-01-01T${time}:00`);

    bookingEndDate.setHours(
        bookingEndDate.getHours() + Number(duration)
    );

    const bookingEnd =
        bookingEndDate.toTimeString().slice(0, 5);

    const conflictsWithBlocked = blocked.some(
        (slot: any) => {
            if (slot.date !== date) {
                return false;
            }
            return (
                bookingStart < slot.endTime &&
                bookingEnd > slot.startTime
            );
        }
    );

    if (conflictsWithBlocked) {
        return res.status(400).json({
            error:
                "Venue is currently blocked for this time"
        });
    }

    // calculate compliance score
    const complianceScore = calculateComplianceScore(
        driversLicense,
        publicLiabilityInsurance,
        isBusinessApplication,
        businessRegistration
    );

    const booking = bookingRepo.create({
        hirer,
        venue,
        eventName,
        expectedGuests: String(capacity),
        date,
        time,
        duration,
        bookingStatus: "pending",
        driversLicense: driversLicense || null,
        publicLiabilityInsurance: publicLiabilityInsurance || null,
        isBusinessApplication: isBusinessApplication || false,
        abnNumber: abnNumber || null,
        businessRegistration: businessRegistration || null,
        complianceScore,
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
        },
        select: {
            id: true,
            eventName: true,
            expectedGuests: true,
            date: true,
            time: true,
            duration: true,
            bookingStatus: true,
            hirer: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                totalStars: true,
                reviewCount: true,
                complianceScore: true,
                driversLicense: true,
                publicLiabilityInsurance: true,
                businessRegistration: true,
                isBusinessApplication: true,
                abnNumber: true,
            }
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

//for specific vendor stats
export const getVendorBookingStats = async (req: Request, res: Response) => {
    try {
        const vendorId = Number(req.params.vendorId);

        const bookings = await bookingRepo.find({
            where: { venue: { vendor: { id: vendorId } } },
            relations: { venue: true, hirer: true }
        });

        return res.json(bookings);
    } catch (error) {
        console.error("Error fetching vendor stats:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//for universal stats
export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingRepo.find({
            relations: { venue: true, hirer: true }
        });
        return res.json(bookings);
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// calculates score based on submitted documents
const calculateComplianceScore = (
    driversLicense: string | null,
    publicLiabilityInsurance: string | null,
    isBusinessApplication: boolean,
    businessRegistration: string | null
): number => {
    let score = 0;

    if (driversLicense) score += 2; // 2 stars for drivers license
    if (publicLiabilityInsurance) score += 2; // 2 stars for insurance
    if (isBusinessApplication && businessRegistration) score += 1; // 1 star for business registration

    return Math.min(score, 5); // cap at 5
};