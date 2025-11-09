const DotSvg = ({
  type,
  ...props
}: {
  type: 'default' | 'success' | 'error' | 'info' | 'warning';
}) => {
  const colors = {
    default: '#C1CEF1',
    success: '#6AFFA6',
    error: '#FF4F6E',
    info: '#5055e9',
    warning: '#F0F287',
  };
  return (
    <svg width={14} height={14} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle opacity={0.3} cx={6.54} cy={7} r={6.54} fill={colors[type]} />
      <circle cx={6.541} cy={7} r={2.211} fill={colors[type]} />
    </svg>
  );
};

export default DotSvg;
