(function (fabric) {
	const KOTTA_CONTAINER_ID = 'KottaImg';
	const CIRCLE_SIZE = 6;
	const LINE_GAP = 15;
	const canvas = new fabric.Canvas(KOTTA_CONTAINER_ID);
	const BASE_LINE_MIN = -0.5;
	const BASE_LINE_MAX = 4;

	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
	}

	function isBaseHang(pos) {
		return pos > BASE_LINE_MIN && pos < BASE_LINE_MAX;
	}

	function createHang([pos, name], index) {
		const top = (pos + 6) * LINE_GAP + LINE_GAP / 2 - CIRCLE_SIZE;
		const left = 10 + index * CIRCLE_SIZE * 4;
		const output = [];

		output.push(new fabric.Circle({
			radius: CIRCLE_SIZE,
			fill: 'black',
			top,
			left,
		}));
		output.push(new fabric.Text(name, {
			top: top + 18,
			left,
			fontSize: 18
		}))

		if (pos > 1.5) {
			output.push(new fabric.Line([90, LINE_GAP * 3, 90, 0], {
				top: top + CIRCLE_SIZE - LINE_GAP * 3,
				left: left + CIRCLE_SIZE * 2,
				stroke: 'black',
			}))
		} else {
			output.push(new fabric.Line([90, LINE_GAP * 3, 90, 0], {
				top: top + CIRCLE_SIZE,
				left,
				stroke: 'black',
			}))
		}

		if (isBaseHang(pos)) {
			return output;
		}

		let lines = [];

		let linePos = -4;

		while (-4 <= linePos && 7 >= linePos) {
			linePos += 0.5;

			if ((linePos % 1) !== 0 ||
				(pos < 0 && (linePos <= pos || linePos > 3.5)) ||
				(pos > 3.5 && (linePos < 0 ||  linePos >= pos + 1))
			) {
				continue;
			}
			lines = lines.concat(new fabric.Line([0, 0, CIRCLE_SIZE * 3, 0], {
				left: left - CIRCLE_SIZE / 2,
				top: (linePos + 6) * LINE_GAP + LINE_GAP / 2 - CIRCLE_SIZE - (LINE_GAP / 2 - CIRCLE_SIZE),
				stroke: 'black',
			}));
		}

		return output.concat(lines);
	}

	const lines = Array.from(new Array(5)).map((_, index) => {
		return new fabric.Line([0, 0, 1500, 0], {
			left: 10,
			top: (index + 6) * LINE_GAP,
			stroke: 'black',
		});
	});

	canvas.add(...lines);

	const allHangok = [
		// -4, -3.5, -3, -2.5, -2,
		[-1.5, 'A'], [-1, 'G'], [-0.5, 'F'],
		[0, 'E'], [0.5, 'D'], [1, 'C'], [1.5, 'H'], [2, 'A'], [2.5, 'G'], [3, 'F'], [3.5, 'E'],
		[4, 'D'], [4.5, 'C'], [5, 'H'], [5.5, 'A'], [6, 'G'], [6.5, 'F'], [7, 'E'],
	];

	const hangokByName = {
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
	}

	const selectedHangok = [
		hangokByName.F1,
		hangokByName.D1,
		hangokByName.G2,
		hangokByName.A2,
		hangokByName.F2,
		hangokByName.A3,
		hangokByName.G3,
		hangokByName.F3,
		hangokByName.E3
	];

	const toDraw = Array.from(new Array(62)).map(() => selectedHangok[getRandomIntInclusive(0, selectedHangok.length - 1)]).map(createHang).reduce((o, h) => o.concat(h), []);
	canvas.add(...toDraw);
	canvas.renderAll();
}(window.fabric));
