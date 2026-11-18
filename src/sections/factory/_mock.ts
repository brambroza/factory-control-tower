// ----------------------------------------------------------------------
// Mock data ของ demo "ศูนย์ควบคุมการผลิต" — แทนที่ด้วยข้อมูลจาก API เมื่อเริ่มงานจริง
// ข้อความในไฟล์นี้คือ "ข้อมูล" (ชื่อลูกค้า, เครื่อง, เหตุการณ์) จึงไม่ผ่าน i18n
// ----------------------------------------------------------------------

export type Tone = 'primary' | 'info' | 'success' | 'warning' | 'error';

export type WorkOrderStatus = 'risk' | 'delayed' | 'booked';

export type WorkOrder = {
  id: string;
  customer: string;
  product: string;
  lots: number;
  status: WorkOrderStatus;
  icon: string;
  tone: Tone;
  from: string;
  fromTime: string;
  to: string;
  toTime: string;
  owner: string;
  risk: 'low' | 'medium' | 'high';
  note?: string;
};

export const CURRENT_USER = {
  name: 'สุดา',
  fullName: 'สุดา เบญจรงค์',
  role: 'ผู้จัดการวางแผนการผลิต',
};

export const FOCUS_ORDER = {
  id: 'WO-48291',
  customer: 'แอคมี รีเทล',
  product: 'ฝาครอบ ABS รุ่น A-14',
  lots: 14,
  machine: 'M-07',
  machineName: 'เครื่องฉีด 350 ตัน',
  altMachine: 'M-12',
  operator: 'สมชาย ใจดี',
  operatorMeta: 'กะเช้า · ทำงานแล้ว 6 ชม. 12 น.',
  window: '15:00–15:30',
  etaNow: '15:49',
  etaAlt: '15:18',
  delayMin: 47,
  savedMin: 31,
  cycle: '38 วิ/ชิ้น',
  cycleNote: 'ช้ากว่าแผน 24%',
  oee: '64%',
  oeeNote: 'เป้า 78%',
  moldTemp: '34.1°C',
  moldTempNote: 'ตั้งไว้ 34°C',
  output: '14 / 26 ล็อต',
  outputNote: '8,420 ชิ้น',
  shiftLeft: '4 ชม. 48 น.',
  shiftNote: 'พักถัดไป 13:46',
  po: '77341 · 5531',
  start: '09:14 · สถานีอบเม็ด 4',
  mold: 'MD-5531 · 4 คาวิตี้',
};

export const KPIS = [
  {
    key: 'open',
    value: 1284,
    chip: '+8.4%',
    tone: 'success' as Tone,
    note: 'เทียบ 1,184 เสาร์ก่อน',
  },
  { key: 'running', value: 842, chip: '65.6%', tone: undefined, note: '214 เครื่องกำลังเดิน' },
  { key: 'done', value: 612, chip: '+11%', tone: 'success' as Tone, note: 'ตามเป้า 1,040' },
  { key: 'late', value: 37, chip: '+6', tone: 'error' as Tone, note: 'ตั้งแต่ 09:00' },
  { key: 'risk', value: 18, chip: 'ai', tone: 'primary' as Tone, note: 'อาจส่งไม่ทันกำหนด' },
  {
    key: 'exception',
    value: 24,
    chip: 'critical',
    tone: 'error' as Tone,
    note: 'สูง 7 · เปิดอยู่ 13',
  },
];

export const STAGES = [
  { label: 'เตรียมวัตถุดิบ', time: '09:48', at: 0 },
  { label: 'อบเม็ด', time: '10:41', at: 22 },
  { label: 'ฉีด M-07', time: 'รอบช้า 24%', at: 50, slow: true },
  { label: 'ตัดแต่ง', time: '12:55', at: 80 },
  { label: 'QC · แพ็ค', time: 'ETA 15:49', at: 100 },
];

export const BRIEF_CAUSES = [
  { count: '07', label: 'เครื่องฉีด M-07 และ M-09 รอบช้า', weight: 78 },
  { count: '05', label: 'คิวอบเม็ดค้างที่สถานี 4', weight: 52 },
  { count: '04', label: 'ตารางกะพนักงานชนกัน', weight: 40 },
  { count: '02', label: 'รอยืนยันวัตถุดิบเข้า', weight: 22 },
];

