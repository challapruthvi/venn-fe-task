**Note:** This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to Run the App

In the project directory, Run the following commands to see the APP up and running:

### 1. `npm install`

### 2. `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How to Run Lint Check

Run the following command to check for any lint errors:

### `npm run lint`

## How to Run the tests

Run the following command to run all the tests in the project directory:

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Below are few Improvements we could make

1. Currently the design doesn't show any placeholder for the input fields. We could improve the user experience by passing or setting a intuitive placeholder for each field.
2. We could enforce prefixing "+1" (adding it when user starts typing) at the beginning of the `Phone Number` Field. This will be very handy and useful for the user
3. For both the Name fields i.e., `First Name` and `Last Name` I have considered to trim the white space both at the front and end of the string. As I assumed it doesn't make sense to allow white space as a character. But, the UI would still show the white space on the field which could be improved i.e., either not allow to press white space at all at the beginning of the field or show a trimmed version of the value upon onBlur.
