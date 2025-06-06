import { useState } from "react";
import CloseDialogButton from "../Buttons/DialogButtons/CloseDialogButton";
import DialogHeader from "./DialogHeader";

interface CapitalLetterDialogProps {
  originalText: string;
  onEnter: (replacement: string) => void;
  onClose: () => void;
  onSkip: () => void;
  numberOfWordsToReview: number;
  currentWordIndex: number;
}

export default function CapitalLetterDialog({
  originalText,
  onEnter,
  onClose,
  onSkip,
  numberOfWordsToReview,
  currentWordIndex,
}: CapitalLetterDialogProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleEnterClick = () => {
    onEnter(inputValue);
  };

  return (
    <dialog className="dialog-overlay">
      <div className="dialog-box">
        <DialogHeader
          onClose={onClose}
          numberOfWordsToReview={numberOfWordsToReview}
          currentWordIndex={currentWordIndex}
        />
        <p>
          If <strong>{originalText}</strong> is a proper noun <em>and</em> is
          not spelled the way it sounds,
        </p>
        <p>please provide the phonetic spelling below.</p>
        <p>Otherwise, click "Skip".</p>
        <input
          className="phonetic-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="phonetic-dialog-buttons">
          <button onClick={handleEnterClick}>Enter</button>
          <button onClick={onSkip}>Skip</button>
          <CloseDialogButton onClose={onClose} />
        </div>
      </div>
    </dialog>
  );
}
