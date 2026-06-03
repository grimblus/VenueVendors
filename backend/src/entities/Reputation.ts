import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Venue } from "./Venue";

@Entity()
export class Reputation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  hirer: User;

  @ManyToOne(() => Venue)
  venue: Venue;

  @Column()
  eventName: string;

  @Column()
  dateOfHire: Date;

  @Column()
  rating: number;
}