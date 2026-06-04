import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entities/Venue";

const venueRepo = AppDataSource.getRepository(Venue);

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