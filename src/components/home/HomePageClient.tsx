"use client";

import {
  Fragment,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { formatLocalDateForLocale } from "@/lib/i18n";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/Button";
import { pageMotionTransition, pageMotionViewport } from "@/lib/page-motion";
import type { Event } from "@/types/event";

export interface HomeHeroContent {
  title: string;
  subtitle: string;
  description: string;
  portfolioButton: string;
  bookingButton: string;
}

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

const heroSwapTransition = {
  duration: 1.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

const APP_REDIRECT_FALLBACK_DELAY_MS = 900;
const TIMELINE_SLOT_MIN_WIDTH = 176;

function formatRedirectLabel(
  url: string,
  visitHost: (host: string) => string,
  openEventPage: string,
) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return visitHost(host);
  } catch {
    return openEventPage;
  }
}

function formatTimelineDate(locale: "en" | "de", dateString: string) {
  return formatLocalDateForLocale(locale, dateString, {
    month: "short",
    day: "numeric",
  });
}

function getAppRedirectUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

    if (hostname !== "instagram.com") {
      return null;
    }

    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    const firstSegment = segments[0]?.toLowerCase();

    if (!firstSegment) {
      return "instagram://app";
    }

    if (
      [
        "p",
        "reel",
        "reels",
        "stories",
        "explore",
        "accounts",
        "direct",
        "tv",
      ].includes(firstSegment)
    ) {
      return "instagram://app";
    }

    return `instagram://user?username=${segments[0]}`;
  } catch {
    return null;
  }
}

function renderHeadline(title: string): ReactNode {
  const segments = title
    .split(".")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length < 2) {
    return title;
  }

  return segments.map((segment, index) => {
    const isLast = index === segments.length - 1;

    return (
      <Fragment key={`${segment}-${index}`}>
        {segment}
        {!isLast ? <span className="text-neutral-500">.</span> : null}
      </Fragment>
    );
  });
}

interface EventDetailRowsProps {
  event: Event;
  onRedirectClick?: (
    domEvent: ReactMouseEvent<HTMLAnchorElement>,
    url: string,
  ) => void;
}

