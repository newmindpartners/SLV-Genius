import { Add, Telegram, Twitter } from '@mui/icons-material';
import { Stack, styled, Typography } from '@mui/material';
import Button from '~/components/Button/Button';
import { Discord } from '~/components/Icons/Icons';
import { LinkIconButton } from '~/pages/Leaderboard/components/LinkIconButton';

import { ISocialLinksFormData } from '../../../SocialLinksDialog/types/ISocialLinksFormData';

export interface SocialLinksPickerProps {
  socialLinks: ISocialLinksFormData;
  onAddLinks: () => void;
}

export const SocialLinksPicker = ({
  socialLinks,
  onAddLinks,
}: SocialLinksPickerProps) => (
  <SocialLinksPicker.Wrapper>
    <Typography variant="body2" color="chip.default.color">
      Social links (Optional):
    </Typography>

    <SocialLinksPicker.Container>
      <Stack direction="row" spacing={1}>
        <LinkIconButton
          size="medium"
          href={socialLinks?.twitter}
          disabled={!socialLinks?.twitter}
          color={socialLinks?.twitter ? 'secondary' : 'transparent'}
        >
          <Twitter />
        </LinkIconButton>

        <LinkIconButton
          size="medium"
          href={socialLinks?.telegram}
          disabled={!socialLinks?.telegram}
          color={socialLinks?.telegram ? 'secondary' : 'transparent'}
        >
          <Telegram />
        </LinkIconButton>

        <LinkIconButton
          size="medium"
          href={socialLinks?.discord}
          disabled={!socialLinks?.discord}
          color={socialLinks?.discord ? 'secondary' : 'transparent'}
        >
          <Discord />
        </LinkIconButton>
      </Stack>

      <Button color="common" size="small" startIcon={<Add />} onClick={onAddLinks}>
        Add links
      </Button>
    </SocialLinksPicker.Container>
  </SocialLinksPicker.Wrapper>
);

SocialLinksPicker.Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

SocialLinksPicker.Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
`;
