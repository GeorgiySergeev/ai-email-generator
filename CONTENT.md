# CONTENT.md — Text Content & SEO

> Single source of truth for all user-facing text.  
> LLM agents and developers reference this file when building UI components.  
> English (primary) + Russian (i18n).  
> **Brand:** NEUR·O·MAIL (cyberpunk aesthetic)

---

## 1. Landing Page (`/`)

### 1.1 SEO Meta

**English:**
```
title: "NEUROMAIL — Write Better Emails in Seconds"
description: "AI-powered email generation with precision tone control. No writer's block. No generic templates. Just high-signal messages that land every time."
keywords: ["AI email generator", "email writer", "AI writing tool", "professional emails", "email automation"]
og:title: "NEUROMAIL — Write Better Emails in Seconds"
og:description: "AI-powered email generation with precision tone control. Try free — no signup required."
og:image: "/og-image.png" (1200x630)
twitter:card: "summary_large_image"
```

**Russian:**
```
title: "NEUROMAIL — Пишите лучшие письма за секунды"
description: "ИИ-генерация писем с точным контролем тона. Никакого writer's block. Только высококачественные сообщения."
```

---

### 1.2 Hero Section

**Semantic structure:**
```html
<section aria-labelledby="hero-heading">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-copy">
        <div class="eyebrow">// SYS_INITIALIZED · AI EMAIL ENGINE v2.1.0</div>
        <h1 id="hero-heading">...</h1>
        <p>...</p>
        <div class="status-indicators">...</div>
        <div class="cta-group">...</div>
      </div>
      <div class="hero-terminal">...</div>
    </div>
  </div>
</section>
```

**English:**
```
Eyebrow: "// SYS_INITIALIZED · AI EMAIL ENGINE v2.1.0"
H1: "Write Better Emails in Seconds"
Subheadline: "AI-powered email generation with precision tone control. No writer's block. No generic templates. Just high-signal messages that land every time."

Status indicators:
  - "STATUS: ■ ONLINE"
  - "ENGINE: CLAUDE_HAIKU"
  - "UPTIME: 99.9%"

Primary CTA: "GET_ACCESS →"
Secondary CTA: "LIVE_DEMO ↓"

Terminal demo (right side):
  Title: "neuromail://session/demo.01"
  Command: "$ neuromail generate --tone=professional --length=medium"
  Output:
    "→ Initializing engine... ✓"
    "→ Applying tone matrix... ✓"
    "→ Generating output... DONE (1.3s)"
    "OUTPUT ─────────────────"
    "Dear Sarah,
    
    I wanted to share the Q3 performance update. Revenue exceeded targets by 12%, with strong momentum in enterprise. I'd welcome 15 minutes to walk through the highlights.
    
    Best regards,
    Alex"
```

**Russian:**
```
Eyebrow: "// СИСТЕМА_ИНИЦИАЛИЗИРОВАНА · ИИ ДВИЖОК v2.1.0"
H1: "Пишите лучшие письма за секунды"
Subheadline: "ИИ-генерация писем с точным контролем тона. Никакого writer's block. Только высококачественные сообщения."

Status indicators:
  - "СТАТУС: ■ В СЕТИ"
  - "ДВИЖОК: CLAUDE_HAIKU"
  - "АПТАЙМ: 99.9%"

Primary CTA: "ПОЛУЧИТЬ_ДОСТУП →"
Secondary CTA: "ЖИВОЕ_ДЕМО ↓"
```

---

### 1.3 Features Section

**Semantic structure:**
```html
<section id="features" aria-labelledby="features-heading">
  <div class="container">
    <div class="eyebrow">// 01_CAPABILITIES</div>
    <h2 id="features-heading">SYS_CAPABILITIES</h2>
    <div class="features-grid">
      <article>
        <div class="feature-number">[01]</div>
        <h3>...</h3>
        <p>...</p>
      </article>
      <!-- repeat for 6 features -->
    </div>
  </div>
</section>
```

**English:**
```
Section label: "// 01_CAPABILITIES"
H2: "SYS_CAPABILITIES"

Feature 1:
  Number: "[01]"
  Title: "Instant Generation"
  Description: "Sub-2 second drafts via Claude Haiku. From subject line to signature in the time it takes to think."

Feature 2:
  Number: "[02]"
  Title: "Tone Matrix"
  Description: "5 precision modes — Professional, Casual, Formal, Friendly, Persuasive. The right register for every audience."

Feature 3:
  Number: "[03]"
  Title: "Context Engine"
  Description: "Not a template filler. The AI reads intent from your subject and constructs coherent, on-point output every time."

Feature 4:
  Number: "[04]"
  Title: "History Log"
  Description: "Every email saved automatically. Scroll back, copy, or re-generate with new parameters on any past item."

Feature 5:
  Number: "[05]"
  Title: "One-Click Copy"
  Description: "Copy-ready output in a single click. Paste directly into Gmail, Outlook, or any client. Zero formatting loss."

Feature 6:
  Number: "[06]"
  Title: "API Ready"
  Description: "Enterprise plan includes REST API. Integrate AI email generation directly into your own workflows and products."
```

