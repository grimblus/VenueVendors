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
  eventType: string;

  @Column("simple-array")
  suitableEvents: string[];

  @Column()
  location: string;

  @Column({ nullable: true})
  imageUrl: string;
}