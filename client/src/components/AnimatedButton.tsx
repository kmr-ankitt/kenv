export function AnimatedButton({ value, onClick, disabled }: { value: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-purple-950 px-6 font-medium text-zinc-200 duration-500`}
      disabled={disabled}
    >
      <div className="translate-x-0 opacity-100 transition group-hover:translate-x-[-150%] group-hover:opacity-0">
        {value}
      </div>
      <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth={0}
          viewBox="0 0 24 24"
          className="size-6"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.22 19.03a.75.75 0 0 1 0-1.06L18.19 13H3.75a.75.75 0 0 1 0-1.5h14.44l-4.97-4.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z" />
        </svg>
      </div>
    </button>
  );
}