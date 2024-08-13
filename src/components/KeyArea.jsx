import * as React from "react";
import { useState, useContext } from "react";
import { KeyboardContext } from "../config/context.js";
import { Button } from "@mui/base";
import { useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const KeyArea = () => {
  const [letterGroupPicked, setletterGroupPicked] = useState(false);
  const [letterGroup, setletterGroup] = useState(0);
  const [activeLetter, setactiveLetter] = useState(0);
  const [groupResetFlag, setgroupResetFlag] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [size, setSize] = useState(1);

  const duration = 1500;

  const { config, setConfig } = useContext(KeyboardContext);

  useEffect(() => {
    var interval;
    if (!letterGroupPicked) {
      interval = setInterval(() => {
        setletterGroup((prev) => (prev + 1) % 7);
      }, config.groupHighlightTimeout);
    } else {
      interval = setInterval(() => {
        setactiveLetter(
          (prev) => (prev + 1) % letterGroups[letterGroup].length
        );
      }, config.letterHighlightTimeout);
    }

    return () => clearInterval(interval);
  }, [letterGroup, letterGroupPicked, activeLetter]);

  const letterGroups = {
    0: ["A", "B", "C", "D"],
    1: ["E", "F", "G", "H"],
    2: ["I", "J", "K", "L"],
    3: ["M", "N", "O", "P"],
    4: ["Q", "R", "S", "T"],
    5: ["U", "V", "W", "X"],
    6: ["Y", "Z"],
  };

  const punctuation = ["!", "?", ",", ".", ":", ";", "'", '"', "-", " "];

  const handleMouseEnter = (word) => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const scaleFactor = Math.min(1 + elapsedTime / duration, 1.5); // Scale up to 1.5x
      setSize(scaleFactor);

      if (elapsedTime >= duration) {
        clearInterval(interval);
        handleClick(word);
      }
    }, 16); // Update every 16ms (~60fps)

    setHoverTimeout(interval);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearInterval(hoverTimeout);
      setHoverTimeout(null);
      setSize(1); // Reset size when mouse leaves
    }
  };

  const handleClick = (punctuation) => {
    document.querySelector(".text-input").value += punctuation;
  };

  const typeLetter = (letter) => {
    let input = document.querySelector(".text-input");

    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    setter.call(input, input.value + letter);
    input.dispatchEvent(new Event("input", { bubbles: true }));

    document.querySelector(".letter-highlight").style.color = "red";
    document.querySelector(".letter-highlight").style.fontWeight = "bold";
  };

  const resetHighlight = () => {
    document.querySelector(".keygroup-highlight").style.color = "black";
    document.querySelector(".letter-highlight").style.color = "black";
    document.querySelector(".letter-highlight").style.fontWeight = "normal";
  };

  const handleKeyAreaEnter = () => {
    if (letterGroupPicked) {
      typeLetter(letterGroups[letterGroup][activeLetter]);
      setgroupResetFlag(true);
    } else {
      setletterGroupPicked(true);
    }
  };

  const handleKeyAreaLeave = () => {
    if (!letterGroupPicked) {
      setletterGroupPicked(true);
    } else {
      resetHighlight();

      if (groupResetFlag) {
        setletterGroupPicked(false);
        setgroupResetFlag(false);
      }
    }
  };

  return (
    <div className="key-screen">
      <div
        className="key-area"
        onMouseEnter={() => handleKeyAreaEnter()}
        onMouseLeave={() => handleKeyAreaLeave()}
      >
        {Object.keys(letterGroups).map((group) => {
          return (
            <div
              key={group}
              className={`keys group-${group} ${
                letterGroup == group ? "keygroup-highlight" : ""
              }`}
            >
              {letterGroups[group].map((letter, index) => {
                return (
                  <Button
                    key={index}
                    className={`key letter-${index} ${
                      (index === activeLetter) &
                      (group == letterGroup) &
                      letterGroupPicked
                        ? "letter-highlight"
                        : ""
                    }`}
                    onClick={() => typeLetter(letter)}
                  >
                    {letter}
                  </Button>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="punctuation keys">
        {punctuation.map((p, index) => {
          return (
            <Button
              key={index}
              className="key punct"
              onClick={() => typeLetter(p)}
              onMouseEnter={(event) => handleMouseEnter(p)}
              onMouseLeave={handleMouseLeave}
            >
              {p}
            </Button>
          );
        })}
      </div>

      {/* <div className="controls">
        <ArrowBackIosIcon
          onClick={() => {
            if (letterGroup == 0) {
              setletterGroup(5);
            } else {
              setletterGroup(letterGroup - 1);
            }
          }}
          style={{ cursor: "pointer" }}
        />

        <ArrowForwardIosIcon
          onClick={() =>
            setletterGroup((letterGroup + 1) % Object.keys(letterGroups).length)
          }
          style={{ cursor: "pointer" }}
        />
      </div> */}
    </div>
  );
};

export default KeyArea;
