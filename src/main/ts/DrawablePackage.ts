import { Component } from './Component';
import { Package } from './Package';
import { IDrawable, isDrawable, createSVGElement } from './renderUtils';

export class DrawablePackage extends Package implements IDrawable {
	private walkConnections(
		component: Component,
		callback: ({ source: Output, destination: Input }) => void,
		breadcrumbs: Component[] = [],
	) {
		for (let i = 0; i < component.inputCount; i++) {
			const destination = component.getInput(i);
			if (!destination || !destination.connections) continue;
			
			for (const source of destination.connections) {
				if (breadcrumbs.indexOf(source.component) > -1)
					continue;
				breadcrumbs.push(source.component);
				callback({ source, destination });
				this.walkConnections(source.component, callback, breadcrumbs);
			}
		}
	}

	render() {
		const root = createSVGElement('svg');
		const hiddenRoot = createSVGElement('svg')
		hiddenRoot.style.position = 'absolute';
		hiddenRoot.style.visibility = 'hidden';
		hiddenRoot.style.pointerEvents = 'none';
		document.body.appendChild(hiddenRoot);

		let y = 0;
		let x = 0;
		let levelHeight = 0;
		let componentsInLevel: Component[] = [];
		this.walkConnections(this.outputWires, ({
			source,
			destination,
		}) => {
			if (!isDrawable(source.component)) return;
			if (componentsInLevel.indexOf(destination.component) > -1) {
				y += levelHeight;
				x = 0;
				levelHeight = 0;
				componentsInLevel = [];
			}
			componentsInLevel.push(source.component);

			const element = source.component.render();
			element.setAttribute('y', y.toString());
			element.setAttribute('x', x.toString());
			
			hiddenRoot.appendChild(element);
			const rect = element.getBoundingClientRect();
			levelHeight = Math.max(levelHeight, rect.height);
			x += rect.width;

			root.appendChild(element);
		});
		
		hiddenRoot.remove();
		return root;
	}
}