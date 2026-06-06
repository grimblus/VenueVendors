import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;  

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  role: string;

  @Column({ default: 0 })
  totalStars: number; 

  @Column({ default: 0 })
  reviewCount: number;

  // compliance document fields
  @Column({ nullable: true, type: "nvarchar", length: "MAX" })
  driversLicense: string;

  @Column({ nullable: true, type: "nvarchar", length: "MAX" })
  publicLiabilityInsurance: string;

  @Column({ default: false })
  isBusinessApplication: boolean;

  @Column({ nullable: true })
  abnNumber: string;

  @Column({ nullable: true, type: "nvarchar", length: "MAX" })
  businessRegistration: string;

  @Column({ default: 0 })
  complianceScore: number;

  @CreateDateColumn()
  dateCreated: Date;
}