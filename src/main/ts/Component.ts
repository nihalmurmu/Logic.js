/**
 * Component is the base abstraction
 * of every part that takes some number
 * of inputs and gives some number of
 * outputs.
 */
export abstract class Component {
	abstract inputCount: number;
	abstract outputCount: number;

	protected abstract inputs: Input[];
	protected abstract outputs: Output[];

	stopsEvaluation = false;

	getInput(index: number) {
		return this.inputs[index];
	}

	getOutput(index: number) {
		return this.outputs[index];
	}

	setInputValues(values: boolean[]) {
		values.forEach((value, index) => {
			const input = this.getInput(index);
			if (input) input.value = value;
		});
	}

	getOutputValues() {
		const values: boolean[] = [];
		for (let i = 0; i < this.outputCount; i++) {
			const output = this.getOutput(i);
			if (output) values[i] = output.value;
		}
		return values;
	}

	/** 
	 * Evaluate inputs to outputs.
	 */
	evaluate() {
		for (let i = 0; i < this.inputCount; i++) {
			const input = this.getInput(i);
			if (
				!input ||
				!input.connections ||
				!input.connections[0]
			) continue;
			input.value = input.connections[0].value;
		}
	}

	/**
	 * Evaluate recursively by climing
	 * up the component tree towards input.
	 */
	evaluateRecursively(breadcrumbs: Component[] = []) {
		this.evaluate();

		if (this.stopsEvaluation) return;

		for (const input of this.inputs) {
			if (!input.connections) continue;
			for (const connected of input.connections) {
				if (breadcrumbs.indexOf(connected.component) > -1)
					continue;
				breadcrumbs.push(connected.component);
				connected.component.evaluateRecursively(breadcrumbs);
			}
		}
	}
}

export class IO {
	value = false;
	readonly component: Component;
	
	private _connections: IO[];

	get connections() {
		return this._connections;
	}

	constructor(component: Component) {
		this.component = component;
	}

	connect(target: IO) {
		if (!this._connections)
			this._connections = [];
		if (this._connections.indexOf(target) == -1)
			this._connections.push(target);
		if (
			!target.connections ||
			target.connections.indexOf(this) == -1
		) target.connect(this);
	}
}

export class Input extends IO {
	connections: [ Output ];

	connect(target: Output) {
		if (this.connections)
			throw new Error('Input is already connected');
		super.connect(target);
	}
}
export class Output extends IO {
	connections: Input[];

	connect(target: Input) {
		super.connect(target);
	}
};