# 🔥 Tinder App - Quick Start Guide

## ✅ What's Been Built

Your Tinder app is now **fully functional** with:

### Backend (Node.js + Express + MongoDB)
- ✅ Authentication system (Register, Login, JWT tokens)
- ✅ User models with full profile management
- ✅ Swipe/Like/Pass matching logic
- ✅ Real-time messaging between matched users
- ✅ MongoDB Atlas integration

### Frontend (React + Vite)
- ✅ Beautiful responsive UI with gradient styling
- ✅ User authentication pages (Login & Register)
- ✅ Swipe card interface
- ✅ Matches display
- ✅ Real-time messaging chat
- ✅ User profile editing
- ✅ Navigation bar for easy access

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

**On Windows**, run this in PowerShell (in the Tinder folder):
```powershell
cd backend
npm install
cd ..
npm install
```

**On Mac/Linux**, run this in Terminal:
```bash
cd backend
npm install
cd ..
npm install
```

Or simply double-click `setup.bat` (Windows) or run `bash setup.sh` (Mac/Linux)

### Step 2: Start the Backend Server

Open a new terminal/PowerShell and run:
```bash
cd backend
npm start
```

You'll see:
```
MongoDB connected: cluster0.vtzk1id.mongodb.net
Server running on http://localhost:8000
```

> [!IMPORTANT]
> **MongoDB Atlas Setup**: If you see "Database connection attempt failed", ensure your current IP is whitelisted in [MongoDB Atlas Network Access](https://cloud.mongodb.com/).
> 1. Go to **Network Access** in the MongoDB Atlas sidebar.
> 2. Click **Add IP Address**.
> 3. Click **Add Current IP Address** and save.

### Step 3: Start the Frontend

Open another terminal/PowerShell and run:
```bash
npm run dev
```

You'll see:
```
VITE v7.3.1  ready in 500 ms

➜  Local:   http://localhost:5173/
```

---

## 🌐 Access the App

Open your browser and go to: **http://localhost:5173**

---

## 📱 How to Use the App

### 1. **Register**
   - Click "Register here"
   - Fill in: Name, Email, Password, Age, Gender, Looking For, Bio
   - Click "Register"

### 2. **Login**
   - Enter your email and password
   - Click "Login"

### 3. **Swipe** (Main Page)
   - View user profiles
   - Click ❌ to pass (not interested)
   - Click ❤ to like (interested)

### 4. **Check Matches**
   - Click "❤ Matches" in navigation
   - See all your matches
   - Click "💬 Message" to chat

### 5. **Message Matched Users**
   - Click on a matched profile
   - Type messages in the input
   - Press "Send"
   - Messages appear in real-time

### 6. **Edit Profile**
   - Click "👤 Profile" in navigation
   - Click "Edit Profile"
   - Update name, bio, interests
   - Click "Save Changes"

### 7. **Logout**
   - Click "Logout" button in profile page

---

## 📚 Available Features

| Feature | Status | Location |
|---------|--------|----------|
| User Registration | ✅ Complete | `/register` |
| User Login | ✅ Complete | `/login` |
| Browse Profiles | ✅ Complete | `/swipe` |
| Like/Pass/Unlike | ✅ Complete | `/swipe` |
| View Matches | ✅ Complete | `/matches` |
| Send Messages | ✅ Complete | `/messages/:userId` |
| Edit Profile | ✅ Complete | `/profile` |
| Logout | ✅ Complete | `/profile` |

---

## 🗄️ MongoDB Collections

Your MongoDB database has 3 main collections:

### 1. **Users** - Stores user profiles
```javascript
{
  name, email, password (hashed), age, gender, interestedIn,
  bio, profilePictureUrl, photos, interests, location,
  isOnline, lastSeen
}
```

### 2. **Matches** - Tracks like/match relationships
```javascript
{
  user1, user2, user1Liked, user2Liked,
  isMatched, matchedAt, status
}
```

### 3. **Messages** - Stores conversations
```javascript
{
  senderUser, recipientUser, content, isRead,
  readAt, deletedBySender, deletedByRecipient
}
```

---

## 🔧 API Endpoints Used

The frontend communicates with these backend APIs:

### Auth
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account
- `GET /api/auth/me` - Get current user data

### Users & Swiping
- `GET /api/users/swipe` - Get profiles to swipe
- `GET /api/users/matches` - Get all matches
- `PUT /api/users/profile` - Update profile
- `POST /api/matches/like` - Like a user
- `POST /api/matches/pass` - Pass on a user
- `POST /api/matches/unlike` - Undo a like

### Messaging
- `GET /api/messages/conversations` - All conversations
- `GET /api/messages/:userId` - Get chat history
- `POST /api/messages/send` - Send a message
- `DELETE /api/messages/:messageId` - Delete a message

---

## 🛠️ Troubleshooting

### "Cannot GET /api/..."
- Make sure backend is running on http://localhost:8000
- Check terminal: `npm start` in backend folder

### "MongoDB connection failed"
- Verify your internet connection
- Check MongoDB Atlas cluster is active
- Confirm .env file has correct MongoDB URI

### "Port 5173 is already in use"
- Change port: `npm run dev -- --port 5174`
- Or kill the process using port 5173

### "Cannot find module..."
- Run `npm install` in the relevant folder (backend or root)
- Delete `node_modules` folder and reinstall

---

## 📝 Test Data

To test the app, register new accounts with:
- **User 1**: john@example.com
- **User 2**: jane@example.com
- **Password**: Password123

Then have both users like each other to create a match!

---

## 🚀 Production Deployment

When ready to deploy:

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway/Render)
```bash
# Update API URL in src/services/api.js
# Deploy backend folder
```

---

## 📖 File Structure Reference

```
Tinder/
├── backend/
│   ├── .env                    ← MongoDB Connection
│   ├── server.js               ← Main server file
│   ├── package.json
│   ├── config/db.js            ← DB connection function
│   ├── models/                 ← Database schemas
│   ├── routes/                 ← API endpoints
│   ├── controllers/            ← Business logic
│   └── middleware/             ← Auth middleware
├── src/
│   ├── App.jsx                 ← Main app with routing
│   ├── main.jsx                ← React entry point
│   ├── pages/                  ← Page components
│   ├── services/api.js         ← API service
│   ├── context/AuthContext.jsx ← Auth state
│   ├── components/Navigation.jsx ← Nav bar
│   └── styles/                 ← CSS files
└── package.json                ← Frontend dependencies
```

---

## ❓ FAQs

**Q: How do I add profile pictures?**
A: Pass imageUrl in the `profilePictureUrl` field when updating profile

**Q: Can I delete my account?**
A: Not yet - this can be added as a future feature

**Q: How long are matches stored?**
A: Indefinitely, until you or the other user unmatch

**Q: Can messages be edited?**
A: Not yet - can be added as a feature

**Q: How do I reset my password?**
A: Not implemented yet - can be added

---

## 🎓 Learning Resources

- MongoDB: https://docs.mongodb.com/
- Express: https://expressjs.com/
- React: https://react.dev/
- Mongoose: https://mongoosejs.com/

---

## 💡 Next Steps

1. ✅ Test all features thoroughly
2. ✅ Add more test users
3. ✅ Customize styling to your liking
4. ✅ Add additional features (see Future Enhancements in README)
5. ✅ Deploy to production

---

**Enjoy your Tinder clone! 🎉**

For questions, refer to the main README.md file.
