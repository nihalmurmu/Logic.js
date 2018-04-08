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
		inputCount = component.inputCount;
	}
	const testValues = booleanCombinations(inputCount);
	for (const test of testValues) {
		test.forEach((value, index) => {
			const input = component.getInput(index);
			if (input) input.value = value;
		});

		let result: { [columnName: string]: boolean } = {};
		for (let i = 0; i < component.inputCount; i++) {
			const input = component.getInput(i);
			if (input)
				result[`Input ${i}`] = input.value;
		}
		component.getOutputValues().forEach((value, index) => {
			result[`Output ${index}`] = value;
		});
		resultTable.push(result);
	}

	console.groupCollapsed(component.constructor.prototype.constructor.name);
	console.table(resultTable);
	console.groupEnd();
}