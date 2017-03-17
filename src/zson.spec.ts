import 'jasmine';

import { ZSON } from './index';

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
	recurse: Test;
}

let obj: Obj = {
	something: 1,
	somethingElse: 2,
	recurse: undefined,
};
obj.recurse = obj;
let func = function() {
	console.log('test');
};
let date = new Date();
let regex = /.*test.*/ig;
let test: Test = {
	obj,
	func,
	date,
	regex,
	recurse: undefined,
};
test.recurse = test;

describe('ZSON', function() {
	it('should stringify', function() {
		let zson = ZSON.stringify(test);

		expect(zson).toBeTruthy();

		it('should not change value on passed obj', function() {
			expect(test.obj).toBe(obj);
			expect(test.obj.something).toBe(1);
			expect(test.obj.somethingElse).toBe(2);
			expect(test.obj.recurse).toBe(test.obj);
			expect(test.func).toBe(func);
			expect(test.date).toBe(date);
			expect(test.regex).toBe(regex);
			expect(test.recurse).toBe(test);
		});
	});

	it('should parse', function() {
		let zson = ZSON.stringify(test);
		let parsed: Test = ZSON.parse(zson);
		expect(parsed.obj.something).toBe(1);
		expect(parsed.obj.somethingElse).toBe(2);
		expect(parsed.obj.recurse).toBe(parsed.obj);
		expect(parsed.func.toString()).toBe(func.toString());
		expect(parsed.date.getTime()).toBe(date.getTime());
		expect(parsed.regex.source).toBe(regex.source);
		expect(parsed.regex.flags).toBe(regex.flags);
		expect(parsed.recurse).toBe(parsed);
	});
});
