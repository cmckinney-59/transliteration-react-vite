import { useState } from "react";
import type { JSX } from "react";

import "./Transliterator.css";

import TransliterateButton from "../Buttons/TransliterateButton.tsx";
import React from "react";
import StartReviewDialog from "../Dialog/StartReviewDialog.tsx";
import CapitalLetterDialog from "../Dialog/CapitalLetterDialog.tsx";
import CDialog from "../Dialog/CDialog.tsx";
import ChDialog from "../Dialog/ChDialog.tsx";
import JDialog from "../Dialog/JDialog.tsx";
import QuDialog from "../Dialog/QuDialog.tsx";
import processBaybayinText from "../Utils/BaybayinTextProcessor.ts";
import SaveButtonContainter from "../Buttons/SaveButtons/SaveButtonsContainer.tsx";

interface TransliteratorProps {
  title: string;
}

type Dictionary = { [word: string]: string };

export default function Transliterator({ title }: TransliteratorProps) {
  const [text, setText] = useState<string>("");
  const [transliteratedText, setTransliteratedText] = useState<string>("");
  const [wordForDialog, setWordForDialog] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [wordsDictionary, setWordsDictionary] = useState<Dictionary>({});
  const isBaybayin = title === "Baybayin";
  const isAurebesh = title === "Aurebesh";
  const isDeseret = title === "Deseret";

  type DialogType = "start" | "capital" | "ch" | "c" | "g" | "j" | "qu" | null;
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);

  // New State Variables

  const [wordKeys, setWordKeys] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [tempWordCount, setTempWordCount] = useState<number>(0);
  const [capitalIndex, setCapitalIndex] = useState<number | null>(null);
  const [chIndex, setChIndex] = useState<number | null>(null);
  const [cIndex, setCIndex] = useState<number | null>(null);
  const [jIndex, setJIndex] = useState<number | null>(null);
  const [quIndex, setQuIndex] = useState<number | null>(null);

  const textareaHasText = text.length > 0;

  // Handle Clicks

  const handleTransliterateButtonClick = (): void => {
    const initialDict = initializeDictionary(text);
    const keys = Object.keys(initialDict);

    setWordsDictionary(initialDict);
    setWordKeys(keys);
    setCurrentWordIndex(0);
    if (keys.length > 0) {
      setCurrentWord(keys[0]);
    }

    setTempWordCount(keys.length); // NEW: store this for dialog
    setIsDialogOpen(true);
    setActiveDialog("start");
  };

  const handleStartButtonClick = (): void => {
    processWord(currentWord);
  };

  const processWord = (word: string): void => {
    if (/[A-Z]/.test(word)) {
      const match = word.search(/[A-Z]/);
      activateDialog(match, word, "capital");
      return;
    }

    if (/ch/.test(word)) {
      const match = word.indexOf("ch");
      activateDialog(match, word, "ch");
      return;
    }

    if (/c/.test(word)) {
      const match = word.indexOf("c");
      activateDialog(match, word, "c");
      return;
    }

    if (/j/.test(word)) {
      const match = word.indexOf("j");
      activateDialog(match, word, "j");
      return;
    }

    if (/qu/.test(word)) {
      const match = word.indexOf("qu");
      activateDialog(match, word, "qu");
      return;
    }

    const processed = processBaybayinText(word);

    const original = wordKeys[currentWordIndex];
    setWordsDictionary((prev) => ({
      ...prev,
      [original]: processed,
    }));

    const nextIndex = currentWordIndex + 1;
    if (nextIndex < wordKeys.length) {
      const nextWord = wordKeys[nextIndex];
      setCurrentWordIndex(nextIndex);
      setCurrentWord(nextWord);
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

    const updated = updatedWord;
    setCurrentWord(updated);
    processBaybayinText(updated);
  };

  const handleClose = (): void => {
    setActiveDialog(null);
  };

  const handleSkip = (): void => {
    const originalWord = wordKeys[currentWordIndex];
    const lowercased = originalWord.toLowerCase();

    resetAllDialogs();
    setCurrentWord(lowercased);
    processBaybayinText(lowercased);
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

    const updated = updatedWord;
    setCurrentWord(updated);
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

    const updated = updatedWord;
    setCurrentWord(updated);
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

    const updated = updatedWord;
    setCurrentWord(updated);
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

    const updated = updatedWord;
    setCurrentWord(updated);
  };

  // Show Dialogs

  let showDialog: JSX.Element | null = null;

  switch (activeDialog) {
    case "start":
      showDialog = (
        <StartReviewDialog
          numberOfWordsToReview={tempWordCount}
          onClickStart={handleStartButtonClick}
          onClose={handleClose}
        />
      );
      break;

    case "capital":
      showDialog = (
        <CapitalLetterDialog
          currentWordIndex={currentWordIndex}
          numberOfWordsToReview={wordKeys.length}
          originalText={wordForDialog}
          onEnter={handleCapitalInput}
          onClose={handleClose}
          onSkip={handleSkip}
        />
      );
      break;

    case "ch":
      showDialog = (
        <ChDialog
          currentWordIndex={currentWordIndex}
          numberOfWordsToReview={wordKeys.length}
          word={wordForDialog}
          onChSelection={handleChSelection}
          onClose={handleClose}
        />
      );
      break;

    case "c":
      showDialog = (
        <CDialog
          currentWordIndex={currentWordIndex}
          numberOfWordsToReview={wordKeys.length}
          word={wordForDialog}
          onCSelection={handleCSelection}
          onClose={handleClose}
        />
      );
      break;

    case "j":
      showDialog = (
        <JDialog
          currentWordIndex={currentWordIndex}
          numberOfWordsToReview={wordKeys.length}
          word={wordForDialog}
          onJSelection={handleJSelection}
          onClose={handleClose}
        />
      );
      break;

    case "qu":
      showDialog = (
        <QuDialog
          currentWordIndex={currentWordIndex}
          numberOfWordsToReview={wordKeys.length}
          word={wordForDialog}
          onQuSelection={handleQuSelection}
          onClose={handleClose}
        />
      );
      break;
  }

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
      <h2>Transliterator</h2>
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
      {showDialog}
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
