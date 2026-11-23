export type EventCategory = "river" | "historical" | "lantern" | "sea";

export interface FestivalEvent {
  id: string;
  city: string;
  cityEn: string;
  venue: string;
  date: string;
  dateDisplay: string;
  description: string;
  category: EventCategory;
  lat: number;
  lng: number;
  mapUrl: string;
  /** true = กำหนดการยังไม่แน่นอนหรือแตกต่างจากวันลอยกระทงหลัก ควรตรวจสอบกับผู้จัดงาน */
  verifyDates?: boolean;
}

export const FESTIVAL_DATE = "2026-11-24";

export const FESTIVAL_DATE_DISPLAY = "วันอังคารที่ 24 พฤศจิกายน 2026";

const EVENTS: Omit<FestivalEvent, "mapUrl">[] = [
  {
    id: "bangkok",
    city: "กรุงเทพฯ",
    cityEn: "Bangkok",
    venue: "ริมแม่น้ำเจ้าพระยา",
    date: FESTIVAL_DATE,
    dateDisplay: "24 พ.ย. 2026",
    description:
      "จุดลอยกระทงยอดนิยมของคนกรุงเทพฯ แพลอยกระทงเรียงริมน้ำตั้งแต่สะพานพระราม 8 ถึงท่าน้ำสะพานพุทธ นอกจากนี้ยังมีจุดลอยและแสงไฟงามๆ ที่ ICONSIAM และเอเชียทีค เดอะ ริเวอร์ฟรอนท์",
    category: "river",
    lat: 13.7589,
    lng: 100.4977,
  },
  {
    id: "sukhothai",
    city: "สุโขทัย",
    cityEn: "Sukhothai",
    venue: "อุทยานประวัติศาสตร์สุโขทัย",
    date: FESTIVAL_DATE,
    dateDisplay: "15–24 พ.ย. 2026",
    description:
      "งานประเพณีลอยกระทง เผาเทียน เล่นไฟ จัดที่อุทยานประวัติศาสตร์สุโขทัย ปี 2026 จัดต่อเนื่อง 10 วัน (15–24 พ.ย.) มีแสง สี เสียง ขบวนแห่ประเพณี และตลาดวิถีชีวิต ท่ามกลางโบราณสถานเมืองมรดกโลก ถือเป็นงานลอยกระทงที่ขึ้นชื่อที่สุดแห่งหนึ่งของประเทศ",
    category: "historical",
    lat: 17.0209,
    lng: 99.7036,
  },
  {
    id: "chiangmai",
    city: "เชียงใหม่",
    cityEn: "Chiang Mai",
    venue: "ริมแม่น้ำปิง บริเวณวัดสันป่าตอง",
    date: FESTIVAL_DATE,
    dateDisplay: "24 พ.ย. 2026",
    description:
      "เชียงใหม่จัดลอยกระทงควบคู่กับประเพณียี่เป็ง คืนที่ทั้งเมืองปล่อยโคมลอยฟ้าขึ้นเต็มท้องฟ้า พร้อมลอยกระทงริมแม่น้ำปิง เป็นภาพที่คนจดจำไปทั้งชีวิต",
    category: "lantern",
    lat: 18.7883,
    lng: 98.9853,
  },
  {
    id: "tak",
    city: "ตาก",
    cityEn: "Tak",
    venue: "ลานกระทงสาย เชิงสะพานสมโภชกรุงรัตนโกสินทร์ 200 ปี ริมแม่น้ำปิง",
    date: FESTIVAL_DATE,
    dateDisplay: "ช่วงต้นเดือน พ.ย. (รอประกาศ)",
    verifyDates: true,
    description:
      "ประเพณีลอยกระทงสายไหลประทีป 1,000 ดวง เอกลักษณ์ของจังหวัดตาก ปล่อยกระทงกะลาต่อกันเป็นสายยาวไหลไปตามแม่น้ำปิง เพื่อขอขมาพระแม่คงคา ปี 2025 จัดวันที่ 2–5 พ.ย. ส่วนกำหนดการปี 2026 ควรตรวจสอบกับ ททท. สำนักงานตาก",
    category: "river",
    lat: 16.8811,
    lng: 99.1215,
  },
  {
    id: "ayutthaya",
    city: "พระนครศรีอยุธยา",
    cityEn: "Ayutthaya",
    venue: "ริมแม่น้ำลพบุรี บริเวณวัดไชยวัฒนา",
    date: FESTIVAL_DATE,
    dateDisplay: "24 พ.ย. 2026",
    description:
      "ลอยกระทงท่ามกลางบรรยากาศเมืองเก่า มีการประกวดนางนพมาศ โชว์แสงไฟ และกระทงที่ทำจากวัสดุธรรมชาติริมแม่น้ำลพบุรี",
    category: "historical",
    lat: 14.3532,
    lng: 100.5776,
  },
  {
    id: "phuket",
    city: "ภูเก็ต",
    cityEn: "Phuket",
    venue: "หาดป่าตอง",
    date: FESTIVAL_DATE,
    dateDisplay: "24 พ.ย. 2026",
    verifyDates: true,
    description:
      "ลอยกระทงริมทะเลอันดามัน นักท่องเที่ยวและคนท้องถิ่นลอยกระทงและปล่อยโคมกันริมชายหาด ควรเลือกกระทงวัสดุธรรมชาติและเก็บขยะบนชายหาดกลับด้วย กิจกรรมและจุดจัดงานแต่ละปีอาจเปลี่ยน ตรวจสอบกับเทศบาลก่อนไป",
    category: "sea",
    lat: 7.8961,
    lng: 98.2969,
  },
  {
    id: "pattaya",
    city: "พัทยา ชลบุรี",
    cityEn: "Pattaya",
    venue: "ชายหาดพัทยา",
    date: FESTIVAL_DATE,
    dateDisplay: "24 พ.ย. 2026",
    verifyDates: true,
    description:
      "ลอยกระทงริมอ่าวพัทยา บรรยากาศคึกคักตลอดแนวชายหาด เหมาะกับคนที่อยากลอยกระทงริมทะเลใกล้กรุงเทพฯ กิจกรรมและจุดจัดงานแต่ละปีอาจเปลี่ยน ตรวจสอบกับเมืองพัทยาก่อนไป",
    category: "sea",
    lat: 12.9333,
    lng: 100.8825,
  },
  {
    id: "khonkaen",
    city: "ขอนแก่น",
    cityEn: "Khon Kaen",
    venue: "บึงแก่นนคร",
    date: FESTIVAL_DATE,
    dateDisplay: "24 พ.ย. 2026",
    verifyDates: true,
    description:
      "ตัวแทนลอยกระทงของภาคอีสาน ลอยกระทงริมบึงกลางเมือง ใกล้ตัวเมืองเดินทางสะดวก ควรตรวจสอบกำหนดการและกิจกรรมกับเทศบาลนครขอนแก่นก่อนไป",
    category: "river",
    lat: 16.4189,
    lng: 102.8236,
  },
];

export const FESTIVAL_EVENTS: FestivalEvent[] = EVENTS.map((e) => ({
  ...e,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lng}`,
}));

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  river: "ริมแม่น้ำ",
  historical: "เมืองประวัติศาสตร์",
  lantern: "คู่กับยี่เป็ง",
  sea: "ริมทะเล",
};
