<div align="center">

# ❄️ FrostApp

**A cross-platform mobile app for cold exposure and mental resilience training.**

*Inspired by [Maxime Frost](https://maximefrost.fr) — pushing the limits of comfort, one degree at a time.*

<br />

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/RTK_Query-764ABC?style=for-the-badge&logo=redux&logoColor=white)

</div>

<br />

## ✨ Overview

FrostApp is a **full-stack mobile application** built as a personal project during my apprenticeship, combining a React Native front-end with a NestJS back-end and a PostgreSQL database. The app lets users explore structured cold-exposure programs, track their progression, and manage their profile, with a design system inspired by winter aesthetics.

The project is deliberately **over-engineered for its scale**, it's my playground to practice production patterns: JWT auth with persistent sessions, cache invalidation with RTK Query tags, image uploads to Cloudinary, transactional emails via Brevo, class-validator DTOs, and clean architecture with clear separation of concerns.

<br />

## 📱 Screenshots

> _Coming soon — TestFlight deployment in progress._

<br />

## 🎯 Features

### 🔐 Authentication
- **Sign up / Login** with email + password (bcrypt hashed)
- **JWT authentication** with persistent sessions via `expo-secure-store` (Keychain on iOS, Keystore on Android)
- **Auto rehydration** on app launch via `useMeQuery` with `skip` pattern
- **Automatic logout** on `401/403` responses (`baseQueryWithReauth` interceptor)
- **AuthGate** component that redirects unauthenticated users to `/login`

### 👤 User profile
- View and **edit profile** (name, email, avatar)
- **Change password** with current password verification
- **Avatar upload** via `expo-image-picker` (gallery or camera) + Cloudinary storage with automatic crop (`gravity: 'face'`) and WebP compression
- **Auto-refresh** of the UI after mutation thanks to RTK Query tag invalidation

### 🔑 Forgot password
- **Secure reset flow** via email (Brevo transactional API)
- **Anti user-enumeration** — always returns a generic response regardless of email existence
- Custom-designed HTML template matching the app's design system

### 📚 Content
- **Lessons list** (paginated) fetched from the back-end
- **Nested accordion** for chapters with on-demand fetching (`skip` pattern) — data is loaded only when the user expands a lesson
- **Optimistic caching** via RTK Query — no re-fetch when navigating away and back

### 🎨 Design system
- Centralized color palette (`constants/colors.ts`) — single source of truth
- Reusable components (`AuthLayout`, `AuthField`, `AuthButton`, `ProfileRow`, `ScreenHeader`, `ProfileAvatar`…)
- **Multiple variants** on ProfileRow (`default`, `primary`, `danger`) driven by a strongly typed prop
- Consistent typography with italics, letter-spacing, and eyebrow micro-labels

<br />

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    📱 MOBILE (React Native / Expo)            │
│                                                              │
│   ┌────────────────┐   ┌────────────────┐   ┌───────────┐  │
│   │    Screens     │──▶│   AuthContext  │──▶│  Backend  │  │
│   │  (login, home, │   │  (Redux + RTK  │   │           │  │
│   │   profile...)  │   │     Query)     │   │           │  │
│   └────────────────┘   └───────┬────────┘   └─────┬─────┘  │
│                                │                  │         │
│                          SecureStore              │         │
│                       (JWT persisted)             │         │
└───────────────────────────────────────────────────┼─────────┘
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   🌊 BACKEND (NestJS + Prisma)                │
│                                                              │
│   ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌─────────────┐   │
│   │  Auth   │  │  User   │  │  Lesson  │  │  Cloudinary │   │
│   │ Module  │  │ Module  │  │  Module  │  │   Module    │   │
│   └────┬────┘  └────┬────┘  └─────┬────┘  └──────┬──────┘   │
│        │            │             │              │           │
│        └────────────┼─────────────┼──────────────┘           │
│                     ▼             │                          │
│               ┌───────────┐  ┌────▼─────┐                    │
│               │  Prisma   │  │  Email   │                    │
│               │  Service  │  │ (Brevo)  │                    │
│               └─────┬─────┘  └──────────┘                    │
└─────────────────────┼────────────────────────────────────────┘
                      ▼
               ┌────────────┐
               │ PostgreSQL │
               │  (Docker)  │
               └────────────┘
```

<br />

## 🛠️ Tech stack

### Mobile
| Category | Choice | Why |
|---|---|---|
| Framework | **React Native + Expo** | Cross-platform, hot reload, over-the-air updates |
| Language | **TypeScript** | Static typing, refactor confidence |
| State + Data fetching | **Redux Toolkit + RTK Query** | Automatic caching, tag invalidation, generated hooks |
| Navigation | **Expo Router** | File-based routing, deep-linking ready |
| Secure storage | **expo-secure-store** | Encrypted native storage (Keychain / Keystore) |
| Image picker | **expo-image-picker** | Native gallery + camera access |
| Forms | **React state** | Kept simple, no lib overhead |

### Backend
| Category | Choice | Why |
|---|---|---|
| Framework | **NestJS** | Modular, opinionated, TypeScript-first |
| ORM | **Prisma** | Type-safe queries, auto-generated client, easy migrations |
| Database | **PostgreSQL** (via Docker) | Relational integrity, industry standard |
| Auth | **JWT + bcrypt** | Stateless auth, easy to scale |
| Validation | **class-validator + ValidationPipe** | DTO-driven, decorator-based |
| API doc | **Swagger** | Auto-generated at `/doc` |
| File storage | **Cloudinary** | CDN, auto-crop on face, WebP conversion |
| Transactional email | **Brevo** | Templated emails, 300 free/day |

<br />

## 🚀 Getting started

### Prerequisites
- **Node.js** ≥ 20
- **Docker** (for PostgreSQL)
- **Expo Go** on your phone _or_ **Xcode** for iOS simulator

### 1. Clone both repos

```bash
# Front-end (this repo)
git clone <front-repo-url> frostapp

