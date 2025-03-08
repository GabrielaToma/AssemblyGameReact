import { createRoot } from "react-dom/client";
import "./index.css";
import Hangman from "./App.jsx";

createRoot(document.getElementById("root")).render(<Hangman />);

/*PROJECT PLANNING - questions to ask yourself
 * what are the main containers of elements I need in this app?
- i need a main container that will contain:
 a header, that will contain the h1, the paragraph,
 a container for the status section
 a container for the languages, 
 a container for the guessing letters, 
 a container for the keyboard
 and a button
 * what values will need to be saved in state vs what values can be derived from the state?
 the languages will be held in state, because we need to update their isAlive value based on the key that was pressed
 the keyboard will be held in state, because when a new random word is generated, some of them will have the isCorrect value true(all will be initiliazed to false)
 we need to know if the game is won or not
 we need to know which languages ar dead
 we need to know what the random word is
 we need to know what letter has already guessed  

 * how will the user interact with my app? What events do I need to handle?
 the user will be able to click the keys
 the user will be able to click the new game button
 */
