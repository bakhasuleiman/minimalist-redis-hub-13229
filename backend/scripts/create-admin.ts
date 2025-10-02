import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    // Check if admin already exists using raw SQL
    const existingAdminResult = await db.$queryRaw`
      SELECT * FROM users WHERE email = 'admin@system.local' LIMIT 1
    `;
    
    const existingAdmin = (existingAdminResult as any[])[0];

    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Zxc11!', 10);

    // Create admin user using raw SQL
    const userId = `admin_${Date.now()}`;
    const now = new Date().toISOString();
    
    await db.$executeRaw`
      INSERT INTO users (id, email, username, name, password, role, isHidden, createdAt, updatedAt)
      VALUES (${userId}, 'admin@system.local', 'admin', 'System Administrator', ${hashedPassword}, 'ADMIN', 1, ${now}, ${now})
    `;

    // Create initial site settings using raw SQL
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
      const settingId = `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await db.$executeRaw`
        INSERT OR REPLACE INTO site_settings (id, key, value, description, updatedAt)
        VALUES (${settingId}, ${setting.key}, ${setting.value}, ${setting.description || null}, ${now})
      `;
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