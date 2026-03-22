import type { SVGProps } from "react";

export function PorterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 50 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M31.25 31V0H43.75V31M6.25 31V0H18.75V31M0 18.6V12.4H50V18.6"
        fill="currentColor"
      />
    </svg>
  );
}
