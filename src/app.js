import "./app.css";

const form = document.querySelector("form");
const email = document.getElementById("email");
const emailError = document.querySelector("#email + span.error");

const password = document.getElementById("password");
const passwordError = document.querySelector("#password + span.error");

email.addEventListener("input", () => {
	if (email.validity.valid) {
		emailError.textContent = ""; // Remove the message content
		emailError.className = "error"; // Removes the `active` class
	} else {
		// If there is still an error, show the correct error
		showEmailError();
	}
});

password.addEventListener("input", () => {
	if (password.validity.valid) {
		passwordError.textContent = "";
		passwordError.className = "error";
	} else {
		showPasswordError();
	}
});

form.addEventListener("submit", (event) => {
	// if the email field is invalid
	if (!email.validity.valid) {
		// display an appropriate error message
		showEmailError();
		// prevent form submission
		event.preventDefault();
	}
	if (!password.validity.valid) {
		showPasswordError();

		event.preventDefault();
	}
});

function showEmailError() {
	if (email.validity.valueMissing) {
		// If empty
		emailError.textContent = "You need to enter an email address.";
	} else if (email.validity.typeMismatch) {
		// If it's not an email address,
		emailError.textContent = "Entered value needs to be an email address.";
	} else if (email.validity.tooShort) {
		// If the value is too short,
		emailError.textContent = `Email should be at least ${email.minLength} characters; you entered ${email.value.length}.`;
	}
	// Add the `active` class
	emailError.className = "error active";
}

function showPasswordError() {
	if (password.validity.valueMissing) {
		passwordError.textContent = "You need to enter a strong password";
	} else if (validatePassword(password.value) === false) {
		//* I should create a message for every regex missing, but it's not worth it at this time
		passwordError.textContent =
			"You need to type a stronger password, must have: 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol (!@#/>?), at least 12 characters";
	} else if (password.validity.tooShort) {
		passwordError.textContent = `Password should be at least ${password.minLength} characters;`;
	}
	passwordError.className = "error active";
}

function validatePassword(password) {
	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;
	return passwordRegex.test(password);
}

function checkPostalCode() {
	// For each country, defines the pattern that the postal code has to follow
	const constraints = {
		ch: ["^(CH-)?\\d{4}$", "Swiss postal codes must have exactly 4 digits: e.g. CH-1950 or 1950"],
		fr: ["^(F-)?\\d{5}$", "French postal codes must have exactly 5 digits: e.g. F-75012 or 75012"],
		de: ["^(D-)?\\d{5}$", "German postal codes must have exactly 5 digits: e.g. D-12345 or 12345"],
		nl: [
			"^(NL-)?\\d{4}\\s*([A-RT-Z][A-Z]|S[BCE-RT-Z])$",
			"Dutch postal codes must have exactly 4 digits, followed by 2 letters except SA, SD and SS",
		],
	};

	// Read the country id
	const country = document.getElementById("country").value;

	// Get the NPA field
	const postalCodeField = document.getElementById("postal-code");

	// Build the constraint checker
	const constraint = new RegExp(constraints[country][0], "");
	const postalCodeError = document.querySelector("#postal-code + span.error");

	// Check it!
	if (constraint.test(postalCodeField.value)) {
		// The postal code follows the constraint, we use the ConstraintAPI to tell it
		postalCodeError.textContent = "";
		postalCodeError.className = "error";
		postalCodeField.setCustomValidity("");
	} else {
		// The postal code doesn't follow the constraint, we use the ConstraintAPI to
		// give a message about the format required for this country
		postalCodeField.setCustomValidity(constraints[country][1]);
		postalCodeError.textContent = constraints[country][1];
		postalCodeError.className = "error active";
	}
}

window.onload = () => {
	document.getElementById("country").onchange = checkPostalCode;
	document.getElementById("postal-code").oninput = checkPostalCode;
};
