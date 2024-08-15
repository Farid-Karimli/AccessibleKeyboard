# KeyGlide -- Accessible Keyboard Application

This keyboard application is designed to be an alternative text input application for people with severe motor impairments (ALS, MS, etc). By reducing the need for accuracy, the application allows users to select groups of letters and individual letters through timed highlighting. It also includes word suggestion to further assist in text input.

## Features

- **Group Letter Selection**: Users move into an area to select a group of letters, highlighted by time intervals.
- **Individual Letter Selection**: Within a selected group, letters are highlighted in order for individual selection.
- **Word Prediction**: Suggests and predicts words based on the input text to speed up typing.
- **Lightweight and Accessible**: Designed to be lightweight and easy to use, especially for users with limited motor function.

## Development

The app is built in Node.js and Electron integrated with React. The word suggestion is done using predictionary.js. 

To run: 

```
git clone https://github.com/Farid-Karimli/AccessibleKeyboard.git
npm install
npm run start
```

To build:

```
npm run make
```

The above command by default will build for whatever platform you are developing on. You can change this behavior in the `package.json` file. Check out [electron-forge docs](https://www.electronforge.io/) for more details  

Create a .env file with the environment variable DEBUG_MODE to toggle debug mode on and off. For now, DEBUG_MODE on simply opens on the developer tools window when the app is run. 
