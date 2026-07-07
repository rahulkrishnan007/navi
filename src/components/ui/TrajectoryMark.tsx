interface TrajectoryMarkProps {
  className?: string;
  animate?: boolean;
}

/**
 * Signature element for the "Night Navigator" design system: a compass
 * bearing line rising toward a star, representing career trajectory rather
 * than a generic bar-chart icon. Reused at different scales as the logo
 * mark (small), a dashboard card flourish (medium), and the landing page
 * hero visual (large).
 */
export function TrajectoryMark({ className, animate = false }: TrajectoryMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="52" r="3" className="fill-trail-400" />
      <path
        d="M10 52 C 20 52, 24 40, 32 34 S 44 18, 52 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="4 4"
        className={clsxSafe("text-signal-400", animate && "animate-trace-line")}
        style={animate ? { strokeDasharray: 240, strokeDashoffset: 240 } : undefined}
      />
      <path
        d="M52 4l2.6 5.4 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9z"
        className="fill-signal-400"
      />
    </svg>
  );
}

// Tiny local helper so this file doesn't need the `clsx` package just for
// one conditional class.
function clsxSafe(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
