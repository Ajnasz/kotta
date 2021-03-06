(function () {
	const KOTTA_CONTAINER_ID = 'KottaImg';
	const CIRCLE_SIZE = 6;
	const LINE_GAP = 15;
	const BASE_LINE_MIN = 0;
	const BASE_LINE_MAX = 8;
	const FONT_SIZE = 16;
	const NOTE_LINE_SIZE = LINE_GAP * 3;
	const LINE_INDENT = 10;
	const FIRST_NOTE_INDENT = 20;


	const CIRCLE_LINE_SWAP = 3;

	let SHOW_TEXT = false;
	let ctx;

	function text(text, { top, left, fontSize, fill }) {
		const fillStyle = ctx.fillStyle;
		ctx.font = `${fontSize}px serif`;
		ctx.fillStyle = fill;
		ctx.fillText(text, left, top);
		ctx.fillStyle = fillStyle;
	}

	function circle({ radius, top, left }) {
		ctx.beginPath();
		ctx.arc(left + radius, top + radius, radius, 0, 360);
		ctx.fill();
	}

	function line([x1, y1, x2, y2], { stroke }) {
		const strokeStyle = ctx.strokeStyle;
		const lineWidth = ctx.lineWidth;
		ctx.strokeStyle = stroke;
		ctx.lineWidth = 1;

		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		ctx.strokeStyle = strokeStyle;
		ctx.lineWidth = lineWidth;

		return [x1, y1, x2, y2];
	}

	// const allNotes = [
	// 	// -4, -3.5, -3, -2.5, -2,
	// 	[-1.5, 'A'], [-1, 'G'], [-0.5, 'F'],
	// 	[0, 'E'], [0.5, 'D'], [1, 'C'], [1.5, 'H'], [2, 'A'], [2.5, 'G'], [3, 'F'], [3.5, 'E'],
	// 	[4, 'D'], [4.5, 'C'], [5, 'H'], [5.5, 'A'], [6, 'G'], [6.5, 'F'], [7, 'E'],
	// ];

	const notesByName = {
		F0: [15, 'F0'],
		E0: [14, 'E0'],
		D0: [13, 'D0'],
		C0: [12, 'C0'],
		H0: [11, 'H0'],
		A0: [10, 'A0'],
		G1: [9, 'G1'],
		F1: [8, 'F1'],
		E1: [7, 'E1'],
		D1: [6, 'D1'],
		C1: [5, 'C1'],
		H1: [4, 'H1'],
		A1: [3, 'A1'],
		G2: [2, 'G2'],
		F2: [1, 'F2'],
		E2: [0, 'E2'],
		D2: [-1, 'D2'],
		C2: [-2, 'C2'],
		H2: [-3, 'H2'],
		A2: [-4, 'A2'],
		G3: [-5, 'G3'],
		F3: [-6, 'F3'],
		E3: [-7, 'E3'],
	};

	const selectedNotes = [
		// notesByName.F0,
		// notesByName.E0,
		// notesByName.D0,
		// notesByName.C0,
		// notesByName.H0,
		notesByName.A0,
		// notesByName.G1,
		notesByName.F1,
		notesByName.E1,
		notesByName.D1,
		// notesByName.C1,
		notesByName.H1,
		notesByName.E2,
		notesByName.A1,
		notesByName.G2,
		notesByName.F2,
		notesByName.C2,
		notesByName.H2,
		notesByName.A2,
		notesByName.G3,
		notesByName.F3,
		notesByName.E3,
	];

	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
	}

	function isBaseNote(pos) {
		return pos > BASE_LINE_MIN && pos < BASE_LINE_MAX;
	}

	function isHigh(pos) {
		return pos > BASE_LINE_MAX;
	}

	function isLow(pos) {
		return pos < BASE_LINE_MIN;
	}

	const MAGIC_FOUR_Y = 4;
	const MAGIC_FOUR_X = 4;

	const BASE_LINE = (LINE_GAP / 2 * (LINE_GAP + MAGIC_FOUR_Y) + (CIRCLE_SIZE) / 2 - 1) - 30;

	function createNote([pos, name], index) {
		const top = BASE_LINE - pos * LINE_GAP / 2 - 1;
		const left = FIRST_NOTE_INDENT + index * CIRCLE_SIZE * MAGIC_FOUR_X;
		const output = [];

		output.push(circle({
			radius: CIRCLE_SIZE,
			fill: 'black',
			top,
			left,
			selectable: false,
		}));

		if (SHOW_TEXT) {
			output.push(text(name.replace(/[0-9]/, ''), {
				fill: '#666',
				top: top + FONT_SIZE + CIRCLE_SIZE * 2,
				left,
				fontSize: FONT_SIZE,
				selectable: false,
			}));
		}

		if (pos <= CIRCLE_LINE_SWAP) {
			const x1 = left + CIRCLE_SIZE * 2;
			const x2 = x1;
			const y1 = top + CIRCLE_SIZE - LINE_GAP * 3;
			const y2 = y1 + NOTE_LINE_SIZE;
			output.push(line([x1, y1, x2, y2], {
				stroke: 'black',
			}));
		} else {
			const x1 = left;
			const y1 = top + CIRCLE_SIZE + NOTE_LINE_SIZE;
			const x2 = x1;
			const y2 = y1 - NOTE_LINE_SIZE;
			output.push(line([x1, y1, x2, y2], {
				stroke: 'black',
			}));
		}

		if (isBaseNote(pos)) {
			return output;
		}

		let lines = [];

		let linePos = notesByName.F0[0];
		while (notesByName.F0[0] >= linePos && notesByName.E3[0] <= linePos) {
			linePos -= 1;
			if (isBaseNote(linePos)) {
				continue;
			}
			if (linePos % 2 !== 0) {
				continue;
			}

			if ((isHigh(linePos) && pos >= linePos) || (isLow(linePos) && pos <= linePos)) {

				const x1 = left - CIRCLE_SIZE / 2;
				const x2 = x1 + CIRCLE_SIZE * 3;
				// let y = isHigh(linePos) ?
				// 	Math.floor(top) + (linePos - BASE_LINE_MAX) * LINE_GAP / 2 - 1:
				// 	top;
				const y = BASE_LINE - linePos * LINE_GAP / 2 - 1 + CIRCLE_SIZE;

				line([x1, y, x2, y], {
					stroke: 'black',
				});
			}
		}

		return output.concat(lines);
	}

	function generate() {
		const contentWidth = parseInt(window.getComputedStyle(document.querySelector('main')).width, 10);

		const canvas = document.getElementById(KOTTA_CONTAINER_ID);

		canvas.width = contentWidth;
		canvas.height = 205;

		ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const selectedNotes = Array.from(document.querySelectorAll('.selected-note:checked')).map(i => notesByName[i.value]);

		if (!selectedNotes.length) {
			return;
		}


		let linePos = notesByName.F0[0];
		while (notesByName.F0[0] >= linePos && notesByName.E3[0] <= linePos) {
			linePos -= 1;
			if (linePos % 2 !== 0) {
				continue;
			}

			if (!isHigh(linePos) && !isLow(linePos)) {
				const x1 = LINE_INDENT;
				const x2 = contentWidth - LINE_INDENT * 2 + LINE_INDENT;
				const y = BASE_LINE - linePos * LINE_GAP / 2 - 1 + CIRCLE_SIZE;

				line([x1, y, x2, y], {
					stroke: 'black',
				});
			}
		}

		const numberOfNotes = Math.round((contentWidth - LINE_INDENT * 2 - FIRST_NOTE_INDENT) / (CIRCLE_SIZE * MAGIC_FOUR_X));
		Array.from(new Array(numberOfNotes))
			.map(() => selectedNotes[getRandomIntInclusive(0, selectedNotes.length - 1)])
			.map(createNote);
	}

	function generateEnabledNotes() {
		const settings = document.querySelector('#Settings');
		const notesContainer = document.createElement('fieldset');
		notesContainer.classList.add('notes-container');

		const othersContainer = document.createElement('fieldset');
		othersContainer.classList.add('others-container');

		Object.keys(notesByName).forEach(name => {
			const note = notesByName[name];
			const label = document.createElement('label');
			const input = document.createElement('input');
			input.type = 'checkbox';
			input.checked = selectedNotes.includes(note);
			input.classList.add('selected-note');
			input.value = name;
			input.name = `note-${note}`;
			input.id = `note-${note}`;
			label.setAttribute('for', input.id);
			input.addEventListener('change', generate);
			label.appendChild(document.createTextNode(note[1]));
			label.classList.add('note-label');

			notesContainer.appendChild(input);
			notesContainer.appendChild(label);
		});

		(() => {
			const label = document.createElement('label');
			const input = document.createElement('input');

			input.type = 'checkbox';
			input.checked = SHOW_TEXT;
			input.classList.add('settings');
			input.value = 1;
			input.name = 'show-note-name';
			input.id = 'show-note-name';
			label.setAttribute('for', input.id);
			input.addEventListener('change', (e) => {
				SHOW_TEXT = e.target.checked;

				generate();
			});
			label.appendChild(document.createTextNode('Show note name'));
			label.classList.add('note-label');

			othersContainer.appendChild(input);
			othersContainer.appendChild(label);
		})();

		settings.appendChild(notesContainer);
		settings.appendChild(othersContainer);
	}

	function main() {
		document.querySelector('main').appendChild((() => {
			const canvas = document.createElement('canvas');
			canvas.id = KOTTA_CONTAINER_ID;
			return canvas;
		})());
		generateEnabledNotes();
		generate();
		document.querySelector('#Refresh').addEventListener('click', generate);
	}

	window.addEventListener('DOMContentLoaded', main);

}());
