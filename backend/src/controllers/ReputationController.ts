import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Reputation } from "../entities/Reputation";

export const getReputationByHirer = async (req: Request, res: Response) => {
    try {
        console.log("Reputation route hit, hirerId:", req.params.hirerId);

        const hirerId = Number(req.params.hirerId);

        if (isNaN(hirerId)) {
            return res.status(400).json({ error: "Invalid hirer ID" });
        }

        const reputationRepo = AppDataSource.getRepository(Reputation);
        const reputations = await reputationRepo.find({
            where: { 
                hirer: { 
                    id: hirerId 
                } 
            },
            relations: { 
                venue: true 
            }
        });

        return res.json(reputations);
    } catch (error) {
        console.error("Error fetching reputation:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};