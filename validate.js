// Validation functions
module.exports = {
    validateUserNameAndPassword: function (reqBody) {
        // Check that the correct parameters are sent in.
        if (!reqBody.userName || !reqBody.password) {
            console.log('Username and Password must exist.');
            return 'Invalid Arguments, expecting userName and password.';
        }

        // Check that they are not blank.
        if (reqBody.userName.trim() == '') {
            return 'Username cannot be blank.';
        }

        if (reqBody.password.trim() == '') {
            return 'Password cannot be blank.';
        }

        // Could check here for email validation or password requirements

        // No errors found, return an empty string.
        return false;
    }
}