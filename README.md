# ZRON
ZornCo Recursive Object Notation - JSON with circular references, functions, RegExp objects, and Date objects


Example:

### JavaScript (Node.JS)

```javascript
var ZRON = require('zron').ZRON;

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

var serialized = ZRON.stringify(test);
var parsed = ZRON.parse(serialized);

// `parsed` should now be equivalent to `test`
```

### TypeScript (Node.JS)

```typescript
import { ZRON } from 'zron';

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

let serialized = ZRON.stringify(test);
var parsed: Test = ZRON.parse(serialized);

// `parsed` should now implement the `Test` interface and be equivalent to `test`
```
