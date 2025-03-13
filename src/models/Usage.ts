import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Column } from 'typeorm';
import { User } from './User';
import { InviteCode } from './InviteCode';

@Entity()
export class Usage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InviteCode, inviteCode => inviteCode.usages)
  inviteCode: InviteCode;

  @ManyToOne(() => User, user => user.usedCodes)
  user: User;

  @Column()
  usedIp: string;

  @Column({ nullable: true })
  userAgent: string;

  @CreateDateColumn()
  usedAt: Date;
}