export const BRIEF_PROPOSALS = [
  {
    icon: 'solar:transfer-horizontal-bold',
    label: 'ย้ายเครื่อง 5 งาน',
    note: 'ประหยัด 2 ชม. 40 น.',
  },
  { icon: 'solar:users-group-rounded-bold', label: 'สลับคิว 3 งาน', note: 'แก้กะชนกัน' },
  { icon: 'solar:plain-bold', label: 'แจ้งลูกค้า 4 ราย', note: 'ร่างข้อความแล้ว' },
];

export const WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-48291',
    customer: 'แอคมี รีเทล',
    product: 'ฝาครอบ ABS A-14',
    lots: 14,
    status: 'risk',
    icon: 'solar:box-bold',
    tone: 'primary',
    from: 'ฉีด M-07',
    fromTime: '09:14',
    to: 'ส่งมอบ QC',
    toTime: '15:49',
    owner: 'สมชาย ใจดี',
    risk: 'medium',
  },
  {
    id: 'WO-49281',
    customer: 'แอตลาส โฮมกู๊ดส์',
    product: 'ถาด PP 8 ช่อง',
    lots: 8,
    status: 'delayed',
    icon: 'solar:home-2-bold',
    tone: 'warning',
    from: 'ฉีด M-09',
    fromTime: '10:05',
    to: 'ส่งมอบ QC',
    toTime: '13:05',
    owner: 'วิภา รุ่งเรือง',
    risk: 'high',
  },
  {
    id: 'WO-49305',
    customer: 'นอร์ทสตาร์ ซัพพลาย',
    product: 'ข้อต่อ PA66',
    lots: 22,
    status: 'booked',
    icon: 'solar:star-bold',
    tone: 'info',
    from: 'อบเม็ด 4',
    fromTime: '11:30',
    to: 'ส่งมอบ QC',
    toTime: '14:40',
    owner: '',
    risk: 'low',
    note: 'ยังไม่จ่ายงาน · AI จับคู่ได้ 2',
  },
  {
    id: 'WO-49311',
    customer: 'เวอร์เท็กซ์ คอมเมิร์ซ',
    product: 'กล่อง ABS 12 นิ้ว',
    lots: 12,
    status: 'booked',
    icon: 'solar:bolt-bold',
    tone: 'success',
    from: 'อบเม็ด 2',
    fromTime: '13:00',
    to: 'ส่งมอบ QC',
    toTime: '16:20',
    owner: '',
    risk: 'low',
    note: 'ยังไม่จ่ายงาน · AI จับคู่ได้ 3',
  },
];

export const AGENT_ACTIONS = [
  {
    no: '01',
    title: 'ย้าย WO-48291 ไปเครื่อง M-12',
    detail: 'M-07 รอบช้า 24% เพราะแม่พิมพ์ร้อน ย้ายแล้วยังส่งทันกำหนด',
    chip: 'เร็วขึ้น 31 นาที',
    primary: true,
  },
  {
    no: '02',
    title: 'ย้าย WO-49281 ให้ ธนากร (กะบ่าย)',
    detail: 'วิภามีนัดเปลี่ยนแม่พิมพ์ 13:30 ที่ M-09 ซึ่งชนกับงานนี้',
    chip: 'ประหยัด 22 นาที',
  },
  {
    no: '03',
    title: 'จ่าย WO-49305 ให้ ธนากร',
    detail: 'อยู่ห่างสถานีอบเม็ด 4 แค่ 40 ม. และเหลือชั่วโมงทำงาน 7 ชม. 40 น.',
    chip: 'เริ่มตรงเวลา',
  },
];

export const AUTO_HANDLED = [
  { label: 'ปักธงงานล่าช้า 7 งาน และเปิดข้อยกเว้น', time: '10:38' },
  { label: 'ร่างแจ้ง ETA ให้ลูกค้า 4 ราย', time: '10:36' },
  { label: 'ตรวจชั่วโมงทำงาน 212 คน ไม่พบกะชนกัน', time: '10:30' },
];

