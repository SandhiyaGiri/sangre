/**
 * Server Tool: Get Lab Reference Ranges
 * Provides standard reference ranges for common lab values
 */

import { COMMON_LAB_REFERENCES } from '../insightPipeline';

interface LabReferenceRequest {
  lab_name: string;
  unit?: string;
}

interface LabReferenceResponse {
  success: boolean;
  lab_name?: string;
  reference_min?: number;
  reference_max?: number;
  unit?: string;
  description?: string;
  error?: string;
}

/**
 * Get reference ranges for a lab value
 * Normalizes the lab name and returns standard reference ranges
 */
export function getLabReferenceRanges(
  request: LabReferenceRequest
): LabReferenceResponse {
  try {
    const { lab_name } = request;

    if (!lab_name) {
      return {
        success: false,
        error: 'lab_name is required',
      };
    }

    // Normalize lab name
    const normalized = lab_name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    // Look up reference range
    const reference = COMMON_LAB_REFERENCES[normalized];

    if (!reference) {
      return {
        success: false,
        error: `No reference range found for: ${lab_name}`,
      };
    }

    return {
      success: true,
      lab_name,
      reference_min: reference.min,
      reference_max: reference.max,
      unit: reference.unit,
      description: getLabDescription(normalized),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get description for a lab value
 */
function getLabDescription(normalizedName: string): string {
  const descriptions: Record<string, string> = {
    hemoglobin:
      'Protein in red blood cells that carries oxygen throughout the body',
    hematocrit: 'Percentage of red blood cells in total blood volume',
    wbc: 'White blood cells that help fight infections',
    rbc: 'Red blood cells that carry oxygen',
    platelets: 'Blood cells that help with clotting',
    glucose: 'Blood sugar level',
    glucose_fasting: 'Blood sugar level after fasting',
    creatinine: 'Kidney function marker',
    bun: 'Kidney function marker (blood urea nitrogen)',
    sodium: 'Electrolyte important for nerve and muscle function',
    potassium: 'Electrolyte important for heart and muscle function',
    calcium: 'Mineral important for bones and teeth',
    phosphorus: 'Mineral important for bone health',
    magnesium: 'Mineral important for muscle and nerve function',
    albumin: 'Protein that helps maintain blood pressure and transport nutrients',
    total_protein: 'Total amount of proteins in blood',
    ast: 'Liver enzyme (aspartate aminotransferase)',
    alt: 'Liver enzyme (alanine aminotransferase)',
    alkaline_phosphatase: 'Enzyme related to liver and bone health',
    total_bilirubin: 'Waste product from red blood cell breakdown',
    ldl: 'Low-density lipoprotein (bad cholesterol)',
    hdl: 'High-density lipoprotein (good cholesterol)',
    triglycerides: 'Type of fat in blood',
    total_cholesterol: 'Total amount of cholesterol in blood',
    tsh: 'Thyroid stimulating hormone (thyroid function)',
  };

  return descriptions[normalizedName] || 'Lab value';
}

/**
 * Get all available reference ranges
 */
export function getAllReferenceRanges(): Array<{
  name: string;
  min: number;
  max: number;
  unit: string;
}> {
  return Object.entries(COMMON_LAB_REFERENCES).map(([name, range]) => {
    const ref = range as { min: number; max: number; unit: string };
    return {
      name,
      min: ref.min,
      max: ref.max,
      unit: ref.unit,
    };
  });
}
