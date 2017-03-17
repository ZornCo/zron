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
};

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
		});
	});

	it('should parse', function() {
		let zson = ZSON.stringify(test);
		let parsed: Test = ZSON.parse(zson);
		expect(test.obj.something).toBe(1);
		expect(test.obj.somethingElse).toBe(2);
		expect(test.obj.recurse).toBe(test.obj);
		expect(test.func.toString()).toBe(func.toString());
		expect(test.date.getTime()).toBe(date.getTime());
		expect(test.regex.source).toBe(regex.source);
		expect(test.regex.flags).toBe(regex.flags);
	});
});