**Russian:**
```
Section label: "// 01_ВОЗМОЖНОСТИ"
H2: "СИСТЕМНЫЕ_ВОЗМОЖНОСТИ"

Feature 1:
  Number: "[01]"
  Title: "Мгновенная генерация"
  Description: "Черновики за 2 секунды через Claude Haiku. От темы до подписи за время, пока вы думаете."

Feature 2:
  Number: "[02]"
  Title: "Матрица тонов"
  Description: "5 режимов точности — Профессиональный, Неформальный, Формальный, Дружелюбный, Убедительный. Правильный регистр для любой аудитории."

Feature 3:
  Number: "[03]"
  Title: "Контекстный движок"
  Description: "Не заполнитель шаблонов. ИИ читает намерение из вашей темы и создает связный, точный вывод каждый раз."

Feature 4:
  Number: "[04]"
  Title: "Журнал истории"
  Description: "Каждое письмо сохраняется автоматически. Прокрутите назад, скопируйте или перегенерируйте с новыми параметрами."

Feature 5:
  Number: "[05]"
  Title: "Копирование в один клик"
  Description: "Готовый к копированию вывод в один клик. Вставляйте напрямую в Gmail, Outlook или любой клиент. Без потери форматирования."

Feature 6:
  Number: "[06]"
  Title: "Готов к API"
  Description: "Enterprise план включает REST API. Интегрируйте ИИ-генерацию писем напрямую в ваши рабочие процессы и продукты."
```

---

### 1.4 Demo Section

**Semantic structure:**
```html
<section id="demo" aria-labelledby="demo-heading">
  <div class="container">
    <div class="eyebrow">// 02_DEMO</div>
    <h2 id="demo-heading">LIVE_DEMO</h2>
    <p>No registration required. Try the generator now.</p>
    <div class="demo-grid">
      <form aria-label="Email generator demo">
        <!-- form fields -->
      </form>
      <div class="output-terminal" aria-live="polite" aria-atomic="true">
        <!-- result -->
      </div>
    </div>
  </div>
</section>
```

**English:**
```
Section label: "// 02_DEMO"
H2: "LIVE_DEMO"
Subheadline: "No registration required. Try the generator now."

Form labels:
  Subject: "01 // SUBJECT LINE"
  Subject placeholder: "What is your email about?"
  Tone: "02 // TONE MATRIX"
  Length: "03 // OUTPUT LENGTH"
  Generate button: "GENERATE_EMAIL →"
  Generating: 
    "→ analyzing subject..."
    "→ applying tone matrix..."
    "→ generating output..."

Result (terminal-style):
  Header: "OUTPUT_STREAM"
  Empty state: "AWAITING INPUT"
  Copy button: "COPY_TO_CLIPBOARD"
  Copied: "COPIED!"

Terminal prompt: "$ "
Cursor: "█" (blinking)
```

**Russian:**
```
Section label: "// 02_ДЕМО"
H2: "ЖИВОЕ_ДЕМО"
Subheadline: "Регистрация не требуется. Попробуйте генератор сейчас."

Form labels:
  Subject: "01 // ТЕМА_ПИСЬМА"
  Subject placeholder: "О чём ваше письмо?"
  Tone: "02 // МАТРИЦА_ТОНОВ"
  Length: "03 // ДЛИНА_ВЫВОДА"
  Generate button: "СГЕНЕРИРОВАТЬ_ПИСЬМО →"
  Generating: 
    "→ анализ темы..."
    "→ применение матрицы тонов..."
    "→ генерация вывода..."

Result (terminal-style):
  Header: "ПОТОК_ВЫВОДА"
  Empty state: "ОЖИДАНИЕ_ВВОДА"
  Copy button: "СКОПИРОВАТЬ_В_БУФЕР"
  Copied: "СКОПИРОВАНО!"
```

---

### 1.5 FAQ Section (7 questions)

**Semantic structure:**
```html
<section aria-labelledby="faq-heading">
  <div class="container">
    <div class="eyebrow">// 05_FAQ</div>
    <h2 id="faq-heading">FREQUENTLY_ASKED</h2>
    <dl>
      <div>
        <dt>
          <button aria-expanded="false" aria-controls="faq-1">
            <h3 id="faq-1-question">...</h3>
          </button>
        </dt>
        <dd id="faq-1" hidden>
          <p>...</p>
        </dd>
      </div>
      <!-- repeat -->
    </dl>
  </div>
</section>
```

**English:**
```
Section label: "// 05_FAQ"
H2: "FREQUENTLY_ASKED"

Q1: "Is NEUROMAIL really free?"
A1: "Yes! You can generate up to 10 emails per month on the Free plan with no credit card required. Upgrade to Pro for unlimited emails."

Q2: "How does the AI generate emails?"
A2: "We use Claude AI (by Anthropic) to analyze your subject and generate contextually relevant emails. You choose the tone and length, and the AI crafts the perfect message."

Q3: "Can I edit the generated emails?"
A3: "Absolutely. The AI gives you a strong starting point. Copy the text, paste it into your email client, and tweak it to match your voice."

Q4: "Is my data secure?"
A4: "Yes. We use Supabase with Row Level Security (RLS) — only you can see your emails. Data is encrypted at rest and in transit. We never sell your data."

Q5: "What languages are supported?"
A5: "Currently English and Russian. We're working on adding Spanish, French, German, and more. The interface supports both English and Russian via language switcher."

Q6: "Can I use this for business emails?"
A6: "Yes! The 'Professional' and 'Formal' tones are perfect for business communication. Many users generate client proposals, follow-ups, and team updates."

Q7: "What if I don't like the generated email?"
A7: "Just click 'Generate another' to get a fresh version. You can also adjust the tone or length, or provide a more specific subject for better results."
```

