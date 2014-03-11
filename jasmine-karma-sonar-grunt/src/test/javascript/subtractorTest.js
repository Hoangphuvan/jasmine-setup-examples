describe("subtractor", function() {
	it("subtracts simple numbers", function() {
		expect(subtract(0, 0)).toBe(0);
		expect(subtract(0, 1)).toBe(-1);
		expect(subtract(1, 0)).toBe(1);
		expect(subtract(1, 1)).toBe(0);
		
		// example of test error
		//expect(subtract(1, 1)).toBe(3);

		expect(subtract(2, 7)).toBe(-5);
		expect(subtract(7, 2)).toBe(5);
	});


	it("subtracts large numbers", function() {
		expect(subtract(-900000, 99999)).toBe(-999999);
		//expect(isNaN(subtract(-900001, 99999))).toBeTruthy();
	});
});
