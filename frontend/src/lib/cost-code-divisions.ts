const DIVISION_TITLE_MAP: Record<string, string> = {
  '01': '01 General Requirements',
  '02': '02 Existing Conditions',
  '03': '03 Concrete',
  '04': '04 Masonry',
  '05': '05 Metals',
  '06': '06 Wood, Plastics, and Composites',
  '07': '07 Thermal and Moisture Protection',
  '08': '08 Openings',
  '09': '09 Finishes',
  '10': '10 Specialties',
  '11': '11 Equipment',
  '12': '12 Furnishings',
  '13': '13 Special Construction',
  '14': '14 Conveying Equipment',
  '21': '21 Fire Suppression',
  '22': '22 Plumbing',
  '23': '23 HVAC',
  '26': '26 Electrical',
  '27': '27 Communications',
  '28': '28 Electronic Safety and Security',
  '31': '31 Earthwork',
  '32': '32 Exterior Improvements',
  '33': '33 Utilities',
};

const DEFAULT_DIVISION_CODE = '00';
const DEFAULT_DIVISION_TITLE = 'Other';

export type DivisionMetadata = {
  divisionCode: string;
  divisionTitle: string;
};

/**
 * Derives the CSI division metadata from a cost code ID such as "01-1000".
 * Falls back to generic values when the pattern is missing.
 */
export function getDivisionMetadataFromCostCodeId(costCodeId: string | null | undefined): DivisionMetadata {
  if (!costCodeId) {
    return {
      divisionCode: DEFAULT_DIVISION_CODE,
      divisionTitle: DEFAULT_DIVISION_TITLE,
    };
  }

  const codeSegment = costCodeId.split('-')[0] || costCodeId.slice(0, 2) || DEFAULT_DIVISION_CODE;
  const normalizedCode = codeSegment.padStart(2, '0');

  return {
    divisionCode: normalizedCode,
    divisionTitle: DIVISION_TITLE_MAP[normalizedCode] ?? `${normalizedCode} Division`,
  };
}

export const COST_CODE_DIVISIONS = {
  map: DIVISION_TITLE_MAP,
  defaultCode: DEFAULT_DIVISION_CODE,
  defaultTitle: DEFAULT_DIVISION_TITLE,
};
