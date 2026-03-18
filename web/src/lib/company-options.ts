export const EMPLOYEE_RANGES = [
  { value: "lt_10", label: "< 10" },
  { value: "10_249", label: "10 - 249" },
  { value: "250_4999", label: "250 - 4 999" },
  { value: "5000_plus", label: "5 000+" },
] as const;

export const REVENUE_RANGES = [
  { value: "lt_2m", label: "< 2 M€" },
  { value: "2m_50m", label: "2 - 50 M€" },
  { value: "50m_1500m", label: "50 M€ - 1,5 Md€" },
  { value: "1500m_plus", label: "> 1,5 Md€" },
] as const;

export const BALANCE_SHEET_RANGES = [
  { value: "lt_2m", label: "< 2 M€" },
  { value: "2m_43m", label: "2 - 43 M€" },
  { value: "43m_2000m", label: "43 M€ - 2 Md€" },
  { value: "2000m_plus", label: "> 2 Md€" },
] as const;

export const CATEGORY_LABELS = [
  { value: "tpe", label: "TPE" },
  { value: "pme", label: "PME" },
  { value: "eti", label: "ETI" },
  { value: "grande_entreprise", label: "Grande entreprise" },
] as const;

export function labelFor(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
