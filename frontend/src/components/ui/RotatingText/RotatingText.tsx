import { useEffect, useState } from "react";

type RotatingTextProps = {
  phrases: string[];
  interval?: number;
};

const DEFAULT_INTERVAL = 3500;

export default function RotatingText({
  phrases,
  interval = DEFAULT_INTERVAL,
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [phrases.length, interval]);

  return (
    <span key={index} className="colored-text inline-block animate-text-swap">
      {phrases[index]}
    </span>
  );
}
