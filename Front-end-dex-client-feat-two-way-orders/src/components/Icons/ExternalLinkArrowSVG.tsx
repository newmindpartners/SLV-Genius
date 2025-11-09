import { FC } from 'react';

type ExternalLinkArrowSVGProps = {
  width?: number;
  height?: number;
};

const ExternalLinkArrowSVG: FC<ExternalLinkArrowSVGProps> = ({
  width = 12,
  height = 11,
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
    <path stroke="#C1CEF1" strokeWidth={1.2} d="m1 10 9-9m0 0v9m0-9H1" />
  </svg>
);
export default ExternalLinkArrowSVG;
