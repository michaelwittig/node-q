default: test

jslint:
	@echo "jslint"
	@find . -name "*.js" -not -path "./node_modules/*" -not -path "./lib/*" -print0 | xargs -0 ./node_modules/.bin/jslint --white --nomen --node --predef describe --predef it --predef before --predef after --predef Uint8Array --predef ArrayBuffer

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

test: jslint mocha circular
	@echo "test"
	@echo

itest: jslint mocha mochait circular
	@echo "test"
	@echo

outdated:
	@echo "outdated modules?"
	@./node_modules/.bin/npmedge