**Russian:**
```
Section label: "// 05_FAQ"
H2: "ЧАСТО_ЗАДАВАЕМЫЕ"

Q1: "NEUROMAIL действительно бесплатный?"
A1: "Да! Вы можете генерировать до 10 писем в месяц на бесплатном плане без кредитной карты. Обновитесь до Pro для неограниченных писем."

Q2: "Как ИИ генерирует письма?"
A2: "Мы используем Claude AI (от Anthropic) для анализа вашей темы и генерации контекстно-релевантных писем. Вы выбираете тон и длину, а ИИ создает идеальное сообщение."

Q3: "Могу ли я редактировать сгенерированные письма?"
A3: "Конечно. ИИ дает вам сильную отправную точку. Скопируйте текст, вставьте в свой почтовый клиент и подправьте под свой стиль."

Q4: "Безопасны ли мои данные?"
A4: "Да. Мы используем Supabase с Row Level Security (RLS) — только вы видите свои письма. Данные зашифрованы в покое и при передаче. Мы никогда не продаем ваши данные."

Q5: "Какие языки поддерживаются?"
A5: "В настоящее время английский и русский. Мы работаем над добавлением испанского, французского, немецкого и других. Интерфейс поддерживает английский и русский через переключатель языка."

Q6: "Могу ли я использовать это для деловых писем?"
A6: "Да! Тоны 'Профессиональный' и 'Формальный' идеально подходят для делового общения. Многие пользователи генерируют предложения клиентам, follow-up'ы и обновления для команды."

Q7: "Что если мне не нравится сгенерированное письмо?"
A7: "Просто нажмите 'Сгенерировать ещё', чтобы получить новую версию. Вы также можете настроить тон или длину, или указать более конкретную тему для лучших результатов."
```

---

### 1.6 Pricing Preview Section

**Semantic structure:**
```html
<section aria-labelledby="pricing-heading">
  <div class="container">
    <div class="eyebrow">// 04_ACCESS_PASSES</div>
    <h2 id="pricing-heading">ACCESS_LEVELS</h2>
    <p>Start free. Upgrade when you need more.</p>
    <ul role="list">
      <!-- 3 pricing cards -->
    </ul>
    <p>
      <a href="/pricing">VIEW_ALL_PLANS →</a>
    </p>
  </div>
</section>
```

**English:**
```
Section label: "// 04_ACCESS_PASSES"
H2: "ACCESS_LEVELS"
Subheadline: "Start free. Upgrade when you need more. No hidden fees, no lock-in."

CTA link: "VIEW_ALL_PLANS →"
```

**Russian:**
```
Section label: "// 04_УРОВНИ_ДОСТУПА"
H2: "УРОВНИ_ДОСТУПА"
Subheadline: "Начните бесплатно. Обновитесь когда нужно больше. Без скрытых платежей."

CTA link: "ПОСМОТРЕТЬ_ВСЕ_ПЛАНЫ →"
```

---

### 1.7 CTA Section (before footer)

**Semantic structure:**
```html
<section aria-labelledby="cta-heading">
  <div class="container">
    <h2 id="cta-heading">READY_TO_DEPLOY?</h2>
    <p>Join thousands of professionals saving hours every week.</p>
    <a href="/register">GET_ACCESS →</a>
  </div>
</section>
```

**English:**
```
H2: "READY_TO_DEPLOY?"
Subheadline: "Join thousands of professionals saving hours every week with AI-powered email generation."
CTA: "GET_ACCESS →"
```

**Russian:**
```
H2: "ГОТОВЫ_К_ЗАПУСКУ?"
Subheadline: "Присоединяйтесь к тысячам профессионалов, которые экономят часы каждую неделю с помощью ИИ-генерации писем."
CTA: "ПОЛУЧИТЬ_ДОСТУП →"
```

---

## 2. Pricing Page (`/pricing`)

### 2.1 SEO Meta

**English:**
```
title: "Pricing — NEUROMAIL"
description: "Simple pricing: Starter (10 emails/mo free), Professional ($19/mo unlimited), Enterprise ($99/mo API access). Start free, upgrade anytime."
```

**Russian:**
```
title: "Цены — NEUROMAIL"
description: "Простые цены: Starter (10 писем/мес бесплатно), Professional ($19/мес безлимит), Enterprise ($99/мес API доступ)."
```

---

### 2.2 Page Content

**Semantic structure:**
```html
<main>
  <section aria-labelledby="pricing-page-heading">
    <div class="container">
      <div class="eyebrow">// 04_ACCESS_PASSES</div>
      <h1 id="pricing-page-heading">CHOOSE_YOUR_ACCESS_LEVEL</h1>
      <p>Start free. Upgrade when you need more. No hidden fees, no lock-in. Cancel any time.</p>
      <div role="radiogroup" aria-label="Billing period">
        <!-- monthly/yearly toggle -->
      </div>
      <ul role="list">
        <!-- 3 pricing cards -->
      </ul>
    </div>
  </section>
</main>
```

