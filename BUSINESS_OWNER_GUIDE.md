# Business Owner Guide: Setting Up Your Booking System

## Welcome! 🎉

Your booking app now has a professional booking system. This guide will help you set up availability and start accepting customer bookings.

---

## Step 1: Run the Database Migration

First, you need to set up the booking tables in Supabase:

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire content from `booking_system.sql` in your project folder
6. Paste it into the SQL editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

You should see: ✅ Success. No rows returned

---

## Step 2: Set Your Business Hours

Now you need to tell the system when you're available for bookings.

### Understanding Day of Week Numbers
- 0 = Sunday
- 1 = Monday
- 2 = Tuesday
- 3 = Wednesday
- 4 = Thursday
- 5 = Friday
- 6 = Saturday

### Example: Monday-Friday, 9 AM - 5 PM

1. In Supabase, go to **SQL Editor**
2. Get your business ID:
   ```sql
   SELECT id, name FROM businesses WHERE owner_id = auth.uid();
   ```
   Copy the `id` value

3. Insert your availability:
   ```sql
   -- Replace 'YOUR_BUSINESS_ID' with the ID from step 2
   
   INSERT INTO availability (business_id, day_of_week, start_time, end_time)
   VALUES 
     ('YOUR_BUSINESS_ID', 1, '09:00', '17:00'),  -- Monday
     ('YOUR_BUSINESS_ID', 2, '09:00', '17:00'),  -- Tuesday
     ('YOUR_BUSINESS_ID', 3, '09:00', '17:00'),  -- Wednesday
     ('YOUR_BUSINESS_ID', 4, '09:00', '17:00'),  -- Thursday
     ('YOUR_BUSINESS_ID', 5, '09:00', '17:00');  -- Friday
   ```

4. Click **Run**

### Example: With Lunch Break (9-12, 2-6)

```sql
INSERT INTO availability (business_id, day_of_week, start_time, end_time)
VALUES 
  -- Morning slots
  ('YOUR_BUSINESS_ID', 1, '09:00', '12:00'),
  ('YOUR_BUSINESS_ID', 2, '09:00', '12:00'),
  ('YOUR_BUSINESS_ID', 3, '09:00', '12:00'),
  ('YOUR_BUSINESS_ID', 4, '09:00', '12:00'),
  ('YOUR_BUSINESS_ID', 5, '09:00', '12:00'),
  
  -- Afternoon slots
  ('YOUR_BUSINESS_ID', 1, '14:00', '18:00'),
  ('YOUR_BUSINESS_ID', 2, '14:00', '18:00'),
  ('YOUR_BUSINESS_ID', 3, '14:00', '18:00'),
  ('YOUR_BUSINESS_ID', 4, '14:00', '18:00'),
  ('YOUR_BUSINESS_ID', 5, '14:00', '18:00');
```

### Example: Weekend Hours

```sql
INSERT INTO availability (business_id, day_of_week, start_time, end_time)
VALUES 
  ('YOUR_BUSINESS_ID', 6, '10:00', '16:00'),  -- Saturday
  ('YOUR_BUSINESS_ID', 0, '12:00', '17:00');  -- Sunday
```

---

## Step 3: Test Your Availability

Test that the system can find your available slots:

```sql
-- Replace with your business ID and a future date
SELECT get_available_slots('YOUR_BUSINESS_ID', '2025-12-16');
```

You should see output like:
```json
[
  {"time":"09:00","available":true},
  {"time":"10:00","available":true},
  {"time":"11:00","available":true},
  {"time":"14:00","available":true},
  {"time":"15:00","available":true},
  {"time":"16:00","available":true},
  {"time":"17:00","available":true}
]
```

---

## Step 4: Manage Bookings

### View All Your Bookings

In Supabase SQL Editor:
```sql
SELECT 
  b.service_name,
  b.booking_date,
  b.status,
  p.email as customer_email
FROM bookings b
JOIN auth.users p ON p.id = b.user_id
WHERE b.business_id = 'YOUR_BUSINESS_ID'
ORDER BY b.booking_date DESC;
```

### Confirm a Pending Booking

```sql
UPDATE bookings
SET status = 'confirmed'
WHERE id = 'BOOKING_ID_HERE';
```

### Cancel a Booking

```sql
UPDATE bookings
SET status = 'cancelled'
WHERE id = 'BOOKING_ID_HERE';
```