export type TimelineBlock = {
  start: number;
  end: number;
  label: string;
  tone: 'done' | 'primary' | 'error' | 'ghost';
};

export const TIMELINE_HOURS = [8, 10, 12, 14, 16];

export const TIMELINE_NOW = 11.97;

export const TIMELINE_ROWS: { name: string; sub: string; blocks: TimelineBlock[] }[] = [
  {
    name: 'M-07 · สมชาย',
    sub: 'WO-48291',
    blocks: [
      { start: 8, end: 9.6, label: '48117', tone: 'done' },
      { start: 9.9, end: 15.1, label: '48291', tone: 'primary' },
      { start: 15.15, end: 16, label: '+47 น.', tone: 'error' },
    ],
  },
  {
    name: 'M-09 · วิภา',
    sub: 'WO-49281',
    blocks: [
      { start: 8, end: 10, label: '49102', tone: 'done' },
      { start: 10.2, end: 13.1, label: '49281', tone: 'error' },
      { start: 13.5, end: 15.4, label: 'ย้ายงาน', tone: 'ghost' },
    ],
  },
  {
    name: 'M-12 · ธนากร',
    sub: 'ว่าง',
    blocks: [
      { start: 8, end: 9.4, label: '48874', tone: 'done' },
      { start: 10.6, end: 12.6, label: '49305', tone: 'ghost' },
      { start: 13, end: 15.2, label: '48291', tone: 'ghost' },
    ],
  },
];

export const ORDER_EVENTS = [
  {
    time: '09:14',
    title: 'เริ่มฉีดที่ M-07',
    by: 'สมชาย ใจดี',
    tone: 'success' as Tone,
    icon: 'solar:check-circle-bold',
  },
  {
    time: '11:32',
    title: 'ตรวจพบรอบการผลิตช้า',
    by: 'Planning Agent',
    tone: 'error' as Tone,
    icon: 'solar:danger-triangle-bold',
  },
  {
    time: '11:41',
    title: 'เสนอให้ย้ายไปเครื่อง M-12',
    by: 'Planning Agent',
    tone: 'primary' as Tone,
    icon: 'solar:transfer-horizontal-bold',
  },
  {
    time: '11:58',
    title: 'อนุมัติการย้ายเครื่อง',
    by: 'สุดา เบญจรงค์',
    tone: 'success' as Tone,
    icon: 'solar:shield-check-bold',
  },
];

export const LOT_SLOTS = Array.from({ length: 26 }, (_, index) => ({
  no: index + 1,
  state: index < 14 ? 'done' : index === 14 ? 'running' : 'wait',
}));

export const SHARE_CONTACTS = [
  { name: 'เอกชัย โคล', meta: 'ผู้จัดการรับสินค้า · ekachai@acmeretail.co.th', checked: true },
  { name: 'โซอี้ เทิร์นเนอร์', meta: 'ฝ่ายบัญชีเจ้าหนี้ · zoe@acmeretail.co.th', checked: false },
];

export const SHARE_LINK = 'track.goalong-factory.co.th/s/48291-k7q';

export type MachineLive = {
  id: string;
  name: string;
  operator: string;
  order: string;
  speed: string;
  status: string;
  tone: Tone | 'default';
  place: string;
  progress: number;
  x: number;
  y: number;
};