# Back-end
git clone <back-repo-url> frostapp-v2-backend
```

### 2. Back-end setup

```bash
cd frostapp-v2-backend
npm install
cp .env.example .env    # then fill in your values

# Start PostgreSQL container
docker compose up -d

# Run migrations
npx prisma migrate dev

# Start the dev server
npm run start:dev
```

The backend will run on **http://localhost:3000** with Swagger docs at **http://localhost:3000/doc**.

### 3. Front-end setup

```bash
cd frostapp
npm install

# Start Expo
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `i` for iOS simulator.

### 4. Environment variables

**Back-end `.env`:**
```env
DATABASE_URL="postgresql://admin:admin123@localhost:5433/frostappdb"
PORT=3000
JWT_SECRET=your_secret_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Brevo (transactional email)
BREVO_API_KEY=xkeysib-...
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Frost
```

<br />

## 📂 Project structure

### Front-end

```
frostapp/
├── app/                       # Expo Router — file-based routing
│   ├── (tabs)/                # Bottom tab group
│   │   ├── index.tsx          # Home — lessons list
│   │   ├── profile.tsx        # Profile screen
│   │   └── _layout.tsx        # Floating tab bar
│   ├── login.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx
│   ├── edit-profile.tsx
│   ├── change-password.tsx
│   └── _layout.tsx            # Root layout + AuthGate
├── components/                # Reusable UI
│   ├── auth/                  # AuthLayout, AuthField, AuthButton
│   ├── profile/               # ProfileRow, ProfileAvatar
│   └── ui/                    # ScreenHeader, FloatingTabBar
├── core/                      # Business layer
│   ├── api/                   # RTK Query endpoints (auth, lesson, user)
│   ├── context/               # AuthContext
│   ├── interfaces/            # Shared TypeScript interfaces
│   └── redux/                 # Redux store
├── constants/                 # Colors, config
└── infra/http/                # baseApi (RTK Query + reauth interceptor)
```

### Back-end

```
frostapp-v2-backend/
├── src/
│   ├── auth/                  # Login, register, forgot-password
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/               # LoginDTO, RegisterDTO, ForgotPasswordDTO
│   │   └── contracts/         # Interface-based service contract
│   ├── user/                  # Profile endpoints (/users/me…)
│   ├── lesson/                # Lessons + Chapters
│   ├── cloudinary/            # Image upload service
│   ├── email/                 # Brevo transactional emails
│   ├── guards/                # IsAuthenticatedGuard, RolesGuard
│   ├── prisma/                # PrismaService
│   └── main.ts                # Bootstrap + ValidationPipe global
└── prisma/
    └── schema.prisma          # User, Lesson, Chapter, SubChapter
```

<br />

## 💡 Key implementation decisions

### 🔐 Session persistence with tag-based invalidation
When a user updates their profile, the `useMeQuery` cache is automatically invalidated thanks to `invalidatesTags: ['Me']` on the `updateMe` mutation. Result: the avatar, name, and email refresh across the whole app without any manual `refetch()`.

### 🛡️ Anti user-enumeration on forgot-password
The `/auth/forgot-password` endpoint **always** returns the same generic response, whether the email exists or not. This prevents attackers from brute-forcing valid emails from the database — a common vulnerability in poorly designed reset flows.

### 🎨 Server-side image processing
Instead of doing client-side cropping (buggy on iOS simulators with HEIC files), the avatar upload leverages Cloudinary transformations:
```ts
transformation: [
  { width: 400, height: 400, crop: 'fill', gravity: 'face' },
  { quality: 'auto', fetch_format: 'auto' },
]
```
Result: a 5 MB photo becomes ~80 KB WebP, centered on the face, without any client-side complexity.

### 🧱 DTOs with class-validator + `forbidNonWhitelisted`
Every backend DTO uses `class-validator` decorators, combined with a global `ValidationPipe` that strips unknown fields **and rejects them explicitly**. Result: it's impossible to escalate privileges via a `PATCH { role: "admin" }` — the field is not in the DTO, so it's rejected with a 400.

### 📧 Reusable email service
The `EmailService` exposes a generic `sendEmail(to, templateId, params)` method that any module can inject. Templates are managed in the Brevo dashboard, so designers can edit them without touching the code.

<br />

## 🗺️ Roadmap

- [x] Auth flow (register, login, logout, session persistence)
- [x] User profile management (edit, change password, avatar upload)
- [x] Lessons list from the API with paginated response
- [x] Forgot password with Brevo email
- [x] Cloudinary image upload with server-side transformations
- [ ] Real password-reset token in DB + reset screen
- [ ] Video player for sub-chapters
- [ ] Progress tracking per user
- [ ] Push notifications (`expo-notifications`)
- [ ] Payment integration (Stripe or RevenueCat)
- [ ] Backend deployment (Railway)
- [ ] Mobile deployment (TestFlight + Google Play)
- [ ] Unit tests (Jest + supertest)
- [ ] CI/CD (GitHub Actions)

<br />

## 🧪 Testing the API

Once the backend is running, you can interact with it via **Swagger** at:

```
http://localhost:3000/doc
```

Or use `curl`:

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Léa","email":"lea@frost.fr","password":"Test1234!"}'

# Fetch current user
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

<br />

## 👨‍💻 About this project

Built as a personal side project during my apprenticeship. The goal is to practice production-grade patterns across the full stack — from JWT authentication and cache invalidation to image processing and transactional emails.

<br />

<div align="center">

_This is a personal training project. Frost app design inspired by [maximefrost.fr](https://maximefrost.fr)._

</div>
