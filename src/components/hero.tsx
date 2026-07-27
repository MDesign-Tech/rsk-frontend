"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useWebsiteStore } from "@/stores/website.store";
import { useEffect, useState, useRef, useCallback } from "react";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const hero = useWebsiteStore((state) => state.data?.hero);
  const bgImage = hero?.image;

  if (!hero) return null;

  const visibleServices = (hero.services || []).filter(
    (s) => s.visible !== false
  );

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(2,6,23,0.82),rgba(30,64,175,0.45)_45%,transparent_78%)]" />
        {bgImage && (
          <div
            className="absolute inset-0 opacity-85"
            style={{
              backgroundImage: `url('${bgImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(0.85) contrast(0.9)",
            }}
          />
        )}

        <div className="absolute inset-0 bg-linear-to-br from-blue-950/55 via-blue-800/30 to-transparent" />
      </div>

      <div className="flex-1 flex items-center justify-center pt-28 lg:pt-32 pb-40 sm:pb-32">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-display text-balance mb-6 leading-[1.1]"
          >
            <motion.span
              whileHover={{
                scale: 1.04,
                y: -4,
                rotate: -1,
                textShadow: "0 0 20px rgba(255,255,255,0.35)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              className="block text-white"
            >
              {hero.title}
            </motion.span>
          </motion.h1>

          {visibleServices.length > 0 && (
            <motion.div
              initial={shouldReduceMotion ? {} : fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 h-16 sm:h-20 flex items-center justify-center"
            >
              <Typewriter
                sentences={visibleServices.map((s) => s.text)}
                shouldReduceMotion={shouldReduceMotion}
              />
            </motion.div>
          )}

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-muted-foreground/40 mb-6 pointer-events-none select-none"
            aria-hidden="true"
          >
            <span>✕</span>
            <span>◇</span>
            <span>✕</span>
            <span>◇</span>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              asChild
              size="xl"
              rounded="full"
              className="gap-2 w-full sm:w-auto"
            >
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const TYPE_SPEED = 60;
const DELETE_SPEED = 30;
const PAUSE_DURATION = 2000;

type TypingPhase = "typing" | "pausing" | "deleting";

function Typewriter({ sentences, shouldReduceMotion }: { sentences: string[]; shouldReduceMotion: boolean }) {
  const [displayed, setDisplayed] = useState("");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const phaseRef = useRef<TypingPhase>("typing");
  const displayedRef = useRef("");
  const sentenceIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const tick = useCallback(() => {
    const phase = phaseRef.current;
    const currentDisplayed = displayedRef.current;
    const currentIndex = sentenceIndexRef.current;
    const currentSentence = sentences[currentIndex] || "";

    if (phase === "typing") {
      if (currentDisplayed.length < currentSentence.length) {
        const next = currentSentence.slice(0, currentDisplayed.length + 1);
        displayedRef.current = next;
        setDisplayed(next);
        phaseRef.current = "typing";
      } else {
        phaseRef.current = "pausing";
      }
    } else if (phase === "pausing") {
      phaseRef.current = "deleting";
    } else {
      // deleting
      if (currentDisplayed.length > 0) {
        const next = currentDisplayed.slice(0, -1);
        displayedRef.current = next;
        setDisplayed(next);
        phaseRef.current = "deleting";
      } else {
        const nextIndex = (currentIndex + 1) % sentences.length;
        sentenceIndexRef.current = nextIndex;
        setSentenceIndex(nextIndex);
        phaseRef.current = "typing";
      }
    }

    const nextPhase = phaseRef.current;
    const delay =
      nextPhase === "typing"
        ? TYPE_SPEED
        : nextPhase === "deleting"
        ? DELETE_SPEED
        : PAUSE_DURATION;

    clearTimeoutRef();
    timeoutRef.current = setTimeout(tick, delay);
  }, [sentences, clearTimeoutRef]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayed(sentences[0] || "");
      return;
    }

    tick();

    return () => {
      clearTimeoutRef();
    };
  }, [shouldReduceMotion, sentences, tick, clearTimeoutRef]);

  if (shouldReduceMotion) {
    return (
      <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-sky-300">
        {sentences[0]}
      </p>
    );
  }

  return (
    <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-sky-300">
      {displayed}
      <span className="inline-block w-[2px] h-[0.9em] bg-sky-300 ml-0.5 align-middle animate-pulse" />
    </p>
  );
}
