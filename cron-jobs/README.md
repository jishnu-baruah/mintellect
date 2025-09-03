# Mintellect Cron Jobs

Automated health checks for Mintellect API servers that run every 14 minutes to keep them active and monitor their health.

## 🎯 Purpose

This cron job system automatically pings your API servers to:
- **Keep servers active** (prevents cold starts on Render)
- **Monitor API health** (response times, status codes)
- **Provide logging** (success/failure tracking)
- **Enable alerting** (for failed health checks)

## 🚀 Features

- **Automated scheduling** - runs every 14 minutes
- **Multiple API monitoring** - Plagiarism API + Main API
- **Retry logic** - automatic retries on failures
- **Comprehensive logging** - Winston logger with file + console output
- **Health check endpoints** - customizable endpoints for each API
- **Error handling** - graceful shutdown and exception handling
- **Configuration** - environment-based configuration

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Access to the API endpoints

## 🛠️ Installation

1. **Navigate to the cron-jobs directory:**
   ```bash
   cd cron-jobs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp env.example .env
   ```

4. **Edit .env file** with your configuration:
   ```env
   # API Endpoints
   PLAGIARISM_API_URL=https://mintellect-bnb-plagiarism.onrender.com
   MAIN_API_URL=https://api.mintellect.xyz
   
   # Cron Schedule (every 14 minutes)
   CRON_SCHEDULE="*/14 * * * *"
   
   # Logging
   LOG_LEVEL=info
   LOG_FILE=./logs/cron-jobs.log
   ```

## 🚀 Usage

### Start the Cron Job System

```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

### Test APIs Manually

```bash
# Test all APIs without waiting for cron schedule
npm run test
```

### View Logs

```bash
# View real-time logs
tail -f logs/cron-jobs.log

# View last 100 lines
tail -n 100 logs/cron-jobs.log
```

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PLAGIARISM_API_URL` | `https://mintellect-bnb-plagiarism.onrender.com` | Plagiarism API base URL |
| `MAIN_API_URL` | `https://api.mintellect.xyz` | Main API base URL |
| `CRON_SCHEDULE` | `*/14 * * * *` | Cron schedule (every 14 minutes) |
| `LOG_LEVEL` | `info` | Logging level (error, warn, info, debug) |
| `LOG_FILE` | `./logs/cron-jobs.log` | Log file path |
| `REQUEST_TIMEOUT` | `10000` | Request timeout in milliseconds |
| `MAX_RETRIES` | `3` | Maximum retry attempts |
| `RETRY_DELAY` | `5000` | Delay between retries in milliseconds |

### Cron Schedule Format

The default schedule `*/14 * * * *` means:
- `*/14` - every 14 minutes
- `*` - every hour
- `*` - every day of month
- `*` - every month
- `*` - every day of week

**Other useful schedules:**
- `*/5 * * * *` - every 5 minutes
- `*/15 * * * *` - every 15 minutes
- `*/30 * * * *` - every 30 minutes
- `0 */1 * * *` - every hour

## 📊 Monitoring

### Log Files

Logs are stored in the `logs/` directory:
- `cron-jobs.log` - Main application logs
- Automatic log rotation and management

### Health Check Results

Each health check logs:
- ✅ **Success**: Status code, response time
- ❌ **Failure**: Error details, retry attempts
- 📊 **Summary**: Overall success rate

### Example Log Output

```
2024-09-04T02:31:00.000Z - info: 🕐 Cron job triggered - executing API health checks
2024-09-04T02:31:00.001Z - info: Making request to Plagiarism API: https://mintellect-bnb-plagiarism.onrender.com/
2024-09-04T02:31:01.234Z - info: Plagiarism API - Status: 200, Response time: N/Ams
2024-09-04T02:31:01.235Z - info: Making request to Main API: https://api.mintellect.xyz/
2024-09-04T02:31:02.456Z - info: Main API - Status: 200, Response time: N/Ams
2024-09-04T02:31:02.457Z - info: Health checks completed in 2456ms. Success: 2/2
2024-09-04T02:31:02.458Z - info: plagiarism: ✅ Success (200)
2024-09-04T02:31:02.459Z - info: main: ✅ Success (200)
2024-09-04T02:31:02.460Z - info: ✅ Cron job completed successfully
```

## 🔧 Deployment

### Local Development

```bash
npm run dev
```

### Production Server

```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start index.js --name "mintellect-cron"

# Monitor processes
pm2 status
pm2 logs mintellect-cron

# Restart if needed
pm2 restart mintellect-cron
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
```

## 🚨 Troubleshooting

### Common Issues

1. **APIs not responding:**
   - Check network connectivity
   - Verify API URLs in .env file
   - Check API server status

2. **Permission errors:**
   - Ensure write permissions for logs directory
   - Check file system permissions

3. **Cron not running:**
   - Verify Node.js installation
   - Check for syntax errors in index.js
   - Review console output for errors

### Debug Mode

Enable debug logging:
```env
LOG_LEVEL=debug
```

### Manual Testing

Test APIs manually:
```bash
npm run test
```

## 📈 Performance

- **Lightweight**: Minimal resource usage
- **Efficient**: Uses axios for HTTP requests
- **Scalable**: Easy to add more APIs
- **Reliable**: Built-in retry and error handling

## 🔒 Security

- **User-Agent headers** for identification
- **Timeout limits** to prevent hanging requests
- **Error logging** without exposing sensitive data
- **Environment-based configuration**

## 📞 Support

For issues or questions:
1. Check the logs in `logs/cron-jobs.log`
2. Review the configuration in `.env`
3. Test manually with `npm run test`
4. Check API server status independently

## 📝 License

MIT License - see LICENSE file for details.

---

**🎯 Keep your Mintellect APIs healthy and active with automated monitoring every 14 minutes!**
