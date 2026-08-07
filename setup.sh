#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ..
npm install

echo ""
echo "Setup complete. To run the app locally:"
echo ""
echo "  Terminal 1: cd backend && npm start"
echo "  Terminal 2: npm run dev"
echo ""
echo "Then open http://localhost:5173"
