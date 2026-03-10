"use client";

import { useSiteContent } from "@/hooks/useSiteContent";

interface AboutMeProps {
  variant?: "default" | "home";
}

export default function AboutMe({ variant = "default" }: AboutMeProps) {
  const { getAboutContent, loading } = useSiteContent();
  const aboutContent = getAboutContent();
  const isHomeVariant = variant === "home";

  if (loading) {
    return (
      <section
        id={isHomeVariant ? "about" : undefined}
        className={`py-16 sm:py-20 ${
          isHomeVariant ? "bg-black text-white" : "bg-white"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div
              className={`mb-8 h-8 w-1/3 rounded ${
                isHomeVariant ? "bg-white/10" : "bg-gray-200"
              }`}
            ></div>
            <div className="space-y-4">
              <div
                className={`h-4 w-full rounded ${
                  isHomeVariant ? "bg-white/10" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`h-4 w-3/4 rounded ${
                  isHomeVariant ? "bg-white/10" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`h-4 w-5/6 rounded ${
                  isHomeVariant ? "bg-white/10" : "bg-gray-200"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const formatServices = (services: string) =>
    services
      .split("\n")
      .map((service) => service.trim())
      .filter(Boolean);

  return (
    <section
      id={isHomeVariant ? "about" : undefined}
      className={`py-16 sm:py-24 ${
        isHomeVariant ? "bg-black text-white" : "bg-white"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`overflow-hidden rounded-[2rem] border px-6 py-12 sm:px-10 lg:px-14 ${
            isHomeVariant
              ? "border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="mx-auto max-w-4xl">
            <p
              className={`font-home-sans text-xs uppercase tracking-[0.35em] ${
                isHomeVariant ? "text-white/50" : "text-gray-500"
              }`}
            >
              About
            </p>
            <h2
              className={`mt-4 text-4xl sm:text-5xl lg:text-6xl ${
                isHomeVariant
                  ? "font-home-serif font-normal text-white"
                  : "font-bold text-gray-900"
              }`}
            >
              {aboutContent.title || "About Me"}
            </h2>

            {aboutContent.intro && (
              <div className="mt-8">
                <p
                  className={`font-home-sans text-lg leading-relaxed sm:text-xl ${
                    isHomeVariant ? "text-white/80" : "text-gray-700"
                  }`}
                >
                  {aboutContent.intro}
                </p>
              </div>
            )}

            {aboutContent.description && (
              <div className="mt-6">
                <p
                  className={`font-home-sans text-base leading-8 sm:text-lg ${
                    isHomeVariant ? "text-white/70" : "text-gray-700"
                  }`}
                >
                  {aboutContent.description}
                </p>
              </div>
            )}

            {(aboutContent.servicesTitle && aboutContent.services) ||
            (aboutContent.appointmentsTitle &&
              aboutContent.appointmentsText) ? (
              <div className="mt-12 grid gap-6 lg:grid-cols-2">
                {aboutContent.servicesTitle && aboutContent.services ? (
                  <div
                    className={`rounded-[1.5rem] border p-6 ${
                      isHomeVariant
                        ? "border-white/10 bg-black/30"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <h3
                      className={`text-2xl ${
                        isHomeVariant
                          ? "font-home-serif font-normal text-white"
                          : "font-semibold text-gray-900"
                      }`}
                    >
                      {aboutContent.servicesTitle}
                    </h3>
                    <ul className="mt-5 space-y-3 font-home-sans">
                      {formatServices(aboutContent.services).map((service) => (
                        <li
                          key={service}
                          className={`border-b pb-3 text-sm uppercase tracking-[0.18em] sm:text-base ${
                            isHomeVariant
                              ? "border-white/10 text-white/72"
                              : "border-gray-200 text-gray-700"
                          }`}
                        >
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {aboutContent.appointmentsTitle &&
                aboutContent.appointmentsText ? (
                  <div
                    className={`rounded-[1.5rem] border p-6 ${
                      isHomeVariant
                        ? "border-white/10 bg-white/[0.02]"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <h3
                      className={`text-2xl ${
                        isHomeVariant
                          ? "font-home-serif font-normal text-white"
                          : "font-semibold text-gray-900"
                      }`}
                    >
                      {aboutContent.appointmentsTitle}
                    </h3>
                    <p
                      className={`mt-5 font-home-sans text-base leading-8 ${
                        isHomeVariant ? "text-white/72" : "text-gray-700"
                      }`}
                    >
                      {aboutContent.appointmentsText}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div
              className={`my-12 border-t ${
                isHomeVariant ? "border-white/10" : "border-gray-200"
              }`}
            ></div>

            <div className="sr-only">
              {aboutContent.seoTitle && <h2>{aboutContent.seoTitle}</h2>}
              {aboutContent.seoDescription && (
                <p>{aboutContent.seoDescription}</p>
              )}
              {aboutContent.seoPortfolio && (
                <div>
                  <h3>Portfolio Includes:</h3>
                  <ul>
                    {aboutContent.seoPortfolio
                      .split("\n")
                      .map((item, index) => (
                        <li key={index}>{item.trim()}</li>
                      ))}
                  </ul>
                </div>
              )}
              {aboutContent.seoConclusion && (
                <p>{aboutContent.seoConclusion}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
