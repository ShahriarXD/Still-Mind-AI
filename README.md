# 🚀 SteelMind AI

**Your wholesale business, supercharged.** Turn messy customer notes into clear actions, follow-ups, and insights with our AI-powered CRM assistant designed specifically for small wholesalers.

SteelMind AI helps you manage customer relationships, detect risk early, automate follow-ups, and never miss an opportunity again. Built for wholesalers who want to scale without the complexity.

---

## 🌐 Live Demo

👉 **[https://still-mind-ai.vercel.app/](https://still-mind-ai.vercel.app/)**

---

## ✨ Features

- **📝 AI-Powered Note Analysis** – Convert customer interaction notes into structured summaries in seconds
- **⚠️ Risk Detection & Alerts** – Automatically flag high-risk accounts and payment issues
- **📋 Smart Follow-ups** – Get AI-generated, context-aware follow-up action items for every interaction
- **💬 Draft Messages** – One-click ready-to-send customer response templates
- **📊 Interaction History** – Track all customer conversations with full audit trail
- **🔔 Intelligent Notifications** – Stay on top of follow-ups and risk alerts
- **💳 Integrated Payment Gateway** – bKash payment processing for seamless transactions
- **📱 Mobile-Friendly** – Manage your wholesale business on the go
- **🎯 Free Tier** – 20 daily analyses to get started (upgrade to Pro for unlimited)

---

## 🛠️ Tech Stack

### Frontend

- **[Next.js 16](https://nextjs.org/)** – React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** – Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first styling (v4)
- **[Lucide Icons](https://lucide.dev/)** – Beautiful icon library

### Backend & Services

- **[Firebase Authentication](https://firebase.google.com/docs/auth)** – Secure user management
- **[Firebase Firestore](https://firebase.google.com/docs/firestore)** – Real-time database
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** – Serverless backend
- **[bKash API](https://developer.bka.sh/)** – Payment gateway integration

### Deployment

- **[Vercel](https://vercel.com/)** – Hosting and CI/CD
- **[Turbopack](https://turbo.build/pack)** – Fast bundler

### Development Tools

- **[ESLint](https://eslint.org/)** – Code quality
- **[PostCSS](https://postcss.org/)** – CSS processing

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firebase project (free tier available)
- bKash developer account (optional, for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/steelmind-ai.git
   cd steelmind-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Firebase and bKash credentials:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   BKASH_USERNAME=your_bkash_username
   BKASH_PASSWORD=your_bkash_password
   BKASH_APP_KEY=your_app_key
   BKASH_APP_SECRET=your_app_secret
   ```

4. **Set up Firebase** (if starting fresh)
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication → Email/Password provider
   - Create a Firestore Database (test mode for dev)
   - Apply these security rules:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /users/{userId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
           match /interactions/{interactionId} {
             allow read, write: if request.auth != null && request.auth.uid == userId;
           }
         }
       }
     }
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Highlights

### Architecture

- **Modular Components** – Reusable UI components in `/components`
- **Custom Hooks** – `useAuth()`, `useToast()` for common patterns
- **Type Safety** – Full TypeScript coverage with shared types in `/lib`
- **Real-time Sync** – Firestore listeners for instant profile & interaction updates
- **API Routes** – `/api/analyze-note` for AI-powered analysis logic

### Key Workflows

1. **Registration** → Email + password signup with Firebase Auth
2. **Dashboard Access** → Automatic redirect after login (no email verification required)
3. **New Interaction** → Fill form → AI analysis → View summary + risk + follow-ups → Save to Firestore
4. **History** → Query all saved interactions in real-time
5. **Settings** → Update profile, manage notifications, view usage quota

### Performance Optimizations

- Removed artificial API delays for faster analysis
- Lazy-loaded Firebase Analytics (optional)
- Server-side Firestore queries with proper indexing
- Next.js image optimization and code splitting

---

## 🔮 Future Improvements

- [ ] **Advanced Analytics Dashboard** – Charts, trends, and performance metrics
- [ ] **Email Notifications** – Automated follow-up reminders
- [ ] **CSV Export** – Download interaction history
- [ ] **Multi-user Teams** – Invite colleagues to collaborate
- [ ] **Custom AI Prompts** – Fine-tune analysis for your business
- [ ] **Mobile App** – React Native version for iOS/Android
- [ ] **API Documentation** – Public API for third-party integrations
- [ ] **Two-Factor Authentication** – Enhanced security
- [ ] **Dark Mode Toggle** – User preference storage
- [ ] **Webhook Support** – Trigger actions from external systems

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Developed with ❤️ by K M SHAHRIAR HOSSAIN**

Interested in contributing? Fork the repo and submit a pull request!

---

## ⭐ Support

If SteelMind AI helps your business, please:

- ⭐ **Star this repo** on GitHub
- 💬 **Share feedback** – open an issue or discussion
- 🐛 **Report bugs** – create a detailed issue

---

**Happy selling! 🚀**
