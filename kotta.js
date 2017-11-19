(function () {
	const KOTTA_CONTAINER_ID = 'KottaImg';
	const CIRCLE_SIZE = 6;
	const LINE_GAP = 15;
	const BASE_LINE_MIN = -0.5;
	const BASE_LINE_MAX = 4.5;
	const FONT_SIZE = 16;
	const NOTE_LINE_SIZE = LINE_GAP * 3;
	const LINE_INDENT = 10;
	const FIRST_NOTE_INDENT = 20;
	var ctx;

	function text(text, { top, left, fontSize, fill }) {
		ctx.font = `${fontSize}px serif`;
		const fillStyle = ctx.fillStyle;
		ctx.fillStyle = fill;
		ctx.fillText(text, left, top);
		ctx.fillStyle = fillStyle;
	}

	function circle({ radius, top, left }) {
		ctx.beginPath();
		ctx.arc(left + radius, top + radius, radius, 0, 360);
		ctx.fill();
	}

	function line([x1, y1, x2, y2]) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	// const allNotes = [
	// 	// -4, -3.5, -3, -2.5, -2,
	// 	[-1.5, 'A'], [-1, 'G'], [-0.5, 'F'],
	// 	[0, 'E'], [0.5, 'D'], [1, 'C'], [1.5, 'H'], [2, 'A'], [2.5, 'G'], [3, 'F'], [3.5, 'E'],
	// 	[4, 'D'], [4.5, 'C'], [5, 'H'], [5.5, 'A'], [6, 'G'], [6.5, 'F'], [7, 'E'],
	// ];

	const notesByName = {
		A1: [-1.5, 'A'],
		G1: [-1, 'G'],
		F1: [-0.5, 'F'],
		E1: [0, 'E'],
		D1: [0.5, 'D'],
		C1: [1, 'C'],
		H1: [1.5, 'H'],
		A2: [2, 'A'],
		G2: [2.5, 'G'],
		F2: [3, 'F'],
		E2: [3.5, 'E'],
		D2: [4, 'D'],
		C2: [4.5, 'C'],
		H2: [5, 'H'],
		A3: [5.5, 'A'],
		G3: [6, 'G'],
		F3: [6.5, 'F'],
		E3: [7, 'E'],
	};

	const selectedNotes = [
		notesByName.F1,
		notesByName.D1,
		notesByName.G2,
		notesByName.A2,
		notesByName.F2,
		notesByName.A3,
		notesByName.G3,
		notesByName.F3,
		notesByName.E3
	];

	const contentWidth = parseInt(window.getComputedStyle(document.querySelector('main')).width, 10);

	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
	}

	function isBaseNote(pos) {
		return pos > BASE_LINE_MIN && pos < BASE_LINE_MAX;
	}

	function isBelowBase(pos) {
		return pos > BASE_LINE_MAX;
	}

	function isAboveBase(pos) {
		return pos < BASE_LINE_MIN;
	}

	function createNote([pos, name], index) {
		const top = (pos + 6) * LINE_GAP + LINE_GAP / 2 - CIRCLE_SIZE;
		const left = FIRST_NOTE_INDENT + index * CIRCLE_SIZE * 4;
		const output = [];

		output.push(circle({
			radius: CIRCLE_SIZE,
			fill: 'black',
			top,
			left,
			selectable: false,
		}));
		output.push(text(name, {
			fill: '#666',
			top: top + FONT_SIZE + CIRCLE_SIZE + 6,
			left,
			fontSize: FONT_SIZE,
			selectable: false,
		}));

		if (pos > 1.5) {
			const x1 = left + CIRCLE_SIZE * 2;
			const x2 = x1;
			const y1 = top + CIRCLE_SIZE - LINE_GAP * 3;
			const y2 = y1 + NOTE_LINE_SIZE;
			output.push(line([x1, y1, x2, y2], {
				stroke: 'black',
				selectable: false,
			}));
		} else {
			const x1 = left;
			const y1 = top + CIRCLE_SIZE + NOTE_LINE_SIZE;
			const x2 = x1;
			const y2 = y1 - NOTE_LINE_SIZE;
			output.push(line([x1, y1, x2, y2], {
				stroke: 'black',
				selectable: false,
			}));
		}

		if (isBaseNote(pos)) {
			return output;
		}

		let lines = [];

		let linePos = -4;

		while (-4 <= linePos && 7 >= linePos) {
			linePos += 0.5;

			if ((linePos % 1) !== 0 ||
				isBaseNote(linePos) ||
				(pos < 0 && (linePos <= pos || linePos > 3.5)) ||
				(pos > 3.5 && (linePos < 0 ||  linePos >= pos + 1))
			) {
				continue;
			}

			const x1 = left - CIRCLE_SIZE / 2;
			const x2 = x1 + CIRCLE_SIZE * 3;
			const y1 = (linePos + 6) * LINE_GAP + LINE_GAP / 2 - CIRCLE_SIZE - (LINE_GAP / 2 - CIRCLE_SIZE);
			const y2 = y1;

			lines = lines.concat(line([x1, y1, x2, y2], {
				stroke: 'black',
				selectable: false,
			}));
		}

		return output.concat(lines);
	}

	window.addEventListener('DOMContentLoaded', () => {
		document.querySelector('main').appendChild((() => {
			const canvas = document.createElement('canvas');
			canvas.id = KOTTA_CONTAINER_ID;
			canvas.width = contentWidth;
			canvas.height = 240;
			return canvas;
		})());


		ctx = document.getElementById(KOTTA_CONTAINER_ID).getContext('2d');

		Array.from(new Array(5)).map((_, index) => {
			const x1 = LINE_INDENT;
			const x2 = contentWidth - LINE_INDENT * 2 + LINE_INDENT;
			const y = (index + 6) * LINE_GAP;

			return line([x1, y, x2, y], {
				stroke: 'black',
				selectable: false,
			});
		});

		const numberOfNotes = Math.round((contentWidth - LINE_INDENT * 2 - FIRST_NOTE_INDENT) / (CIRCLE_SIZE * 4));
		Array.from(new Array(numberOfNotes))
			.map(() => selectedNotes[getRandomIntInclusive(0, selectedNotes.length - 1)])
			.map(createNote);
	});
}());