**English:**
```
Section label: "// 04_ACCESS_PASSES"
H1: "CHOOSE_YOUR_ACCESS_LEVEL"
Subheadline: "Start free. Upgrade when you need more. No hidden fees, no lock-in. Cancel any time."

Toggle:
  Monthly: "Monthly"
  Yearly: "Annual"
  Savings badge: "SAVE 20%"

Starter tier:
  Name: "STARTER"
  Price: "$0"
  Period: "/mo"
  Note: "Free forever · no card"
  CTA: "START FREE"
  Features:
    → 10 emails per month
    → 3 tone modes
    → 7-day history
    → Email support
    ✕ No API access
    ✕ No custom tones

Professional tier (RECOMMENDED):
  Name: "PROFESSIONAL"
  Badge: "RECOMMENDED"
  Price: "$19" (monthly) / "$182" (yearly)
  Period: "/mo"
  Note: "Billed monthly" / "Billed annually"
  CTA: "GET STARTED"
  Features:
    → Unlimited emails
    → All 5 tone modes
    → Unlimited history
    → Priority support
    → Export to .txt / .eml
    ✕ No API access

Enterprise tier:
  Name: "ENTERPRISE"
  Price: "$99" (monthly) / "$950" (yearly)
  Period: "/mo"
  Note: "Billed monthly" / "Billed annually"
  CTA: "CONTACT SALES"
  Features:
    → Everything in Pro
    → REST API access
    → Custom tone training
    → Up to 10 team seats
    → 99.9% SLA guarantee
    → Dedicated account manager
```

**Russian:**
```
Section label: "// 04_УРОВНИ_ДОСТУПА"
H1: "ВЫБЕРИТЕ_УРОВЕНЬ_ДОСТУПА"
Subheadline: "Начните бесплатно. Обновитесь когда нужно больше. Без скрытых платежей. Отмените в любое время."

Toggle:
  Monthly: "Ежемесячно"
  Yearly: "Ежегодно"
  Savings badge: "ЭКОНОМИЯ 20%"

Starter tier:
  Name: "STARTER"
  Price: "$0"
  Period: "/мес"
  Note: "Бесплатно навсегда · без карты"
  CTA: "НАЧАТЬ БЕСПЛАТНО"

Professional tier:
  Name: "PROFESSIONAL"
  Badge: "РЕКОМЕНДУЕМЫЙ"
  Price: "$19" / "$182"
  CTA: "ПОЛУЧИТЬ ДОСТУП"

Enterprise tier:
  Name: "ENTERPRISE"
  Price: "$99" / "$950"
  CTA: "СВЯЗАТЬСЯ С ОТДЕЛОМ ПРОДАЖ"
```

---

## 3. Auth Pages

### 3.1 Login (`/login`)

**Semantic structure:**
```html
<main>
  <section aria-labelledby="login-heading">
    <div class="container container--narrow">
      <div class="logo">NEUR·O·MAIL</div>
      <div class="auth-card">
        <div class="eyebrow">// ACCESS_PROTOCOL</div>
        <h1 id="login-heading">SYSTEM_LOGIN</h1>
        <form aria-label="Login form">
          <!-- fields with ">" prefix -->
        </form>
      </div>
      <p>
        <a href="/register">...</a>
      </p>
    </div>
  </section>
</main>
```

**English:**
```
Logo: "NEUR·O·MAIL" (with RGB shift animation)
Section label: "// ACCESS_PROTOCOL"
H1: "SYSTEM_LOGIN"
Subheadline: "Enter your credentials to access the system"

Form:
  Email label: "01 // EMAIL_ADDRESS"
  Email placeholder: "you@example.com"
  Password label: "02 // PASSWORD"
  Password placeholder: "••••••••"
  Submit: "INITIALIZE_ACCESS →"
  Loading: "AUTHENTICATING..."

Errors:
  Invalid credentials: "ERR: ACCESS_DENIED · Invalid credentials"
  Network error: "ERR: CONNECTION_FAILED · Check network"
  Server error: "ERR: SYSTEM_ERROR · Try again later"

Success: "ACCESS_GRANTED · Redirecting..."

Link: "No account? REGISTER →"
```

**Russian:**
```
Logo: "NEUR·O·MAIL" (с RGB shift анимацией)
Section label: "// ПРОТОКОЛ_ДОСТУПА"
H1: "СИСТЕМНЫЙ_ВХОД"
Subheadline: "Введите учетные данные для доступа к системе"

Form:
  Email label: "01 // EMAIL_АДРЕС"
  Email placeholder: "you@example.com"
  Password label: "02 // ПАРОЛЬ"
  Password placeholder: "••••••••"
  Submit: "ИНИЦИАЛИЗИРОВАТЬ_ДОСТУП →"
  Loading: "АУТЕНТИФИКАЦИЯ..."

Errors:
  Invalid credentials: "ОШИБКА: ДОСТУП_ЗАПРЕЩЕН · Неверные учетные данные"
  Network error: "ОШИБКА: СОЕДИНЕНИЕ_ПРЕРВАНО · Проверьте сеть"
  Server error: "ОШИБКА: СИСТЕМНЫЙ_СБОЙ · Попробуйте позже"

Success: "ДОСТУП_РАЗРЕШЕН · Перенаправление..."

Link: "Нет аккаунта? ЗАРЕГИСТРИРОВАТЬСЯ →"
```

