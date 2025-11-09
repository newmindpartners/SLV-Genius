import CloseIcon from '@mui/icons-material/Close';
import { Grid, IconButton, styled, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

type NotificationBannerProps = {
  title?: string;
  text?: string;

  Content?: () => JSX.Element;

  hasHighlights?: boolean;
  image?: ReactNode;
  onClose?: () => void;
};

const NotificationBanner: FC<NotificationBannerProps> = ({
  title,
  text,
  Content,
  hasHighlights = false,
  image,
  onClose,
}) => (
  <Wrapper
    container
    display="flex"
    justifyContent="space-between"
    gap="35px"
    position="relative"
    top="0"
    padding="10px 20px"
    overflow="hidden"
    marginBottom="25px"
  >
    {hasHighlights && (
      <>
        <Highlight
          position="left"
          src={'/images/banner/LeftHighlight.png'}
          alt={'PurpleHighlight'}
        />
        <Highlight
          position="right"
          src={'/images/banner/RightHighlight.png'}
          alt={'GreenHighlight'}
        />
      </>
    )}

    <Grid
      display="flex"
      flexDirection="column"
      zIndex="2"
      gap="10px"
      justifyContent="center"
      width="100%"
    >
      {title && (
        <Typography
          variant="teamUserTitle"
          fontWeight="800"
          lineHeight="32px"
          textAlign="center"
        >
          {title}
        </Typography>
      )}

      {text && (
        <Typography
          variant="poweredBy"
          lineHeight="16px"
          textAlign="center"
          width="80%"
          margin="0 auto"
          min-width="400px"
        >
          {text}
        </Typography>
      )}

      {Content && <Content />}

      {image && (
        <Grid container justifyContent="center" mt="50px">
          {image}
        </Grid>
      )}
    </Grid>

    {onClose && (
      <Grid position="absolute" top="1px" right="1px" zIndex="3">
        <IconButton onClick={onClose} aria-label="close" disableRipple>
          <CloseIcon />
        </IconButton>
      </Grid>
    )}
  </Wrapper>
);

const Wrapper = styled(Grid)(({ theme }) => ({
  background: '#20273E',
  color: theme.palette.textColor.main,
  borderRadius: theme.borderRadius.sm,
}));

type HighlightProps = {
  position: 'left' | 'right';
};

const Highlight = styled('img')<HighlightProps>(({ position }) => ({
  position: 'absolute',
  top: '50%',
  [position]: 0,
  transform: 'translateY(-50%)',
  width: '100%',
  height: '100%',
  filter: 'blur(40px)',
}));

export default NotificationBanner;
