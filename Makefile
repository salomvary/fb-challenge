all: lint test

test:
	node tests.js

lint:
	eslint *.js

open:
	open index.html
