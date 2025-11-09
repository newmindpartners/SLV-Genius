import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CircularProgress, CircularProgressProps } from '@mui/material';
import {
  Collapse,
  Grid,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
} from '@mui/material';
import { map, omit } from 'lodash';
import { FC, ReactElement } from 'react';
import { InfoIcon } from '~/components/Icons';
import Tooltip from '~/components/Tooltip';

export type ExpandableItem = {
  label: string;

  tooltip?: string;
  value?: string;
  amount?: string;
  valueUnit?: string;
};

export type CardExpandableProps = {
  isLoading: boolean;
  isExpanded: boolean;
  previewItem: ExpandableItem;

  collapsedItems?: ExpandableItem[];
  onExpandClick?: () => void;
};

const CardExpandable: FC<CardExpandableProps> = ({
  isLoading,
  isExpanded,
  previewItem,

  collapsedItems,
  onExpandClick,
}) => (
  <Grid item container width={'100%'}>
    <ExpandableHeader
      isLoading={isLoading}
      isExpanded={isExpanded}
      previewItem={previewItem}
      onExpandClick={onExpandClick}
      isExpandable={!!collapsedItems}
    />
    {collapsedItems && (
      <ExpandableContent
        isExpanded={isExpanded}
        isLoading={isLoading}
        collapsedItems={collapsedItems}
      />
    )}
  </Grid>
);

type ExpandableHeaderProps = {
  isLoading: boolean;
  isExpanded: boolean;
  previewItem: ExpandableItem;

  isExpandable?: boolean;
  onExpandClick?: () => void;
};
export const CircularLoader = ({
  isLoading,
  children,
  circularProgressProps,
}: {
  isLoading: boolean;
  children: ReactElement;
  circularProgressProps: CircularProgressProps;
}): ReactElement =>
  isLoading ? <CircularProgress {...circularProgressProps} /> : children;

const ExpandableHeader = ({
  isLoading,
  isExpanded,
  previewItem,

  isExpandable,
  onExpandClick,
}: ExpandableHeaderProps) => (
  <Wrapper item container alignItems={'center'} justifyContent={'space-between'}>
    <Grid item display="flex" flexDirection="row" gap="5px" alignItems="center">
      <Typography variant="statusCard" component="h4" color="textColor.main">
        {previewItem.label}
      </Typography>

      {previewItem.tooltip && (
        <Tooltip title={previewItem.tooltip} placement="right">
          <Grid display="flex" alignItems="center">
            <InfoIcon />
          </Grid>
        </Tooltip>
      )}
    </Grid>

    <Grid item container width={'auto'} alignItems={'center'}>
      <Typography variant="statusCard" component="h4" color="textColor.main">
        <CircularLoader
          isLoading={isLoading}
          circularProgressProps={{ color: 'primary', size: 13 }}
        >
          <>{previewItem.value}</>
        </CircularLoader>{' '}
        {previewItem.valueUnit}
      </Typography>

      {isExpandable && (
        <ExpandMore
          expand={isExpanded}
          onClick={onExpandClick}
          aria-expanded={isExpanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      )}
    </Grid>
  </Wrapper>
);

const Wrapper = styled(Grid)({
  h4: {
    fontSize: '16px',
    lineHeight: '24px',
  },
});

type ExpandableContentProps = {
  isExpanded: boolean;
  isLoading: boolean;
  collapsedItems: ExpandableItem[];
};

const ExpandableContent = ({
  isExpanded,
  isLoading,
  collapsedItems,
}: ExpandableContentProps) => (
  <CollapseWrapper item container>
    <Collapse in={isExpanded} timeout="auto">
      <Grid container mt={'10px'} rowGap={1}>
        {map(collapsedItems, (collapsedItem) => (
          <CollapsedItem
            {...collapsedItem}
            isLoading={isLoading}
            key={collapsedItem.label + '-collapse'}
          />
        ))}
      </Grid>
    </Collapse>
  </CollapseWrapper>
);

const CollapsedItem = ({
  label,
  tooltip,
  isLoading,
  value,
  valueUnit,
}: ExpandableItem & { isLoading: boolean }) => (
  <Grid item container justifyContent={'space-between'} alignItems={'center'}>
    <Grid width="auto" container alignItems="center" gap="5px" flexDirection="row">
      <Typography variant="statusCard" color="soldOutColorStatus.main">
        {label}
      </Typography>

      {tooltip && (
        <Tooltip title={tooltip} placement="right">
          <Grid display="flex" alignItems="center">
            <InfoIcon />
          </Grid>
        </Tooltip>
      )}
    </Grid>

    <Grid width={'auto'} container item alignItems="center">
      <CircularLoader
        isLoading={isLoading}
        circularProgressProps={{ color: 'primary', size: 13 }}
      >
        <Typography variant="statusCard" color="textColor.main">
          {value}
        </Typography>
      </CircularLoader>{' '}
      <Typography
        variant="statusCard"
        color="soldOutColorStatus.main"
        sx={{ marginLeft: '5px' }}
      >
        {valueUnit}
      </Typography>
    </Grid>
  </Grid>
);

type ExpandMoreProps = IconButtonProps & {
  expand: boolean;
};

const ExpandMore = styled((props: ExpandMoreProps) => (
  <IconButton {...omit(props, ['expand'])} />
))(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: '10px',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  padding: 0,
  background: theme.palette.bgCardColor.main,
  width: '24px',
  height: '24px',
  borderRadius: theme.borderRadius.xs,

  '&:hover': {
    background: theme.palette.bgCardColor.main,
  },

  svg: {
    padding: '2px',
    borderRadius: theme.borderRadius.xs,
  },
}));

const CollapseWrapper = styled(Grid)({
  '.MuiCollapse-vertical': {
    width: '100%',
  },
});

export default CardExpandable;
