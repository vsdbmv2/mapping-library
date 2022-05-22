export interface IEpitopeMap {
	linearSequence: string;
	init_pos: number;
}

export interface IPayloadGeneric {
	map_init: number;
	map_end: number;
	coverage_pct: number;
	alignment_score: number;
	epitope_maps: IEpitopeMap[];
	idSequence?: number;
}

export type IPayloadGlobalAlignment = Omit<IPayloadGeneric, "alignment_score" | "epitope_maps">;
export type IPayloadLocalAlignment = Pick<IPayloadGeneric, "alignment_score">;
export type IPayloadEpitopeMap = Pick<IPayloadGeneric, "epitope_maps">;

export type TcomputeGlobalAlignment = (
	referenceSequence: string | string[],
	sequenceToAlign: string | string[],
	idSequence?: number
) => IPayloadGlobalAlignment;
