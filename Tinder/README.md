# 🔥 Tinder Clone - Full Stack Application

A fully functional Tinder-like dating app built with React, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Register and login with secure JWT tokens
- **User Profiles**: Create and edit user profiles with photos, interests, and bio
- **Swipe System**: Swipe right (like) or left (pass) on user profiles
- **Matching**: Get matched when both users like each other
- **Real-time Messaging**: Chat with matched users
- **Responsive Design**: Works on desktop and mobile devices
- **MongoDB Database**: All data persisted in MongoDB Atlas

## 📋 Tech Stack

### Frontend
- React 19
- React Router for navigation
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing

## 🛠️ Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# The .env file already has your MongoDB connection string configured
# Just run the server
npm start
```

Server will run on `http://localhost:8000`

### 2. Frontend Setup

```bash
# Install dependencies (in root folder)
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Users
- `GET /api/users/swipe` - Get users for swiping
- `GET /api/users/matches` - Get all matches
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:userId` - Get user profile

### Matches
- `POST /api/matches/like` - Like a user
- `POST /api/matches/pass` - Pass on a user
- `POST /api/matches/unlike` - Unlike a user

### Messages
- `POST /api/messages/send` - Send a message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/:otherUserId` - Get conversation with a user
- `DELETE /api/messages/:messageId` - Delete a message

## 🚀 Features Implemented

✅ User Registration & Login  
✅ Profile Management  
✅ Swipe/Like/Pass System  
✅ Matching Algorithm  
✅ Real-time Messaging  
✅ Authentication & Authorization  
✅ Responsive UI  
✅ MongoDB Integration  

## 📁 Project Structure

```
Tinder/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── matchController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Match.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── matches.js
│   │   └── messages.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Swipe.jsx
│   │   ├── Matches.jsx
│   │   ├── Messages.jsx
│   │   └── Profile.jsx
│   ├── components/
│   │   └── Navigation.jsx
│   ├── services/
│   │   └── api.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── styles/
│   │   ├── global.css
│   │   ├── Auth.css
│   │   ├── Swipe.css
│   │   ├── Matches.css
│   │   ├── Messages.css
│   │   ├── Profile.css
│   │   └── Navigation.css
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## 🔐 Environment Variables

The `.env` file in the backend folder contains:
```
MONGO_URI=mongodb+srv://tinder_user:U0amWVAmabqDKyvl@cluster0.vtzk1id.mongodb.net/?appName=Cluster0
JWT_SECRET=tinder_super_secret_key_2024_change_in_production
PORT=8000
NODE_ENV=development
```

## ⚙️ How to Run

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **In a new terminal, start the Frontend**:
   ```bash
   npm install
   npm run dev
   ```

3. **Open your browser**:
   - Go to `http://localhost:5173`
   - Register a new account or login
   - Start swiping!

## 🎯 Usage Flow

1. **Register**: Create a new account with name, email, age, gender preferences, and bio
2. **Browse**: View available profiles on the swipe page
3. **Swipe**: Click ❤ to like or ❌ to pass
4. **Match**: When both users like each other, it's a match!
5. **Message**: Click on a match to start messaging
6. **Profile**: Update your profile information anytime

## 🔄 Future Enhancements

- Real-time notifications for matches
- Video chat functionality
- Advanced filtering and search
- User reviews and ratings
- Admin dashboard for moderation
- Subscription plans
- Social media integration
- Location-based matching

## 📧 Support

For questions or issues, please create an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**
