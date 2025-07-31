import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse a date string (YYYY-MM-DD) in local timezone to avoid UTC conversion issues
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Date object in local timezone
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed in JS
}

/**
 * Parse a date and time string in local timezone
 * @param dateStr - Date string in YYYY-MM-DD format
 * @param timeStr - Time string in HH:MM:SS or HH:MM format
 * @returns Date object in local timezone
 */
export function parseLocalDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes, seconds = 0] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

/**
 * Format a Date object as YYYY-MM-DD string in local timezone
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format
 */
export function formatLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
