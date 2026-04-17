// Centralized academic years for each calendar type
const generateGregorianYears = () => {
  const years = [];
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const endYear = currentYear + 2;

  for (let year = startYear; year <= endYear; year++) {
    const year1 = year;
    const year2 = year + 1;
    years.push(`${year1}/${(year2 % 100).toString().padStart(2, '0')}`);
  }
  return years;
};

export const ACADEMIC_YEARS: Record<string, string[]> = {
  gregorian: generateGregorianYears(),
};
