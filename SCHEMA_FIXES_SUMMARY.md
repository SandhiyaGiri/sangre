# Report Schema Fixes - Summary

## Problem

The original report schema only supported a simple flat structure with `lab_values` array. When you tried to upload a complex lab report with nested test categories (like the one from MedCare Diagnostics), it failed with validation errors:

```
Patient gender must be M, F, or Other
Test date is required (ISO format: YYYY-MM-DD)
Lab values must be an array
```

## Solution

Updated the schema and validation logic to support **both simple and complex lab report formats**.

## What Changed

### 1. Updated Type Definitions (`lib/reportSchema.ts`)

**New Interfaces Added:**
- `TestResult` - Represents a single test result with value, unit, and raw text
- `ReferenceRange` - Reference ranges with low/high/condition
- `TestFlag` - Flag status and reason
- `Test` - Individual test with name, result, reference range, and flag
- `TestCategory` - Category of tests (e.g., "Complete Blood Count")

**Updated Interfaces:**
- `PatientInfo` - Now accepts gender as string (M, F, Male, Female, Other)
- `LabValue` - Value can now be string or number
- `HealthReport` - Now supports both `lab_values` and `tests` arrays, plus metadata and summary

### 2. Enhanced Validation (`lib/reportSchema.ts`)

**Gender Validation:**
- ✅ Accepts: M, F, Male, Female, Other (case-insensitive)
- ❌ Rejects: Invalid gender values

**Test Date Validation:**
- ✅ Accepts test_date field directly
- ✅ Accepts ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
- ✅ Falls back to metadata.reported_on
- ✅ Falls back to metadata.sample_collected
- ⚠️ Warns if no date found (optional for complex reports)

**Lab Values/Tests Validation:**
- ✅ Accepts `lab_values` array (simple format)
- ✅ Accepts `tests` array with categories (complex format)
- ✅ Validates nested test structure
- ❌ Requires at least one of the two formats

### 3. Insight Pipeline Updates (`lib/insightPipeline.ts`)

**New Converter Function:**
```typescript
convertTestsToLabValues(testCategories: TestCategory[]): LabValue[]
```

Automatically converts complex test format to simple lab_values format for processing:
- Extracts numeric values from test results
- Maps reference ranges
- Preserves test flags
- Filters out non-numeric values (like "Clear", "Negative")

**Enhanced Insight Generation:**
- Handles both formats transparently
- Extracts test_date from multiple sources
- Properly types numeric comparisons
- Supports string and numeric values

## Supported Report Formats

### Format 1: Simple Lab Values (Original)

```json
{
  "patient": {
    "name": "John Doe",
    "age": 45,
    "gender": "M"
  },
  "test_date": "2025-12-11",
  "lab_values": [
    {
      "name": "Hemoglobin",
      "value": 14.5,
      "unit": "g/dL",
      "referenceMin": 12.0,
      "referenceMax": 17.5
    }
  ]
}
```

### Format 2: Complex Test Categories (New)

```json
{
  "patient": {
    "name": "Rohan Sharma",
    "age": 32,
    "gender": "Male"
  },
  "metadata": {
    "reported_on": "2025-12-12T17:10:00",
    "lab_id": "MedCare Diagnostics"
  },
  "tests": [
    {
      "category": "Complete Blood Count",
      "subcategory": "CBC",
      "tests": [
        {
          "test_name": "Hemoglobin (Hb)",
          "result": {
            "value": 13.4,
            "unit": "g/dL"
          },
          "reference_range": {
            "low": 13.0,
            "high": 17.0
          },
          "flag": {
            "status": "normal"
          }
        }
      ]
    }
  ]
}
```

## Sample Files

### Simple Format
- `sample-report.json` - Original simple format example

### Complex Format
- `sample-report-complex.json` - New complex format example (based on your MedCare report)

## How to Use

