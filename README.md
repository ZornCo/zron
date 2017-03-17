# ZRON
ZornCo Recursive Object Notation - JSON with circular references, functions, RegExp objects, and Date objects


Example:

### JavaScript (Node.JS)

```javascript
var ZSON = require('zson').ZSON;

var obj = {
	something: 1,
	somethingElse: 2,
};
obj.recurse = obj;
var test: Test = {
	obj: obj,
	func: function() { console.log('test'); },
	date: new Date(),
	regex: /.*test.*/ig,
};

var serialized = ZSON.stringify(test);
var parsed = ZSON.parse(serialized);

// `parsed` should now be equivalent to `test`
```

### TypeScript (Node.JS)

```typescript
import { ZSON } from 'zson';

interface Obj {
	something: 1;
	somethingElse: 2;
	recurse: Obj;
}
interface Test {
	obj: Obj;
	func: Function;
	date: Date;
	regex: RegExp;
}

let obj: Obj = {
	something: 1,
	somethingElse: 2,
	recurse: undefined,
};
obj.recurse = obj;
let test: Test = {
	obj,
	func: function() { console.log('test'); },
	date: new Date(),
	regex: /.*test.*/ig,
};

let serialized = ZSON.stringify(test);
var parsed: Test = ZSON.parse(serialized);

// `parsed` should now implement the `Test` interface and be equivalent to `test`
```
