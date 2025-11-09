import { Collapse, Grid, Typography } from '@mui/material';
import { StatTypography } from '~/components/StatTypography';
import { formatNumberWithPrecision } from '~/utils/math';

const formatFee = (fee?: string | number) => {
  const num = typeof fee === 'string' ? Number(fee) : typeof fee === 'number' ? fee : 0;

  return formatNumberWithPrecision(num, 2);
};

export const FeeSection = ({
  title,
  totalFee,
  fees,
  isExpanded,
  tooltipText,
}: {
  title: string;
  totalFee: number;
  fees: { label: string; amount: number }[];
  isExpanded: boolean;
  tooltipText?: string;
}) => (
  <Grid minWidth="7rem">
    <StatTypography label={title} tooltip={tooltipText}>
      {formatFee(totalFee)}
    </StatTypography>
    <Collapse in={isExpanded}>
      {fees.map(({ label, amount }, i) => (
        <Typography
          key={i}
          display="flex"
          variant="caption"
          gap="0.18rem"
          color="#C1CEF1"
        >
          {label}: <p style={{ color: 'white' }}>{formatFee(amount)}</p>
        </Typography>
      ))}
    </Collapse>
  </Grid>
);
