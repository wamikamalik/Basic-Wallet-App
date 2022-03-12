# Basic-Wallet-App
A basic app for the Aspire Internship code challenge

## Running the application
This application has not been deployed yet. To run the application in development mode:
1. Clone this repository: https://github.com/wamikamalik/Basic-Wallet-App.git
2. Go to the [walletApp](https://github.com/wamikamalik/Basic-Wallet-App/tree/master/walletApp) folder.
3. Type into the terminal: `npm install`
4. Type into the terminal: `expo start`
    -   If expo is not recognised, run this in the terminal: `npm install -g expo-cli`
6. Download the Expo Cli app from Google Play Store or Apple App Store
7. Scan the QR code generated in the terminal with the scanner in the Expo Cli App

For subsequent runs, just run `expo start` in the terminal within the walletApp folder and scan the QR code with your Expo Cli App to view the Wallet App.

## Current functionalities
1. A card can be added by providing certain card details
2. Cards are displayed in a horizontal list with the latest (dummy) transactions below it
3. The card number can be viewed using the show card number button at the top right corner of the card
4. Cards can be forzen/unfrozen using the freeze/unfreeze option
5. Cards can be deleted using the delete option
6. Some validations are included for the card number, thru and CVV. For instance, the card number should be 16 digits, the CVV should be 3 digits and the thru should be a valid date in MM/YY format.
