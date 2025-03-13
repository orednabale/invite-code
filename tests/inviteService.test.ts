import { InviteService } from '../src/services/inviteService';
import { createConnection, getRepository, Connection } from 'typeorm';
import { User } from '../src/models/User';
import { InviteCode } from '../src/models/InviteCode';
import { Usage } from '../src/models/Usage';

describe('InviteService', () => {
  let connection: Connection;
  let testUser: User;

  beforeAll(async () => {
    // Set up test database connection
    connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [User, InviteCode, Usage],
      synchronize: true,
      logging: false
    });

    // Create test user
    const userRepo = getRepository(User);
    testUser = new User();
    testUser.email = 'test@example.com';
    testUser.isAdmin = true;
    await userRepo.save(testUser);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should generate a valid invite code', async () => {
    const invite = await InviteService.generateCode(testUser.id, 5, 30);
    
    expect(invite).toBeDefined();
    expect(invite.code).toBeDefined();
    expect(invite.code.length).toBeGreaterThan(0);
    expect(invite.maxUses).toBe(5);
    expect(invite.currentUses).toBe(0);
    
    const inviteRepo = getRepository(InviteCode);
    const savedInvite = await inviteRepo.findOne({ where: { id: invite.id }, relations: ['creator'] });
    
    expect(savedInvite).toBeDefined();
    expect(savedInvite?.creator.id).toBe(testUser.id);
  });

  it('should use an invite code correctly', async () => {
    // Generate code first
    const invite = await InviteService.generateCode(testUser.id, 1, 30);
    
    // Use the code
    const result = await InviteService.useCode(
      invite.code,
      'newuser@example.com',
      '127.0.0.1',
      'Test Agent'
    );
    
    expect(result).toBe(true);
    
    // Check if code usage was recorded
    const inviteRepo = getRepository(InviteCode);
    const usedInvite = await inviteRepo.findOne({ where: { id: invite.id } });
    
    expect(usedInvite).toBeDefined();
    expect(usedInvite?.currentUses).toBe(1);
    expect(usedInvite?.isActive).toBe(false); // Should be deactivated after max uses
    
    // Check if user was created
    const userRepo = getRepository(User);
    const newUser = await userRepo.findOne({ where: { email: 'newuser@example.com' }, relations: ['referrer'] });
    
    expect(newUser).toBeDefined();
    expect(newUser?.referrer.id).toBe(testUser.id);
        
  });
});

