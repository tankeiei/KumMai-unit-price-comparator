# 🛒 แอป "คุ้มไหม?" — Unit Price Comparator

เครื่องมือเปรียบเทียบราคาต่อหน่วย (Unit Price Comparator) พัฒนาด้วย **React Native** ผ่าน **Expo (Managed Workflow)** ออกแบบมาเพื่อช่วยตัดสินใจซื้อสินค้าให้ได้ความคุ้มค่าที่สุด คำนวณรวดเร็ว พร้อมแสดงเปอร์เซ็นต์ความคุ้มค่าและจัดอันดับให้อัตโนมัติ สามารถรันผ่าน **Expo Go** บนมือถือได้ทันทีโดยไม่ต้อง Build Native Code

---

## 🌟 ฟีเจอร์หลัก (Features)

- 🏷️ **เปรียบเทียบหลายตัวเลือก**: เพิ่มหรือลดตัวเลือกเทียบราคาได้ไม่จำกัด (ขั้นต่ำ 2 ตัวเลือก)
- ⚡ **ชิปหน่วยด่วน (Unit Chips)**: มีปุ่มเลือกหน่วยด่วน (ชิ้น, กรัม, กก., มล., ลิตร, แพ็ค, ซอง) หรือระบุหน่วยเองได้
- 📊 **คำนวณและจัดอันดับอัตโนมัติ**:
  - คำนวณราคาต่อหน่วย (Unit Price)
  - จัดอันดับตัวเลือกที่คุ้มที่สุด (อันดับ #1) ไปจนถึงแพงที่สุด
  - แสดงเปอร์เซ็นต์ที่แพงกว่าตัวเลือกอันดับ 1 (+X%)
- 🧾 **กล่องผลลัพธ์สไตล์ใบเสร็จ (Result Receipt)**: สรุปผลชัดเจน พร้อมประโยคคำแนะนำ "ซื้อ A แทน B ประหยัด X% ต่อหน่วย"
- 🎨 **ดีไซน์สวยงาม (Chalkboard Design)**:
  - พื้นหลังกระดานชอล์กเขียวเข้ม
  - การ์ดตัวเลือกสไตล์ป้ายราคาแขวน
  - ฟอนต์ภาษาไทยอ่านง่าย (Mitr สำหรับหัวข้อ, Sarabun สำหรับเนื้อหา, JetBrains Mono สำหรับตัวเลขราคา)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

| ส่วนประกอบ | เทคโนโลยีที่เลือกใช้ |
|---|---|
| **Framework** | [Expo SDK](https://expo.dev/) (Managed Workflow) — รันผ่าน Expo Go ได้ทันที |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Navigation** | [expo-router](https://docs.expo.dev/router/introduction/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Styling** | [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS) |
| **Fonts** | `@expo-google-fonts/mitr`, `@expo-google-fonts/sarabun`, `@expo-google-fonts/jetbrains-mono` |
| **Icons** | `lucide-react-native` + `react-native-svg` |

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
value-comparator/
├── app/
│   ├── _layout.tsx          # Root Layout: โหลดฟอนต์ + Splash Screen + StatusBar
│   └── index.tsx            # หน้าจอหลัก ComparatorScreen
├── src/
│   ├── components/
│   │   ├── ItemCard.tsx           # การ์ดกรอกข้อมูลสินค้าและราคาแต่ละรายการ
│   │   ├── BestValueCallout.tsx   # กล่องไฮไลท์สรุปผลสินค้าที่คุ้มค่าที่สุด
│   │   ├── ResultReceipt.tsx      # การ์ดแสดงผลสรุปสไตล์ใบเสร็จ
│   │   ├── ResultRow.tsx          # แถวผลลัพธ์รายตัวเลือก (อันดับ + Badge)
│   │   ├── AddItemCard.tsx        # การ์ดปุ่ม "+ เพิ่มตัวเลือก"
│   │   └── UnitChip.tsx           # ปุ่มเลือกหน่วยด่วน
│   ├── store/
│   │   └── comparatorStore.ts     # Zustand store จัดการสถานะรายการตัวเลือก
│   ├── utils/
│   │   └── calculations.ts        # Pure functions คำนวณราคาต่อหน่วย, จัดอันดับ, %ส่วนต่าง
│   ├── theme/
│   │   ├── colors.ts              # Color Tokens (bgDeep, chalk, tagYellow, valueGreen ฯลฯ)
│   │   └── typography.ts          # Font Tokens (Mitr, Sarabun, JetBrains Mono)
│   ├── constants/
│   │   └── units.ts               # รายการหน่วยด่วน (UNIT_PRESETS)
│   └── types/
│       └── index.ts               # Types: ComparisonItem, ComputedItem, RankedItem
├── global.css
├── tailwind.config.js
├── metro.config.js
├── babel.config.js
├── app.json
├── tsconfig.json
└── package.json
```

---

## 📋 สิ่งที่ต้องมีก่อนรัน (Prerequisites)

1. **Node.js**: แนะนำเวอร์ชัน **v18.x หรือใหม่กว่า** ([ดาวน์โหลด Node.js](https://nodejs.org/))
2. **Expo Go App บนโทรศัพท์มือถือ**:
   - **iOS**: ดาวน์โหลดจาก App Store
   - **Android**: ดาวน์โหลดจาก Google Play Store

---

## 🚀 วิธีการรันโปรเจกต์ (How to Run)

### ขั้นตอนที่ 1: เข้าไปยังโฟลเดอร์โปรเจกต์

เปิด Terminal / Command Prompt แล้วพิมพ์:

```bash
cd value-comparator
```

### ขั้นตอนที่ 2: ติดตั้ง Dependencies (หากรันครั้งแรก)

```bash
npm install --legacy-peer-deps
```

### ขั้นตอนที่ 3: เริ่มต้น Development Server

```bash
npx expo start
```

เมื่อสั่งรัน Terminal จะแสดง **QR Code** ขึ้นมา

---

## 📱 วิธีทดสอบบนอุปกรณ์ต่างๆ

### 1. ทดสอบบนมือถือจริงผ่าน Expo Go (แนะนำ)
1. เปิดแอป **Expo Go** บนโทรศัพท์มือถือของคุณ
2. **สำหรับ Android**: กดสแกน QR Code ในแอป Expo Go
3. **สำหรับ iOS**: เปิดแอป Camera (กล้องถ่ายรูปสแกน) แล้วกดลิงก์เพื่อเปิดใน Expo Go

*(หมายเหตุ: โทรศัพท์มือถือและคอมพิวเตอร์ต้องเชื่อมต่อ Wi-Fi เครือข่ายเดียวกัน)*

### 2. ทดสอบบน Emulator / Simulator
- กด `a` ใน Terminal เพื่อเปิดบน **Android Emulator**
- กด `i` ใน Terminal เพื่อเปิดบน **iOS Simulator** (สำหรับ macOS)
- กด `w` ใน Terminal เพื่อทดสอบบน **Web Browser**

---

## ⚙️ คำสั่งอื่นๆ ที่มีประโยชน์

```bash
# ตรวจสอบ TypeScript Types
npx tsc --noEmit

# ตรวจสอบความสมบูรณ์และ Dependencies ของ Expo Project
npx expo-doctor
```

---

## 📝 กติกา & ข้อจำกัด

- โปรเจกต์นี้ใช้ **Managed Expo Workflow** ไม่มีการเขียน Custom Native Code จึงรองรับการรันและทดสอบบน Expo Go ได้ตลอดเวลา 100%