---

### 3.2 Register (`/register`)

**Semantic structure:**
```html
<main>
  <section aria-labelledby="register-heading">
    <div class="container container--narrow">
      <div class="logo">NEUR·O·MAIL</div>
      <div class="auth-card">
        <div class="eyebrow">// NEW_USER_PROTOCOL</div>
        <h1 id="register-heading">SYSTEM_REGISTER</h1>
        <form aria-label="Registration form">
          <!-- fields with ">" prefix -->
        </form>
      </div>
      <p>
        <a href="/login">...</a>
      </p>
    </div>
  </section>
</main>
```

**English:**
```
Logo: "NEUR·O·MAIL" (with RGB shift animation)
Section label: "// NEW_USER_PROTOCOL"
H1: "SYSTEM_REGISTER"
Subheadline: "Create your account to start generating"

Form:
  Email label: "01 // EMAIL_ADDRESS"
  Email placeholder: "you@example.com"
  Password label: "02 // PASSWORD"
  Password placeholder: "At least 8 characters"
  Password hint: "// min 8 chars"
  Confirm password label: "03 // CONFIRM_PASSWORD"
  Confirm password placeholder: "Repeat your password"
  Submit: "CREATE_ACCOUNT →"
  Loading: "INITIALIZING..."

Validation errors:
  Email invalid: "ERR: Invalid email format"
  Email taken: "ERR: Email already registered"
  Password short: "ERR: Password must be 8+ characters"
  Password mismatch: "ERR: Passwords do not match"

Success: "ACCOUNT_CREATED · Redirecting to dashboard..."

Link: "Have account? LOGIN →"
```

**Russian:**
```
Logo: "NEUR·O·MAIL" (с RGB shift анимацией)
Section label: "// ПРОТОКОЛ_НОВОГО_ПОЛЬЗОВАТЕЛЯ"
H1: "СИСТЕМНАЯ_РЕГИСТРАЦИЯ"
Subheadline: "Создайте аккаунт чтобы начать генерацию"

Form:
  Email label: "01 // EMAIL_АДРЕС"
  Email placeholder: "you@example.com"
  Password label: "02 // ПАРОЛЬ"
  Password placeholder: "Минимум 8 символов"
  Password hint: "// мин 8 символов"
  Confirm password label: "03 // ПОДТВЕРДИТЕ_ПАРОЛЬ"
  Confirm password placeholder: "Повторите пароль"
  Submit: "СОЗДАТЬ_АККАУНТ →"
  Loading: "ИНИЦИАЛИЗАЦИЯ..."

Validation errors:
  Email invalid: "ОШИБКА: Неверный формат email"
  Email taken: "ОШИБКА: Email уже зарегистрирован"
  Password short: "ОШИБКА: Пароль должен быть 8+ символов"
  Password mismatch: "ОШИБКА: Пароли не совпадают"

Success: "АККАУНТ_СОЗДАН · Перенаправление на панель..."

Link: "Есть аккаунт? ВОЙТИ →"
```

---

## 4. Dashboard

### 4.1 Email Generator (`/dashboard`)

**Semantic structure:**
```html
<main>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <!-- navigation -->
    </aside>
    <div class="main-content">
      <section aria-labelledby="generator-heading">
        <div class="eyebrow">// EMAIL_GENERATOR</div>
        <h1 id="generator-heading">GENERATOR_PROTOCOL</h1>
        <form aria-label="Email generator">
          <!-- fields with ">" prefix -->
        </form>
        <div class="output-terminal" aria-live="polite" aria-atomic="true">
          <!-- result -->
        </div>
      </section>
      <section aria-labelledby="history-heading">
        <div class="eyebrow">// EMAIL_HISTORY</div>
        <h2 id="history-heading">HISTORY_LOG</h2>
        <ul role="list">
          <!-- history items -->
        </ul>
      </section>
    </div>
  </div>
</main>
```

**English:**
```
Top bar:
  Logo: "NEUR·O·MAIL"
  Status: "STATUS: ■ ONLINE"
  User avatar: "U" (first letter)
  Logout: "logout"

Sidebar:
  Label: "NAVIGATION"
  Links:
    - "⌂ Home" → /
    - "⚡ Generator" → /dashboard (active)
    - "◷ History" → /dashboard#history
    - "◎ Profile" → /profile
  Plan badge: "PLAN // FREE"
  Progress: "3 / 10 emails"
  Upgrade: "Upgrade →"

Generator:
  Section label: "// EMAIL_GENERATOR"
  H1: "GENERATOR_PROTOCOL"
  
  Form:
    Subject label: "01 // SUBJECT_LINE"
    Subject placeholder: "What is your email about?"
    Tone label: "02 // TONE_MATRIX"
    Tone options:
      - Professional: "PROFESSIONAL"
      - Casual: "CASUAL"
      - Formal: "FORMAL"
      - Friendly: "FRIENDLY"
      - Persuasive: "PERSUASIVE"
    Length label: "03 // OUTPUT_LENGTH"
    Length options:
      - Short: "SHORT (~100 words)"
      - Medium: "MEDIUM (~250 words)"
      - Long: "LONG (~500 words)"
    Generate button: "GENERATE_EMAIL →"
    Generating: 
      "→ analyzing subject..."
      "→ applying tone matrix..."
      "→ generating output..."

  Result (terminal-style):
    Header: "OUTPUT_STREAM"
    Empty state: "AWAITING_INPUT"
    Copy button: "COPY_TO_CLIPBOARD"
    Copied: "COPIED!"
    Regenerate: "REGENERATE →"

  Errors:
    AI unavailable: "ERR: AI_UNAVAILABLE · Try again"
    Rate limited: "ERR: RATE_LIMIT_EXCEEDED · Upgrade to Pro"
    Network: "ERR: CONNECTION_FAILED · Check network"

History:
  Section label: "// EMAIL_HISTORY"
  H2: "HISTORY_LOG"
  Empty state: "NO_EMAILS_FOUND · Generate your first email"
  Item format: "SUBJECT · TONE · DATE"
  Delete: "DELETE"
  Confirm delete: "Confirm deletion? This cannot be undone."
```

