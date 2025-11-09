import { FC } from 'react';

type SVGProps = {
  color?: string;
};

const UpArrowTableHeaderSVG: FC<SVGProps> = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={8} height={5}>
    <path
      fill={color}
      d="M3.622.709a.5.5 0 0 1 .756 0l2.803 3.236a.5.5 0 0 1-.378.827H1.197a.5.5 0 0 1-.378-.827L3.622.71Z"
    />
  </svg>
);

export default UpArrowTableHeaderSVG;
