import * as React from "react";
import { createRoot } from "react-dom/client";
import { RestArea } from "./components/RestArea.jsx";
import { KeyArea } from "./components/KeyArea.jsx";
import { TextField } from "./components/TextField.jsx";
import { configuration } from "./config/config.js";
import { KeyboardContext } from "./config/context.js";

const App = () => {
  const [config, setConfig] = React.useState(configuration);

  return (
    <React.Fragment>
      <div className="background"></div>
      <div className="top">
        <KeyboardContext.Provider value={{ config, setConfig }}>
          <TextField />
          <div className="main">
            <KeyArea />

            <RestArea />
          </div>
        </KeyboardContext.Provider>
      </div>
    </React.Fragment>
  );
};

createRoot(document.body).render(<App />);
