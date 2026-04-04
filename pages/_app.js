import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Head from 'next/head';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Calibre';
    src: url('/fonts/Calibre/Calibre-Light.woff2') format('woff2'),
         url('/fonts/Calibre/Calibre-Light.woff') format('woff'),
         url('/fonts/Calibre/Calibre-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Calibre';
    src: url('/fonts/Calibre/Calibre-Regular.woff2') format('woff2'),
         url('/fonts/Calibre/Calibre-Regular.woff') format('woff'),
         url('/fonts/Calibre/Calibre-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Calibre';
    src: url('/fonts/Calibre/Calibre-Medium.woff2') format('woff2'),
         url('/fonts/Calibre/Calibre-Medium.woff') format('woff'),
         url('/fonts/Calibre/Calibre-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Calibre';
    src: url('/fonts/Calibre/Calibre-Semibold.woff2') format('woff2'),
         url('/fonts/Calibre/Calibre-Semibold.woff') format('woff'),
         url('/fonts/Calibre/Calibre-Semibold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'SF Mono';
    src: url('/fonts/SFMono/SFMono-Regular.woff2') format('woff2'),
         url('/fonts/SFMono/SFMono-Regular.woff') format('woff'),
         url('/fonts/SFMono/SFMono-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'SF Mono';
    src: url('/fonts/SFMono/SFMono-Medium.woff2') format('woff2'),
         url('/fonts/SFMono/SFMono-Medium.woff') format('woff'),
         url('/fonts/SFMono/SFMono-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --dark-navy: #020c1b;
    --navy: #0a192f;
    --light-navy: #112240;
    --lightest-navy: #233554;
    --navy-shadow: rgba(2, 12, 27, 0.7);
    --dark-grey: #333f58;
    --slate: #8892b0;
    --light-slate: #a8b2d1;
    --lightest-slate: #ccd6f6;
    --white: #e6f1ff;
    --green: #64ffda;
    --trans-green: rgba(100, 255, 218, 0.07);
    --highlight: rgba(41, 61, 90, 0.99);
    --trans-navy: rgba(10, 25, 47, 0.85);

    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui, sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;
    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;
    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out, transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }

  html {
    box-sizing: border-box;
    width: 100%;
    scroll-behavior: smooth;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  ::selection {
    background-color: #64ffda;
    color: #0a192f;
  }

  :focus {
    outline: 2px dashed #64ffda;
    outline-offset: 3px;
  }

  :focus:not(:focus-visible) {
    outline: none;
    outline-offset: 0px;
  }

  :focus-visible {
    outline: 2px dashed #64ffda;
    outline-offset: 3px;
  }

  body {
    margin: 0;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background-color: #0a192f;
    color: #8892b0;
    font-family: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui, sans-serif;
    font-size: 20px;
    line-height: 1.3;

    @media (max-width: 480px) {
      font-size: 18px;
    }

    &.hidden {
      overflow: hidden;
    }

    &.blur {
      overflow: hidden;

      header,
      #content,
      footer {
        filter: blur(5px) brightness(0.7);
        transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        pointer-events: none;
        user-select: none;
      }
    }
  }

  #root {
    min-height: 100vh;
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 100%;
  }

  main {
    margin: 0 auto;
    width: 100%;
    max-width: 1600px;
    min-height: 100vh;
    padding: 0 150px;

    @media (max-width: 1080px) {
      padding: 0 100px;
    }
    @media (max-width: 768px) {
      padding: 0 50px;
    }
    @media (max-width: 480px) {
      padding: 0 25px;
    }

    &.fillHeight {
      padding: 0 150px;

      @media (max-width: 1080px) {
        padding: 0 100px;
      }
      @media (max-width: 768px) {
        padding: 0 50px;
      }
      @media (max-width: 480px) {
        padding: 0 25px;
      }
    }
  }

  section {
    margin: 0 auto;
    padding: 100px 0;
    max-width: 1000px;

    @media (max-width: 768px) {
      padding: 80px 0;
    }

    @media (max-width: 480px) {
      padding: 60px 0;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 0 10px 0;
    font-weight: 600;
    color: #ccd6f6;
    line-height: 1.1;
  }

  .big-heading {
    margin: 0;
    font-size: clamp(40px, 8vw, 80px);
  }

  .medium-heading {
    margin: 0;
    font-size: clamp(40px, 8vw, 60px);
  }

  .numbered-heading {
    display: flex;
    align-items: center;
    position: relative;
    margin: 10px 0 40px;
    width: 100%;
    font-size: clamp(26px, 5vw, 32px);
    white-space: nowrap;

    &:before {
      position: relative;
      bottom: 4px;
      counter-increment: section;
      content: '0' counter(section) '.';
      margin-right: 10px;
      color: #64ffda;
      font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
      font-size: clamp(16px, 3vw, 20px);
      font-weight: 400;

      @media (max-width: 480px) {
        margin-bottom: -3px;
        margin-right: 5px;
      }
    }

    &:after {
      content: '';
      display: block;
      position: relative;
      top: -5px;
      width: 300px;
      height: 1px;
      margin-left: 20px;
      background-color: #233554;

      @media (max-width: 1080px) {
        width: 200px;
      }
      @media (max-width: 768px) {
        width: 100%;
      }
      @media (max-width: 600px) {
        margin-left: 10px;
      }
    }
  }

  img,
  svg,
  .gatsby-image-wrapper {
    width: 100%;
    max-width: 100%;
    vertical-align: middle;
  }

  img[alt=""],
  img:not([alt]) {
    filter: blur(5px);
  }

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    vertical-align: middle;

    &.feather {
      fill: none;
    }
  }

  a {
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: inherit;
    position: relative;
    transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    &:hover,
    &:focus {
      color: #64ffda;
    }

    &.inline-link {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  button {
    cursor: pointer;
    border: 0;
    border-radius: 0;
  }

  input, textarea {
    border-radius: 0;
    outline: 0;

    &:focus {
      outline: 0;
    }
    &:focus,
    &:active {
      &::placeholder {
        opacity: 0.5;
      }
    }
  }

  p {
    margin: 0 0 15px 0;

    &:last-child,
    &:last-of-type {
      margin: 0;
    }

    & > a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    & > code {
      background-color: #112240;
      color: #e6f1ff;
      font-size: 0.85em;
      border-radius: 3px;
      padding: 0.3em 0.5em;
    }
  }

  ul {
    &.fancy-list {
      padding: 0;
      margin: 0;
      list-style: none;
      font-size: 18px;
      li {
        position: relative;
        padding-left: 30px;
        margin-bottom: 10px;
        &:before {
          content: '▹';
          position: absolute;
          left: 0;
          color: #64ffda;
          line-height: 18px;
        }
      }
    }
  }

  blockquote {
    border-left: 5px solid #64ffda;
    padding-left: 30px;
    margin: 0 0 30px;
    font-style: italic;
    font-size: 24px;
    color: #ccd6f6;
  }

  hr {
    background-color: #233554;
    height: 1px;
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    margin: 1rem;
  }

  code {
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
    font-size: 0.85em;
  }

  .sr-only {
    border: 0 !important;
    clip: rect(1px, 1px, 1px, 1px) !important;
    -webkit-clip-path: inset(50%) !important;
    clip-path: inset(50%) !important;
    height: 1px !important;
    margin: -1px !important;
    overflow: hidden !important;
    padding: 0 !important;
    position: absolute !important;
    width: 1px !important;
    white-space: nowrap !important;
  }

  .skip-to-content {
    ${({ theme }) => theme.mixins.button};
    position: absolute;
    top: auto;
    left: -999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    z-index: -99;

    &:hover,
    &:focus {
      background-color: #64ffda;
      color: #0a192f;
      top: 0;
      left: 0;
      width: auto;
      height: auto;
      overflow: auto;
      z-index: 99;
    }
  }

  #logo {
    color: #64ffda;
  }

  .overline {
    color: #64ffda;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
    font-size: 16px;
    font-weight: 400;
  }

  .subtitle {
    color: #64ffda;
    margin: 0 0 20px 0;
    font-size: 16px;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
    font-weight: 400;
    line-height: 1.5;
    @media (max-width: 1080px) {
      font-size: 14px;
    }
    @media (max-width: 768px) {
      font-size: 13px;
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      line-height: 1.5;
    }
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    color: #64ffda;

    .arrow {
      display: block;
      margin-right: 10px;
      padding-top: 4px;
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
      font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.5;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  }

  .gatsby-image-outer-wrapper {
    height: 100%;
  }
`;

const theme = {
  colors: {
    darkNavy: '#020c1b',
    navy: '#0a192f',
    lightNavy: '#112240',
    lightestNavy: '#233554',
    navyShadow: 'rgba(2, 12, 27, 0.7)',
    darkGrey: '#333f58',
    slate: '#8892b0',
    lightSlate: '#a8b2d1',
    lightestSlate: '#ccd6f6',
    white: '#e6f1ff',
    green: '#64ffda',
    transGreen: 'rgba(100, 255, 218, 0.07)',
    highlight: 'rgba(41, 61, 90, 0.99)',
    transNavy: 'rgba(10, 25, 47, 0.85)',
  },

  fonts: {
    Calibre: 'Calibre, Inter, San Francisco, SF Pro Text, -apple-system, system-ui, sans-serif',
    SFMono: 'SF Mono, Fira Code, Fira Mono, Roboto Mono, monospace',
  },

  fontSizes: {
    xsmall: '12px',
    small: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '20px',
    xxlarge: '22px',
    h3: '32px',
  },

  easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  transition: 'all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)',

  borderRadius: '4px',
  navHeight: '100px',
  navScrollHeight: '70px',
  margin: '20px',

  tabHeight: 42,
  tabWidth: 120,
  radius: 3,

  hamburgerWidth: 30,
  hamBefore: `top 0.1s ease-in 0.25s, opacity 0.1s ease-in`,
  hamBeforeActive: `top 0.1s ease-out, opacity 0.1s ease-out 0.12s`,
  hamAfter: `bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19)`,
  hamAfterActive: `bottom 0.1s ease-out, transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s`,

  mixins: {
    flexCenter: `
      display: flex;
      justify-content: center;
      align-items: center;
    `,

    flexBetween: `
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,

    link: `
      color: var(--green);
      text-decoration: none;
      text-decoration-skip-ink: auto;
      position: relative;
      transition: var(--transition);
      &:hover,
      &:focus,
      &:active {
        color: var(--green);
        outline: 0;
      }
    `,

    inlineLink: `
      position: relative;
      color: #64ffda;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      &:hover,
      &:focus,
      &:active {
        color: #64ffda;
        outline: 0;
        &:after {
          width: 100%;
        }
        & > * {
          color: #64ffda !important;
          transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
      &:after {
        display: block;
        width: 0;
        height: 1px;
        position: relative;
        bottom: 0.37em;
        background-color: #64ffda;
        transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        opacity: 0.5;
      }
    `,

    button: `
      color: #64ffda;
      background-color: transparent;
      border: 1px solid #64ffda;
      border-radius: 4px;
      padding: 1.25rem 1.75rem;
      font-size: 14px;
      font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
      line-height: 1;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      &:hover,
      &:focus,
      &:active {
        background-color: rgba(100, 255, 218, 0.1);
        transform: translate3d(0, -2px, 0);
      }
      &:after {
        display: none !important;
      }
    `,

    smallButton: `
      color: #64ffda;
      background-color: transparent;
      border: 1px solid #64ffda;
      border-radius: 4px;
      padding: 0.75rem 1rem;
      font-size: 13px;
      font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
      line-height: 1;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      &:hover,
      &:focus,
      &:active {
        background-color: rgba(100, 255, 218, 0.1);
        transform: translate3d(0, -2px, 0);
      }
      &:after {
        display: none !important;
      }
    `,

    bigButton: `
      color: #64ffda;
      background-color: transparent;
      border: 1px solid #64ffda;
      border-radius: 4px;
      padding: 1.25rem 1.75rem;
      font-size: 14px;
      font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
      line-height: 1;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      &:hover,
      &:focus,
      &:active {
        background-color: rgba(100, 255, 218, 0.1);
        transform: translate3d(0, -2px, 0);
      }
      &:after {
        display: none !important;
      }
    `,

    boxShadow: `
      box-shadow: 0 10px 30px -15px rgba(2, 12, 27, 0.7);
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

      &:hover,
      &:focus {
        box-shadow: 0 20px 30px -15px rgba(2, 12, 27, 0.7);
      }
    `,

    fancyList: `
      padding: 0;
      margin: 0;
      list-style: none;
      font-size: 18px;
      li {
        position: relative;
        padding-left: 30px;
        margin-bottom: 10px;
        &:before {
          content: '▹';
          position: absolute;
          left: 0;
          color: #64ffda;
          line-height: 18px;
        }
      }
    `,
  },
};

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
