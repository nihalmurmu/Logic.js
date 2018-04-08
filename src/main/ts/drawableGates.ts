import { Component, Input, Output } from './Component';
import { Gate } from './gates';
import * as gates from './gates';
import { IDrawable, createSVGElement, parseSVG } from './renderUtils';
import { applyMixins } from './mixin';
import { Promise } from 'bluebird';
 
let symbols: { [gate: string]: SVGElement } = {};

/**
 * Load and parse gate symbols
 */
export function loadSymbols() {
	const gateNames = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];
	const promises: Promise<void>[] = [];
	for (const gate of gateNames) {
		const promise = fetch(require(`../svg/${gate}.svg`)).then((res: Response) => {
			return res.text();
		}).then((source: string) => {
			const symbol = parseSVG(source);
			if (symbol instanceof SVGElement)
				symbols[gate] = symbol;
		})
		promises.push(promise);
	}
	return Promise.all(promises);
}

/** 
 * Mixin for drawing gates.
 */
export abstract class GateDrawing implements IDrawable {
	abstract symbolName: string;

	abstract inputs: Input[];
	abstract outputs: Output[];

	render() {
		let symbol = symbols[this.symbolName];
		if (!symbol) return createSVGElement('svg');
		symbol = <SVGElement> symbol.cloneNode(true);
		
		const drawValue = (
			alignRight: boolean,
			{ value }: Input | Output,
			index: number,
			set: boolean[],
		) => {
			const unit = 1 / set.length;
			const y = (unit * (index + 1) - unit / 2)  * 100;
			symbol.appendChild(
				parseSVG(`
					<svg xmlns="http://www.w3.org/2000/svg">
						<text
							fill="red"
							x="${alignRight ? '100%' : '0'}"
							y="${y}%"
							text-anchor="${alignRight ? 'end' : 'start'}"
							alignment-baseline="middle">
							${value ? 1 : 0}
						</text>
					</svg>`,
				),
			);
		};
		this.inputs.forEach(drawValue.bind(null, false));
		this.outputs.forEach(drawValue.bind(null, true));

		return symbol;
	}
}

export class AND extends gates.AND implements GateDrawing {
	symbolName = 'AND';
	render: () => SVGElement;
}
applyMixins(AND, [ GateDrawing ]);

export class OR extends gates.OR implements GateDrawing {
	symbolName = 'OR';
	render: () => SVGElement;
}
applyMixins(OR, [ GateDrawing ]);

export class NOT extends gates.NOT implements GateDrawing {
	symbolName = 'NOT';
	render: () => SVGElement;
}
applyMixins(NOT, [ GateDrawing ]);

export class NAND extends gates.NAND implements GateDrawing {
	symbolName = 'NAND';
	render: () => SVGElement;
}
applyMixins(NAND, [ GateDrawing ]);

export class NOR extends gates.NOR implements GateDrawing {
	symbolName = 'NOR';
	render: () => SVGElement;
}
applyMixins(NOR, [ GateDrawing ]);

export class XOR extends gates.XOR implements GateDrawing {
	symbolName = 'XOR';
	render: () => SVGElement;
}
applyMixins(XOR, [ GateDrawing ]);

export class XNOR extends gates.XNOR implements GateDrawing {
	symbolName = 'XNOR';
	render: () => SVGElement;
}
applyMixins(XNOR, [ GateDrawing ]);