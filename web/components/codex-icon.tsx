type CodexIconProps = {
  className?: string;
};

export function CodexIcon({ className = "size-6" }: CodexIconProps) {
  return (
    <img
      className={`${className} shrink-0 object-contain`}
      src="/assets/brand/codex-app.png"
      alt=""
      aria-hidden="true"
    />
  );
}
