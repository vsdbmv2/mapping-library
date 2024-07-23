import { neoNeedlemanGotoh } from ".";
import sequences from "./neoNeedlemanGotoh.mock";

sequences.forEach(({ refSeq, query, organism }) => {
	describe(`Suite test for smith waterman (global alignment) - ${organism}`, () => {
		test("should work", () => {
			const map = neoNeedlemanGotoh(refSeq, query);
			expect(map).not.toBeUndefined();
			expect(map).not.toBeNull();
			expect(map).toHaveProperty("map_init");
			expect(map).toHaveProperty("map_end");
			expect(map).toHaveProperty("coverage_pct");
			expect(map.map_init).toEqual(expect.any(Number));
			expect(map.map_end).toEqual(expect.any(Number));
			expect(map.coverage_pct).toEqual(expect.any(Number));
			const coverageArea = Math.round((map.coverage_pct / 100) * Math.max(refSeq.length, query.length));
			const mappedArea = map.map_end - map.map_init;
			console.table({
				organism,
				...map,
				coverageArea,
				mappedArea,
			});
			expect([coverageArea - 1, coverageArea, coverageArea + 1].includes(mappedArea)).toBeTruthy();
		});

		test("Should have a low percentage score for the fragment", () => {
			const map = neoNeedlemanGotoh(refSeq, query);
			expect(map.coverage_pct).not.toBeUndefined();
			expect(map.coverage_pct).not.toBeNull();
			expect(typeof map.coverage_pct).toBe("number");
			expect(map.coverage_pct).toBeLessThanOrEqual(10);
		});
	});
});

describe("normal validations", () => {
	const query = "GATTACAA";
	const refSeq = "GTCGACG";
	test("Should return the same score if the sequences were inverted", () => {
		const map = neoNeedlemanGotoh(query, refSeq);
		const mapInverse = neoNeedlemanGotoh(refSeq, query);
		expect(map).toMatchObject(mapInverse);
	});
	test("Should be 100% coverage", () => {
		const map = neoNeedlemanGotoh(refSeq, refSeq);
		expect(map.coverage_pct).toBe(100);
	});
	test("Should throw an error if reference sequence is incorrect", () => {
		try {
			neoNeedlemanGotoh("", query);
			expect(true).toBeFalsy();
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("Empty reference sequence");
		}
	});
	test("Should throw an error if query sequence is incorrect", () => {
		try {
			neoNeedlemanGotoh(refSeq, "");
			expect(true).toBeFalsy();
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("Empty query sequence");
		}
	});
});
