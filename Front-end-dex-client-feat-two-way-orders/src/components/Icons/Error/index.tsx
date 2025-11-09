import { SvgIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

export const ErrorIcon: FC = () => {
  const diameter = 30;

  const CustomSvgIcon = styled(SvgIcon)(() => ({
    cursor: 'pointer',
    width: `${diameter}px`,
    height: `${diameter}px`,
    borderRadius: `${diameter}px`,
  }));

  return (
    <CustomSvgIcon
      viewBox={`0 0 ${diameter} ${diameter}`}
      style={{
        width: '24px',
      }}
    >
      <circle xmlns="http://www.w3.org/2000/svg" cx="15" cy="15" r="15" fill="#F4274C" />
      <circle xmlns="http://www.w3.org/2000/svg" cx="15" cy="21" r="2" fill="white" />
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M17.2974 10.7423L15.9349 16.2343C15.818 16.7055 15.395 17.0364 14.9095 17.0364C14.424 17.0364 14.001 16.7055 13.8841 16.2343L12.5217 10.7423C12.1552 9.2652 13.2729 7.83643 14.7947 7.83643H15.0243C16.5462 7.83643 17.6638 9.2652 17.2974 10.7423Z"
        fill="white"
      />
    </CustomSvgIcon>
  );
};