export const MACHINES_LIVE: MachineLive[] = [
  {
    id: 'M-07',
    name: 'สมชาย ใจดี',
    operator: 'M-07',
    order: 'WO-48291',
    speed: '38 วิ/ชิ้น',
    status: 'ช้ากว่าแผน 24%',
    tone: 'error',
    place: 'โซนฉีด A',
    progress: 62,
    x: 205,
    y: 115,
  },
  {
    id: 'M-09',
    name: 'วิภา รุ่งเรือง',
    operator: 'M-09',
    order: 'WO-49281',
    speed: '0 วิ/ชิ้น',
    status: 'หยุดรอ 42 นาที',
    tone: 'error',
    place: 'โซนฉีด A',
    progress: 18,
    x: 100,
    y: 150,
  },
  {
    id: 'M-12',
    name: 'ธนากร ศรีสุข',
    operator: 'M-12',
    order: 'WO-48874',
    speed: '26 วิ/ชิ้น',
    status: 'ตามแผน',
    tone: 'success',
    place: 'โซนฉีด B',
    progress: 71,
    x: 325,
    y: 225,
  },
  {
    id: 'T-03',
    name: 'อารีย์ วงศ์ทอง',
    operator: 'T-03',
    order: 'WO-48977',
    speed: '14 วิ/ชิ้น',
    status: 'ใกล้เสร็จ',
    tone: 'success',
    place: 'โซนตัดแต่ง',
    progress: 94,
    x: 455,
    y: 300,
  },
  {
    id: 'D-04',
    name: 'ปกรณ์ มีสุข',
    operator: 'D-04',
    order: 'WO-49033',
    speed: '80°C',
    status: 'อุณหภูมิสูง 86.8°C',
    tone: 'warning',
    place: 'สถานีอบเม็ด 4',
    progress: 55,
    x: 170,
    y: 320,
  },
];

export const LIVE_FILTERS = [
  { key: 'all', count: '1,284' },
  { key: 'machines', count: '214' },
  { key: 'orders', count: '842' },
  { key: 'late', count: '37' },
  { key: 'risk', count: '18' },
  { key: 'done', count: '612' },
];

export const NEW_ORDER_AI = {
  file: 'PO-77341.pdf',
  customer: 'เวอร์เท็กซ์ คอมเมิร์ซ',
  contact: 'รัชนี อดัมส์',
  customerPo: '77341-118',
  billTo: 'เครดิต 30 วัน',
  product: 'กล่อง ABS 12 นิ้ว',
  qty: '12,000',
  material: 'ABS PA-757 สีดำ',
  machine: 'M-12 · 350 ตัน',
  mold: 'MD-7741 · 2 คาวิตี้',
  startDate: 'จ. 5 ต.ค.',
  startWindow: '08:00 – 10:00',
  dueDate: 'จ. 5 ต.ค.',
  dueWindow: '13:00 – 15:00',
  note: 'โทรแจ้งฝ่ายรับสินค้าก่อนส่ง 30 นาที ไม่ต้องใช้รถยก',
};

export const NEW_ORDER_OPTIONS = {
  customer: ['เวอร์เท็กซ์ คอมเมิร์ซ', 'แอคมี รีเทล', 'แอตลาส โฮมกู๊ดส์'],
  contact: ['รัชนี อดัมส์', 'เอกชัย โคล'],
  billTo: ['เครดิต 30 วัน', 'เครดิต 60 วัน', 'เงินสด'],
  machine: ['M-12 · 350 ตัน', 'M-07 · 350 ตัน', 'M-09 · 250 ตัน'],
  startDate: ['จ. 5 ต.ค.', 'อ. 6 ต.ค.'],
  dueDate: ['จ. 5 ต.ค.', 'อ. 6 ต.ค.'],
};

export const ASSIGN_MATCHES = [
  {
    id: 'WO-49305',
    route: 'อบเม็ด 4 → M-12',
    who: 'ลูกา เฮอร์นันเดซ',
    why: 'ห่างสถานี 40 ม. · เหลือ 7 ชม. 40 น.',
    fit: 96,
    ok: true,
  },
  {
    id: 'WO-49412',
    route: 'อบเม็ด 2 → M-07',
    who: 'ไมเคิล ทอมป์สัน',
    why: 'ว่าง 11:30 ที่โซนฉีด A',
    fit: 94,
    ok: true,
  },
  {
    id: 'WO-49318',
    route: 'อบเม็ด 1 → M-03',
    who: 'เอมิลี่ โรดริเกซ',
    why: 'อยู่ที่ M-03 แล้ว · เหลือ 5 ชม. 10 น.',
    fit: 91,
    ok: true,
  },
  {
    id: 'WO-49322',
    route: 'อบเม็ด 4 → M-05',
    who: 'อังเดร วิลเลียมส์',
    why: 'กลับถึงโซนฉีด A 13:10',
    fit: 88,
    ok: true,
  },
  {
    id: 'WO-49311',
    route: 'อบเม็ด 2 → M-12',
    who: 'ดาร์เนล ไพรซ์',
    why: 'ต้องจองคิวแม่พิมพ์ MD-7741 ก่อน',
    fit: 0,
    ok: false,
  },
];

