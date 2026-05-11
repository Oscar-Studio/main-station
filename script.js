        // Language Switching
        const langDropdown = document.querySelector('.lang-dropdown');
        const langToggle = document.querySelector('.lang-toggle');
        const langButtons = document.querySelectorAll('.lang-menu button');

        const translations = {
            zh: {
                nav: ['AI 工具', '教学工具', 'HTML-PPT', '益智游戏'],
                heroTitle: 'Oscar Studio',
                heroSubtitle: '专注于提升教学和学习质量',
                heroBtn1: '开始探索',
                heroBtn2: '加入我们',
                aiTitle: 'AI 工具',
                aiDesc: '集成多种先进 AI 模型，包括 DeepSeek 和 MiniMax，为您提供智能问答、文本生成、语音合成等全方位 AI 服务。简洁易用的界面让您轻松享受人工智能带来的便利，无论是学习、工作还是创意写作，都能为您提供有力的支持。',
                teachingTitle: '教学工具',
                teachingDesc: '丰富的 HTML 演示工具，专为教师和学生设计。包含函数图像绘制、几何图形演示、化学方程式配平、计时器、抽签器等多种实用工具，让抽象的知识变得直观可见，使课堂教学更加生动有趣，提升学习效率。',
                pptTitle: 'HTML-PPT',
                pptDesc: '创新的网页版 PPT 演示方案，使用纯 HTML、CSS 和 JavaScript 构建。无需安装任何软件，直接在浏览器中展示您的演示文稿。支持动画效果、响应式布局，让您的演讲更加流畅专业。跨越平台限制，随时随地精彩呈现。',
                gamesTitle: '益智游戏',
                gamesDesc: '精心设计的益智游戏集合，包括中国象棋、国际象棋、五子棋、24点等多种经典游戏。在娱乐中锻炼思维能力和逻辑推理能力，适合各个年龄段的用户。简洁美观的界面和流畅的操作体验，让游戏时光更加愉快。',
                footer: 'Oscar Studio © 2026',
                footerLink1: 'GitHub 仓库',
                footerLink2: '粤ICP备2026012488号-1'
            },
            en: {
                nav: ['AI Tools', 'Teaching Tools', 'HTML-PPT', 'Games'],
                heroTitle: 'Oscar Studio',
                heroSubtitle: 'Focused on improving teaching and learning quality',
                heroBtn1: 'Start Exploring',
                heroBtn2: 'Join Us',
                aiTitle: 'AI Tools',
                aiDesc: 'Integrating advanced AI models including DeepSeek and MiniMax, providing comprehensive AI services such as intelligent Q&A, text generation, and speech synthesis. The clean and easy-to-use interface lets you enjoy the convenience of artificial intelligence for learning, work, and creative writing.',
                teachingTitle: 'Teaching Tools',
                teachingDesc: 'A rich collection of HTML presentation tools designed for teachers and students. Includes function plotting, geometry demonstrations, chemical equation balancing, timers, random selectors, and more. Makes abstract knowledge intuitive and classroom teaching more engaging.',
                pptTitle: 'HTML-PPT',
                pptDesc: 'An innovative web-based PPT presentation solution built with pure HTML, CSS, and JavaScript. No software installation needed—just present directly in your browser. Supports animations and responsive layouts for smoother, more professional presentations.',
                gamesTitle: 'Puzzle Games',
                gamesDesc: 'A carefully designed collection of puzzle games including Chinese Chess, International Chess, Gomoku, 24 Points, and more. Exercise your thinking and logical reasoning skills while having fun. Suitable for all ages with a clean interface and smooth experience.',
                footer: 'Oscar Studio © 2026',
                footerLink1: 'GitHub',
                footerLink2: 'ICP License'
            }
        };

        let currentLang = localStorage.getItem('lang');
        // Validate lang against allowed list to prevent XSS
        const allowedLangs = ['zh', 'en'];
        if (!currentLang || !allowedLangs.includes(currentLang)) {
            currentLang = 'zh';
        }

        function setLanguage(lang) {
            currentLang = lang;
            localStorage.setItem('lang', lang);
            const t = translations[lang];
            if (!t) return;

            // Cache selectors for better performance
            const navLinks = document.querySelectorAll('nav ul li a');
            const heroH1 = document.querySelector('#hero h1');
            const heroP = document.querySelector('#hero p');
            const heroBtnPrimary = document.querySelector('#hero .btn-primary');
            const heroBtnSecondary = document.querySelector('#hero .btn-secondary');
            const aiH2 = document.querySelector('#ai h2');
            const aiP = document.querySelector('#ai p');
            const teachingH2 = document.querySelector('#teaching-tools h2');
            const teachingP = document.querySelector('#teaching-tools p');
            const pptH2 = document.querySelector('#html-ppt h2');
            const pptP = document.querySelector('#html-ppt p');
            const gamesH2 = document.querySelector('#games h2');
            const gamesP = document.querySelector('#games p');
            const footerFirstP = document.querySelector('footer p:first-child');
            const footerLinks = document.querySelectorAll('footer a');

            // Update nav links
            navLinks.forEach((link, i) => link.textContent = t.nav[i]);

            // Update hero
            heroH1.textContent = t.heroTitle;
            heroP.textContent = t.heroSubtitle;
            heroBtnPrimary.textContent = t.heroBtn1;
            heroBtnSecondary.textContent = t.heroBtn2;

            // Update sections
            aiH2.textContent = t.aiTitle;
            aiP.textContent = t.aiDesc;
            teachingH2.textContent = t.teachingTitle;
            teachingP.textContent = t.teachingDesc;
            pptH2.textContent = t.pptTitle;
            pptP.textContent = t.pptDesc;
            gamesH2.textContent = t.gamesTitle;
            gamesP.textContent = t.gamesDesc;

            // Update footer
            footerFirstP.textContent = t.footer;
            footerLinks[0].textContent = t.footerLink1;
            footerLinks[1].textContent = t.footerLink2;

            // Update dropdown button
            langToggle.textContent = lang === 'zh' ? '简体中文' : 'English';

            // Update active state
            langButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === lang);
            });
        }

        // Toggle dropdown - with flag to prevent duplicate binding
        let isDropdownBound = false;
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('open');
        });
        isDropdownBound = true;

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langDropdown.contains(e.target)) {
                langDropdown.classList.remove('open');
            }
        });

        // Language button click
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setLanguage(btn.dataset.lang);
                langDropdown.classList.remove('open');
            });
        });

        // Initialize
        setLanguage(currentLang);

        // Back to Top Button Logic
        const backToTopBtn = document.getElementById('back-to-top');
        const hero = document.getElementById('hero');

        function toggleBackToTop() {
            if (!hero) return;
            const heroBottom = hero.offsetTop + hero.offsetHeight;
            if (window.scrollY > heroBottom - 100) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop();
