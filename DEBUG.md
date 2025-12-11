# Debug Mode & Development Guide

## Enabling Debug Mode

### Option 1: Add Debug Logging (Recommended)
Edit `app/page.tsx` and add this to the conversation hook's event handlers:

```typescript
onConnect: () => {
  console.log('✅ CONNECTED TO AGENT');
  console.log('Connection details:', {
    agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
    timestamp: new Date().toISOString()
  });
  setIsLoading(false);
},

onDisconnect: () => {
  console.log('❌ DISCONNECTED FROM AGENT');
  setCurrentTranscription('');
},

onMessage: (message: any) => {
  console.log('📨 MESSAGE RECEIVED:');
  console.log('  Type:', message.type);
  console.log('  Content:', message.message || message.transcription);
  console.log('  Full message:', message);
  // ... rest of handler
},

onError: (error: any) => {
  console.error('⚠️ ERROR RECEIVED:');
  console.error('  Type:', error?.name);
  console.error('  Message:', error?.message);
  console.error('  Full error:', error);
  // ... rest of handler
},
```

### Option 2: Browser DevTools
1. Open browser DevTools: `F12`
2. Go to **Console** tab
3. Watch for log messages as you interact with the app
4. Look for error messages in red

---

## What to Look For

### Successful Connection Flow
```
Starting conversation with agent: agent_5001kc6qf5h5fd5rmmbe7p24jf7q
Connected via WebRTC
✅ CONNECTED TO AGENT
📨 MESSAGE RECEIVED: type=agent_message content="Hello, I'm ready to chat!"
```

### WebRTC to WebSocket Fallback
```
Starting conversation with agent: agent_5001kc6qf5h5fd5rmmbe7p24jf7q
WebRTC connection failed, attempting websocket fallback: ConnectionError.internal
Connected via WebSocket
✅ CONNECTED TO AGENT
```

### Connection Failure
```
Starting conversation with agent: agent_5001kc6qf5h5fd5rmmbe7p24jf7q
⚠️ ERROR RECEIVED:
  Type: ConnectionError
  Message: Connection failed
Full error: Error: Connection failed
```

---

## Network Inspection

### Chrome DevTools Network Tab
1. Open DevTools: `F12`
2. Go to **Network** tab
3. Click "Start Conversation"
4. Look for new connections:
   - **WebSocket** connections: `wss://` or `ws://`
   - **Network requests**: API calls to elevenlabs

### What Each Connection Does
- `wss://...` = WebSocket connection (text/audio streaming)
- `https://api.elevenlabs.io` = REST API calls
- Network frames = Streamed data (messages, audio)

### Analyzing WebSocket
1. Click the WebSocket connection in Network tab
2. Go to **Messages** subtab
3. Watch for incoming/outgoing frames
4. Each frame contains message data

---

## Performance Profiling

### CPU Usage
1. Open DevTools: `F12`
2. Go to **Performance** tab
3. Click record
4. Start a conversation
5. Stop recording
6. Look for large functions/rendering

### Memory Usage
1. Open DevTools: `F12`
2. Go to **Memory** tab
3. Take a heap snapshot before conversation
4. Start conversation
5. Take another snapshot
6. Compare to find memory leaks

---

## State Debugging

