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
	idSubtype?: number;
	organism?: string;
}

export type IPayloadGlobalAlignment = Omit<IPayloadGeneric, "alignment_score" | "epitope_maps" | "idSubtype">;
export type IPayloadLocalAlignment = Omit<IPayloadGeneric, "epitope_maps" | "map_init" | "map_end" | "coverage_pct">;
export type IPayloadEpitopeMap = Omit<
	IPayloadGeneric,
	"alignment_score" | "map_init" | "map_end" | "coverage_pct" | "idSubtype"
>;

export type TComputeGlobalAlignment = (
	referenceSequence: string | string[],
	sequenceToAlign: string | string[],
	idSequence?: number
) => IPayloadGlobalAlignment;

export type workType = "global-mapping" | "local-mapping" | "epitope-mapping";
export type workStatus = "TODO" | "ALLOCATED" | "DONE";

export interface IWork {
	status: workStatus;
	type: workType;
	id1: number;
	id2?: number;
	organism: string;
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
