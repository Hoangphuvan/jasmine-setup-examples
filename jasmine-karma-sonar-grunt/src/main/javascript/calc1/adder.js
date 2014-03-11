

function add(a, b) {
	var result = a + b;

	if (result >= 1000000) {
		return NaN;
	}

	return result;
}
