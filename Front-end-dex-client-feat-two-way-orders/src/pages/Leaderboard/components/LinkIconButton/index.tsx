import IconButton, { IconButtonProps } from '~/components/Button/IconButton';

export interface LinkIconButtonProps extends IconButtonProps {
  href?: string;
}

export const LinkIconButton = ({ href, ...props }: LinkIconButtonProps) => {
  return href ? (
    <a href={href}>
      <IconButton {...props} />
    </a>
  ) : (
    <IconButton {...props} />
  );
};
