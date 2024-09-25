import * as React from "react";
import { useState, useContext } from "react";
import { KeyboardContext } from "../config/context.js";
import { Button } from "@mui/base";
import { useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const KeyArea = () => {
  const [activeGroup, setactiveGroup] = useState(0);
  const [letterGroupPicked, setletterGroupPicked] = useState(false);
  const [letterGroup, setletterGroup] = useState(0);
  const [activeLetter, setactiveLetter] = useState(0);
  const [groupResetFlag, setgroupResetFlag] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [size, setSize] = useState(1);
  const [cycleCount, setCycleCount] = useState(0);
  const maxCycles = 3; // Set the maximum number of cycles before resetting

  const duration = 1500;

  const { config, setConfig } = useContext(KeyboardContext);

  const letterGroups = {
    0: ["A", "B", "C", "D"],
    1: ["E", "F", "G", "H"],
    2: ["I", "J", "K", "L"],
    3: ["M", "N", "O", "P"],
    4: ["Q", "R", "S", "T"],
    5: ["U", "V", "W", "X"],
    6: ["Y", "Z", ".", ","],
    7: ["Num", "Punct."],
  };

  const numberGroups = {
    0: ["1", "2", "3"],
    1: ["4", "5", "6"],
    2: ["7", "8", "9"],
    3: ["0", ".", ","],
    4: ["Letters", "Punct."],
  };

  const punctuationGroups = {
    0: [".", ","],
    1: [":", ";"],
    2: ["!", "?"],
    3: ["-", "_"],
    4: ["'", '"'],
    5: ["space"],
    6: ["Letters", "Num"],
  };

  const keyGroups = {
    0: letterGroups,
    1: numberGroups,
    2: punctuationGroups,
  };

  useEffect(() => {
    var interval;
    console.log(keyGroups[activeGroup][letterGroup]);
    if (!letterGroupPicked) {
      interval = setInterval(() => {
        setletterGroup(
          (prev) => (prev + 1) % Object.keys(keyGroups[activeGroup]).length
        );
      }, config.groupHighlightTimeout);
    } else {
      interval = setInterval(() => {
        setCycleCount((prev) => {
          if (prev >= maxCycles) {
            setletterGroupPicked(false);
            setCycleCount(0);
            setletterGroup(
              (prev) => (prev + 1) % Object.keys(keyGroups[activeGroup]).length
            );
            setactiveLetter(0);
          }
          return prev + 1;
        });
        setactiveLetter(
          (prev) => (prev + 1) % keyGroups[activeGroup][letterGroup].length
        );
      }, config.letterHighlightTimeout);
    }

    return () => clearInterval(interval);
  }, [letterGroup, letterGroupPicked, activeLetter]);

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
    if (letter == "Num") {
      setletterGroup(0);
      setactiveLetter(0);
      setactiveGroup(1);
      return;
    } else if (letter == "Punct.") {
      setletterGroup(0);
      setactiveLetter(0);
      setactiveGroup(2);
      return;
    } else if (letter == "Letters") {
      setletterGroup(0);
      setactiveLetter(0);
      setactiveGroup(0);
      return;
    }
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
      typeLetter(keyGroups[activeGroup][letterGroup][activeLetter]);
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
        {Object.keys(keyGroups[activeGroup]).map((group) => {
          return (
            <div
              key={group}
              className={`keys group-${group} ${
                letterGroup == group ? "keygroup-highlight" : ""
              }`}
            >
              {keyGroups[activeGroup][group].map((letter, index) => {
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
      {/* <div className="punctuation keys">
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
      </div> */}
    </div>
  );
};

export default KeyArea;
