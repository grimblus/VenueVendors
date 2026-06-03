import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Venue } from "./Venue";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  hirer: User;

  @ManyToOne(() => Venue)
  venue: Venue;

  @Column()
  eventName: string;

  @Column()
  date: Date;

  // Time stored as string in "HH:mm", there wasnt a time type so Im doing string
  @Column()
  time: string;

  @Column()
  duration: number;

  // Statuses are pending, accepted, rejected
  @Column({ default: "pending" })
  bookingStatus: string;

  @CreateDateColumn()
  dateCreated: Date;
}