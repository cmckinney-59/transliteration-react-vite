import type { JSX } from "react";

import DialogHeader from "../Dialog/DialogHeader.tsx";
import StartReviewDialog2 from "./SubDialogs/StartReviewDialog2.tsx";
import CapitalLetterDialog2 from "./SubDialogs/CapitalLetterDialog2.tsx";
import CloseDialogButton from "../Buttons/DialogButtons/CloseDialogButton.tsx";
import ChDialog2 from "./SubDialogs/ChDialog2.tsx";
import CDialog2 from "./SubDialogs/CDialog2.tsx";
import JDialog2 from "./SubDialogs/JDialog2.tsx";
import QuDialog2 from "./SubDialogs/QuDialog2.tsx";

type DialogType = "start" | "capital" | "ch" | "c" | "g" | "j" | "qu" | null;

interface AllInOneDialogProps {
  onClickStart: () => void;
  onClose: () => void;
  onEnter: (input: string) => void;
  onSkip: () => void;
  onCSelection: (choice: string) => void;
  onChSelection: (choice: string) => void;
  onJSelection: (choice: string) => void;
  onQuSelection: (choice: string) => void;
  numberOfWordsToReview: number;
  currentWordIndex: number;
  activeDialog: DialogType;
  wordForDialog: string;
}

export default function AllInOneDialog({
  onClickStart,
  onClose,
  onEnter,
  onSkip,
  onCSelection,
  onChSelection,
  onJSelection,
  onQuSelection,
  numberOfWordsToReview,
  currentWordIndex,
  wordForDialog,
  activeDialog,
}: AllInOneDialogProps) {
  let showDialog: JSX.Element | null = null;

  switch (activeDialog) {
    case "start":
      showDialog = <StartReviewDialog2 onClickStart={onClickStart} />;
      break;

    case "capital":
      showDialog = (
        <CapitalLetterDialog2
          wordForDialog={wordForDialog}
          onEnter={onEnter}
          onSkip={onSkip}
        />
      );
      break;

    case "ch":
      showDialog = (
        <ChDialog2 word={wordForDialog} onChSelection={onChSelection} />
      );
      break;

    case "c":
      showDialog = (
        <CDialog2 word={wordForDialog} onCSelection={onCSelection} />
      );
      break;

    case "j":
      showDialog = (
        <JDialog2 word={wordForDialog} onJSelection={onJSelection} />
      );
      break;

    case "qu":
      showDialog = (
        <QuDialog2 word={wordForDialog} onQuSelection={onQuSelection} />
      );
      break;
  }

  return (
    <dialog className="dialog-overlay">
      <div className="dialog-box">
        <DialogHeader
          onClose={onClose}
          numberOfWordsToReview={numberOfWordsToReview}
          currentWordIndex={currentWordIndex}
          isStart={activeDialog === "start"}
        />
        {showDialog}
        <CloseDialogButton onClose={onClose} />
      </div>
    </dialog>
  );
}
