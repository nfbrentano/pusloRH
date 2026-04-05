import app from './app.js';

const PORT = process.env.PORT || 3001;

// --- STARTUP ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('💡 Run "npx prisma db seed" to initialize data if needed.');
});
