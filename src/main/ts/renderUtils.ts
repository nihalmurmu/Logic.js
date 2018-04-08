export interface IDrawable {
	render(): SVGElement;
}

export function isDrawable(object: any): object is IDrawable {
	return 'render' in object;
}

export function createSVGElement(name: string) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

export function parseSVG(source: string): Element {
	const domParser = new DOMParser();
	const document = domParser.parseFromString(
		source,
		'image/svg+xml',
	);
	return document.documentElement;
}