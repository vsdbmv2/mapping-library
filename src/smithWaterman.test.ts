import { smithWaterman } from ".";
import sequences from "./sequences.mock";

sequences.forEach(({ refSeq, query, organism }) => {
	describe(`Suite test for smith waterman (local alignment) - ${organism}`, () => {
		test("should work", () => {
			const map = smithWaterman(refSeq, query);
			expect(map).not.toBeUndefined();
			expect(map).not.toBeNull();
			expect(map).toHaveProperty("alignment_score");
		});

		test("Should have an good alignment score", () => {
			const map = smithWaterman(refSeq, query);
			expect(map.alignment_score).not.toBeUndefined();
			expect(map.alignment_score).not.toBeNull();
			expect(typeof map.alignment_score).toBe("number");
			expect(map.alignment_score).toBeGreaterThanOrEqual(1000);
		});
		test("Should throw an error if reference sequence is incorrect", () => {
			try {
				smithWaterman("", query);
				expect(true).toBeFalsy();
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				expect((error as Error).message).toBe("Empty reference sequence");
			}
		});
		test("Should throw an error if query sequence is incorrect", () => {
			try {
				smithWaterman(refSeq, "");
				expect(true).toBeFalsy();
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				expect((error as Error).message).toBe("Empty query sequence");
			}
		});
	});
});
