class WordDefinition {
    constructor(resultsContainer, wordDefinition) {
        const wordDisplay = resultsContainer.querySelector('#email');
        const defDisplay = resultsContainer.querySelector('#password');
        wordDisplay.textContent = wordDefinition.word;
        defDisplay.textContent = wordDefinition.definition;
    }
}

export default WordDefinition;