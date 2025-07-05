# commander-counter

A React Native application for tracking Commander (EDH) game stats.

## Prerequisites

- Node.js (>=18 recommended, see `engines` in `package.json`)
- Yarn (v1.x)
- Watchman (recommended for macOS)
- Ruby and Bundler (for iOS development)
- JDK (for Android development)
- Xcode (for iOS development)
- Android Studio & Android SDK (for Android development)

> **Note**: Make sure you have completed the React Native [Set Up Your Environment guide](https://reactnative.dev/docs/set-up-your-environment) for your specific OS and target platforms (iOS/Android).

## Initial Setup

1. Clone the repository:

   ```sh
   git clone git@github.com:BrodyHughes/commander-counter.git
   cd commander-counter
   ```

2. Install dependencies (JavaScript, Ruby gems, and CocoaPods):

   ```sh
   yarn install-all
   ```

   _(This runs `yarn install`, `bundle install`, and `pod install`)_

   Alternatively, for a manual step-by-step setup:

   ```sh
   yarn install          # Install JavaScript dependencies
   bundle install        # Install Ruby dependencies (for iOS)
   cd ios && pod install && cd .. # Install CocoaPods (for iOS)
   ```

## Development

### Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.
To start the Metro dev server, run the following command from the root of your project:

```sh
yarn start
```

### Step 2: Running the App

#### iOS

```bash
yarn ios            # Builds & runs in iOS Simulator
```

#### Android

```bash
yarn android        # Builds & runs on Android emulator or connected device
```

_Pro‑tip_: Press `R` twice to reload on Android, or `⌘ R` in the iOS Simulator.

## Project Structure

```
.
├── android/            # Native Android project files
├── ios/                # Native iOS project files
├── src/
│   ├── components/     # Reusable UI components (e.g., PlayerPanel, CentralMenuButton)
│   ├── consts/         # Application-wide constants (e.g., layout values, theme elements)
│   ├── helpers/        # Utility functions (e.g., API helpers)
│   ├── hooks/          # Custom React Hooks (if any, shared across features)
│   ├── store/          # Zustand state management (e.g., useLifeStore, useTurnStore)
│   └── styles/         # Global styles, design system tokens (e.g., typography, spacing)
├── app.json            # React Native configuration (app name, display name)
├── babel.config.js     # Babel configuration (includes module-resolver for @/ alias)
├── metro.config.js     # Metro bundler configuration
├── tsconfig.json       # TypeScript configuration (includes baseUrl and paths for @/ alias)
└── README.md           # This file
```

**Note on Path Aliases:** This project uses a path alias `@/*` which resolves to `src/*`. This is configured in `tsconfig.json` (for TypeScript) and `babel.config.js` (for Metro).

## Available Scripts

| Command            | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| `yarn start`       | Starts the Metro bundler.                                                |
| `yarn ios`         | Builds and runs the app on the iOS Simulator.                            |
| `yarn android`     | Builds and runs the app on an Android emulator or device.                |
| `yarn install-all` | Installs JS, Ruby, and CocoaPods dependencies. Useful for initial setup. |
| `yarn lint`        | Lints the codebase using ESLint (configured with Prettier).              |
| `yarn lint:fix`    | Lints and automatically fixes code style issues.                         |
| `yarn typecheck`   | Checks the project for TypeScript errors (`tsc --noEmit`).               |
| `yarn format`      | Formats code using Prettier (for all supported file types).              |
| `yarn test`        | Runs unit tests using Jest (if configured).                              |

## Contributing

Follow these steps to get a pull request merged:

1. If you're an outside contributor, fork the repo & create a feature branch. If you are an internal contributor, create a feature branch from `main`:
   `git checkout -b <username>/<short-description>`
2. Commit using descriptive commits.
3. Push up your work and open a PR against `main`.
4. Our future CI pipeline will run lint, type‑check, tests and build. For now, please ensure your changes pass locally.
5. Request a review from @BrodyHughes or another maintainer.
6. Squash‑merge once CI is green (or local checks pass and PR is approved) ✅.

**Local Sanity Check:**
Before pushing, run the following to ensure your changes meet project standards:

```bash
yarn lint:fix && yarn typecheck # Add && yarn test when tests are in place
```

Feel free to open an issue or PR for anything you'd like to tackle.

## Troubleshooting

- **Metro stuck on "Loading dependency graph"** – Run `npx react-native-clean-project` then `yarn start --reset-cache`.
- **iOS build fails with Ruby gems** – Ensure Ruby is installed (e.g., via `brew install ruby`) then try `bundle install` again. Sometimes `sudo gem install cocoapods bundler` might be needed if permissions are an issue, but prefer managing gems via Bundler.
- More tips in the official [React Native Troubleshooting guide](https://reactnative.dev/docs/troubleshooting).

## Acknowledgements

- [React Native](https://reactnative.dev) & the awesome OSS community
- Iconography by [lucide.dev](https://lucide.dev) (If you are using icons from here, otherwise remove or update)
