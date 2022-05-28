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

export type TComputeGlobalAlignment = (
	referenceSequence: string | string[],
	sequenceToAlign: string | string[],
	idSequence?: number
) => IPayloadGlobalAlignment;

export type workType = "global-mapping" | "local-mapping" | "epitope-mapping";
export type workStatus = "TODO" | "ALOCATED" | "DONE";

export interface IWork {
	status: workStatus;
	type: workType;
	id1: number;
	id2?: number;
	sequence1: string;
	sequence2?: string;
	epitopes: string[];
	next: IWork | undefined;
	workerId: string | undefined;
	payload?: IPayloadGlobalAlignment | IPayloadLocalAlignment | IPayloadEpitopeMap;
	identifier: string;
	startTime: number;
	endTime: number;
	allocate: (worker_id: string) => IWork[] | void;
	deallocate: () => void;
	demand: () => void;
	done: () => void;
}
