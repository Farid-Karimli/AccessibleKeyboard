import React from "react";
import { useState, useContext } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import prediction from "../prediction.js";
import { Button, IconButton } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { SettingsModal } from "./Settings.jsx";
import { KeyboardContext } from "../config/context.js";

export const TextField = () => {
  const [predictedWords, setpredictedWords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [size, setSize] = useState(1); // Initial size of the button (1x scale)

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
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const scaleFactor = Math.min(1 + elapsedTime / duration, 1.5); // Scale up to 1.5x
      setSize(scaleFactor);

      if (elapsedTime >= duration) {
        clearInterval(interval);
        handleClick(word, type);
      }
    }, 16); // Update every 16ms (~60fps)

    setHoverTimeout(interval);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearInterval(hoverTimeout);
      setHoverTimeout(null);
      setSize(1);
    }
  };

  const handleClick = (word, type = "word") => {
    if (type === "copy") {
      copyText(document.querySelector(".text-input").value);
    } else if (type === "clear") {
      document.querySelector(".text-input").value = "";
    } else {
      document.querySelector(".text-input").value = "";
      const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
      document.querySelector(".text-input").value += capitalized;
      setpredictedWords([]);
    }
  };

  return (
    <div className="top">
      <div className="text-field">
        <input
          type="text"
          className="text-input"
          onChange={(e) => predictWords(e)}
          style={{ fontSize: config.fontSize }}
        />

        <button
          className="copy-button control-button"
          onMouseEnter={(event) => handleMouseEnter("", "copy")}
          onMouseLeave={handleMouseLeave}
          // onClick={(event) => handleClick("", "copy")}
        >
          <ContentCopyIcon />
        </button>
        <button
          className="clear-button control-button"
          onMouseEnter={(event) => handleMouseEnter("", "clear")}
          onMouseLeave={handleMouseLeave}
          onClick={(event) => handleClick("", "clear")}
        >
          <DeleteIcon />
        </button>
      </div>
      <div className="predicted-words">
        {predictedWords.length > 0 ? (
          predictedWords.map((word, index) => {
            return (
              <Button
                variant={"outlined"}
                key={index}
                className="predicted-word"
                // onClick={(event) => {}}
                onMouseEnter={(event) => handleMouseEnter(word)}
                onMouseLeave={handleMouseLeave}
                onClick={(event) => handleClick(word)}
                // style={{
                //   transform: `scale(${size})`,
                //   transition: "transform 0.1s ease",
                // }}
              >
                {word}
              </Button>
            );
          })
        ) : (
          <p style={{ color: "white" }}>Suggested words will appear here</p>
        )}
        <IconButton onClick={handleModalOpen}>
          <SettingsIcon />
        </IconButton>
      </div>
      <SettingsModal open={modalOpen} handleClose={handleModalClose} />
    </div>
  );
};
