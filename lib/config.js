module.exports = {
  email: 'sahin@sahinakkaya.dev',

  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/sahinakkaya',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/sahinakkaya',
    },
    {
      name: 'Stackoverflow',
      url: 'https://stackoverflow.com/users/9608759',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/sahinakkayadev',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Work',
      url: '/#projects',
    },
    {
      name: 'Blog',
      url: 'https://blog.sahinakkaya.dev',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  colors: {
    green: '#64ffda',
    navy: '#0a192f',
    darkNavy: '#020c1b',
  },

  srConfig: (delay = 200, viewFactor = 0.25) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),

  // Chat configuration
  chat: {
    apiUrl: process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000',
    wsUrl: process.env.NEXT_PUBLIC_CHAT_WS_URL || 'ws://localhost:8000/ws',
  },
};