export type SequenceJob = {
  id: string;
  name: string;
  window: string;
  eta: string;
  tone: Tone;
  icon: string;
  tag?: string;
  x: number;
  y: number;
};

/** ลำดับตามที่ AI จัดแล้ว — x/y คือพิกัดบน "แผนที่ changeover" (ยิ่งใกล้กัน ยิ่งเปลี่ยนรุ่นเร็ว) */
export const SEQUENCE_JOBS: SequenceJob[] = [
  {
    id: 'j1',
    name: 'แอคมี · ฝาครอบ A-14 ดำ',
    window: '07:00–09:00',
    eta: '07:24',
    tone: 'primary',
    icon: 'solar:box-bold',
    tag: 'เลื่อนขึ้น 1',
    x: 22,
    y: 78,
  },
  {
    id: 'j2',
    name: 'เวอร์เท็กซ์ · กล่อง 12" ดำ',
    window: '07:30–10:00',
    eta: '07:52',
    tone: 'success',
    icon: 'solar:bolt-bold',
    x: 21,
    y: 68,
  },
  {
    id: 'j3',
    name: 'บลูพีค · ฝาปิด เทาเข้ม',
    window: '09:00–11:00',
    eta: '08:31',
    tone: 'info',
    icon: 'solar:waterdrops-bold',
    x: 14,
    y: 52,
  },
  {
    id: 'j4',
    name: 'โกลเด้นสเตท · ถาด เทา',
    window: '09:00–11:00',
    eta: '09:05',
    tone: 'warning',
    icon: 'solar:sun-2-bold',
    tag: 'เลื่อนขึ้น 1',
    x: 22,
    y: 43,
  },
  {
    id: 'j5',
    name: 'แอตลาส · ถาด 8 ช่อง เทาอ่อน',
    window: '09:30–12:00',
    eta: '09:34',
    tone: 'warning',
    icon: 'solar:home-2-bold',
    x: 27,
    y: 36,
  },
  {
    id: 'j6',
    name: 'นอร์ทสตาร์ · ข้อต่อ ขาว',
    window: '10:00–12:00',
    eta: '10:12',
    tone: 'info',
    icon: 'solar:star-bold',
    x: 30,
    y: 16,
  },
  {
    id: 'j7',
    name: 'ซัมมิท · ฝาครอบ ขาว',
    window: '10:30–12:30',
    eta: '10:48',
    tone: 'error',
    icon: 'solar:flag-bold',
    x: 45,
    y: 28,
  },
  {
    id: 'j8',
    name: 'ฮาร์เบอร์ · กล่อง ใส',
    window: '11:00–13:00',
    eta: '11:26',
    tone: 'primary',
    icon: 'solar:ship-bold',
    tag: 'เคยช้า · แก้แล้ว',
    x: 55,
    y: 35,
  },
  {
    id: 'j9',
    name: 'แอคมี · กล่อง ใส',
    window: '12:00–14:00',
    eta: '12:05',
    tone: 'primary',
    icon: 'solar:box-bold',
    x: 67,
    y: 44,
  },
  {
    id: 'j10',
    name: 'เวอร์เท็กซ์ · ฝา ฟ้า',
    window: '12:30–14:30',
    eta: '12:44',
    tone: 'success',
    icon: 'solar:bolt-bold',
    x: 61,
    y: 58,
  },
  {
    id: 'j11',
    name: 'แอตลาส · ถาด น้ำเงิน',
    window: '13:00–15:00',
    eta: '13:18',
    tone: 'warning',
    icon: 'solar:home-2-bold',
    x: 50,
    y: 63,
  },
];

/** ลำดับเดิมก่อน AI จัด (index ของ SEQUENCE_JOBS) */
export const SEQUENCE_ORIGINAL = [1, 0, 2, 4, 3, 5, 6, 7, 9, 8, 10];

