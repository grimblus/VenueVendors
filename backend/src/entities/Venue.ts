// backend/src/entities/Booking.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Booking } from "./Booking";

@Entity()
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  vendor: User;

  @OneToMany(() => Booking, (booking) => booking.venue)
  bookings: Booking[];

  @Column()
  name: string;

  @Column()
  expectedGuests: number;

  @Column()
  dateHeld: Date;

  // Time stored as string in "HH:mm", there wasnt a time type so Im doing string
  @Column()
  time: string;

  @Column()
  duration: number;

  @Column()
  eventType: string;

  @Column("simple-array")
  suitableEvents: string[];

  @Column()
  location: string;
}