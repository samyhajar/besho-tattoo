"use client";

import { motion } from "framer-motion";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { useLocale } from "@/contexts/LocaleContext";
import { useSiteContent } from "@/hooks/useSiteContent";

function splitParagraphs(...values: string[]) {
  return values
    .flatMap((value) =>
      value
        .split(/\n\s*\n/)
        .map((item) => item.trim())
        .filter(Boolean),
    )
    .filter(Boolean);
}

function sanitizeSeoCopy(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      const normalized = line.toLowerCase();

      if (!normalized) {
        return false;
      }

      if (normalized.includes("my portfolio includes")) {
        return false;
      }

      if (line.startsWith("•")) {
        return false;
      }

      return true;
    })
    .join("\n");
}

const aboutMotionEase = [0.16, 1, 0.3, 1] as const;

const headingMotion = {
  initial: { opacity: 0, x: -28 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.42 },
  transition: {
    duration: 1.45,
    ease: aboutMotionEase,
  },
};

const bodyMotion = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: {
    duration: 1.45,
    delay: 0.12,
    ease: aboutMotionEase,
  },
};

const cardsContainerMotion = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.16,
    },
  },
};

const cardMotion = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: aboutMotionEase,
    },
  },
};

export default function AboutPage() {
  const { getAboutContent } = useSiteContent();
  const { locale, copy } = useLocale();
  const aboutContent = getAboutContent();
  const aboutCopy = copy.about;
  const useLocalizedDefaults = locale === "de";

  const aboutTitle = useLocalizedDefaults
    ? aboutCopy.title
    : aboutContent.title || aboutCopy.title;
  const aboutParagraphs = useLocalizedDefaults
    ? aboutCopy.paragraphs
    : splitParagraphs(aboutContent.intro, aboutContent.description);
  const offeringsTitle = useLocalizedDefaults
    ? aboutCopy.offeringsTitle
    : aboutContent.servicesTitle || aboutCopy.offeringsTitle;
  const offerings = aboutCopy.offerings;
  const appointmentsTitle = useLocalizedDefaults
    ? aboutCopy.appointmentsTitle
    : aboutContent.appointmentsTitle || aboutCopy.appointmentsTitle;
  const appointmentsText = useLocalizedDefaults
    ? aboutCopy.appointmentsText
    : aboutContent.appointmentsText || aboutCopy.appointmentsText;
  const seoTitle = useLocalizedDefaults
    ? aboutCopy.seoTitle
    : aboutContent.seoTitle || aboutCopy.seoTitle;
  const seoDescription = useLocalizedDefaults
    ? aboutCopy.seoDescription
    : sanitizeSeoCopy(aboutContent.seoDescription) || aboutCopy.seoDescription;
  const seoPortfolioLines = splitParagraphs(
    useLocalizedDefaults
      ? aboutCopy.seoPortfolio
      : sanitizeSeoCopy(aboutContent.seoPortfolio) || aboutCopy.seoPortfolio,
  );
  const seoConclusion = useLocalizedDefaults
    ? ""
    : aboutContent.seoConclusion || "";
  const seoSectionBody =
    seoPortfolioLines[0] || seoDescription || aboutCopy.seoPortfolio;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-home-sans">
      <Header variant="home" />

      <main className="px-6 pb-28 pt-16 md:pt-20">
        <div className="mx-auto max-w-[1020px] space-y-28">
          <section className="space-y-10">
            <motion.h1
              {...headingMotion}
              className="font-home-serif text-[3.2rem] leading-none tracking-tight text-white md:text-[4.1rem]"
            >
              {aboutTitle}
            </motion.h1>

            <motion.div
              {...bodyMotion}
              className="max-w-[980px] space-y-9 text-[1.08rem] font-light leading-[1.9] text-neutral-400 md:text-[1.12rem]"
            >
              {aboutParagraphs.length > 0 ? (
                aboutParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))
              ) : (
                <>
                  {aboutCopy.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </>
              )}
            </motion.div>
          </section>

          <section className="space-y-12">
            <motion.h2
              {...headingMotion}
              className="font-home-serif text-[3.05rem] leading-none tracking-tight text-white md:text-[3.7rem]"
            >
              {offeringsTitle}
            </motion.h2>

            <motion.div
              key={`offerings-${locale}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={cardsContainerMotion}
              className="grid grid-cols-1 gap-8 md:grid-cols-2"
            >
              {offerings.map((item, index) => (
                <motion.div
                  key={`${item.title}-${index}`}
                  variants={cardMotion}
                  className="border border-white/5 bg-[#0f0f0f] p-6"
                >
                  <h3 className="mb-2 font-home-serif text-xl text-white md:text-[1.75rem]">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="font-light text-neutral-500">
                      {item.description}
                    </p>
                  ) : null}
                </motion.div>
              ))}
            </motion.div>
          </section>

          <motion.section
            {...bodyMotion}
            className="flex w-full flex-col justify-center space-y-6 border border-white/[0.08] bg-white/[0.05] px-8 py-12 text-center md:px-10 md:py-14 lg:min-h-[213px] lg:px-12"
          >
            <h2 className="font-home-serif text-[3rem] leading-none text-white md:text-[3.35rem]">
              {appointmentsTitle}
            </h2>
            <p className="mx-auto max-w-3xl text-[1.08rem] font-light italic leading-[1.8] text-neutral-400 md:text-[1.12rem]">
              {appointmentsText}
            </p>
          </motion.section>

          <motion.section
            {...bodyMotion}
            className="mx-auto max-w-[1120px] space-y-12 pt-8 text-center"
          >
            <p className="mx-auto max-w-[1180px] font-home-serif text-[1.08rem] italic leading-[1.85] text-white/88 md:text-[1.35rem]">
              {seoTitle}
            </p>
            <p className="mx-auto max-w-[1100px] text-[0.96rem] font-light leading-[1.8] text-neutral-500 md:text-[1.04rem]">
              {seoSectionBody}
            </p>
          </motion.section>

          <div className="sr-only">
            <p>{seoDescription}</p>
            {seoPortfolioLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {seoConclusion ? <p>{seoConclusion}</p> : null}
          </div>
        </div>
      </main>

      <Footer variant="home" />
    </div>
  );
}
