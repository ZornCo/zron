import 'jasmine';

import { ZRON } from './index';

interface Obj {
	something: 1;
	somethingElse: 2;
	recurse: Obj;
}
interface Test {
	someText: string;
	someNumber: number;
	obj: Obj;
	arr: Array<number>;
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
let arr = [1, 2, 3];
let date = new Date();
let regex = /.*test.*/ig;
let test: Test = {
	someText: 'this is text',
	someNumber: 1337,
	obj,
	arr,
	func,
	date,
	regex,
	recurse: undefined,
};
test.recurse = test;

describe('ZRON', function() {
	it('should stringify', function() {
		let zron = ZRON.stringify(test);

		expect(zron).toBeTruthy();

		it('should not change value on passed obj', function() {
			expect(test.someText).toBe('this is text');
			expect(test.someNumber).toBe(1337);
			expect(test.obj).toBe(obj);
			expect(test.obj.something).toBe(1);
			expect(test.obj.somethingElse).toBe(2);
			expect(test.obj.recurse).toBe(test.obj);
			expect(Array.isArray(test.arr)).toBe(true);
			expect(test.arr).toBe(arr);
			expect(test.arr.length).toBe(3);
			expect(test.arr[0]).toBe(1);
			expect(test.arr[1]).toBe(2);
			expect(test.arr[2]).toBe(3);
			expect(test.func).toBe(func);
			expect(test.date).toBe(date);
			expect(test.regex).toBe(regex);
			expect(test.recurse).toBe(test);
		});
	});

	it('should parse', function() {
		let zron = ZRON.stringify(test);
		let parsed: Test = ZRON.parse(zron);
		expect(parsed.someText).toBe('this is text');
		expect(parsed.someNumber).toBe(1337);
		expect(parsed.obj.something).toBe(1);
		expect(parsed.obj.somethingElse).toBe(2);
		expect(parsed.obj.recurse).toBe(parsed.obj);
		expect(Array.isArray(parsed.arr)).toBe(true);
		expect(parsed.arr.length).toBe(3);
		expect(parsed.arr[0]).toBe(1);
		expect(parsed.arr[1]).toBe(2);
		expect(parsed.arr[2]).toBe(3);
		expect(parsed.func.toString()).toBe(func.toString());
		expect(parsed.date.getTime()).toBe(date.getTime());
		expect(parsed.regex.source).toBe(regex.source);
		expect(parsed.regex.flags).toBe(regex.flags);
		expect(parsed.recurse).toBe(parsed);
	});
});
