"use client";

import Image from "next/image";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import ContactInfo from "@/components/shared/ContactInfo";
import { useLocale } from "@/contexts/LocaleContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { DEFAULT_CONTACT_PAGE_IMAGE } from "@/lib/page-assets";

export default function ContactPage() {
  const { getContentByField, getContactContent } = useSiteContent();
  const { locale, copy } = useLocale();
  const useLocalizedDefaults = locale === "de";
  const contactContent = getContactContent();
  const title = useLocalizedDefaults
    ? copy.contact.title
    : getContentByField("contact", "header", "title") || copy.contact.title;
  const description = useLocalizedDefaults
    ? copy.contact.description
    : getContentByField("contact", "header", "description") ||
      copy.contact.description;
  const imageSrc = contactContent.imageUrl || DEFAULT_CONTACT_PAGE_IMAGE;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-home-sans">
      <Header variant="home" />

      <main className="px-6 py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(340px,0.74fr)] lg:gap-20">
          <div className="space-y-10 text-left">
            <div className="space-y-8">
              <h1 className="font-home-serif text-4xl text-white md:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-lg font-light leading-[1.9] text-neutral-400">
                {description}
              </p>
            </div>

            <div className="max-w-md">
              <ContactInfo
                variant="dark"
                showHeading={false}
                showIntro={false}
                instagramOnly
              />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[480px]">
            <div className="relative aspect-[2/3] overflow-hidden">
              <Image
                src={imageSrc}
                alt={copy.contact.imageAlt}
                fill
                className="object-cover object-center grayscale contrast-110 brightness-[0.82]"
                priority
              />
            </div>
          </div>
        </div>
      </main>

      <Footer variant="home" />
    </div>
  );
}
