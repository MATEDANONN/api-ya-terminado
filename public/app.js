import Dictionary from "./dictionary.js";
import WordDefinition from "./wordDefinition.js";
import WordSetDefinition from "./wordSetDefinition.js";

class App {
  constructor() {
    this.dictionary = new Dictionary();

    const searchForm = document.querySelector('#search');
    this._onSearch = this._onSearch.bind(this);
    searchForm.addEventListener('submit', this._onSearch);

    const setForm = document.querySelector('#set');
    this._onSet = this._onSet.bind(this);
    setForm.addEventListener('submit', this._onSet);

    const logoutButton = document.querySelector("#logout-button");
    logoutButton.addEventListener('click', this.dictionary.logout);
  }

  _onSet(event) {
    event.preventDefault();

    const resultsContainer = document.querySelector('#results');
    const wordSetDefinition = new WordSetDefinition(resultsContainer);
    const postBody = wordSetDefinition.read();

    const status = results.querySelector('#status');
    status.textContent = '';

    this.dictionary.save(postBody)
      .then(result => {
        // Update definition
        new WordDefinition(resultsContainer, postBody);
        status.textContent = 'Saved.';
      });

  }

  _onSearch(event) {
    event.preventDefault();
    const status = results.querySelector('#status');
    status.textContent = '';
    const input = document.querySelector('#word-input');
    const word = input.value.trim();
    this.dictionary.doLookup(word)
      .then(this._showResults);
  }

  _showResults(result) {
    const resultsContainer = document.querySelector('#results');
    resultsContainer.classList.add('hidden');

    // Show Word Definition.
    new WordDefinition(resultsContainer, result);

    // Prep set definition form.
    const wordSetDefinition = new WordSetDefinition(resultsContainer);
    wordSetDefinition.show(result);

    // Display.
    resultsContainer.classList.remove('hidden');
  }
}

// Init app
const app = new App();
