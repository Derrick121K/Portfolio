// Theme toggle (default matches site styling)
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', savedTheme || 'dark');

    const hero = document.querySelector('.hero');
    let swallowTimer = null;

    const prefersReducedMotion = () =>
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const runBlackHoleSwallow = () => {
        if (!hero) return;
        hero.classList.remove('hero--swallow', 'hero--swallow-settled');
        if (swallowTimer) {
            clearTimeout(swallowTimer);
            swallowTimer = null;
        }
        if (prefersReducedMotion()) {
            return;
        }
        void hero.offsetWidth;
        hero.classList.add('hero--swallow');
        swallowTimer = window.setTimeout(() => {
            hero.classList.add('hero--swallow-settled');
            hero.classList.remove('hero--swallow');
            swallowTimer = null;
        }, 2800);
    };

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            runBlackHoleSwallow();
        } else if (hero) {
            hero.classList.remove('hero--swallow', 'hero--swallow-settled');
            if (swallowTimer) {
                clearTimeout(swallowTimer);
                swallowTimer = null;
            }
        }
    });
}

// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            if (navLinks) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// Form submission via Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const btn = contactForm.querySelector('button');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
    });
}

// Back to top button
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('active');
    } else {
        backToTopButton.classList.remove('active');
    }
});

if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && mobileMenu) {
        if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    }
});

// Scroll animations using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to sections and animate on scroll
document.querySelectorAll('.skill-category, .project-card, .contact-item, .timeline-item, .blog-card, .work-with-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Stagger animation delays for elements
document.querySelectorAll('.skill-category').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
});

document.querySelectorAll('.project-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
});

document.querySelectorAll('.blog-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.2}s`;
});

document.querySelectorAll('.work-with-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
});

