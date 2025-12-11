# Blood Report Integration Guide

## Overview

The ElevenLabs Agent UI now includes integrated blood report analysis capabilities. This allows patients to upload or reference blood test reports while conversing with a health coach AI agent who explains results in simple, friendly language.

---

## Features

✨ **Blood Report Display**
- Interactive collapsible test categories
- Color-coded result status (Normal/Low/High)
- Patient information and metadata
- Abnormal test highlights
- Lab comments and notes

🎤 **Voice-Based Analysis**
- Discuss results naturally with the agent
- Get personalized explanations
- Ask follow-up questions
- Receive lifestyle recommendations

📊 **Structured Data**
- Complete blood count (CBC)
- Lipid profile
- Blood sugar levels
- Liver and kidney function tests
- Thyroid profile
- Vitamin levels
- And more...

---

## Architecture

### Components

**BloodReportViewer.tsx** (`components/BloodReportViewer.tsx`)
- Displays blood report data in an interactive format
- Shows patient information and metadata
- Highlights abnormal results
- Provides test-by-test breakdown

**useBloodReport Hook** (`lib/useBloodReport.ts`)
- Loads blood report JSON files
- Provides agent prompt context
- Generates sample conversation context
- Manages loading/error states

**Main Page** (`app/page.tsx`)
- Integrates report viewer into chat interface
- Manages report visibility
- Provides load/show/hide controls

---

## Data Structure

Blood reports follow this JSON structure:

```json
{
  "report_id": "RPT-2025-DEC-00123",
  "patient": {
    "name": "Patient Name",
    "age": 32,
    "gender": "Male",
    "patient_id": "P123"
  },
  "metadata": {
    "sample_collected": "2025-12-12T08:34:00",
    "reported_on": "2025-12-12T17:10:00",
    "referring_doctor": "Dr. Name",
    "lab_id": "Lab Name"
  },
  "tests": [
    {
      "category": "Complete Blood Count",
      "subcategory": "CBC",
      "tests": [
        {
          "test_name": "Hemoglobin (Hb)",
          "result": { "value": 13.4, "unit": "g/dL" },
          "reference_range": { "low": 13.0, "high": 17.0 },
          "flag": { "status": "normal", "flag_reason": null }
        }
      ]
    }
  ],
  "summary": {
    "abnormal_tests": [...],
    "critical_alert": false,
    "lab_comments": "Optional comments"
  }
}
```

---

## Usage

### Loading a Blood Report

1. **Click "Load Blood Report"** button in the control panel
2. The blood report JSON file will be loaded from `public/data/SampleBloodReport.json`
3. Once loaded, click **"Show Report"** to display it

### Viewing the Report

- **Expandable Categories**: Click category headers to expand/collapse
- **Color Coding**:
  - 🟢 **Green**: Normal results
  - 🔵 **Blue**: Low results
  - 🟠 **Orange**: High results
- **Abnormal Tests Alert**: Shows all out-of-range results at the top

### Discussing with Agent

1. Load the report first
2. Start a conversation with the agent
3. The agent can analyze and explain the results
4. Ask follow-up questions naturally

---

## Agent Prompt Integration

The agent uses a specialized prompt optimized for blood test analysis:

```typescript
const agentPrompt = `
You are a friendly, calm, and supportive voice assistant.
Explain blood test results in simple, reassuring language.
Do not diagnose or prescribe medication.
Always use cautious phrasing: "can sometimes be related to..."
`;
```

### Key Features of the Agent Prompt

- **Non-diagnostic**: Explains what tests measure, not diagnoses
- **Patient-friendly**: Uses everyday language
- **Supportive tone**: Calm, warm, empathetic
- **Safety-focused**: Recommends professional consultation for concerns
- **Data-driven**: Only interprets information in the report

---

## File Organization

