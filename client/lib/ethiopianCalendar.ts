// Utility functions for Ethiopian calendar conversion and year/semester generation
import { toEthiopian, toGregorian } from 'ethiopian-calendar';

// Generate a list of Ethiopian academic years (e.g., 2015/16, 2016/17, ...)
export function getEthiopianAcademicYears(startYear = 2010, count = 15) {
  const years = [];
  for (let i = 0; i < count; i++) {
    const year1 = startYear + i;
    const year2 = year1 + 1;
    years.push(`${year1}/${(year2 % 100).toString().padStart(2, '0')}`);
  }
  return years;
}

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

export const ETHIOPIAN_SEMESTERS = [
  'መጀመሪያ ሴሚስተር', // Semester I
  'ሁለተኛ ሴሚስተር',   // Semester II
  'በጋ ሴሚስተር'        // Summer
];

export const GREGORIAN_SEMESTERS = [
  'Semester I',
  'Semester II',
  'Summer'
];
