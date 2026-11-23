export type EventCategory = "river" | "historical" | "lantern";

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
      "จุดลอยกระทงยอดนิยมของคนกรุงเทพฯ แพลอยกระทงเรียงริมน้ำตั้งแต่สะพานพระราม 8 ถึงท่าน้ำสะพานพุทธ นอกจากนี้ยังมีจุดลอยและแสงไฟงามๆ ที่ ICONSIAM และอาซิอิก เดอะ ริเวอร์ฟรอนท์",
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
    dateDisplay: "24 พ.ย. 2026",
    description:
      "งานลอยกระทงและแห่เทียนพรรษา ประเพณีที่สืบทอดจากสมัยสุโขทัย มีการแห่กระทงเทียน ประกวดกระทง นางนพมาศ และโชว์แสงไฟท่ามกลางซากปรักหักพังโบราณ ถือเป็นงานลอยกระทงที่ขึ้นชื่อที่สุดแห่งหนึ่งของประเทศ",
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
    venue: "สวนสาธารณะสมเด็จพระศรีนครินทร์ ริมแม่น้ำปิง",
    date: FESTIVAL_DATE,
    dateDisplay: "24 พ.ย. 2026",
    description:
      "ลอยกระทงสายน้อยสายใหญ่ เอกลักษณ์ของจังหวัดตาก ปล่อยกระทงเทียนเรียงต่อกันเป็นสายยาวเหนือสายน้ำ สวยจนได้รับเลือกเป็นหนึ่งในงานมรดกวัฒนธรรมของไทย",
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
];

export const FESTIVAL_EVENTS: FestivalEvent[] = EVENTS.map((e) => ({
  ...e,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lng}`,
}));

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  river: "ริมแม่น้ำ",
  historical: "เมืองประวัติศาสตร์",
  lantern: "คู่กับยี่เป็ง",
};
