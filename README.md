# Telehealth Insight Companion

A multilingual AI-powered health report assistant that helps patients understand their lab results through empathetic, voice-based conversations with guardrail-heavy safety measures.

## 🎯 Vision

Enable patients to upload their health/blood reports (JSON format) and have an interactive conversation with an AI assistant that:
- Explains findings in their preferred language (English, Tamil, Malayalam, Kannada, Hindi)
- Provides empathetic, informational guidance (not diagnostic)
- Generates shareable session summaries
- Maintains strict safety guardrails throughout

## ✨ Core Features

### 1. Report Upload & Validation
- Accept JSON health reports with standardized schema
- Validate patient info, test dates, and lab values
- Generate unique report IDs for tracking
- Provide clear error messages for invalid data

### 2. Insight Preparation Pipeline
- Normalize lab units and values
- Flag out-of-range results (warning/critical levels)
- Generate headline insights and risk tags
- Prepare structured context for conversation

### 3. Conversational Agent
- Real-time voice interaction via ElevenLabs WebRTC
- Acknowledges uploaded report and patient context
- Answers follow-up questions about findings
- Maintains conversation history with timestamps
- Supports interruptions and natural turn-taking

### 4. Multilingual Support
- Auto-detect user language from input
- Manual language selection available
- Full UI and response translation
- Supported: English, Tamil, Malayalam, Kannada, Hindi

### 5. Session Summary
- Automatic summary generation after conversation ends
- Extracts key findings and recommendations
- Lists follow-up actions
- Downloadable as text file
- Ready for email sharing (stub for hackathon)

## 🏗️ Architecture

### Frontend (React + Next.js 15)
```
app/
├── page.tsx                    # Main app with 3 states: upload/conversation/summary
├── api/
│   ├── upload-report/route.ts # Report validation & storage
│   └── summaries/route.ts     # Summary generation endpoint
└── globals.css                # Global styling

components/
├── AnimatedOrb.tsx            # 3D orb visualization
├── ReportUploader.tsx         # File upload UI
├── SessionSummary.tsx         # Summary display modal
└── LanguageSelector.tsx       # Language switcher

lib/
├── reportSchema.ts            # Schema validation logic
├── insightPipeline.ts         # Lab value flagging & insights
└── translations.ts            # Multilingual strings
```

### Backend (Next.js API Routes)
- **In-memory storage** for hackathon (reports & summaries)
- **Report validation** against schema
- **Insight generation** with reference ranges
- **Summary extraction** from conversation transcripts

### External Integration
- **ElevenLabs Agent**: Voice conversation via WebRTC
- **Agent ID**: `agent_7101k5zvyjhmfg983brhmhkd98n6`

## 📋 Report Schema

### Expected JSON Format
```json
{
  "patient": {
    "name": "string",
    "age": "number",
    "gender": "M|F|Other",
    "email": "string (optional)",
    "phone": "string (optional)"
  },
  "test_date": "YYYY-MM-DD",
  "lab_name": "string (optional)",
  "lab_values": [
    {
      "name": "string",
      "value": "number",
      "unit": "string",
      "referenceMin": "number (optional)",
      "referenceMax": "number (optional)"
    }
  ],
  "notes": "string (optional)"
}
```

See `sample-report.json` for a complete example.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Environment Setup
Create `.env.local`:
```
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_7101k5zvyjhmfg983brhmhkd98n6
```

