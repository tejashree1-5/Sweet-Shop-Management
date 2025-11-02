# Sweet Shop Management System - Usage Guide

## Getting Started

### 1. Access the Application
Open your web browser and navigate to:
```
http://localhost:3000
```

### 2. Create Your First Account

#### For Admin Access:
1. Click on "Sign up" (if you see the login page) or navigate to the signup page
2. Fill in the form:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Account Type**: Select **"Admin"** from the dropdown
3. Click "Sign Up"
4. You'll be automatically redirected to the Admin Panel

#### For Regular User Access:
1. Click on "Sign up"
2. Fill in the form:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Account Type**: Keep as **"User"** (default)
3. Click "Sign Up"
4. You'll be automatically redirected to the Dashboard

---

## User Features (Regular Users)

### Dashboard Overview
After logging in as a user, you'll see:
- **Header**: Shop name, Admin Panel button (if admin), Logout button
- **Search Bar**: Search and filter sweets
- **Sweet Cards**: Grid of available sweets

### How to Use:

#### 1. Browse Sweets
- All available sweets are displayed in a grid
- Each card shows:
  - Sweet name
  - Category
  - Price
  - Stock quantity (green if in stock, red if out of stock)

#### 2. Search and Filter
Use the search bar at the top to filter sweets:

- **Search by Name**: Type in the name field to find sweets by name
- **Filter by Category**: Select a category from the dropdown
- **Price Range**: 
  - Enter minimum price in "Min Price"
  - Enter maximum price in "Max Price"
- You can combine multiple filters at once

#### 3. Purchase a Sweet
1. Find the sweet you want to buy
2. Check if it's in stock (quantity > 0)
3. Click the **"Purchase"** button
4. The quantity will decrease by 1
5. You'll see a success message
6. If quantity reaches 0, the button becomes "Out of Stock" and is disabled

#### 4. Navigate
- Click **"Admin Panel"** (only visible if you're an admin) to manage sweets
- Click **"Logout"** to sign out

---

## Admin Features (Admin Users)

### Admin Panel Overview
The Admin Panel allows you to:
- Add new sweets
- View all sweets in a table format
- Edit existing sweets
- Delete sweets
- Restock sweets (increase inventory)

### How to Use:

#### 1. Add a New Sweet
1. Click the **"Add New Sweet"** button at the top
2. Fill in the form:
   - **Name**: Name of the sweet (e.g., "Chocolate Bar")
   - **Category**: Category (e.g., "Chocolate", "Candy", "Cookie")
   - **Price**: Price in dollars (e.g., 2.50)
   - **Quantity**: Initial stock quantity (e.g., 100)
3. Click **"Add Sweet"**
4. The sweet will appear in the table

#### 2. Edit a Sweet
1. Find the sweet in the table
2. Click the **"Edit"** button next to the sweet
3. The form will appear with current values
4. Modify any fields you want to change
5. Click **"Update Sweet"**
6. Click **"Cancel"** to discard changes

#### 3. Restock a Sweet
1. Find the sweet in the table
2. Click the **"Restock"** button
3. A prompt will ask for the quantity to add
4. Enter a number (e.g., 50)
5. Click OK
6. The quantity will increase by that amount

#### 4. Delete a Sweet
1. Find the sweet in the table
2. Click the **"Delete"** button
3. Confirm the deletion in the popup
4. The sweet will be removed from the system

#### 5. Navigate
- Click **"View Shop"** to see the user-facing dashboard
- Click **"Logout"** to sign out

---

## Workflow Examples

### Example 1: Setting Up Your Shop (Admin)
1. Create an admin account
2. Add sweets:
   - Chocolate Bar - $2.50 - 50 in stock
   - Gummy Bears - $1.00 - 100 in stock
   - Cookies - $3.00 - 30 in stock
3. View the shop to see how customers see it

### Example 2: Customer Shopping (User)
1. Create a user account
2. Browse available sweets
3. Use search/filter to find specific items
4. Purchase sweets you want
5. See stock decrease after each purchase

### Example 3: Managing Inventory (Admin)
1. Login as admin
2. Notice a sweet is running low
3. Click "Restock" and add more inventory
4. Or edit the sweet to update price or other details
5. Delete sweets that are no longer available

---

## Tips & Best Practices

### For Admins:
- **Categories**: Use consistent category names (e.g., always use "Chocolate" not "Chocolates")
- **Pricing**: Enter prices as numbers (e.g., 2.50 for $2.50)
- **Stock Management**: Restock regularly to keep items available
- **Cleanup**: Delete discontinued items to keep the catalog clean

### For Users:
- **Search**: Use partial names (e.g., "choco" will find "Chocolate")
- **Filters**: Combine filters to narrow down results
- **Stock**: Check quantity before trying to purchase

---

## Troubleshooting

### Can't Login?
- Make sure MongoDB is running: `brew services start mongodb-community`
- Check that you're using the correct email and password
- Try creating a new account if credentials are wrong

### Can't Purchase?
- Check if the item is out of stock (quantity = 0)
- Make sure you're logged in as a user
- Refresh the page if the button doesn't respond

### Can't Add/Edit Sweets?
- Make sure you're logged in as an **Admin**
- Check that all required fields are filled
- Ensure price and quantity are valid numbers

### Page Not Loading?
- Make sure both servers are running (`npm run dev`)
- Check browser console for errors
- Try hard refresh (Cmd+Shift+R on Mac)

---

## API Testing (Advanced)

You can also test the API directly using tools like Postman or curl:

### Get Token (Login)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Get All Sweets (Use token from login)
```bash
curl http://localhost:5000/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Support

If you encounter issues:
1. Check the terminal/console for error messages
2. Verify MongoDB is running
3. Check that both servers (backend and frontend) are running
4. Review the README.md for setup instructions