```
elevenlabs-agent-ui/
├── app/
│   ├── data/                              # Source data
│   │   ├── SampleBloodReport.json        # Sample blood report
│   │   └── prompt.txt                    # Agent prompt instructions
│   └── page.tsx                          # Main component with integration
│
├── components/
│   ├── BloodReportViewer.tsx            # Blood report display component
│   └── AnimatedOrb.tsx                  # Connection status orb
│
├── lib/
│   └── useBloodReport.ts                # Blood report hook
│
├── public/
│   └── data/
│       └── SampleBloodReport.json       # Served to client
│
└── ...
```

---

## Adding Your Own Blood Report

### Option 1: Replace Sample Report
1. Place your blood report JSON in `app/data/`
2. Copy it to `public/data/SampleBloodReport.json`
3. Ensure it matches the required schema

### Option 2: Add Multiple Reports
1. Create a new endpoint or data loader
2. Modify `useBloodReport` to accept a filename parameter
3. Update buttons to allow report selection

Example:
```typescript
const loadReport = async (filename: string) => {
  const response = await fetch(`/data/${filename}`);
  const data = await response.json();
  setReport(data);
};
```

---

## Data Requirements

### Required Fields
- `report_id`: Unique identifier
- `patient.name`: Patient name
- `patient.age`: Patient age
- `patient.gender`: Patient gender
- `tests`: Array of test categories

### Test Format
Each test must include:
- `test_name`: Name of the test
- `result.value`: Numeric or text value
- `result.unit`: Unit of measurement (or null)
- `reference_range.low`: Lower bound (or null)
- `reference_range.high`: Upper bound (or null)
- `flag.status`: "normal", "low", or "high"

### Optional Fields
- `subcategory`: For grouping tests
- `flag_reason`: Why a result is flagged
- `lab_comments`: Additional notes
- `critical_alert`: Boolean for critical values

---

## Styling & Customization

### Color Scheme
Modify color classes in `BloodReportViewer.tsx`:

```typescript
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'normal': return 'bg-green-50 border-green-200';
    case 'low': return 'bg-blue-50 border-blue-200';
    case 'high': return 'bg-orange-50 border-orange-200';
    default: return 'bg-gray-50 border-gray-200';
  }
};
```

### Layout
- Max height: `max-h-96` (modify for taller/shorter display)
- Padding: `p-4` (adjust spacing)
- Font sizes: `text-lg`, `text-sm` (customize typography)

---

## Integration with Agent API

### Current Setup
- Uses ElevenLabs React SDK
- Agent context includes patient info and report summary
- Prompt includes specific formatting rules

### Future Enhancements
1. **Backend Integration**: Send reports to backend for processing
2. **Report Upload**: Allow users to upload new reports
3. **Report History**: Store multiple reports per patient
4. **PDF Support**: Convert JSON to PDF export
5. **Analytics**: Track which tests are discussed

---

## Agent Conversation Flow

### Typical Interaction

```
User: "Analyze my blood test results"
Agent: "I'll help explain your blood test results.
        Let me look at your report..."

[Agent reads abnormal tests from summary]

Agent: "I see your Vitamin D is a bit low. This is
        pretty common, especially if you don't get
        much sun. Let me explain what this means..."

[Agent explains each test]

Agent: "Your other results look good! If you're
       concerned about anything, definitely discuss
       these with your doctor."
```

---

## Customizing the Agent Prompt

Edit `app/data/prompt.txt` to customize:

1. **Personality**: Friendly, professional, casual, etc.
2. **Language Level**: Simple, technical, moderate
3. **Focus Areas**: Diet, exercise, lifestyle, etc.
4. **Safety Guardrails**: How cautious to be

Example:
```markdown
# Personality
You are a detailed medical analyst.
You provide comprehensive explanations.
...
```

---

## Error Handling

### Common Issues

**"Error loading report"**
- Check file exists in `public/data/`
- Verify JSON is valid: `npm run validate-json`
- Check file permissions

**Report doesn't display**
- Ensure all required fields are present
- Validate against JSON schema
- Check browser console for errors

**Agent can't analyze report**
- Verify agent has access to report data
- Check agent prompt is properly configured
- Test agent separately first

---

## Performance Considerations

