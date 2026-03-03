.PHONY: test test-module 

help:
	@echo "** Makefile for Tauri Rust Backend Testing **"
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  test	       - Run all tests with output (serial execution)"
	@echo "  test-module   - Run specific test module (usage: make test-module MODULE=report_tests)"

# Test targets
test:
	cargo test --lib -- --nocapture --test-threads=1

test-module:
	@if [ -z "$(MODULE)" ]; then \
		echo "Error: MODULE parameter is required"; \
		echo "Usage: make test-module MODULE=report_tests"; \
		exit 1; \
	fi
	cargo test $(MODULE) --lib -- --nocapture --test-threads=1
