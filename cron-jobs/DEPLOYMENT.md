# 🚀 Render Deployment Guide

## **Deploy as Web Service (Recommended)**

Your cron job system is now a **web service** that will stay active 24/7 on Render's free tier!

## **✅ What You Get:**

- **Always Active** - Never goes to sleep
- **Automatic Cron Jobs** - Runs every 14 minutes
- **Health Monitoring** - Web endpoints for status
- **Free Hosting** - 750 hours/month (enough for 24/7)
- **Auto-deploy** - Updates when you push to Git

## **🔧 Deployment Steps:**

### **1. Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit: Mintellect Cron Jobs Web Service"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mintellect-cron-jobs.git
git push -u origin main
```

### **2. Deploy on Render:**

1. **Go to [render.com](https://render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repo**
4. **Configure:**
   - **Name:** `mintellect-cron-jobs`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

### **3. Environment Variables (Optional):**
Render will use the defaults from `render.yaml`, but you can customize:
- `CRON_SCHEDULE` - Default: `*/14 * * * *` (every 14 minutes)
- `LOG_LEVEL` - Default: `info`
- `REQUEST_TIMEOUT` - Default: `10000` (10 seconds)

## **🌐 Available Endpoints:**

Once deployed, your service will have these endpoints:

- **`/`** - Service information and available endpoints
- **`/health`** - Health check (for Render monitoring)
- **`/status`** - Current API health status
- **`/test`** - Manual trigger for health checks

## **📊 How It Works:**

1. **Render starts your service** → Express server runs
2. **Cron job starts** → Runs every 14 minutes automatically
3. **APIs get pinged** → Plagiarism + Main API
4. **Health checks** → Render keeps service alive
5. **Logs generated** → Stored in `logs/` directory

## **🔍 Monitoring:**

### **View Logs:**
- **Render Dashboard** → Your service → Logs tab
- **Real-time logs** → Stream logs as they happen

### **Check Status:**
- **Health:** `https://your-service.onrender.com/health`
- **Status:** `https://your-service.onrender.com/status`

## **⚡ Performance:**

- **Lightweight** - Minimal resource usage
- **Efficient** - Only makes HTTP requests when needed
- **Reliable** - Built-in retry logic and error handling
- **Scalable** - Easy to add more APIs

## **🚨 Troubleshooting:**

### **Service Not Starting:**
1. Check **Build Logs** in Render dashboard
2. Verify **Start Command** is `npm start`
3. Ensure **Node version** is 16+

### **Cron Job Not Running:**
1. Check **Runtime Logs** in Render dashboard
2. Verify **Environment Variables** are set
3. Test manually via `/test` endpoint

### **APIs Not Responding:**
1. Check **Status endpoint** `/status`
2. Verify **API URLs** in environment variables
3. Test APIs independently

## **🎯 Benefits of Web Service vs Cron Job:**

| Web Service | Cron Job Service |
|-------------|------------------|
| ✅ Always Active | ❌ Goes to sleep |
| ✅ No Cold Starts | ❌ 10-30s delays |
| ✅ Health Monitoring | ❌ Limited monitoring |
| ✅ Manual Testing | ❌ Scheduled only |
| ✅ Better Logging | ❌ Basic logging |

## **📈 Next Steps:**

1. **Deploy to Render** (follow steps above)
2. **Monitor logs** for first few hours
3. **Verify cron jobs** are running every 14 minutes
4. **Check API responses** via `/status` endpoint
5. **Set up alerts** if needed (future enhancement)

---

**🎉 Your cron job system is now a professional web service that will keep your Mintellect APIs active 24/7!**