// Interactive Terminal Experiences
const skillTerminals = {
    'TypeScript': {
        title: 'TypeScript Playground',
        terminal: [
            { cmd: 'npx create-react-app my-app --template typescript', output: 'Creating TypeScript React app...', interactive: true },
            { cmd: 'Install packages? (y/n)', output: '→ y', userInput: true },
            { cmd: 'cat src/App.tsx', output: '<span class="keyword">interface</span> <span class="function">Props</span> {\n  name: <span class="keyword">string</span>;\n}\n\n<span class="keyword">const</span> <span class="function">App</span>: React.FC&lt;Props&gt; = ({ name }) => {\n  <span class="keyword">return</span> &lt;h1&gt;Hello, {name}!&lt;/h1&gt;;\n};\n<span class="keyword">export default</span> App;' },
            { cmd: 'npm run build', output: '✓ TypeScript compiled!\n✓ Build successful!' }
        ]
    },
    'JavaScript': {
        title: 'JavaScript Console',
        terminal: [
            { cmd: 'node --version', output: 'v18.17.0' },
            { cmd: 'console.log("Hello World!")', output: 'Hello World!' },
            { cmd: 'const app = () => "React Native";;app()', output: '"React Native"' },
            { cmd: '[1,2,3].map(x => x * 2)', output: '[2, 4, 6]' }
        ]
    },
    'Java': {
        title: 'Java Android App',
        terminal: [
            { cmd: 'java -version', output: 'openjdk 17.0.1', interactive: true },
            { cmd: 'Select platform: (1) Desktop | (2) Android', output: '→ User selected: Android', userInput: true },
            { cmd: 'cat MainActivity.java', output: '<span class="keyword">public class</span> <span class="function">MainActivity</span> <span class="keyword">extends</span> AppCompatActivity {\n    <span class="keyword">private</span> Button btn;\n    <span class="keyword">private</span> TextView tv;\n    \n    <span class="keyword">@Override</span>\n    <span class="keyword">protected void</span> <span class="function">onCreate</span>(Bundle b) {\n        <span class="keyword">super</span>.onCreate(b);\n        setContentView(R.layout.activity_main);\n        \n        tv = findViewById(R.id.textView);\n        btn = findViewById(R.id.button);\n        btn.setOnClickListener(v -> tv.setText(<span class="string">"Hello Android!"</span>));\n    }\n}' },
            { cmd: './gradlew assembleDebug', output: '✓ BUILD SUCCESSFUL\n→ APK: app/build/outputs/apk/debug/app-debug.apk' }
        ]
    },
    'C#': {
        title: 'C# Unity Game',
        terminal: [
            { cmd: 'dotnet new unity -n MyGame', output: 'Creating Unity project...', interactive: true },
            { cmd: 'Select template: (1) 2D | (2) 3D', output: '→ User selected: 2D Game', userInput: true },
            { cmd: 'cat Player.cs', output: '<span class="keyword">using</span> UnityEngine;\n\n<span class="keyword">public class</span> <span class="function">Player</span> : MonoBehaviour {\n    <span class="keyword">public float</span> speed = 5f;\n    \n    <span class="keyword">void</span> <span class="function">Update</span>() {\n        <span class="keyword">float</span> h = Input.GetAxis(<span class="string">"Horizontal"</span>);\n        transform.Translate(Vector2.right * h * speed * Time.deltaTime);\n    }\n}' },
            { cmd: 'unity build --target Android', output: '🎮 Building 2D Game...\n✓ Build successful!\n→ APK ready: MyGame.apk' }
        ]
    },
    'Kotlin': {
        title: 'Kotlin Android',
        terminal: [
            { cmd: 'kotlinc -version', output: 'Kotlin 1.9.0' },
            { cmd: 'cat MainActivity.kt', output: '<span class="keyword">class</span> <span class="function">MainActivity</span> : AppCompatActivity() {\n    <span class="keyword">override fun</span> <span class="function">onCreate</span>(savedInstanceState: Bundle?) {\n        <span class="keyword">super</span>.onCreate(savedInstanceState)\n        setContentView(R.layout.activity_main)\n        \n        <span class="keyword">val</span> button = findViewById&lt;Button&gt;(R.id.btn)\n        button.setOnClickListener {\n            Toast.makeText(<span class="keyword">this</span>, <span class="string">"Hello Kotlin!"</span>, Toast.LENGTH_SHORT).show()\n        }\n    }\n}' },
            { cmd: './gradlew build', output: '✓ APK generated successfully!' }
        ]
    },
    'Next.js': {
        title: 'Next.js Server',
        terminal: [
            { cmd: 'npx create-next-app@latest', output: 'Creating new Next.js app...' },
            { cmd: 'cat app/page.tsx', output: '<span class="keyword">export default function</span> <span class="function">Home</span>() {\n  <span class="keyword">return</span> (\n    &lt;main&gt;\n      &lt;h1&gt;Welcome to Next.js 14&lt;/h1&gt;\n      &lt;p&gt;Server-side rendering enabled&lt;/p&gt;\n    &lt;/main&gt;\n  )\n}' },
            { cmd: 'npm run dev', output: '▲ Ready on http://localhost:3000' }
        ]
    },
    'React Native': {
        title: 'React Native + Android',
        terminal: [
            { cmd: 'npx expo start', output: 'Starting Metro bundler...', interactive: true },
            { cmd: 'Select platform: (a) iOS | (d) Android | (w) Web', output: '→ User selected: Android', userInput: true },
            { cmd: 'adb devices', output: 'List of devices attached\nemulator-5554  device' },
            { cmd: 'npx react-native run-android', output: '✓ Building Android APK...\n✓ APK built successfully!' },
            { cmd: '📱 App running on Android Emulator', output: '✓ Metro connected\n→ App installed on device' }
        ]
    },
    'HTML5': {
        title: 'HTML Editor',
        terminal: [
            { cmd: 'cat index.html', output: '<span class="keyword">&lt;!DOCTYPE html&gt;</span>\n<span class="keyword">&lt;html&gt;</span>\n  <span class="keyword">&lt;head&gt;</span>\n    <span class="keyword">&lt;title&gt;</span>My Portfolio<span class="keyword">&lt;/title&gt;</span>\n  <span class="keyword">&lt;/head&gt;</span>\n  <span class="keyword">&lt;body&gt;</span>\n    <span class="keyword">&lt;header&gt;</span>\n      <span class="keyword">&lt;h1&gt;</span>Derrick Kapa<span class="keyword">&lt;/h1&gt;</span>\n    <span class="keyword">&lt;/header&gt;</span>\n  <span class="keyword">&lt;/body&gt;</span>\n<span class="keyword">&lt;/html&gt;</span>' },
            { cmd: 'firefox index.html', output: '✓ Page rendered successfully!' }
        ]
    },
    'CSS3': {
        title: 'CSS Styling',
        terminal: [
            { cmd: 'cat styles.css', output: '<span class="comment">/* Cosmic Theme */</span>\n<span class="keyword">.container</span> {\n  <span class="function">display</span>: flex;\n  <span class="function">justify-content</span>: center;\n  <span class="function">align-items</span>: center;\n  <span class="function">background</span>: <span class="keyword">linear-gradient</span>(135deg, #0B0F1A, #1F3C88);\n}\n\n<span class="keyword">.card</span>:hover {\n  <span class="function">transform</span>: <span class="function">translateY</span>(-10px);\n  <span class="function">box-shadow</span>: 0 0 20px #00D4FF;\n}' },
            { cmd: 'npm run style', output: '✓ CSS compiled & minified\n  → Styles applied to all components' }
        ]
    },
    'Android Studio': {
        title: 'Android Emulator',
        terminal: [
            { cmd: './gradlew assembleDebug', output: '> Task :app:compileDebugKotlin\n> Task :app:compileDebugJavaWithJavac\n\nBUILD SUCCESSFUL' },
            { cmd: 'emulator -avd Pixel_5_API_33', output: '✓ Android emulator started\n  → App installed on device' },
            { cmd: 'adb install app-debug.apk', output: 'Success: app-debug.apk installed' }
        ]
    },
    'Supabase': {
        title: 'Supabase Database',
        terminal: [
            { cmd: 'supabase start', output: 'Starting local Supabase...', interactive: true },
            { cmd: 'Choose project: (1) PortfolioDB | (2) EcommerceDB', output: '→ User selected: PortfolioDB', userInput: true },
            { cmd: 'CREATE TABLE projects (id SERIAL, name TEXT, tech TEXT);', output: 'CREATE TABLE' },
            { cmd: "INSERT INTO projects VALUES ('E-Commerce', 'React Native');", output: 'INSERT 0 1' },
            { cmd: 'SELECT * FROM projects;', output: '┌────┬──────────────┬──────────────┐\n│ id │ name         │ tech         │\n├────┼──────────────┼──────────────┤\n│  1 │ E-Commerce   │ React Native │\n└────┴──────────────┴──────────────┘\n✓ Database ready!' }
        ]
    },
    'MongoDB': {
        title: 'MongoDB Atlas',
        terminal: [
            { cmd: 'mongosh "mongodb+srv://cluster0.xyz"', output: 'Connected to MongoDB Atlas' },
            { cmd: 'db.projects.insertOne({name: "E-Commerce", tech: "React Native"});', output: '{ acknowledged: true,\n  insertedId: ObjectId("abc123") }' },
            { cmd: 'db.projects.find().pretty()', output: '{\n  "_id": ObjectId("abc123"),\n  "name": "E-Commerce",\n  "tech": "React Native"\n}' }
        ]
    },
    'SQL': {
        title: 'SQL Query Runner',
        terminal: [
            { cmd: 'mysql -u root -p', output: 'Enter password: *****', interactive: true },
            { cmd: '> **********', output: '→ Connected to MySQL Server', userInput: true },
            { cmd: 'CREATE DATABASE portfolio;', output: 'Query OK, 1 row affected' },
            { cmd: 'USE portfolio;', output: 'Database changed' },
            { cmd: 'SELECT * FROM projects WHERE status = "Completed";', output: '┌────┬──────────────┬────────────┬───────────┐\n│ id │ name         │ tech       │ status    │\n├────┼──────────────┼────────────┼───────────┤\n│  1 │ E-Commerce   │ React Native│ Completed │\n│  2 │ Weather App  │ React Native│ Completed │\n│  3 │ Task Manager  │ Kotlin     │ Completed │\n└────┴──────────────┴────────────┴───────────┘\n✓ 3 rows in set' }
        ]
    },
    'REST APIs': {
        title: 'API Tester',
        terminal: [
            { cmd: 'curl -X GET https://api.weather.com/v1/forecast', output: '{\n  "location": "Witbank",\n  "temperature": 22,\n  "condition": "Sunny",\n  "humidity": 45\n}' },
            { cmd: 'curl -X POST https://api.users.com/create -d "name=Derrick"', output: '{\n  "id": "user_123",\n  "name": "Derrick",\n  "created": "2026-04-05"\n}' },
            { cmd: 'Response Status: 200 OK', output: '✓ API request successful!' }
        ]
    },
    'Git & GitHub': {
        title: 'Git Terminal',
        terminal: [
            { cmd: 'git init', output: 'Initialized empty Git repository' },
            { cmd: 'git add .', output: 'Files staged for commit' },
            { cmd: 'git commit -m "Initial commit"', output: '[main abc1234] Initial commit\n 3 files changed' },
            { cmd: 'git push origin main', output: '✓ Pushed to GitHub\n   https://github.com/Derrick121K/portfolio' }
        ]
    },
    'VS Code': {
        title: 'VS Code Terminal',
        terminal: [
            { cmd: 'code --version', output: '1.85.2' },
            { cmd: 'code --list-extensions', output: 'ESLint\nPrettier\nReact Native Tools\nTailwind CSS IntelliSense' },
            { cmd: 'code .', output: '✓ Opened project in VS Code\n  → Ready to code!' }
        ]
    },
    'Cyber Security': {
        title: 'Security Scanner',
        terminal: [
            { cmd: 'nmap -sV localhost', output: 'PORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http' },
            { cmd: 'nikto -h localhost', output: '+ Header: X-Powered-By: Express\n+ Server: nginx/1.18.0\n\n✓ Security scan complete' },
            { cmd: 'echo "System secure ✓"', output: 'All checks passed!\n🔒 No vulnerabilities found' }
        ]
    },
    'Code 14 License': {
        title: 'CDL Simulator',
        terminal: [
            { cmd: './check-license -class 14', output: 'License Class: Code 14\n  → Heavy Combination Vehicle\n  → Z to R license prefix' },
            { cmd: './start-driving -route "Witbank to Johannesburg"', output: '🚛 Engine started\n  → 16 wheels rolling\n  → Safe journey!' }
        ]
    }
};

