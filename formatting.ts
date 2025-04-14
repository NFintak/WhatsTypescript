interface Definition {
    definition: string;
    synonyms: string[];
    antonyms: string[];
}

interface Uses {
    partOfSpeech: string;
    meanings: Definition[];
}

interface Phonetic {
    text?: string;
}

interface Entry {
    word: string;
    phonetic?: Phonetic[];
    uses: Uses[];
    sources?: string[];
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("btn") as HTMLButtonElement;
    const inputWord = document.getElementById("word") as HTMLInputElement;
    const displayDef = document.getElementById("result") as HTMLDivElement;
    const defineForm = document.getElementById("defineform") as HTMLFormElement;

    button.addEventListener("click", () => {
        if (!(inputWord || displayDef || defineForm)) {
            console.error("Some elements are missing, try again later");
        } else {
            defineForm.addEventListener("send", (event) => {
                event.preventDefault();
                const word = inputWord.value.trim();
                if (word) {
                    getDefinition(word, displayDef, inputWord)
                } else {
                    displayDef.textContent = "Entry must be a word";
                }
            });
        }
    });
});

const getDefinition = async (
    word: string,
    output: HTMLElement,
    input: HTMLInputElement
    ): Promise<void> => {
        try {
            const answer = await fetch (`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            console.log(answer);
            if (!answer.ok) {
                throw new Error("Word not found, try another search");
            }
            const def: Entry[] = await answer.json();
            displayDefinition(def, output);
        } catch (error: any) {
            output.textContent = error.message;
        } finally {
            input.value = "";
        }
        
    }

    const displayDefinition = (def: Entry[], output: HTMLElement): void => {
        output.innerHTML = "";
        if (def.length === 0) {
            output.textContent = "No known definitions";
            return;
        }
        
        const inputDef = def[0];
        const title = document.createElement('h1');
        title.classList.add('result-title');
        title.textContent = inputDef.word;
        output.appendChild(title);

        if (inputDef.phonetic && inputDef.phonetic.length != 0) {
            const phoneticDiv = document.createElement('div');
            inputDef.phonetic.forEach(p => {
                if (p.text) {
                    const phoneticText = document.createElement('span');
                    phoneticText.classList.add('phonetic');
                    phoneticText.textContent = p.text;
                    phoneticDiv.appendChild(phoneticText);
                }
            })
            output.appendChild(phoneticDiv);
        }

        if (inputDef.uses && inputDef.uses.length != 0) {
            const usesDiv = document.createElement('div');
            usesDiv.classList.add('uses');
            inputDef.uses.forEach(use => {
                const partOfSpeechHeader = document.createElement('h2');
                partOfSpeechHeader.textContent = use.partOfSpeech;
                usesDiv.appendChild(partOfSpeechHeader);

                if(use.meanings && use.meanings.length != 0) {
                    const meaningsList = document.createElement('ul');
                    use.meanings.forEach(def => {
                        const defList = document.createElement('li');
                        defList.textContent = def.definition;
                        if (def.synonyms && def.synonyms.length != 0) {
                            const synonyms = document.createElement('p');
                            synonyms.classList.add('synonyms');
                            synonyms.textContent = `Common synonyms: ${def.synonyms.join(', ')}`;
                            defList.appendChild(synonyms);
                        }
                        if (def.antonyms && def.antonyms.length != 0) {
                            const antonyms = document.createElement('p');
                            antonyms.classList.add('antonyms');
                            antonyms.textContent = `Common antonyms: ${def.antonyms.join(', ')}`;
                            defList.appendChild(antonyms);
                        }
                        meaningsList.appendChild(defList);
                    });
                    usesDiv.appendChild(meaningsList);
                }
            });
            output.appendChild(usesDiv);
        }

        if ((inputDef as any).sources && (inputDef as any).sources.length != 0) {
            const sourceURL = document.createElement('div');
            sourceURL.classList.add('result-item');
            const link = document.createElement('a');
            link.textContent = 'Source';
            link.target = '_blank';
            link.href = (inputDef as any).sources[0];
            sourceURL.appendChild(link);
            output.appendChild(sourceURL);
        }
    };