function EventDetailRows({ event, onRedirectClick }: EventDetailRowsProps) {
  const { locale, copy } = useLocale();
  const redirectUrl = event.redirect_url;
  const content = (
    <div className="mx-auto flex w-full max-w-[30rem] flex-col items-center gap-3">
      <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-neutral-300 md:text-base">
        <CalendarDays className="h-4 w-4 text-white/65" />
        <span>
          {formatLocalDateForLocale(locale, event.event_date, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-neutral-300 md:text-base">
        <MapPin className="h-4 w-4 text-white/65" />
        <span>{event.location}</span>
      </div>
      {redirectUrl ? (
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.26em] text-white/72 md:text-sm">
          <ExternalLink className="h-4 w-4" />
          <span>
            {formatRedirectLabel(
              redirectUrl,
              copy.home.visitHost,
              copy.home.openEventPage,
            )}
          </span>
        </div>
      ) : null}
    </div>
  );

  if (!redirectUrl) {
    return <div>{content}</div>;
  }

  return (
    <a
      href={redirectUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(domEvent) => onRedirectClick?.(domEvent, redirectUrl)}
      className="group inline-flex transition-opacity duration-300 hover:opacity-100"
    >
      <div className="opacity-90 transition-opacity duration-300 group-hover:opacity-100">
        {content}
      </div>
    </a>
  );
}

interface HomePageClientProps {
  heroContent: HomeHeroContent;
  upcomingEvents: Event[];
}

export default function HomePageClient({
  heroContent,
  upcomingEvents,
}: HomePageClientProps) {
  const { locale, copy } = useLocale();
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEventTakeover, setShowEventTakeover] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);

  const headline =
    locale === "de"
      ? copy.home.heroTitle
      : heroContent.title || copy.home.heroTitle;
  const description =
    locale === "de"
      ? copy.home.heroDescription
      : heroContent.description ||
        heroContent.subtitle ||
        copy.home.heroDescription;
  const bookingLabel =
    locale === "de"
      ? copy.home.bookNow
      : heroContent.bookingButton.trim().toLowerCase() === "book appointment"
        ? copy.home.bookNow
        : heroContent.bookingButton || copy.home.bookNow;
  const featuredEvent = upcomingEvents[0] ?? null;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncInteractionMode = () => {
      setSupportsHover(mediaQuery.matches);
    };

    syncInteractionMode();
    mediaQuery.addEventListener("change", syncInteractionMode);

    return () => {
      mediaQuery.removeEventListener("change", syncInteractionMode);
    };
  }, []);

  const timelineEvents = useMemo(() => upcomingEvents, [upcomingEvents]);

  const hoveredEvent =
    upcomingEvents.find((event) => event.id === hoveredEventId) ?? null;
  const selectedEvent =
    upcomingEvents.find((event) => event.id === selectedEventId) ?? null;
  const activeEvent = showEventTakeover
    ? (hoveredEvent ?? selectedEvent ?? featuredEvent)
    : null;
  const activeTimelineEventId = hoveredEventId ?? activeEvent?.id ?? null;
  const activeLabel =
    showEventTakeover && activeEvent != null
      ? timelineEvents.length > 1
        ? copy.home.upcomingEvents
        : copy.home.upcomingEvent
      : null;
  const eventCtaLabel =
    timelineEvents.length > 1
      ? copy.home.viewUpcomingEvents
      : copy.home.viewUpcomingEvent;
  const shouldKeepEventCtaVisible = supportsHover && showEventTakeover;
  const showEventCta =
    featuredEvent != null && (!showEventTakeover || shouldKeepEventCtaVisible);
  const showTimeline = showEventTakeover && timelineEvents.length > 1;
  const timelineGridColumns = `repeat(${Math.max(
    timelineEvents.length,
    1,
  )}, minmax(${TIMELINE_SLOT_MIN_WIDTH}px, 1fr))`;

  const handleActivateEventsHero = () => {
    if (!featuredEvent) {
      return;
    }

    setShowEventTakeover(true);
    setSelectedEventId(featuredEvent.id);
    setHoveredEventId(null);
  };

  const handleEventHover = (event: Event) => {
    if (!supportsHover) {
      return;
    }

    setSelectedEventId(event.id);
    setHoveredEventId(event.id);
  };

  const handleEventLeave = () => {
    if (!supportsHover) {
      return;
    }

    setHoveredEventId(null);
  };

  const openEventRedirect = (url: string) => {
    const appRedirectUrl = getAppRedirectUrl(url);

    if (!appRedirectUrl) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    let fallbackTimer = 0;

    const cleanup = () => {
      if (fallbackTimer) {
        window.clearTimeout(fallbackTimer);
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", cleanup);
      window.removeEventListener("blur", cleanup);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        cleanup();
      }
    };

    fallbackTimer = window.setTimeout(() => {
      cleanup();
      window.open(url, "_blank", "noopener,noreferrer");
    }, APP_REDIRECT_FALLBACK_DELAY_MS);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", cleanup);
    window.addEventListener("blur", cleanup);

    window.location.assign(appRedirectUrl);
  };

  const handleEventRedirectClick = (
    domEvent: ReactMouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    if (supportsHover) {
      return;
    }

    domEvent.preventDefault();
    openEventRedirect(url);
  };

  const handleLinkedEventClick = (
    domEvent: ReactMouseEvent<HTMLAnchorElement>,
    event: Event,
  ) => {
    setSelectedEventId(event.id);

    if (!supportsHover && selectedEventId !== event.id) {
      domEvent.preventDefault();
      return;
    }

    if (!supportsHover && event.redirect_url) {
      domEvent.preventDefault();
      openEventRedirect(event.redirect_url);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-home-sans">
      <Header variant="home" />

      <section className="relative flex min-h-[calc(100svh-92px)] items-center justify-center overflow-hidden bg-[#0d0d0d] lg:min-h-[calc(100vh-84px)]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/1de18774-5b5c-4058-8ebc-26ad6594bdcf.png"
            alt={copy.home.heroImageAlt}
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

        <div
          className={[
            "container relative z-10 px-6 text-center",
            timelineEvents.length > 1
              ? "py-6 sm:py-8 lg:py-16"
              : "py-10 sm:py-12 lg:py-20",
          ].join(" ")}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={pageMotionViewport}
            variants={heroContentVariants}
            className="-translate-y-10 space-y-5 sm:-translate-y-12 sm:space-y-6 lg:translate-y-0 lg:space-y-8"
          >
            <div className="mx-auto flex min-h-[260px] max-w-4xl flex-col items-center justify-center gap-4 sm:min-h-[300px] sm:gap-5 lg:min-h-[360px] lg:gap-6">
              <div className="flex h-6 items-center justify-center">
                <motion.p
                  animate={{
                    opacity: activeLabel ? 1 : 0,
                    filter: activeLabel ? "blur(0px)" : "blur(8px)",
                  }}
                  transition={{ ...heroSwapTransition, duration: 1.2 }}
                  className="text-[13px] leading-none uppercase tracking-[0.42em] text-white/60 md:text-[15px]"
                >
                  {activeLabel ?? copy.home.upcomingEvents}
                </motion.p>
              </div>

              <div className="relative flex min-h-[104px] w-full items-center justify-center sm:min-h-[122px] lg:min-h-[190px]">
                <AnimatePresence mode="sync" initial={false}>
                  <motion.h1
                    key={activeEvent?.id || headline}
                    initial={{ opacity: 0, filter: "blur(14px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(14px)" }}
                    transition={heroSwapTransition}
                    className={[
                      "absolute inset-0 flex w-full items-center justify-center px-4 text-center font-home-serif leading-none text-white sm:px-8",
                      activeEvent
                        ? "text-5xl tracking-tight md:text-7xl lg:text-9xl"
                        : "whitespace-nowrap text-[clamp(2.2rem,9vw,4.5rem)] tracking-tight md:text-7xl lg:text-9xl",
                    ].join(" ")}
                  >
                    {renderHeadline(activeEvent?.title || headline)}
                  </motion.h1>
                </AnimatePresence>
              </div>

              <div className="relative flex min-h-[96px] w-full items-center justify-center sm:min-h-[108px] lg:min-h-[116px]">
                <AnimatePresence mode="sync" initial={false}>
                  {activeEvent ? (
                    <motion.div
                      key={`event-details-${activeEvent.id}`}
                      initial={{ opacity: 0, filter: "blur(12px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(12px)" }}
                      transition={{ ...heroSwapTransition, duration: 1.2 }}
                      className="absolute inset-0 flex items-center justify-center px-3 sm:px-6"
                    >
                      <EventDetailRows
                        event={activeEvent}
                        onRedirectClick={handleEventRedirectClick}
                      />
                    </motion.div>
                  ) : (
                    <motion.p
                      key="default-hero-description"
                      initial={{ opacity: 0, filter: "blur(12px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(12px)" }}
                      transition={{ ...heroSwapTransition, duration: 1.2 }}
                      className="absolute inset-0 mx-auto flex max-w-2xl items-center justify-center px-2 text-center text-lg font-light tracking-wide text-neutral-300 sm:px-6 md:text-xl"
                    >
                      {description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              variants={heroItemVariants}
              className={[
                "flex flex-col items-center gap-4 sm:gap-5 lg:gap-6",
                timelineEvents.length > 1
                  ? "pt-2 sm:pt-3 lg:pt-3"
                  : "pt-4 sm:pt-5 lg:pt-8",
              ].join(" ")}
            >
              {showEventCta ? (
                <div className="flex min-h-[46px] items-center justify-center">
                  {shouldKeepEventCtaVisible ? (
                    <div
                      aria-hidden="true"
                      className="rounded-none border border-white/45 bg-black/20 px-7 py-3 text-[11px] uppercase tracking-[0.32em] text-white"
                    >
                      {eventCtaLabel}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleActivateEventsHero}
                      className="rounded-none border border-white/45 bg-black/20 px-7 py-3 text-[11px] uppercase tracking-[0.32em] text-white transition-all duration-500 hover:border-white hover:bg-white/10"
                    >
                      {eventCtaLabel}
                    </button>
                  )}
                </div>
              ) : null}
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

            {timelineEvents.length > 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showTimeline ? 1 : 0 }}
                transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden={!showTimeline}
                className={[
                  "mx-auto w-full max-w-6xl pt-2 transition-[visibility] duration-0",
                  showTimeline ? "visible" : "pointer-events-none invisible",
                ].join(" ")}
              >
                <div className="overflow-x-auto pb-2">
                  <div className="mx-auto min-w-full px-4">
                    <div className="relative min-w-max">
                      <div
                        aria-hidden="true"
                        className="absolute left-[88px] right-[88px] top-1/2 h-px -translate-y-1/2 bg-white/30"
                      />
                      <div
                        className="grid h-48 items-center gap-6"
                        style={{ gridTemplateColumns: timelineGridColumns }}
                      >
                        {timelineEvents.map((item, index) => {
                          const isActive = activeTimelineEventId === item.id;
                          const isTop = index % 2 === 0;
                          const labelContent = (
                            <div
                              className={[
                                "space-y-2 transition-opacity duration-300",
                                isActive
                                  ? "opacity-100"
                                  : "opacity-75 group-hover:opacity-100 group-focus-visible:opacity-100",
                              ].join(" ")}
                            >
                              <p className="text-[11px] uppercase tracking-[0.28em] text-white/60">
                                {formatTimelineDate(locale, item.event_date)}
                              </p>
                              <p className="mx-auto max-w-[160px] overflow-hidden text-xs uppercase tracking-[0.16em] text-white/90 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                                {item.title}
                              </p>
                            </div>
                          );
                          const timelineNodeContent = (
                            <>
                              <div className="flex h-[72px] items-end justify-center pb-4">
                                {isTop ? labelContent : null}
                              </div>
                              <div
                                className={[
                                  "relative z-10 mx-auto h-3 w-3 rounded-full border transition-all duration-300",
                                  isActive
                                    ? "border-white bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
                                    : "border-white bg-[#0d0d0d]",
                                ].join(" ")}
                              />
                              <div className="flex h-[72px] items-start justify-center pt-4">
                                {!isTop ? labelContent : null}
                              </div>
                            </>
                          );

                          if (item.redirect_url) {
                            return (
                              <a
                                key={item.id}
                                href={item.redirect_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onBlur={handleEventLeave}
                                onClick={(domEvent) =>
                                  handleLinkedEventClick(domEvent, item)
                                }
                                onFocus={() => handleEventHover(item)}
                                onMouseEnter={() => handleEventHover(item)}
                                onMouseLeave={handleEventLeave}
                                className="group flex h-full min-w-[176px] flex-col items-center justify-center text-center outline-none"
                              >
                                {timelineNodeContent}
                              </a>
                            );
                          }

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onBlur={handleEventLeave}
                              onClick={() => setSelectedEventId(item.id)}
                              onFocus={() => handleEventHover(item)}
                              onMouseEnter={() => handleEventHover(item)}
                              onMouseLeave={handleEventLeave}
                              className="group flex h-full min-w-[176px] flex-col items-center justify-center text-center outline-none"
                            >
                              {timelineNodeContent}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </section>
      <Footer variant="home" />
    </div>
  );
}
