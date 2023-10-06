import { useParams } from 'react-router-dom';
import Square from "./Square"; 
import { runQuery, getComponentValueStrict, Has } from "@latticexyz/recs";
import { useMUD } from "../../MUDContext";

interface SquareProps {
  coordinateX: number;
  coordinateY: number;
  iconUrl: string;
}

const Squares = () => {
    const { components: { MapId, SquareCoordinates, SquareIconUrl } } = useMUD();
    const { gameMapId = "1" } = useParams();
    const parsedGameMapId = parseInt(gameMapId, 10);

    const filteredEntities = Array.from(runQuery([Has(MapId), Has(SquareCoordinates)])).filter((entity) => {
      return getComponentValueStrict(MapId, entity).value === parsedGameMapId;
    });

    const squareValues = filteredEntities.map((entity) => {
      const coordinates = getComponentValueStrict(SquareCoordinates, entity) || { x: undefined, y: undefined };
      return {
        x: coordinates.x,
        y: coordinates.y,
        iconUrl: getComponentValueStrict(SquareIconUrl, entity)?.value || "https://i.gzn.jp/img/2018/01/15/google-gorilla-ban/00.jpg"
      };
    });

    const gridSize = 50;
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);

    const squares: SquareProps[] = Array.from({ length: gridSize * gridSize }).map((_, idx) => {
      const i = Math.floor(idx / gridSize);
      const j = idx % gridSize;
      const x = i - centerX;
      const y = j - centerY;
      const square = squareValues.find(sq => sq.x === x && sq.y === y);
      return {
        coordinateX: x,
        coordinateY: y,
        iconUrl: square ? square.iconUrl : ""
      };
    });

    return (
      <div className="map-squares">
        {squares.map((square, index) => (
          <Square
            key={index}
            coordinateX={square.coordinateX}
            coordinateY={square.coordinateY}
            iconUrl={square.iconUrl}
          />
        ))}
      </div>
    )
}

export default Squares;
