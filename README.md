<div align="center">
  <img src="src-tauri/icons/icon.png" alt="CrabLedger Logo" width="120" height="120">
  
  # 💰 CrabLedger
  
  **A modern, cross-platform desktop application for managing your personal finances**
  
  [![Built with Tauri](https://img.shields.io/badge/Built%20with-Tauri-FFC131?logo=tauri&logoColor=white)](https://tauri.app)
  [![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  
</div>

---

## ✨ Features

- 📊 **Dashboard Overview** - View your financial summary at a glance
- 💸 **Transaction Management** - Track income and expenses with ease
- 📈 **Budget Planning** - Set and monitor budget limits by category
- 📑 **Detailed Reports** - Generate insightful financial reports and visualizations
- 🏷️ **Category Management** - Organize transactions with custom categories
- 🌓 **Dark/Light Mode** - Toggle between themes for comfortable viewing
- 💾 **Local Data Storage** - Your data stays on your device, private and secure
- ⚡ **Fast & Lightweight** - Built with Tauri for native performance
- 🎨 **Modern UI** - Beautiful interface with shadcn/ui components
- 🖥️ **Cross-Platform** - Works on Windows, macOS, and Linux

---

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 19.1.0 with TypeScript
- **Routing:** React Router 7
- **Styling:** Tailwind CSS 4.2
- **UI Components:** shadcn/ui with Radix UI primitives
- **Icons:** Lucide React
- **Charts:** Recharts for data visualization
- **Build Tool:** Vite

### Backend

- **Framework:** Tauri 2.0
- **Language:** Rust
- **Runtime:** Bun

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** (latest version) - [Install Bun](https://bun.sh)
- **Rust** (1.70+) - [Install Rust](https://rustup.rs)
- **Node.js** (16+) - For npm packages compatibility
- **System Dependencies:**
    - **Linux:** `webkit2gtk`, `libayatana-appindicator3-dev`, `librsvg2-dev`
        ```bash
        sudo apt install libwebkit2gtk-4.1-dev \
          build-essential curl wget file \
          libayatana-appindicator3-dev \
          librsvg2-dev
        ```
    - **macOS:** Xcode Command Line Tools
    - **Windows:** WebView2 (usually pre-installed on Windows 10/11)

---

## 🚀 Getting Started

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/kavinda-100/expenses-tracker.git
    cd expenses-tracker
    ```

2. **Install dependencies:**
    ```bash
    bun install
    ```

### Development

**Start the development server:**

```bash
# Using Makefile (recommended for Linux)
make dev

# Or using bun directly
bun run tauri dev
```

The application will start in development mode with hot-reload enabled.

> **Note:** On Linux, if you encounter GTK/GIO errors in VS Code, use the Makefile or run from a system terminal.

---

## 📦 Building & Distribution

Build your application for deployment across multiple platforms.

### 🏗️ Build Command

```bash
# Using Makefile
make build

# Or using bun
bun run tauri build
```

After building, find your distributable files in:

```
src-tauri/target/release/bundle/
```

**Build Output Structure:**

```
bundle/
├── deb/              # Debian/Ubuntu packages
├── rpm/              # Red Hat/Fedora packages
├── appimage/         # Universal Linux packages
├── msi/              # Windows installers
└── dmg/              # macOS disk images
```

---

## 📥 Installation Guide

### 🐧 Linux Installation

Tauri generates multiple package formats for broad Linux compatibility.

#### **Debian/Ubuntu (.deb)**

```bash
# Install
sudo dpkg -i src-tauri/target/release/bundle/deb/crab-ledger_0.1.0_amd64.deb

# Fix dependency issues (if any)
sudo apt-get install -f

# Uninstall
sudo apt remove crab-ledger
# or
sudo dpkg -r crab-ledger
```

#### **Red Hat/Fedora (.rpm)**

```bash
# Install
sudo rpm -i src-tauri/target/release/bundle/rpm/crab-ledger-0.1.0-1.x86_64.rpm

# Uninstall
sudo rpm -e crab-ledger
# or
sudo dnf remove crab-ledger
```

#### **Universal Linux (.AppImage)**

No installation required! Just make it executable and run:

```bash
# Navigate to the AppImage
cd src-tauri/target/release/bundle/appimage/

# Make executable
chmod +x crab-ledger_0.1.0_amd64.AppImage

# Run directly
./crab-ledger_0.1.0_amd64.AppImage
```

**✅ AppImage Advantages:**

- Works on any Linux distribution
- No installation or root privileges required
- Portable - run from USB drives
- Self-contained with all dependencies

**Remove:**

```bash
rm crab-ledger_0.1.0_amd64.AppImage
```

---

### 🪟 Windows Installation

Find the `.msi` installer in `src-tauri/target/release/bundle/msi/`

**Install:**

1. Double-click `CrabLedger_0.1.0_x64_en-US.msi`
2. Follow the installation wizard
3. Launch from Start Menu or Desktop shortcut

**Uninstall:**

1. Open **Settings** → **Apps** → **Installed apps**
2. Find "CrabLedger"
3. Click the three dots (⋮) → **Uninstall**

---

### 🍎 macOS Installation

Find the `.dmg` file in `src-tauri/target/release/bundle/dmg/`

**Install:**

1. Double-click `CrabLedger_0.1.0_universal.dmg`
2. Drag the app icon to the **Applications** folder
3. Launch from Applications or Spotlight

**Uninstall:**

1. Open **Finder** → **Applications**
2. Drag "CrabLedger" to **Trash**
3. Empty Trash

> **Note:** On first launch, you may need to right-click the app and select "Open" if macOS shows a security warning.

---

---

## 🏗️ Project Structure

```
expenses-tracker/
├── src/                          # React frontend source
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── AppSidebar.tsx        # Main navigation sidebar
│   │   └── ModeToggle.tsx        # Dark/light theme toggle
│   ├── layouts/                  # Layout components
│   │   └── MainLayout.tsx        # Main application layout
│   ├── screens/                  # Page components
│   │   ├── HomeScreen.tsx        # Dashboard
│   │   ├── TransactionsScreen.tsx
│   │   ├── BudgetScreen.tsx
│   │   ├── ReportsScreen.tsx
│   │   ├── CategoriesScreen.tsx
│   │   └── SettingScreen.tsx
│   ├── providers/                # Context providers
│   ├── lib/                      # Utility functions
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
├── src-tauri/                    # Tauri backend
│   ├── src/                      # Rust source code
│   │   ├── main.rs               # Main entry point
│   │   └── lib.rs                # Application logic
│   ├── icons/                    # Application icons
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri configuration
├── public/                       # Static assets
└── package.json                  # Node dependencies
```

---

## 🎨 Customization

### Generating Custom Icons

Replace the source icon and regenerate all platform icons:

```bash
# Place your icon (1024x1024 PNG recommended) in src-tauri/
# Then run:
bun run tauri icon src-tauri/your-icon.png
```

This automatically generates icons for all platforms (Windows, macOS, Linux, iOS, Android).

### Theme Configuration

The app supports dark and light themes. Customize colors in your Tailwind configuration.

---

## ⚠️ Troubleshooting

### Common Issues

#### **GTK/GIO Module Errors (Linux)**

**Problem:** Errors related to GTK and GIO modules when running `bun run tauri dev`

**Solutions:**

1. **Use the Makefile** (recommended):

    ```bash
    make dev
    ```

    The Makefile automatically unsets problematic environment variables.

2. **Run from system terminal** instead of VS Code's integrated terminal:
    - VS Code snap packages can cause conflicts
    - Open your system terminal and run commands there

3. **Manual fix:**
    ```bash
    unset GTK_PATH GTK_EXE_PREFIX GIO_MODULE_DIR GSETTINGS_SCHEMA_DIR
    bun run tauri dev
    ```

#### **Window Size Constraints Not Working**

The minimum window size is set programmatically in `src-tauri/src/lib.rs`:

- Minimum: 1000x700 pixels
- Prevents UI layout breaking on small screens

#### **Build Errors**

If you encounter build errors:

```bash
# Clean build artifacts
cd src-tauri
cargo clean

# Try building again
cd ..
bun run tauri build
```

---

## 🧪 Available Commands

```bash
# Development
make dev              # Start dev server (Linux, handles env vars)
bun run tauri dev     # Start dev server (cross-platform)
bun run dev          # Start frontend only (Vite)

# Building
make build           # Build for production
bun run tauri build  # Build for production
bun run build        # Build frontend only

# Icon Generation
bun run tauri icon <path-to-icon.png>

# Clean
make clean           # Remove build artifacts
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Kavinda**

- GitHub: [@kavinda-100](https://github.com/kavinda-100)
- Repository: [expenses-tracker](https://github.com/kavinda-100/expenses-tracker)

---

## 🙏 Acknowledgments

- [Tauri](https://tauri.app) - For the amazing framework
- [shadcn/ui](https://ui.shadcn.com) - For beautiful UI components
- [Lucide](https://lucide.dev) - For the icon set
- [Tailwind CSS](https://tailwindcss.com) - For the styling system

---

<div align="center">
  
  **⭐ Star this repository if you find it helpful!**
  
  Made with ❤️ using Tauri & React
  
</div>
