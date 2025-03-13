// src/models/InviteCode.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Usage } from './Usage';

@Entity()
export class InviteCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  maxUses: number;

  @Column({ default: 0 })
  currentUses: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, user => user.generatedCodes)
  creator: User;

  @OneToMany(() => Usage, usage => usage.inviteCode)
  usages: Usage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

