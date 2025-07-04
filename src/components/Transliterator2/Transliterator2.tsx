import React, { useState } from "react";

import "./Transliterator2.css";
import TransliterateButton from "../Buttons/TransliterateButton.tsx";
import AllInOneDialog from "../AllInOneDialog/AllInOneDialog.tsx";
import SaveButtonContainter from "../Buttons/SaveButtons/SaveButtonsContainer.tsx";
import processBaybayinText from "../Utils/BaybayinTextProcessor.ts";

interface TransliteratorProps {
  title: string;
}

type Dictionary = { [word: string]: string };
type DialogType = "start" | "capital" | "ch" | "c" | "j" | "qu" | null;

export default function Transliterator2({ title }: TransliteratorProps) {
  // Text states
  const [text, setText] = useState<string>("");
  const [transliteratedText, setTransliteratedText] = useState<string>("");
  const [wordKeys, setWordKeys] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [tempWordCount, setTempWordCount] = useState<number>(0);

  // Dialog states
  const [wordForDialog, setWordForDialog] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [wordsDictionary, setWordsDictionary] = useState<Dictionary>({});
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);

  // Character index states
  const [capitalIndex, setCapitalIndex] = useState<number | null>(null);
  const [chIndex, setChIndex] = useState<number | null>(null);
  const [cIndex, setCIndex] = useState<number | null>(null);
  const [jIndex, setJIndex] = useState<number | null>(null);
  const [quIndex, setQuIndex] = useState<number | null>(null);

  // Consts
  const textareaHasText = text.length > 0;
  const isBaybayin = title === "Baybayin";
  const isAurebesh = title === "Aurebesh";
  const isDeseret = title === "Deseret";

  const patternCheckers: {
    type: DialogType;
    regex: RegExp;
    findIndex: (word: string) => number;
  }[] = [
    {
      type: "capital",
      regex: /[A-Z]/,
      findIndex: (word) => word.search(/[A-Z]/),
    },
    {
      type: "ch",
      regex: /ch/,
      findIndex: (word) => word.indexOf("ch"),
    },
    {
      type: "c",
      regex: /c/,
      findIndex: (word) => word.indexOf("c"),
    },
    {
      type: "j",
      regex: /j/,
      findIndex: (word) => word.indexOf("j"),
    },
    {
      type: "qu",
      regex: /qu/,
      findIndex: (word) => word.indexOf("qu"),
    },
  ];

  function containsCapital(word: string): boolean {
    return /[A-Z]/.test(word);
  }

  function containsCh(word: string): boolean {
    return /ch/.test(word);
  }

  function containsC(word: string): boolean {
    return /c/.test(word);
  }

  function containsJ(word: string): boolean {
    return /j/.test(word);
  }

  function containsQu(word: string): boolean {
    return /qu/.test(word);
  }

  // Handle Clicks

  //This should initialize the dictionary AND open the dialog
  const handleTransliterateButtonClick = (): void => {
    const initialDict = initializeDictionary(text);
    const keys = Object.keys(initialDict);

    setWordsDictionary(initialDict);
    setWordKeys(keys);
    setCurrentWordIndex(0);
    if (keys.length > 0) {
      setCurrentWord(keys[0]);
    }

    setTempWordCount(keys.length);
    setIsDialogOpen(true);
    setActiveDialog("start");
  };

  const handleStartButtonClick = (): void => {
    processWord(currentWord);
  };

  const processWord = (word: string): void => {
    // for (const pattern of patternCheckers) {
    //   if (pattern.regex.test(word)) {
    //     const matchIndex = pattern.findIndex(word);
    //     activateDialog(matchIndex, word, pattern.type);
    //     return;
    //   }
    // }

    //Get this working.
    if (containsCapital(word)) {
      setActiveDialog("capital");
    } else if (containsCh(word)) {
      setActiveDialog("ch");
    } else if (containsC(word)) {
      setActiveDialog("c");
    } else if (containsJ(word)) {
      setActiveDialog("j");
    } else if (containsQu(word)) {
      setActiveDialog("qu");
    }

    const processed = processBaybayinText(word);
    const original = wordKeys[currentWordIndex];

    setWordsDictionary((prev) => ({
      ...prev,
      [original]: processed,
    }));

    goToNextWord();
  };

  const goToNextWord = () => {
    const nextIndex = currentWordIndex + 1;
    if (nextIndex < wordKeys.length) {
      const nextWord = wordKeys[nextIndex];
      setCurrentWordIndex(nextIndex);
      setCurrentWord(nextWord);
      // Does this loop?
      processWord(nextWord);
    } else {
      setIsDialogOpen(false);
      setTransliteratedText(
        text.replace(/\b\w+\b/g, (word) => wordsDictionary[word] ?? word)
      );
    }
  };

  // Handle Selections

  const handleCapitalInput = (input: string) => {
    if (capitalIndex === null) return;

    const replacement = input;
    const updatedWord = replacement.toLowerCase();
    const originalWord = wordKeys[currentWordIndex];

    setWordsDictionary((prev) => ({
      ...prev,
      [originalWord]: updatedWord,
    }));

    setCapitalIndex(null);
    setActiveDialog(null);

    setCurrentWord(updatedWord);
    processWord(updatedWord);
  };

  const handleClose = (): void => {
    setActiveDialog(null);
    setIsDialogOpen(false);
  };

  const handleSkip = (): void => {
    const originalWord = wordKeys[currentWordIndex];
    const lowercased = originalWord.toLowerCase();

    setWordsDictionary((prev) => ({
      ...prev,
      [originalWord]: lowercased,
    }));

    // Move to next word
    const nextIndex = currentWordIndex + 1;
    if (nextIndex < wordKeys.length) {
      const nextWord = wordKeys[nextIndex];
      setCurrentWordIndex(nextIndex);
      setCurrentWord(nextWord);
      processWord(nextWord);
    } else {
      setIsDialogOpen(false);
      setTransliteratedText(
        text.replace(/\b\w+\b/g, (word) => wordsDictionary[word] ?? word)
      );
    }
  };

  const handleChSelection = (choice: string) => {
    if (chIndex === null) return;

    const replacement = choice === "k" ? "k" : "tiy";

    const before = currentWord.slice(0, chIndex);
    const after = currentWord.slice(chIndex + 2);
    const updatedWord = before + replacement + after;

    const originalWord = wordKeys[currentWordIndex];

    setWordsDictionary((prev) => ({
      ...prev,
      [originalWord]: updatedWord,
    }));

    setChIndex(null);
    setActiveDialog(null);

    setCurrentWord(updatedWord);
    processWord(updatedWord);
  };

  const handleCSelection = (choice: string) => {
    if (cIndex === null) return;

    let replacement = "";

    if (choice === "k") {
      replacement = "k";
    } else if (choice === "tiy") {
      replacement = "tiy";
    } else if (choice === "s") {
      replacement = "s";
    }

    const before = currentWord.slice(0, cIndex);
    const after = currentWord.slice(cIndex + 1);
    const updatedWord = before + replacement + after;

    const originalWord = wordKeys[currentWordIndex];

    setWordsDictionary((prev) => ({
      ...prev,
      [originalWord]: updatedWord,
    }));

    setCIndex(null);
    setActiveDialog(null);

    setCurrentWord(updatedWord);
    processWord(updatedWord);
  };

  const handleJSelection = (choice: string) => {
    if (jIndex === null) return;

    const replacement = choice === "h" ? "h" : "diy";

    const before = currentWord.slice(0, jIndex);
    const after = currentWord.slice(jIndex + 1);
    const updatedWord = before + replacement + after;

    const originalWord = wordKeys[currentWordIndex];

    setWordsDictionary((prev) => ({
      ...prev,
      [originalWord]: updatedWord,
    }));

    setJIndex(null);
    setActiveDialog(null);

    setCurrentWord(updatedWord);
    processWord(updatedWord);
  };

  const handleQuSelection = (choice: string) => {
    if (quIndex === null) return;

    const replacement = choice === "k" ? "k" : "kuw";

    const before = currentWord.slice(0, quIndex);
    const after = currentWord.slice(quIndex + 2);
    const updatedWord = before + replacement + after;

    const originalWord = wordKeys[currentWordIndex];

    setWordsDictionary((prev) => ({
      ...prev,
      [originalWord]: updatedWord,
    }));

    setQuIndex(null);
    setActiveDialog(null);

    setCurrentWord(updatedWord);
    processWord(updatedWord);
  };

  // Helper methods

  const initializeDictionary = (inputText: string): Dictionary => {
    return inputText
      .trim()
      .split(/\s+/)
      .reduce((dict: Dictionary, word: string) => {
        dict[word] = "";
        return dict;
      }, {});
  };

  const resetAllDialogs = (): void => {
    setActiveDialog(null);
    setCapitalIndex(null);
    setChIndex(null);
    setCIndex(null);
    setJIndex(null);
    setQuIndex(null);
  };

  const activateDialog = (
    match: number,
    word: string,
    dialogType: React.SetStateAction<DialogType>
  ): void => {
    if (match !== -1) {
      if (dialogType == "capital") {
        setCapitalIndex(match);
      } else if (dialogType == "ch") {
        setChIndex(match);
      } else if (dialogType == "c") {
        setCIndex(match);
      } else if (dialogType == "j") {
        setJIndex(match);
      } else if (dialogType == "qu") {
        setQuIndex(match);
      }
      setWordForDialog(word);
      setActiveDialog(dialogType);
    }
  };

  // Main HTML Body

  return (
    <div>
      <h2>Transliterator 2</h2>
      <div className="transliteration-container">
        <div className="textarea-wrapper">
          <textarea
            className="transliteration-textarea"
            placeholder="Enter text to be transliterated here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>

          {text.length > 0 && (
            <button
              className="clear-input-button"
              onClick={() => {
                setText("");
              }}
              aria-label="Clear input"
            >
              ×
            </button>
          )}
        </div>
        <div className="textarea-wrapper">
          <div
            className={`transliteration-output ${
              textareaHasText
                ? isBaybayin
                  ? "baybayin-font"
                  : isAurebesh
                  ? "aurebesh-font"
                  : isDeseret
                  ? "deseret-font"
                  : ""
                : ""
            }`}
          >
            {transliteratedText}
          </div>
          {transliteratedText.length > 0 && (
            <button
              className="clear-output-button"
              onClick={() => {
                setTransliteratedText("");
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="action-buttons">
        <div>
          <TransliterateButton
            isActive={textareaHasText}
            onClick={handleTransliterateButtonClick}
            isDisabled={!textareaHasText}
          />
        </div>
        <SaveButtonContainter
          transliteratedText={transliteratedText}
          wordsDictionary={wordsDictionary}
        />
      </div>
      {isDialogOpen && (
        <AllInOneDialog
          onClickStart={handleStartButtonClick}
          onClose={handleClose}
          onEnter={handleCapitalInput}
          onSkip={handleSkip}
          onCSelection={handleCSelection}
          onChSelection={handleChSelection}
          onJSelection={handleJSelection}
          onQuSelection={handleQuSelection}
          numberOfWordsToReview={tempWordCount}
          currentWordIndex={currentWordIndex}
          originalText={wordForDialog}
          activeDialog={activeDialog}
          wordForDialog={wordForDialog}
        />
      )}
      {/* <div className="dictionary-output">
        <h3>Processed Words:</h3>
        <ul>
          {Object.entries(wordsDictionary).map(([original, processed]) => (
            <li key={original}>
              <strong>{original}</strong>: {processed}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