**Russian:**
```
Top bar:
  Logo: "NEUR·O·MAIL"
  Status: "СТАТУС: ■ В СЕТИ"
  User avatar: "U" (первая буква)
  Logout: "выйти"

Sidebar:
  Label: "НАВИГАЦИЯ"
  Links:
    - "⌂ Главная" → /
    - "⚡ Генератор" → /dashboard (активный)
    - "◷ История" → /dashboard#history
    - "◎ Профиль" → /profile
  Plan badge: "ПЛАН // БЕСПЛАТНО"
  Progress: "3 / 10 писем"
  Upgrade: "Обновить →"

Generator:
  Section label: "// ГЕНЕРАТОР_ПИСЕМ"
  H1: "ПРОТОКОЛ_ГЕНЕРАЦИИ"
  
  Form:
    Subject label: "01 // ТЕМА_ПИСЬМА"
    Subject placeholder: "О чём ваше письмо?"
    Tone label: "02 // МАТРИЦА_ТОНОВ"
    Tone options:
      - Professional: "ПРОФЕССИОНАЛЬНЫЙ"
      - Casual: "НЕФОРМАЛЬНЫЙ"
      - Formal: "ФОРМАЛЬНЫЙ"
      - Friendly: "ДРУЖЕЛЮБНЫЙ"
      - Persuasive: "УБЕДИТЕЛЬНЫЙ"
    Length label: "03 // ДЛИНА_ВЫВОДА"
    Length options:
      - Short: "КОРОТКОЕ (~100 слов)"
      - Medium: "СРЕДНЕЕ (~250 слов)"
      - Long: "ДЛИННОЕ (~500 слов)"
    Generate button: "СГЕНЕРИРОВАТЬ_ПИСЬМО →"
    Generating: 
      "→ анализ темы..."
      "→ применение матрицы тонов..."
      "→ генерация вывода..."

  Result (terminal-style):
    Header: "ПОТОК_ВЫВОДА"
    Empty state: "ОЖИДАНИЕ_ВВОДА"
    Copy button: "СКОПИРОВАТЬ_В_БУФЕР"
    Copied: "СКОПИРОВАНО!"
    Regenerate: "ПЕРЕГЕНЕРИРОВАТЬ →"

  Errors:
    AI unavailable: "ОШИБКА: ИИ_НЕДОСТУПЕН · Попробуйте снова"
    Rate limited: "ОШИБКА: ЛИМИТ_ИСЧЕРПАН · Обновитесь до Pro"
    Network: "ОШИБКА: СОЕДИНЕНИЕ_ПРЕРВАНО · Проверьте сеть"

History:
  Section label: "// ИСТОРИЯ_ПИСЕМ"
  H2: "ЖУРНАЛ_ИСТОРИИ"
  Empty state: "ПИСЕМ_НЕ_НАЙДЕНО · Сгенерируйте первое письмо"
  Item format: "ТЕМА · ТОН · ДАТА"
  Delete: "УДАЛИТЬ"
  Confirm delete: "Подтвердить удаление? Это нельзя отменить."
```

---

### 4.2 Profile (`/profile`)

**Semantic structure:**
```html
<main>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <!-- navigation -->
    </aside>
    <div class="main-content">
      <section aria-labelledby="profile-heading">
        <div class="eyebrow">// USER_PROFILE</div>
        <h1 id="profile-heading">PROFILE_SETTINGS</h1>
        
        <div class="identity-card">
          <div class="terminal-header">identity.cfg</div>
          <form aria-label="Profile settings">
            <!-- fields with ">" prefix -->
          </form>
        </div>
        
        <div class="subscription-card">
          <div class="terminal-header">subscription.status</div>
          <!-- plan info -->
        </div>
      </section>
    </div>
  </div>
</main>
```

