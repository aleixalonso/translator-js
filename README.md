# Translator-js

Easy to use and light-weight JavaScript translator

## Index

- [Installation](#installation)
  - [Client Side](#client-side)
  - [Node.js](#nodejs)
- [Usage](#usage)
- [Language files](#language-files)

## Available features

- Translate single strings
- Translate single strings with parameters
- Translate entire HTML pages (Coming Soon)
- Hierarchy of prefered languages if translation is not found
- Read JSON files from specified folder in Node.js and Client Side
- Detect the user's language automatically (Coming Soon)

## Installation

### Client Side

```js
import Translator from './translator-js/src/translator.js';
```

### Node.js

(Coming Soon)

```js
npm i ....
```

## Usage

Initialize the Translator, if no specified, the default folder name will be Languages

```js
await Translator.init({
  currentLanguage: 'en',
  allLanguages: ['en', 'es', 'pt'],
  preferredLanguages: ['en', 'es', 'pt'],
  folderName: 'languages',
});
```

| Key                | Type           | Default Value | Description                                                                                                         |
| ------------------ | -------------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| currentLanguage    | `String`       | `en`          | Language that will be used to perform the translations                                                              |
| allLanguages       | `String Array` | `[]`          | Array of languages that will be used to read the files. It is required to work                                      |
| preferredLanguages | `String Array` | `undefined`   | If given, if a literal is not in the currentLanguage JSON, it will search in order in the other preferred languages |
| folderName         | `String`       | `languages`   | The folder in where the JSON files will be                                                                          |

To change the language, if it's not in the allLanguages array it won't be changed

```js
Translator.changeLanguage('pt');
```

To translate a single string

```js
Translator.t('greetings.hi');
```

You can pass arguments to translations with an object

```js
Translator.t('greetings.hi', { name: 'Aleix' });
```

## Language files

The folder structure is the following, where each JSON file name corresponds to the names in the parameter allLanguages

```
languages
|-- es.json
|-- en.json
|-- pt.json
```

Inside the language file

```
{
  "name": "Translator",
  "greetings":{
    "hi": "Hi",
    "goodbye": "Goodbye {name}"
  }
}
```
