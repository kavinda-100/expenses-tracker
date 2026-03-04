import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
    // Ignore patterns
    {
        ignores: [
            "dist",
            "dist-ssr",
            "node_modules",
            "build",
            "*.config.js",
            ".vscode",
            "src-tauri/target",
        ],
    },

    // Base config for all JS/TS files
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        languageOptions: {
            ecmaVersion: 2024,
            globals: {
                ...globals.browser,
                ...globals.es2024,
            },
        },
        rules: {
            // General
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-unused-vars": "off", // Turned off in favor of TypeScript rule

            // TypeScript specific
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-empty-function": "warn",
        },
    },

    // React specific config
    {
        files: ["**/*.{jsx,tsx}"],
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
        },
    },

    // Prettier config (must be last to override other configs)
    prettierConfig,
);
