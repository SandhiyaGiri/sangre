# Troubleshooting Guide

## Connection Error: ConnectionError.internal

If you see a `ConnectionError.internal` from livekit-client, this indicates a WebRTC connection failure. The application has been enhanced with automatic fallback and better error handling.

### What's Happening

1. **WebRTC Connection Attempt**: The app first tries to establish a WebRTC connection for real-time voice
2. **If WebRTC Fails**: It automatically falls back to WebSocket for text-based communication
3. **Error Display**: Any connection errors will be displayed in the chat window

### Quick Fixes

#### 1. **Verify Agent ID**
Check that your `.env.local` file has the correct Agent ID:

```bash
cat .env.local
```

Should look like:
```
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_5001kc6qf5h5fd5rmmbe7p24jf7q
```

If the Agent ID is wrong, update it and refresh the browser.

#### 2. **Check Internet Connection**
- Ensure you have a stable internet connection
- Try opening another website to verify connectivity
- If on WiFi, try wired connection (more stable for WebRTC)

#### 3. **Browser Permissions**
- Open browser DevTools (F12)
- Check if there's a microphone permission prompt
- Click "Allow" when prompted
- Some browsers may block microphone access - check your browser settings

#### 4. **Browser Compatibility**
The app requires a modern browser with WebRTC support:
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

#### 5. **Clear Cache & Refresh**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or: Open DevTools (F12) → Settings → Disable cache (while DevTools open)
- Then refresh the page

#### 6. **Check Firewall/Network**
WebRTC requires:
- UDP port access (typically 10000-20000 range)
- Some corporate firewalls block WebRTC

If WebRTC is blocked:
- The app will automatically fall back to WebSocket
- Chat will still work, but without voice capabilities
- Try on a different network if possible

#### 7. **Restart the Dev Server**
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## Common Error Messages

### "Agent ID not configured in environment variables"
**Cause**: Missing `.env.local` file or empty Agent ID
**Solution**:
1. Create/update `.env.local` with your Agent ID
2. Restart dev server
3. Refresh browser

### "Connection failed: ConnectionError.internal"
**Cause**: WebRTC connection failed
**Solution**:
1. Check your internet connection
2. Try a different network
3. Verify Agent ID is correct
4. The app will fall back to WebSocket automatically

### "Connection error occurred. Please try starting the conversation again."
**Cause**: Network connectivity issues during conversation
**Solution**:
1. Click "End Call"
2. Wait a few seconds
3. Click "Start Conversation" again

### "No speech input detected"
**Cause**: Microphone not working or not permitted
**Solution**:
1. Check microphone permissions in browser settings
2. Ensure microphone is enabled on your device
3. Test microphone in another app first
4. Try refreshing the page

---

## Debugging Steps

### 1. Open Browser Console
Press `F12` to open DevTools, go to the **Console** tab.

### 2. Look for Log Messages
When starting a conversation, you should see:
```
Starting conversation with agent: agent_5001kc6qf5h5fd5rmmbe7p24jf7q
Connected via WebRTC
(or)
Connected via WebSocket
```

### 3. Check for Errors
Red error messages in the console will help identify issues. Common ones:
- `TypeError: Cannot read properties of undefined`
- `NotAllowedError` (microphone permission)
- `NotFoundError` (no microphone)
- `AbortError` (connection aborted)

### 4. Network Tab
1. Open DevTools → Network tab
2. Start a conversation
3. Look for WebSocket or HTTPS connections
4. Check if any requests fail (red)

### 5. Check Agent Status
Verify the agent is active and accessible:
- Log into your ElevenLabs dashboard
- Check if the agent is deployed
- Verify agent settings are correct
- Check API usage limits

---

## Advanced Debugging

### Enable Verbose Logging
Edit `app/page.tsx` and add more console.log statements:

```typescript
const conversation = useConversation({
  onConnect: () => {
    console.log('✅ Connected to agent');
    console.log('Connection object:', conversation);
  },
  // ... etc
});
```

### Test WebRTC Directly
Use WebRTC test tools to check if your network supports it:
- https://webrtc.github.io/samples/
- https://test.webrtc.org/

### Monitor Network Activity
Use `netstat` or similar tools to verify network connectivity:
```bash
# On macOS/Linux
netstat -an | grep ESTABLISHED | wc -l

# On Windows
netstat -an | find "ESTABLISHED" /c
```

---

## Fallback Behavior

### WebRTC Fails → WebSocket Activated
```
Attempt WebRTC
    ↓
If fails after timeout (usually 5-10 seconds)
    ↓
Automatically try WebSocket
    ↓
If WebSocket succeeds:
  ✓ Chat works
  ✗ Voice input disabled
  ✓ Can still read responses
```

### Why This Matters
- **WebRTC**: Real-time voice, lower latency
- **WebSocket**: Text-based, works on more networks

The fallback ensures you can still use the app even if WebRTC is blocked.

---

## Getting Help

### Information to Include
If you need help, provide:
1. Browser type and version
2. Error messages (from console)
3. Agent ID (without exposing it publicly)
4. Network type (WiFi, cellular, corporate)
5. Operating system

### Resources
- ElevenLabs Docs: https://elevenlabs.io/docs
- React SDK Issues: https://github.com/elevenlabs/packages/issues
- Browser WebRTC Support: https://caniuse.com/rtcpeerconnection

---

## Performance Optimization

### If Experiencing Lag

1. **Reduce Browser Tabs**: Close unnecessary tabs to free up resources
2. **Disable Extensions**: Some browser extensions interfere with WebRTC
3. **Lower Microphone Quality**: Some devices have high-bandwidth microphones
4. **Use Ethernet**: Wired connection is more stable than WiFi
5. **Restart Browser**: Sometimes helps reset connections

### Check Network Quality
```bash
# Ping test (lower is better, <50ms is good)
ping elevenlabs.io

# DNS test
nslookup elevenlabs.io
```

---

## Still Not Working?

### Next Steps
1. ✅ Try all steps above
2. ✅ Check the browser console thoroughly
3. ✅ Test with a different browser
4. ✅ Test on a different network
5. ✅ Check ElevenLabs system status page
6. 📧 Contact ElevenLabs support with error details

---

**Last Updated**: December 11, 2025