export const SEQUENCE_HOME = { x: 27, y: 82 };

export const SEQUENCE_METRICS = [
  { key: 'changeover', current: '86 นาที', optimized: '79.8 นาที', change: '−7.2%' },
  { key: 'runtime', current: '6 ชม. 24 น.', optimized: '5 ชม. 58 น.', change: '−26 นาที' },
  { key: 'scrap', current: '96.4 กก.', optimized: '89.1 กก.', change: '−7.3 กก.' },
  { key: 'onTime', current: '9 จาก 11', optimized: '11 จาก 11', change: '+2' },
  { key: 'energy', current: '118 kWh', optimized: '109 kWh', change: '−7.6%' },
];

export const INBOX_THREADS = [
  {
    id: 't1',
    name: 'โธมัส วอลช์',
    topic: 'ขอเลื่อนส่ง WO-48117',
    preview: 'ทีมเราพร้อมรับของบ่ายนี้ครับ',
    time: '11:52',
    agent: false,
  },
  {
    id: 't2',
    name: 'ศรัณยา มิตเชลล์',
    topic: 'ยืนยันเวลา WO-48291',
    preview: 'ถ้าถึงหลัง 15:30 เราต้องเลื่อนไป…',
    time: '11:41',
    agent: true,
  },
  {
    id: 't3',
    name: 'เอมม่า มอร์แกน',
    topic: 'ใบรับรองวัตถุดิบ',
    preview: 'รบกวนส่ง COA ล็อตล่าสุดด้วยค่ะ',
    time: '09:58',
    agent: true,
  },
  {
    id: 't4',
    name: 'กฤษณ์ ฮาร์เบอร์',
    topic: 'ใบเสนอราคา WO-48540',
    preview: 'ขอบคุณครับ จะแจ้งกลับพรุ่งนี้เช้า',
    time: '09:44',
    agent: false,
  },
  {
    id: 't5',
    name: 'วรรณา บราวน์',
    topic: 'นัดตรวจโรงงาน',
    preview: 'ขอนัดวันพฤหัสรอบเช้าได้ไหมคะ',
    time: 'เมื่อวาน',
    agent: false,
  },
  {
    id: 't6',
    name: 'ทากะ โมริตะ',
    topic: 'ตัวอย่างชิ้นงาน',
    preview: 'ได้รับตัวอย่างแล้ว สีตรงตามสเปก',
    time: 'เมื่อวาน',
    agent: false,
  },
];

export const INBOX_MESSAGES = [
  {
    from: 'them',
    text: 'รบกวนยืนยันเวลาส่งมอบใหม่ของ WO-48291 ได้ไหมคะ ทีมรับสินค้าของเราเลิกงาน 15:30',
    meta: '11:30',
  },
  {
    from: 'us',
    text: 'สวัสดีค่ะคุณศรัณยา WO-48291 คาดว่าจะเสร็จ 15:49 เนื่องจากเครื่อง M-07 รอบช้า เรากำลังตรวจทางเลือกย้ายเครื่องและจะยืนยันภายใน 15 นาที',
    meta: 'Customer Agent · อนุมัติโดย ปรียา · 11:33',
  },
  { from: 'agent', text: 'Planning Agent เสนอย้ายไป M-12 · ETA ใหม่ 15:18', meta: '' },
  {
    from: 'them',
    text: 'ขอบคุณค่ะ ถ้าถึงหลัง 15:30 เราต้องเลื่อนไปพรุ่งนี้ 8 โมงเช้า',
    meta: '11:41',
  },
];

export const INBOX_DRAFT =
  'เรียนคุณศรัณยา การย้ายไปเครื่อง M-12 ได้รับอนุมัติแล้ว WO-48291 จะเสร็จและส่งมอบ 15:18 น. อยู่ในช่วงรับสินค้า 15:00–15:30 ของท่าน';

export const INBOX_REPLIES = [
  'ยืนยันส่งมอบ 15:18',
  'เสนอส่งพรุ่งนี้ 08:00 แทน',
  'แชร์ลิงก์ติดตามสถานะ',
];

