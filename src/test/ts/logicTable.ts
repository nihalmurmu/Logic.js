import { Component } from '../../main/ts/Component';

function booleanCombinations(length: number): boolean[][] {
	if (length < 0) {
		throw new Error('Negative combination length not possible');
	} else if (length == 0) {
		return [];
	} else if (length == 1) {
		return [ [ true ], [ false ] ];
	} else {
		length--;
		return booleanCombinations(length)
			.map((c) => c.concat([ true ]))
			.concat(
				booleanCombinations(length)
				.map((c) => c.concat([ false ]))
			);
	}
}

function testGate(component: Component) {
	let resultTable: boolean[][] = [];

	let tests = booleanCombinations(component.inputCount);
	for (const test of tests) {
		component.input = test;
		resultTable.push(component.input.concat(component.output));
	}

	console.groupCollapsed(component.constructor.prototype.constructor.name);
	console.table(resultTable);
	console.groupEnd();
}