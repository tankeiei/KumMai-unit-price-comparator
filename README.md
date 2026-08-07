# 🛒 แอป "คุ้มไหม?" (Kum Mai) — Unit Price Comparator

[![React Native](https://img.shields.io/badge/React_Native-v0.76-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_52-000000?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NativeWind](https://img.shields.io/badge/NativeWind-v4.1-38BDF8?logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-v5.0-443e38)](https://zustand-demo.pmnd.rs/)

แอปพลิเคชันเปรียบเทียบราคาต่อหน่วย (Unit Price Comparator) พัฒนาด้วย **React Native** ผ่าน **Expo (Managed Workflow)** ช่วยตัดสินใจเลือกซื้อสินค้าที่คุ้มค่าที่สุดอย่างรวดเร็วและแม่นยำ แสดงผลการคำนวณ เปอร์เซ็นต์ความคุ้มค่า และจัดอันดับให้อัตโนมัติในสไตล์กระดานชอล์ก (Chalkboard Theme)

---

## 🌟 ฟีเจอร์หลัก (Features)

- 🏷️ **เปรียบเทียบหลายตัวเลือก**: เพิ่มหรือลดตัวเลือกสินค้าสำหรับเปรียบเทียบราคาได้ไม่จำกัด (ขั้นต่ำ 2 ตัวเลือก)
- ⚡ **ชิปหน่วยด่วน (Unit Chips)**: เลือกหน่วยสินค้าได้สะดวกรวดเร็ว (ชิ้น, กรัม, กก., มล., ลิตร, แพ็ค, ซอง) หรือกรอกหน่วยเองตามต้องการ
- 📊 **คำนวณและจัดอันดับอัตโนมัติ**:
  - คำนวณราคาต่อหน่วย (Unit Price) ของแต่ละสินค้า
  - จัดอันดับตัวเลือกที่คุ้มที่สุด (อันดับ #1) ไปจนถึงตัวเลือกที่แพงที่สุด
  - แสดงเปอร์เซ็นต์ส่วนต่างความคุ้มค่าเทียบกับตัวเลือกอันดับ 1 (+X%)
- 💡 **Best Value Callout & Receipt**:
  - แสดงกล่องไฮไลท์สินค้าที่คุ้มที่สุดพร้อมสรุปเงินที่ประหยัดได้
  - สรุปผลลัพธ์ในรูปแบบใบเสร็จ (Result Receipt) ที่อ่านง่าย ชัดเจน
- 🎨 **ดีไซน์กระดานชอล์ก (Chalkboard Theme)**:
  - โทนสีเขียวเข้มสบายตา ถนอมสายตา
  - ฟอนต์ภาษาไทยอ่านง่าย (Mitr สำหรับหัวข้อ, Sarabun สำหรับเนื้อหา, JetBrains Mono สำหรับตัวเลข)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

| ส่วนประกอบ | เทคโนโลยีที่เลือกใช้ |
|---|---|
| **Framework** | [Expo SDK 52](https://expo.dev/) (Managed Workflow) — รันผ่าน Expo Go ได้ทันที |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Navigation** | [expo-router](https://docs.expo.dev/router/introduction/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Styling** | [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS) |
| **Fonts** | `@expo-google-fonts/mitr`, `@expo-google-fonts/sarabun`, `@expo-google-fonts/jetbrains-mono` |
| **Icons** | `lucide-react-native` + `react-native-svg` |

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
Price calculator/
├── value-comparator/               # โฟลเดอร์ซอร์สโค้ดหลักของแอปพลิเคชัน
│   ├── app/                        # Expo Router Pages & Layouts
│   │   ├── _layout.tsx             # Root Layout (โหลด Google Fonts, StatusBar, Context)
│   │   └── index.tsx               # หน้าจอหลัก ComparatorScreen
│   ├── src/                        # ซอร์สโค้ดของแอปพลิเคชัน
│   │   ├── components/             # UI Components
│   │   │   ├── ItemCard.tsx        # การ์ดกรอกข้อมูลสินค้าและราคาแต่ละรายการ
│   │   │   ├── BestValueCallout.tsx# กล่องไฮไลท์สรุปผลสินค้าที่คุ้มค่าที่สุด
│   │   │   ├── ResultReceipt.tsx   # การ์ดแสดงผลสรุปในรูปแบบใบเสร็จ
│   │   │   ├── ResultRow.tsx       # แถวแสดงลำดับความคุ้มค่าของแต่ละรายการ
│   │   │   ├── AddItemCard.tsx     # ปุ่มการ์ดสำหรับเพิ่มตัวเลือกใหม่
│   │   │   └── UnitChip.tsx        # ปุ่มชิปสำหรับเลือกหน่วยด่วน
│   │   ├── store/                  # State Management
│   │   │   └── comparatorStore.ts  # Zustand Store จัดการ State รายการสินค้า
│   │   ├── utils/                  # Utility Functions
│   │   │   └── calculations.ts     # คำนวณราคาต่อหน่วย, จัดอันดับ, เปอร์เซ็นต์ส่วนต่าง
│   │   ├── theme/                  # Design System & Styling Tokens
│   │   │   ├── colors.ts           # โทนสีธีมกระดานชอล์ก (bgDeep, chalk, ฯลฯ)
│   │   │   └── typography.ts       # การตั้งค่า Font Family และขนาดตัวอักษร
│   │   ├── constants/              # ค่าคงที่ต่างๆ
│   │   │   └── units.ts            # รายการหน่วยด่วนมาตรฐาน (UNIT_PRESETS)
│   │   └── types/                  # TypeScript Type Definitions
│   │       └── index.ts            # Interfaces (ComparisonItem, ComputedItem, RankedItem)
│   ├── global.css                  # Global Tailwind CSS Styles
│   ├── tailwind.config.js          # NativeWind / Tailwind Configuration
│   ├── metro.config.js             # Metro Bundler Configuration (รองรับ NativeWind)
│   ├── babel.config.js             # Babel Plugin Settings
│   ├── app.json                    # Expo Project Configuration
│   ├── tsconfig.json               # TypeScript Configuration
│   └── package.json                # Project Dependencies & Scripts
├── README.md                       # เอกสารอธิบายโปรเจกต์ (ไฟล์นี้)
└── .gitignore                      # Git Ignore Rules
```

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### 📋 สิ่งที่ต้องมีล่วงหน้า (Prerequisites)
- **Node.js**: เวอร์ชัน **18.x ขึ้นไป** ([ดาวน์โหลด Node.js](https://nodejs.org/))
- **Expo Go App**: ติดตั้งบนมือถือ ([iOS (App Store)](https://apps.apple.com/app/expo-go/id982107779) / [Android (Play Store)](https://play.google.com/store/apps/details?id=host.exp.exponent))

### 💻 ขั้นตอนการรัน

1. **เข้าโฟลเดอร์โปรเจกต์**
   ```bash
   cd value-comparator
   ```

2. **ติดตั้ง Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **เริ่มพัฒนาแอป (Dev Server)**
   ```bash
   npx expo start
   ```

4. **เปิดใช้งานบนมือถือ**
   - **Android**: เปิดแอป Expo Go แล้วสแกน **QR Code** บน Terminal
   - **iOS**: เปิดแอป กล้อง (Camera) แล้วสแกน **QR Code** เพื่อเปิดใน Expo Go

