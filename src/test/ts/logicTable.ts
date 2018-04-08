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

export function printLogicTable(component: Component, inputCount?: number) {
	let resultTable: { [columnName: string]: boolean }[] = []

	if (!inputCount) {
		const constructor = <typeof Component> component.constructor;
		inputCount = constructor.maxInputCount;
	}
	const tests = booleanCombinations(inputCount);
	for (const test of tests) {
		component.input = test;

		let result: { [columnName: string]: boolean } = {};
		component.input.forEach((value, index) => {
			result[`Input ${index}`] = value;
		});
		component.output.forEach((value, index) => {
			result[`Output ${index}`] = value;
		});
		resultTable.push(result);
	}

	console.groupCollapsed(component.constructor.prototype.constructor.name);
	console.table(resultTable);
	console.groupEnd();
}