"use strict";

import { IPayloadGlobalAlignment, TComputeGlobalAlignment } from "../@types";

const process = (
	rowString: string,
	columnString: string,
	pointers: Int8Array,
	lengths: Int8Array,
	M: number,
	Ms: number,
	G: number,
	Ge: number
) => {
	pointers[0] = 0;
	const m = rowString.length + 1;
	const n = columnString.length + 1;

	// Initializes the boundaries of the traceBack matrix.
	// mat[x][y][1] =  0 - STOP
	// mat[x][y][1] = 1 - DIAGONAL
	// mat[x][y][1] = 2 - UP
	// mat[x][y][1] = 3 - LEFT
	for (let i = 1, k = n; i < m; i++, k += n) {
		//for (let k = n; k < arr_size; i++, k += n) {
		pointers[k] = 3;
		lengths[k] = i;
	}
	for (let j = 1; j < n; j++) {
		pointers[j] = 1;
		lengths[j] = j;
	}

	const v = Array(n).fill(0);
	let vDiagonal = 0; // Float.NEGATIVE_INFINITY; // best score in cell
	let f = Number.NEGATIVE_INFINITY; // score from diagonal
	let h = Number.NEGATIVE_INFINITY; // best score ending with gap from
	// left
	const g = Array(n).fill(Number.NEGATIVE_INFINITY); // best score ending with gap from above

	let lengthOfHorizontalGap = 0;
	const lengthOfVerticalGap: any[] = [];

	let similarityScore;
	let maximumScore = Number.NEGATIVE_INFINITY;
	let maxi = 0;
	let maxj = 0;
	let k = 0;
	let l = 0;
	// Fill the matrices
	for (let i = 1; i < m; i++) {
		// for all rows
		v[0] = -G - (i - 1) * Ge;
		k = i * n;
		for (let j = 1; j < n; j++) {
			// for all columns
			l = k + j;
			similarityScore = rowString[i - 1] === columnString[j - 1] ? M : Ms;

			f = vDiagonal + similarityScore; // from diagonal

			// Which cell from the left?
			if (h - Ge >= v[j - 1] - G) {
				h -= Ge;
				lengthOfHorizontalGap++;
			} else {
				h = v[j - 1] - G;
				lengthOfHorizontalGap = 1;
			}

			// Which cell from above?
			if (g[j] - Ge >= v[j] - G) {
				g[j] = g[j] - Ge;
				lengthOfVerticalGap[j] = lengthOfVerticalGap[j] + 1;
			} else {
				g[j] = v[j] - G;
				lengthOfVerticalGap[j] = 1;
			}

			vDiagonal = v[j];
			v[j] = Math.max(f, g[j], h); // best one
			if (v[j] > maximumScore) {
				maximumScore = v[j];
				maxi = i;
				maxj = j;
			}

			// Determine the traceBack direction
			// mat[x][y][1] =  0 - STOP
			// mat[x][y][1] = 1 - DIAGONAL
			// mat[x][y][1] = 2 - UP
			// mat[x][y][1] = 3 - LEFT
			if (v[j] == f) {
				pointers[l] = 2;
			} else if (v[j] == g[j]) {
				pointers[l] = 3;
				lengths[l] = lengthOfVerticalGap[j];
			} else if (v[j] == h) {
				pointers[l] = 1;
				lengths[l] = lengthOfHorizontalGap;
			}
		} // loop columns

		// Reset
		h = Number.NEGATIVE_INFINITY;
		vDiagonal = 0; // -o - (i - 1) * e;

		lengthOfHorizontalGap = 0;
	} // loop rows

	return { maxi, maxj, score: v[n - 1] };
};

