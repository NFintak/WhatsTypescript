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
    //type casting
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

        // if (inputDef.phonetic && inputDef.phonetic.length != 0) {
        //     const phoneticDiv = document.createElement('div');
        //     inputDef.phonetic.forEach(p => {
        //         if (p.text) {
                    
        //         }
        //     })
        // }
        
    }