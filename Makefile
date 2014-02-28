all: test

install: node_modules components build

build: components
	@./node_modules/.bin/component-build --dev

test: test-node test-browser

test-node:
	@./node_modules/.bin/hydro

test-browser: build
	@./node_modules/.bin/karma start

ci: test-node

clean: clean-node clean-browser clean-components

clean-node:
	@rm -rf node_modules

clean-components:
	@rm -rf build
	@rm -rf components

components: node_modules component.json
	@./node_modules/.bin/component-install --dev

node_modules: package.json
	@npm install

.PHONY: all node_modules
