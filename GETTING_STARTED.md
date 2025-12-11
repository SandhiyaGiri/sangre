# Getting Started - Telehealth Insight Companion

## 🚀 Start Here

Welcome to the Telehealth Insight Companion! This guide will get you up and running in minutes.

## ⚡ Quick Start (5 minutes)

### 1. Install & Run
```bash
cd /Users/sundharesan/Development/sangre/sangre
npm install
npm run dev
```

### 2. Open Browser
Navigate to `http://localhost:3000`

### 3. Test with Sample Report
- Download or locate `sample-report.json`
- Click the upload area
- Select the JSON file
- Click "Start Conversation"
- Ask questions like:
  - "What does my glucose level mean?"
  - "Are my cholesterol levels okay?"
  - "What should I do about my results?"
- Click "End Call" to generate summary
- Download the summary

## 📋 What You'll See

### Screen 1: Upload Report
- Drag-and-drop JSON file upload
- Language selector (English, Tamil, Malayalam, Kannada, Hindi)
- Real-time validation feedback

### Screen 2: Conversation
- Animated 3D orb showing connection state
- Chat history with timestamps
- Real-time transcription of your speech
- Start/End conversation buttons
- Status indicator (Ready/Connecting/Connected)

### Screen 3: Summary
- Key findings from your conversation
- Personalized recommendations
- Follow-up actions
- Download as text file

## 📊 Report Format

Your health report must be JSON with this structure:

```json
{
  "patient": {
    "name": "Your Name",
    "age": 45,
    "gender": "M",
    "email": "optional@example.com"
  },
  "test_date": "2024-12-11",
  "lab_values": [
    {
      "name": "Hemoglobin",
      "value": 14.5,
      "unit": "g/dL",
      "referenceMin": 12.0,
      "referenceMax": 17.5
    }
  ],
  "notes": "Optional notes from your lab"
}
```

See `sample-report.json` for a complete example.

## 🎤 Voice Conversation Tips

1. **Allow Microphone**: Browser will ask for microphone access - click "Allow"
2. **Speak Naturally**: No special commands needed
3. **Wait for Agent**: Let the agent finish speaking before you respond
4. **Ask Follow-ups**: "Why is this high?" "What should I do?"
5. **Be Specific**: Reference your lab values by name

## 🌐 Language Support

Click language buttons at the top to switch:
- 🇬🇧 English
- 🇮🇳 Tamil
- 🇮🇳 Malayalam
- 🇮🇳 Kannada
- 🇮🇳 Hindi

The UI and agent responses will translate automatically.

## 🔧 Troubleshooting

### Microphone Not Working
1. Check browser permissions (Settings → Privacy → Microphone)
2. Ensure microphone is connected
3. Try a different browser
4. Refresh the page

### Report Upload Fails
1. Verify JSON is valid (use JSONLint.com)
2. Check all required fields are present
3. Ensure test_date is in YYYY-MM-DD format
4. Lab values array must not be empty

### Agent Not Responding
1. Check internet connection
2. Refresh the page
3. Check browser console (F12) for errors
4. Try a different browser

### Summary Not Generating
1. Ensure you had at least one message exchange
2. Check network tab (F12) for errors
3. Try ending the call again

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | Complete user & developer guide |
| **HACKATHON_FEATURES.md** | Detailed feature implementation |
| **DEPLOYMENT_GUIDE.md** | How to deploy to production |
| **PROJECT_SUMMARY.md** | Project overview & architecture |
| **IMPLEMENTATION_CHECKLIST.md** | Feature completion checklist |

## 🎯 Common Use Cases

### Case 1: Understand Lab Results
1. Upload your recent lab report
2. Ask "What do these results mean?"
3. Ask about specific values
4. Get personalized summary

### Case 2: Lifestyle Advice
1. Upload report showing high cholesterol
2. Ask "What should I eat?"
3. Ask "What exercises help?"
4. Download recommendations

### Case 3: Follow-up Monitoring
1. Upload new report
2. Ask "Have my results improved?"
3. Ask "What's my next step?"
4. Share summary with doctor

## 🔐 Privacy & Safety

- Reports are stored in-memory during session only
- No data persists after you close the browser
- No external data transmission except to ElevenLabs
- All conversations are confidential
- Not a substitute for medical advice

## 💡 Tips for Best Results

### For Accurate Insights
- Provide complete lab values
- Include reference ranges if available
- Add any relevant medical notes
- Mention your age and gender

### For Better Conversation
- Ask specific questions
- Reference lab value names
- Ask follow-up questions
- Request actionable advice

### For Useful Summaries
- Have a full conversation (not just upload)
- Ask multiple questions
- Request specific recommendations
- Discuss follow-up actions

## 🚀 Next Steps

### After Testing Locally
1. Read **README.md** for full documentation
2. Review **HACKATHON_FEATURES.md** for technical details
3. Check **DEPLOYMENT_GUIDE.md** to deploy

### To Deploy to Production
```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
npm install -g vercel
vercel

# Or use Docker/AWS (see DEPLOYMENT_GUIDE.md)
```

### To Extend Features
- Add database persistence
- Implement user authentication
- Add email integration
- Create PDF export
- Build analytics dashboard

## 📞 Need Help?

1. **Check the docs**: README.md has comprehensive troubleshooting
2. **Review sample-report.json**: See expected format
3. **Check browser console**: F12 → Console tab for error messages
4. **Review error messages**: They describe what went wrong

## ✨ Key Features

✅ **Upload Health Reports** - JSON format with validation  
✅ **Voice Conversation** - Talk to AI about your findings  
✅ **Multilingual** - 5 languages with auto-detection  
✅ **Real-time Feedback** - See transcription as you speak  
✅ **Smart Summaries** - Auto-generated after conversation  
✅ **Download Results** - Share with your doctor  
✅ **Mobile Friendly** - Works on phones and tablets  
✅ **Production Ready** - TypeScript, error handling, responsive  

## 🎓 Learning Resources

- [ElevenLabs Documentation](https://elevenlabs.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 📊 System Requirements

- **Browser**: Chrome, Firefox, Safari, or Edge (modern version)
- **Microphone**: Required for voice conversation
- **Internet**: Stable connection needed
- **Storage**: ~50MB for installation

## 🎉 You're Ready!

Everything is set up and ready to use. Start with:

```bash
npm run dev
```

Then open `http://localhost:3000` and upload your first report!

---

**Version**: 1.0.0  
**Last Updated**: December 11, 2024  
**Status**: ✅ Ready to Use
