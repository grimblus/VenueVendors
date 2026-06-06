import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Venue } from "./Venue";

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  hirer: User;

  @ManyToOne(() => Venue, (venue) => venue.bookings)
  venue: Venue;

  @Column()
  eventName: string;

  @Column()
  expectedGuests: string;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column()
  duration: number;

  @Column({ default: "pending" })
  bookingStatus: string;

  // compliance documents
  @Column({ nullable: true, type: "nvarchar", length: "MAX" })
  driversLicense: string;        // base64 jpg

  @Column({ nullable: true, type: "nvarchar", length: "MAX" })
  publicLiabilityInsurance: string;  // base64 pdf

  @Column({ default: false })
  isBusinessApplication: boolean;

  @Column({ nullable: true })
  abnNumber: string;

  @Column({ nullable: true, type: "nvarchar", length: "MAX" })
  businessRegistration: string;  // base64 pdf

  @Column({ default: 0 })
  complianceScore: number; 

  @CreateDateColumn()
  dateCreated: Date;
}