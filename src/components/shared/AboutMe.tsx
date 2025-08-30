"use client";

import { useSiteContent } from "@/hooks/useSiteContent";

export default function AboutMe() {
  const { getAboutContent, loading } = useSiteContent();
  const aboutContent = getAboutContent();

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const formatServices = (services: string) => {
    return services.split('\n').map((service, index) => (
      <li key={index} className="text-gray-700 mb-2">
        {service.trim()}
      </li>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
          {aboutContent.title || "About Me"}
        </h2>

        {/* Introduction */}
        {aboutContent.intro && (
          <div className="mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              {aboutContent.intro}
            </p>
          </div>
        )}

        {/* Description */}
        {aboutContent.description && (
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              {aboutContent.description}
            </p>
          </div>
        )}

        {/* Services Section */}
        {aboutContent.servicesTitle && aboutContent.services && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {aboutContent.servicesTitle}
            </h3>
            <ul className="space-y-3">
              {formatServices(aboutContent.services)}
            </ul>
          </div>
        )}

        {/* Appointments Section */}
        {aboutContent.appointmentsTitle && aboutContent.appointmentsText && (
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {aboutContent.appointmentsTitle}
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {aboutContent.appointmentsText}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="my-12 border-t border-gray-200"></div>

        {/* SEO Content (hidden from view but accessible to search engines) */}
        <div className="sr-only">
          {aboutContent.seoTitle && (
            <h2>{aboutContent.seoTitle}</h2>
          )}
          {aboutContent.seoDescription && (
            <p>{aboutContent.seoDescription}</p>
          )}
          {aboutContent.seoPortfolio && (
            <div>
              <h3>Portfolio Includes:</h3>
              <ul>
                {aboutContent.seoPortfolio.split('\n').map((item, index) => (
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
    </section>
  );
}
