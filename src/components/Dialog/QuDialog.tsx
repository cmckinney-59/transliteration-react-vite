interface QuDialogProps {
  word: string;
  onQuSelection: (choice: "k" | "kuw") => void;
  onClose: () => void;
  numberOfWordsToReview: number;
  currentWordIndex: number;
}

export default function QuDialog({
  word,
  onQuSelection,
  onClose,
  numberOfWordsToReview,
  currentWordIndex,
}: QuDialogProps) {
  return (
    <dialog className="dialog-overlay" open>
      <div className="dialog-box">
        <h3>Word Review</h3>
        <p>
          Reviewing word {currentWordIndex + 1} of {numberOfWordsToReview}
        </p>
        <p>You have {numberOfWordsToReview} words to review</p>
        <p>
          Does the first "qu" in <strong>{word}</strong> sound like "k" or
          "kuw"?
        </p>
        <button onClick={() => onQuSelection("k")}>k</button>
        <button onClick={() => onQuSelection("kuw")}>kuw</button>
        <button onClick={onClose}>Close</button>
      </div>
    </dialog>
  );
}
