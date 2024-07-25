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
  const { config, setConfig } = useContext(KeyboardContext);
  console.log("Config in textfield", config);

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
    setpredictedWords(prediction.predict(text.target.value));
    console.log(predictedWords);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="top">
      <div className="text-field">
        <input
          type="text"
          className="text-input"
          onChange={(e) => predictWords(e)}
        />

        <button
          className="copy-button"
          onClick={(event) =>
            copyText(document.querySelector(".text-input").value)
          }
        >
          <ContentCopyIcon />
        </button>
        <button
          className="clear-button"
          onClick={(event) =>
            (document.querySelector(".text-input").value = "")
          }
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
                onClick={(event) => {
                  document.querySelector(".text-input").value += word;
                  setpredictedWords([]);
                }}
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
