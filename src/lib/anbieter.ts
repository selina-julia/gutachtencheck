/**
 * Angaben zum Anbieter für Impressum und Datenschutzerklärung.
 *
 * ACHTUNG: Die Werte mit dem Präfix "TODO" sind Platzhalter und stehen so auf
 * der veröffentlichten Seite. Sie müssen vor dem Livegang durch die echten
 * Angaben ersetzt werden – ein unvollständiges Impressum ist in Österreich
 * nach § 5 ECG verwaltungsstrafbewehrt.
 */
export const anbieter = {
  name: "ATTESSA GmbH",
  geschaeftsfuehrer: "Christian Bäunard",
  strasse: "Wiener Bundesstraße 181",
  plzOrt: "4050 Traun",
  land: "Österreich",
  email: "office@attessa.at",
  telefon: "0732 944 603",
  telefonLink: "+437329446 03",
  uid: "ATU 68188604",
  firmenbuchnummer: "FN 403797 w",
  /** Sitz Traun liegt im Sprengel des Landesgerichts Linz – bitte prüfen. */
  firmenbuchgericht: "Landesgericht Linz",
  /** Traun gehört zum Bezirk Linz-Land – bitte prüfen. */
  gewerbebehoerde: "Bezirkshauptmannschaft Linz-Land",
  kammer: "Wirtschaftskammer Oberösterreich, TODO: Fachgruppe",
  /** Die Zertifizierung trägt die natürliche Person, nicht die Gesellschaft. */
  sachverstaendiger: "Christian Bäunard",
  sachverstaendigenliste:
    "Eingetragen in der Liste der allgemein beeideten und gerichtlich zertifizierten Sachverständigen (Fachgebiet TODO, Listennummer TODO)",
  hoster: "TODO: Hosting-Anbieter samt Anschrift",
  stand: "September 2026",
} as const;