export const NEW_MESSAGE = {
  to: 'รัชนี อดัมส์ · เวอร์เท็กซ์ คอมเมิร์ซ',
  about: 'WO-49412 · จ. 5 ต.ค.',
  subject: 'ยืนยันแผนผลิต WO-49412 วันจันทร์ที่ 5 ต.ค.',
  body: 'เรียนคุณรัชนี\n\nWO-49412 จัดเข้าแผนผลิตวันจันทร์ 08:00 น. ที่เครื่อง M-12 เนื่องจากฝ่ายรับสินค้าของท่านปิด 14:30 น. เราจึงกำหนดส่งมอบช่วง 13:00–14:30 น.\n\nท่านจะได้รับลิงก์ติดตามสถานะเมื่อเริ่มผลิต',
  tones: ['กระชับ', 'อุ่นใจ', 'แนบใบยืนยันราคา'],
};

export const APPROVE_IMPACT = [
  { key: 'expected', value: 'เสร็จเร็วขึ้น 31 นาที' },
  { key: 'extra', value: 'เปลี่ยนแม่พิมพ์ +12 นาที · ของเสียตั้งเครื่อง ~6.8 กก.' },
  { key: 'customer', value: 'ไม่กระทบช่วงรับสินค้า 15:00–15:30' },
  { key: 'operator', value: 'ธนากร ศรีสุข · เหลือเวลากะ 4 ชม. 48 น.' },
];

export const ORDER_AGENT_NOTE = {
  what: 'รอบการผลิตที่ M-07 ช้าลง 24% หลัง 11:00 ทำให้คาดว่าจะเสร็จ 15:49',
  why: 'อุณหภูมิแม่พิมพ์แกว่งและคิวอบเม็ดสถานี 4 ค้าง 24 นาที',
  recommendation: 'ย้ายล็อตที่เหลือไป M-12 ซึ่งว่างและใช้แม่พิมพ์ร่วมกันได้ ลูกค้าได้รับแจ้งแล้ว',
};

export const SHARE_VISIBILITY = [
  { key: 'status', on: true },
  { key: 'temp', on: true },
  { key: 'operator', on: false },
];

export const SEQUENCE_META = {
  id: 'R-1042',
  title: 'M-12 · รอบเช้า',
  meta: 'พรุ่งนี้ 4 ต.ค. · 11 งาน · เริ่ม 07:00',
  operator: 'เอมิลี่ โรดริเกซ',
  operatorMeta: 'กะเช้า · ว่าง 9 ชม. 40 น.',
  end: 'ล้างเครื่อง · ปิดรอบ',
  endTime: '14:41',
  currentTotal: '86 นาที',
  optimizedTotal: '79.8 นาที',
  hint: 'สลับ เวอร์เท็กซ์ กับ แอคมี เลี่ยงการล้างสีช่วง 07:45 และจัด ซัมมิท ก่อน แอคมี ทำให้ ฮาร์เบอร์ ทันช่วง 11:00',
};

export const NEW_ORDER_OPERATOR = {
  name: 'ไมเคิล ทอมป์สัน',
  short: 'ไมเคิล',
  meta: 'M-12 · กะเช้า · ว่าง 11:30',
  onTime: '98.9%',
  cost: '฿6.07',
};

export const INBOX_CONTACT = {
  threadId: 't2',
  name: 'ศรัณยา มิตเชลล์',
  role: 'VP Supply Chain · แอคมี รีเทล · อีเมล',
};

export const INBOX_CUSTOMER = [
  { key: 'account', value: 'แอคมี รีเทล · Enterprise' },
  { key: 'prefers', value: 'อีเมลก่อน 14:00' },
  { key: 'health', value: '86 / 100', tone: 'success' as Tone },
  { key: 'threads', value: '2' },
];

export const INBOX_SUMMARY =
  'คุณศรัณยาต้องการรับของก่อน 15:30 หรือเลื่อนเป็น 08:00 พรุ่งนี้ การย้ายเครื่องทำให้ทันช่วงเวลา ร่างข้อความจึงยืนยัน 15:18';
