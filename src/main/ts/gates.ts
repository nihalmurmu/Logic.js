import { Component, Input, Output } from './Component';

/**
 * Gate is the smallest Component, takes 1 - 2
 * inputs and gives 1 output.
 * Gate implementations are responsible for
 * single or simple combined boolean operations.
 */
export abstract class Gate extends Component {
	inputCount: 1 | 2 = 2;
	outputCount: 1 = 1;
	
	inputs: Input[] = [];
	outputs: Output[] = [];

	constructor() {
		super()

		// Initialize I/O
		for (let i = 0; i < this.inputCount; i++) {
			this.inputs.push(new Input(this));
		}
		this.outputs[0] = new Output(this);
	}

	protected abstract eval(input: boolean[]): boolean;

	evaluate() {
		const input = this.inputs.map(({ value }) => value);
		this.outputs[0].value = this.eval(input);
		super.evaluate();
	}
}

export class AND extends Gate {
	inputCount: 2 = 2;
	protected eval([ a, b ]: boolean[]) {
		return a && b;
	}
}

export class OR extends Gate {
	inputCount: 2 = 2;
	protected eval([ a, b ]: boolean[]) {
		return a || b;
	}
}

export class NOT extends Gate {
	inputCount: 1 = 1;
	protected eval([ a ]: boolean[]) {
		return !a;
	}
}

export class NAND extends Gate {
	inputCount: 2 = 2;
	protected eval([ a, b ]: boolean[]) {
		return !(a && b);
	}
}

export class NOR extends Gate {
	inputCount: 2 = 2;
	protected eval([ a, b ]: boolean[]) {
		return !(a || b);
	}
}

export class XOR extends Gate {
	inputCount: 2 = 2;
	protected eval([ a, b ]: boolean[]) {
		return (a || b) && !(a && b);
	}
}

export class XNOR extends Gate {
	inputCount: 2 = 2;
	protected eval([ a, b ]: boolean[]) {
		return !(a || b) || (a && b);
	}
}