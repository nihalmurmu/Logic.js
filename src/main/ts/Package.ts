import { Component, Input, Output } from './Component';
import { WireBundle, Wire } from './WireBundle';

type ComponentId = { type: string, index: number };

/**
 * Package is a Component that abstracts
 * multiple Components into a single package.
 * It's responsible for combining and timing
 * logic flow between those Components.
 * A Package can be drawn as a component
 * diagram or as an abstraction.
 */
export class Package extends Component {
	inputCount = 0;
	outputCount = 0;

	protected inputs: Input[] = [];
	protected outputs: Output[] = [];

	inputWires = new WireBundle();
	outputWires = new WireBundle();

	/**
	 * Components that are in this Package.
	 */
	components: Component[];

	constructor() {
		super();

		this.inputWires.stopsEvaluation = true;

		this.inputWires.onNewWire((wire) => this.connectWire(wire));
		this.outputWires.onNewWire((wire) => this.connectWire(wire));
	}

	private connectWire({ index }: Wire) {
		const input = this.getInput(index) || new Input(this);
		const output = this.getOutput(index) || new Output(this);

		this.inputs[index] = input;
		this.outputs[index] = output;

		this.inputCount = this.inputs.length;
		this.outputCount = this.outputs.length;
	}
		
	/**
	 * Evaluate connections that much that would 
	 * be changed IRL in one moment.
	 * 
	 *
	 * Components are evaluated on tick starting
	 * from one of the outputs and continuing to
	 * Components' input dependencies until
	 * Package input level is reached. After one
	 * output is evaluated we continues to
	 * evaluate the next output until all outputs
	 * are evaluated.
	 */
	evaluate() {
		this.outputs.forEach((output, index) => {
			let outWire = this.outputWires.getOutput(index);
			output.value = outWire.value;
		});
		this.outputWires.evaluateRecursively();
		this.inputs.forEach((input, index) => {
			let inWire = this.inputWires.getInput(index);
			inWire.value = input.value;
		});
		super.evaluate();
	}
}