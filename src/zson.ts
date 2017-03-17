export interface ZObj {
	type: 'object' | 'date' | 'regexp' | 'function';
	object?: Object;
	date?: {
		timestamp: number,
	};
	regexp?: {
		pattern: string,
		flags: string,
	};
	function?: {
		body: string,
	};
	raw?: any;
}

export class ZSON {
	public type: 'json' | 'zson' | 'undefined';
	public uidMap: {[uid: string]: ZObj} = {};
	public data: Object | string = {};
	private objMap = new Map<Object, string>();
	private count = 0;

	static UID_SUFFIX = '.ZSONUid';

	constructor() {}

	private genUid(): string {
		return (++this.count).toString();
	}

	public toString(): string {
		return JSON.stringify(this.toJSON());
	}

	public valueOf(): Object {
		return {
			type: this.type,
			uidMap: this.uidMap,
			data: this.data,
		};
	}

	public toJSON(): Object {
		return this.valueOf();
	}

	public mapObjs(obj: Object): void {
		if (typeof obj !== 'object') {
			return;
		}
		for (let key of Object.keys(obj)) {
			if (typeof obj[key] === 'object' && !this.objMap.has(obj[key])) {
				let uid = this.genUid();
				this.objMap.set(obj[key], uid);
				if (obj[key] instanceof Date) {
					let date: Date = obj[key];
					this.uidMap[uid] = {
						type: 'date',
						date: {
							timestamp: date.getTime(),
						},
					};
				}
				else if (obj[key] instanceof RegExp) {
					let regex: RegExp = obj[key];
					this.uidMap[uid] = {
						type: 'regexp',
						regexp: {
							pattern: regex.source,
							flags: regex.flags,
						},
					};
				}
				else {
					this.uidMap[uid] = {
						type: 'object',
						object: Object.assign({}, obj[key]),
					};
					this.mapObjs(obj[key]);
				}
			}
			else if (typeof obj[key] === 'function' && !this.objMap.has(obj[key])) {
				let uid = this.genUid();
				let func: Function = obj[key];
				let nativeMatch = /^function \w+\(\) { \[native code\] }$/ig;
				if (!nativeMatch.test(func.toString())) {
					this.objMap.set(obj[key], uid);
					this.uidMap[uid] = {
						type: 'function',
						function: {
							body: func.toString(),
						},
					};
				}
			}
		}
	}

	public unmapObjs(): void {
		for (let uid of Object.keys(this.uidMap)) {
			let zObj: ZObj = this.uidMap[uid];
			if (zObj.type === 'object') {
				zObj.raw = zObj.object;
			}
			else if (zObj.type === 'date') {
				let date = new Date(zObj.date.timestamp);
				zObj.raw = date;
			}
			else if (zObj.type === 'regexp') {
				let regex = new RegExp(zObj.regexp.pattern, zObj.regexp.flags);
				zObj.raw = regex;
			}
			else if (zObj.type === 'function') {
				let func = new Function('return ' + zObj.function.body)();
				zObj.raw = func;
			}
		}
		for (let uid of Object.keys(this.uidMap)) {
			let zObj: ZObj = this.uidMap[uid];
			if (zObj.type === 'object') {
				for (let key of Object.keys(zObj.raw)) {
					if (key.endsWith(ZSON.UID_SUFFIX)) {
						zObj.raw[key.substr(0, key.length - ZSON.UID_SUFFIX.length)] = this.uidMap[zObj.raw[key]].raw;
						delete zObj.raw[key];
					}
				}
			}
		}
		for (let key of Object.keys(this.data)) {
			if (key.endsWith(ZSON.UID_SUFFIX)) {
				this.data[key.substr(0, key.length - ZSON.UID_SUFFIX.length)] = this.uidMap[this.data[key]].raw;
				delete this.data[key];
			}
		}
		this.uidMap = {};
	}

	public setRoot(obj: Object): void {
		this.data = Object.assign({}, obj);
		this.mapObjs({obj});

		this.objMap.forEach((uid, origObj) => {
			for (let key of Object.keys(origObj)) {
				if (this.objMap.has(origObj[key])) {
					let type = this.uidMap[uid]['type'];
					this.uidMap[uid][type][key + ZSON.UID_SUFFIX] = this.objMap.get(origObj[key]);
					delete this.uidMap[uid][type][key];
				}
			}
		});

		for (let key of Object.keys(this.data)) {
			if (this.objMap.has(this.data[key])) {
				this.data[key + ZSON.UID_SUFFIX] = this.objMap.get(this.data[key]);
				delete this.data[key];
			}
		}
	}

	static stringify(thing: any): string {
		let result = new ZSON();

		if (typeof thing !== 'object') {
			if (thing === undefined) {
				result.type = "undefined";
				result.data = "undefined";
				return JSON.stringify(result);
			}
			result.type = "json";
			result.data = thing;
			return JSON.stringify(result);
		}
		else {
			result.type = 'zson';
			result.setRoot(thing);
			return JSON.stringify(result, undefined, "\t");
		}
	}

	static parse(str: string): any {
		let unwrapped: any = JSON.parse(str);
		let zson = new ZSON();
		for (let key of Object.keys(unwrapped)) {
			zson[key] = unwrapped[key];
		}
		zson.unmapObjs();
		return zson.data;
	}
}
