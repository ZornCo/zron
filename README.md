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

### Example ZRON string

```json
{
	"type": "zron",
	"uidMap": {
		"1": {
			"type": "object",
			"object": {
				"something": 1,
				"somethingElse": 2,
				"recurse.ZRONUid": "1"
			}
		},
		"2": {
			"type": "object",
			"object": [
				1,
				2,
				3
			]
		},
		"3": {
			"type": "function",
			"function": {
				"body": "function () {\n    console.log('test');\n}"
			}
		},
		"4": {
			"type": "date",
			"date": {
				"timestamp": 1489774183274
			}
		},
		"5": {
			"type": "regexp",
			"regexp": {
				"pattern": ".*test.*",
				"flags": "gi"
			}
		}
	},
	"data": {
		"obj.ZRONUid": "1",
		"arr.ZRONUid": "2",
		"func.ZRONUid": "3",
		"date.ZRONUid": "4",
		"regex.ZRONUid": "5",
		"recurse.ZRONUid": "0"
	}
}
```
