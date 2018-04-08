import { Component } from './Component';

export abstract class Gate<INPUT extends [ boolean ] | [ boolean, boolean ]> extends Component {
	static readonly inputCount: 1 | 2 = 2;
	static readonly outputCount: 1 = 1;

	readonly inputCount: 1 | 2 = 2;
	readonly outputCount: 1 = 1;
	
	input: INPUT;
	get output(): [ boolean ] {
		return [ this.process(this.input) ];
	}

	protected abstract process(input: INPUT): boolean;

	public constructor(initialValue?: INPUT) {
		super();

		// Set initial input value
		if (initialValue) {
			this.input = initialValue;
		} else {
			let input: boolean[] = [];
			for (let i = 0; i < this.inputCount; i++) {
				input.push(false);
			}
			this.input = <INPUT> input;
		}
	}
}

export class AND extends Gate<[ boolean, boolean ]> {
	static readonly inputCount: 2 = 2;
	readonly inputCount: 2 = 2;

	protected process([ a, b ]: boolean[]) {
		return a && b;
	}
}

export class OR extends Gate<[ boolean, boolean ]> {
	static readonly inputCount: 2 = 2;
	readonly inputCount: 2 = 2;

	protected process([ a, b ]: boolean[]) {
		return a || b;
	}
}

export class NOT extends Gate<[ boolean, boolean ]> {
	static readonly inputCount: 1 = 1;
	readonly inputCount: 1 = 1;

	protected process([ a ]: boolean[]) {
		return !a;
	}
}

export class NAND extends Gate<[ boolean, boolean ]> {
	static readonly inputCount: 2 = 2;

	protected process([ a, b ]: boolean[]) {
		return !(a && b);
	}
}

export class NOR extends Gate<[ boolean, boolean ]> {
	static readonly inputCount: 2 = 2;
	readonly inputCount: 2 = 2;

	protected process([ a, b ]: boolean[]) {
		return !(a || b);
	}
}

export class XOR extends Gate<[ boolean, boolean ]> {
	static readonly inputCount: 2 = 2;
	readonly inputCount: 2 = 2;

	process([ a, b ]: boolean[]) {
		return (a || b) && !(a && b);
	}
}

export class XNOR extends Gate<[ boolean, boolean ]> {
	static readonly inputCount: 2 = 2;
	readonly inputCount: 2 = 2;

	protected process([ a, b ]: boolean[]) {
		return !(a || b) || (a && b);
	}
}