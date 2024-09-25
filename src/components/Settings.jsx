import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { KeyboardContext } from "../config/context.js";
import { Slider, Divider, TextField } from "@mui/material";

export const SettingsModal = ({ open, handleClose }) => {
  const { config, setConfig } = useContext(KeyboardContext);

  const handleTimeoutChange = (event, value, type) => {
    if (type === "group") {
      setConfig({ ...config, groupHighlightTimeout: value * 1000 });
    } else {
      setConfig({ ...config, letterHighlightTimeout: value * 1000 });
    }
  };

  const handleNumberChange = (event, value) => {
    setConfig({ ...config, wordSuggestions: value });
  };

  const handleHoverTimeChange = (event, value) => {
    console.log(value);
    setConfig({ ...config, hoverTime: value * 1000 });
  };

  return (
    <Dialog open={open} onClose={handleClose} className="settings">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Typography id="discrete-slider" gutterBottom>
          Group highlight time
        </Typography>
        <Slider
          aria-label="Group highlight time (seconds)"
          defaultValue={config.groupHighlightTimeout / 1000}
          valueLabelDisplay="auto"
          shiftStep={30}
          step={0.1}
          marks
          min={0.1}
          max={2.0}
          onChange={(event, value) =>
            handleTimeoutChange(event, value, "group")
          }
        />
        <Typography id="discrete-slider" gutterBottom>
          Letter highlight time
        </Typography>
        <Slider
          aria-label="Letter highlight time (seconds)"
          defaultValue={config.letterHighlightTimeout / 1000}
          valueLabelDisplay="auto"
          shiftStep={30}
          step={0.1}
          marks
          min={0.1}
          max={2.0}
          onChange={(event, value) =>
            handleTimeoutChange(event, value, "letter")
          }
        />
        <Divider />

        <Typography id="discrete-slider" gutterBottom>
          Number of words to suggest
        </Typography>
        <TextField
          id="outlined-number"
          label="Number"
          type="number"
          value={config.maxWordSuggestions}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event, value) => handleNumberChange(event, value)}
        />

        <Typography id="discrete-slider" gutterBottom>
          Hover time
        </Typography>
        <TextField
          id="outlined-number"
          label="Hover time (seconds)"
          type="number"
          value={config.hoverTime / 1000}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => handleHoverTimeChange(event, event.target.value)}
          step={0.1}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
