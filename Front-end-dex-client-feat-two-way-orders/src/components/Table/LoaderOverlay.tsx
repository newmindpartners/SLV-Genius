import { keyframes, styled } from '@mui/material';

const animation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100vw);
  }
`;

const LoaderOverlay = () => (
  <>
    <LoaderWrapper>
      <LoaderAnimation />
    </LoaderWrapper>
    <Overlay />
  </>
);

const LoaderWrapper = styled('div')({
  position: 'absolute',
  top: '52px',
  left: '0',
  width: '100%',
  background: '#31338c',
  height: '4px',
  zIndex: '99',
  overflow: 'hidden',
});

const LoaderAnimation = styled('div')({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '430px',
  height: '100%',
  background: '#4d54f5',
  animation: `${animation} 1.1s infinite linear`,
  zIndex: '99',
});

const Overlay = styled('div')({
  content: "''",
  opacity: 1,
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  background: 'rgba(0, 0, 0, 0.2)',
});

export default LoaderOverlay;
