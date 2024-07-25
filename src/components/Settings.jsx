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
import { Slider, Divider } from "@mui/material";

export const SettingsModal = ({ open, handleClose }) => {
  const { config, setConfig } = useContext(KeyboardContext);

  const handleTimeoutChange = (event, value, type) => {
    if (type === "group") {
      setConfig({ ...config, groupHighlightTimeout: value * 1000 });
    } else {
      setConfig({ ...config, letterHighlightTimeout: value * 1000 });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Typography id="discrete-slider" gutterBottom>
          Group highlight time
        </Typography>
        <Slider
          aria-label="Group highlight time"
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
          aria-label="Letter highlight time"
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
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