### Bundle Impact
- `BloodReportViewer.tsx`: ~3 KB
- `useBloodReport.ts`: ~2 KB
- Total addition: ~5 KB (minimal impact)

### Data Transfer
- Sample report: ~16 KB
- Gzip compression reduces ~30-40%
- Load time: <100ms on good connections

### Rendering
- Collapsible sections prevent rendering all at once
- Lazy loading of test details
- Efficient state management with `expandedCategories`

---

## Accessibility

### Keyboard Navigation
- Tab through buttons
- Enter/Space to toggle report visibility
- Arrows to expand/collapse categories (future)

### Screen Readers
Consider adding for production:
```tsx
<button
  aria-label="Load blood report from file"
  aria-expanded={showReport}
  role="tab"
>
  Load Blood Report
</button>
```

### Color Contrast
- Status colors chosen for accessibility
- Text contrast ratios meet WCAG AA standards
- Icons used alongside text (not text-only indicators)

---

## Testing

### Unit Tests (recommended)
```typescript
// Test blood report loading
test('useBloodReport loads data correctly', () => {
  const { result } = renderHook(() => useBloodReport());
  act(() => {
    result.current.loadReport();
  });
  expect(result.current.report).toBeDefined();
});

// Test component rendering
test('BloodReportViewer renders patient info', () => {
  const { getByText } = render(
    <BloodReportViewer report={mockReport} />
  );
  expect(getByText(/Rohan Sharma/)).toBeInTheDocument();
});
```

### Manual Testing
- [ ] Load report successfully
- [ ] All test categories display
- [ ] Abnormal tests highlighted
- [ ] Expand/collapse works
- [ ] Report hides/shows correctly
- [ ] No console errors

---

## Troubleshooting

### Report won't load
1. Check `public/data/SampleBloodReport.json` exists
2. Verify JSON syntax: `cat public/data/SampleBloodReport.json | jq .`
3. Check file permissions: `ls -la public/data/`
4. Rebuild: `npm run build`

### Tests don't display properly
1. Verify all required fields are present
2. Check `test_name` spelling consistency
3. Ensure `result.value` is present
4. Check `flag.status` is valid ("normal", "low", "high")

### Agent can't access report
1. Restart dev server: `npm run dev`
2. Check `.env.local` has correct agent ID
3. Verify agent configuration includes knowledge base
4. Test agent separately

---

## Production Deployment

### Before Deploying
- [ ] Test on multiple browsers
- [ ] Verify all reports load correctly
- [ ] Check performance on slow networks
- [ ] Test error states
- [ ] Verify HIPAA/privacy compliance

### Deployment Steps
1. Build: `npm run build`
2. Test: `npm run dev` (verify locally)
3. Deploy: `vercel` or your hosting platform
4. Monitor: Check logs for errors

### Privacy Considerations
- **Don't expose patient data** in logs
- **Use HTTPS** for all connections
- **Implement authentication** for real patient data
- **Add data retention policies**
- **Get informed consent** before using patient data

---

## Future Enhancements

### Phase 1 (MVP)
- ✅ Display blood report
- ✅ Voice analysis with agent
- Keyboard navigation

### Phase 2
- [ ] Multiple report support
- [ ] Report upload feature
- [ ] PDF export
- [ ] Comparison between reports

### Phase 3
- [ ] Backend integration
- [ ] User authentication
- [ ] Report history
- [ ] Analytics dashboard

---

## Support & Resources

- **Schema Validation**: Use `json-schema-validator`
- **Sample Data**: `app/data/SampleBloodReport.json`
- **Agent Docs**: Check `app/data/prompt.txt`
- **ElevenLabs Docs**: https://elevenlabs.io/docs

---

## License & Privacy

This integration is for educational and demonstration purposes. For production use with real patient data, ensure:

- HIPAA compliance (if in the US)
- GDPR compliance (if in EU)
- Local healthcare data regulations
- Patient consent and privacy agreements
- Secure data transmission
- Encrypted storage

---

**Integration Date**: December 11, 2025
**Status**: ✅ Ready for Use

For questions or improvements, refer to the main README and documentation.