### Check React State
Install React DevTools extension:
- Chrome: [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- Firefox: [React DevTools](https://addons.mozilla.org/firefox/addon/react-devtools/)

Then inspect the component tree to see:
- `isLoading` state
- `messages` array
- `currentTranscription` value
- `isAgentSpeaking` flag

### Console Logging of State
Add this to your component to log state changes:

```typescript
useEffect(() => {
  console.log('📊 STATE UPDATE:');
  console.log('  isLoading:', isLoading);
  console.log('  messages:', messages.length);
  console.log('  transcription:', currentTranscription);
  console.log('  agentSpeaking:', isAgentSpeaking);
}, [isLoading, messages, currentTranscription, isAgentSpeaking]);
```

---

## Common Debug Scenarios

### Scenario 1: "My microphone input isn't showing"
**Debug Steps:**
1. Open Console (F12)
2. Type: `navigator.mediaDevices.enumerateDevices()` and press Enter
3. Look for devices with `kind: "audioinput"`
4. If empty, microphone isn't detected

```javascript
// In console:
navigator.mediaDevices.enumerateDevices().then(devices => {
  const audioInput = devices.filter(d => d.kind === 'audioinput');
  console.log('Audio input devices:', audioInput);
});
```

### Scenario 2: "Messages aren't appearing"
**Debug Steps:**
1. Check Console for message events
2. Look for: `MESSAGE RECEIVED: type=user_message`
3. Verify `setMessages` is being called
4. Check if message.message is a string

Add this to onMessage:
```typescript
if (!message.message || typeof message.message !== 'string') {
  console.warn('Invalid message format:', message);
  return; // Don't process
}
```

### Scenario 3: "Connection drops randomly"
**Debug Steps:**
1. Watch Console for `DISCONNECTED FROM AGENT`
2. Check Network tab for connection drops
3. Look for error messages right before disconnect
4. Check if it's timing out (common with long silences)

Add timeout logging:
```typescript
const timeout = setTimeout(() => {
  console.warn('⏱️ Connection timeout - no activity for 30s');
}, 30000);
```

### Scenario 4: "WebRTC keeps failing, wants to use WebSocket"
**Debug Steps:**
1. Check if WebRTC is blocked by network
2. Test WebRTC: https://test.webrtc.org/
3. Check firewall settings
4. Try different network (mobile hotspot, etc.)

---

## Environment Variables Debug

### Check What's Loaded
Add this to your page component:

```typescript
useEffect(() => {
  console.log('Environment Variables:');
  console.log('Agent ID:', process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID);
  console.log('Environment:', process.env.NODE_ENV);
}, []);
```

### Rebuild After Env Changes
If you update `.env.local`:
```bash
# Stop dev server (Ctrl+C)
npm run dev  # Restart
```

The app needs to be restarted to pick up environment variable changes.

---

## Performance Metrics

### Add Timing Logs
```typescript
const startConversation = async () => {
  const startTime = performance.now();
  console.log('🚀 Starting conversation...');

  setIsLoading(true);
  try {
    // ... connection code

    const endTime = performance.now();
    console.log(`⏱️ Connection took ${(endTime - startTime).toFixed(0)}ms`);
  } catch (error) {
    // ... error handling
  }
};
```

### Monitor Message Latency
```typescript
const startTime = Date.now();
onMessage: (message: any) => {
  const latency = Date.now() - startTime;
  console.log(`📊 Message latency: ${latency}ms`);
  // ... rest of handler
}
```

---

## Local Testing Checklist

Before considering the app ready, verify:

- [ ] Console shows no errors (except expected ones)
- [ ] WebRTC connection succeeds OR falls back to WebSocket
- [ ] Messages appear in real-time
- [ ] Transcription shows as you speak
- [ ] Timestamps are correct
- [ ] Agent responses are complete
- [ ] Orb animates when connected
- [ ] Status indicator shows correctly
- [ ] "End Call" properly disconnects
- [ ] Can start new conversations after ending

---

## Useful Browser Console Commands

```javascript
// Check connection state
console.log(conversation);

// Check messages array
console.log(messages);

// Test microphone access
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('✅ Microphone access granted'))
  .catch(e => console.error('❌ Microphone access denied:', e));

// Check network connectivity
fetch('https://api.elevenlabs.io/status')
  .then(r => console.log('✅ Connected to ElevenLabs'))
  .catch(e => console.error('❌ Cannot reach ElevenLabs:', e));

// Monitor messages
conversation.onMessage((msg) => {
  console.table(msg);
});
```

---

## Stack Trace Analysis

### If You Get an Error Stack Trace
The most important parts are:
1. **Error Message**: First line tells you what went wrong
2. **File and Line Number**: `page.tsx:123` means line 123 in page.tsx
3. **Call Stack**: Shows which functions called which

Example:
```
TypeError: Cannot read property 'message' of undefined
    at startConversation (page.tsx:97)
    at onClick (page.tsx:185)
```
This means the `conversation` object doesn't have a `message` property at line 97.

---

## Getting Help with Logs

When asking for help, include:
1. **Console output** (copy everything before/after error)
2. **Steps to reproduce** (exactly what you did)
3. **Browser info** (Chrome 120 on MacOS, etc.)
4. **Network conditions** (WiFi, 5G, corporate network, etc.)

---

**Happy Debugging! 🐛🔍**
