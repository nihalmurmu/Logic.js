
export abstract class Component {
	static readonly inputCount: number = 0;
	static readonly outputCount: number = 0;
	readonly inputCount: number = 0;
	readonly outputCount: number = 0;
	
	abstract input: boolean[];
	abstract readonly output: boolean[];
}