import { DrawablePackage } from '../../main/ts/DrawablePackage';
import { NOR, loadSymbols } from '../../main/ts/drawableGates';
import { printLogicTable } from './logicTable';

const latch = new DrawablePackage();

const resetGate = new NOR();

const resetIn = latch.inputWires.getOutput(0);
const resetOut = resetGate.getInput(0);
resetIn.connect(resetOut);

const highIn = resetGate.getOutput(0);
const highOut = latch.outputWires.getInput(0);
highIn.connect(highOut);
console.log(highOut.connections);

let setGate = new NOR();

const setIn = latch.inputWires.getOutput(1);
const setOut = setGate.getInput(1);
setIn.connect(setOut);

const lowIn = setGate.getOutput(0);
const lowOut = latch.outputWires.getInput(1);
lowIn.connect(lowOut);

const setLoopBack = setGate.getInput(0);
highIn.connect(setLoopBack);

const resetLoopBack = resetGate.getInput(1);
lowIn.connect(resetLoopBack);

function printIOValues() {
	/* console.group('');
	console.log(resetGate.input, resetGate.output);
	console.log(setGate.input, setGate.output);
	console.groupEnd(); */
}

latch.setInputValues([ false, true ]);
latch.evaluate();
latch.setInputValues([ false, false ]);

loadSymbols().then(() => {
	let frame: SVGElement;
	setInterval(() => {
		if (frame) frame.remove();
		frame = latch.render();
		document.body.appendChild(frame);
		latch.evaluate();
		console.log(latch.getOutputValues());
	}, 1000);
});