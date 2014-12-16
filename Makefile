default: test

jshint:
	@echo "jshint"
	@find . -name "*.js" -not -path "./node_modules/*" -print0 | xargs -0 ./node_modules/.bin/jshint

circular:
	@echo "circular"
	@./node_modules/.bin/madge --circular --format amd .

mocha:
	@echo "mocha (unit test)"
	@./node_modules/.bin/mocha test/*.js
	@echo

mochait:
	@echo "mocha (integreation test assumes running kdb+tick process on localhost:5000)"
	@./node_modules/.bin/mocha itest/*.js
	@echo

test: jshint mocha circular
	@echo "test"
	@echo

itest: jshint mocha mochait circular
	@echo "test"
	@echo

outdated:
	@echo "outdated modules?"
	@./node_modules/.bin/npmedge
