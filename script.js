    (function () {
      var bot = document.querySelector('.bot'), cap = document.querySelector('.bot-cap');
      if (!bot || !cap) return;
      var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      var states = [
        { k: 'listen', t: 'Listening', s: 'to your workflow' },
        { k: 'think', t: 'Thinking', s: 'about the design' },
        { k: 'build', t: 'Building', s: 'the solution' },
        { k: 'deploy', t: 'Deploying', s: 'to production' }
      ];
      if (reduce) return;
      var i = 0;
      setInterval(function () {
        if (document.hidden) return;
        i = (i + 1) % states.length;
        cap.classList.add('swap');
        setTimeout(function () {
          bot.dataset.state = states[i].k;
          cap.innerHTML = '<b>' + states[i].t + '</b><span>' + states[i].s + '</span>';
          cap.classList.remove('swap');
        }, 220);
      }, 3200);

      var edu = document.querySelector('.edu-card');
      if (edu) edu.addEventListener('pointermove', function (e) { var r = edu.getBoundingClientRect(); edu.style.setProperty('--mx', (e.clientX - r.left) + 'px'); edu.style.setProperty('--my', (e.clientY - r.top) + 'px'); });

      // eyes follow the cursor
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var eyes = bot.querySelectorAll('.eye');
        window.addEventListener('pointermove', function (e) {
          var r = bot.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
          var d = Math.max(Math.hypot(dx, dy), 1), k = Math.min(d / 320, 1);
          var x = (dx / d * 0.9 * k).toFixed(2) + 'cqw', y = (dy / d * 0.8 * k).toFixed(2) + 'cqw';
          eyes.forEach(function (el) { el.style.setProperty('--lx', x); el.style.setProperty('--ly', y); });
        }, { passive: true });
      }
    })();

    /* ===== Add your projects here. Copy one block per project. =====
       images: screenshot paths, e.g. "assets/projects/shop-1.webp" (first one is the thumbnail)
       tags:   any of "laravel", "react", "ai", "live"
       live:   live site URL, or "" if none      source: repository URL, or "" if private */
    var PROJECTS = [
  {
    "title": "SyncPOS",
    "kind": "Multi-tenant SaaS point of sale",
    "year": "2026",
    "summary": "Point-of-sale platform for retail chains and restaurants with many branches, built to keep selling offline on web, phones and tablets.",
    "platforms": "Web POS and back office, iOS and Android register app, restaurant app, super-admin panel",
    "tags": [
      "laravel",
      "react",
      "mobile",
      "live"
    ],
    "stack": [
      "Laravel 13",
      "Next.js 16",
      "React Native",
      "PostgreSQL 18",
      "PHP 8.3",
      "React 19",
      "TypeScript",
      "Tailwind 4",
      "Expo",
      "Redis",
      "Laravel Reverb",
      "Playwright",
      "Vitest"
    ],
    "features": [
      "Web POS with a till register and a visual product register",
      "Offline selling on web and mobile with idempotent sync and price-history checks",
      "Inventory with batch, lot and serial tracking, per-batch pricing and stock valuation",
      "Product catalog with CSV import, photos, category tree and minimum selling price rules",
      "Purchases, returns, suppliers and customers with account ledgers and statements",
      "Expenses with per-store categories and attachments",
      "Staff, attendance, payroll, salary advances and a self-service portal",
      "Multi-store tenants with per-store roles and real-time permission updates",
      "Plan-based feature gating, tenant management and super-admin impersonation",
      "Restaurant edition: bookings timeline, waitlist, floor plan, kitchen stages and QR menus",
      "Mobile register app with Bluetooth receipt printing",
      "Sales, cash and stock reports with dashboard KPIs"
    ],
    "architecture": [
      "Database per tenant, resolved by subdomain",
      "Shared TypeScript sync core (outbox, cursors, reconciliation) used by web and mobile",
      "Repository pattern with backend-driven option lists and navigation",
      "Restaurant service creates sales only through the POS API with idempotency keys",
      "Real-time updates over WebSockets with Laravel Reverb"
    ],
    "ai": "",
    "images": [
      "assets/projects/syncpos-register.webp",
      "assets/projects/syncpos-1.webp",
      "assets/projects/syncpos-2.webp",
      "assets/projects/syncpos-3.webp",
      "assets/projects/syncpos-4.webp",
      "assets/projects/syncpos-5.webp"
    ],
    "logos": [
      "laravel/laravel-original",
      "nextjs/nextjs-original",
      "react/react-original"
    ],
    "live": "https://syncpos.online",
    "source": "",
    "featured": true
  },
  {
    "title": "SyncPOS Control Room",
    "kind": "AI ops and auto-fix console",
    "year": "2026",
    "summary": "A forward-deployed AI engineering system: every production error is triaged, an AI agent investigates and writes a tested fix as a pull request, and the owner approves it from a phone.",
    "platforms": "Web dashboard, installable phone app (PWA) with push notifications",
    "tags": [
      "ai",
      "react"
    ],
    "stack": [
      "Claude API",
      "Next.js 16",
      "TypeScript",
      "GitHub Actions",
      "Drizzle ORM",
      "PostgreSQL",
      "pg-boss",
      "GlitchTip",
      "Better Auth",
      "WebAuthn passkeys",
      "Web Push",
      "Playwright",
      "Vitest"
    ],
    "features": [
      "Collects every error from the POS back end, web app and mobile app through self-hosted GlitchTip",
      "Incident inbox grouped into \"Needs you\", new, resolved and muted, with events, shops affected and first and last seen",
      "Classifies each incident as code bug, bad data, infrastructure or noise, with a risk level and confidence",
      "Live pipeline per incident: detected, labelled, agent, fix PR, approved, live, watching, resolved",
      "Dispatches a Claude agent on a GitHub Actions runner that reads a brief, installs the project, writes a fix with a test and returns a verdict",
      "Explains its reasoning in plain language, and when it cannot reproduce a bug it says so instead of guessing",
      "\"Talk to the agent\" chat to give it more context so it looks again",
      "Low-risk fixes go to Claude Sonnet and high-risk ones to Claude Opus, with a shadow mode before going live",
      "Owner approves and deploys with a passkey; release watch windows suggest a rollback if errors rise",
      "Data repairs with dry runs and backups, daily agent caps and mute rules",
      "Push notifications on the phone, with Telegram and email as fallback"
    ],
    "architecture": [
      "Separate repository, so the agent working on the POS can never change the system that approves its own fixes",
      "The model never holds a write token: a separate job without a model runs the guard checks and opens the pull request",
      "Every production action needs a permission, a fresh passkey, a power switch and an audit entry written in the same transaction",
      "Error payloads are treated as untrusted text and never reach commands, queries or URLs",
      "Next.js with Drizzle ORM on Postgres and pg-boss workers; idempotent webhooks and actions"
    ],
    "ai": "AI agents triage production errors, investigate the code, write fixes with tests and open pull requests. Nothing merges without a human: high-risk fixes and data repairs always need the owner's approval.",
    "images": [
      "assets/projects/control-room-1.webp",
      "assets/projects/control-room-3.webp",
      "assets/projects/control-room-2.webp"
    ],
    "logos": [
      "nextjs/nextjs-original",
      "typescript/typescript-original",
      "postgresql/postgresql-original"
    ],
    "live": "",
    "source": "",
    "status": "In production",
    "mark": "logo",
    "logo": "assets/projects/control-room-logo.png",
    "markChips": [
      "AI triage",
      "Auto-fix PRs",
      "Human approval"
    ],
    "featured": true
  },
  {
    "title": "Ask SyncPOS",
    "kind": "AI chat and voice assistant",
    "year": "2026",
    "status": "In development",
    "mark": "bot",
    "summary": "An assistant inside the SyncPOS dashboard that answers how-to questions and, with the owner's consent, questions about the store's own sales, till, stock and accounts, by text or voice.",
    "platforms": "Web dashboard panel with voice, super-admin console (mobile app planned)",
    "tags": [
      "ai",
      "laravel",
      "react"
    ],
    "stack": [
      "Gemini",
      "Claude API",
      "Whisper",
      "Laravel 13",
      "Next.js",
      "React 19",
      "PostgreSQL",
      "Redis",
      "Laravel Echo",
      "Web Speech API",
      "OpenAI-compatible APIs"
    ],
    "features": [
      "Streaming answers with live status lines and a retry for recoverable failures",
      "Four languages: English, Urdu, Roman Urdu and Spanish, answered in the language and script of the question",
      "Dictation by default, plus a hands-free voice mode that listens, answers aloud and reopens the mic",
      "Server-side speech-to-text with Gemini audio, Whisper or a free self-hosted Whisper",
      "Spoken answers with live word-by-word captions and pause, resume and speed controls",
      "Animated robot with 10 expressions whose mouth moves with the spoken words",
      "14 read-only store-data tools: sales, till, low stock, customers, expenses, returns, suppliers, purchases and more",
      "Per-store consent before any store data is read, checked on the server before every tool call",
      "\"Open\" buttons and \"Show me where\", which lights up the menu path to the right screen",
      "Page-aware suggestions, related follow-up questions, feedback and conversation history",
      "Model routing across a pool of keys with failover, plus a help-search mode so the panel never goes dead",
      "Store-data answers verified against the app's own screens: 30 of 30 matched"
    ],
    "architecture": [
      "Reusable assistant engine packaged as a Composer package that reaches the POS only through host contracts",
      "Tools declared with attributes for read-only access, permissions and store data, with strict JSON-schema inputs and query timeouts",
      "Asks return instantly; a Redis queue worker writes the answer and streams it over a private WebSocket, with polling fallback",
      "Answer guard strips invented links, raw URLs and HTML",
      "Graceful behaviour on slow networks and offline, with an error boundary around the panel",
      "Web panel split into a framework-free core and a React layer"
    ],
    "ai": "An LLM tool-calling agent (Gemini, Claude or any OpenAI-compatible model) that answers from the help knowledge base and live store data, with voice in and out.",
    "images": [],
    "logos": [],
    "live": "",
    "source": ""
  },
  {
    "title": "SyncPOS Knowledge Engine",
    "kind": "RAG knowledge base and AI automation",
    "year": "2026",
    "status": "In development",
    "mark": "kb",
    "summary": "The self-updating help knowledge base behind the assistant, in four languages: hybrid search with embeddings, gap detection, and AI-drafted articles and pull requests.",
    "platforms": "Backend service, Artisan commands, GitHub Actions, super-admin Knowledge page",
    "tags": [
      "ai",
      "laravel"
    ],
    "stack": [
      "RAG",
      "Embeddings",
      "PostgreSQL full-text search",
      "Gemini embeddings",
      "OpenAI embeddings",
      "Laravel 13",
      "GitHub Actions",
      "PHPUnit",
      "Vitest"
    ],
    "features": [
      "Help articles kept in git as Markdown: 174 documents per language (articles, glossary and release notes)",
      "Incremental sync that splits each document into section chunks with versioned builds, so every answer traces to its source",
      "768-dimension embeddings with Gemini or OpenAI models",
      "Hybrid ranking that fuses keyword, vector and learned feedback signals with reciprocal rank fusion and a boost for the current screen",
      "Answers cite their source articles and turn screen links into Open buttons",
      "Gap detection: unanswered or down-voted questions go to a \"Needs an article\" queue with personal data masked",
      "One-click AI drafting of new articles from those gaps",
      "After every merge, a workflow rewrites the articles affected by code changes and opens a draft pull request",
      "CI guards block merges that change watched code without updating its article, and enforce screen coverage and translations",
      "Evaluated with 740 retrieval cases at 100% recall@5 and an MRR of 0.961, plus 343 judge-graded answer cases",
      "Paced embedding batches and per-key cost tracking, so rate limits never stop answers"
    ],
    "architecture": [
      "Knowledge layer (chunker, keyword and semantic search, drafter, evaluator) inside the assistant package",
      "Learning from feedback runs as a background job after each answer",
      "Knowledge tables in the central database, conversations in each tenant database",
      "Generated references for every user-facing error message, option list and permission"
    ],
    "ai": "Retrieval-augmented generation with hybrid search, plus AI agents that draft missing articles and keep the docs in sync with the code through pull requests.",
    "images": [],
    "logos": [],
    "live": "",
    "source": ""
  },
  {
    "title": "Donamix",
    "kind": "Social network app",
    "year": "",
    "summary": "Social app with posts, group Chat Hubs, direct messages, voice and video calls, and a coin and gift wallet.",
    "platforms": "Android and iOS (Flutter), web, admin panel, marketing website",
    "tags": [
      "laravel",
      "mobile",
      "ai",
      "live"
    ],
    "stack": [
      "Flutter",
      "Laravel 12",
      "Go",
      "MySQL",
      "Dart",
      "MongoDB",
      "Redis",
      "Kafka",
      "Agora",
      "Firebase",
      "Stripe",
      "Filament",
      "Docker"
    ],
    "features": [
      "1:1 voice and video calls with Agora, Socket.io signalling and iOS CallKit",
      "Chat Hubs: topic group chats with private chats, typing indicators and moderation tools",
      "Direct inbox with text, media, files, gifts and coin transfers",
      "Posts, reactions, nested comments, reposts and trips with paid featuring",
      "Sign-in with email, phone OTP, Google, Apple and Facebook, plus two-step verification",
      "Payments with Stripe, PayPal, Google Play Billing and StoreKit 2 for subscriptions, coins and gifts",
      "Real-time notifications over WebSockets, push via Firebase and email via Kafka",
      "Discovery: suggested members, filters, daily spotlight and an ambassador programme",
      "Engagement: challenges, daily rewards, in-app games, radio and podcasts",
      "Admin panel for users, moderation, reports, gifts and audit logs"
    ],
    "architecture": [
      "Laravel core API for identity, Go microservices for calls, inbox, notifications, social and payments",
      "Several real-time channels: Socket.io, WebSockets and FCM/VoIP push",
      "Clean Architecture layout in the Go services",
      "Purchases and entitlements confirmed on the server",
      "Docker, Nginx and GitHub Actions deployments"
    ],
    "ai": "AI moderation service that scans profile images with Google Cloud Vision and flags spam through a policy engine, with shadow mode and human review.",
    "images": [
      "assets/projects/donamix-1.png"
    ],
    "logos": [
      "flutter/flutter-original",
      "laravel/laravel-original",
      "go/go-original"
    ],
    "live": "https://donamix.com",
    "source": ""
  },
  {
    "title": "Glass Assist",
    "kind": "Operations platform",
    "year": "",
    "summary": "Job-management platform for a UK windscreen replacement and ADAS calibration business, used by office staff, technicians and sub-contractors.",
    "platforms": "Web back office, technician API for the mobile app, customer pages",
    "tags": [
      "laravel",
      "ai"
    ],
    "stack": [
      "Laravel 8",
      "PHP 8.1",
      "MySQL",
      "Claude API",
      "Redis",
      "Bootstrap 5",
      "Pusher",
      "AWS Textract",
      "Google Maps",
      "SendGrid",
      "Sentry"
    ],
    "features": [
      "Full booking lifecycle: create, clone, allocate technicians, job cards, notes and logs",
      "Windscreen part lookup by registration and DVLA vehicle lookup",
      "ADAS calibration certificates generated as PDFs",
      "Supplier invoice import with automatic field extraction and job cost calculation",
      "Coverage map, routes matrix and postcode-neighbour analysis for sub-contractors",
      "Sub-contractor management with documents, services and insurance expiry reminders",
      "Stock and asset management with assignments, returns and daily exports",
      "Fleet management with maintenance history, courtesy cars and telematics sync",
      "Customer SMS and email with day-before reminders, delivery tracking and NPS surveys",
      "Real-time notifications, roles and permissions, activity and login logs"
    ],
    "architecture": [
      "Controller, service and repository layers with documented SOLID rules",
      "Swappable lookup drivers behind interfaces (glass, vehicle, postcode, geocoding)",
      "Strategy pattern for invoice extraction drivers",
      "DTOs, enums, events, queued jobs and scheduled automation"
    ],
    "ai": "Supplier invoices (PDF or image) are sent to the Claude API, which returns structured fields used for job costing. AWS Textract and a local parser are interchangeable drivers.",
    "images": [],
    "logos": [
      "laravel/laravel-original",
      "php/php-original",
      "mysql/mysql-original"
    ],
    "live": "",
    "source": ""
  },
  {
    "title": "Pepper",
    "kind": "Lead management SaaS",
    "year": "",
    "summary": "Multi-tenant lead-management and marketing platform for gyms and fitness clubs, with CRM sync, campaigns and appointment booking.",
    "platforms": "Web app, agency admin, Android and iOS build, REST API",
    "tags": [
      "laravel",
      "mobile",
      "ai"
    ],
    "stack": [
      "Symfony 6",
      "API Platform",
      "Angular 17",
      "PostgreSQL",
      "PHP 8",
      "Tailwind",
      "Python",
      "Ollama",
      "Docker",
      "Kubernetes"
    ],
    "features": [
      "Contacts, activities and follow-ups with a next-follow-up engine and workflow scenarios",
      "Marketing plans, campaigns, offers and tags with deploy and cancel flows",
      "Appointment booking widget on the GoHighLevel calendar API",
      "Two-way CRM sync with Deciplus and Sportigo, with logs, retries and overlap guards",
      "SMS through Twilio and OVH, email through Mailgun and SendGrid",
      "Push notifications and real-time updates with OneSignal and Mercure",
      "Analytics for appointments, follow-ups and club performance with Excel export",
      "Billing and business contracts",
      "Brand identity questionnaire per club"
    ],
    "architecture": [
      "API-first Symfony and API Platform application",
      "Asynchronous work on Symfony Messenger (SMS, email, CRM, webhooks)",
      "CRM provider adapters behind orchestrators",
      "Docker, Kubernetes with Helm, GitLab CI and SonarQube"
    ],
    "ai": "Onboarding pilot that drafts a club profile from tasks, briefs, emails and documents using OCR and a local LLM (Ollama), with PII redaction, conflict detection and manager review.",
    "images": [],
    "logos": [
      "symfony/symfony-original",
      "angular/angular-original",
      "postgresql/postgresql-original"
    ],
    "live": "",
    "source": ""
  },
  {
    "title": "Allô",
    "kind": "Speed-to-lead call console",
    "year": "",
    "summary": "Helps gym staff call back new ad leads in under five minutes, with a prioritised call queue, follow-up cadences and metrics.",
    "platforms": "Embedded web console, PWA, Android and iOS (Capacitor)",
    "tags": [
      "react",
      "mobile"
    ],
    "stack": [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "PostgreSQL 17",
      "Tailwind 4",
      "Redis",
      "BullMQ",
      "Capacitor",
      "Vitest"
    ],
    "features": [
      "Call queue prioritised by delay with a five-minute target and lead screen-pop",
      "One-tap calling and one-tap outcome logging",
      "Phone pairing by QR code",
      "Follow-up cadences across calls, SMS, WhatsApp and email",
      "In-house WhatsApp engine with inbound replies and media",
      "Guided call qualification with rule-based suggestions and coach briefs",
      "Appointments written to the CRM calendar, plus CRM status sync",
      "Web push and FCM notifications with real-time updates over SSE",
      "Speed-to-lead and funnel metrics with a multi-club agency view"
    ],
    "architecture": [
      "Multi-tenant with Postgres row-level security verified in CI",
      "Cadence scheduling in Postgres with a 60-second sweep, Redis for short jobs and pub/sub",
      "Real-time path: Postgres LISTEN/NOTIFY to Redis to SSE",
      "Docker Compose, Caddy and GitHub Actions"
    ],
    "ai": "",
    "images": [
      "assets/projects/allo-1.png",
      "assets/projects/allo-2.png",
      "assets/projects/allo-3.png",
      "assets/projects/allo-4.png"
    ],
    "logos": [
      "nextjs/nextjs-original",
      "react/react-original",
      "postgresql/postgresql-original"
    ],
    "live": "",
    "source": ""
  },
  {
    "title": "Infosha",
    "kind": "Caller ID and social app",
    "year": "",
    "summary": "Phone-number based caller-ID and social app: see the names others saved for a number, plus reviews, ratings and profiles.",
    "platforms": "Android and iOS (Flutter), Laravel API, web admin",
    "tags": [
      "laravel",
      "mobile",
      "live"
    ],
    "stack": [
      "Flutter",
      "Laravel 9",
      "MySQL",
      "Redis",
      "PHP 8.2",
      "Dart",
      "Firebase",
      "Pusher",
      "Stripe",
      "Braintree",
      "Twilio",
      "AWS S3"
    ],
    "features": [
      "OTP sign-up with Twilio Verify plus Google and Firebase sign-in",
      "Contact sync and saved-name lookup by number, including incoming calls",
      "Incoming-call overlay on Android",
      "Profiles for unregistered numbers with bio, links and nicknames",
      "Activity feed with reactions, comments, replies and a daily featured feed",
      "Followers, mutual connections and \"People you may know\" suggestions",
      "Reviews and ratings with images, spam reports, blocking and reporting",
      "Profile visitors, top-100 and leaderboard lists",
      "Paid tiers with Stripe and Braintree, webhooks and reconciliation jobs",
      "Four languages and store-compliant account deletion"
    ],
    "architecture": [
      "Feed API refactored into repository and service layers with N+1 fixes and Redis caching",
      "About 25 scheduled commands for counts, suggestions and reconciliation",
      "Queued jobs for contact and photo processing, plus an S3 image migration",
      "Production hardening: database indexes, timeout tuning, Nginx cutover and Slack health alerts"
    ],
    "ai": "",
    "images": [],
    "logos": [
      "flutter/flutter-original",
      "laravel/laravel-original",
      "firebase/firebase-original"
    ],
    "live": "https://play.google.com/store/apps/details?id=com.ktech.infosha",
    "source": ""
  },
  {
    "title": "London Legacy",
    "kind": "E-commerce store",
    "year": "",
    "summary": "Online store for London souvenirs and gifts, with a full admin panel for catalogue, multi-location stock, orders and content.",
    "platforms": "Responsive web storefront and admin panel",
    "tags": [
      "laravel",
      "react"
    ],
    "stack": [
      "Laravel 12",
      "React 19",
      "Inertia",
      "TypeScript",
      "PHP 8.2",
      "Tailwind 4",
      "MySQL",
      "Laravel Reverb",
      "Pest",
      "AWS S3"
    ],
    "features": [
      "Product wizard for simple and configurable products with generated variants",
      "Multi-location stock with transfers and a full audit log",
      "Per-product stock rules: backorders, sale quantity limits and low-stock alerts",
      "Prices in the visitor's currency with daily exchange-rate updates",
      "Guest cart merged into the account on login",
      "Four-step checkout with saved addresses",
      "Order status workflow with history and queued confirmation emails",
      "Customer account area with orders, profile and addresses",
      "Blog with rich-text editing and galleries, plus CMS pages",
      "Roles and permissions with live updates over WebSockets and two-factor login"
    ],
    "architecture": [
      "Inertia application: Laravel controllers render React pages",
      "Service and repository layers bound to interfaces",
      "Swappable geo-location and exchange-rate providers",
      "Pest test suite and GitHub Actions deployment"
    ],
    "ai": "",
    "images": [
      "assets/projects/londonlegacy-1.jpg"
    ],
    "logos": [
      "laravel/laravel-original",
      "react/react-original",
      "tailwindcss/tailwindcss-original"
    ],
    "live": "",
    "source": ""
  },
  {
    "title": "stage-two-screening",
    "kind": "Laravel application",
    "year": "2022",
    "summary": "Authentication module with user logic kept in a dedicated service class.",
    "platforms": "Web",
    "tags": [
      "laravel"
    ],
    "stack": [
      "Laravel",
      "PHP",
      "Authentication",
      "Service layer"
    ],
    "features": [
      "Registration and login",
      "Password reset and email verification",
      "UserService injected into the controller"
    ],
    "architecture": [],
    "ai": "",
    "images": [],
    "logos": [
      "laravel/laravel-original",
      "php/php-original"
    ],
    "live": "",
    "source": "https://github.com/mzohaib79/stage-two-screening"
  }
];

    (function () {
      var D = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/';
      var featRow = document.getElementById('featuredRow'), track = document.getElementById('carTrack'), dotsWrap = document.getElementById('carDots'), carousel = document.getElementById('carousel');
      var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      var modal = document.getElementById('projectModal');
      var esc = function (t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; };

      var BOT = '<div class="mark-bot"><div class="bot" data-state="listen"><svg class="bot-ring" viewBox="0 0 100 100"><circle class="track" cx="50" cy="50" r="46"/><circle class="arc" cx="50" cy="50" r="46" pathLength="100"/></svg><span class="pulse"></span><span class="pulse p2"></span><div class="head"><span class="antenna"></span><span class="ear l"></span><span class="ear r"></span><div class="face"><div class="eyes"><span class="eye"></span><span class="eye"></span></div><div class="mouth"><i></i><i></i><i></i><i></i><i></i></div></div></div></div><span class="mark-name">Ask SyncPOS</span></div>';
      var KB = '<div class="mark-kb"><div class="kb-tile"><i class="ph-fill ph-books"></i><i class="ph-fill ph-sparkle kb-s"></i></div><span class="mark-name">Knowledge Engine</span><div class="kb-chips"><span>Embeddings</span><span>Hybrid search</span><span>AI drafts</span></div></div>';
      function cover(p, big) {
        if (p.mark === 'bot') return '<div class="cover cover-mark">' + BOT + '</div>';
        if (p.mark === 'kb') return '<div class="cover cover-mark">' + KB + '</div>';
        if (p.mark === 'logo') return '<div class="cover cover-mark"><div class="mark-kb"><img class="mark-logo" src="' + p.logo + '" alt=""><span class="mark-name">' + esc(p.title) + '</span><div class="kb-chips">' + (p.markChips || []).map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div></div></div>';
        var logos = (p.logos || []).map(function (l) { var fx = /symfony/.test(l) ? ' class="inv"' : (/mysql/.test(l) ? ' class="lift"' : ''); return '<span><img src="' + D + l + '.svg" alt=""' + fx + '></span>'; }).join('');
        return '<div class="cover"><span class="cv-kind">' + esc(p.kind) + '</span><span class="cv-title">' + esc(p.title) + '</span><div class="cv-logos">' + logos + '</div></div>';
      }

      function card(p, i) {
        var a = document.createElement('article');
        a.className = 'pcard rv in' + (p.slot ? ' pslot' : '') + (p.featured ? ' featured' : '');
        a.dataset.tags = p.tags.join(' ');
        if (p.slot) {
          a.innerHTML = '<div class="pthumb" style="cursor:default"><div class="slot-art"><div><i class="ph ph-image-square"></i>Screenshot of your project</div></div></div>' +
            '<div class="pbody"><div class="ptop"><h3 class="todo">Project title</h3></div><p class="todo">One line about what you built and the result</p><ul class="tags">' +
            p.tags.map(function (t) { return '<li>' + ({ laravel: 'Laravel', react: 'React', ai: 'AI', live: 'Live site', mobile: 'Mobile' }[t] || t) + '</li>'; }).join('') + '</ul></div>';
          return a;
        }
        var thumb = p.images.length ? '<img src="' + p.images[0] + '" alt="" loading="lazy">' : cover(p);
        var live = (p.live ? '<span class="live-badge"><i></i>Live</span>' : (p.status ? '<span class="live-badge' + (/production/i.test(p.status) ? '' : ' dev') + '"><i></i>' + esc(p.status) + '</span>' : '')) + (p.ai ? '<span class="ai-badge"><i class="ph-fill ph-sparkle"></i>AI</span>' : '');
        var icons = (p.live ? '<a href="' + p.live + '" target="_blank" rel="noopener" aria-label="Open live site"><i class="ph ph-globe"></i></a>' : '') +
                    (p.source ? '<a href="' + p.source + '" target="_blank" rel="noopener" aria-label="View source code"><i class="ph ph-github-logo"></i></a>' : '');
        a.innerHTML = '<button class="pthumb" type="button" aria-label="Open details for ' + esc(p.title) + '">' + live + thumb +
          '<span class="pview"><span><i class="ph ph-arrows-out-simple"></i>View project</span></span></button>' +
          '<div class="pbody"><div class="ptop"><h3>' + esc(p.title) + '</h3><div class="picons">' + icons + '</div></div><p>' + esc(p.summary) + '</p><ul class="tags">' +
          p.stack.slice(0, 4).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + (p.stack.length > 4 ? '<li>+' + (p.stack.length - 4) + '</li>' : '') + '</ul></div>';
        a.querySelector('.pthumb').addEventListener('click', function () { openModal(p); });
        return a;
      }

      PROJECTS.forEach(function (p, i) { (p.featured ? featRow : track).appendChild(card(p, i)); });

      // carousel: three cards per view on desktop, arrows, dots, swipe, gentle auto-play
      var GAP = 20, paused = false;
      function shown() { return [].slice.call(track.querySelectorAll('.pcard')).filter(function (c) { return !c.hidden; }); }
      function step() { var c = shown()[0]; return c ? c.getBoundingClientRect().width + GAP : track.clientWidth; }
      function perView() { return Math.max(1, Math.round((track.clientWidth + GAP) / step())); }
      function pageCount() { return Math.max(1, Math.ceil(shown().length / perView())); }
      function currentPage() { var w = step() * perView(); return w ? Math.min(pageCount() - 1, Math.round(track.scrollLeft / w)) : 0; }
      function goTo(pg) {
        var n = pageCount();
        if (pg < 0) pg = n - 1;
        if (pg >= n) pg = 0;
        track.scrollTo({ left: pg * perView() * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      function syncDots() {
        var pg = currentPage();
        dotsWrap.querySelectorAll('button').forEach(function (d, k) { d.setAttribute('aria-current', k === pg ? 'true' : 'false'); });
      }
      function buildDots() {
        var n = pageCount();
        dotsWrap.innerHTML = '';
        for (var k = 0; k < n; k++) {
          var d = document.createElement('button');
          d.type = 'button';
          d.setAttribute('aria-label', 'Show project group ' + (k + 1) + ' of ' + n);
          d.addEventListener('click', (function (k) { return function () { goTo(k); }; })(k));
          dotsWrap.appendChild(d);
        }
        dotsWrap.hidden = n < 2;
        carousel.querySelector('.car-nav').style.visibility = n < 2 ? 'hidden' : '';
        syncDots();
      }
      carousel.querySelector('.car-prev').addEventListener('click', function () { goTo(currentPage() - 1); });
      carousel.querySelector('.car-next').addEventListener('click', function () { goTo(currentPage() + 1); });
      var ticking = false;
      track.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; syncDots(); }); } }, { passive: true });
      carousel.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentPage() - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentPage() + 1); } });
      ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { carousel.addEventListener(ev, function () { paused = true; }, { passive: true }); });
      ['mouseleave', 'focusout'].forEach(function (ev) { carousel.addEventListener(ev, function () { paused = false; }); });
      if (!reduceMotion) setInterval(function () { if (!paused && !document.hidden && !document.getElementById('projectModal').open && pageCount() > 1) goTo(currentPage() + 1); }, 6000);
      window.addEventListener('resize', buildDots);
      buildDots();

      // filters with counts (apply to the featured row and the carousel)
      var buttons = document.querySelectorAll('.filters button');
      buttons.forEach(function (b) {
        var f = b.dataset.filter;
        b.querySelector('span').textContent = PROJECTS.filter(function (p) { return f === 'all' || p.tags.indexOf(f) !== -1; }).length;
        b.addEventListener('click', function () {
          buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          var match = function (c) { return f === 'all' || c.dataset.tags.split(' ').indexOf(f) !== -1; };
          featRow.querySelectorAll('.pcard').forEach(function (c) { c.hidden = !match(c); });
          track.querySelectorAll('.pcard').forEach(function (c) { c.hidden = !match(c); });
          var nf = featRow.querySelectorAll('.pcard:not([hidden])').length;
          featRow.hidden = nf === 0;
          featRow.classList.toggle('single', nf === 1);
          carousel.hidden = shown().length === 0;
          track.scrollLeft = 0;
          buildDots();
        });
      });

      // detail dialog: fixed header with links, one scrolling body (gallery, overview, features, facts)
      var stage = document.getElementById('pmStage'), thumbs = document.getElementById('pmThumbs'), count = document.getElementById('pmCount'), body = document.getElementById('pmBody'), cur = 0, slides = [];
      function show(n) {
        if (!slides.length) return;
        cur = (n + slides.length) % slides.length;
        slides.forEach(function (s, k) { s.classList.toggle('on', k === cur); s.setAttribute('aria-hidden', k === cur ? 'false' : 'true'); });
        thumbs.querySelectorAll('button').forEach(function (t, k) {
          t.setAttribute('aria-current', k === cur ? 'true' : 'false');
          if (k === cur) thumbs.scrollTo({ left: t.offsetLeft - thumbs.clientWidth / 2 + t.offsetWidth / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        count.textContent = (cur + 1) + ' / ' + slides.length;
      }
      function li(t) { return '<li><i class="ph-bold ph-check"></i><span>' + esc(t) + '</span></li>'; }
      function openModal(p) {
        var isPlay = p.live && p.live.indexOf('play.google') > -1;
        document.getElementById('pmKind').textContent = p.kind;
        document.getElementById('pmTitle').textContent = p.title;
        document.getElementById('pmLinks').innerHTML =
          (p.live ? '<a class="btn accent" href="' + p.live + '" target="_blank" rel="noopener" aria-label="' + (isPlay ? 'Open on Google Play' : 'Open live site') + '"><i class="ph ' + (isPlay ? 'ph-google-play-logo' : 'ph-arrow-up-right') + '"></i><span>' + (isPlay ? 'Google Play' : 'Live site') + '</span></a>' : '') +
          (p.source ? '<a class="btn" href="' + p.source + '" target="_blank" rel="noopener" aria-label="View source code"><i class="ph ph-github-logo"></i><span>Source code</span></a>' : '');
        document.getElementById('pmSummary').textContent = p.summary;
        var aiBox = document.getElementById('pmAI'); aiBox.hidden = !p.ai; aiBox.querySelector('p').textContent = p.ai || '';
        document.getElementById('pmFeatures').innerHTML = p.features.map(li).join('');
        var arch = p.architecture || []; document.getElementById('pmArchWrap').hidden = !arch.length;
        document.getElementById('pmArch').innerHTML = arch.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
        var status = p.live ? '<span class="st"><i></i>Live</span>' : (p.status ? '<span class="st' + (/production/i.test(p.status) ? '' : ' dev') + '"><i></i>' + esc(p.status) + '</span>' : '');
        var facts = [['Year', p.year && esc(p.year)], ['Status', status], ['Platforms', p.platforms && esc(p.platforms)]];
        document.getElementById('pmFacts').innerHTML = facts.filter(function (f) { return f[1]; }).map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('');
        document.getElementById('pmStack').innerHTML = p.stack.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
        var items = p.images.length ? p.images.map(function (src, k) { return '<div class="pm-slide"><img src="' + src + '" alt="' + esc(p.title) + ' screenshot ' + (k + 1) + ' of ' + p.images.length + '"' + (k ? ' loading="lazy"' : '') + '></div>'; })
                                    : ['<div class="pm-slide">' + cover(p) + '</div>'];
        stage.innerHTML = items.join('');
        slides = [].slice.call(stage.querySelectorAll('.pm-slide'));
        var multi = slides.length > 1;
        thumbs.innerHTML = multi ? p.images.map(function (src, k) { return '<button type="button" aria-label="Show screenshot ' + (k + 1) + '"><img src="' + src + '" alt="" loading="lazy"></button>'; }).join('') : '';
        thumbs.querySelectorAll('button').forEach(function (t, k) { t.addEventListener('click', function () { show(k); }); });
        modal.querySelectorAll('.pm-nav').forEach(function (b) { b.hidden = !multi; });
        thumbs.hidden = !multi; count.hidden = !multi;
        modal.showModal();
        body.scrollTop = 0;
        show(0);
      }
      document.querySelectorAll('.ab-ledger [data-project]').forEach(function (b) { b.addEventListener('click', function () { var p = PROJECTS.filter(function (x) { return x.title === b.dataset.project; })[0]; if (p) openModal(p); }); });
      modal.querySelector('.pm-nav.prev').addEventListener('click', function () { show(cur - 1); });
      modal.querySelector('.pm-nav.next').addEventListener('click', function () { show(cur + 1); });
      modal.querySelector('.pm-close').addEventListener('click', function () { modal.close(); });
      modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
      modal.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); } });
      // swipe between screenshots on touch screens
      var sx = null;
      stage.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') sx = e.clientX; });
      stage.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); });
      stage.addEventListener('pointercancel', function () { sx = null; });
    })();

    // scroll motion: assigns entrance styles and staggers, then reveals on scroll
    (function () {
      var root = document.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      var $$ = function (sel, ctx) { return [].slice.call((ctx || document).querySelectorAll(sel)); };
      function tag(el, a, d) { if (!el) return; el.classList.remove('rv', 'in'); el.dataset.a = a; if (d) el.style.setProperty('--d', d + 'ms'); }
      function group(sel, a, step, base, mod) { $$(sel).forEach(function (el, i) { tag(el, a, (base || 0) + (mod ? i % mod : i) * step); }); }
      function split(el, wd) {
        if (!el) return;
        var i = 0;
        (function walk(node) {
          [].slice.call(node.childNodes).forEach(function (n) {
            if (n.nodeType === 1) return walk(n);
            if (n.nodeType !== 3 || !n.textContent.trim()) return;
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (w) {
              if (!w) return;
              if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
              var o = document.createElement('span'), inner = document.createElement('span');
              o.className = 'sw'; inner.textContent = w; inner.style.setProperty('--wi', i++); o.appendChild(inner); frag.appendChild(o);
            });
            n.parentNode.replaceChild(frag, n);
          });
        })(el);
        el.classList.add('split'); el.dataset.a = 'none';
        if (wd) el.style.setProperty('--wd', wd + 'ms');
      }

      // section titles: words rise, subtitle follows
      $$('.sec-title').forEach(function (t) { tag(t, 'none'); var h = t.querySelector('h2'), p = t.querySelector('p'); if (h) split(h); if (p) tag(p, 'up', 220); });
      // overview
      tag(document.querySelector('.stats'), 'none'); group('.stats .stat', 'up', 90);
      var about = document.querySelector('.about');
      if (about) { tag(about, 'none'); tag(about.querySelector('.ab-text > .k'), 'up'); split(about.querySelector('.ab-h'), 80); group('.ab-text p', 'up', 120, 300); tag(about.querySelector('.now'), 'up', 520); tag(about.querySelector('.ab-ledger-h'), 'up', 100); }
      tag(document.querySelector('.stk'), 'scale');
      tag(document.querySelector('.stk-ai .stk-k'), 'up', 120); group('.stk-ai li', 'pop', 60, 200);
      $$('.stk-col').forEach(function (c, ci) { tag(c, 'up', 150 + ci * 90); $$('li', c).forEach(function (li, k) { tag(li, 'pop', 320 + ci * 90 + k * 70); }); });
      var av = document.querySelector('.avail'); if (av) { tag(av, 'up'); group('.av-facts > div', 'up', 80, 150); group('.av-ind .tags li', 'pop', 40, 300); }
      // experience timeline: entries slide in, nodes pop, tags follow
      $$('.tl > li').forEach(function (li, i) { tag(li, 'left', i * 120); $$('.tags li', li).forEach(function (t, k) { tag(t, 'pop', i * 120 + 350 + k * 50); }); });
      // projects
      group('.filters button', 'pop', 45);
      group('#featuredRow .pcard', 'scale', 140);
      group('#carTrack .pcard', 'up', 110, 0, 3);
      tag(document.querySelector('.car-head'), 'up');
      // AI lab
      tag(document.querySelector('.ai-stage'), 'scale'); tag(document.querySelector('.ai-lead'), 'up'); group('.note', 'right', 120, 100);
      // skills
      $$('.skillgrid .cell').forEach(function (c, i) { tag(c, 'blur', i * 90); $$('.tags li', c).forEach(function (t, k) { tag(t, 'pop', i * 90 + 250 + k * 30); }); });
      // education and contact
      var edu = document.querySelector('.edu-card'); if (edu) { tag(edu, 'wipe'); tag(edu.querySelector('.edu-plate'), 'spin', 250); }
      var ct = document.querySelector('.contact'); if (ct) { tag(ct, 'wipe'); split(ct.querySelector('h2'), 200); group('.clinks > *', 'right', 90, 300); }

      // reveal on scroll: read every pending box first, then add classes, so there is one layout pass per frame
      var pending = $$('[data-a], .rv'), queued = false;
      function reveal() {
        queued = false;
        var h = innerHeight, w = innerWidth, hit = [];
        pending.forEach(function (e) {
          var r = e.getBoundingClientRect();
          if ((r.width || r.height) && r.top < h * 0.92 && r.bottom > 0 && r.left < w && r.right > 0) hit.push(e);
        });
        if (!hit.length) return;
        hit.forEach(function (e) { e.classList.add('in'); });
        pending = pending.filter(function (e) { return hit.indexOf(e) === -1; });
      }
      function queue() { if (!queued && pending.length) { queued = true; requestAnimationFrame(reveal); } }
      if (reduce) { pending.forEach(function (e) { e.classList.add('in'); }); pending = []; }
      else {
        addEventListener('scroll', queue, { passive: true });
        addEventListener('resize', queue);
        document.addEventListener('click', function () { setTimeout(queue, 60); });
        var track = document.getElementById('carTrack'); if (track) track.addEventListener('scroll', queue, { passive: true });
        addEventListener('load', reveal); document.addEventListener('visibilitychange', reveal);
        reveal();
      }

      // progress bar, back to top ring, hero parallax
      var hero = document.querySelector('.hero'), top = document.querySelector('.to-top'), ticking = false;
      function onScroll() {
        ticking = false;
        var max = root.scrollHeight - innerHeight, y = scrollY;
        root.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
        top.classList.toggle('show', y > 700);
        if (!reduce && hero && y < hero.offsetHeight) hero.style.setProperty('--py', (y * 0.14).toFixed(1) + 'px');
      }
      addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
      onScroll();
      top.addEventListener('click', function () { scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

      // active section pill in the nav
      var nav = document.querySelector('nav'), links = $$('nav a'), ind = document.createElement('span');
      ind.className = 'nav-ind'; nav.insertBefore(ind, nav.firstChild);
      function mark(id) {
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + id; a.classList.toggle('on', on);
          if (on) { ind.style.translate = a.offsetLeft + 'px 0'; ind.style.width = a.offsetWidth + 'px'; ind.style.opacity = 1; }
        });
        if (!id) ind.style.opacity = 0;
      }
      var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }), current = null;
      function spy() {
        var id = '', mid = innerHeight * 0.45;
        targets.forEach(function (t) { if (t && t.getBoundingClientRect().top <= mid) id = t.id; });
        if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4 && targets[targets.length - 1]) id = targets[targets.length - 1].id;
        if (id !== current) { current = id; mark(id); }
      }
      addEventListener('scroll', function () { requestAnimationFrame(spy); }, { passive: true });
      addEventListener('resize', function () { current = null; spy(); });
      spy();
    })();

    // count the headline numbers up once they scroll into view
    (function () {
      var nums = document.querySelectorAll('.stat .n b[data-to]');
      if (!nums.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      nums.forEach(function (n) { n.textContent = '0'; });
      function run(n) {
        var to = +n.dataset.to, t0 = performance.now();
        (function tick(t) {
          var k = Math.min(1, (t - t0) / 900);
          n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      }
      var left = [].slice.call(nums);
      function check() {
        left = left.filter(function (n) { var r = n.getBoundingClientRect(); if (r.top < innerHeight * 0.9 && r.bottom > 0) { run(n); return false; } return true; });
        if (!left.length) removeEventListener('scroll', check);
      }
      addEventListener('scroll', check, { passive: true });
      check();
    })();

    // theme toggle: remembers the visitor's choice, otherwise follows the system setting
    (function () {
      var root = document.documentElement, btn = document.getElementById('themeBtn');
      function label() { btn.setAttribute('aria-label', root.dataset.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'); }
      function saved() { try { return localStorage.getItem('theme'); } catch (e) { return null; } }
      btn.addEventListener('click', function () {
        root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
        try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
        label();
      });
      matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) { if (!saved()) { root.dataset.theme = e.matches ? 'light' : 'dark'; label(); } });
      label();
    })();
