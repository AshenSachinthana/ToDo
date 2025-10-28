// This runs after all tests. Stops the container.
const globalTeardown = async () => {
  if (global.testContainer) {
    await (global.testContainer as any).stop(); 
    delete (global as any).testContainer;
    console.log('🔴 Test PostgreSQL container stopped.');
  }
};

export default globalTeardown;