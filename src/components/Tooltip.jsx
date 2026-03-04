function Tooltip({ text, children, position = 'center' }) {
  if (!text) return children;
  const positionClass =
    position === 'left'
      ? 'left-0 translate-x-0'
      : position === 'right'
        ? 'right-0 left-auto translate-x-0'
        : 'left-1/2 -translate-x-1/2';

  return (
    <span className="group relative inline-flex">
      <span className="inline-flex">{children}</span>
      <span
        className={`pointer-events-none absolute bottom-full z-[70] mb-2 hidden w-64 max-w-[calc(100vw-1rem)] whitespace-normal break-words rounded-enterprise border border-neutralBorder bg-white px-3 py-2 text-xs text-[#353535] shadow-md group-hover:block ${positionClass}`}
      >
        {text}
      </span>
    </span>
  );
}

export default Tooltip;
