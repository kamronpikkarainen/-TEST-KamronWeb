import { forwardRef } from 'react';

/**
 * A small flat bird silhouette, perched on the wire stub above the
 * HVAC × Raleigh cell (see Exclusivity.jsx). GSAP animates this ref
 * away — translate + fade — the instant that cell flips to Locked.
 */
const Bird = forwardRef(function Bird({ className = '' }, ref) {
  return (
    <svg
      ref={ref}
      width="16"
      height="12"
      viewBox="0 0 16 12"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1 7 C3 3.5 5.5 3.5 8 6 C10.5 3.5 13 3.5 15 7 C12.5 6.2 10.5 6.6 8 8.5 C5.5 6.6 3.5 6.2 1 7 Z"
        fill="#1B2230"
      />
    </svg>
  );
});

export default Bird;
