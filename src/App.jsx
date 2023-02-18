import { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import words from "./constants/words";
import keys from "./constants/keys";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [randomWord, setRandomWord] = useState("");
    const [inputArray, setInputArray] = useState([
        [
            { pos: 1, val: "", disabled: false },
            { pos: 2, val: "", disabled: false },
            { pos: 3, val: "", disabled: false },
            { pos: 4, val: "", disabled: false },
            { pos: 5, val: "", disabled: false },
        ],
        [
            { pos: 6, val: "", disabled: true },
            { pos: 7, val: "", disabled: true },
            { pos: 8, val: "", disabled: true },
            { pos: 9, val: "", disabled: true },
            { pos: 10, val: "", disabled: true },
        ],
        [
            { pos: 11, val: "", disabled: true },
            { pos: 12, val: "", disabled: true },
            { pos: 13, val: "", disabled: true },
            { pos: 14, val: "", disabled: true },
            { pos: 15, val: "", disabled: true },
        ],
        [
            { pos: 16, val: "", disabled: true },
            { pos: 17, val: "", disabled: true },
            { pos: 18, val: "", disabled: true },
            { pos: 19, val: "", disabled: true },
            { pos: 20, val: "", disabled: true },
        ],
        [
            { pos: 21, val: "", disabled: true },
            { pos: 22, val: "", disabled: true },
            { pos: 23, val: "", disabled: true },
            { pos: 24, val: "", disabled: true },
            { pos: 25, val: "", disabled: true },
        ],
        [
            { pos: 26, val: "", disabled: true },
            { pos: 27, val: "", disabled: true },
            { pos: 28, val: "", disabled: true },
            { pos: 29, val: "", disabled: true },
            { pos: 30, val: "", disabled: true },
        ],
    ]);
    const [currentRow, setCurrentRow] = useState(0);
    const [message, setMessage] = useState("");
    const notify = () => toast(message);

    useEffect(() => {
        const word = words[Math.floor(Math.random() * words.length)];
        console.log(word);
        setRandomWord(word);
    }, []);

    useEffect(() => {
        if (message !== "") {
            notify();
            setMessage("");
        }
    }, [message]);

    const handleInputChange = (e, rowindex, colindex) => {
        const inputVal = e.target.value;
        if (!/^[a-zA-Z]+$/.test(inputVal) && inputVal !== "") {
            return;
        }

        let arr = inputArray.map((row, idx) =>
            idx === rowindex
                ? row.map((col, i) =>
                      i === colindex
                          ? { ...col, val: inputVal.toUpperCase() }
                          : { ...col }
                  )
                : row
        );

        if (inputVal.length === 1) {
            const nextTabIndex = e.target.tabIndex + 1;
            const nextInput = document.querySelector(
                `[tabIndex="${nextTabIndex}"]`
            );

            if (inputVal != "") {
                document
                    .querySelector(`[tabIndex="${nextTabIndex - 1}"]`)
                    .classList.add("input-effect");
            }

            nextInput && nextInput.focus();
        }

        setCurrentRow(rowindex);
        setInputArray(arr);
    };

    const handleOnKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
        }

        if (e.key === "Backspace") {
            deleteInput(e);
        }

        if (e.key === "Enter") {
            startInterval(e);
        }
    };

    const deleteInput = (e) => {
        if (!e.target.value) {
            const previousIndex = e.target.tabIndex - 1;
            const previousInput = document.querySelector(
                `[tabIndex="${previousIndex}"]`
            );

            if (previousIndex > 0) {
                document
                    .querySelector(`[tabIndex="${previousIndex}"]`)
                    .classList.remove("input-effect");
            }

            previousInput && previousInput.focus();
        }
    };

    const startInterval = (e) => {
        const guess = inputArray[currentRow].reduce(
            (acc, y) => (acc += y.val),
            ""
        );

        if (guess.length !== randomWord.length) {
            setMessage("Not enough letters");
            return;
        }

        if (guess === randomWord) {
            setMessage(" 🥳 YOU WIN! 🎉");
        }

        if (!words.includes(guess)) {
            setMessage("Word is not in our list");
            return;
        }

        let arr = inputArray[currentRow + 1];
        setInputArray(
            inputArray.map((row) =>
                row === arr
                    ? row.map((col) => col && { ...col, disabled: false })
                    : row.map((col) => col && { ...col, disabled: true })
            )
        );

        const addClassInterval = setInterval(
            () => checkValue(addClassInterval, guess, e),
            200
        );
    };

    let letterInx = 1;
    const checkValue = (addClassInterval, guess, e) => {
        if (letterInx > guess.length) {
            clearInterval(addClassInterval);

            const nextTabIndex = e.target.tabIndex + 1;
            const nextInput = document.querySelector(
                `[tabIndex="${nextTabIndex}"]`
            );
            nextInput && nextInput.focus();

            return;
        }

        const tabindex = e.target.tabIndex - guess.length + letterInx;
        const inputEl = document.querySelector(`[tabIndex="${tabindex}"]`);

        if (guess[letterInx - 1] === randomWord[letterInx - 1]) {
            inputEl.classList.add("green");
        } else if (randomWord.includes(guess[letterInx - 1])) {
            inputEl.classList.add("yellow");
        } else {
            inputEl.classList.add("grey");
        }

        letterInx++;
    };

    return (
        <Main>
            <h1>Wordle</h1>
            <Screen>
                {inputArray.map((row, colindex) => (
                    <div key={colindex} className="wrap">
                        {row.map((col, rowindex) => (
                            <input
                                autoFocus={col.pos === 1 ? true : false}
                                type="text"
                                maxLength={1}
                                key={rowindex}
                                value={col.val}
                                tabIndex={col.pos}
                                disabled={col.disabled}
                                onChange={(e) =>
                                    handleInputChange(e, colindex, rowindex)
                                }
                                onKeyDown={(e) => {
                                    handleOnKeyDown(e);
                                }}
                            />
                        ))}
                    </div>
                ))}
            </Screen>
            <Keyboard>
                {keys.map((key, i) => (
                    <span
                        key={i}
                        className={key == "enter" || key == "del" ? "wide" : ""}
                    >
                        {key.toUpperCase()}
                    </span>
                ))}
            </Keyboard>
            <ToastContainer
                position="top-center"
                hideProgressBar={true}
                autoClose={2000}
            />
        </Main>
    );
}

const Main = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Screen = styled.div`
    position: absolute;
    top: 18%;
    right: 50%;
    transform: translate(50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    width: 300px;
    height: 410px;

    .wrap {
        margin: 0 auto;
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;

        input {
            margin: 4px;
            background-color: #121213;
            outline: 2px solid #3a3a3c;
            border: none;
            width: 60px;
            height: 60px;
            display: flex;
            font-size: 2rem;
            text-align: center;
            color: white;
            font-weight: 600;
            caret-color: transparent;
            transition: transform 250ms linear;
        }

        .green {
            background-color: var(--green-color);
        }

        .grey {
            background-color: var(--grey-color);
        }

        .yellow {
            background-color: var(--yellow-color);
        }

        .input-effect {
            animation: dance 0.18s ease-in-out forwards;
        }
    }
`;

const Keyboard = styled.section`
    position: absolute;
    bottom: 2%;
    right: 50%;
    transform: translate(50%, 0);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    width: 480px;
    flex-wrap: wrap;
    cursor: pointer;

    span {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        background-color: grey;
        margin: 3px;
        border-radius: 5px;
        font-weight: 500;
    }

    .wide {
        width: 70px;
        font-size: 1rem;
    }

    span:not(.wide) {
        width: 40px;
    }
`;

export default App;
