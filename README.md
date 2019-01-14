# CleanBird

Clean up your old tweets with a helpful, keyboard-controlled UI.

**NOTE:** The main functionality of this project, actually going through with the deletion, isn't done yet.

![Screenshot of CleanBird](/Screenshot.png)

## Setting up

1. Clone this repository.
2. Type `npm i` to install the required dependencies.
3. [Request a Twitter archive.](https://twitter.com/settings/account)
4. [Create a Twitter application for this app](https://developer.twitter.com/en/apps/create). Just specify the name, description, and use.
5. Obtain your access token/secret and API key/secret.
6. Copy `src/Config.example.js` to `src/Config.js` and fill in the fields.
7. Download your Twitter archive, and copy the `data` folder from it into the project root.
8. Start the development server with `npm run serve`.
9. Navigate to the [local site](http://localhost:8080/) and get started deleting.

## Using it

You'll cycle through all of your tweets. You can either choose to trash a tweet (shortcut: X) or move on to the next one (shortcut: N).

Once you're done, click on the count of tweets queued to be deleted at the bottom. You'll be guided through the actual deletion.

## Contributing

Feel free to contribute to the source code of CleanBird to make it something even better! Just try to adhere to the general coding style throughout, to make it as readable as possible.

## License

This project is licensed under the [MIT license](/LICENSE). Please make sure you comply with its terms while using it in any way.
