interface SpriteProps {
  dexNumber: number;
  shiny?: boolean;
  size?: number;
  className?: string;
}

export function Sprite({ dexNumber, shiny = false, size = 32, className = "" }: SpriteProps) {
  const baseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
  const url = shiny ? `${baseUrl}/shiny/${dexNumber}.png` : `${baseUrl}/${dexNumber}.png`;

  return (
    <img
      src={url}
      alt={`Pokemon #${dexNumber}${shiny ? " (shiny)" : ""}`}
      width={size}
      height={size}
      className={`pixelated ${className}`}
      loading="lazy"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
