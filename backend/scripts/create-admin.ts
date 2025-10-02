import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Zxc11!', 10);

    // Create admin user
    const admin = await db.user.create({
      data: {
        email: 'admin@system.local',
        username: 'admin',
        name: 'System Administrator',
        password: hashedPassword,
        role: 'ADMIN',
        isHidden: true
      }
    });

    // Create initial site settings
    const defaultSettings = [
      {
        key: 'site_name',
        value: 'Minimalist Redis Hub',
        description: 'Название сайта'
      },
      {
        key: 'site_description',
        value: 'Система управления продуктивностью',
        description: 'Описание сайта'
      },
      {
        key: 'max_users',
        value: '1000',
        description: 'Максимальное количество пользователей'
      },
      {
        key: 'registration_enabled',
        value: 'true',
        description: 'Разрешена ли регистрация новых пользователей'
      }
    ];

    for (const setting of defaultSettings) {
      await db.siteSettings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting
      });
    }

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@system.local');
    console.log('👤 Username: admin');
    console.log('🔑 Password: Zxc11!');
    console.log('🎛️ Role: ADMIN');
    console.log('👻 Hidden: true');
    console.log('⚙️ Initial site settings created');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await db.$disconnect();
  }
}

createAdminUser();