// ----------------------------------------------------------------------

const ROOTS = {
  FACTORY: '/factory',
};

/**
 * path ทั้งหมดของแอป — เพิ่ม route ใหม่ต้องเพิ่มที่นี่ก่อน
 * แล้วไป lazy import หน้าใน `routes/sections/index.tsx`
 */
export const paths = {
  demo: {
    root: '/theme',
  },
  // module ตัวอย่าง "ศูนย์ควบคุมการผลิต" — ดู src/sections/factory
  factory: {
    root: ROOTS.FACTORY,
    dispatch: `${ROOTS.FACTORY}/dispatch`,
    orders: `${ROOTS.FACTORY}/orders`,
    newOrder: `${ROOTS.FACTORY}/orders/new`,
    order: (id: string) => `${ROOTS.FACTORY}/orders/${id}`,
    live: `${ROOTS.FACTORY}/live`,
    sequence: `${ROOTS.FACTORY}/sequence`,
    inbox: `${ROOTS.FACTORY}/inbox`,
  },
  page404: '/404',
};
