import React from "react";
import { languages } from "./languages";
import clsx from "clsx";
import { getFarewellText } from "../farewellmessages";
import getRandomWord from "./words";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

export default function Hangman() {
  /*setting the current word as getRandomWord() will make the function
  get called on every re-render, even if it won't use the returned value to change states
  - that's why its wrapped in a callback function, so react will ignore it in the other re-renders
  */
  const [currentWord, setCurrentWord] = React.useState(() => [
    ...getRandomWord(),
  ]);
  const [rightGuesses, setRightGuesses] = React.useState([]);
  const [wrongGuesses, setWrongGuesses] = React.useState([]);
  const [gameStatus, setGameStatus] = React.useState("");
  const alphabet = [..."abcdefghijklmnopqrstuvwxyz"];
  //setting width and height for the confetti
  const { width, height } = useWindowSize();
  //delete duplicates from the currentWord, so its length is equal to the rightGuesses array's length
  const currentWordSingle = [...new Set(currentWord)];

  //game over
  const isGameWon = rightGuesses.length === currentWordSingle.length;
  const isGameLost = wrongGuesses.length >= languages.length;
  const isGameOver = isGameWon || isGameLost;

  //game status
  React.useEffect(() => {
    if (!isGameOver) {
      if (wrongGuesses.length > 0) {
        const lastIndex = wrongGuesses.length - 1;
        const fareWellMessage = getFarewellText(languages[lastIndex].name);
        setGameStatus(fareWellMessage);
      }
    } else if (isGameOver) {
      if (isGameWon) {
        setGameStatus(
          <>
            <h3>You win!</h3>
            <p>Well done! 🙌 </p>
          </>
        );
      } else if (isGameLost) {
        setGameStatus(
          <>
            <h3>You lost</h3>
            <p>woof!</p>
          </>
        );
      }
    }
  }, [wrongGuesses.length, isGameOver]);

  //the language elements
  const languageElements = languages.map((lang, index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    const className = clsx("chip", index < wrongGuesses.length && "lost");

    return (
      <span className={className} style={styles} key={lang.name}>
        {lang.name}
      </span>
    );
  });

  /*word to be guessed - only show the letters that are included in the 'rightGuesses' array
   and display all the letters if the game is lost*/
  const unknownWord = currentWord.map((letter, index) => {
    return (
      <span key={index} className="unknownLetter">
        {isGameLost
          ? letter.toUpperCase()
          : rightGuesses.includes(letter)
          ? letter.toUpperCase()
          : ""}
      </span>
    );
  });

  /*reminder - 
  wrapping the onClick function in an anonymous callback function, because 
  the event always receives the event object as a parameter. This way,
  the event will run the function handleClicked key with the chosen parameter.
  */
  const keyboard = alphabet.map((letter) => {
    const className = clsx(
      "letterKey",
      rightGuesses.includes(letter) && "letterFound",
      wrongGuesses.includes(letter) && "letterNotFound"
    );
    return (
      <button
        onClick={() => handleClickedKey(letter)}
        className={className}
        disabled={isGameOver}
        aria-disabled={isGameOver}
        key={letter}
        aria-label={`Letter: ${letter}`}
        id={letter}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  //handle click function -
  function handleClickedKey(letter) {
    if (currentWord.includes(letter)) {
      rightGuesses.includes(letter)
        ? setRightGuesses((prevRightGuesses) => [...prevRightGuesses])
        : setRightGuesses((prevRightGuesses) => [...prevRightGuesses, letter]);
    } else {
      setWrongGuesses((prevWrongGuesses) => [...prevWrongGuesses, letter]);
    }
  }

  //resetting the game
  function resetGame() {
    setCurrentWord([...getRandomWord()]);
    setRightGuesses([]);
    setWrongGuesses([]);
    setGameStatus("");
  }

  return (
    <main>
      {isGameWon && <ReactConfetti width={width} height={height} />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the progamming world safe
          from Assembly!
        </p>
      </header>
      <section
        aria-live="polite"
        role="status "
        className={clsx(
          "gameStatus",
          isGameWon && "gameWon",
          isGameLost && "gameLost"
        )}
      >
        {gameStatus}
      </section>
      <section className="languageChips">{languageElements}</section>
      <section className="unknownWordContainer">{unknownWord}</section>
      <section className="keyboardContainer">{keyboard}</section>
      {isGameOver && (
        <button onClick={resetGame} className="newGameButton">
          New game
        </button>
      )}
    </main>
  );
}
