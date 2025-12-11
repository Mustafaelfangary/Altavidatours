import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createPermanentAdmin() {
  try {
    console.log('Creating permanent admin user...');
    
    const adminEmail = 'dark1devil2025@outlook.com';
    const adminPassword = '1082034D1d@#';
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating to ensure proper settings...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Update existing user to be admin with verified email
      const updatedAdmin = await prisma.user.update({
        where: { email: adminEmail },
        data: {
          name: 'System Administrator',
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: new Date()
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true
        }
      });
      
      console.log('✅ Admin user updated successfully:');
      console.log(updatedAdmin);
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      // Create new admin user
      const newAdmin = await prisma.user.create({
        data: {
          name: 'System Administrator',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: new Date()
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true
        }
      });
      
      console.log('✅ Admin user created successfully:');
      console.log(newAdmin);
    }
    
    console.log('\n🎉 Permanent admin user is ready!');
    console.log('📧 Email: dark1devil2025@outlook.com');
    console.log('🔑 Password: 1082034D1d@#');
    console.log('👑 Role: ADMIN');
    console.log('✅ Email Verified: true');
    console.log('\nThe admin can now sign in without email verification!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createPermanentAdmin();
