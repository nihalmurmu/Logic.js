/**
 * Component is the base abstraction
 * of every part that takes some number
 * of inputs and gives some number of
 * outputs.
 */
export abstract class Component {
	static readonly maxInputCount: number = 0;
	static readonly maxOutputCount: number = 0;
	
	abstract input: boolean[];
	abstract readonly output: boolean[];
}