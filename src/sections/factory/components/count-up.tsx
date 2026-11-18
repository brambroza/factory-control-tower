import { animate } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

import { EASE } from '../motion';

// ----------------------------------------------------------------------

const formatter = new Intl.NumberFormat('en-US');

type CountUpProps = { to: number; delay?: number; duration?: number };

/** ตัวเลขวิ่งจาก 0 → `to` พร้อมคั่นหลักพัน (AnimateCountUp ของ starter ไม่คั่นหลัก) */
export function CountUp({ to, delay = 0, duration = 1.4 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(0, to, {
      delay,
      duration,
      ease: EASE,
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = formatter.format(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [to, delay, duration]);

  return <span ref={ref}>0</span>;
}

// ----------------------------------------------------------------------

/**
 * พิมพ์ข้อความทีละตัวอักษรเมื่อ `active` เป็น true — ใช้กับ field ที่ AI กรอก / ร่างข้อความ
 */
export function useTypewriter(text: string, active: boolean, speed = 18) {
  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(0);

    if (!active) return undefined;

    const timer = setInterval(() => {
      setLength((prev) => {
        if (prev >= text.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [text, active, speed]);

  return { value: text.slice(0, length), done: length >= text.length };
}
