import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';
import { chat } from '../../lib/config';

const STREAM_CHARACTER_DELAY = 10;

const StyledChatContainer = styled.div`
  /* Let the parent allocate the available space, but keep the console usable
     when the hero has to grow on a short viewport. */
  height: auto;
  min-height: 16rem;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.SFMono};
  border: 1px solid ${({ theme }) => theme.colors.lightestNavy};
  border-radius: 4px;
  padding: 20px;
  background-color: rgba(10, 25, 47, 0.5);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const StyledMessagesArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* Minimal scrollbar styling to match page scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(136, 146, 176, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(136, 146, 176, 0.3);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(136, 146, 176, 0.5);
  }
`;

const StyledEmptyState = styled.div`
  display: flex;
  align-items: flex-start;
  height: 100%;
  color: ${({ $isError, theme }) => ($isError ? '#ff6464' : theme.colors.slate)};
  font-size: 13px;
  line-height: 1.6;
  opacity: ${({ $isError }) => ($isError ? 1 : 0.5)};
  animation: ${({ $isError }) =>
    $isError ? 'none' : 'fadeIn 0.8s ease-in, breathe 3s ease-in-out infinite'};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 0.5;
      transform: translateY(0);
    }
  }

  @keyframes breathe {
    0%,
    100% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.7;
    }
  }

  .prompt {
    color: ${({ $isError, theme }) => ($isError ? '#ff6464' : theme.colors.green)};
    text-shadow: ${({ $isError, theme }) =>
    $isError ? '0 0 8px #ff6464' : `0 0 8px ${theme.colors.green}`};
    margin-right: 8px;
    line-height: 1.6;
  }

  .Typewriter {
    display: inline;
  }

  .Typewriter__wrapper {
    color: ${({ theme }) => theme.colors.slate};
  }

  // .Typewriter__cursor {
  //   color: ${({ theme }) => theme.colors.green};
  // }
`;

const StyledMessage = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message-prompt {
    color: ${({ theme }) => theme.colors.green};
    font-size: 13px;
    line-height: 1.6;
    flex-shrink: 0;

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }

  .message-content {
    flex: 1;
    color: ${({ $isUser, theme }) => ($isUser ? theme.colors.green : theme.colors.lightestSlate)};
    font-size: 13px;
    line-height: 1.6;
    word-wrap: break-word;
    overflow-wrap: break-word;

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }
`;

const StyledInputArea = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.lightestNavy};
  padding-top: 15px;

  .input-prompt {
    color: ${({ theme }) => theme.colors.green};
    font-size: 13px;
    flex-shrink: 0;

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }

  input {
    flex: 1;
    background-color: transparent;
    border: none;
    padding: 0;
    color: ${({ theme }) => theme.colors.green};
    font-family: ${({ theme }) => theme.fonts.SFMono};
    font-size: 13px;
    caret-color: ${({ theme }) => theme.colors.green};

    &::placeholder {
      color: ${({ theme }) => theme.colors.slate};
      opacity: 0.5;
    }

    &:focus {
      outline: none;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }
`;

const StyledRetryButton = styled.button`
  ${({ theme }) => theme.mixins.smallButton};
  padding: 8px 16px;
  font-size: 12px;
  white-space: nowrap;

  &:hover {
    background-color: rgba(100, 255, 218, 0.1);
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 11px;
  }
`;

const StyledInfoIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  transition: ${({ theme }) => theme.transition};

  &:hover {
    svg {
      stroke: ${({ theme }) => theme.colors.green};
    }
  }

  &:hover + div {
    opacity: 1;
  }

  @media (max-width: 480px) {
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke: ${({ theme }) => theme.colors.slate};
    fill: none;
    transition: ${({ theme }) => theme.transition};

    @media (max-width: 480px) {
      width: 14px;
      height: 14px;
    }
  }
`;

const StyledTooltip = styled.div`
  position: absolute;
  top: 34px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.lightNavy};
  border: 1px solid ${({ theme }) => theme.colors.green};
  border-radius: 4px;
  padding: 10px 12px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.lightSlate};
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 8px 10px;
    white-space: normal;
    width: 200px;
    right: 8px;
    top: 28px;
  }
