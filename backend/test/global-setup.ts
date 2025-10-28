import { PostgreSqlContainer } from '@testcontainers/postgresql';

// This runs before all tests
const globalSetup = async () => {
  const container = await new PostgreSqlContainer('postgres:16')
    .withDatabase('test_todoapp')  // Custom DB name 
    .withUsername('testuser')      // Custom user
    .withPassword('testpass123')   // Secure but simple password
    .start();

  // Override env vars – Sequelize in DatabaseModule will use these
  process.env.DATABASE_HOST = container.getHost();  // Usually 'localhost'
  process.env.DATABASE_PORT = container.getMappedPort(5432).toString();  // Dynamic mapped port
  process.env.DATABASE_USER = container.getUsername();
  process.env.DATABASE_PASSWORD = container.getPassword();
  process.env.DATABASE_NAME = container.getDatabase();

  // Store container globally for teardown (Jest's global object persists across files)
  global.testContainer = container;

  console.log('🟢 Test PostgreSQL container started!');
  console.log(`   Host: ${process.env.DATABASE_HOST}`);
  console.log(`   Port: ${process.env.DATABASE_PORT}`);
  console.log(`   DB: ${process.env.DATABASE_NAME}`);
  console.log(`   User: ${process.env.DATABASE_USER}`);
};

// Export as default for Jest globalSetup
export default globalSetup;