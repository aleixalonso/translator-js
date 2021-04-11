'use strict';
const Translator = {
  languages: {},
  defaultConfig() {
    return {
      currentLanguage: 'en',
      allLanguages: ['en', 'es'],
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
    }
  },
  t(literal) {
    let json = this.languages[this.config.currentLanguage];
    let a = literal.split('.').reduce((obj, i) => (obj ? obj[i] : null), json);
    a = a || literal;
    return a;
  },
};
export default Translator;
