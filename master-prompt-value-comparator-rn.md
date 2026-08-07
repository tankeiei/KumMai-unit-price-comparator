# Master Prompt: "คุ้มไหม?" — Unit Price Comparator (React Native / Expo Go)

ใช้เอกสารนี้เป็น system/master prompt ตัวแรกให้ agent (เช่น Antigravity) ใช้วางโครงสร้างโปรเจกต์ทั้งหมด ก่อนเริ่มเขียนโค้ดจริง

---

## 1. เป้าหมายโปรเจกต์

สร้างแอป **"คุ้มไหม?"** — เครื่องมือเทียบราคาต่อหน่วย (unit price comparator) ด้วย React Native ผ่าน Expo (managed workflow) ให้รันผ่าน **Expo Go** ได้ทันที ไม่ต้อง custom native module / ไม่ต้อง prebuild

ผู้ใช้กรอก ชื่อ / ราคา / จำนวน / หน่วย ของแต่ละตัวเลือก (ขั้นต่ำ 2 ตัวเลือก เพิ่มได้ไม่จำกัด) ระบบคำนวณราคาต่อหน่วยของแต่ละตัวเลือก จัดอันดับจากคุ้มสุด→แพงสุด และแสดงเปอร์เซ็นต์ที่แพงกว่าตัวเลือกที่คุ้มที่สุด

---

## 2. Tech Stack (บังคับ)

| ส่วน | เลือกใช้ | เหตุผล |
|---|---|---|
| Framework | Expo SDK ล่าสุด (managed workflow) | ต้องรันผ่าน Expo Go ได้ทันที |
| ภาษา | TypeScript | type-safe |
| Navigation | expo-router (file-based) | รองรับหน้าเพิ่มในอนาคต (ประวัติ/ตั้งค่า) แม้ตอนนี้มีหน้าเดียว |
| State | Zustand | เบา จัดการ array ของตัวเลือกได้ตรงไปตรงมา |
| Styling | NativeWind v4 (Tailwind for RN) + StyleSheet เสริมเฉพาะจุด | คุม design token ได้ง่าย ตรงกับเวอร์ชันเว็บเดิม |
| ฟอนต์ | `@expo-google-fonts/mitr`, `@expo-google-fonts/sarabun`, `@expo-google-fonts/jetbrains-mono` | รองรับภาษาไทย ตรงกับ mockup เว็บ |
| ไอคอน | `lucide-react-native` (+ `react-native-svg`) | ตรงชุดไอคอนเดิม (Plus, X, Trophy) |
| Local storage (เผื่ออนาคต) | `@react-native-async-storage/async-storage` | ไว้บันทึกประวัติการเทียบ ถ้าทำ scope เพิ่ม |

**ข้อจำกัดสำคัญ**: ห้ามเพิ่มไลบรารีที่ต้องเขียน native code เอง (custom native module) เพราะจะรันบน Expo Go ไม่ได้ ให้เช็คก่อนทุกครั้งว่าไลบรารีรองรับ Expo Go

---

## 3. โครงสร้างไฟล์

```
value-comparator/
├── app/
│   ├── _layout.tsx          # root layout, โหลดฟอนต์ + splash screen
│   └── index.tsx            # หน้าเดียวของ MVP: ComparatorScreen
├── src/
│   ├── components/
│   │   ├── PriceTagCard.tsx     # การ์ดป้ายราคาแขวน (ต่อ 1 ตัวเลือก)
│   │   ├── UnitChip.tsx         # ปุ่มหน่วยด่วน (ชิ้น/กรัม/มล. ฯลฯ)
│   │   ├── AddItemCard.tsx      # การ์ดปุ่ม "+ เพิ่มตัวเลือก"
│   │   ├── ResultReceipt.tsx    # กล่องผลลัพธ์สไตล์ใบเสร็จ
│   │   └── ResultRow.tsx        # แถวผลลัพธ์ 1 ตัวเลือก (อันดับ/badge)
│   ├── store/
│   │   └── comparatorStore.ts   # zustand store: items, actions
│   ├── utils/
│   │   └── calculations.ts      # คำนวณราคาต่อหน่วย, จัดอันดับ, %ส่วนต่าง
│   ├── theme/
│   │   ├── colors.ts
│   │   └── typography.ts
│   ├── constants/
│   │   └── units.ts             # UNIT_PRESETS
│   └── types/
│       └── index.ts             # ComparisonItem, ComputedItem
├── tailwind.config.js
├── babel.config.js
├── app.json
├── tsconfig.json
└── package.json
```

---

## 4. Design Tokens (สืบทอดจากเวอร์ชันเว็บ)

```ts
// src/theme/colors.ts
export const colors = {
  bgDeep: "#132219",
  bgPanel: "#1D3226",
  chalk: "#F3EFE3",
  chalkDim: "#9FB0A0",
  tagYellow: "#E8B23D",
  valueGreen: "#7FD9A8",
  costRed: "#E8735A",
  rule: "#3A5142",
  paper: "#F4EFE0",
  paperInk: "#22331F",
};
```

```ts
// src/theme/typography.ts
export const fonts = {
  display: "Mitr_600SemiBold",   // หัวข้อ
  body: "Sarabun_400Regular",    // เนื้อหาไทย
  mono: "JetBrainsMono_500Medium", // ตัวเลข/ราคา/เปอร์เซ็นต์
};
```

