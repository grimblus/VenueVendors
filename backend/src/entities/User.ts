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

  @Column({ default: "hirer" })
  role: string;

  @CreateDateColumn()
  dateCreated: Date;
}