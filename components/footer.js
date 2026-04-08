import React from 'react';
import styled from 'styled-components';
import { socialMedia } from '../lib/config';
import { Icon } from './icons';

const StyledFooter = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 15px;
  text-align: center;

  a {
    color: var(--light-slate);
    transition: var(--transition);

    &:hover,
    &:focus {
      color: var(--green);
    }
  }
`;

const StyledSocialLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;

  a {
    padding: 8px;

    &:hover,
    &:focus {
      transform: translateY(-3px);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const StyledMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: var(--fz-xxs);
  font-family: var(--font-mono);
  color: var(--slate);

  .divider {
    opacity: 0.4;
  }

  .status-dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: var(--green);
    margin-right: 5px;
    vertical-align: middle;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

const Footer = () => (
  <StyledFooter>
    <StyledSocialLinks>
      {socialMedia.map(({ url, name }, i) => (
        <li key={i}>
          <a href={url} aria-label={name} target="_blank" rel="noreferrer">
            <Icon name={name} />
          </a>
        </li>
      ))}
    </StyledSocialLinks>

    <StyledMeta>
      <span>© {new Date().getFullYear()} Şahin Akkaya</span>
      <span className="divider">·</span>
      <a href="https://uptime.sahinakkaya.dev/status/sahinakkayadev" aria-label="Uptime Status Page">
        <span className="status-dot" aria-hidden="true" />
        Status
      </a>
    </StyledMeta>
  </StyledFooter>
);

export default Footer;
