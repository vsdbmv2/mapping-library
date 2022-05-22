import { epitopeMap } from ".";

const notRealSequence = `
cbababcabcbacbabcbabcbabcabcbabcbcbabcabcaac
cbabacbacbacbacbbcabacbcbbacbacbacbacbacbabb
cabbacbacbacbbacbacbacbabcbabcabacbacbabcbca
`;

const epitopesToFound = ["abc", "cab", "bac"];

const epitopesToNotFound = ["def", "fed", "edf"];

describe("Epitope map test suite", () => {
	test("should work", () => {
		const result = epitopeMap(notRealSequence, epitopesToFound);
		expect(result).not.toBeUndefined();
		expect(result).not.toBeNull();
		expect(result).toHaveProperty("epitope_maps");
	});

	test("Should find some epitopes", () => {
		const result = epitopeMap(notRealSequence, epitopesToFound);
		expect(result).toHaveProperty("epitope_maps");
		expect(Array.isArray(result.epitope_maps)).toBeTruthy();
		expect(result.epitope_maps.length).toBeGreaterThanOrEqual(1);
		expect(result.epitope_maps[0]).toMatchObject({ linearSequence: "abc", init_pos: 5 });
	});
	test("Should not find epitopes", () => {
		const result = epitopeMap(notRealSequence, epitopesToNotFound);
		expect(result).toHaveProperty("epitope_maps");
		expect(Array.isArray(result.epitope_maps)).toBeTruthy();
		expect(result.epitope_maps.length).toBe(0);
		expect(result.epitope_maps[0]).toBeUndefined();
	});
	test("Should throw an error if the sequence is empty", () => {
		try {
			epitopeMap("", epitopesToNotFound);
			expect(true).toBeFalsy();
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("Empty sequence");
		}
	});
	test("Should throw an error if the epitopes array is empty", () => {
		try {
			epitopeMap(notRealSequence, []);
			expect(true).toBeFalsy();
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("Epitopes not provided");
		}
	});
	test("Should throw an error if the epitopes aren't an array", () => {
		try {
			// @ts-ignore
			epitopeMap(notRealSequence, "test");
			expect(true).toBeFalsy();
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toBe("Epitopes should be provided as an array");
		}
	});
});
