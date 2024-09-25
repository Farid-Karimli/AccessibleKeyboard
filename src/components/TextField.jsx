import React from "react";
import { useState, useContext } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BackspaceIcon from "@mui/icons-material/Backspace";
import DeleteIcon from "@mui/icons-material/Delete";
import prediction from "../prediction.js";
import { Button, IconButton } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { SettingsModal } from "./Settings.jsx";
import { KeyboardContext } from "../config/context.js";
import { useSpring, animated } from "@react-spring/web";

export const TextField = () => {
  const [predictedWords, setpredictedWords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [size, setSize] = useState(1); // Initial size of the button (1x scale)
  const [copyFeedback, setCopyFeedback] = useState("");
  const [activeButton, setActiveButton] = useState(null);

  const { config, setConfig } = useContext(KeyboardContext);
  const duration = config.hoverTime;

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const predictWords = (text) => {
    console.log("New text", text.target.value);
    if (text.target.value === "") {
      setpredictedWords([]);
      return;
    }
    const options = {
      maxPredictions: config.maxWordSuggestions,
    };
    setpredictedWords(prediction.predict(text.target.value, options));
    console.log(predictedWords);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleMouseEnter = (word, type = "word") => {
    setActiveButton({ word, type });
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const scaleFactor = Math.min(1 + elapsedTime / duration, 1.3); // Scale up to 1.3x
      setSize(scaleFactor);

      if (elapsedTime >= duration) {
        clearInterval(interval);
        handleButtonAction(word, type);
        setSize(1); // Reset size
        setActiveButton(null);
        if (type === "copy") {
          document.querySelector(".text-input").value = "COPIED!";
          setTimeout(
            () => (document.querySelector(".text-input").value = ""),
            2000
          );
        }
      }
    }, 16); // Update every 16ms (~60fps)

    setHoverTimeout(interval);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearInterval(hoverTimeout);
      setHoverTimeout(null);
      setSize(1);
      setActiveButton(null);
    }
  };

  const handleButtonAction = (word, type = "word") => {
    if (type === "copy") {
      copyText(document.querySelector(".text-input").value);
    } else if (type === "delete") {
      const newText = document.querySelector(".text-input").value.slice(0, -1);
      console.log(newText);
      document.querySelector(".text-input").value = newText;
    } else if (type === "clear") {
      document.querySelector(".text-input").value = "";
    } else {
      document.querySelector(".text-input").value = "";
      const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
      document.querySelector(".text-input").value += capitalized;
      setpredictedWords([]);
    }
  };

  const buttonAnimation = useSpring({
    transform: `scale(${size})`,
    config: { tension: 300, friction: 10 },
  });

  return (
    <div className="keyboard-top">
      <div className="text-field">
        <input
          type="text"
          className="text-input"
          onChange={(e) => predictWords(e)}
          style={{ fontSize: config.fontSize }}
        />

        <animated.button
          className="copy-button control-button"
          onMouseEnter={() => handleMouseEnter("", "copy")}
          onMouseLeave={handleMouseLeave}
          style={activeButton?.type === "copy" ? buttonAnimation : {}}
        >
          <p>COPY</p>
          <ContentCopyIcon fontSize="large" />
        </animated.button>
        <animated.button
          className="delete-button control-button"
          onMouseEnter={() => handleMouseEnter("", "delete")}
          onMouseLeave={handleMouseLeave}
          style={activeButton?.type === "delete" ? buttonAnimation : {}}
        >
          <p>DELETE</p>
          <BackspaceIcon fontSize="large" />
        </animated.button>
        <animated.button
          className="clear-button control-button"
          onMouseEnter={() => handleMouseEnter("", "clear")}
          onMouseLeave={handleMouseLeave}
          style={activeButton?.type === "clear" ? buttonAnimation : {}}
        >
          <p>CLEAR ALL</p>
          <DeleteIcon fontSize="large" />
        </animated.button>
      </div>
      <div className="predicted-words">
        <IconButton onClick={handleModalOpen}>
          <SettingsIcon fontSize="large" />
        </IconButton>
        <div className="predicted-words-container">
          {predictedWords.length > 0 ? (
            predictedWords
              .slice(0, config.maxWordSuggestions)
              .map((word, index) => (
                <animated.button
                  key={index}
                  className="predicted-word"
                  onMouseEnter={() => handleMouseEnter(word)}
                  onMouseLeave={handleMouseLeave}
                  style={activeButton?.word === word ? buttonAnimation : {}}
                >
                  {word}
                </animated.button>
              ))
          ) : (
            <p style={{ color: "white" }}>Suggested words will appear here</p>
          )}
        </div>
      </div>
      <SettingsModal open={modalOpen} handleClose={handleModalClose} />
    </div>
  );
};
