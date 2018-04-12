# nextrip-extension

This Chrome extension uses the MetroTransit NexTrip API to allow users to save their favorite trips and get realtime departure information in a user-friendly format.

## Building Locally
1. Clone the repo.
2. Run `npm install` from the project root to get the required dependencies.
3. Run `webpack` to compile the project into the `dist` folder. Use `--watch` to update the build in realtime as files are modified and saved.
4. Navigate to `chrome://extensions/` and turn on developer mode.
5. Click "Load Unpacked" and point it to the `dist` directory.

## Built With
* React - frontend library
* Bootstrap - so I don't have to do CSS
* Webpack - module bundler
* npm - dependency management
* Google Chrome and it's neat APIs for building extensions

## Some neat stuff and things I learned

### On Chrome/React and Webpack
Chrome extensions use a `manifest.json` to define the `background.js` script and what permissions it should have, and then use Chrome's messaging API to communicate with the `index.js` script, which is what is shown in the popup window. I initally built this project with `create-react-app` (there's definitely some dead code leftover from this somewhere), which was nice to get me up and running as a complete beginner with React. However, it only builds one bundle file, and I needed at least 2 (`background` and `index`). So when the time came to integrate the Chrome extension piece, I ended up writing my own webpack module bundler. I relied pretty heavily on this awesome guide: https://ayastreb.me/chrome-extension-with-react/.

### On React and separation of concerns
React was really cool to learn, but I think my project has a ways to go as far as best practices. For example, my fetch calls to the Nextrip API are made directly from the select components that display that data, and the location of those APIs is passed in as a prop by the parent, which seems messy. I could probably have lifted that state higher and had it managed in a more obvious way from a parent component.

### On State and Redux
Didn't use it. I don't know much about Redux, but it seemed like things were going fine without it. For persistent state across browser sessions, I simply loaded and unloaded the state of the top level component from Chrome's user storage using the storage API.
