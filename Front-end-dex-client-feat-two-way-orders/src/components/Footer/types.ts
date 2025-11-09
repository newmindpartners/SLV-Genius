import { ReactElement, ReactNode } from 'react';

export type FooterProps = FooterSocialsBlockProps & FooterLinksBlockProps;

export type FooterSocialsBlockProps = {
  logo: ReactElement;
  slogan: string;
  copyright: string;
  socials: ReactNode[];
};
export type FooterLinksBlockProps = {
  links: ReactElement[];
  footerLegalLinks: ReactElement[];
  footerQuickLinks: ReactElement[];
  rightsReserved: string;
  redirects: ReactNode[];
};

export type FooterLinksColumnProps = {
  title: string;
  values?: ReactElement[];
  button?: boolean;
};
