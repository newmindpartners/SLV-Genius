import { Palette } from '../Types';
import { createColor } from '../utils';

export const getLightCustomPalette = (): Palette => ({
  textColor: createColor('#ffffff'),
  textColorDescription: createColor('rgba(193,206,241, 0.7)'),
  textLowFooter: createColor('rgba(193,206,241, 0.5)'),
  buttonsInactive: createColor('#C1CEF1'),
  highlightedFrames: createColor('#323F62'),
  lines: createColor('#293150'),
  bgColor: createColor('#050518'),
  bgCardColor: createColor('#18182B'),
  bgCardRoundColor: createColor('#212137'),
  social: createColor('#7787B1'),
  bgCardGray: createColor('#212137'),
  progressBackground: createColor('#24243D'),

  progressRedGradient: {
    main: '#FF4A4C',
    secondary: '#FF4A8B',
    gradient: 'linear-gradient(90deg, #FF4A4C 0%, #FF4A8B 100%)',
  },

  progressSuccessGradient: {
    main: '#37C7B6',
    secondary: '#5CF198',
    gradient: 'linear-gradient(90deg, #38C7B5 0%, #5CF199 95.68%)',
  },

  successColorStatus: {
    main: '#6AFFA6',
    transparentBg: 'rgba(106, 255, 166, 0.3)',
    transparentFullBg: '#19424B',
  },

  upcomingColorStatus: {
    main: '#F0F287',
    transparentBg: 'rgba(240, 242, 135, 0.3)',
    transparentFullBg: '#474444',
  },

  soldOutColorStatus: {
    main: '#C1CEF1',
    transparentBg: 'rgba(193,206,241, 0.3)',
    transparentFullBg: '#32405A',
  },

  bgPrimaryGradient: {
    main: '#FF0000',
    contrastText: '#151D2E',
    gradient: 'linear-gradient(90deg, #FF4A4C 0%, #FF4A8B 100%)',
  },

  action: {
    disabledBackground: '#C1CEF1',
    disabled: '#6574A7',
  },

  chip: {
    default: {
      backgroundColor: '#32405A',
      color: '#C1CEF1',
    },
    success: {
      backgroundColor: '#19424B',
      color: '#6AFFA6',
    },
    warning: {
      backgroundColor: '#474444',
      color: '#F0F287',
    },
    error: {
      backgroundColor: '#40030e',
      color: '#FF4F6E',
    },
    info: {
      backgroundColor: '#441900',
      color: '#FF9A61',
    },
  },
});
