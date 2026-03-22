"use client";

import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { cn } from "@/lib/utils";

interface ContactInfoProps {
  variant?: "default" | "dark";
  showHeading?: boolean;
  showIntro?: boolean;
  instagramOnly?: boolean;
  alignCenter?: boolean;
}

const DEFAULT_INSTAGRAM_HANDLE = "@besho_tattoo";
const DEFAULT_INSTAGRAM_URL =
  "https://www.instagram.com/besho_tattoo?igsh=MXRtOTE5bWppZmRkbQ==";

function getInstagramLabel(value: string) {
  const trimmedValue = value.trim();

  if (
    !trimmedValue ||
    /^https?:\/\//i.test(trimmedValue) ||
    trimmedValue.includes("instagram.com")
  ) {
    return DEFAULT_INSTAGRAM_HANDLE;
  }

  return trimmedValue.startsWith("@") ? trimmedValue : `@${trimmedValue}`;
}

function getInstagramHref(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return DEFAULT_INSTAGRAM_URL;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  if (trimmedValue.includes("instagram.com")) {
    return `https://${trimmedValue.replace(/^https?:\/\//i, "")}`;
  }

  return DEFAULT_INSTAGRAM_URL;
}

export default function ContactInfo({
  variant = "default",
  showHeading = true,
  showIntro = true,
  instagramOnly = false,
  alignCenter = false,
}: ContactInfoProps) {
  const { getContactContent, loading } = useSiteContent();
  const { copy } = useLocale();
  const contactContent = getContactContent();
  const contactCopy = copy.contactInfo;
  const isDarkVariant = variant === "dark";

  const formatAddress = (address: string) => {
    return address.split("\n").map((line, index) => (
      <span key={index}>
        {line.trim()}
        {index < address.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  const formatHours = (hours: string) => {
    return hours.split("\n").map((line, index) => (
      <span key={index}>
        {line.trim()}
        {index < hours.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  const items = [
    {
      key: "address",
      eyebrow: contactCopy.eyebrows.address,
      icon: MapPin,
      value: loading
        ? contactCopy.loading
        : contactContent.address || contactCopy.defaultAddress,
      href: null,
      renderValue: (value: string) => formatAddress(value),
    },
    {
      key: "phone",
      eyebrow: contactCopy.eyebrows.phone,
      icon: Phone,
      value: loading
        ? contactCopy.loading
        : contactContent.phone || "+43 123 456 789",
      href: (value: string) => `tel:${value}`,
    },
    {
      key: "email",
      eyebrow: contactCopy.eyebrows.email,
      icon: Mail,
      value: loading
        ? contactCopy.loading
        : contactContent.email || "info@beshotattoo.com",
      href: (value: string) => `mailto:${value}`,
    },
    {
      key: "hours",
      eyebrow: contactCopy.eyebrows.hours,
      icon: Clock,
      value: loading
        ? contactCopy.loading
        : contactContent.hours || contactCopy.defaultHours,
      href: null,
      renderValue: (value: string) => formatHours(value),
    },
    {
      key: "social",
      eyebrow: contactCopy.eyebrows.social,
      icon: Instagram,
      value: contactContent.socialMedia || DEFAULT_INSTAGRAM_HANDLE,
      href: (value: string) => getInstagramHref(value),
      renderValue: (value: string) => getInstagramLabel(value),
      external: true,
    },
  ];
  const visibleItems = instagramOnly
    ? items.filter((item) => item.key === "social")
    : items;

  return (
    <div className="space-y-8">
      {(showHeading || showIntro) && (
        <div>
          {showHeading ? (
            <h2
              className={cn(
                "mb-6 text-2xl",
                isDarkVariant
                  ? "font-home-serif font-normal text-white"
                  : "font-semibold text-gray-900",
              )}
            >
              {contactCopy.heading}
            </h2>
          ) : null}
          {showIntro ? (
            <p
              className={cn(
                isDarkVariant
                  ? "font-home-sans text-neutral-400"
                  : "text-gray-600",
              )}
            >
              {contactCopy.intro}
            </p>
          ) : null}
        </div>
      )}

      <div
        className={cn(
          "space-y-6 pt-8",
          alignCenter ? "mx-auto flex max-w-sm flex-col items-center pt-6" : "",
        )}
      >
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const href = item.href ? item.href(item.value) : null;
          const content = item.renderValue
            ? item.renderValue(item.value)
            : item.value;

          return (
            <div
              key={item.key}
              className={cn(
                "flex items-start space-x-4",
                alignCenter
                  ? "flex-col items-center space-x-0 space-y-4 text-center"
                  : "",
                isDarkVariant ? "text-neutral-300" : "",
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center border",
                  isDarkVariant
                    ? "border-neutral-800 bg-neutral-900"
                    : "border-transparent bg-transparent",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isDarkVariant ? "text-neutral-300" : "text-gray-600",
                  )}
                />
              </div>
              <div className={cn(alignCenter ? "space-y-2 text-center" : "")}>
                <p
                  className={cn(
                    "text-xs uppercase tracking-widest",
                    isDarkVariant ? "text-neutral-500" : "text-gray-500",
                  )}
                >
                  {item.eyebrow}
                </p>
                {href ? (
                  <a
                    href={href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "mt-1 block transition-colors",
                      isDarkVariant
                        ? "font-home-sans text-base text-neutral-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900",
                    )}
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    className={cn(
                      "mt-1",
                      isDarkVariant
                        ? "font-home-sans text-base text-neutral-300"
                        : "text-gray-600",
                    )}
                  >
                    {content}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
