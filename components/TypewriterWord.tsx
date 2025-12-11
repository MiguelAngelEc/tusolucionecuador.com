interface TypewriterWordProps {
    text: string;
    color?: string;
    prefix?: string;
}

export function TypewriterWord({ text, color, prefix }: TypewriterWordProps) {
  return (
    <>
      {prefix && <span>{prefix}</span>}
      <span className="inline-block">
        {text.split('').map((letter, index) => (
          <span 
            key={index} 
            className={`typewriter-letter ${color}`}
          >
            {letter}
          </span>
        ))}
      </span>
    </>
  );
}