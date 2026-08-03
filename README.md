# ◇ NEXORA ◇

منصة عربية متكاملة للبرمجة والأنمي والمعلومات العامة

## 🚀 الميزات

- ✅ تصميم زجاجي حديث (Glassmorphism)
- ✅ نظام بحث ذكي مع تصنيفات
- ✅ قاعدة بيانات خارجية (محاكاة + جاهزة للربط)
- ✅ دعم PWA - تثبيت كتطبيق
- ✅ تصميم متجاوب (Responsive)
- ✅ رسوم متحركة وتأثيرات بصرية
- ✅ نموذج تواصل مع حفظ البيانات
- ✅ عداد إحصائيات متحرك
- ✅ دعم كامل للغة العربية (RTL)

## 📁 هيكل الملفات

```
nexora-website/
├── index.html          # الصفحة الرئيسية
├── manifest.json       # إعدادات PWA
├── sw.js              # Service Worker
├── css/
│   └── style.css      # التنسيقات
├── js/
│   ├── app.js         # منطق التطبيق
│   └── db.js          # قاعدة البيانات
└── images/            # مجلد الصور
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    ├── icon-512.png
    ├── screenshot1.png
    └── screenshot2.png
```

## 🌐 الروابط

- الموقع: [nexora.netlify.app](https://nexora.netlify.app)
- البديل: [nexora.vercel.app](https://nexora.vercel.app)
- واتساب: [المجموعة](https://chat.whatsapp.com/Feb9W0vSPKrCxK9zAmWksQ)
- قناة واتساب: [القناة](https://whatsapp.com/channel/0029VbDemHOLo4hoUh99rj31)
- ديسكورد: [السيرفر](https://discord.gg/HC2wSQpru)
- تيك توك: [@nexora5105](https://www.tiktok.com/@nexora5105)
- إيميل: n65750588@gmail.com

## 🔌 ربط قاعدة بيانات خارجية

### Firebase
```javascript
// في db.js، ألغِ التعليق وأضف:
firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "...",
    appId: "..."
});
NEXORA_DB.initFirebase();
```

### Supabase
```javascript
// في db.js، ألغِ التعليق وأضف:
NEXORA_DB.initSupabase('YOUR_URL', 'YOUR_KEY');
```

## 🎨 الألوان

| اللون | الكود |
|-------|-------|
| Primary | `#6366f1` |
| Secondary | `#ec4899` |
| Accent | `#06b6d4` |
| Background | `#0a0a1a` |

## 📱 اختصارات لوحة المفاتيح

- `Ctrl + K` - البحث
- `Escape` - مسح البحث

## 📄 الترخيص

جميع الحقوق محفوظة © 2026 NEXORA
