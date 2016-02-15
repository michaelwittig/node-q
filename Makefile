default: test

jshint:
	@echo "jshint"
	@find . -name "*.js" -print0 | xargs -0 ./node_modules/.bin/jshint

circular:
	@echo "circular"
	@./node_modules/.bin/madge --circular --format amd --exclude "madge|source-map" .

mocha:
	@echo "mocha (unit test)"
	@TZ=UTC ./node_modules/.bin/mocha test/*.js
	@echo

coverage:
	@echo "cover"
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha test/*
	@echo

mochait:
	@echo "mocha (integreation test assumes running kdb+tick process on localhost:5000)"
	@TZ=UTC ./node_modules/.bin/mocha -t 5000 itest/*.js
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
