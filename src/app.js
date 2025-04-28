import "./app.css";

// Collect all form elements at the top
const form = document.querySelector("form");
const email = document.getElementById("email");
const emailError = document.querySelector("#email + span.error");
const password = document.getElementById("password");
const passwordError = document.querySelector("#password + span.error");
const postalCode = document.getElementById("postal-code");
const postalCodeError = document.querySelector("#postal-code + span.error");
const country = document.getElementById("country");

// Event listeners for email and password
email.addEventListener("input", validateEmail);
password.addEventListener("input", validatePassword);

// Form submission handler
form.addEventListener("submit", (event) => {
	// Validate all fields on submit
	if (!email.validity.valid) {
		validateEmail();
		event.preventDefault();
	}

	if (!validatePassword()) {
		event.preventDefault();
	}

	if (!validatePostalCode()) {
		event.preventDefault();
	}
});

// Validation functions
function validateEmail() {
	if (email.validity.valid) {
		emailError.textContent = "";
		emailError.className = "error";
		return true;
	} else {
		if (email.validity.valueMissing) {
			emailError.textContent = "You need to enter an email address.";
		} else if (email.validity.typeMismatch) {
			emailError.textContent = "Entered value needs to be an email address.";
		} else if (email.validity.tooShort) {
			emailError.textContent = `Email should be at least ${email.minLength} characters; you entered ${email.value.length}.`;
		}
		emailError.className = "error active";
		return false;
	}
}

function validatePassword() {
	if (password.validity.valueMissing) {
		passwordError.textContent = "You need to enter a strong password";
		passwordError.className = "error active";
		return false;
	} else if (!checkPasswordStrength(password.value)) {
		passwordError.textContent =
			"You need to type a stronger password, must have: 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol (!@#/>?), at least 12 characters";
		passwordError.className = "error active";
		return false;
	} else if (password.validity.tooShort) {
		passwordError.textContent = `Password should be at least ${password.minLength} characters;`;
		passwordError.className = "error active";
		return false;
	} else {
		passwordError.textContent = "";
		passwordError.className = "error";
		return true;
	}
}

function checkPasswordStrength(password) {
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;
	return passwordRegex.test(password);
}

function validatePostalCode() {
	// Postal code validation rules
	const constraints = {
		ch: ["^(CH-)?\\d{4}$", "Swiss postal codes must have exactly 4 digits: e.g. CH-1950 or 1950"],
		fr: ["^(F-)?\\d{5}$", "French postal codes must have exactly 5 digits: e.g. F-75012 or 75012"],
		de: ["^(D-)?\\d{5}$", "German postal codes must have exactly 5 digits: e.g. D-12345 or 12345"],
		nl: [
			"^(NL-)?\\d{4}\\s*([A-RT-Z][A-Z]|S[BCE-RT-Z])$",
			"Dutch postal codes must have exactly 4 digits, followed by 2 letters except SA, SD and SS",
		],
	};

	// Get current country
	const selectedCountry = country.value;

	// Check if the country has specific constraints
	if (!constraints[selectedCountry]) {
		postalCodeError.textContent = "";
		postalCodeError.className = "error";
		postalCode.setCustomValidity("");
		return true;
	}

	// Build the constraint checker
	const constraint = new RegExp(constraints[selectedCountry][0], "");

	// Check the postal code against the constraint
	if (constraint.test(postalCode.value)) {
		postalCodeError.textContent = "";
		postalCodeError.className = "error";
		postalCode.setCustomValidity("");
		return true;
	} else {
		postalCodeError.textContent = constraints[selectedCountry][1];
		postalCodeError.className = "error active";
		postalCode.setCustomValidity(constraints[selectedCountry][1]);
		return false;
	}
}

// Initialize event listeners for postal code
window.onload = () => {
	country.addEventListener("change", validatePostalCode);
	postalCode.addEventListener("input", validatePostalCode);
};
