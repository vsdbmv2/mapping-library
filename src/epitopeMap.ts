import { IPayloadEpitopeMap, IEpitopeMap } from "../@types";

export const epitopeMap = (sequence: string, epitopes: string[]): IPayloadEpitopeMap => {
	if (sequence.length === 0 || !sequence) throw new Error("Empty sequence");
	if (epitopes.length === 0 || !epitopes) throw new Error("Epitopes not provided");
	if (!Array.isArray(epitopes)) throw new Error("Epitopes should be provided as an array");
	const epitope_maps = epitopes
		.map((epitope) => {
			const regexp = new RegExp(epitope, "gi");
			const iterator = sequence.matchAll(regexp);
			const matches: IEpitopeMap[] = [];
			for (const match of iterator) {
				const [linearSequence] = match;
				matches.push({
					linearSequence,
					init_pos: Number(match.index),
				});
			}
			return matches;
		})
		.flat();
	return { epitope_maps };
};

export default epitopeMap;
