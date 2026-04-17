# Quick Start: Admin Panel & Events/News System

## 🚀 Start the System (3 Simple Steps)

### Step 1: Start PHP Server
```bash
cd /home/mureti/Desktop/Bustani
php -S localhost:8000
```
✅ You should see: `Listening on http://localhost:8000`

### Step 2: Start React Dev Server (New Terminal)
```bash
cd /home/mureti/Desktop/Bustani
npm run dev
```
✅ You should see: `VITE v... ready in ... ms` and a localhost URL

### Step 3: Access the System

| Component | URL |
|-----------|-----|
| **Admin Panel** | http://localhost:5173/admin |
| **Events/News Display** | http://localhost:5173/events |
| **Static News/Events** | http://localhost:5173/news-events |
| **PHP API** | http://localhost:8000/api.php |

---

## 🔑 Admin Login
- **URL**: http://localhost:5173/admin
- **Password**: `rotary2025`

---

## 📝 Quick Test: Create Your First Event

1. Go to http://localhost:5173/admin
2. Enter password: `rotary2025`
3. Click **"📅 Events"** tab (if not already selected)
4. Fill in:
   - **Title**: "Test Event"
   - **Date**: 2026-05-15
   - **Location**: "Test Location"
   - **Description**: "This is a test event"
5. Click **"Publish Event"**
6. See success message ✅
7. Visit http://localhost:5173/events → Should see your event!

---

## ⚙️ Configuration Files

### `.env.local`
```
VITE_API_URL=/api.php
```

### `vite.config.ts` (Proxy Settings)
- Proxies `/api.php` to PHP server (port 8000)
- Proxies `/uploads` to PHP server

### `api.php`
- Password: `rotary2025`
- Max image size: 5MB
- Allowed formats: JPG, PNG, GIF, WEBP
- Data file: `/data.json`
- Uploads dir: `/uploads/`

---

## 🎯 System Flow

```
User ↓
  ├─ Admin Panel (/admin)
  │   ├─ Login with password
  │   └─ Upload events/news with images
  │
  └─ API (/api.php)
      ├─ Save to data.json
      ├─ Upload images to /uploads/
      └─ Return JSON response
          ↓
        Events/News Page (/events)
        ├─ Fetch from API  
        ├─ Display events & news
        └─ Show images from /uploads/
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| API not responding | Make sure PHP server is running on port 8000 |
| Images not uploading | Check `/uploads/` exists and has write permissions |
| Data not persisting | Ensure `/data.json` is writable |
| Events not showing | Verify you're viewing http://localhost:5173/events (not /news-events) |
| 404 errors | Make sure both servers are running |

---

## 📋 File Locations

| File | Location | Purpose |
|------|----------|---------|
| API | `/api.php` | PHP backend for CRUD operations |
| Data | `/data.json` | JSON file storing all events & news |
| Uploads | `/uploads/` | Directory for user-uploaded images |
| Admin Panel | `/src/pages/Admin.tsx` | Admin interface |
| Display Page | `/src/pages/EventsNews.tsx` | Public events/news page |
| Routing | `/src/App.tsx` | Route configuration |
| Config | `/.env.local` | Environment variables |

---

## 🔐 Security (Development vs Production)

### Development ✅
- Password hardcoded (for testing)
- Same-origin CORS
- No HTTPS required
- PHP built-in server is fine

### Production ⚠️
Recommended:
- Use environment variables for password
- Hash password with bcrypt
- HTTPS only
- Use Apache/Nginx
- Add rate limiting
- Add session authentication
- Consider database instead of JSON

---

## ✨ Features

### Admin Panel
- ✅ Password-protected login
- ✅ Create events with date/location/description
- ✅ Create news articles
- ✅ Upload images (optional)
- ✅ Image preview before upload
- ✅ Delete items
- ✅ Real-time item list
- ✅ Toast notifications

### Events/News Display
- ✅ Fetch data from API
- ✅ Display events with date badges
- ✅ Display news with publication dates
- ✅ Expand/collapse long articles
- ✅ Share buttons (WhatsApp, Facebook, Twitter, LinkedIn)
- ✅ Loading skeletons
- ✅ Responsive design
- ✅ Auto-update when new items added

---

## 🎓 API Reference

### Get All Events & News
```bash
curl http://localhost:8000/api.php
```

### Add Event
```bash
curl -X POST http://localhost:8000/api.php \
  -H "Content-Type: application/json" \
  -d '{
    "password": "rotary2025",
    "type": "events",
    "item": {
      "title": "Test Event",
      "date": "2026-05-15",
      "location": "Test Location",
      "description": "Test Description"
    }
  }'
```

### Delete Event
```bash
curl -X DELETE http://localhost:8000/api.php \
  -H "Content-Type: application/json" \
  -d '{
    "password": "rotary2025",
    "type": "events",
    "id": "67890xyz"
  }'
```

---

## 📞 Support

For issues, check:
1. ADMIN_SETUP_GUIDE.md (comprehensive guide)
2. Browser console for errors
3. PHP server output
4. Vite dev server output
5. `/data.json` file permissions
6. `/uploads/` directory permissions

---

**Created**: April 17, 2026
**System**: RCN Bustani Events & News Management
