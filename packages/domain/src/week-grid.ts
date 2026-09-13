import { z } from "zod";

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const TIME_HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const dayHoursSchema = z.object({
  open: z.boolean(),
  start: z.string().regex(TIME_HHMM),
  end: z.string().regex(TIME_HHMM),
});
export type DayHours = z.infer<typeof dayHoursSchema>;

export const weekGridSchema = z.object({
  mon: dayHoursSchema,
  tue: dayHoursSchema,
  wed: dayHoursSchema,
  thu: dayHoursSchema,
  fri: dayHoursSchema,
  sat: dayHoursSchema,
  sun: dayHoursSchema,
});
export type WeekGrid = z.infer<typeof weekGridSchema>;

export const AFTER_HOURS = ["answer-and-message", "answer-and-book", "message-only"] as const;
export type AfterHoursPolicy = (typeof AFTER_HOURS)[number];
export const afterHoursSchema = z.enum(AFTER_HOURS);

export function emptyWeek(closed = false): WeekGrid {
  const day = (open: boolean): DayHours => ({ open, start: "08:00", end: "18:00" });
  return {
    mon: day(!closed),
    tue: day(!closed),
    wed: day(!closed),
    thu: day(!closed),
    fri: day(!closed),
    sat: day(!closed),
    sun: { open: false, start: "08:00", end: "18:00" },
  };
}

export function salonWeek(): WeekGrid {
  return {
    mon: { open: true, start: "08:00", end: "19:00" },
    tue: { open: true, start: "08:00", end: "19:00" },
    wed: { open: true, start: "08:00", end: "19:00" },
    thu: { open: true, start: "08:00", end: "19:00" },
    fri: { open: true, start: "08:00", end: "20:00" },
    sat: { open: true, start: "08:00", end: "18:00" },
    sun: { open: false, start: "08:00", end: "18:00" },
  };
}

export function clinicWeek(): WeekGrid {
  return {
    mon: { open: true, start: "07:30", end: "17:00" },
    tue: { open: true, start: "07:30", end: "17:00" },
    wed: { open: true, start: "07:30", end: "17:00" },
    thu: { open: true, start: "07:30", end: "17:00" },
    fri: { open: true, start: "07:30", end: "17:00" },
    sat: { open: true, start: "08:00", end: "13:00" },
    sun: { open: false, start: "08:00", end: "13:00" },
  };
}

export function restaurantWeek(): WeekGrid {
  return {
    mon: { open: true, start: "11:00", end: "22:00" },
    tue: { open: true, start: "11:00", end: "22:00" },
    wed: { open: true, start: "11:00", end: "22:00" },
    thu: { open: true, start: "11:00", end: "22:00" },
    fri: { open: true, start: "11:00", end: "23:00" },
    sat: { open: true, start: "11:00", end: "23:00" },
    sun: { open: true, start: "12:00", end: "21:00" },
  };
}

export function shopWeek(): WeekGrid {
  return {
    mon: { open: true, start: "07:00", end: "20:00" },
    tue: { open: true, start: "07:00", end: "20:00" },
    wed: { open: true, start: "07:00", end: "20:00" },
    thu: { open: true, start: "07:00", end: "20:00" },
    fri: { open: true, start: "07:00", end: "20:00" },
    sat: { open: true, start: "07:00", end: "20:00" },
    sun: { open: true, start: "08:00", end: "18:00" },
  };
}

export function repairWeek(): WeekGrid {
  return {
    mon: { open: true, start: "08:00", end: "18:00" },
    tue: { open: true, start: "08:00", end: "18:00" },
    wed: { open: true, start: "08:00", end: "18:00" },
    thu: { open: true, start: "08:00", end: "18:00" },
    fri: { open: true, start: "08:00", end: "18:00" },
    sat: { open: true, start: "08:00", end: "16:00" },
    sun: { open: false, start: "08:00", end: "16:00" },
  };
}
