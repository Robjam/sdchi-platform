import { defineEventHandler } from 'h3';

// AIDEV-NOTE: Default business hours templates for new users
export default defineEventHandler(async (event) => {
  // AIDEV-NOTE: System default templates - these match the types from useCalendarDates.ts
  const defaultTemplates = {
    standard: {
      name: '平日 9:00-17:00',
      weeklyTemplate: {
        0: null, // Sunday - closed
        1: { periods: [{ start: '09:00', end: '17:00' }] }, // Monday
        2: { periods: [{ start: '09:00', end: '17:00' }] }, // Tuesday
        3: { periods: [{ start: '09:00', end: '17:00' }] }, // Wednesday
        4: { periods: [{ start: '09:00', end: '17:00' }] }, // Thursday
        5: { periods: [{ start: '09:00', end: '17:00' }] }, // Friday
        6: null  // Saturday - closed
      }
    },
    retail: {
      name: '小売店 10:00-20:00',
      weeklyTemplate: {
        0: { periods: [{ start: '12:00', end: '18:00' }] }, // Sunday
        1: { periods: [{ start: '10:00', end: '20:00' }] }, // Monday
        2: { periods: [{ start: '10:00', end: '20:00' }] }, // Tuesday
        3: { periods: [{ start: '10:00', end: '20:00' }] }, // Wednesday
        4: { periods: [{ start: '10:00', end: '20:00' }] }, // Thursday
        5: { periods: [{ start: '10:00', end: '20:00' }] }, // Friday
        6: { periods: [{ start: '10:00', end: '20:00' }] }, // Saturday
      }
    },
    restaurant: {
      name: 'レストラン 分割営業',
      weeklyTemplate: {
        0: null, // Sunday - closed
        1: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
        2: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
        3: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
        4: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
        5: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
        6: { periods: [{ start: '11:00', end: '14:00' }, { start: '17:00', end: '22:00' }] },
      }
    },
    always_open: {
      name: '24時間営業',
      weeklyTemplate: {
        0: { periods: [{ start: '00:00', end: '23:59' }] },
        1: { periods: [{ start: '00:00', end: '23:59' }] },
        2: { periods: [{ start: '00:00', end: '23:59' }] },
        3: { periods: [{ start: '00:00', end: '23:59' }] },
        4: { periods: [{ start: '00:00', end: '23:59' }] },
        5: { periods: [{ start: '00:00', end: '23:59' }] },
        6: { periods: [{ start: '00:00', end: '23:59' }] }
      }
    }
  };

  return {
    templates: defaultTemplates,
    recommended: 'standard' // Which template to suggest as default
  };
});