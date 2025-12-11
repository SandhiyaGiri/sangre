# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Start a Conversation
1. Open your browser to `http://localhost:3000`
2. Click **"Start Conversation"**
3. Allow microphone access when prompted
4. Speak naturally - your voice will be sent to the ElevenLabs agent
5. See your speech appear in real-time as it's transcribed
6. The agent will respond with voice and text
7. Click **"End Call"** when done

---

## What to Expect

### Visual Elements
- **Blue Animated Orb**: Shows the connection state. Pulsates when the agent is speaking.
- **Color-Coded Messages**:
  - Blue bubbles = Your messages
  - Gray bubbles = Agent responses
- **Real-Time Transcription**: Your speech appears in italics before being confirmed
- **Status Indicator**: Green dot when connected, gray when disconnected
- **Thinking Animation**: Bouncing dots appear when the agent is thinking

### Features
✅ Real-time voice conversation
✅ Full message history with timestamps
✅ Live speech transcription
✅ Visual feedback when agent is speaking
✅ Auto-scrolling chat view
✅ Professional dark theme

---

## Build for Production

### Create Optimized Build
```bash
npm run build
npm start
```

The app is ready to deploy to Vercel, AWS, or any Node.js hosting platform.

---

## Troubleshooting

### Microphone Not Working
- Check browser microphone permissions
- Make sure you allowed access to the microphone
- Try refreshing the page
- Check your device's sound settings

### No Connection
- Check your internet connection
- Verify the Agent ID is correct in `.env.local`
- Check browser console (F12) for error messages
- Try clearing browser cache and refreshing

### Messages Not Appearing
- Refresh the page
- Check browser console for JavaScript errors
- Make sure WebRTC is supported (most modern browsers)

---

## Next Steps

- **Customize**: Modify `app/globals.css` for custom colors
- **Deploy**: Push to GitHub and deploy on Vercel (1-click deployment)
- **Extend**: Add features like conversation export, settings panel, etc.
- **Monitor**: Add analytics to track conversations and improve the agent

---

## Support

For issues with:
- **ElevenLabs SDK**: Check https://elevenlabs.io/docs
- **Next.js**: Visit https://nextjs.org/docs
- **React**: See https://react.dev

---

**Happy conversing! 🎙️**