// Create Interactive Terminal
const tooltipOverlay = document.createElement('div');
tooltipOverlay.className = 'skill-tooltip-overlay';
document.body.appendChild(tooltipOverlay);

const tooltip = document.createElement('div');
tooltip.className = 'skill-tooltip';
tooltip.innerHTML = `
    <div class="terminal-header-interactive">
        <div class="terminal-buttons">
            <span class="terminal-btn" style="background:#ff5f56"></span>
            <span class="terminal-btn" style="background:#ffbd2e"></span>
            <span class="terminal-btn" style="background:#27c93f"></span>
        </div>
        <span class="terminal-title">Terminal</span>
        <button class="terminal-close">&times;</button>
    </div>
    <div class="terminal-body-interactive"></div>
`;
document.body.appendChild(tooltip);

const terminalBody = tooltip.querySelector('.terminal-body-interactive');
const tooltipClose = tooltip.querySelector('.terminal-close');
let lineIndex = 0;

const closeInteractiveTerminal = () => {
    tooltipOverlay.classList.remove('active');
    tooltip.classList.remove('active');
    lineIndex = 0;
};

const runTerminalLines = (lines) => {
    if (lineIndex >= lines.length) return;
    
    const line = lines[lineIndex];
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line-interactive';
    
    if (line.interactive) {
        cmdLine.innerHTML = `<span class="terminal-prompt-interactive">$</span><span class="terminal-command-interactive">${line.cmd}</span>`;
        terminalBody.appendChild(cmdLine);
        
        setTimeout(() => {
            const promptLine = document.createElement('div');
            promptLine.className = 'terminal-output-interactive interactive-prompt';
            promptLine.innerHTML = `<span class="prompt-text">${line.output}</span>`;
            terminalBody.appendChild(promptLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            
            lineIndex++;
            setTimeout(() => runTerminalLines(lines), 1000);
        }, 400);
        return;
    }
    
    cmdLine.innerHTML = `<span class="terminal-prompt-interactive">$</span><span class="terminal-command-interactive">${line.cmd}</span>`;
    terminalBody.appendChild(cmdLine);
    
    setTimeout(() => {
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-output-interactive';
        
        if (line.userInput) {
            outputLine.innerHTML = `<span class="user-input">${line.output}</span>`;
            outputLine.style.color = '#00ff88';
        } else {
            outputLine.innerHTML = line.output;
        }
        
        terminalBody.appendChild(outputLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        lineIndex++;
        setTimeout(() => runTerminalLines(lines), 400);
    }, 300);
};

// Add click handlers for skills
document.querySelectorAll('.skill-list li').forEach(item => {
    let skillName = item.firstChild.textContent.trim().replace(/\s*\([^)]*\)/g, '');
    
    item.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const terminal = skillTerminals[skillName];
        
        if (terminal) {
            tooltip.querySelector('.terminal-title').textContent = terminal.title;
            terminalBody.innerHTML = '';
            tooltipOverlay.classList.add('active');
            tooltip.classList.add('active');
            lineIndex = 0;
            runTerminalLines(terminal.terminal);
        }
        
        item.classList.add('clicked');
        setTimeout(() => item.classList.remove('clicked'), 500);
    });
});

if (tooltipClose) {
    tooltipClose.addEventListener('click', closeInteractiveTerminal);
}
tooltipOverlay.addEventListener('click', closeInteractiveTerminal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeInteractiveTerminal();
});

// CV Download Modal Functions
let currentCVStyle = 'modern';

function selectCVStyle(style, element) {
    currentCVStyle = style;
    if (element) {
        document.querySelectorAll('.cv-option').forEach(opt => opt.classList.remove('selected'));
        element.classList.add('selected');
    }
}

function downloadCV(format, selectedStyle) {
    const cvStyle = selectedStyle || currentCVStyle || 'modern';
    currentCVStyle = cvStyle;

    if (format === 'pdf') {
        downloadCVasPDF(cvStyle);
    }
    closeCVModal();
}

function viewCV() {
    const styleToView = currentCVStyle || 'modern';
    const cvFrame = document.getElementById('pdfFrame');
    const pdfViewer = document.getElementById('pdfViewer');
    cvFrame.srcdoc = getCVHTML(styleToView);
    pdfViewer.classList.add('active');
    closeCVModal();
}

function closeCVModal() {
    document.getElementById('cvModal').style.display = 'none';
}

function closePDFViewer() {
    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfViewer) pdfViewer.classList.remove('active');
}

function downloadCVasPDF(style) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('PDF generator failed to load. Please refresh the page and try again.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const socialLinks = getSocialLinksFromPage();
    const websiteUrl = window.location.origin && window.location.origin !== 'null'
        ? window.location.origin
        : (window.location.href || '');

    const cvData = getCVDataForPDF(style, { websiteUrl, socialLinks });

    doc.setProperties({
        title: `${cvData.name} — Resume`,
        subject: `${cvData.titleLine} — job application`,
        author: cvData.name,
        keywords: 'resume, curriculum vitae, CV, software developer, mobile, web, South Africa',
        creator: 'Portfolio (jsPDF)'
    });

    if (style === 'classic') {
        renderClassicPDF(doc, cvData, pageWidth, pageHeight);
    } else if (style === 'creative') {
        renderCreativePDF(doc, cvData, pageWidth, pageHeight);
    } else {
        renderModernPDF(doc, cvData, pageWidth, pageHeight);
    }

    const styleLabel = style === 'classic' ? 'Classic' : style === 'creative' ? 'Creative' : 'Modern';
    doc.save(`Derrick_Kapa_Resume_${styleLabel}.pdf`);
}

