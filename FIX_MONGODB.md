# Fix: Sign Up and Login Buttons Not Working

## Problem
The sign up and login buttons are not working because **MongoDB is not installed or running**.

## Solution: Install and Start MongoDB

### Step 1: Install MongoDB
Run these commands in your terminal:

```bash
# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community
```

### Step 2: Start MongoDB
```bash
# Start MongoDB service
brew services start mongodb-community
```

### Step 3: Verify MongoDB is Running
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Or test connection
mongosh
```

### Step 4: Restart Your Application
After MongoDB is running, restart your application:

1. Stop the current servers (Ctrl+C in terminal)
2. Start again:
```bash
npm run dev
```

### Step 5: Test the Application
1. Go to http://localhost:3000
2. Try signing up with a new account
3. The buttons should now work!

## Alternative: Manual MongoDB Start
If `brew services` doesn't work, you can start MongoDB manually:

```bash
# Start MongoDB manually (runs in foreground)
mongod --config /opt/homebrew/etc/mongod.conf
```

Open a new terminal window/tab to run your application while MongoDB runs in this one.

## Verify Everything is Working

Check if:
- ✅ Backend is running: http://localhost:5000/api/health
- ✅ Frontend is running: http://localhost:3000
- ✅ MongoDB is running: `brew services list | grep mongodb` should show "started"

## Still Having Issues?

1. **Check browser console** (F12 → Console) for any JavaScript errors
2. **Check backend terminal** for MongoDB connection errors
3. **Try restarting both servers** after MongoDB is started
4. **Clear browser cache** and try again

## Quick Test Command

```bash
# Test MongoDB connection
mongosh --eval "db.adminCommand('ping')"
```

If this returns `{ ok: 1 }`, MongoDB is working correctly!

