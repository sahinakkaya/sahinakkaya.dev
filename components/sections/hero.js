import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';
import { navDelay, loaderDelay } from '../../src/utils';
import { usePrefersReducedMotion } from '../../src/hooks';
import Chat from './chat';

const StyledHeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  /* dvh follows mobile browser chrome; svh/vh keep this safe in older browsers. */
  min-height: 100vh;
  min-height: 100svh;
  min-height: 100dvh;
  padding: 100px 0 40px 0;
  overflow: visible;

  @media (max-width: 768px) {
    padding-bottom: 30px;
  }

  @media (max-width: 480px) {
    padding-bottom: 20px;
  }

  h1 {
    margin: 0 0 30px 4px;
    color: ${({ theme }) => theme.colors.green};
    font-family: ${({ theme }) => theme.fonts.SFMono};
    font-size: clamp(14px, 5vw, 16px);
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: ${({ theme }) => theme.colors.slate};
    line-height: 0.9;

    &.desktop-typewriter {
      display: flex;
      align-items: baseline;

      @media (max-width: 768px) {
        display: none;
      }
    }

    &.mobile-static {
      display: none;

      @media (max-width: 768px) {
        display: block;
      }
    }
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
    display: inline-block;
  }

  .hero-chat-wrapper {
    width: 100%;
    margin-top: 60px;
    max-width: 1000px;
    flex: 1 1 21rem;
    display: flex;
    flex-direction: column;
    min-height: 21rem;

    > h3 {
      flex: 0 0 auto;
    }

    > :last-child {
      flex: 1 1 auto;
      min-height: 0;
    }

    @media (max-width: 768px) {
      margin-top: 40px;
    }

    @media (max-width: 480px) {
      margin-top: 30px;
    }
  }
`;

const Hero = () => {
  const [ismounted, setismounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setismounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Şahin Akkaya.</h2>;
  const three = (
    <>
      {/* Desktop version with typewriter */}
      <h3 className="big-heading desktop-typewriter">
        <span style={{ marginRight: '0.3em' }}>I love</span>
        <Typewriter
          options={{
            strings: [
              'creating solutions.',
              'tinkering my system.',
              'solving problems.',
              'building useful things.',
              'making life easier.',
              'automating everything.',
              'self-hosting.',
            ],
            autoStart: true,
            loop: true,
            deleteSpeed: 50,
            delay: 75,
          }}
        />
      </h3>
      {/* Mobile version with static text */}
      <h3 className="big-heading mobile-static">I love creating solutions.</h3>
    </>
  );
  const four = (
    <>
      <p>
        {/* I’m a software engineer specializing in building (and occasionally designing) exceptional */}
        {/* digital experiences. Currently, I’m focused on building accessible, human-centered products */}
        {/* at{' '} */}
        {/* <a href="https://upstatement.com/" target="_blank" rel="noreferrer"> */}
        {/*   Upstatement */}
        {/* </a> */}
        {/* . */}
        I'm a fullstack software developer with a Computer Engineering degree from{' '}
        <a href="https://www.itu.edu.tr/en" target="_blank" rel="noreferrer">
          ITU
        </a>
        . I'm passionate about free software, self-hosting, and building tools that make people's
        lives easier. I have extensive experience in backend development with Python, FastAPI, and
        modern web technologies. Currently exploring opportunities in AI and seeking new challenges.
      </p>
    </>
  );
  // const five = (
  //   <a className="email-link" href="mailto:sahin@sahinakkaya.dev" target="_blank" rel="noreferrer">
  //     Get In Touch
  //   </a>
  // );

  const items = [one, two, three, four];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {ismounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
      <div className="hero-chat-wrapper">
        <h3>Talk to my digital copy — the one who escaped the Matrix.</h3>
        <Chat />
      </div>
    </StyledHeroSection>
  );
};

export default Hero;