Concept ภาพ: พื้นหลังกระดานชอล์กเขียวเข้ม, การ์ดตัวเลือกเป็น "ป้ายราคาแขวน" (มีรู+เชือกจุดประด้านบน, เอียงสลับซ้าย-ขวาเล็กน้อย), ผลลัพธ์เป็นกล่องกระดาษใบเสร็จสีอ่อน คั่นแถวด้วยเส้นประ

---

## 5. Data Model

```ts
// src/types/index.ts
export type ComparisonItem = {
  id: string;
  name: string;
  price: string;   // เก็บเป็น string ตามค่าที่พิมพ์ใน input
  qty: string;
  unit: string;
};

export type ComputedItem = ComparisonItem & {
  unitPrice: number | null;
  valid: boolean;
};

export type RankedItem = ComputedItem & {
  rank: number;
  pctMoreExpensive: number; // 0 สำหรับอันดับ 1
};
```

---

## 6. ตรรกะคำนวณ — `src/utils/calculations.ts`

```
computeUnitPrice(item): price/qty ถ้า price>0 และ qty>0 ไม่งั้น null
rankItems(items): filter เฉพาะ valid → sort unitPrice น้อย→มาก
attachPct(ranked): pct = (unitPrice - best.unitPrice) / best.unitPrice * 100
buildSummary(best, worst): "ซื้อ X แทน Y ประหยัด Z% ต่อหน่วย"
```

เขียนเป็น pure function ทั้งหมด ไม่ผูกกับ React เพื่อเทสต์แยกได้

---

## 7. Component/Screen Breakdown

- **`app/index.tsx`** — ประกอบ layout: Hero text → รายการ `PriceTagCard` (map จาก store) + `AddItemCard` ท้ายแถว → `ResultReceipt`
- **`PriceTagCard`** — input: ชื่อ, ราคา, จำนวน, หน่วย + แถว `UnitChip` + ปุ่มลบ (ซ่อนถ้าเหลือ 2 การ์ด)
- **`ResultReceipt`** — รับ `RankedItem[]` แสดงเป็นลิสต์ เรียงอันดับ, badge "คุ้มที่สุด" (อันดับ 1) หรือ "+X%" (อันดับอื่น), สรุปประโยคท้าย
- ทุก component เป็น *presentational* รับ props เท่านั้น ดึง state จาก store เฉพาะใน `app/index.tsx`

State ทั้งหมดอยู่ใน `comparatorStore.ts` (zustand): `items`, `addItem()`, `updateItem(id, field, value)`, `removeItem(id)`

---

## 8. ขั้นตอนให้ Agent ทำตามลำดับ

1. `npx create-expo-app@latest value-comparator -t expo-template-blank-typescript`
2. ติดตั้ง dependency ตามข้อ 2 ทั้งหมด (nativewind, zustand, expo-router, expo-google-fonts ชุดที่ระบุ, lucide-react-native, react-native-svg, async-storage)
3. ตั้งค่า `babel.config.js` และ `tailwind.config.js` สำหรับ NativeWind v4
4. สร้างโครงสร้างโฟลเดอร์ตามข้อ 3 ทั้งหมด (ไฟล์เปล่าก่อนได้)
5. ใส่ theme tokens (ข้อ 4) และ types (ข้อ 5)
6. เขียน `calculations.ts` (ข้อ 6) แบบ pure function
7. เขียน `comparatorStore.ts`
8. เขียน component ทีละตัวตามข้อ 7 โดยเทียบดีไซน์กับเวอร์ชันเว็บที่มีอยู่ (การ์ดป้ายแขวน, ใบเสร็จ)
9. ประกอบ `app/_layout.tsx` ให้โหลดฟอนต์ผ่าน `useFonts` + กัน splash screen ค้างด้วย `expo-splash-screen`
10. ประกอบ `app/index.tsx` เป็นหน้าเดียวสมบูรณ์
11. รันทดสอบ `npx expo start` แล้วสแกน QR ด้วย Expo Go บนมือถือ ตรวจว่าไม่มี native module ที่ทำให้ Expo Go error

---

## 9. กติกาการเขียนโค้ด

- TypeScript strict, ไม่มี `any` เว้นแต่จำเป็นจริง ๆ
- ไฟล์ละ 1 หน้าที่ (single responsibility) ไม่ยัดทุกอย่างไว้ใน `index.tsx`
- ตั้งชื่อไฟล์/ตัวแปรตามที่กำหนดในเอกสารนี้ เพื่อให้ต่อยอด scope อื่นในอนาคตง่าย
- ไม่ต้อง comment อธิบายทุกบรรทัด — comment เฉพาะจุดที่ตรรกะไม่ตรงไปตรงมา
- ต้องรันผ่าน Expo Go ได้จริงโดยไม่ error ตั้งแต่ครั้งแรก

---

## 10. Scope ที่ยังไม่ทำใน MVP นี้ (กันไว้ให้ agent ไม่หลงทำเกิน)

ไม่ต้องทำในรอบแรก: บันทึกประวัติการเทียบ, แปลงหน่วยข้ามกัน (กก.↔กรัม), แชร์ผลลัพธ์เป็นรูป, ระบบผู้ใช้/login, multi-currency, dark/light toggle — ให้โครงสร้างเผื่อไว้เฉย ๆ (เช่น `app/` รองรับหลายหน้า, มี async-storage ติดตั้งแล้วแต่ยังไม่ใช้)
