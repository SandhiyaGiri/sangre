# Deployment Guide - Telehealth Insight Companion

## Quick Start (Development)

### Prerequisites
- Node.js 18+ and npm/pnpm
- Modern browser with WebRTC support
- Microphone access

### Installation & Running
```bash
# Install dependencies
npm install

# Set up environment
# Create .env.local with:
# NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_7101k5zvyjhmfg983brhmhkd98n6

# Start development server
npm run dev

# Open http://localhost:3000
```

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_7101k5zvyjhmfg983brhmhkd98n6
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
ENV NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_7101k5zvyjhmfg983brhmhkd98n6
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t telehealth-companion .
docker run -p 3000:3000 telehealth-companion
```

### AWS Deployment
1. Create EC2 instance (t3.small or larger)
2. Install Node.js 18+
3. Clone repository
4. Set environment variables
5. Run `npm install && npm run build && npm start`
6. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start "npm start" --name "telehealth"
   pm2 startup
   pm2 save
   ```

### Environment Variables

**Required**:
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` - ElevenLabs agent ID (public)

**Optional** (for future phases):
- `DATABASE_URL` - Database connection string
- `SMTP_HOST` - Email service host
- `SMTP_USER` - Email service user
- `SMTP_PASS` - Email service password
- `API_KEY` - Internal API key for backend services

## Testing Before Deployment

### Local Testing Checklist
- [ ] Build completes without errors: `npm run build`
- [ ] Development server starts: `npm run dev`
- [ ] UI loads at http://localhost:3000
- [ ] Language selector works
- [ ] Can upload sample-report.json
- [ ] Report validation works (try invalid JSON)
- [ ] Can start conversation
- [ ] Microphone permission request appears
- [ ] Agent responds to voice input
- [ ] Can end call and generate summary
- [ ] Summary downloads as text file
- [ ] Mobile responsive (test on phone/tablet)

### Sample Report Testing
```bash
# Use the provided sample-report.json
# Or create your own following the schema in README.md
```

### Browser Compatibility Testing
- [ ] Chrome/Chromium 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npm audit
```

### Runtime Optimization
- Next.js automatic code splitting
- Image optimization (if adding images)
- CSS minification via Tailwind
- JavaScript minification via Next.js

### Monitoring (Future)
- Set up error tracking (Sentry)
- Monitor API response times
- Track user sessions
- Monitor WebRTC connection quality

## Security Checklist

### Before Production
- [ ] Remove console.log statements
- [ ] Enable HTTPS only
- [ ] Set secure headers
- [ ] Implement rate limiting
- [ ] Add CORS configuration
- [ ] Validate all inputs
- [ ] Sanitize outputs
- [ ] Use environment variables for secrets
- [ ] Enable CSP headers
- [ ] Set up HSTS

### Recommended Headers (Next.js)
```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      ],
    },
  ];
}
```

## Scaling Considerations

### Current Limitations (Hackathon)
- In-memory storage (reports lost on restart)
- Single server instance
- No database persistence
- No caching layer

### For Production Scaling
1. **Database**: PostgreSQL or MongoDB for reports/summaries
2. **Caching**: Redis for frequently accessed data
3. **Load Balancing**: Nginx or AWS ALB
4. **CDN**: CloudFront for static assets
5. **Monitoring**: CloudWatch, DataDog, or New Relic
6. **Logging**: ELK stack or CloudWatch Logs

## Troubleshooting Deployment

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Environment Variables Not Loading
- Verify `.env.local` exists in project root
- Check variable names match (case-sensitive)
- Restart dev server after changing env vars
- For production, set via hosting platform dashboard

### WebRTC Connection Issues
- Ensure HTTPS in production (required for WebRTC)
- Check firewall allows WebRTC ports
- Verify ElevenLabs agent ID is correct
- Check browser console for specific errors

### Memory Issues
- Monitor process memory usage
- Implement report cleanup (delete old reports)
- Consider database pagination for large datasets
- Use streaming for large file uploads

## Monitoring & Maintenance

### Health Checks
```bash
# Simple health check endpoint
curl http://localhost:3000/

# API health
curl http://localhost:3000/api/upload-report
```

### Logs to Monitor
- Next.js server logs
- Browser console errors
- API request/response times
- WebRTC connection logs
- ElevenLabs agent logs

### Regular Maintenance
- Update dependencies: `npm update`
- Security audits: `npm audit`
- Performance monitoring
- Error tracking review
- User feedback collection

## Rollback Plan

### If Deployment Fails
1. Revert to previous version
2. Check error logs
3. Fix issues locally
4. Test thoroughly
5. Redeploy

### Version Control
```bash
# Tag releases
git tag -a v1.0.0 -m "Initial hackathon release"
git push origin v1.0.0

# Rollback to previous version
git checkout v0.9.0
npm install
npm run build
npm start
```

## Post-Deployment Verification

### Checklist
- [ ] Application loads without errors
- [ ] All pages accessible
- [ ] API endpoints responding
- [ ] Voice conversation working
- [ ] Summary generation working
- [ ] Language switching working
- [ ] Mobile responsive
- [ ] Error handling working
- [ ] Performance acceptable (<3s load time)
- [ ] No console errors

### Performance Targets
- Page load: < 3 seconds
- API response: < 500ms
- Voice latency: < 1 second
- Summary generation: < 5 seconds

## Support & Escalation

### Common Issues
1. **Microphone not working**: Check browser permissions
2. **Agent not responding**: Verify ElevenLabs agent ID
3. **Report upload fails**: Check JSON format
4. **Summary not generating**: Ensure conversation had messages

### Getting Help
- Check README.md for detailed documentation
- Review HACKATHON_FEATURES.md for implementation details
- Check browser console (F12) for error messages
- Review ElevenLabs documentation

## Future Deployment Enhancements

### Phase 2
- [ ] Database persistence
- [ ] User authentication
- [ ] Email integration
- [ ] PDF export
- [ ] Analytics dashboard

### Phase 3
- [ ] HIPAA compliance
- [ ] Multi-region deployment
- [ ] Advanced monitoring
- [ ] Auto-scaling
- [ ] Disaster recovery

---

**Last Updated**: December 11, 2024  
**Version**: 1.0.0
