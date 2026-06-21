# Pokedex

A mobile-first Pokédex application built with **Angular**, **Ionic**, and **Capacitor**. Browse Pokémon, view detailed stats, abilities, and moves, and save your favourites — all from a single codebase that runs on **web**, **Android**, and **iOS**.

---

## Demo


https://github.com/user-attachments/assets/987063e9-ddda-4c75-9495-baa48df37483



Try out the app or watch it in action on each platform.

### Web

The app is deployed and accessible directly in your browser:

🔗 **[Open Live Demo](https://main.d3qpzk42c3fhtd.amplifyapp.com/pokemon/list)**

### Android

* 📦 **[Download APK](https://drive.google.com/drive/folders/1zjSnVZhCmCgL9zMJ9uuantSEY2YyD452?usp=drive_link)** — install directly on your Android device
* 🎥 **[Watch Demo Video](https://drive.google.com/drive/folders/1zjSnVZhCmCgL9zMJ9uuantSEY2YyD452?usp=drive_link)** — see the app in action

> **Note:** To install the APK, you may need to enable **Install from unknown sources** in your device settings.

### iOS

* 🎥 **[Watch Demo Video](https://drive.google.com/drive/folders/1zjSnVZhCmCgL9zMJ9uuantSEY2YyD452?usp=drive_link)** — see the app running on iOS

> **Note:** An installable iOS build is not provided because distributing apps outside the App Store requires registering each device’s UDID under an Apple Developer account. The demo video shows the full iOS experience instead.

---

## Features

* [x] Browse Pokémon using **infinite scrolling**
* [x] View **Pokémon details** including stats, abilities, and moves
* [x] Display **Pokémon images**
* [x] **Favourite / unfavourite** Pokémon
* [x] View a dedicated **favourites list**
* [x] **Filter Pokémon by type**
* [x] Run on **web**, **Android**, and **iOS** from a single codebase

---

## Tech Stack

| Technology    | Version |
| ------------- | ------- |
| Angular       | 20.3.25 |
| Ionic Angular | ^8.0.0  |
| Capacitor     | 8.4.0   |
| TypeScript    | ~5.9.0  |

---

## Architecture Notes

This project follows a **feature-based structure** with a clear separation of concerns to keep the codebase maintainable and scalable.

- **`core/`** contains application-wide building blocks related to server communication and global app concerns, such as API-facing services, interfaces, enums, and utility functions
- **`shared/`** contains reusable app-level components, layouts, and helpers that are not tied to server communication and can be used across multiple features
- **`feature/`** contains the actual business features of the application, with each feature owning its own pages and feature-specific components
- **`styles/`** acts as a custom style library for shared styling utilities, global SCSS structure, and reusable design tokens
- **service classes** are intentionally kept under a `services/` naming convention for clarity and consistency, even though the project uses the latest Angular version
- the app is built with a **mobile-first approach** while still supporting larger desktop layouts

---

## Data & State

* Pokémon list and detail data are fetched from **PokéAPI**
* favourite Pokémon are stored locally on the device/browser using local storage
* Pokémon type filters are applied on the list page

---

## Prerequisites

Before running the app, make sure the following tools are installed.

### Node.js

* **Developed with version:** `22.17.0`

Download from [nodejs.org](https://nodejs.org) or use a version manager such as `nvm`:

```bash
nvm install 22.17.0
nvm use 22.17.0
```

### Ionic CLI

Install globally:

```bash
npm install -g @ionic/cli
```

### Android Studio (for Android builds)

* **Required version:** Android Studio Quail 1 | 2026.1.1 Patch 2

Download from [developer.android.com/studio](https://developer.android.com/studio).

After installation:

* complete the Android Studio setup wizard
* ensure the Android SDK is installed
* make sure `ANDROID_HOME` and `JAVA_HOME` environment variables are configured correctly

### Xcode (for iOS builds — macOS only)

* **Developed with:** Xcode 16.0

Install from the Mac App Store.

> **Note on Capacitor version & iOS builds**
> Capacitor 8 requires Xcode 26+ (which in turn requires macOS 26.2+) to compile its iOS plugins. On a development machine running an older Xcode (for example, Xcode 16), the iOS build fails with errors such as:
>
> ```ts
> Value of type 'CAPPluginCall' has no member 'reject'
> ```
>
> Because upgrading Xcode would also require upgrading macOS, this project pins **Capacitor 7** for iOS builds, which is fully compatible with Xcode 16. Capacitor 7 is stable and production-ready, so this does not affect the application functionality.

---

## Folder Structure

```bash
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
│   │   │   └── pokemon/            # Pokémon feature
│   │   │       ├── components/     # Feature-specific components
│   │   │       └── pages/          # Route-level page components
│   │   └── shared/                 # Reusable components and layouts
│   │       ├── components/
│   │       └── layouts/
│   ├── assets/                    # Static assets (icons, SVGs)
│   ├── environments/              # Environment configs (dev, prod)
│   ├── styles/                    # Global SCSS styles and themes
│   └── theme/                     # Ionic theme variables
├── capacitor.config.ts            # Capacitor configuration
├── ionic.config.json              # Ionic project configuration
├── angular.json                   # Angular CLI configuration
├── amplify.yml                    # AWS Amplify build settings
└── package.json
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

---

## Available Scripts

* `npm install` — install project dependencies
* `ionic serve` — run the app locally in the browser
* `npm run build-pokedex-android` — build the app and sync it to the Android native project
* `npm run build-pokedex-ios` — build the app and sync it to the iOS native project

---

## Running on Web

Start the local development server:

```bash
ionic serve
```

The app will be available at `http://localhost:8100` (or the port shown in your terminal). The browser will automatically reload on file changes.

---

## Running on Android

This process builds the web assets, copies them into the native Android project, and opens Android Studio so the app can be run on a device or emulator.

### Step 1 — Run the build script

```bash
npm run build-pokedex-android
```

This command will:

1. build the Angular app for development
2. copy the built assets into the `android/` native project
3. open the project in Android Studio automatically

### Step 2 — Run from Android Studio

Once Android Studio opens:

1. wait for the Gradle sync to finish
2. select a connected device or start an Android emulator from **Device Manager**
3. press the **Run** button (▶) or use `Shift + F10`

---

## Running on iOS

> iOS builds require a Mac with Xcode installed.

This process builds the web assets, copies them into the native iOS project, and opens Xcode so the app can be run on a simulator or physical device.

### Step 1 — Run the build script

```bash
npm run build-pokedex-ios
```

This command will:

1. build the Angular app for development
2. copy the built assets into the `ios/` native project
3. open the project in Xcode automatically

### Step 2 — Run from Xcode

Once Xcode opens:

1. select the `App` scheme in the scheme selector at the top
2. choose a simulator or a connected physical device from the device picker
3. press the **Run** button (▶) or use `Cmd + R`

> **Note:** To run on a physical iOS device, you will need an Apple Developer account and must configure code signing in the **Signing & Capabilities** tab of the `App` target.

---

## Notes / Limitations

* iOS installable builds are not distributed publicly because physical-device distribution outside the App Store requires Apple provisioning and device registration
* iOS functionality is demonstrated through the provided demo video
* the application depends on **PokéAPI** availability and response structure
* Android and iOS native projects are managed through **Capacitor**

---