### Development
```bash
npm run dev
```
Open `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📖 User Flow

1. **Upload Report** → User selects JSON file with health data
2. **Validate** → Backend checks schema and flags issues
3. **Start Conversation** → User clicks "Start Conversation"
4. **Discuss** → User asks questions, agent explains findings
5. **End Session** → User clicks "End Call"
6. **Summary** → Auto-generated recap with findings & recommendations
7. **Download/Share** → User can download summary or email it

## 🔐 Safety & Guardrails

### Current Implementation
- Input validation on all report uploads
- Output moderation hooks (placeholder for guardrail specs)
- No diagnostic claims (informational only)
- Clear disclaimers in summaries

### Future Guardrails (to be supplied)
- Central instruction file for agent persona
- Runtime safety checks (input sanitization, output filtering)
- Allowed/disallowed topics
- Escalation protocols for critical findings

## 🧪 Testing

### Test with Sample Report
1. Download or copy `sample-report.json`
2. Upload via UI
3. Start conversation and ask questions like:
   - "What does my glucose level mean?"
   - "Are my cholesterol levels okay?"
   - "What should I do about my results?"

### Example Questions
- "Explain my hemoglobin result"
- "Why is my LDL high?"
- "What lifestyle changes help with triglycerides?"
- "When should I retest?"

## 📊 Lab Value Reference Ranges

The system includes common reference ranges for:
- **Blood Counts**: Hemoglobin, Hematocrit, WBC, RBC, Platelets
- **Metabolic**: Glucose, Creatinine, BUN
- **Electrolytes**: Sodium, Potassium, Calcium, Magnesium, Phosphorus
- **Liver Function**: AST, ALT, Alkaline Phosphatase, Bilirubin
- **Lipids**: LDL, HDL, Triglycerides, Total Cholesterol
- **Thyroid**: TSH

Custom reference ranges can be provided per lab value.

## 🌐 Multilingual Features

### Supported Languages
- **English** (en)
- **Tamil** (ta)
- **Malayalam** (ml)
- **Kannada** (kn)
- **Hindi** (hi)

### Language Detection
- Auto-detects from user input (checks for language-specific Unicode)
- Manual selection via language selector buttons
- All UI strings translated
- Agent responses translated via ElevenLabs

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Works on phones, tablets, and desktops
- Touch-friendly buttons and inputs
- Optimized chat interface for all screen sizes

## 🔄 State Management

Three main app states:
1. **Upload** - Report file selection and validation
2. **Conversation** - Voice chat with agent
3. **Summary** - Session recap and download

Transitions:
- Upload → Conversation (on successful upload)
- Conversation → Summary (on "End Call")
- Summary → Upload (on "Back" button)

## 🎨 UI/UX Highlights

- **Dark theme** with blue accents for professional look
- **Animated orb** shows connection state and agent speaking
- **Real-time transcription** displays user speech as it's recognized
- **Color-coded messages** (blue=user, gray=agent)
- **Status indicators** show connection health
- **Thinking animation** (bouncing dots) when agent is processing

## 🔧 Technical Stack

- **Framework**: Next.js 15.5.7 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.0
- **Agent SDK**: @elevenlabs/react 0.12.1
- **Connection**: WebRTC (real-time voice)
- **State**: React Hooks (useState, useRef, useEffect)

## 📝 API Endpoints

### POST /api/upload-report
Upload and validate a health report.

**Request:**
```json
{
  "patient": { ... },
  "test_date": "2024-12-11",
  "lab_values": [ ... ]
}
```

**Response:**
```json
{
  "success": true,
  "report_id": "report_1734000000000_abc123def",
  "patient_name": "John Doe",
  "test_date": "2024-12-11",
  "insights": {
    "headline_insights": ["All values within normal range"],
    "risk_tags": ["metabolic"],
    "flagged_count": 0
  }
}
```

### GET /api/upload-report?report_id=...
Retrieve a stored report and its insights.

### POST /api/summaries
Generate a session summary from conversation transcript.

**Request:**
```json
{
  "report_id": "report_...",
  "transcript": [
    { "role": "user", "content": "...", "timestamp": "..." },
    { "role": "agent", "content": "...", "timestamp": "..." }
  ],
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "report_id": "report_...",
    "generated_at": "2024-12-11T...",
    "findings": ["..."],
    "recommendations": ["..."],
    "follow_up_actions": ["..."]
  }
}
```

### GET /api/summaries?report_id=...
Retrieve a generated summary.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` - Required for agent connection

## 📚 Future Enhancements

### Phase 2 (Post-Hackathon)
- [ ] Persistent database (PostgreSQL/MongoDB)
- [ ] User authentication & multi-user support
- [ ] Email integration for summary sharing
- [ ] Conversation history export (PDF/CSV)
- [ ] Advanced guardrail system
- [ ] Analytics dashboard
- [ ] Integration with EHR systems
- [ ] Voice input settings (microphone selection)
- [ ] Dark/light mode toggle
- [ ] Accessibility improvements (ARIA labels, keyboard nav)

### Phase 3 (Production)
- [ ] HIPAA compliance
- [ ] End-to-end encryption
- [ ] Audit logging
- [ ] Rate limiting & DDoS protection
- [ ] Multi-region deployment
- [ ] Advanced NLP for better context understanding
- [ ] Integration with wearable devices
- [ ] Predictive health insights

## 🤝 Contributing

### Development Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with clear messages: `git commit -m "Add feature description"`
4. Push and create pull request

### Code Style
- Use TypeScript for type safety
- Follow existing component patterns
- Keep components focused and reusable
- Add comments for complex logic

## 📄 License

This project is part of a hackathon submission. See LICENSE file for details.

## 🆘 Troubleshooting

### Microphone Not Working
- Check browser permissions (Settings → Privacy → Microphone)
- Ensure microphone is connected and working
- Try a different browser
- Refresh the page

### Report Upload Fails
- Verify JSON format matches schema
- Check all required fields are present
- Ensure test_date is in YYYY-MM-DD format
- Validate lab_values array is not empty

### No Agent Response
- Check internet connection
- Verify Agent ID in `.env.local`
- Check browser console for errors (F12)
- Try refreshing the page

### Summary Not Generating
- Ensure conversation had at least one exchange
- Check network tab for API errors
- Verify report_id was set correctly

## 📞 Support

For issues or questions:
1. Check this README
2. Review sample-report.json for format examples
3. Check browser console (F12) for error messages
4. Review ElevenLabs documentation: https://elevenlabs.io/docs

## 🎓 Learning Resources

- [ElevenLabs Docs](https://elevenlabs.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Built with ❤️ for the Telehealth Hackathon**

**Version**: 1.0.0  
**Last Updated**: December 11, 2024
