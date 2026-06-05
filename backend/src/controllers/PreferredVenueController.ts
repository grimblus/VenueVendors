import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { PreferredVenue } from "../entities/PreferredVenue";
import { User } from "../entities/User";
import { Venue } from "../entities/Venue";

export const getPreferredVenues = async (req: Request, res: Response) => {
    const hirerId = Number(req.params.hirerId);
    const preferredVenueRepo = AppDataSource.getRepository(PreferredVenue);

    const preferred = await preferredVenueRepo.find({
        where: { hirer: { id: hirerId } },
        relations: { venue: true },
        order: { ranking: "ASC" }
    });

    // return venue with pref
    const result = preferred.map(pv => ({
        ...pv.venue,
        preference: pv.ranking
    }));

    return res.json(result);
};

export const addPreferredVenue = async (req: Request, res: Response) => {
    const { hirerId, venueId, rank } = req.body;
    const preferredVenueRepo = AppDataSource.getRepository(PreferredVenue);
    const userRepo = AppDataSource.getRepository(User);
    const venueRepo = AppDataSource.getRepository(Venue);

    if (!hirerId || !venueId || !rank) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const hirer = await userRepo.findOne({ 
        where: { 
            id: hirerId 
        } 
    });
    
    if (!hirer) return res.status(404).json({ 
        error: "Hirer not found" 
    });

    const venue = await venueRepo.findOne({ 
        where: { 
            id: venueId 
        } 
    });

    if (!venue) return res.status(404).json({ 
        error: "Venue not found" 
    });

    // remove existing preference for this venue if it exists
    await preferredVenueRepo.delete({ 
        hirer: { 
            id: hirerId 
        }, 
        venue: { 
            id: venueId 
        } 
    });

    // remove existing preference with same rank if it exists
    await preferredVenueRepo.delete({ 
        hirer: { 
            id: hirerId 
        }, ranking: rank 
    });

    const preferred = preferredVenueRepo.create({ 
        hirer, venue, ranking: rank 
    });

    await preferredVenueRepo.save(preferred);

    return res.status(201).json({ message: "Preference saved" });
};