![CleanBird](/Assets/Logo.png)

Clean up your old tweets with a helpful, keyboard-controlled UI.

[CleanBird is available here](https://cleanbird.madebyayden.co/).

![Screenshot of CleanBird](/Assets/Screenshot.png)

## Setting up

**Just want to quickly delete your tweets?** Use the pre-hosted version [here](https://cleanbird.madebyayden.co/).

1. Clone this repository.
2. Type `npm i` to install the required dependencies.
3. [Request a Twitter archive.](https://twitter.com/settings/account)
4. [Create a Twitter application for this app](https://developer.twitter.com/en/apps/create). Just specify the name, description, and use. You'll also need to setup *Sign in with Twitter*, which uses the endpoint `/auth/twitter/callback`.
5. Obtain your application API key and secret.
6. Copy `src/Config.example.js` to `src/Config.js` and fill in the fields.
7. Start the development server with `npm run serve`.
8. Navigate to the [local site](http://localhost:8080/), sign in, and select your archive.

There is also a docker-compose configuration for your convenience.

## Using it

You'll cycle through all of your tweets. You can either choose to trash a tweet (shortcut: X) or move on to the next one (shortcut: N).

Once you're done, click on the count of tweets queued to be deleted at the bottom. You'll be guided through the actual deletion.

## Contributing

Feel free to contribute to the source code of CleanBird to make it something even better! Just try to adhere to the general coding style throughout, to make it as readable as possible.

## License

This project is licensed under the [MIT license](/LICENSE). Please make sure you comply with its terms while using it in any way.
