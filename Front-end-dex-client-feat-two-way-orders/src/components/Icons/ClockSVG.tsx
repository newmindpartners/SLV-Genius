const ClockSVG = (): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none">
    <path
      stroke="#6574A7"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M9 16.943a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
    />
    <path
      stroke="#6574A7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 4.276v4.667h4.667"
    />
  </svg>
);

export default ClockSVG;
