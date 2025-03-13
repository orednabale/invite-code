import { app, initializeApp } from './app';

const PORT = process.env.PORT || 3000;

// Start the server
const startServer = async () => {
  await initializeApp();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

