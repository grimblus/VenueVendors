import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entities/Venue";

const venueRepo = AppDataSource.getRepository(Venue);

// GET all venues (hirer sees all)
export const getAllVenues = async (req: Request, res: Response) => {
  const venues = await venueRepo.find({ 
    relations: {
      vendor: true
    }
  });
  return res.json(venues);
};