import { Component, Input, Output } from './Component';

export type Wire = {
	input: Input,
	output: Output,
	index: number,
};

export type NewWireListener = (newWire: Wire) => void;

/**
 * Component that maps input to output
 * with 1-1 relationship.
 */
export class WireBundle extends Component {
	inputCount = 0;
	outputCount = 0;

	protected inputs: Input[]  = [];
	protected outputs: Output[] = [];

	private newWireListeners: NewWireListener[] = [];

	onNewWire(listener: NewWireListener) {
		this.newWireListeners.push(listener);
	}

	addWire(index = this.inputs.length) {
		if (
			this.inputs[index] ||
			this.outputs[index]
		) return;

		const input = new Input(this);
		const output = new Output(this);
		
		this.inputs[index] = input;
		this.outputs[index] = output;

		this.inputCount = this.inputs.length;
		this.outputCount = this.outputs.length;

		for (const listener of this.newWireListeners) {
			listener({ input, output, index });
		}
	}

	getInput(index: number) {
		this.addWire(index);
		return super.getInput(index);
	}

	getOutput(index: number) {
		this.addWire(index);
		return super.getOutput(index);
	}
	
	evaluate() {
		this.inputs.forEach(({ value }, index) => {
			if (!this.outputs[index]) {
				this.outputs[index] = new Output(this);
			} else {
				this.outputs[index].value = value;
			}
		});
		super.evaluate();
	}
}