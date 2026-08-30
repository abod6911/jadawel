# جداول | JADAWEL — وش الخطة؟ 🌊🏛️☕
> **The Intelligent, Cinematic Outing & Itinerary Planner for Jeddah, Saudi Arabia.**

![Jadawel Platform Preview](public/images/realms/obhur-marina.jpg)

---

## 🌟 عن المشروع (About Jadawel)
**جداول (JADAWEL)** هي منصة ذكية سينمائية مصممة خصيصاً لاكتشاف مدينة جدة وتوليد خطط ومسارات طلعات يومية متكاملة بنقرة واحدة، بدلاً من التيه بين مئات الأماكن والمقاهي المتناثرة.

- **الشعار:** *"المواقع الثانية تعطيك مئات الأماكن وتخليك محتار.. جداول يرتّب لك الطلعة كاملة بنقرة واحدة."*
- **اللغات:** دعم كامل للغتين العربية (RTL) والإنجليزية (LTR).
- **التقنيات:** Next.js 14/15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand, Leaflet Interactive Maps.

---

## 🎛️ المميزات الرئيسية (Core Features)

1. **🎬 شاشة البداية السينمائية (Cinematic Card-Stack Preloader):**
   - استعراض بطاقات تفاعلية لمعالم جدة مع عداد رقمي متباطئ وانتقال كشف ستائري سلس.
2. **🌊 مسرح الهيرو السينمائي الشامل (3-Way Full-Bleed Hero):**
   - تبديل لحظي بين عوالم جدة الرئيسية:
     - 🌊 **أبحر والواجهة البحرية:** روقان الغروب، مارينا اليخوت والشواطئ.
     - 🏛️ **رواشين وتراث البلد:** التراث العالمي، أزقة التاريخ العتيقة، وبسطات الشاي الحجازي.
     - ☕ **كافيهات ومطاعم الروضة:** المحامص المختصة وأرقى المطاعم العالمية.
3. **⚡ رصيف التخطيط الخماسي السريع (5-Pillar Smart Planner Dock):**
   - تحديد الخطة بدقة عبر: (📍 الحي • 👥 مين معاك • 💰 الميزانية • ⏱️ الوقت • 🎭 جو الطلعة).
4. **🗺️ خريطة المسارات التفاعلية (Interactive Route Map):**
   - خريطة ليلية متوهجة باستخدام **CartoDB Dark Matter** تربط محطات الطلعة بخط ملاحي متصل ودبابيس مرقمة مع إمكانية التوجيه المباشر عبر Google Maps.
5. **📱 تجربة موبايل أصلية (Mobile-First Architecture):**
   - تصميم متجاوب بدقة مع حواف الآيفون وشريط سفلي عائم ونوافذ سحب سفلية (Bottom Sheets).

---

## 🚀 تشغيل المشروع محلياً (Getting Started)

### 1. المتطلبات (Prerequisites)
- Node.js 18+ أو 20+
- npm أو pnpm أو yarn

### 2. التثبيت والتشغيل (Installation & Development)
```bash
# تثبيت الحزم
npm install

# تشغيل خادم التطوير
npm run dev
```
افتح المتصفح على [http://localhost:3000](http://localhost:3000).

### 3. بناء الإنتاج (Production Build)
```bash
npm run build
npm run start
```

---

## 📁 هيكلة المشروع (Project Architecture)
```
jadawel/
├── public/               # الأصول والصور السينمائية (4K AI Assets)
│   └── images/realms/    # صور العوالم الثلاثة لجدة
├── src/
│   ├── app/              # صفحات ومسارات Next.js App Router
│   ├── components/
│   │   ├── hero/         # مسرح الهيرو وبوابات التبديل
│   │   ├── home/         # رصيف التخطيط، شبكة البينتو، الخطط الجاهزة
│   │   ├── layout/       # شريط التنقل، الفوتر، المنسق الشامل (PageOrchestrator)
│   │   ├── map/          # الخريطة التفاعلية (Leaflet & CartoDB)
│   │   ├── planner/      # معالج الخطط الذكي (7-Step Wizard)
│   │   ├── timeline/     # خط سير الطلعة وحاسبة تقسيم الفاتورة
│   │   └── ui/           # مكونات الواجهة ومحرك الصوت وشاشة البداية
│   ├── data/             # قاعدة بيانات معالم ومطاعم وأحياء جدة
│   ├── hooks/            # خطافات اللغة والسمات
│   ├── store/            # مخازن الحالة (Zustand)
│   ├── styles/           # رموز التصميم والتنسيقات العالمية
│   ├── types/            # الأنواع البرمجية (TypeScript Definitions)
│   └── utils/            # محرك الصوت وتوليد الخطط والخوارزميات
└── package.json
```

---

## 👤 المطور (Author)
- **GitHub:** [@abed6911](https://github.com/abed6911)

---
© 2026 جداول | JADAWEL — جميع الحقوق محفوظة.
