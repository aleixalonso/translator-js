'use strict';
const Translator = {
  languages: {},
  defaultConfig() {
    return {
      currentLanguage: 'en',
      allLanguages: [],
      folderName: 'languages',
    };
  },
  _env() {
    if (typeof window != 'undefined') {
      return 'browser';
    } else if (typeof module !== 'undefined' && module.exports) {
      return 'node';
    }
    return 'browser';
  },
  async init(options = {}) {
    if (typeof options != 'object') {
      options = {};
    }
    this.languages = {};
    this.config = Object.assign(this.defaultConfig(), options);
    console.log('Config:', this.config);
    await this.fetchAllLanguages(
      this.config.folderName,
      this.config.allLanguages
    );
  },
  async fetchAllLanguages(folderName, languages) {
    //console.log({ folderName, languages });
    //console.log(this._env());
    if (this._env() === 'browser') {
      await Promise.all(
        languages.map(async (lang) => {
          let result = await fetch(`./${folderName}/${lang}.json`);
          let doc = await result.json();
          //console.log(doc);
          this.languages[lang] = doc;
        })
      );
    } else if (this._env() === 'node') {
      console.log('dew');
      await Promise.all(
        languages.map(async (lang) => {
          let result = require('fs').readFileSync(
            `./${folderName}/${lang}.json`,
            'utf8'
          );
          this.languages[lang] = JSON.parse(result);
        })
      );
    }
  },
  changeLanguage(lang) {
    if (this.config.allLanguages.includes(lang)) {
      this.config.currentLanguage = lang;
    }
  },
  t(literal, variables = {}) {
    let json = this.languages[this.config.currentLanguage];
    let translation = literal
      .split('.')
      .reduce((obj, i) => (obj ? obj[i] : null), json);

    if (!translation && this.config.preferredLanguages) {
      const { preferredLanguages, currentLanguage } = this.config;
      const otherLanguages = preferredLanguages.filter(
        (lang) => lang !== currentLanguage
      );
      console.log(otherLanguages);
      for (let lang of otherLanguages) {
        let newJson = this.languages[lang];
        let newTranslation = literal
          .split('.')
          .reduce((obj, i) => (obj ? obj[i] : null), newJson);
        if (newTranslation) {
          translation = newTranslation;
          break;
        }
      }
    }

    if (translation && Object.keys(variables).length !== 0) {
      const variableRegExp = new RegExp('{([^}]+)}', 'g');
      let interpolated = translation;
      let currentMatch = variableRegExp.exec(translation);
      while (currentMatch !== null) {
        const [placeholder, replacementKey] = currentMatch;
        const replacement = variables[replacementKey.trim()];
        if (replacement !== undefined) {
          interpolated = interpolated.replace(
            placeholder,
            replacement.toString()
          );
        }
        currentMatch = variableRegExp.exec(translation);
      }
      translation = interpolated;
    }

    translation = translation || literal;
    return translation;
  },
};

//module.exports = Translator;
export default Translator;
