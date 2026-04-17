// Utility functions for calendar conversion and year/semester generation

// Generate a list of Gregorian academic years (e.g., 2023/24, 2024/25, ...)
export function getGregorianAcademicYears(startYear = 2023, count = 15) {
  const years = [];
  for (let i = 0; i < count; i++) {
    const year1 = startYear + i;
    const year2 = year1 + 1;
    years.push(`${year1}/${(year2 % 100).toString().padStart(2, '0')}`);
  }
  return years;
}

export const GREGORIAN_SEMESTERS = [
  'Semester I',
  'Semester II',
  'Summer',
  'Winter'
];
