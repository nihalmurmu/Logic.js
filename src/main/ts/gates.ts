import { Component } from './Component';

/**
 * Gate is the smallest Component, takes 1 - 2
 * inputs and gives 1 output.
 * Gate implementations are responsible for
 * single or simple combined boolean operations.
 */
export abstract class Gate<
	INPUT extends [ boolean ] | [ boolean, boolean ]
> extends Component {
	static readonly maxInputCount: 1 | 2 = 2;
	static readonly maxOutputCount: 1 = 1;
	
	input: INPUT;
	get output(): [ boolean ] {
		return [ this.process(this.input) ];
	}

	protected abstract process(input: INPUT): boolean;

	public constructor(initialValue?: INPUT) {
		super();

		// Set initial input value
		const constructor = <typeof Component>this.constructor;
		const inputCount = constructor.maxInputCount;
		if (initialValue) {
			this.input = initialValue;
		} else {
			let input: boolean[] = [];
			for (let i = 0; i < inputCount; i++) {
				input.push(false);
			}
			this.input = <INPUT> input;
		}
	}
}

export class AND extends Gate<[ boolean, boolean ]> {
	static readonly maxInputCount: 2 = 2;
	protected process([ a, b ]: boolean[]) {
		return a && b;
	}
}

export class OR extends Gate<[ boolean, boolean ]> {
	static readonly maxInputCount: 2 = 2;
	protected process([ a, b ]: boolean[]) {
		return a || b;
	}
}

export class NOT extends Gate<[ boolean ]> {
	static readonly maxInputCount: 1 = 1;
	protected process([ a ]: boolean[]) {
		return !a;
	}
}

export class NAND extends Gate<[ boolean, boolean ]> {
	static readonly maxInputCount: 2 = 2;
	protected process([ a, b ]: boolean[]) {
		return !(a && b);
	}
}

export class NOR extends Gate<[ boolean, boolean ]> {
	static readonly inputCount: 2 = 2;
	protected process([ a, b ]: boolean[]) {
		return !(a || b);
	}
}

export class XOR extends Gate<[ boolean, boolean ]> {
	static readonly inputCount: 2 = 2;
	process([ a, b ]: boolean[]) {
		return (a || b) && !(a && b);
	}
}

export class XNOR extends Gate<[ boolean, boolean ]> {
	static readonly inputCount: 2 = 2;
	protected process([ a, b ]: boolean[]) {
		return !(a || b) || (a && b);
	}
}