function drawPDFSectionTitle(doc, title, x, y, color, fontFamily = 'helvetica') {
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(title, x, y);
    return y + 14;
}

function drawPDFLinks(doc, links, x, y, color, fontFamily = 'helvetica') {
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(color[0], color[1], color[2]);
    links.forEach(link => {
        doc.textWithLink(`${link.label}: ${link.url}`, x, y, { url: link.url });
        y += 12;
    });
    return y;
}

const PDF_BOTTOM_MARGIN_PT = 52;
const PDF_CONTINUE_BODY_Y_PT = 52;

/** Single-column, conventional section order; paginated; suitable for job portals and ATS parsers. */
function renderStandardResumeBody(doc, d, pageWidth, pageHeight, yStart, theme) {
    const mx = theme.marginX;
    const cw = pageWidth - mx * 2;
    const LH = theme.lineHeight;
    const bottom = pageHeight - PDF_BOTTOM_MARGIN_PT;
    const links = [
        ...(d.websiteUrl ? [{ label: 'Website', url: d.websiteUrl }] : []),
        ...d.socialLinks
    ];

    let y = yStart;

    const continuePage = () => {
        doc.addPage();
        theme.drawContinueHeader(doc, d.name, mx, pageWidth);
        y = PDF_CONTINUE_BODY_Y_PT;
    };

    const ensureSpace = (needed) => {
        let guard = 0;
        while (y + needed > bottom && guard < 40) {
            continuePage();
            guard += 1;
        }
    };

    const section = (label) => {
        ensureSpace(22);
        y = theme.drawSectionTitle(doc, label, mx, y);
        y += theme.afterSectionTitleGap;
    };

    const writeLines = (lines, gapAfter = theme.blockGap) => {
        lines.forEach((line) => {
            if (y + LH > bottom) continuePage();
            doc.text(line, mx, y);
            y += LH;
        });
        y += gapAfter;
    };

    const paragraph = (text, gapAfter = theme.blockGap) => {
        doc.setFont(theme.fontFamily, 'normal');
        doc.setFontSize(theme.bodySize);
        doc.setTextColor(theme.bodyColor[0], theme.bodyColor[1], theme.bodyColor[2]);
        const lines = doc.splitTextToSize(text, cw);
        writeLines(lines, gapAfter);
    };

    section(theme.labels.summary);
    paragraph(d.summary);

    section(theme.labels.experience);
    d.experience.forEach((item) => {
        ensureSpace(LH * 2 + theme.blockGap + 4);
        doc.setFont(theme.fontFamily, 'bold');
        doc.setFontSize(theme.bodySize);
        doc.setTextColor(theme.headingColor[0], theme.headingColor[1], theme.headingColor[2]);
        doc.text(item.title, mx, y);
        y += LH;
        doc.setFont(theme.fontFamily, 'normal');
        doc.setTextColor(theme.secondaryColor[0], theme.secondaryColor[1], theme.secondaryColor[2]);
        doc.text(`${item.company} | ${item.year}`, mx, y);
        y += LH + theme.blockGap;
    });

    section(theme.labels.education);
    d.education.forEach((item) => {
        ensureSpace(LH * 2 + theme.blockGap + 4);
        doc.setFont(theme.fontFamily, 'bold');
        doc.setFontSize(theme.bodySize);
        doc.setTextColor(theme.headingColor[0], theme.headingColor[1], theme.headingColor[2]);
        doc.text(item.title, mx, y);
        y += LH;
        doc.setFont(theme.fontFamily, 'normal');
        doc.setTextColor(theme.secondaryColor[0], theme.secondaryColor[1], theme.secondaryColor[2]);
        doc.text(`${item.school} | ${item.year}`, mx, y);
        y += LH + theme.blockGap;
    });

    section(theme.labels.skills);
    const skillsJoin = theme.skillsSeparator === 'pipe' ? d.skills.join(' | ') : d.skills.join(' • ');
    paragraph(skillsJoin, theme.blockGap + 2);

    section(theme.labels.projects);
    d.projects.forEach((project) => {
        const descLines = doc.splitTextToSize(project.desc, cw);
        const urlLines = project.url ? 1 : 0;
        const blockH = LH * (2 + descLines.length + urlLines) + theme.projectBlockGap;
        ensureSpace(blockH);

        doc.setFont(theme.fontFamily, 'bold');
        doc.setFontSize(theme.bodySize);
        doc.setTextColor(theme.headingColor[0], theme.headingColor[1], theme.headingColor[2]);
        doc.text(project.name, mx, y);
        y += LH;

        doc.setFont(theme.fontFamily, 'normal');
        doc.setTextColor(theme.secondaryColor[0], theme.secondaryColor[1], theme.secondaryColor[2]);
        doc.text(project.tech, mx, y);
        y += LH;

        doc.setTextColor(theme.bodyColor[0], theme.bodyColor[1], theme.bodyColor[2]);
        descLines.forEach((line) => {
            if (y + LH > bottom) continuePage();
            doc.text(line, mx, y);
            y += LH;
        });

        if (project.url) {
            if (y + LH > bottom) continuePage();
            doc.setTextColor(theme.linkColor[0], theme.linkColor[1], theme.linkColor[2]);
            doc.textWithLink(project.url, mx, y, { url: project.url });
            y += LH;
        }
        y += theme.projectBlockGap;
    });

    section(theme.labels.certifications);
    d.certifications.forEach((cert) => {
        if (y + LH > bottom) continuePage();
        doc.setFont(theme.fontFamily, 'normal');
        doc.setFontSize(theme.bodySize);
        doc.setTextColor(theme.bodyColor[0], theme.bodyColor[1], theme.bodyColor[2]);
        doc.text(`• ${cert}`, mx, y);
        y += LH + 2;
    });
    y += theme.blockGap;

    section(theme.labels.languages);
    d.languages.forEach((language) => {
        if (y + LH > bottom) continuePage();
        doc.setFont(theme.fontFamily, 'normal');
        doc.setFontSize(theme.bodySize);
        doc.setTextColor(theme.bodyColor[0], theme.bodyColor[1], theme.bodyColor[2]);
        doc.text(`• ${language}`, mx, y);
        y += LH + 2;
    });
    y += theme.blockGap;

    if (links.length) {
        section(theme.labels.links);
        ensureSpace(links.length * 12 + 8);
        y = drawPDFLinks(doc, links, mx, y, theme.linkColor, theme.fontFamily);
        y += theme.blockGap;
    }
}

