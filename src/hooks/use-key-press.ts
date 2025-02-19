import { useState, useEffect } from "react";

export const useKeyPress = function({targetKey, onKeyDown, onKeyUp}: {targetKey: string, onKeyDown?: () => void, onKeyUp?: () => void}) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (ev: KeyboardEvent) => {
      if (ev.key === targetKey) {
        if (onKeyDown) {
          onKeyDown();
        }
        setKeyPressed(true);
      }
    }

    const upHandler = (ev: KeyboardEvent) => {
      if (ev.key === targetKey) {
        if (onKeyUp) {
          onKeyUp();
        }
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [keyPressed, onKeyDown, onKeyUp, targetKey]);

  return keyPressed;
};