const traceBack = (s1: string, s2: string, rowa: number, cola: number, pointers: Int8Array, lengths: Int8Array) => {
	let als1 = s1;
	let als2 = s2;

	// maximum length after the aligned sequences
	const maxLength = s1.length + s2.length;

	const reversed1 = new Array(maxLength); // reversed sequence #1
	const reversed2 = new Array(maxLength); // reversed sequence #2

	let len1 = 0; // length of sequence #1 after alignment
	let len2 = 0; // length of sequence #2 after alignment

	let c1, c2;

	let i = rowa; // traceBack start row
	let j = cola; // traceBack start col
	const n = s2.length + 1;
	let row = i * n;

	let a = s1.length - 1;
	let b = s2.length - 1;

	if (a - i > b - j) {
		for (; a - i > b - j; a--) {
			reversed1[len1++] = s1[a];
			reversed2[len2++] = "-";
		}
		for (; b > j - 1; a--, b--) {
			c1 = s1[a];
			c2 = s2[b];

			reversed1[len1++] = c1;
			reversed2[len2++] = c2;
		}
	} else {
		for (; b - j > a - i; b--) {
			reversed1[len1++] = "-";
			reversed2[len2++] = als2[b];
		}
		for (; a > i - 1; a--, b--) {
			c1 = als1[a];
			c2 = als2[b];

			reversed1[len1++] = c1;
			reversed2[len2++] = c2;
		}
	}

	// traceBack flag, where true => continue and false => stop
	let stillGoing = true;
	while (stillGoing) {
		const l = row + j;
		//console.log(row + ' - ' + pointers[l] + ' - ' + lengths[l]);
		switch (pointers[l]) {
			case 3:
				for (let k = 0; k < lengths[l]; k++) {
					reversed1[len1++] = als1[--i];
					reversed2[len2++] = "-";
					row -= n;
				}
				if (lengths[l] <= 0) {
					row -= n;
				}

				break;
			case 2:
				c1 = als1[--i];
				c2 = als2[--j];
				reversed1[len1++] = c1;
				reversed2[len2++] = c2;
				row -= n;
				break;
			case 1:
				for (let k = 0; k < lengths[l]; k++) {
					reversed1[len1++] = "-";
					reversed2[len2++] = als2[--j];
				}
				break;
			case 0:
				stillGoing = false;
		}
	}

	als1 = reverse_text(reversed1);
	als2 = reverse_text(reversed2);
	const to = getTo(als1, als2);
	const from = getFrom(als2);

	return {
		als1,
		als2,
		to,
		from,
	};
};

const getFrom = (als2: string): number => {
	let position = 0;
	while (position < als2.length) {
		if (als2[position] == "-") position++;
		else break;
	}
	return position;
};

const getTo = (als1: string, als2: string): number => {
	let position = als1.length - 1;
	while (als2[position] === "-" && position > 0) {
		position--;
	}
	return position;
};

const reverse_text = (text: string | string[]): string => {
	if (Array.isArray(text)) return text.reverse().join("");
	return text.split("").reverse().join("");
};

export const computeGlobalAlignment: TComputeGlobalAlignment = (
	referenceSequence: string | string[],
	sequenceToAlign: string | string[],
	idSequence?: number
): IPayloadGlobalAlignment => {
	if (referenceSequence.length === 0) throw new Error("Empty reference sequence");
	if (sequenceToAlign.length === 0) throw new Error("Empty query sequence");

	referenceSequence = Array.isArray(referenceSequence) ? referenceSequence.join("") : referenceSequence;
	sequenceToAlign = Array.isArray(sequenceToAlign) ? sequenceToAlign.join("") : sequenceToAlign;

	const Match = 2; //match
	const MissMatch = -3; //missMatch
	const Gap = 5; // gap
	const Ge = 2; // ?
	let temp;
	//swap
	if (referenceSequence.length < sequenceToAlign.length) {
		temp = sequenceToAlign;
		sequenceToAlign = referenceSequence;
		referenceSequence = temp;
	}
	temp = undefined;

	const seq_ref_length = referenceSequence.length + 1;
	const seq_align_length = sequenceToAlign.length + 1;
	const size_array = seq_ref_length * seq_align_length;
	const pointers = new Int8Array(size_array); //int8 array
	const lengths = new Int8Array(size_array); // int8 array

	const processing_result = process(referenceSequence, sequenceToAlign, pointers, lengths, Match, MissMatch, Gap, Ge);

	const { maxi, maxj } = processing_result;

	const traceBack_result = traceBack(referenceSequence, sequenceToAlign, maxi, maxj, pointers, lengths);

	const coverage: number = ((traceBack_result.to - traceBack_result.from) * 100) / referenceSequence.length;

	return {
		idSequence,
		map_init: traceBack_result.from,
		map_end: traceBack_result.to,
		coverage_pct: Number(coverage.toFixed(2)),
	};
};

export default computeGlobalAlignment;
