import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import SEOHead from './head';
import Loader from './loader';
import Nav from './nav';
import Social from './social';
import Email from './email';
import Footer from './footer';

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout = ({ children }) => {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const [isLoading, setIsLoading] = useState(isHome);
  const visitChecked = useRef(false);

  // Only show the loader animation on the very first visit
  useEffect(() => {
    if (!isHome || visitChecked.current) return;
    visitChecked.current = true;
    if (localStorage.getItem('hasVisited')) {
      setIsLoading(false);
    } else {
      localStorage.setItem('hasVisited', '1');
    }
  }, []);


  const handleExternalLinks = () => {
    const allLinks = Array.from(document.querySelectorAll('a'));
    if (allLinks.length > 0) {
      allLinks.forEach(link => {
        if (link.host !== window.location.host) {
          link.setAttribute('rel', 'noopener noreferrer');
          link.setAttribute('target', '_blank');
        }
      });
    }
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (router.asPath.includes('#')) {
      const id = router.asPath.split('#')[1];
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    handleExternalLinks();
  }, [isLoading, router.asPath]);

  return (
    <>
      <SEOHead />

      <div id="root">
        <a className="skip-to-content" href="#content">
          Skip to Content
        </a>

        {isLoading && isHome ? (
          <Loader finishLoading={() => setIsLoading(false)} />
        ) : (
          <StyledContent>
            <Nav isHome={isHome} />
            <Social isHome={isHome} />
            <Email isHome={isHome} />

            <div id="content">
              {children}
            </div>
            <Footer />
          </StyledContent>
        )}
      </div>
    </>
  );
};

export default Layout;