function renderModernPDF(doc, d, pageWidth, pageHeight) {
    const marginX = 48;
    let y = 54;
    const labels = {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Technical Skills',
        projects: 'Selected Projects',
        certifications: 'Certifications',
        languages: 'Languages',
        links: 'Professional Links'
    };
    const theme = {
        marginX,
        fontFamily: 'helvetica',
        bodySize: 10.5,
        lineHeight: 12,
        bodyColor: [30, 41, 59],
        headingColor: [15, 23, 42],
        secondaryColor: [71, 85, 105],
        linkColor: [14, 165, 233],
        afterSectionTitleGap: 4,
        blockGap: 10,
        projectBlockGap: 6,
        skillsSeparator: 'bullet',
        labels,
        drawSectionTitle: (doc0, title, x, y0) =>
            drawPDFSectionTitle(doc0, title, x, y0, [15, 23, 42], 'helvetica'),
        drawContinueHeader: (doc0, name, x) => {
            doc0.setFont('helvetica', 'italic');
            doc0.setFontSize(8);
            doc0.setTextColor(100, 116, 139);
            doc0.text(`${name} — CV (continued)`, x, 38);
        }
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text(d.name, marginX, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    doc.text(d.titleLine, marginX, y);
    y += 18;

    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(1);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 18;

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10.5);
    doc.text(`Email: ${d.email}`, marginX, y); y += 14;
    doc.text(`Phone: ${d.phone}`, marginX, y); y += 14;
    doc.text(`Location: ${d.location}`, marginX, y); y += 20;

    renderStandardResumeBody(doc, d, pageWidth, pageHeight, y, theme);
}

function renderClassicPDF(doc, d, pageWidth, pageHeight) {
    const marginX = 40;
    let y = 46;
    const labels = {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Technical Skills',
        projects: 'Selected Projects',
        certifications: 'Certifications',
        languages: 'Languages',
        links: 'Professional Links'
    };
    const theme = {
        marginX,
        fontFamily: 'times',
        bodySize: 10.5,
        lineHeight: 12,
        bodyColor: [31, 41, 55],
        headingColor: [17, 24, 39],
        secondaryColor: [75, 85, 99],
        linkColor: [31, 41, 55],
        afterSectionTitleGap: 4,
        blockGap: 8,
        projectBlockGap: 4,
        skillsSeparator: 'pipe',
        labels,
        drawSectionTitle: (doc0, title, x, y0) =>
            drawPDFSectionTitle(doc0, title, x, y0, [17, 24, 39], 'times'),
        drawContinueHeader: (doc0, name, x) => {
            doc0.setFont('times', 'italic');
            doc0.setFontSize(8);
            doc0.setTextColor(100, 116, 139);
            doc0.text(`${name} — CV (continued)`, x, 36);
        }
    };

    doc.setFont('times', 'bold');
    doc.setFontSize(19);
    doc.setTextColor(17, 24, 39);
    doc.text(d.name, marginX, y);
    y += 15;

    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text(d.titleLine, marginX, y);
    y += 12;
    doc.text(`${d.email} | ${d.phone} | ${d.location}`, marginX, y);
    y += 10;

    doc.setDrawColor(156, 163, 175);
    doc.setLineWidth(0.8);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 16;

    renderStandardResumeBody(doc, d, pageWidth, pageHeight, y, theme);
}

function renderCreativePDF(doc, d, pageWidth, pageHeight) {
    const marginX = 48;
    let y = 52;
    const accent = [124, 58, 237];
    const labels = {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Technical Skills',
        projects: 'Selected Projects',
        certifications: 'Certifications',
        languages: 'Languages',
        links: 'Professional Links'
    };
    const theme = {
        marginX,
        fontFamily: 'helvetica',
        bodySize: 10.5,
        lineHeight: 12,
        bodyColor: [31, 41, 55],
        headingColor: [17, 24, 39],
        secondaryColor: [79, 70, 229],
        linkColor: [124, 58, 237],
        afterSectionTitleGap: 4,
        blockGap: 10,
        projectBlockGap: 6,
        skillsSeparator: 'bullet',
        labels,
        drawSectionTitle: (doc0, title, x, y0) => {
            doc0.setDrawColor(accent[0], accent[1], accent[2]);
            doc0.setLineWidth(3);
            doc0.line(x, y0 - 8, x, y0 + 4);
            doc0.setFont('helvetica', 'bold');
            doc0.setFontSize(12);
            doc0.setTextColor(accent[0], accent[1], accent[2]);
            doc0.text(title, x + 10, y0);
            return y0 + 14;
        },
        drawContinueHeader: (doc0, name, x) => {
            doc0.setFont('helvetica', 'italic');
            doc0.setFontSize(8);
            doc0.setTextColor(100, 116, 139);
            doc0.text(`${name} — CV (continued)`, x, 38);
        }
    };

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(76, 29, 149);
    doc.text(d.name, marginX, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128);
    doc.text(d.titleLine, marginX, y);
    y += 16;

    doc.setFontSize(10.5);
    doc.setTextColor(31, 41, 55);
    doc.text(d.email, marginX, y); y += 13;
    doc.text(d.phone, marginX, y); y += 13;
    doc.text(d.location, marginX, y); y += 18;

    doc.setDrawColor(236, 72, 153);
    doc.setLineWidth(0.9);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 20;

    renderStandardResumeBody(doc, d, pageWidth, pageHeight, y, theme);
}

function getSocialLinksFromPage() {
    const links = [];
    document.querySelectorAll('footer .social-links a').forEach(a => {
        const url = a.getAttribute('href') || '';
        if (!url) return;
        const label = a.getAttribute('aria-label') || 'Social';
        links.push({ label, url });
    });
    return links;
}

function getCVDataForPDF(style, { websiteUrl, socialLinks }) {
    const base = {
        name: "Derrick Aaron Mohale Kapa",
        titleLine: "Software Developer | Mobile & Web Developer",
        email: "mohalekapa112@gmail.com",
        phone: "+27 71 654 7121",
        location: "Witbank, Mpumalanga, SA",
        websiteUrl,
        socialLinks,
        summary: "Software Development student at IIE Rosebank College with strong skills in mobile and web development. Passionate about building innovative digital solutions with React Native, Kotlin, and modern web technologies.",
        skills: ["TypeScript", "JavaScript", "Java", "C#", "Kotlin", "React Native", "Next.js", "HTML5", "CSS3", "Supabase", "MongoDB", "SQL", "REST APIs", "Git", "GitHub", "VS Code", "Android Studio"],
        certifications: ["Cyber Security Certified", "Security Grade E-C", "Code 14 Driver License"],
        languages: ["IsiZulu - Expert", "English - Fluent", "SeSotho - Fluent"],
        education: [
            { title: "Diploma in Software Development", school: "IIE Rosebank College", year: "2025 - Present (2nd Year)" },
            { title: "Higher Certificate in Mobile Application & Web Development", school: "IIE Rosebank College", year: "2024" },
            { title: "Grade 12", school: "Kwadela Secondary School", year: "2018" }
        ],
        projects: [
            { name: "Library Web-App", tech: "Next.js • PostgreSQL • Prisma", desc: "Library management with auth, catalog, and admin workflows", url: "https://davel-library.onrender.com/" },
            { name: "GossipOffice", tech: "Next.js • TypeScript • Tailwind", desc: "Local-first CV & office suite with templates, exports, and optional AI assists", url: "https://go-office.vercel.app/" },
            { name: "Gossipa", tech: "React Native • Supabase", desc: "Cross-platform social app: feed, chat, explore, and settings", url: "https://expo.dev/accounts/derrick112/projects/gossipa" },
            { name: "Weather Forecast App", tech: "React Native • REST API", desc: "OpenWeatherMap integration with location-based forecasts", url: "https://github.com/Derrick121K/WeatherNewsApp" },
            { name: "History App", tech: "Kotlin • Android", desc: "Age input matched to historical figures with validation and clear/reset actions", url: "https://github.com/Derrick121K/History-App1" },
            { name: "Cybersecurity Chatbot", tech: "C# • .NET Console", desc: "Console chatbot with tips, ASCII UI, voice greeting, personalization, and validation", url: "https://github.com/Derrick121K/CybersecurityChatbot" },
            { name: "Chalk Markit", tech: "HTML • CSS • JavaScript", desc: "Multi-page app with login, signup, dashboard, and profile flows", url: "https://github.com/Derrick121K/chalk-markit" },
            { name: "Animalcore", tech: "HTML • CSS • JavaScript • GitHub Pages", desc: "Front-end project live on GitHub Pages with source on GitHub", url: "https://derrick121k.github.io/animalcore/" },
            { name: "Family Game Night (fam)", tech: "JavaScript • HTML • CSS • GitHub Pages", desc: "Host/join game night UI with questions upload and scores", url: "https://derrick121k.github.io/fam/" },
            { name: "REACH Foundation (WEDE5020 POE)", tech: "HTML • CSS • JavaScript • GitHub Pages", desc: "Nonprofit-style multi-page site: projects, donate, contact, auth-style pages", url: "https://derrick121k.github.io/WEDE5020-WebsitePOE/" }
        ],
        experience: [{ title: "Driver Code 14", company: "Omplishs 16.4 Bell Transport", year: "2024 - Present" }]
    };

    // Style is reserved for future differences, currently same PDF output for all.
    if (style === 'classic' || style === 'creative' || style === 'modern') return base;
    return base;
}

// Open CV Modal button
const openCvModalBtn = document.getElementById('openCvModalBtn');
if (openCvModalBtn) {
    openCvModalBtn.addEventListener('click', () => {
        document.getElementById('cvModal').style.display = 'flex';
    });
}

// Close modals on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const cvModal = document.getElementById('cvModal');
        const pdfViewer = document.getElementById('pdfViewer');
        if (cvModal) cvModal.style.display = 'none';
        if (pdfViewer) closePDFViewer();
    }
});

