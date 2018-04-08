import { Component } from './Component';
import { WireBundle } from './WireBundle';

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
	static readonly maxInputCount = Infinity;
	static readonly maxOutputCount = Infinity;

	inputWires = new WireBundle();
	outputWires = new WireBundle();

	/**
	 * Components that are in this package.
	 * Type and index are used for
	 * indentification of the component.
	 */
	components: { [type: string]: Component[] } = {
		WireBundle: [this.inputWires, this.outputWires],	
	};

	/**
	 * Connection between output Component,
	 * identified by type and index, and
	 * input Components.
	 */
	connections: { [componentType: string]: [ Component, number ][][][] } = {};

	get input() {
		return this.inputWires.input;
	}

	set input(input: boolean[]) {
		this.inputWires.input = input;
	}
	
	get output() {
		return this.outputWires.output;
	}

	addComponent(component: Component) {
		if (this.hasComponent(component)) {
			throw new Error('Duplicate component');
		}

		const { type, index } = this.getComponentId(component);
		if (!this.components[type])
			this.components[type] = [];
		this.components[type].push(component);
	}

	hasComponent(component: Component) {
		const { index } = this.getComponentId(component);
		return index > -1;
	}

	getComponentId(component: Component): ComponentId {
		const constructor = <typeof Component> component.constructor;
		const type = constructor['name'];
		const index = this.components[type]
			? this.components[type].indexOf(component)
			: -1;
		return { type, index };
	}

	createConnection(
		source: Component, sourceOutputIndex: number,
		destination: Component, destinationInputIndex: number,
	) {
		const srcConstructor = <typeof Component> source.constructor;
		const destConstructor = <typeof Component> destination.constructor;
		if (sourceOutputIndex >= srcConstructor.maxOutputCount) {
			throw new RangeError('Source output index out of range');
		}
		if (destinationInputIndex >= destConstructor.maxInputCount) {
			throw new RangeError('Destination input index out of range');
		}

		if (!this.hasComponent(source))
			this.addComponent(source);
		if (!this.hasComponent(destination))
			this.addComponent(destination);
		
		const { type, index } = this.getComponentId(destination);
		if (!this.connections[type])
			this.connections[type] = [];
		if (!this.connections[type][index])
			this.connections[type][index] = [];
		if (!this.connections[type][index][destinationInputIndex])
			this.connections[type][index][destinationInputIndex] = [];
		this.connections[type][index][destinationInputIndex].push([
			source, sourceOutputIndex,
		]);
	}

	/**
	 * Evaluate connections that much that would 
	 * be changed IRL in one moment.
	 * 
	 * Components are evaluated on tick starting
	 * from one of the outputs and continuing to
	 * Components' input dependencies until
	 * Package input level is reached. After one
	 * output is evaluated we continues to
	 * evaluate the next output until all outputs
	 * are evaluated.
	 */
	tick();
	/**
	 * Internal use function overload for recursion.
	 */
	tick(component: Component);
	tick(component: Component = this.outputWires) {
		const { type, index } = this.getComponentId(component);
		const inputs = this.connections[type][index];
		if (!inputs) return;
		for (const destInputIndex in inputs) {
			if (!inputs.hasOwnProperty(destInputIndex)) continue;
			const sources = inputs[destInputIndex];
			for (const [ source, srcOutputIndex ] of sources) {
				component.input[destInputIndex] =
					source.output[srcOutputIndex];
				this.tick(source);
			}
		}
	}
}