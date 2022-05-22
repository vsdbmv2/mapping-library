import { IPayloadLocalAlignment } from "../@types";

// Calculate the alignment
const computeSmWat = (
	s1: string[],
	s2: string[],
	Ge: number,
	Go: number,
	Mt: number,
	Mst: number,
	currentLine: number[],
	lastLine: number[]
): number => {
	let bestScore = 0;
	let similarity; // similarity between the chars(match or miss match)
	let lastDiag; // last score on diagonal
	let firstPartialScoreUp; // partial up score 1
	let secondPartialScoreUp; // partial up score 2
	let firstPartialScoreLeft; // partial left score 1
	let secondPartialScoreLeft; // partial left score 2
	let leftScore; // left score
	for (let i = 1; i <= s1.length; i++) {
		leftScore = Number.NEGATIVE_INFINITY;
		lastDiag = 0;
		for (let j = 1; j <= s2.length; j++) {
			similarity = lastDiag + (s1[i - 1] === s2[j - 1] ? Mt : Mst);
			//partial up score
			firstPartialScoreUp = lastLine[j] + Ge;
			secondPartialScoreUp = currentLine[j] + Go;
			if (firstPartialScoreUp > secondPartialScoreUp) {
				lastLine[j] = firstPartialScoreUp;
			} else {
				lastLine[j] = secondPartialScoreUp;
			}
			//partial left score
			firstPartialScoreLeft = leftScore + Ge;
			secondPartialScoreLeft = currentLine[j - 1] + Go;
			if (firstPartialScoreLeft > secondPartialScoreLeft) {
				leftScore = firstPartialScoreLeft;
			} else {
				leftScore = secondPartialScoreLeft;
			}
			lastDiag = currentLine[j]; // preparing diagonal for next line...
			//Maximum of   similarity, lastLine[j], left score, 0
			currentLine[j] = Math.max(similarity, lastLine[j], leftScore, 0);
			if (bestScore <= currentLine[j]) {
				bestScore = currentLine[j];
			}
		}
	}
	//Set the final Score
	return bestScore;
};

export const computeLocalAlignment = (referenceSequence: string, querySequence: string): IPayloadLocalAlignment => {
	if (referenceSequence.length === 0 || !referenceSequence) throw new Error("Empty reference sequence");
	if (querySequence.length === 0 || !querySequence) throw new Error("Empty query sequence");

	const reference: string | string[] = referenceSequence.toUpperCase().split(""); //Reference Sequence?
	const query: string | string[] = querySequence.toUpperCase().split(""); //Query Sequence
	//initialize the parameters
	const Ge = -1;
	const Go = -10;
	const Mt = 5;
	const Mst = -4;

	// initialize matrix
	//matrix = new int[s1.length() + 1][s2.length() + 1];
	//Fill the first line and lastLine columns with 0
	const lastLine = new Array(query.length).fill(0);
	const currentLine = new Array(query.length).fill(0);

	//Compute the optimal alignment
	let score = computeSmWat(reference, query, Ge, Go, Mt, Mst, currentLine, lastLine);
	return { alignment_score: score };
};

export default computeLocalAlignment;
