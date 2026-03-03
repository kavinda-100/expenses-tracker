.PHONY: help dev build clean install

help:
	@echo "** Makefile for Tauri Application (for development when vscode terminal is not supported to run tauri app because the vscode snap related errors) **"
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  dev           - Run the Tauri application in development mode"
	@echo "  build         - Build the Tauri application for production"
	@echo "  clean         - Remove build artifacts and dependencies"
	@echo "  install       - Install project dependencies using bun"

dev:
	unset GTK_PATH GTK_EXE_PREFIX GIO_MODULE_DIR GSETTINGS_SCHEMA_DIR && bun run tauri dev

build:
	unset GTK_PATH GTK_EXE_PREFIX GIO_MODULE_DIR GSETTINGS_SCHEMA_DIR && bun run tauri build

clean:
	rm -rf src-tauri/target
	rm -rf node_modules
	rm -rf dist

install:
	bun install