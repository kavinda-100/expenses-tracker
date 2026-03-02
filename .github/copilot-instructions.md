# Copilot Instructions v1.0

Last Updated: 2026-03-02

---

# Table of Contents

1. Project Overview
2. Technology Used
3. Project Structure
4. Features
5. Development Guidelines
6. Code Generation Rules
7. Design System Guidelines
8. Security Best Practices
9. Testing Standards
10. Error Handling
11. Complete Code Example
12. Deployment Guidelines

---

# Project Overview

This repository hosts **CrabLedger**, **A modern, cross-platform desktop application for managing your personal finances**

The project consists of Three main layers:

- **Frontend (UI)**: Bun + Vite + React + TypeScript + Tailwind CSS + Shadcn/UI for the UI
- **Backend**: Rust + Tauri for native desktop capabilities, with Bun for JavaScript runtime.
- **Database**: SQLite for local data storage, accessed via Rust backend

---

# Technologies Used

- **Frontend**: Next.js, Vite, TypeScript, Tailwind CSS, Zustand, Shadcn/UI, lucide-icons
- **Backend**: Tauri, Rust, Bun.
- **Database**: SQLite (via Tauri's built-in support)
- **Charts**: Recharts for data visualization

---

# Project Structure

## Root Structure

- `src-tauri/`: Contains the Rust backend code for Tauri, including API routes and database interactions.
- `src/`: Contains the React frontend code, including components, pages, and styles.
- `src/hooks/`: Custom React hooks for API interactions and state management.
- `public/`: Static assets like icons and images for the frontend.

---

# Features

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

# Development Guidelines

- Follow the code generation rules and design system guidelines outlined in this document.
- Ensure all code is well-documented and adheres to the project's coding standards.
- Write tests for all new features and bug fixes, following the testing standards specified.
- Use Git for version control and follow the established branching and commit message conventions.
- Regularly update dependencies and ensure compatibility with the latest versions of the technologies used.
- ALL WAYS USE `hooks/useTauriQuery` for all API (GET) interactions to ensure consistent error handling and data fetching patterns across the frontend.
- ALL WAYS USE `hooks/useTauriMutation` for all API (POST/PUT/DELETE) interactions to ensure consistent error handling and data mutation patterns across the frontend.

---

# Code Generation Rules

- For frontend components, use React with TypeScript and Tailwind CSS for styling.
- For backend API routes, use Rust with Tauri's command system to handle requests and interact with the SQLite database.
- Ensure all generated code is modular, reusable, and follows the DRY principle.
- Use shadcn/ui components for consistent UI elements across the application.
- For data visualization, use Recharts to create interactive charts and graphs based on the user's financial
- use `hooks/useTauriQuery` for all API (GET) interactions to ensure consistent error handling and data fetching patterns across the frontend.
- use `hooks/useTauriMutation` for all API (POST/PUT/DELETE) interactions to ensure consistent error handling and data mutation patterns across the frontend.

---

# Design System Guidelines

- Colors: CSS custom properties in `globals.css` (e.g., `--color-primary`, `--color-secondary`, `--color-success`, `--color-error`)
- Typography: System fonts or defined hierarchy in Tailwind config
- Spacing: Tailwind spacing scale (4, 8, 12…)
- Components: Reusable cards, buttons, modals, forms; consistent sizes
- Icons: `lucide-react` or custom SVGs in `public/svgIcons`.

---

# Security Best Practices

- Validate and sanitize all user inputs on both frontend and backend
- Follow the principle of Rust ownership and borrowing to prevent memory safety issues
- Use tauri's SQLite API securely, avoiding SQL injection vulnerabilities
- Handle sensitive data with care, ensuring it is not exposed in logs or error messages

---

# Testing Standards

- Frontend: No tests for now, but aim for high test coverage in the future using Jest and React Testing Library
- Backend: Use Rust's built-in testing framework for unit and integration tests, aiming for high coverage on all API routes and database interactions

---

# Error Handling

- Frontend: Use custom hooks that in `hooks/` to manage API calls and handle errors gracefully, displaying user-friendly messages
- Backend: Use Rust's `Result<T, E>` type for error handling, ensuring all errors are properly propagated and handled in the application logic Because the custom hooks are used to encapsulate error handling and provide consistent error messages across the application.

---

## Complete code Example

Here's a full working example showing the entire flow from Rust backend to React frontend:

- Rust Backend (src-tauri/src/lib.rs)

```rs
use rand::Rng;

#[tauri::command]
async fn check_system_health() -> Result<String, String> {
    // Simulate async check
    tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;

    let mut rng = rand::thread_rng();
    let is_healthy = rng.gen_bool(0.8); // 80% chance of success

    if is_healthy {
        Ok("All systems operational".to_string())
    } else {
        Err("System degraded".to_string())
    }
}

// Register the command
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            check_system_health,
            // Add more commands here
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

- React Frontend Component

```tsx
import { useEffect } from "react";
import { useTauriQuery } from "./hooks/useTauriQuery";

function SystemMonitor() {
    const { data, error, loading, isRefetching, queryAsync, refetch } =
        useTauriQuery<string, string>();

    useEffect(() => {
        // Run initial health check on mount
        queryAsync("check_system_health");
    }, []);

    return (
        <div className="monitor">
            <h2>System Health Monitor</h2>

            {/* Loading State */}
            {loading && !isRefetching && (
                <div className="spinner">Checking system health...</div>
            )}

            {/* Refetching State */}
            {isRefetching && <div className="badge">Refreshing status...</div>}

            {/* Error State */}
            {error && <div className="alert alert-error">❌ {error}</div>}

            {/* Success State */}
            {data && <div className="alert alert-success">✅ {data}</div>}

            {/* Actions */}
            <button
                onClick={refetch}
                disabled={loading}
                className="btn-primary"
            >
                {loading ? "Checking..." : "Recheck Status"}
            </button>
        </div>
    );
}

export default SystemMonitor;
```

---

# Deployment Guidelines

- Build the application using Tauri's build command, which will create platform-specific executables for Windows, macOS, and Linux.
- Ensure all dependencies are up to date and compatible with the target platforms before building.
