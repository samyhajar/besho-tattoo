"use client";

import Image from "next/image";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Fragment } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { pageMotionTransition, pageMotionViewport } from "@/lib/page-motion";

const instagramProfileUrl =
  "https://www.instagram.com/besho_tattoo?igsh=MXRtOTE5bWppZmRkbQ==";

const heroContentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.24,
      delayChildren: 0.18,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: pageMotionTransition,
  },
};

function renderHeadline(title: string) {
  const segments = title
    .split(".")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length < 2) {
    return title;
  }

  return segments.map((segment, index) => {
    const isLast = index === segments.length - 1;
    const insertMobileBreak = index < segments.length - 2;

    return (
      <Fragment key={`${segment}-${index}`}>
        {segment}
        {!isLast ? <span className="text-neutral-500">.</span> : null}
        {insertMobileBreak ? <br className="md:hidden" /> : null}
      </Fragment>
    );
  });
}

export default function HomePage() {
  const { getHeroContent } = useSiteContent();
  const heroContent = getHeroContent();
  const headline = heroContent.title || "Think.Before.You.Ink";
  const description =
    heroContent.description ||
    heroContent.subtitle ||
    "Custom tattoos connecting history and modern art. Specializing in Arabic calligraphy, Mesopotamian symbols, and elegant fine line art.";
  const bookingLabel =
    heroContent.bookingButton.trim().toLowerCase() === "book appointment"
      ? "Book Now"
      : heroContent.bookingButton || "Book Now";

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-home-sans">
      <Header variant="home" />

      <section className="relative flex min-h-[calc(100vh-84px)] items-center justify-center overflow-hidden bg-[#0d0d0d]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/1de18774-5b5c-4058-8ebc-26ad6594bdcf.png"
            alt="Besho Tattoo Artist at Work"
            fill
            sizes="100vw"
            fetchPriority="high"
            className="h-full w-full scale-[1.01] object-cover object-[50%_26%] grayscale contrast-105 brightness-[0.96]"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/6 to-black/52" />
          <div className="home-noise absolute inset-0 opacity-[0.28]" />
        </div>

        <div className="container relative z-10 px-6 py-20 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={pageMotionViewport}
            variants={heroContentVariants}
            className="space-y-8"
          >
            <motion.h1
              variants={heroItemVariants}
              className="font-home-serif text-5xl leading-none tracking-tight text-white md:text-7xl lg:text-9xl"
            >
              {renderHeadline(headline)}
            </motion.h1>
            <motion.p
              variants={heroItemVariants}
              className="mx-auto max-w-2xl text-lg font-light tracking-wide text-neutral-300 md:text-xl"
            >
              {description}
            </motion.p>
            <motion.div
              variants={heroItemVariants}
              className="flex flex-col items-center gap-6 pt-8"
            >
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="rounded-none bg-white px-8 py-6 text-sm uppercase tracking-widest text-black transition-all duration-300 hover:scale-105 hover:bg-neutral-200"
                >
                  {bookingLabel}
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Footer variant="home" />
    </div>
  );
}
