import { Grid, styled } from '@mui/material';

import Table, { TableProps } from '../Table';
import LoaderOverlay from '../Table/LoaderOverlay';

type Props = {
  isLoading?: boolean;
};

type TableWithLoadingProps = Props & TableProps;

const TableWithLoading = ({ isLoading, ...props }: TableWithLoadingProps) => (
  <Wrapper>
    {isLoading && <LoaderOverlay />}

    <Table {...props} />
  </Wrapper>
);

const Wrapper = styled(Grid)(({ theme }) => ({
  width: '100%',
  position: 'relative',

  '& > .MuiTableContainer-root': {
    backgroundColor: '#202740',
    borderRadius: '15px',
    overflow: 'hidden',

    '& > .MuiTable-root': {
      '& > .MuiTableHead-root': {
        position: 'relative',
        zIndex: '10',
        padding: '0 26px !important',
        backgroundColor: '#28304E',

        '& > .MuiTableRow-root': {
          '& > .MuiTableCell-root': {
            width: 'calc(100% / 7)',
            padding: '0 15px',
            height: '52px',
            borderBottom: 'none',
            fontSize: theme.typography.roundWrapperCardDesc.fontSize,
            fontWeight: theme.typography.roundWrapperCardDesc.fontWeight,

            '.MuiButtonBase-root': {
              color: `${theme.palette.buttonsInactive.main}`,
            },

            '&:nth-of-type(1)': {
              width: '10% !important',
            },

            '&:nth-of-type(2)': {
              width: '10% !important',
            },

            '&:nth-of-type(3)': {
              width: '10% !important',
            },

            '&:first-of-type': {
              paddingLeft: '26px !important',
            },

            '&:last-of-type': {
              width: 'calc(100% / 7 * 2)',
              paddingRight: '26px !important',
            },

            '& .MuiBox-root': {
              fontSize: theme.typography.roundWrapperCardDesc.fontSize,
              fontWeight: theme.typography.roundWrapperCardDesc.fontWeight,
            },
          },
        },
      },

      '& .MuiTableBody-root': {},

      // Main orders table body
      '& > .MuiTableBody-root': {
        '& > .MuiTableRow-root': {
          '&:hover': {
            // Show the Transaction button
            '& > .MuiTableCell-root:last-of-type': {
              '& button': {
                opacity: '1',
              },
            },

            // Change color for the ExpandableOrderButton
            '& > .MuiTableCell-root:last-of-type .expandableOrdersButton': {
              backgroundColor: '#4C54F5',
              boxShadow: 'none',
              border: 'none',
            },
          },

          '& > .MuiTableCell-root': {
            width: 'calc(100% / 7)',
            backgroundColor: '#202740',
            borderBottom: '1px solid #2D3654',
            color: theme.palette.textColor.main,
            padding: '0 15px',
            height: '62px',

            '&:nth-of-type(1)': {
              width: '10% !important',
            },

            '&:nth-of-type(2)': {
              width: '10% !important',
            },

            '&:nth-of-type(3)': {
              width: '10% !important',
            },

            '&:first-of-type': {
              paddingLeft: '26px !important',
            },

            '&:last-of-type': {
              width: 'calc(100% / 7 * 2)',
              paddingRight: '26px !important',
            },
          },
        },

        '.expanded-row .MuiTableCell-root': {
          borderBottom: 'none',
        },
      },
    },
  },

  [theme.breakpoints.down('lg')]: {
    '& > .MuiTableContainer-root': {
      overflowX: 'auto',

      '& > .MuiTable-root': {
        minWidth: theme.breakpoints.values.lg,
      },
    },
  },
}));

export default TableWithLoading;
