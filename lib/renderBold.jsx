export default function renderBold(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={i} className="font-600">{part.slice(2, -2)}</span>;
    }
    return part;
  });
}
