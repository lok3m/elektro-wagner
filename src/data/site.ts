export const site = {
  name: 'Elektro Wagner GmbH',
  shortName: 'Elektro Wagner',
  claim: 'Elektriker in Göttingen und Region',
  street: 'Weenderstraße 44',
  zip: '37073',
  city: 'Göttingen',
  phoneDisplay: '0551 456 789',
  phoneTel: '+49551456789',
  email: 'info@elektro-wagner.de',
  hours: 'Mo bis Fr 07:30 bis 17:30 Uhr',
  emergency: 'Notdienst rund um die Uhr, 7 Tage die Woche',
  founded: 2004,
  years: 22,
} as const;

export const services = [
  {
    title: 'Elektroinstallation',
    text: 'Neubau, Umbau und Sanierung. Komplette Anlagen nach VDE, geprüft und dokumentiert.',
  },
  {
    title: 'Photovoltaik',
    text: 'Planung, Montage und Inbetriebnahme von Solaranlagen, inklusive Speicher und Anmeldung beim Netzbetreiber.',
  },
  {
    title: 'Smart Home',
    text: 'Licht, Heizung und Sicherheit vernetzt. KNX und Zigbee, per App oder Taster steuerbar.',
  },
  {
    title: 'Sicherheitstechnik',
    text: 'Einbruchmeldeanlagen, Videoüberwachung und Zutrittskontrolle für Wohnhaus und Gewerbe.',
  },
  {
    title: 'Reparaturen',
    text: 'Defekte Steckdose, Kurzschluss, Ausfall der Beleuchtung. Schnelle Diagnose, dauerhafte Lösung.',
  },
  {
    title: 'Notdienst 24h',
    text: 'Stromausfall oder Kurzschluss ohne Vorwarnung. Ein Anruf, wir sind unterwegs.',
  },
] as const;

export const steps = [
  {
    title: 'Anfrage',
    text: 'Per Formular oder Telefon. Wir melden uns innerhalb eines Werktags.',
  },
  {
    title: 'Besichtigung',
    text: 'Wir kommen vorbei und sehen uns die Situation an. Kostenlos und unverbindlich.',
  },
  {
    title: 'Festpreisangebot',
    text: 'Sie erhalten ein schriftliches Angebot mit festem Preis. Keine versteckten Kosten.',
  },
  {
    title: 'Ausführung',
    text: 'Sauber, pünktlich, nach Norm. Am Ende räumen wir auf und übergeben die Prüfprotokolle.',
  },
] as const;
