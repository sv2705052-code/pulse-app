@echo off
echo Installing backend dependencies...
cd backend
call npm install

echo Installing frontend dependencies...
cd ..
call npm install

echo Setup complete.
echo.
echo Terminal 1: cd backend ^&^& npm start
echo Terminal 2: npm run dev
echo.
echo Then open http://localhost:5173
pause
