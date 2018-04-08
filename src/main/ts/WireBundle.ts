import { Component } from './Component';

/**
 * Component that maps input to output
 * with 1-1 relationship.
 */
export class WireBundle extends Component {
	static readonly maxInputCount = Infinity;
	static readonly maxOutputCount = Infinity;

	input: boolean[] = [];
	get output() {
		return this.input;
	}
}