// CV HTML Generator Functions
function getCVHTML(style) {
    const socialLinks = getSocialLinksFromPage();
    const websiteUrl = window.location.origin && window.location.origin !== 'null'
        ? window.location.origin
        : (window.location.href || '');

    const cvData = {
        name: "Derrick Aaron Mohale Kapa",
        title: "Software Developer",
        email: "mohalekapa112@gmail.com",
        phone: "+27 71 654 7121",
        location: "Witbank, Mpumalanga, SA",
        websiteUrl,
        socialLinks,
        summary: "Software Development student at IIE Rosebank College with strong skills in mobile and web development. Passionate about building innovative digital solutions with React Native, Kotlin, and modern web technologies.",
        skills: ["TypeScript", "JavaScript", "Java", "C#", "Kotlin", "React Native", "Next.js", "HTML5", "CSS3", "Supabase", "MongoDB", "SQL", "REST APIs", "Git", "VS Code", "Android Studio"],
        education: [
            { title: "Diploma in Software Development", school: "IIE Rosebank College", year: "2025 - Present (2nd Year)" },
            { title: "Higher Certificate in Mobile Application & Web Development", school: "IIE Rosebank College", year: "2024" },
            { title: "Grade 12", school: "Kwadela Secondary School", year: "2018" }
        ],
        certifications: ["Cyber Security Certified", "Security Grade E-C", "Code 14 Driver License"],
        projects: [
            { name: "Library Web-App", tech: "Next.js, PostgreSQL, Prisma", desc: "Library management with auth, catalog, and admin workflows" },
            { name: "GossipOffice", tech: "Next.js, TypeScript, Tailwind, shadcn/ui", desc: "Local-first CV & office suite: builder, templates, PDF/DOCX/PPTX, optional AI" },
            { name: "Gossipa", tech: "React Native, Supabase", desc: "Cross-platform social app: feed, chat, explore, and settings" },
            { name: "Weather Forecast App", tech: "React Native, REST API", desc: "OpenWeatherMap integration with location-based forecasts" },
            { name: "History App", tech: "Kotlin, Android", desc: "Compare user age to historical figures; validation for ages over 96; process and clear controls" },
            { name: "Cybersecurity Chatbot", tech: "C#, .NET", desc: "Console cybersecurity education: voice greeting, ASCII UI, tips, personalization, input validation" },
            { name: "Chalk Markit", tech: "HTML, CSS, JavaScript", desc: "Vanilla multi-page site: auth-style pages, dashboard, and profile" },
            { name: "Animalcore", tech: "HTML, CSS, JavaScript, GitHub Pages", desc: "Deployed static site; live demo and repo for implementation details" },
            { name: "Family Game Night (fam)", tech: "JavaScript, HTML, CSS", desc: "Family game night: host, join, questions, scores; live on GitHub Pages" },
            { name: "REACH Foundation (WEDE5020 POE)", tech: "HTML, CSS, JavaScript", desc: "REACH Foundation community site; projects, donate, contact, newsletter; GitHub Pages" }
        ],
        experience: [{ title: "Driver Code 14", company: "Omplishs 16.4 Bell Transport", year: "2024 - Present" }],
        languages: ["IsiZulu - Expert", "English - Fluent", "SeSotho - Fluent"]
    };
    
    if (style === 'modern') {
        return getModernCV(cvData);
    } else if (style === 'classic') {
        return getClassicCV(cvData);
    } else {
        return getCreativeCV(cvData);
    }
}

