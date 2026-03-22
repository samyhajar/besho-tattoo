export const localeCookieName = "besho_locale";

export const localeLabels = {
  en: { short: "EN", native: "English" },
  de: { short: "DE", native: "Deutsch" },
} as const;

export type Locale = keyof typeof localeLabels;

export const defaultLocale: Locale = "en";

export function normalizeLocale(value?: string | null): Locale {
  return value === "de" ? "de" : defaultLocale;
}

export function getLocaleTag(locale: Locale) {
  return locale === "de" ? "de-AT" : "en-US";
}

export function formatDateForLocale(
  locale: Locale,
  date: Date,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(getLocaleTag(locale), options).format(date);
}

export function formatLocalDateForLocale(
  locale: Locale,
  dateString: string,
  options: Intl.DateTimeFormatOptions,
) {
  return formatDateForLocale(
    locale,
    new Date(`${dateString}T00:00:00`),
    options,
  );
}

export function formatTimeForLocale(locale: Locale, timeString: string) {
  return formatDateForLocale(locale, new Date(`2000-01-01T${timeString}`), {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getWeekdayLabels(
  locale: Locale,
  width: "short" | "narrow" = "short",
) {
  const formatter = new Intl.DateTimeFormat(getLocaleTag(locale), {
    weekday: width,
  });
  const monday = new Date(2024, 0, 1);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return formatter.format(date);
  });
}

export const translations = {
  en: {
    header: {
      nav: {
        home: "Home",
        portfolio: "Portfolio",
        about: "About",
        contact: "Contact",
        tattoos: "Tattoos",
        designs: "Designs",
        art: "Art",
      },
      chooseLanguage: "Choose language",
      toggleMenu: "Toggle menu",
      closeMenu: "Close menu",
      closeMenuPanel: "Close menu panel",
      switchLanguage: (language: string) => `Switch language to ${language}`,
    },
    footer: {
      tagline: "Artistry in every needle. Stories in every line.",
      copyright: "© 2014 THINK.BEFORE.YOU.INK. All rights reserved.",
    },
    home: {
      heroTitle: "Think.Before.You.Ink",
      heroDescription:
        "Custom tattoos connecting history and modern art. Specializing in Arabic calligraphy, Mesopotamian symbols, and elegant fine line art.",
      bookNow: "Book Now",
      upcomingEvent: "Upcoming Event",
      upcomingEvents: "Upcoming Events",
      viewUpcomingEvent: "View Upcoming Event",
      viewUpcomingEvents: "View Upcoming Events",
      openEventPage: "Open event page",
      visitHost: (host: string) => `Visit ${host}`,
      heroImageAlt: "Besho Tattoo Artist at Work",
    },
    about: {
      title: "About Me",
      paragraphs: [
        "My journey into the world of tattooing began on June 16, 2013. Since then, I have been dedicated to perfecting my craft and blending cultural heritage with modern aesthetics.",
        "I create tattoos that connect history and modern art. My work is inspired by Arabic calligraphy, Mesopotamian symbols, and ancient traditions, combined with the clean elegance of fine line tattooing.",
      ],
      offeringsTitle: "What I Offer",
      offerings: [
        {
          title: "Fine Line Tattoos",
          description: "modern, minimal, timeless.",
        },
        {
          title: "Arabic & Mesopotamian-Inspired Art",
          description: "cultural depth, ancient meaning.",
        },
        {
          title: "Creative Freehand Designs",
          description: "drawn directly for you, one of a kind.",
        },
        {
          title: "Cover-Ups",
          description: "transforming old ink into new art.",
        },
        {
          title: "Small Tattoos & Special Requests",
          description: "playful details, personal symbols.",
        },
      ],
      appointmentsTitle: "Appointments Only",
      appointmentsText:
        "Every tattoo is personal. That's why I work only by appointment – to give it the time it deserves, the attention, and a design that's truly yours.",
      seoTitle:
        "Looking for a fine line tattoo artist who specializes in Arabic tattoos, Mesopotamian-inspired tattoos, and custom creative designs?",
      seoDescription:
        "I create tattoos that connect history, cultural symbolism, and modern fine line aesthetics.",
      seoPortfolio:
        "I offer exclusive, appointment-based tattoos that combine ancient traditions with modern fine line art globally.",
    },
    contact: {
      title: "Get in Touch",
      description:
        "I am a mobile tattoo artist, traveling internationally to create art and participate in global exhibitions. Catch me in my next destination.",
      imageAlt: "Tattoo artist at work",
    },
    contactInfo: {
      heading: "Contact Information",
      intro:
        "Ready to start your tattoo journey? Get in touch with us to discuss your ideas and schedule a consultation.",
      loading: "Loading...",
      labels: {
        address: "Studio Location",
        phone: "Phone",
        email: "Email",
        hours: "Hours",
        social: "Instagram",
      },
      eyebrows: {
        address: "Location",
        phone: "Phone",
        email: "Email",
        hours: "Availability",
        social: "Instagram",
      },
      defaultAddress: "Vienna, Austria\nBy appointment only",
      defaultHours: "By appointment only\nTuesday - Saturday",
    },
    portfolio: {
      heading: "Portfolio",
      sections: {
        tattoos: {
          title: "Tattoos",
          helper: "Explore tattoo work by style and category.",
        },
        designs: {
          title: "Designs",
          helper: "Original concepts and design studies.",
        },
        art: {
          title: "Art",
          helper: "Independent art and visual work.",
        },
      },
      labels: {
        tattoo: "Tattoo",
        designs: "Designs",
        art: "Art",
        all: "All",
        untitled: "Untitled",
      },
      loading: "Loading portfolio...",
      errorTitle: "Unable to Load Portfolio",
      errorMessage:
        "The portfolio could not be loaded right now. Please try again.",
      retry: "Try Again",
      openTattoos: "Open Tattoos",
      noWorksYet: "No Works Yet",
      noCategoryItems: (category: string) =>
        `There are no public items available in the ${category} tattoo category right now.`,
      noCollectionItems: (collection: string) =>
        `There are no public items available in the ${collection} collection right now.`,
      viewInFullSize: (title: string) => `View ${title} in full size`,
      imageAlt: "Portfolio artwork",
      closeImageViewer: "Close image viewer",
      noMediaAvailable: "No media available",
      mediaUnavailable: "Media unavailable",
      missingMedia: "Missing",
      showPreviousMedia: "Show previous media",
      showNextMedia: "Show next media",
      showMedia: (index: number) => `Show media ${index}`,
      videoPreview: (title: string) => `${title} video preview`,
    },
    booking: {
      pageTitle: "Book Your Appointment",
      pageDescription:
        "Select an available date and time for your tattoo consultation or session.",
      completeBooking: "Complete Your Booking",
      oneStepAway: "You're just one step away from booking your appointment",
      loadingAppointmentDetails: "Loading appointment details...",
      chooseDate: "Choose a Date",
      chooseTime: "Choose a Time",
      date: "Date",
      time: "Time",
      duration: "Duration",
      book: "Book",
      stepDate: "Date",
      stepTime: "Time",
      stepBook: "Book",
      monthPrev: "← Prev",
      monthNext: "Next →",
      calendarDescription: "Click on any available date to see time slots",
      loadingSlots: "Loading available slots...",
      failedToLoadAppointments:
        "Failed to load available appointments. Please try again.",
      availableTimes: "Available Times",
      selectDate: "Select a Date",
      choosePreferredTime: "Choose your preferred time slot",
      clickDateWithSlots: "Click on a date with available slots",
      availableTimeSlots: "Available Time Slots:",
      readyToBook: "Ready to book?",
      readyToBookDescription:
        "Click below to provide your contact information and any reference images.",
      continueToBooking: "Continue to Booking",
      selectDateFirst: "Select a Date First",
      selectDateFirstDescription:
        "Choose an available date from the calendar above to see available time slots.",
      slotCount: (count: number) => `${count} slot${count === 1 ? "" : "s"}`,
      moreSlots: (count: number) => `+${count} more`,
      durationHours: (duration: number) =>
        `${duration} hour${duration === 1 ? "" : "s"}`,
      noSlotSelected: "No Time Slot Selected",
      selectSlotFirst: "Please select an appointment slot first",
      backToCalendar: "Back to Calendar",
      fillDetails: "Fill in your details to confirm your appointment for",
      requiredFields: "Please fill in all required fields",
      failedToBook: "Failed to book appointment. Please try again.",
      contactInformation: "Contact Information",
      referenceImage: "Reference Image (Optional)",
      referenceImageDescription:
        "Upload a reference image to help us understand your tattoo vision better.",
      uploadImage: "Click to upload an image",
      uploadFormats: (maxSizeMB: number) =>
        `PNG, JPG, JPEG up to ${maxSizeMB}MB`,
      uploadHelpVision: "Images help us understand your tattoo vision",
      uploadHelpReferences:
        "You can upload photos, drawings, or design references",
      uploadHelpSize: (maxSizeMB: number) =>
        `Maximum file size: ${maxSizeMB}MB`,
      previewAlt: "Preview",
      invalidImageFile: "Please select a valid image file",
      fileTooLarge: (maxSizeMB: number) =>
        `File size must be less than ${maxSizeMB}MB`,
      failedToUploadImage: "Failed to upload image",
      appointmentSummary: "Appointment Summary",
      fullName: "Full Name",
      emailAddress: "Email Address",
      phoneNumber: "Phone Number (Optional)",
      phoneDescription: "We may contact you to confirm appointment details",
      additionalNotes: "Additional Notes (Optional)",
      notesDescription:
        "Help us prepare for your appointment by sharing your vision",
      fullNamePlaceholder: "Enter your full name",
      emailPlaceholder: "Enter your email address",
      phonePlaceholder: "Enter your phone number",
      notesPlaceholder:
        "Describe your tattoo ideas, size, placement, style preferences, etc.",
      bookingProgress: "Booking...",
      bookAppointment: "Book Appointment",
      bookingError: "Booking Error",
      noAppointmentSlotSelected: "No appointment slot selected",
      timeSlotUnavailable: "This time slot is no longer available",
      failedToLoadSlot:
        "Failed to load appointment slot. It may no longer be available.",
      bookingConfirmed: "Booking Confirmed!",
      bookingConfirmedDescription:
        "Your appointment has been successfully booked. We'll review your request and send you a confirmation email shortly.",
      meetCreated: "Google Meet Session Created",
      meetDescription:
        "A Google Meet session has been automatically created for your appointment. You can join the call at your scheduled time.",
      joinMeet: "Join Google Meet",
      nextSteps: "What happens next?",
      nextStepReview: "We'll review your booking within 24 hours",
      nextStepEmail: (hasMeetLink: boolean) =>
        `You'll receive a confirmation email with details${hasMeetLink ? " and your Google Meet link" : ""}`,
      nextStepDiscuss: "If we need to discuss your design, we'll reach out",
      nextStepBringId:
        "Please bring your ID and any additional references to your appointment",
      viewPortfolio: "View Our Portfolio",
      bookAnotherAppointment: "Book Another Appointment",
    },
  },
  de: {
    header: {
      nav: {
        home: "Start",
        portfolio: "Portfolio",
        about: "Über mich",
        contact: "Kontakt",
        tattoos: "Tattoos",
        designs: "Designs",
        art: "Kunst",
      },
      chooseLanguage: "Sprache wählen",
      toggleMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
      closeMenuPanel: "Menübereich schließen",
      switchLanguage: (language: string) => `Sprache auf ${language} umstellen`,
    },
    footer: {
      tagline: "Kunst in jeder Nadel. Geschichten in jeder Linie.",
      copyright: "© 2014 THINK.BEFORE.YOU.INK. Alle Rechte vorbehalten.",
    },
    home: {
      heroTitle: "Think.Before.You.Ink",
      heroDescription:
        "Individuelle Tattoos, die Geschichte und moderne Kunst verbinden. Mit Fokus auf arabische Kalligrafie, mesopotamische Symbole und elegante Fine-Line-Arbeit.",
      bookNow: "Jetzt buchen",
      upcomingEvent: "Kommendes Event",
      upcomingEvents: "Kommende Events",
      viewUpcomingEvent: "Kommendes Event ansehen",
      viewUpcomingEvents: "Kommende Events ansehen",
      openEventPage: "Eventseite öffnen",
      visitHost: (host: string) => `${host} besuchen`,
      heroImageAlt: "Besho Tattoo Artist bei der Arbeit",
    },
    about: {
      title: "Über mich",
      paragraphs: [
        "Meine Reise in die Welt des Tätowierens begann am 16. Juni 2013. Seitdem widme ich mich der Perfektion meines Handwerks und der Verbindung von kulturellem Erbe mit moderner Ästhetik.",
        "Ich erschaffe Tattoos, die Geschichte und moderne Kunst zusammenbringen. Meine Arbeiten sind inspiriert von arabischer Kalligrafie, mesopotamischen Symbolen und alten Traditionen, kombiniert mit der klaren Eleganz von Fine-Line-Tätowierungen.",
      ],
      offeringsTitle: "Was ich anbiete",
      offerings: [
        {
          title: "Fine-Line-Tattoos",
          description: "modern, minimalistisch, zeitlos.",
        },
        {
          title: "Arabisch & mesopotamisch inspirierte Kunst",
          description: "kulturelle Tiefe, alte Bedeutung.",
        },
        {
          title: "Kreative Freehand-Designs",
          description: "direkt für dich gezeichnet, einzigartig.",
        },
        {
          title: "Cover-ups",
          description: "altes Ink in neue Kunst verwandeln.",
        },
        {
          title: "Kleine Tattoos & besondere Wünsche",
          description: "spielerische Details, persönliche Symbole.",
        },
      ],
      appointmentsTitle: "Nur nach Termin",
      appointmentsText:
        "Jedes Tattoo ist persönlich. Deshalb arbeite ich ausschließlich nach Termin – mit der Zeit, der Aufmerksamkeit und dem Design, das dein Motiv verdient.",
      seoTitle:
        "Du suchst einen Fine-Line-Tattoo-Artist mit Fokus auf arabische Tattoos, mesopotamisch inspirierte Motive und individuelle Designs?",
      seoDescription:
        "Ich erschaffe Tattoos, die Geschichte, kulturelle Symbolik und moderne Fine-Line-Ästhetik miteinander verbinden.",
      seoPortfolio:
        "Ich biete exklusive Tattoos nur nach Termin an, die alte Traditionen mit moderner Fine-Line-Kunst weltweit verbinden.",
    },
    contact: {
      title: "Kontakt",
      description:
        "Ich arbeite als mobiler Tattoo-Artist und reise international, um Kunst zu schaffen und an Ausstellungen teilzunehmen. Triff mich an meinem nächsten Ziel.",
      imageAlt: "Tattoo Artist bei der Arbeit",
    },
    contactInfo: {
      heading: "Kontaktinformationen",
      intro:
        "Bereit für dein Tattoo? Schreib uns, um deine Idee zu besprechen und einen Termin für deine Beratung zu vereinbaren.",
      loading: "Lädt...",
      labels: {
        address: "Studio-Standort",
        phone: "Telefon",
        email: "E-Mail",
        hours: "Zeiten",
        social: "Instagram",
      },
      eyebrows: {
        address: "Standort",
        phone: "Telefon",
        email: "E-Mail",
        hours: "Verfügbarkeit",
        social: "Instagram",
      },
      defaultAddress: "Wien, Österreich\nNur nach Termin",
      defaultHours: "Nur nach Termin\nDienstag - Samstag",
    },
    portfolio: {
      heading: "Portfolio",
      sections: {
        tattoos: {
          title: "Tattoos",
          helper: "Entdecke Tattoo-Arbeiten nach Stil und Kategorie.",
        },
        designs: {
          title: "Designs",
          helper: "Originale Konzepte und Designstudien.",
        },
        art: {
          title: "Kunst",
          helper: "Freie Kunst und visuelle Arbeiten.",
        },
      },
      labels: {
        tattoo: "Tattoo",
        designs: "Designs",
        art: "Kunst",
        all: "Alle",
        untitled: "Ohne Titel",
      },
      loading: "Portfolio wird geladen...",
      errorTitle: "Portfolio konnte nicht geladen werden",
      errorMessage:
        "Das Portfolio konnte gerade nicht geladen werden. Bitte versuche es erneut.",
      retry: "Erneut versuchen",
      openTattoos: "Tattoos öffnen",
      noWorksYet: "Noch keine Arbeiten",
      noCategoryItems: (category: string) =>
        `Aktuell sind keine öffentlichen Arbeiten in der Tattoo-Kategorie ${category} verfügbar.`,
      noCollectionItems: (collection: string) =>
        `Aktuell sind keine öffentlichen Arbeiten in der Kollektion ${collection} verfügbar.`,
      viewInFullSize: (title: string) => `${title} in voller Größe ansehen`,
      imageAlt: "Portfolio-Arbeit",
      closeImageViewer: "Bildansicht schließen",
      noMediaAvailable: "Keine Medien verfügbar",
      mediaUnavailable: "Medium nicht verfügbar",
      missingMedia: "Fehlt",
      showPreviousMedia: "Vorheriges Medium anzeigen",
      showNextMedia: "Nächstes Medium anzeigen",
      showMedia: (index: number) => `Medium ${index} anzeigen`,
      videoPreview: (title: string) => `${title} Videovorschau`,
    },
    booking: {
      pageTitle: "Termin buchen",
      pageDescription:
        "Wähle ein verfügbares Datum und eine Uhrzeit für deine Tattoo-Beratung oder Session.",
      completeBooking: "Buche deinen Termin",
      oneStepAway: "Du bist nur noch einen Schritt von deinem Termin entfernt",
      loadingAppointmentDetails: "Termindetails werden geladen...",
      chooseDate: "Datum wählen",
      chooseTime: "Uhrzeit wählen",
      date: "Datum",
      time: "Uhrzeit",
      duration: "Dauer",
      book: "Buchen",
      stepDate: "Datum",
      stepTime: "Uhrzeit",
      stepBook: "Buchen",
      monthPrev: "← Zurück",
      monthNext: "Weiter →",
      calendarDescription:
        "Klicke auf ein verfügbares Datum, um freie Zeiten zu sehen",
      loadingSlots: "Verfügbare Zeiten werden geladen...",
      failedToLoadAppointments:
        "Verfügbare Termine konnten nicht geladen werden. Bitte versuche es erneut.",
      availableTimes: "Verfügbare Zeiten",
      selectDate: "Datum auswählen",
      choosePreferredTime: "Wähle deine bevorzugte Uhrzeit",
      clickDateWithSlots: "Klicke auf ein Datum mit verfügbaren Zeiten",
      availableTimeSlots: "Verfügbare Zeitfenster:",
      readyToBook: "Bereit zum Buchen?",
      readyToBookDescription:
        "Klicke unten, um deine Kontaktdaten und eventuelle Referenzbilder anzugeben.",
      continueToBooking: "Weiter zur Buchung",
      selectDateFirst: "Bitte zuerst ein Datum wählen",
      selectDateFirstDescription:
        "Wähle oben im Kalender ein verfügbares Datum, um freie Zeiten zu sehen.",
      slotCount: (count: number) => `${count} Slot${count === 1 ? "" : "s"}`,
      moreSlots: (count: number) => `+${count} weitere`,
      durationHours: (duration: number) =>
        `${duration} Stunde${duration === 1 ? "" : "n"}`,
      noSlotSelected: "Kein Zeitfenster ausgewählt",
      selectSlotFirst: "Bitte wähle zuerst ein Terminfenster aus",
      backToCalendar: "Zurück zum Kalender",
      fillDetails: "Fülle deine Daten aus, um deinen Termin zu bestätigen für",
      requiredFields: "Bitte fülle alle Pflichtfelder aus",
      failedToBook:
        "Der Termin konnte nicht gebucht werden. Bitte versuche es erneut.",
      contactInformation: "Kontaktdaten",
      referenceImage: "Referenzbild (optional)",
      referenceImageDescription:
        "Lade ein Referenzbild hoch, damit wir deine Tattoo-Idee besser verstehen.",
      uploadImage: "Klicke, um ein Bild hochzuladen",
      uploadFormats: (maxSizeMB: number) => `PNG, JPG, JPEG bis ${maxSizeMB}MB`,
      uploadHelpVision:
        "Bilder helfen uns, deine Tattoo-Idee besser zu verstehen",
      uploadHelpReferences:
        "Du kannst Fotos, Zeichnungen oder Design-Referenzen hochladen",
      uploadHelpSize: (maxSizeMB: number) =>
        `Maximale Dateigröße: ${maxSizeMB}MB`,
      previewAlt: "Vorschau",
      invalidImageFile: "Bitte wähle eine gültige Bilddatei aus",
      fileTooLarge: (maxSizeMB: number) =>
        `Die Datei muss kleiner als ${maxSizeMB}MB sein`,
      failedToUploadImage: "Bild konnte nicht hochgeladen werden",
      appointmentSummary: "Terminübersicht",
      fullName: "Vollständiger Name",
      emailAddress: "E-Mail-Adresse",
      phoneNumber: "Telefonnummer (optional)",
      phoneDescription:
        "Wir können dich kontaktieren, um Termindetails zu bestätigen",
      additionalNotes: "Zusätzliche Notizen (optional)",
      notesDescription:
        "Hilf uns bei der Vorbereitung, indem du deine Idee genauer beschreibst",
      fullNamePlaceholder: "Gib deinen vollständigen Namen ein",
      emailPlaceholder: "Gib deine E-Mail-Adresse ein",
      phonePlaceholder: "Gib deine Telefonnummer ein",
      notesPlaceholder:
        "Beschreibe deine Tattoo-Idee, Größe, Platzierung, Stilwünsche usw.",
      bookingProgress: "Buchung läuft...",
      bookAppointment: "Termin buchen",
      bookingError: "Buchungsfehler",
      noAppointmentSlotSelected: "Kein Terminfenster ausgewählt",
      timeSlotUnavailable: "Dieses Zeitfenster ist nicht mehr verfügbar",
      failedToLoadSlot:
        "Das Terminfenster konnte nicht geladen werden. Es ist möglicherweise nicht mehr verfügbar.",
      bookingConfirmed: "Buchung bestätigt!",
      bookingConfirmedDescription:
        "Dein Termin wurde erfolgreich gebucht. Wir prüfen deine Anfrage und senden dir in Kürze eine Bestätigungs-E-Mail.",
      meetCreated: "Google-Meet-Session erstellt",
      meetDescription:
        "Für deinen Termin wurde automatisch eine Google-Meet-Session erstellt. Du kannst dem Gespräch zum vereinbarten Zeitpunkt beitreten.",
      joinMeet: "Google Meet beitreten",
      nextSteps: "Wie geht es weiter?",
      nextStepReview: "Wir prüfen deine Buchung innerhalb von 24 Stunden",
      nextStepEmail: (hasMeetLink: boolean) =>
        `Du erhältst eine Bestätigungs-E-Mail mit allen Details${hasMeetLink ? " und deinem Google-Meet-Link" : ""}`,
      nextStepDiscuss:
        "Wenn wir dein Design besprechen müssen, melden wir uns bei dir",
      nextStepBringId:
        "Bitte bringe zu deinem Termin einen Ausweis und eventuelle Referenzen mit",
      viewPortfolio: "Portfolio ansehen",
      bookAnotherAppointment: "Weiteren Termin buchen",
    },
  },
} as const;

export type TranslationDictionary = (typeof translations)[Locale];
