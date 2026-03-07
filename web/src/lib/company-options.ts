export const EMPLOYEE_RANGES = [
  { value: "lt_10", label: "< 10" },
  { value: "10_49", label: "10 - 49" },
  { value: "50_249", label: "50 - 249" },
  { value: "250_plus", label: "250+" },
] as const;

export const REVENUE_RANGES = [
  { value: "lt_2m", label: "< 2 M\u20ac" },
  { value: "2m_10m", label: "2 - 10 M\u20ac" },
  { value: "10m_50m", label: "10 - 50 M\u20ac" },
  { value: "50m_plus", label: "50 M\u20ac+" },
] as const;

export function labelFor(
  options: readonly { value: string; label: string }[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