---

## Step 5: Check Your Dashboard

1. Open your app
2. Log in as the business owner
3. Go to **Dashboard** tab
4. You'll see:
   - ✅ **New Bookings This Week** count
   - ✅ **Weekly Activity Chart** showing bookings by day
   - ✅ **Recent Bookings** list

---

## How Customers Book

When a customer finds your business:

1. They tap **"Book Now"** on your business page
2. They see your services and select one
3. They pick a date from the calendar
4. They see available time slots (automatically calculated from your availability)
5. They select a time and confirm
6. You get a message in your chat and see the booking in your dashboard!

---

## Tips & Best Practices

### ✅ Set Realistic Availability
- Only add hours you can truly commit to
- Account for prep/cleanup time between appointments
- Leave buffer time for breaks

### ✅ Check Bookings Daily
- Review your dashboard every morning
- Confirm pending bookings promptly
- Respond to customer messages

### ✅ Update Availability for Holidays
If you're closed for a holiday, you can temporarily delete that day's availability:

```sql
DELETE FROM availability
WHERE business_id = 'YOUR_BUSINESS_ID'
AND day_of_week = 4  -- e.g., Thursday
RETURNING *;  -- Shows what was deleted
```

Then re-add it later:
```sql
INSERT INTO availability (business_id, day_of_week, start_time, end_time)
VALUES ('YOUR_BUSINESS_ID', 4, '09:00', '17:00');
```

### ✅ Sync to Google Calendar
From your dashboard, tap any booking to add it to Google Calendar. This helps you manage your schedule across platforms.

---

## Troubleshooting

### "No available slots" showing for customers

**Check:**
1. Did you add availability for that day of week?
   ```sql
   SELECT * FROM availability WHERE business_id = 'YOUR_BUSINESS_ID';
   ```
2. Is the time in the future? (Past times are automatically hidden)
3. Are all slots already booked?
   ```sql
   SELECT * FROM bookings 
   WHERE business_id = 'YOUR_BUSINESS_ID'
   AND DATE(booking_date) = '2025-12-16';
   ```

### Booking not showing in dashboard

**Check:**
1. Is the booking status 'confirmed' or 'pending'? (Cancelled bookings may be hidden)
2. Try refreshing: Tap the refresh icon in top-right of dashboard
3. Check the bookings table directly:
   ```sql
   SELECT * FROM bookings WHERE business_id = 'YOUR_BUSINESS_ID';
   ```

### Customer's booking request not arriving in chat

**Check:**
1. Ensure conversations table has a record:
   ```sql
   SELECT * FROM conversations WHERE business_id = 'YOUR_BUSINESS_ID';
   ```
2. Check messages table:
   ```sql
   SELECT m.* FROM messages m
   JOIN conversations c ON c.id = m.conversation_id
   WHERE c.business_id = 'YOUR_BUSINESS_ID'
   ORDER BY m.created_at DESC;
   ```

---

## Advanced: Custom Services

Your services are currently defined in code. To add/edit services, modify `constants/data.ts`:

```typescript
services: [
    { name: 'Consultation', duration: 30, price: 50 },
    { name: 'Full Treatment', duration: 90, price: 150 },
    { name: 'Follow-up', duration: 20, price: 25 }
]
```

**Future enhancement:** We'll add a UI to manage services directly from the app!

---

## Need Help?

Common questions:
- **Q:** Can I have different hours for different days?
  **A:** Yes! Just insert separate availability records for each day with different times.

- **Q:** Can I block off specific dates (vacations)?
  **A:** Currently, you'd need to delete availability for those days. A dedicated "blocked dates" feature is on the roadmap.

- **Q:** What if I need 30-minute slots instead of hourly?
  **A:** The RPC function currently generates hourly slots. This can be customized by modifying the SQL function.

- **Q:** Can I have multiple booking durations?
  **A:** Service duration is defined but not yet used in slot calculations. This is a planned enhancement.

---

## What's Next?

Upcoming features:
- ✨ Visual availability editor in the app (no SQL needed!)
- ✨ Booking status management UI (confirm/cancel with one tap)
- ✨ Email notifications for new bookings
- ✨ SMS reminders for customers
- ✨ Blocked dates for vacations
- ✨ Recurring availability patterns
- ✨ Custom booking durations

---

**Congratulations!** 🎊 You're now ready to accept bookings. Happy scheduling!
