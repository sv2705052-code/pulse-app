#!/bin/bash

echo "🚀 Starting Tinder App Setup..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ..
npm install

echo "✅ Installation complete!"
echo ""
echo "🎉 To start the app:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminal 2 - Frontend:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