function getModernCV(d) {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Derrick Kapa - CV</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4; margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
            width: 210mm; 
            min-height: 297mm; 
            padding: 40px 45px; 
            color: #1e293b; 
            background: #fff;
            line-height: 1.5;
        }
        .header { text-align: center; margin-bottom: 22px; padding-bottom: 16px; border-bottom: 2px solid #0ea5e9; }
        .header h1 { font-size: 26px; font-weight: 700; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.5px; }
        .header .title { font-size: 14px; color: #0ea5e9; font-weight: 500; margin-bottom: 12px; }
        .contact-row { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 12px; color: #475569; }
        .contact-row span { display: flex; align-items: center; gap: 5px; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: flex-start; }
        .two-col > div { flex: 1; }
        h2 { font-size: 13px; font-weight: 600; color: #0ea5e9; text-transform: uppercase; letter-spacing: 1px; margin: 18px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
        p { font-size: 12px; color: #475569; margin-bottom: 10px; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-tag { background: #f1f5f9; padding: 5px 10px; border-radius: 4px; font-size: 11px; font-weight: 500; color: #334155; }
        ul { list-style: none; }
        li { font-size: 12px; color: #475569; margin-bottom: 8px; padding-left: 15px; position: relative; }
        li::before { content: "•"; position: absolute; left: 0; color: #0ea5e9; }
        .job-title { font-weight: 600; color: #1e293b; }
        .company { color: #64748b; font-size: 11px; }
        .section { margin-bottom: 5px; }
        .links { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px 12px; margin: 10px 0 4px; }
        .links a { color: #0ea5e9; text-decoration: none; font-size: 11px; }
        .links a:hover { text-decoration: underline; }
        @media print { 
            body { padding: 30px 35px; } 
            @page { margin: 0; }
            .no-print { display: none; }
            .two-col { grid-template-columns: 1fr 1fr; gap: 20px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${d.name}</h1>
        <div class="title">Software Developer | Mobile & Web Developer</div>
        <div class="contact-row">
            <span>✉ ${d.email}</span>
            <span>📱 ${d.phone}</span>
            <span>📍 ${d.location}</span>
        </div>
        <div class="links">
            ${d.websiteUrl ? `<a href="${d.websiteUrl}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
            ${d.socialLinks.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join('')}
        </div>
    </div>
    
    <div class="two-col">
        <div>
            <h2>Skills</h2>
            <div class="skills-grid">
                ${d.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
            
            <h2>Education</h2>
            <div class="section">
                ${d.education.map(e => `<li><span class="job-title">${e.title}</span><br><span class="company">${e.school} (${e.year})</span></li>`).join('')}
            </div>
            
            <h2>Certifications</h2>
            <ul>
                ${d.certifications.map(c => `<li>${c}</li>`).join('')}
            </ul>
            
            <h2>Languages</h2>
            <ul>
                ${d.languages.map(l => `<li>${l}</li>`).join('')}
            </ul>
        </div>
        
        <div>
            <h2>Summary</h2>
            <p>${d.summary}</p>
            
            <h2>Projects</h2>
            <ul>
                ${d.projects.map(p => `<li><span class="job-title">${p.name}</span><br>${p.tech}<br>${p.desc}</li>`).join('')}
            </ul>
            
            <h2>Experience</h2>
            <ul>
                ${d.experience.map(e => `<li><span class="job-title">${e.title}</span><br><span class="company">${e.company} (${e.year})</span></li>`).join('')}
            </ul>
        </div>
    </div>
</body>
</html>`;
}

function getClassicCV(d) {
    return `<!DOCTYPE html>
<html>
<head>
    <title>${d.name} - CV</title>
    <style>
        @page { size: A4; margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: Arial, Helvetica, sans-serif;
            width: 210mm;
            min-height: 297mm;
            padding: 30px 34px;
            color: #111827;
            line-height: 1.45;
            background: #fff;
        }
        .header { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid #d1d5db; }
        .header h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; letter-spacing: 0.2px; }
        .header .title { font-size: 12px; color: #4b5563; margin-bottom: 8px; }
        .contact-info { font-size: 11px; color: #374151; display: flex; flex-wrap: wrap; gap: 6px 16px; }
        .links { margin-top: 6px; font-size: 10px; display: flex; flex-wrap: wrap; gap: 6px 12px; }
        .links a { color: #1f2937; text-decoration: none; }
        .links a:hover { text-decoration: underline; }
        h2 { font-size: 12px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; margin: 14px 0 8px; color: #111827; }
        p { font-size: 11px; color: #1f2937; }
        .skills { font-size: 11px; color: #1f2937; }
        ul { list-style: none; }
        li { font-size: 11px; color: #1f2937; margin-bottom: 6px; padding-left: 11px; position: relative; }
        li::before { content: "-"; position: absolute; left: 0; color: #6b7280; }
        .job-title { font-weight: 700; color: #111827; }
        .company { font-size: 10.5px; color: #4b5563; }
        .project-tech { font-size: 10px; color: #6b7280; }
        @media print {
            body { padding: 22px 24px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${d.name}</h1>
        <div class="title">${d.title}</div>
        <div class="contact-info">
            <span>${d.email}</span>
            <span>${d.phone}</span>
            <span>${d.location}</span>
        </div>
        <div class="links">
            ${d.websiteUrl ? `<a href="${d.websiteUrl}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
            ${d.socialLinks.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join('')}
        </div>
    </div>
    
    <h2>Professional Summary</h2>
    <p>${d.summary}</p>
    
    <h2>Technical Skills</h2>
    <p class="skills">${d.skills.join(' | ')}</p>
    
    <h2>Education</h2>
    <ul>
        ${d.education.map(e => `<li><span class="job-title">${e.title}</span> - ${e.school} (${e.year})</li>`).join('')}
    </ul>
    
    <h2>Certifications</h2>
    <ul>
        ${d.certifications.map(c => `<li>${c}</li>`).join('')}
    </ul>
    
    <h2>Projects</h2>
    <ul>
        ${d.projects.map(p => `<li><span class="job-title">${p.name}</span><br><span class="project-tech">${p.tech}</span><br>${p.desc}</li>`).join('')}
    </ul>
    
    <h2>Work Experience</h2>
    <ul>
        ${d.experience.map(e => `<li><span class="job-title">${e.title}</span> - ${e.company} (${e.year})</li>`).join('')}
    </ul>
    
    <h2>Languages</h2>
    <p class="skills">${d.languages.join(' | ')}</p>
</body>
</html>`;
}

function getCreativeCV(d) {
    return `<!DOCTYPE html>
<html>
<head>
    <title>${d.name} - CV</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        @page { size: A4; margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Poppins', sans-serif;
            width: 210mm;
            min-height: 297mm;
            padding: 35px;
            color: #2d3748; 
            line-height: 1.5;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .page { background: white; border-radius: 14px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.15); min-height: calc(297mm - 70px); display: grid; grid-template-columns: 34% 66%; }
        .sidebar { background: linear-gradient(180deg, #4c1d95, #1d4ed8); color: #fff; padding: 24px 18px; }
        .main { padding: 24px 24px 20px; }
        .header h1 { font-size: 23px; font-weight: 700; line-height: 1.2; margin-bottom: 4px; }
        .header .title { font-size: 11px; opacity: 0.95; margin-bottom: 12px; letter-spacing: 1px; text-transform: uppercase; }
        .contact-row { display: grid; gap: 6px; font-size: 10px; }
        .contact-row span { display: block; }
        .links { margin-top: 10px; display: grid; gap: 6px; }
        .links a { font-size: 10px; color: #fff; text-decoration: none; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.28); border-radius: 999px; padding: 3px 8px; width: fit-content; }
        .section-title-left { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 14px 0 7px; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill-tag { background: rgba(255,255,255,0.16); color: #fff; padding: 4px 8px; border-radius: 999px; font-size: 10px; }
        ul { list-style: none; }
        li { font-size: 10px; margin-bottom: 8px; line-height: 1.4; }
        .main h2 { font-size: 12px; font-weight: 700; color: #4c1d95; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
        .main section + section { margin-top: 12px; }
        .main p, .main li { color: #374151; font-size: 11px; }
        .main li { padding-left: 12px; position: relative; margin-bottom: 7px; }
        .main li::before { content: "•"; position: absolute; left: 0; color: #4c1d95; }
        .job-title { font-weight: 600; color: #1f2937; }
        .company { font-size: 10px; color: #6b7280; }
        @media print {
            body { padding: 0; background: #fff; }
            .page { box-shadow: none; border-radius: 0; min-height: 297mm; }
        }
    </style>
</head>
<body>
    <div class="page">
        <aside class="sidebar">
            <div class="header">
                <h1>${d.name}</h1>
                <div class="title">${d.title}</div>
                <div class="contact-row">
                    <span>${d.email}</span>
                    <span>${d.phone}</span>
                    <span>${d.location}</span>
                </div>
                <div class="links">
                    ${d.websiteUrl ? `<a href="${d.websiteUrl}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
                    ${d.socialLinks.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join('')}
                </div>
            </div>

            <h3 class="section-title-left">Skills</h3>
            <div class="skills-grid">
                ${d.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>

            <h3 class="section-title-left">Certifications</h3>
            <ul>${d.certifications.map(c => `<li>${c}</li>`).join('')}</ul>

            <h3 class="section-title-left">Languages</h3>
            <ul>${d.languages.map(l => `<li>${l}</li>`).join('')}</ul>
        </aside>

        <main class="main">
            <section>
                <h2>About Me</h2>
                <p>${d.summary}</p>
            </section>

            <section>
                <h2>Education</h2>
                <ul>
                    ${d.education.map(e => `<li><span class="job-title">${e.title}</span><br><span class="company">${e.school} - ${e.year}</span></li>`).join('')}
                </ul>
            </section>

            <section>
                <h2>Projects</h2>
                <ul>
                    ${d.projects.map(p => `<li><span class="job-title">${p.name}</span><br><span class="company">${p.tech}</span><br>${p.desc}</li>`).join('')}
                </ul>
            </section>

            <section>
                <h2>Experience</h2>
                <ul>
                    ${d.experience.map(e => `<li><span class="job-title">${e.title}</span><br><span class="company">${e.company} - ${e.year}</span></li>`).join('')}
                </ul>
            </section>
        </main>
    </div>
</body>
</html>`;
}

// Notes: smart in-view playback + overlay / toolbar for the "How I work" video
(function initNotesWorkVideo() {
    const stage = document.getElementById('notesVideoStage');
    const video = document.getElementById('notesWorkVideo');
    const overlay = document.getElementById('notesVideoOverlay');
    const playBtn = document.getElementById('notesVideoPlayBtn');
    const muteBtn = document.getElementById('notesVideoMuteBtn');
    const pipBtn = document.getElementById('notesVideoPipBtn');

    if (!stage || !video || !overlay || !playBtn || !muteBtn) return;

    let ioSilencing = false;
    let userSuspendedAutoplay = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function syncOverlay() {
        const hidden = !video.paused && !video.ended;
        overlay.classList.toggle('is-hidden', hidden);
        overlay.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    }

    function syncMuteButton() {
        muteBtn.setAttribute('aria-pressed', video.muted ? 'true' : 'false');
        muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
        const icon = muteBtn.querySelector('i');
        if (icon) {
            icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
    }

    if (pipBtn && document.pictureInPictureEnabled && typeof video.requestPictureInPicture === 'function') {
        pipBtn.hidden = false;
    }

    video.addEventListener('play', () => {
        userSuspendedAutoplay = false;
        syncOverlay();
        syncMuteButton();
    });

    video.addEventListener('pause', () => {
        if (!ioSilencing && !video.ended) {
            userSuspendedAutoplay = true;
        }
        syncOverlay();
    });

    video.addEventListener('ended', syncOverlay);
    video.addEventListener('volumechange', syncMuteButton);

    playBtn.addEventListener('click', () => {
        video.muted = false;
        video.play().catch(() => {});
        playBtn.blur();
    });

    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        syncMuteButton();
    });

    if (pipBtn) {
        pipBtn.addEventListener('click', async () => {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else if (video.requestPictureInPicture) {
                    await video.requestPictureInPicture();
                }
            } catch (_) {
                /* PiP not allowed or unsupported */
            }
        });
    }

    const io = new IntersectionObserver(
        ([entry]) => {
            const vis = Boolean(entry && entry.isIntersecting);
            stage.classList.toggle('is-inview', vis);

            if (reduceMotion) {
                return;
            }

            if (!vis) {
                ioSilencing = true;
                video.pause();
                ioSilencing = false;
                return;
            }

            if (userSuspendedAutoplay) {
                return;
            }

            video.muted = true;
            video.play()
                .then(() => {
                    syncOverlay();
                    syncMuteButton();
                })
                .catch(() => {});
        },
        { threshold: 0.36, rootMargin: '0px 0px -6% 0px' }
    );

    io.observe(stage);

    syncOverlay();
    syncMuteButton();
})();