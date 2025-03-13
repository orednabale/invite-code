import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InviteCode } from './InviteCode';
import { Usage } from './Usage';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  hashedPassword: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => InviteCode, inviteCode => inviteCode.creator)
  generatedCodes: InviteCode[];

  @OneToMany(() => Usage, usage => usage.user)
  usedCodes: Usage[];

  @ManyToOne(() => User, { nullable: true })
  referrer: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


