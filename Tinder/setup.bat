@echo off
echo 🚀 Starting Tinder App Setup...

echo 📦 Installing backend dependencies...
cd backend
call npm install

echo 📦 Installing frontend dependencies...
cd ..
call npm install

echo ✅ Installation complete!
echo.
echo 🎉 To start the app:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm start
echo.
echo Terminal 2 - Frontend:
echo   npm run dev
echo.
echo Then open: http://localhost:5173
pause
