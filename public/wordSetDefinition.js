class WordSetDefinition {
    constructor(resultsContainer) {
      this.setWordInput = resultsContainer.querySelector('#set-word-input');
      this.setDefInput = resultsContainer.querySelector('#set-def-input');      
    }

    show(wordDefinition) {
      this.setWordInput.value = wordDefinition.word;
      this.setDefInput.value = wordDefinition.definition;
    }

    read() {
      const result = {
        word: this.setWordInput.value,
        definition: this.setDefInput.value
      };
      return result;
    }
}

export default WordSetDefinition;
