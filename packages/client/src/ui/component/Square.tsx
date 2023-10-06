import React, { useRef, useEffect, useState, useCallback } from "react";
import ConfirmSquare from "./ConfirmSquare";

interface SquareProps {
  coordinateX: number;
  coordinateY: number;
  iconUrl: string;
}

const Square: React.FC<SquareProps> = ({
  coordinateX,
  coordinateY,
  iconUrl,
}) => {
  const squareRef = useRef<HTMLDivElement | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    setShowDetails(true);
  };

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      const confirmSquareContainer = document.querySelector(
        ".confirm-square-container"
      ) as HTMLElement;

      if (
        confirmSquareContainer &&
        !confirmSquareContainer.contains(e.target as Node)
      ) {
        setShowDetails(false);
      }
    },
    []
  );

  useEffect(() => {
    if (coordinateX === 0 && coordinateY === 0) {
      const squareElement = squareRef.current;
      if (squareElement) {
        squareElement.focus();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [coordinateX, coordinateY, handleOutsideClick]);

  return (
    <>
      <div
        className="square"
        ref={squareRef}
        tabIndex={0}
        onClick={handleClick}
      >
        {iconUrl && (
          <div className="floating-nft">
            <img src={iconUrl} alt="" width={37} />
          </div>
        )}
        <span className="coordinates">
          {coordinateX},{coordinateY}
        </span>
      </div>
      {showDetails && (
        <div
          className="confirm-square-container"
          style={{
            position: "fixed", 
            top: "50%",        
            left: "50%",       
            transform: "translate(-50%, -50%)", 
            zIndex: 1000,
          }}
        >
          <ConfirmSquare
            coordinateX={coordinateX}
            coordinateY={coordinateY}
          />
        </div>
      )}
    </>
  );
};

export default Square;
