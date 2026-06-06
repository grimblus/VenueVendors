import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entities/Venue";
import { User } from "../entities/User";
import { Booking } from "../entities/Booking";

const venueRepo = AppDataSource.getRepository(Venue);
const userRepo = AppDataSource.getRepository(User);

// get all venues (for hirer)
export const getAllVenues = async (req: Request, res: Response) => {
  const venues = await venueRepo.find({ 
    relations: {
      vendor: true
    }
  });
  return res.json(venues);
};


export const getVendorVenues = async (req: Request, res: Response) => {
    const vendorId = Number(req.params.vendorId);
    const venues = await venueRepo.find({
        where: { 
            vendor: { 
                id: vendorId 
            } 
        },
        relations: { 
            vendor: true 
        }
    });
    return res.json(venues);
};

export const createVenue = async (req: Request, res: Response) => {
    try {
        const { vendorId, name, eventType, suitableEvents, location, imageUrl } = req.body;

        if (!vendorId || !name || !eventType || !location) {
            return res.status(400).json({ error: "vendorId, name, eventType and location are required" });
        }

        const vendor = await userRepo.findOne({ where: { id: vendorId } });
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        if (vendor.role !== "vendor") {
            return res.status(403).json({ error: "Only vendors can create venues" });
        }

        const venue = venueRepo.create({
            vendor,
            name,
            eventType,
            suitableEvents: suitableEvents || [],
            location,
            imageUrl,
        });

        await venueRepo.save(venue);
        return res.status(201).json({ message: "Venue created successfully", venue });
    } catch (error) {
        console.error("Error creating venue:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateVenue = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id as string);
        const { vendorId, name, eventType, suitableEvents, location, imageUrl } = req.body;

        const venue = await venueRepo.findOne({ 
            where: { id },
            relations: { vendor: true }
        });

        if (!venue) {
            return res.status(404).json({ error: "Venue not found" });
        }

        // make sure only the vendor who owns the venue can update it
        if (venue.vendor.id !== Number(vendorId)) {
            return res.status(403).json({ error: "You can only update your own venues" });
        }

        // update fields
        venue.name = name || venue.name;
        venue.eventType = eventType || venue.eventType;
        venue.suitableEvents = suitableEvents || venue.suitableEvents;
        venue.location = location || venue.location;
        venue.imageUrl = imageUrl || venue.imageUrl;

        await venueRepo.save(venue);
        return res.status(200).json({ message: "Venue updated successfully", venue });
    } catch (error) {
        console.error("Error updating venue:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteVenue = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id as string);
        const vendorId = Number(req.query.vendorId as string);

        const venue = await venueRepo.findOne({ 
            where: { id },
            relations: { vendor: true }
        });

        if (!venue) {
            return res.status(404).json({ error: "Venue not found" });
        }

        // ensure only vendor ownere has permission
        if (venue.vendor.id !== vendorId) {
            return res.status(403).json({ error: "You can only delete your own venues" });
        }

        // delete all bookings for this venue 
        const bookingRepo = AppDataSource.getRepository(Booking);
        await bookingRepo.delete({ venue: { id } });

        // delete venue
        await venueRepo.remove(venue);
        return res.status(200).json({ message: "Venue and its bookings deleted successfully" });
    } catch (error) {
        console.error("Error deleting venue:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const blockTimeslot = async (req: Request, res: Response) => {
    try {
        const { venueId, date, startTime, endTime } = req.body;

        if (!venueId || !date || !startTime || !endTime) {
            return res.status(400).json({
                error: "venueId, date, startTime and endTime are required"
            });
        }

        if (startTime >= endTime) {
            return res.status(400).json({
                error: "End time must be after start time"
            });
        }

        const allVenues = await venueRepo.find();

        const venue = await venueRepo.findOne({
            where: {
                id: Number(venueId)
            }
        });

        if (!venue) {
            const allVenues = await venueRepo.find();

            return res.status(404).json({
                error: "Venue not found",
                receivedVenueId: venueId,
                convertedVenueId: Number(venueId),
                availableVenues: allVenues.map(venue => ({
                    id: venue.id,
                    name: venue.name
                }))
            });
        }

        // alr blocked slots
        const blocked = venue.blockedTimeslots 
            ? JSON.parse(venue.blockedTimeslots) 
            : [];

        const overlaps = blocked.some((slot: any) => {
            if (slot.date !== date) return false;

            return (startTime < slot.endTime && endTime > slot.startTime);
        });

        if (overlaps) {
            return res.status(400).json({ error: "This timeslot overlaps an existing blocked period" });
        }

        // add new slot
        blocked.push({
            id: Date.now(),
            date,
            startTime,
            endTime
        });
        venue.blockedTimeslots = JSON.stringify(blocked);

        await venueRepo.save(venue);
        return res.json({ message: "Timeslot blocked", blocked });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const unblockTimeslot = async (req: Request, res: Response) => {
    try {
        const { venueId, slotId } = req.body;
        const venueRepo = AppDataSource.getRepository(Venue);

        const venue = await venueRepo.findOne({
            where: {
                id: Number(venueId)
            }
        });

        if (!venue) return res.status(404).json({ error: "Venue not found" });

        const blocked = venue.blockedTimeslots 
            ? JSON.parse(venue.blockedTimeslots) 
            : [];

        // remove slot
        venue.blockedTimeslots = JSON.stringify(
            blocked.filter((slot: any) => slot.id !== slotId)
        );

        await venueRepo.save(venue);
        return res.json({ message: "Timeslot unblocked" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};