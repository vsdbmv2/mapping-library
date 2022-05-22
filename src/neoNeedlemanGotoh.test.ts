import { neoNeedlemanGotoh } from ".";
import * as fs from "fs";
import * as path from "path";

const { refSeq, query } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "mock.json"), "utf-8"));

describe("Suite test for neo Needleman and Gotoh", () => {
	let scoreTest = 0;
	test("should work", () => {
		const map = neoNeedlemanGotoh(refSeq, query);
		expect(map).not.toBeUndefined();
		expect(map).not.toBeNull();
		expect(map).toHaveProperty("map_init");
		expect(map).toHaveProperty("map_end");
		expect(map).toHaveProperty("coverage_pct");
	});

	test("Should have a low percentage score for the fragment", () => {
		const map = neoNeedlemanGotoh(refSeq, query);
		scoreTest = map.coverage_pct;
		expect(map.coverage_pct).not.toBeUndefined();
		expect(map.coverage_pct).not.toBeNull();
		expect(typeof map.coverage_pct).toBe("number");
		expect(map.coverage_pct).toBeLessThanOrEqual(10);
	});
	test("Should return the same score if the sequences were inverted", () => {
		const map = neoNeedlemanGotoh(query, refSeq);
		expect(map.coverage_pct).not.toBeUndefined();
		expect(map.coverage_pct).not.toBeNull();
		expect(typeof map.coverage_pct).toBe("number");
		expect(map.coverage_pct).toBeLessThanOrEqual(10);
		expect(map.coverage_pct).toBe(scoreTest);
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
