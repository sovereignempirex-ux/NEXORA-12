/* ===================== NEXORA DATABASE =====================
 * قاعدة بيانات خارجية محاكاة
 * يمكن ربطها بـ Firebase, Supabase, أو أي API خارجي
 * ========================================================= */

const NEXORA_DB = {
    // ====== CONFIG ======
    config: {
        apiEndpoint: 'https://api.nexora.netlify.app', // استبدل بـ API حقيقي
        localStorageKey: 'nexora_db_v1',
        syncInterval: 300000, // 5 دقائق
    },

    // ====== DATA STORE ======
    data: {
        services: [],
        contacts: [],
        searches: [],
        stats: {
            visits: 0,
            lastVisit: null
        }
    },

    // ====== INIT ======
    init() {
        this.loadFromLocal();
        this.initServices();
        this.trackVisit();
        this.startSync();
        return this;
    },

    // ====== SERVICES DATA ======
    initServices() {
        const defaultServices = [
            {
                id: 1,
                title: 'دورات برمجة مجانية',
                description: 'تعلم البرمجة من الصفر مع دورات تفاعلية في Python, JavaScript, وغيرها',
                icon: 'fa-code',
                color: '#6366f1',
                category: 'برمجة',
                tags: ['python', 'javascript', 'تعلم', 'برمجة']
            },
            {
                id: 2,
                title: 'مشاريع مفتوحة المصدر',
                description: 'شارك في مشاريع برمجية مفتوحة المصدر مع مجتمع NEXORA',
                icon: 'fa-github',
                color: '#8b5cf6',
                category: 'برمجة',
                tags: ['github', 'open source', 'مشاريع', 'برمجة']
            },
            {
                id: 3,
                title: 'مراجعات الأنمي',
                description: 'مراجعات تفصيلية لأحدث حلقات وأفلام الأنمي الياباني',
                icon: 'fa-star',
                color: '#ec4899',
                category: 'أنمي',
                tags: ['anime', 'review', 'أنمي', 'مراجعة']
            },
            {
                id: 4,
                title: 'توصيات الأنمي',
                description: 'احصل على توصيات مخصصة بناءً على ذوقك في الأنمي',
                icon: 'fa-heart',
                color: '#f43f5e',
                category: 'أنمي',
                tags: ['recommendation', 'أنمي', 'توصية']
            },
            {
                id: 5,
                title: 'معلومات علمية',
                description: 'مقالات ومحتوى علمي مبسط في مختلف المجالات',
                icon: 'fa-flask',
                color: '#06b6d4',
                category: 'معلومات عامة',
                tags: ['science', 'علم', 'معلومات']
            },
            {
                id: 6,
                title: 'تاريخ وحضارات',
                description: 'استكشف تاريخ العالم والحضارات المختلفة بأسلوب شيق',
                icon: 'fa-landmark',
                color: '#f59e0b',
                category: 'معلومات عامة',
                tags: ['history', 'تاريخ', 'حضارات']
            },
            {
                id: 7,
                title: 'تحديات برمجية',
                description: 'شارك في تحديات ومسابقات برمجية أسبوعية مع جوائز',
                icon: 'fa-trophy',
                color: '#22c55e',
                category: 'برمجة',
                tags: ['challenge', 'مسابقة', 'برمجة']
            },
            {
                id: 8,
                title: 'نقاشات الأنمي',
                description: 'انضم لنقاشات حماسية حول أحدث الأنميات والنظريات',
                icon: 'fa-comments',
                color: '#a855f7',
                category: 'أنمي',
                tags: ['discussion', 'نقاش', 'أنمي']
            },
            {
                id: 9,
                title: 'أخبار التقنية',
                description: 'تابع آخر أخبار التقنية والبرمجة والذكاء الاصطناعي',
                icon: 'fa-newspaper',
                color: '#3b82f6',
                category: 'معلومات عامة',
                tags: ['tech', 'news', 'تقنية', 'أخبار']
            }
        ];

        if (!this.data.services.length) {
            this.data.services = defaultServices;
            this.saveToLocal();
        }
    },

    // ====== SEARCH ======
    search(query) {
        if (!query || query.trim().length < 2) return [];

        const q = query.toLowerCase().trim();
        this.logSearch(q);

        const results = [];

        // Search services
        this.data.services.forEach(s => {
            const score = this.calculateScore(q, [s.title, s.description, s.category, ...s.tags]);
            if (score > 0) {
                results.push({ ...s, score, type: 'خدمة' });
            }
        });

        // Search links
        const links = [
            { title: 'الموقع الرسمي', desc: 'nexora.netlify.app', url: 'https://nexora.netlify.app', tags: ['موقع', 'رسمي'] },
            { title: 'مجموعة الواتساب', desc: 'انضم للمجتمع', url: 'https://chat.whatsapp.com/Feb9W0vSPKrCxK9zAmWksQ', tags: ['واتساب', 'مجموعة'] },
            { title: 'قناة الواتساب', desc: 'تابع آخر الأخبار', url: 'https://whatsapp.com/channel/0029VbDemHOLo4hoUh99rj31', tags: ['واتساب', 'قناة'] },
            { title: 'سيرفر الديسكورد', desc: 'انضم للسيرفر', url: 'https://discord.gg/HC2wSQpru', tags: ['ديسكورد', 'سيرفر'] },
            { title: 'تيك توك', desc: '@nexora5105', url: 'https://www.tiktok.com/@nexora5105', tags: ['تيك توك', 'فيديو'] },
        ];

        links.forEach(l => {
            const score = this.calculateScore(q, [l.title, l.desc, ...l.tags]);
            if (score > 0) {
                results.push({ ...l, score, type: 'رابط', icon: 'fa-link' });
            }
        });

        return results.sort((a, b) => b.score - a.score);
    },

    calculateScore(query, texts) {
        let score = 0;
        const qWords = query.split(/\s+/);

        texts.forEach(text => {
            if (!text) return;
            const t = text.toLowerCase();

            // Exact match
            if (t.includes(query)) score += 10;

            // Word match
            qWords.forEach(word => {
                if (t.includes(word)) score += 3;
            });
        });

        return score;
    },

    // ====== CONTACT ======
    saveContact(contact) {
        contact.id = Date.now();
        contact.date = new Date().toISOString();
        this.data.contacts.push(contact);
        this.saveToLocal();

        // Simulate API call
        this.syncToServer('contacts', contact);

        return contact;
    },

    // ====== LOCAL STORAGE ======
    saveToLocal() {
        try {
            localStorage.setItem(this.config.localStorageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    },

    loadFromLocal() {
        try {
            const stored = localStorage.getItem(this.config.localStorageKey);
            if (stored) {
                this.data = { ...this.data, ...JSON.parse(stored) };
            }
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    },

    // ====== ANALYTICS ======
    trackVisit() {
        this.data.stats.visits++;
        this.data.stats.lastVisit = new Date().toISOString();
        this.saveToLocal();
    },

    logSearch(query) {
        this.data.searches.unshift({
            query,
            date: new Date().toISOString(),
            id: Date.now()
        });
        // Keep last 50 searches
        this.data.searches = this.data.searches.slice(0, 50);
        this.saveToLocal();
    },

    getPopularSearches() {
        const counts = {};
        this.data.searches.forEach(s => {
            counts[s.query] = (counts[s.query] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([query]) => query);
    },

    // ====== SYNC (Simulated External DB) ======
    startSync() {
        // Attempt sync every 5 minutes
        setInterval(() => this.syncAll(), this.config.syncInterval);
    },

    async syncAll() {
        // This is where you'd connect to Firebase, Supabase, etc.
        // Example:
        // await fetch(`${this.config.apiEndpoint}/sync`, {
        //     method: 'POST',
        //     body: JSON.stringify(this.data)
        // });
        console.log('[NEXORA DB] Sync simulation - ready for external API');
    },

    async syncToServer(collection, data) {
        // Simulate external DB save
        console.log(`[NEXORA DB] Saving to ${collection}:`, data);

        // Example Firebase integration:
        // const db = firebase.firestore();
        // await db.collection(collection).add(data);
    },

    // ====== FIREBASE EXAMPLE (commented) ======
    /*
    async initFirebase(config) {
        // firebase.initializeApp(config);
        // this.db = firebase.firestore();
        // Real-time sync
        // this.db.collection('services').onSnapshot(snapshot => {
        //     this.data.services = snapshot.docs.map(d => d.data());
        //     renderServices();
        // });
    },
    */

    // ====== SUPABASE EXAMPLE (commented) ======
    /*
    async initSupabase(url, key) {
        // const { createClient } = require('@supabase/supabase-js');
        // this.supabase = createClient(url, key);
        // const { data } = await this.supabase.from('services').select('*');
        // this.data.services = data || [];
    },
    */
};

// Initialize
NEXORA_DB.init();
