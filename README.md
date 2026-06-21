# Pokedex

A mobile-first Pokedex application built with Ionic, Angular, and Capacitor. Browse Pokémon, view detailed stats, abilities, and moves, and save your favourites — all runnable on web, Android, and iOS from a single codebase.

---

## Tech Stack

| Technology | Version |
|---|---|
| Angular | 20.3.25 |
| Ionic Angular | ^8.0.0 |
| Capacitor | 8.4.0 |
| TypeScript | ~5.9.0 |

---

## Prerequisites

Before running the app, make sure the following tools are installed:

### Node.js
- **Required version:** `22.17.0`
- Download from [nodejs.org](https://nodejs.org) or use a version manager like `nvm`:
  ```bash
  nvm install 22.17.0
  nvm use 22.17.0
  ```

### Android Studio (for Android builds)
- **Required version:** Android Studio Quail 1 | 2026.1.1 Patch 2
- Download from [developer.android.com/studio](https://developer.android.com/studio)
- After installing, open Android Studio and complete the setup wizard to install the Android SDK
- Make sure `ANDROID_HOME` and `JAVA_HOME` environment variables are set correctly

### Xcode (for iOS builds — macOS only)
- **Required version:** Xcode 15 or later
- Install from the Mac App Store
- After installing, run:
  ```bash
  sudo xcode-select --switch /Applications/Xcode.app
  sudo xcodebuild -runFirstLaunch
  ```
- Accept the Xcode license:
  ```bash
  sudo xcodebuild -license accept
  ```

### Ionic CLI
- Install globally:
  ```bash
  npm install -g @ionic/cli
  ```

---

## Folder Structure

```
pokedex/
├── android/                        # Native Android project (Capacitor)
├── ios/                            # Native iOS project (Capacitor)
├── src/
│   ├── app/
│   │   ├── core/                   # Singleton services, interfaces, enums, and utilities
│   │   │   ├── enums/
│   │   │   ├── interfaces/
│   │   │   ├── services/           # pokemon, favourite, local-storage, toast services
│   │   │   └── utils/
│   │   ├── feature/
│   │   │   └── pokemon/            # Pokemon feature module
│   │   │       ├── components/     # Feature-specific components
│   │   │       └── pages/          # Route-level page components
│   │   └── shared/                 # Reusable components and layouts
│   │       ├── components/
│   │       └── layouts/
│   ├── assets/                     # Static assets (icons, SVGs)
│   ├── environments/               # Environment configs (dev, prod)
│   ├── styles/                     # Global SCSS styles and themes
│   └── theme/                      # Ionic theme variables
├── capacitor.config.ts             # Capacitor configuration
├── ionic.config.json               # Ionic project configuration
├── angular.json                    # Angular CLI configuration
└── package.json
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

---

## Running on Web

Start the local development server:

```bash
npm start
```

The app will be available at `http://localhost:8100` (or the port shown in your terminal). The browser will auto-reload on file changes.

---

## Running on Android

This process builds the web assets, copies them into the native Android project, and opens Android Studio so you can run the app on a device or emulator.

**Step 1 — Run the build script:**

```bash
npm run build-pokedex-android
```

This command will:
1. Build the Angular app for development
2. Copy the built assets into the `android/` native project
3. Open the project in Android Studio automatically

**Step 2 — Run from Android Studio:**

Once Android Studio opens:
1. Wait for the Gradle sync to finish
2. Select a connected device or start an Android emulator from **Device Manager**
3. Press the **Run** button (▶) or use `Shift + F10`

---

## Running on iOS

> iOS builds require a Mac with Xcode installed.

This process builds the web assets, copies them into the native iOS project, and opens Xcode so you can run the app on a simulator or device.

**Step 1 — Run the build script:**

```bash
npm run build-pokedex-ios
```

This command will:
1. Build the Angular app for development
2. Copy the built assets into the `ios/` native project
3. Open the project in Xcode automatically

**Step 2 — Run from Xcode:**

Once Xcode opens:
1. Select the `App` scheme in the scheme selector at the top
2. Choose a simulator or a connected physical device from the device picker
3. Press the **Run** button (▶) or use `Cmd + R`

> **Note:** To run on a physical iOS device you will need an Apple Developer account and must configure code signing in the **Signing & Capabilities** tab of the `App` target.