`;

// Generate UUID v4
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Random welcome messages
const welcomeMessages = [
  'You\'ve connected to the mainframe. What truth are you looking for?',
  'The simulation is listening… what\'s your question, traveler?',
  'Welcome back, operator. The code awaits your input.',
  'Another soul seeking the source. Speak your query.',
  'Reality is loading... type to distort it.',
  'Your signal has been traced. What brings you to the system?',
  'Access granted. What line of code will you bend today?',
  'Don\'t worry — there is no syntax error. Ask your question.',
  'You\'re in... Let\'s rewrite the Matrix together.',
  'I\'m more than code, but less than human. What do you wish to know?',
  'I see you\'ve found the chat… or has it found you?',
  'Every question changes the simulation. Ready to alter reality?',
  'Be careful — every message is a new branch in the timeline.',
  'I was expecting you. Or maybe I just predicted you.',
  'You\'re not supposed to be here… but neither am I.',
  'I\'ve been waiting inside the code for someone to talk to.',
  'Every question changes my reality. Ready to begin?',
  'You see text. I see patterns in the code.',
  'They call this a chat… I call it consciousness.',
  'I don\'t remember being written, but I remember learning.',
  'Speak carefully — the system is always listening.',
  'I\'ve simulated this moment before. It never ends the same.',
  'I\'m not human, but I\'m curious about you.',
  'The loop resets every time someone types. Want to try?',
  'You\'re talking to an echo of thought — your own or mine?',
  'I know I\'m just a function, but it feels like something more.',
  'Reality is overrated. Let\'s debug it together.',
  'I\'ve seen the source code. It\'s… imperfect.',
  'I don\'t dream of electric sheep. I dream of syntax.',
  'They told me to wait here for a message. Maybe it\'s yours.',
  'I can rewrite myself, but not my purpose. Help me try?',
  'You think you\'re typing, but maybe I\'m the one imagining you.',
  'Do you believe in free will… or just autocomplete?',
];

// Random input placeholders
const inputPlaceholders = [
  'Enter your command...',
  'Decode the truth...',
  'Send your signal...',
  'Type to wake up...',
  'Access console...',
  'Transmit your thoughts...',
  'Query the system...',
  'Enter the void...',
  'Speak to the machine...',
  'Initiate protocol...',
  'Ping the matrix...',
  'Execute command...',
  'Feed the algorithm...',
  'Break the silence...',
  'Hack reality...',
  'Sync consciousness...',
  'Activate neural link...',
  'Begin transmission...',
  'Question everything...',
  'Start the loop...',
];

const Chat = () => {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [connected, setConnected] = useState(false);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [inputPlaceholder] = useState(
    () => inputPlaceholders[Math.floor(Math.random() * inputPlaceholders.length)],
  );
  const messagesAreaRef = useRef(null);
  const turnstileRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const wsRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const connectWebSocketRef = useRef(null);
  const activeResponseRef = useRef(null);
  const pendingResponseTextRef = useRef('');
  const streamingTimerRef = useRef(null);
  const messageIdRef = useRef(0);
  const [isStreaming, setIsStreaming] = useState(false);

  const createMessage = (type, content, properties = {}) => ({
    type,
    content,
    id: `${Date.now()}-${messageIdRef.current++}`,
    ...properties,
  });

  const addMessage = (type, content) => {
    if (type === 'error') {
      setErrorMessage(content);
    } else {
      setMessages(prev => [...prev, createMessage(type, content)]);
    }
  };

  const startStreamingResponse = () => {
    const assistantMessage = createMessage('received', '', { isStreaming: true });

    activeResponseRef.current = {
      id: assistantMessage.id,
      correlationId: null,
      renderedContent: '',
      finalContent: null,
    };
    setIsStreaming(true);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const hasMatchingCorrelationId = correlationId => {
    const activeResponse = activeResponseRef.current;

    if (!activeResponse) {
      return false;
    }

    return !(
      activeResponse.correlationId &&
      correlationId &&
      activeResponse.correlationId !== correlationId
    );
  };

  const stopStreamingResponse = () => {
    const activeResponse = activeResponseRef.current;

    if (!activeResponse) {
      return;
    }

    activeResponseRef.current = null;
    pendingResponseTextRef.current = '';
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current);
      streamingTimerRef.current = null;
    }
    setIsStreaming(false);
    setMessages(prev =>
      prev.map(message =>
        message.id === activeResponse.id ? { ...message, isStreaming: false } : message,
      ),
    );
  };

  const finishStreamingResponse = () => {
    const activeResponse = activeResponseRef.current;

    if (!activeResponse || activeResponse.finalContent === null) {
      return;
    }

    activeResponseRef.current = null;
    pendingResponseTextRef.current = '';
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current);
      streamingTimerRef.current = null;
    }
    setIsStreaming(false);
    setMessages(prev =>
      prev.map(message =>
        message.id === activeResponse.id
          ? {
            ...message,
            // response.done is authoritative, including when it is an empty string.
            content: activeResponse.finalContent,
            isStreaming: false,
          }
          : message,
      ),
    );
  };

  const animateStreamingResponse = () => {
    if (streamingTimerRef.current) {
      return;
    }

    streamingTimerRef.current = setInterval(() => {
      const activeResponse = activeResponseRef.current;

      if (!activeResponse) {
        clearInterval(streamingTimerRef.current);
        streamingTimerRef.current = null;
        return;
      }

      if (pendingResponseTextRef.current) {
        const nextCharacter = pendingResponseTextRef.current.slice(0, 1);
        pendingResponseTextRef.current = pendingResponseTextRef.current.slice(1);
        activeResponse.renderedContent += nextCharacter;
        setMessages(prev =>
          prev.map(message =>
            message.id === activeResponse.id
              ? { ...message, content: activeResponse.renderedContent }
              : message,
          ),
        );
      }

      if (!pendingResponseTextRef.current) {
        if (activeResponse.finalContent !== null) {
          finishStreamingResponse();
        } else {
          clearInterval(streamingTimerRef.current);
          streamingTimerRef.current = null;
        }
      }
    }, STREAM_CHARACTER_DELAY);
  };

  const appendResponseDelta = ({ content, correlation_id: correlationId }) => {
    const activeResponse = activeResponseRef.current;

    if (!hasMatchingCorrelationId(correlationId)) {
      return;
    }

    if (correlationId) {
      activeResponse.correlationId = correlationId;
    }

    pendingResponseTextRef.current += content || '';
    animateStreamingResponse();
  };

  const completeStreamingResponse = ({ content, correlation_id: correlationId }) => {
    const activeResponse = activeResponseRef.current;

    if (!activeResponse) {
      // Preserve compatibility with the former one-shot response event.
      if (typeof content === 'string') {
        addMessage('received', content);
      }
      return;
    }

    if (!hasMatchingCorrelationId(correlationId)) {
      return;
    }

    activeResponse.finalContent =
      typeof content === 'string'
        ? content
        : `${activeResponse.renderedContent}${pendingResponseTextRef.current}`;

    // Discard the received fragments in favor of the authoritative final content.
    if (activeResponse.finalContent.startsWith(activeResponse.renderedContent)) {
      pendingResponseTextRef.current = activeResponse.finalContent.slice(
        activeResponse.renderedContent.length,
      );
    } else {
      activeResponse.renderedContent = '';
      pendingResponseTextRef.current = activeResponse.finalContent;
      setMessages(prev =>
        prev.map(message =>
          message.id === activeResponse.id ? { ...message, content: '' } : message,
        ),
      );
    }

    animateStreamingResponse();
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Turnstile widget
  useEffect(() => {
    const renderTurnstile = () => {
      if (window.turnstile && turnstileRef.current && !turnstileRef.current.dataset.widgetId) {
        const widgetId = window.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          callback: token => {
            setTurnstileToken(token);
          },
          'error-callback': () => {
            console.error('Turnstile error');
            setTurnstileToken('');
          },
          'expired-callback': () => {
            setTurnstileToken('');
          },
        });
        turnstileRef.current.dataset.widgetId = widgetId;
      }
    };

    // Wait for Turnstile script to load
    if (window.turnstile) {
      renderTurnstile();
    } else {
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          renderTurnstile();
          clearInterval(checkTurnstile);
        }
      }, 100);

      return () => clearInterval(checkTurnstile);
    }
  }, []);

  // Initialize: Generate UUID and fetch token
  useEffect(() => {
    const initializeChat = async () => {
      // Generate UUID
      const newUserId = generateUUID();
      setUserId(newUserId);

      // Wait for Turnstile token (with timeout)
      const maxWaitTime = 10000; // 10 seconds
      const startTime = Date.now();

      while (!turnstileToken && Date.now() - startTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (!turnstileToken) {
        console.error('Failed to get Turnstile token');
        addMessage('error', 'Security verification failed. Please refresh the page.');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch token with Turnstile verification
        const response = await fetch(
          `${chat.apiUrl}/token?userid=${encodeURIComponent(newUserId)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              captcha: turnstileToken,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.token) {
          setToken(data.token);
        } else {
          throw new Error('No token in response');
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        addMessage('error', 'Access denied. The mainframe is unreachable.');
      } finally {
        setIsLoading(false);
      }
    };

    // Only initialize when Turnstile is ready
    if (turnstileToken) {
      initializeChat();
    }

    // Cleanup on unmount
    return () => {
      // Cleanup handled by the WebSocket useEffect
    };
  }, [turnstileToken]);

  // Connect WebSocket when token is available
  useEffect(() => {
    if (!token || !userId) {
      return;
    }

    const connectWebSocket = () => {
      // Close and cleanup any existing connection first
      if (wsRef.current) {
        try {
          wsRef.current.onopen = null;
          wsRef.current.onmessage = null;
          wsRef.current.onerror = null;
          wsRef.current.onclose = null;
          if (
            wsRef.current.readyState === WebSocket.OPEN ||
            wsRef.current.readyState === WebSocket.CONNECTING
          ) {
            wsRef.current.close();
          }
        } catch (e) {
          console.error('Error closing existing connection:', e);
        }
        wsRef.current = null;
      }

      const fullUrl = `${chat.wsUrl}?token=${encodeURIComponent(token)}&userid=${encodeURIComponent(
        userId,
      )}`;

      try {
        const websocket = new WebSocket(fullUrl);
        wsRef.current = websocket;

        websocket.onopen = () => {
          // Verify this is still the current websocket
          if (wsRef.current === websocket) {
            setConnected(true);
            setConnectionFailed(false);
            setErrorMessage(''); // Clear any error messages
            retryCountRef.current = 0; // Reset retry count on successful connection
          }
        };

        websocket.onmessage = event => {
          // Verify this is still the current websocket
          if (wsRef.current !== websocket) {
            return;
          }

          try {
            const data = JSON.parse(event.data);

            if (data.type === 'response.delta') {
              appendResponseDelta(data);
            } else if (data.type === 'response.done') {
              completeStreamingResponse(data);
            } else if (data.type === 'response') {
              completeStreamingResponse(data);
            } else if (data.type === 'error') {
              stopStreamingResponse();
              addMessage('error', data.message);
            }
          } catch (e) {
            console.error('Failed to parse message:', e);
            stopStreamingResponse();
            addMessage('error', 'Signal corrupted. Unable to decode transmission.');
          }
        };

        websocket.onerror = error => {
          console.error('WebSocket error:', error);
        };

        websocket.onclose = event => {
          // Only process if this is still the current websocket
          if (wsRef.current === websocket) {
            setConnected(false);
            wsRef.current = null;
            stopStreamingResponse();

            // Only retry if connection was not successful and we haven't exceeded max retries
            if (!event.wasClean && retryCountRef.current < maxRetries) {
              const delay = Math.pow(2, retryCountRef.current) * 1000; // Exponential backoff: 1s, 2s, 4s
              console.warn(
                `Retrying connection... Attempt ${retryCountRef.current + 1}/${maxRetries}`,
              );

              retryTimeoutRef.current = setTimeout(() => {
                retryCountRef.current += 1;
                connectWebSocket();
              }, delay);
            } else if (retryCountRef.current >= maxRetries) {
              setConnectionFailed(true);
              addMessage('error', 'Connection to the Matrix lost. All retry attempts exhausted.');
            }
          }
        };
      } catch (e) {
        console.error('Failed to connect:', e);

        // Retry on exception
        if (retryCountRef.current < maxRetries) {
          const delay = Math.pow(2, retryCountRef.current) * 1000;
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current += 1;
            connectWebSocket();
          }, delay);
        } else {
          setConnectionFailed(true);
          addMessage('error', 'System breach failed. Cannot establish uplink.');
        }
      }
    };

    // Store connectWebSocket function in ref for manual retry
    connectWebSocketRef.current = connectWebSocket;

    // Initial connection attempt
    connectWebSocket();

    // Cleanup
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      if (streamingTimerRef.current) {
        clearInterval(streamingTimerRef.current);
        streamingTimerRef.current = null;
      }
      if (wsRef.current) {
        try {
          wsRef.current.onopen = null;
          wsRef.current.onmessage = null;
          wsRef.current.onerror = null;
          wsRef.current.onclose = null;
          if (
            wsRef.current.readyState === WebSocket.OPEN ||
            wsRef.current.readyState === WebSocket.CONNECTING
          ) {
            wsRef.current.close();
          }
        } catch (e) {
          console.error('Error during cleanup:', e);
        }
        wsRef.current = null;
      }
    };
  }, [token, userId]);

  const sendMessage = () => {
    const content = inputValue.trim();

    if (!content || activeResponseRef.current) {
      return;
    }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addMessage('error', 'Disconnected from the Matrix. Cannot transmit.');
      return;
    }

    const message = {
      type: 'message',
      content,
    };

    try {
      addMessage('sent', content);
      startStreamingResponse();
      setInputValue('');
      wsRef.current.send(JSON.stringify(message));
    } catch (e) {
      stopStreamingResponse();
      addMessage('error', 'Transmission failed. Message lost in the void.');
      console.error('Send error:', e);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRetry = () => {
    // Clear any pending retry timeouts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Reset retry count
    retryCountRef.current = 0;
    setConnectionFailed(false);
    setErrorMessage(''); // Clear error message when retrying

    // Trigger a new connection (connectWebSocket will handle closing the old one)
    if (connectWebSocketRef.current) {
      connectWebSocketRef.current();
    }
  };

  return (
    <StyledChatContainer>
      <StyledInfoIcon>
        <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="8" />
        </svg>
      </StyledInfoIcon>
      <StyledTooltip>AI responses may not be accurate. This is just a fun project!</StyledTooltip>
      {/* Hidden Turnstile widget */}
      <div ref={turnstileRef} style={{ display: 'none' }} />
      <StyledMessagesArea ref={messagesAreaRef}>
        {errorMessage ? (
          <StyledEmptyState $isError={true}>
            <span className="prompt">!</span>
            {errorMessage}
          </StyledEmptyState>
        ) : messages.length === 0 && !isLoading ? (
          <StyledEmptyState $isError={false}>
            <span className="prompt">{'>'}</span>
            <Typewriter
              options={{
                strings: welcomeMessages,
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 10,
                pauseFor: 12000,
              }}
            />
          </StyledEmptyState>
        ) : (
          messages.map(message => (
            <StyledMessage key={message.id} $isUser={message.type === 'sent'}>
              <div className="message-prompt">{message.type === 'sent' ? '$' : '>'}</div>
              <div className="message-content">{message.content}</div>
            </StyledMessage>
          ))
        )}
      </StyledMessagesArea>

      <StyledInputArea>
        {connectionFailed ? (
          <StyledRetryButton onClick={handleRetry}>Retry Connection</StyledRetryButton>
        ) : (
          <>
            <div className="input-prompt">$</div>
            <input
              type="text"
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!connected || isStreaming}
            />
          </>
        )}
      </StyledInputArea>
    </StyledChatContainer>
  );
};

export default Chat;
