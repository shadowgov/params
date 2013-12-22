all: test

# Install node modules and components

install: node_modules components build

# Development

build: components
	@./node_modules/.bin/component-build --dev

test: test-node test-browser

coverage:
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_hydro

test-node:
	@./node_modules/.bin/hydro

test-browser: build
	@./node_modules/.bin/karma start

# CI

ci: test-node

# Clean

clean: clean-node clean-browser clean-components

clean-node:
	@rm -rf node_modules

clean-components:
	@rm -rf build
	@rm -rf components

# Support

components: node_modules component.json
	@./node_modules/.bin/component-install --dev

node_modules: package.json
	@npm install

.PHONY: all node_modules