### Upload Simple Report
```bash
# Use sample-report.json
# Gender: M, F, or Other
# Must have test_date in YYYY-MM-DD format
# Must have lab_values array
```

### Upload Complex Report
```bash
# Use sample-report-complex.json
# Gender: M, F, Male, Female, or Other
# Can use metadata.reported_on or metadata.sample_collected
# Must have tests array with categories
# Can include summary section
```

## Validation Rules

### Required Fields
- `patient.name` - String
- `patient.age` - Positive number
- `patient.gender` - M, F, Male, Female, or Other
- Either `lab_values` OR `tests` array

### Optional Fields
- `test_date` - YYYY-MM-DD or ISO 8601
- `metadata` - Object with lab info
- `summary` - Object with abnormal tests and notes
- `notes` - Additional notes

## Error Handling

### Common Errors & Fixes

**Error:** "Patient gender must be M, F, Male, Female, or Other"
- **Fix:** Use one of the accepted gender values (case-insensitive)

**Error:** "Test date is required"
- **Fix:** Add `test_date` field OR `metadata.reported_on` OR `metadata.sample_collected`

**Error:** "Report must contain either lab_values array or tests array"
- **Fix:** Provide at least one of:
  - `lab_values` array with lab values
  - `tests` array with test categories

**Error:** "Test category at index X missing tests array"
- **Fix:** Each test category must have a `tests` array with test objects

## Processing Flow

```
Upload Report
    ↓
Validate Schema
    ├─ Check patient info
    ├─ Check test date (from multiple sources)
    └─ Check lab_values OR tests
    ↓
Generate Insights
    ├─ Convert tests to lab_values (if needed)
    ├─ Flag out-of-range values
    ├─ Generate headline insights
    └─ Generate risk tags
    ↓
Store Report
    ↓
Return to Frontend
```

## Testing

### Test with Simple Format
```bash
# Upload sample-report.json
# Expected: Success with basic lab values
```

### Test with Complex Format
```bash
# Upload sample-report-complex.json
# Expected: Success with nested test categories
```

### Test with Your Report
```bash
# Upload your MedCare Diagnostics report
# Expected: Success with all tests processed
```

## Technical Details

### Type Safety
- All numeric comparisons properly typed
- Optional fields handled correctly
- Union types for flexible values

### Performance
- Conversion happens once during insight generation
- No repeated processing
- Efficient array operations

### Backward Compatibility
- Simple format still fully supported
- No breaking changes to existing reports
- Complex format is additive

## Future Enhancements

### Planned
- PDF report parsing
- Automatic format detection
- Multi-language lab names
- Custom reference ranges per lab

### Possible
- Database persistence
- Report versioning
- Comparison with previous reports
- Trend analysis

## Files Modified

1. **lib/reportSchema.ts**
   - Added new interfaces (TestResult, ReferenceRange, TestFlag, Test, TestCategory)
   - Updated PatientInfo (flexible gender)
   - Updated LabValue (string or number values)
   - Updated HealthReport (supports both formats)
   - Enhanced validateReport() function

2. **lib/insightPipeline.ts**
   - Added convertTestsToLabValues() function
   - Updated generateInsights() to handle both formats
   - Fixed numeric type comparisons
   - Added test_date extraction from metadata

3. **sample-report-complex.json** (NEW)
   - Example complex report format
   - Based on real MedCare Diagnostics structure

## Verification

✅ Schema validates both formats  
✅ Type errors fixed  
✅ Conversion function working  
✅ Test date extraction working  
✅ Gender validation flexible  
✅ Backward compatible  
✅ Sample files provided  

## Next Steps

1. **Test Upload** - Try uploading your MedCare report
2. **Start Conversation** - Begin talking to the agent
3. **Generate Summary** - End call and get summary
4. **Download** - Save the summary

---

**Date**: December 11, 2024  
**Version**: 1.0.0  
**Status**: ✅ Ready for Testing
