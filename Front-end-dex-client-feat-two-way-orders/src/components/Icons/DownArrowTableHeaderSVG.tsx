import { FC } from 'react';

type SVGProps = {
  color?: string;
};

const DownArrowTableHeaderSVG: FC<SVGProps> = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={8} height={6} fill={color}>
    <path d="M3.622 4.836a.5.5 0 0 0 .756 0L7.181 1.6a.5.5 0 0 0-.378-.828H1.197A.5.5 0 0 0 .82 1.6l2.803 3.236Z" />
  </svg>
);

export default DownArrowTableHeaderSVG;