**English:**
```
Section label: "// USER_PROFILE"
H1: "PROFILE_SETTINGS"

Identity card:
  Terminal header: "identity.cfg"
  Avatar: "U" (first letter, neon border)
  Email: "user@example.com"
  UID: "UID: NM-00042 · FREE PLAN"
  
  Form:
    Display name label: "DISPLAY NAME"
    Display name placeholder: "Enter display name"
    Email label: "EMAIL ADDRESS"
    Email note: "// email cannot be changed"
    Save button: "UPDATE_IDENTITY →"
    Saving: "UPDATING..."
    Saved: "IDENTITY_UPDATED"

Subscription card:
  Terminal header: "subscription.status"
  Plan: "FREE PLAN" / "PRO PLAN" / "ENTERPRISE PLAN"
  Active since: "Active since Jun 2026"
  Progress: "3 / 10 emails"
  Upgrade button: "UPGRADE_PLAN →"

Danger zone:
  Terminal header: "danger.zone"
  Delete button: "DELETE_ACCOUNT"
  Confirm: "Confirm account deletion? This cannot be undone."
```

**Russian:**
```
Section label: "// ПРОФИЛЬ_ПОЛЬЗОВАТЕЛЯ"
H1: "НАСТРОЙКИ_ПРОФИЛЯ"

Identity card:
  Terminal header: "identity.cfg"
  Avatar: "U" (первая буква, неоновая рамка)
  Email: "user@example.com"
  UID: "UID: NM-00042 · БЕСПЛАТНЫЙ ПЛАН"
  
  Form:
    Display name label: "ОТОБРАЖАЕМОЕ ИМЯ"
    Display name placeholder: "Введите отображаемое имя"
    Email label: "EMAIL АДРЕС"
    Email note: "// email нельзя изменить"
    Save button: "ОБНОВИТЬ_ЛИЧНОСТЬ →"
    Saving: "ОБНОВЛЕНИЕ..."
    Saved: "ЛИЧНОСТЬ_ОБНОВЛЕНА"

Subscription card:
  Terminal header: "subscription.status"
  Plan: "БЕСПЛАТНЫЙ ПЛАН" / "PRO ПЛАН" / "ENTERPRISE ПЛАН"
  Active since: "Активен с Июн 2026"
  Progress: "3 / 10 писем"
  Upgrade button: "ОБНОВИТЬ_ПЛАН →"

Danger zone:
  Terminal header: "danger.zone"
  Delete button: "УДАЛИТЬ_АККАУНТ"
  Confirm: "Подтвердить удаление аккаунта? Это нельзя отменить."
```

---

## 5. Shared Components

### 5.1 Header

**Semantic structure:**
```html
<header role="banner">
  <div class="container">
    <nav aria-label="Main navigation">
      <a href="/" aria-label="NEUROMAIL home">
        <span class="logo">NEUR·O·MAIL</span>
      </a>
      <ul role="list">
        <!-- nav links -->
      </ul>
    </nav>
  </div>
</header>
```

**English:**
```
Logo text: "NEUR·O·MAIL" (with RGB shift animation)

Nav links (public):
  - "//features" → /#features
  - "//demo" → /#demo
  - "//pricing" → /pricing
  - "login" → /login
  - "get_access →" → /register (primary CTA, chamfered button)

Nav links (authenticated):
  - "Dashboard" → /dashboard
  - "Profile" → /profile
  - "logout" → /logout

Mobile menu:
  - "Menu" (aria-label for hamburger button)
  - "Close menu" (aria-label for close button)

Language switcher:
  - "EN" / "RU"
  - aria-label: "Change language"
```

**Russian:**
```
Logo text: "NEUR·O·MAIL" (с RGB shift анимацией)

Nav links (public):
  - "//возможности" → /#features
  - "//демо" → /#demo
  - "//цены" → /pricing
  - "войти" → /login
  - "получить_доступ →" → /register (primary CTA, chamfered button)

Nav links (authenticated):
  - "Панель" → /dashboard
  - "Профиль" → /profile
  - "выйти" → /logout

Language switcher:
  - "EN" / "RU"
  - aria-label: "Изменить язык"
```

---

### 5.2 Footer

**Semantic structure:**
```html
<footer role="contentinfo">
  <div class="container">
    <nav aria-label="Footer navigation">
      <ul role="list">
        <!-- links -->
      </ul>
    </nav>
    <p>...</p>
  </div>
</footer>
```

**English:**
```
Links:
  - "Privacy" → /privacy (post-MVP)
  - "Terms" → /terms (post-MVP)
  - "Contact" → mailto:support@neuromail.dev

Copyright: "© 2026 NEUROMAIL. All rights reserved."
Built with: "Built with Next.js · Supabase · Claude AI"
```

**Russian:**
```
Links:
  - "Конфиденциальность" → /privacy
  - "Условия" → /terms
  - "Контакты" → mailto:support@neuromail.dev

Copyright: "© 2026 NEUROMAIL. Все права защищены."
Built with: "Создано с Next.js · Supabase · Claude AI"
```

---

### 5.3 Error Pages

#### 404 Not Found

**English:**
```
H1: "404 · PAGE_NOT_FOUND"
Message: "ERR: The page you're looking for doesn't exist or has been moved."
CTA: "RETURN_HOME →"
```

**Russian:**
```
H1: "404 · СТРАНИЦА_НЕ_НАЙДЕНА"
Message: "ОШИБКА: Страница, которую вы ищете, не существует или была перемещена."
CTA: "ВЕРНУТЬСЯ_НА_ГЛАВНУЮ →"
```

#### 500 Error

