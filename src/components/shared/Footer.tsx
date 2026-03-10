"use client";

interface FooterProps {
  variant?: "default" | "home";
}

export default function Footer({ variant = "default" }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const footerClassName =
    variant === "home"
      ? "border-t border-white/5 bg-[#0f0f0f] px-4 py-16 text-white sm:px-6 lg:px-8"
      : "border-t border-white/5 bg-[#0f0f0f] px-4 py-16 text-white sm:px-6 lg:px-8";

  return (
    <footer className={footerClassName}>
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-home-serif text-2xl uppercase tracking-[0.2em] text-white/88">
          THINK.BEFORE.YOU.INK
        </p>

        <p className="mx-auto mt-8 max-w-md font-home-sans text-sm font-light text-neutral-400 sm:text-base">
          Artistry in every needle. Stories in every line.
        </p>

        <p className="mt-14 font-home-sans text-sm tracking-[0.03em] text-neutral-500">
          © {currentYear} THINK.BEFORE.YOU.INK. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
