import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typewriter from 'typewriter-effect';
import styled from 'styled-components';

const StyledLoader = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark-navy);
  z-index: 99;
  transition: opacity 0.5s ease;
  opacity: ${({ $isHiding }) => ($isHiding ? 0 : 1)};

  .terminal {
    display: flex;
    align-items: center;
    font-family: var(--font-mono);
    font-size: clamp(28px, 6vw, 48px);
    letter-spacing: 0.05em;
    opacity: ${({ $isMounted }) => ($isMounted ? 1 : 0)};
    transition: opacity 0.2s ease;
  }

  .prompt {
    color: var(--slate);
    margin-right: 0.4em;
    user-select: none;
  }

  .Typewriter__wrapper {
    color: var(--green);
  }

  .Typewriter__cursor {
    color: var(--green);
  }
`;

const Loader = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  const handleInit = typewriter => {
    typewriter
      .typeString('Hi there!')
      .callFunction(() => {
        if (typeof document !== 'undefined') {
          document.body.classList.remove('hidden');
        }
        setTimeout(() => {
          setIsHiding(true);
          setTimeout(finishLoading, 500);
        }, 900);
      })
      .start();
  };

  return (
    <StyledLoader className="loader" $isMounted={isMounted} $isHiding={isHiding}>
      <div className="terminal">
        <span className="prompt">&gt;</span>
        <Typewriter onInit={handleInit} options={{ delay: 80, cursor: '▋' }} />
      </div>
    </StyledLoader>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