**English:**
```
H1: "500 · SYSTEM_ERROR"
Message: "ERR: We're experiencing technical difficulties. Please try again in a moment."
CTA: "TRY_AGAIN →"
Secondary: "RETURN_HOME →"
```

**Russian:**
```
H1: "500 · СИСТЕМНАЯ_ОШИБКА"
Message: "ОШИБКА: Мы испытываем технические трудности. Попробуйте через мгновение."
CTA: "ПОПРОБОВАТЬ_СНОВА →"
Secondary: "ВЕРНУТЬСЯ_НА_ГЛАВНУЮ →"
```

---

## 6. Schema.org Markup

### 6.1 Organization (site-wide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "NEUROMAIL",
  "url": "https://your-app.vercel.app",
  "logo": "https://your-app.vercel.app/logo.png",
  "description": "AI-powered email generation with precision tone control. No writer's block. No generic templates.",
  "sameAs": [
    "https://github.com/your-username/ai-email-generator"
  ]
}
```

### 6.2 WebApplication (Landing Page)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "NEUROMAIL",
  "url": "https://your-app.vercel.app",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "99",
    "priceCurrency": "USD",
    "offerCount": "3"
  },
  "featureList": [
    "AI-powered email generation",
    "5 tone modes",
    "Email history",
    "Multi-language support",
    "Privacy-first design"
  ]
}
```

### 6.3 FAQPage (FAQ Section)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is NEUROMAIL really free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! You can generate up to 10 emails per month on the Free plan with no credit card required. Upgrade to Pro for unlimited emails."
      }
    },
    {
      "@type": "Question",
      "name": "How does the AI generate emails?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We use Claude AI (by Anthropic) to analyze your subject and generate contextually relevant emails. You choose the tone and length, and the AI crafts the perfect message."
      }
    }
    // ... all 7 questions
  ]
}
```

---

## 7. Tone & Voice Guidelines

### English
- **Hero:** Confident, action-oriented, benefit-first
- **Features:** Specific, concrete, user-benefit focused
- **FAQ:** Conversational but professional, reassuring
- **CTA:** Urgency without pressure, clear value proposition
- **Errors:** Empathetic, helpful, solution-oriented

### Russian
- Match English tone but adapt for Russian cultural context
- Use "вы" (formal you) for professional context
- Avoid literal translations — adapt meaning and idioms
- Keep technical terms in English when appropriate (e.g., "AI", "Pro", "Enterprise")

---

## 8. Accessibility Notes

- All interactive elements must have visible focus indicators
- Skip link: `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>`
- Form errors: use `aria-describedby` to link error messages to inputs
- Loading states: use `aria-busy="true"` on containers
- Success messages: use `role="status"` and `aria-live="polite"`
- Icons: decorative icons get `aria-hidden="true"`, functional icons get `aria-label`

---

## 9. Mobile-First Considerations

- Hero H1: `text-4xl` (mobile) → `sm:text-5xl` → `lg:text-6xl`
- Feature cards: stack on mobile (`grid-cols-1`), 2-col on tablet (`md:grid-cols-2`), 3-col on desktop (`lg:grid-cols-3`)
- FAQ: full-width accordions on mobile, max-width on desktop
- Pricing cards: stack on mobile, side-by-side on tablet+
- Navigation: hamburger menu on mobile, full nav on desktop (`lg:flex`)
- CTA buttons: full-width on mobile (`w-full`), auto-width on desktop (`sm:w-auto`)

---

## 10. Usage in Code

```typescript
// src/lib/content.ts
export const CONTENT = {
  brand: {
    name: "NEUR·O·MAIL",
    tagline: "AI-powered email generation with precision tone control"
  },
  landing: {
    hero: {
      eyebrow: "// SYS_INITIALIZED · AI EMAIL ENGINE v2.1.0",
      heading: "Write Better Emails in Seconds",
      subheadline: "AI-powered email generation with precision tone control. No writer's block. No generic templates.",
      statusIndicators: [
        "STATUS: ■ ONLINE",
        "ENGINE: CLAUDE_HAIKU",
        "UPTIME: 99.9%"
      ],
      ctaPrimary: "GET_ACCESS →",
      ctaSecondary: "LIVE_DEMO ↓"
    },
    features: {
      sectionLabel: "// 01_CAPABILITIES",
      heading: "SYS_CAPABILITIES",
      items: [
        {
          number: "[01]",
          title: "Instant Generation",
          description: "Sub-2 second drafts via Claude Haiku..."
        }
        // ... all 6 features
      ]
    },
    demo: {
      sectionLabel: "// 02_DEMO",
      heading: "LIVE_DEMO",
      formLabels: {
        subject: "01 // SUBJECT LINE",
        tone: "02 // TONE MATRIX",
        length: "03 // OUTPUT LENGTH"
      },
      generateButton: "GENERATE_EMAIL →",
      outputHeader: "OUTPUT_STREAM"
    }
    // ...
  }
}

// In components:
import { CONTENT } from '@/lib/content'

<div className="eyebrow">{CONTENT.landing.hero.eyebrow}</div>
<h1 className="font-display">{CONTENT.landing.hero.heading}</h1>
```

For i18n, use `next-intl` with `messages/en.json` and `messages/ru.json` populated from this document.
