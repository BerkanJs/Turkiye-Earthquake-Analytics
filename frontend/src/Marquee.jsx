import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Marquee() {
  const text = (
    <>
      Hazırlayan: Berkan Özçelik - Data Kandilli Rasathanesi'nden scrape edilmiştir -{' '}
      <a
        href="https://github.com/BerkanJs"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#63b3ed', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center' }}
      >
        https://github.com/BerkanJs
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="18"
          height="18"
          style={{ marginLeft: 6 }}
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.44c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.32 3.52 1 .11-.78.42-1.32.76-1.62-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.5.12-3.13 0 0 1-.32 3.3 1.23a11.48 11.48 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.63.24 2.83.12 3.13.78.85 1.24 1.93 1.24 3.25 0 4.63-2.81 5.66-5.49 5.95.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.82.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      </a>{' '}
    </>
  );

  const containerRef = useRef(null);
  const controls = useAnimation();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      // Metnin toplam genişliği
      setWidth(containerRef.current.offsetWidth);
    }
  }, [text]);

  useEffect(() => {
    if (width === 0) return;

    controls.start({
      x: [-width / 3, 0], 
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          duration: 30, 
        },
      },
    });
  }, [controls, width]);

  return (
    <div
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        backgroundColor: '#1a202c',
        color: '#cbd5e0',
        fontWeight: '600',
        padding: '6px 10px',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        fontSize: '14px',
      }}
    >
      <motion.div
        ref={containerRef}
        style={{ display: 'inline-flex' }}
        animate={controls}
      >
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            style={{
              paddingRight: '100px', 
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
