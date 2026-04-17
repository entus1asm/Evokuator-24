function phoneMask() {
	const phoneInputs = document.querySelectorAll("[data-phone-mask]");

	if (!phoneInputs.length) {
		return;
	}

	const getDigits = (value) => value.replace(/\D/g, "");

	const normalizeDigits = (value) => {
		let digits = getDigits(value);

		if (!digits.length) {
			return "7";
		}

		if (digits[0] === "8") {
			digits = `7${digits.slice(1)}`;
		} else if (digits[0] === "9") {
			digits = `7${digits}`;
		} else if (digits[0] !== "7") {
			digits = `7${digits}`;
		}

		return digits.slice(0, 11);
	};

	const formatPhone = (value) => {
		const digits = normalizeDigits(value);
		const localNumber = digits.slice(1);
		let result = "+7";

		if (!localNumber.length) {
			return result;
		}

		result += ` (${localNumber.slice(0, 3)}`;

		if (localNumber.length >= 3) {
			result += ")";
		}

		if (localNumber.length > 3) {
			result += ` ${localNumber.slice(3, 6)}`;
		}

		if (localNumber.length > 6) {
			result += `-${localNumber.slice(6, 8)}`;
		}

		if (localNumber.length > 8) {
			result += `-${localNumber.slice(8, 10)}`;
		}

		return result;
	};

	const setCursorToEnd = (input) => {
		requestAnimationFrame(() => {
			const position = input.value.length;
			input.setSelectionRange(position, position);
		});
	};

	phoneInputs.forEach((input) => {
		const applyMask = () => {
			input.value = formatPhone(input.value);
		};

		if (!input.value) {
			input.value = "+7";
		} else {
			applyMask();
		}

		input.addEventListener("focus", () => {
			if (!input.value) {
				input.value = "+7";
			}

			if (input.selectionStart !== null && input.selectionStart < 2) {
				setCursorToEnd(input);
			}
		});

		input.addEventListener("input", () => {
			applyMask();
			setCursorToEnd(input);
		});

		input.addEventListener("paste", () => {
			requestAnimationFrame(() => {
				applyMask();
				setCursorToEnd(input);
			});
		});

		input.addEventListener("blur", () => {
			input.value = formatPhone(input.value);
		});

		input.addEventListener("keydown", (event) => {
			const allowedKeys = [
				"Backspace",
				"Delete",
				"Tab",
				"ArrowLeft",
				"ArrowRight",
				"Home",
				"End",
			];

			if (event.ctrlKey || event.metaKey || allowedKeys.includes(event.key)) {
				if ((event.key === "Backspace" || event.key === "Delete") && getDigits(input.value).length <= 1) {
					event.preventDefault();
					input.value = "+7";
					setCursorToEnd(input);
				}

				return;
			}

			if (!/\d/.test(event.key)) {
				event.preventDefault();
			}
		});
	});
}

export default phoneMask;
