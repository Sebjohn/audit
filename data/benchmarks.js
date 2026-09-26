/* =====================================================================
   Ultra Audits — BASE DE BENCHMARKS
   ---------------------------------------------------------------------
   Règle : aucun chiffre sans source. Faute de source fiable, la ligne
   existe quand même avec val: null → affichée « Benchmark à documenter »,
   pour qu'il suffise d'y renseigner la valeur plus tard.

   Une ligne :
     kpi    indicateur               val    valeur (texte)   range  fourchette
     unit   unité                    bloc   bloc de la fiche où l'afficher
     src    id de la source          year   année des données
     conf   élevée | moyenne | faible
     scope  population concernée     note   précision
     key    true = remonte dans les repères clés en tête de fiche
   Portée (au moins une) :
     sub: [ids de sous-secteurs]   fam: [ids de secteurs]
     naf: "43" (sous-secteurs rattachés à cette division NAF)   all: true
   ===================================================================== */
window.UA = window.UA || {};

UA.sources = {
  bdf: {
    label: "Banque de France — fascicules de résultats sectoriels 2024",
    url: "https://www.banque-france.fr/fr/publications-et-statistiques/statistiques/fascicules-dindicateurs-sectoriels",
    note: "Sociétés à l’IS ayant remis deux bilans consécutifs au fichier FIBEN. Ce sont surtout des PME établies : à lire avec prudence pour une TPE."
  },
  unec: {
    label: "Rapport de branche Coiffure 2024, données 2023 — CNEC / UNEC, étude Xerfi Specific",
    url: "https://unec.fr/wp-content/uploads/2024/12/rapport-de-branche-coiffure-2024-donnees-2023.pdf"
  },
  esth: {
    label: "Rapport de branche Esthétique 2024, données 2023 — étude Xerfi Specific (IDCC 3032)",
    url: "https://www.cnep-france.fr/UPB/wp-content/uploads/2025/01/Rapport-de-Branche-Esthetique-2024-donnees-2023.pdf"
  },
  bpi: {
    label: "Bpifrance Création — fiche activité « Restaurant traditionnel »",
    url: "https://bpifrance-creation.fr/activites-reglementees/restaurant-traditionnel"
  },
  inextenso: {
    label: "In Extenso Tourisme, Culture & Hôtellerie — bilan 2025 (conférence du 6 février 2026), relayé par HR-Infos",
    url: "https://hr-infos.fr/annee-2025-solide-pour-lhotellerie-francaise-et-optimisme-prudent-pour-2026-in-extenso-tch/"
  },
  boulgp: {
    label: "Syndicat des Boulangers du Grand Paris — ratios de gestion observés (février 2026)",
    url: "https://boulangersdugrandparis.com/ratios-de-gestion-observes-en-boulangerie-patisserie/"
  },
  fevad: {
    label: "Fevad — bilan du e-commerce en France 2025",
    url: "https://www.fevad.com/bilan-du-e-commerce-en-france-les-francais-ont-depense-pres-de-200-milliards-deuros-sur-internet-en-2025/"
  }
};

/* ---------------------------------------------------------------------
   Banque de France 2024 — quartiles [Q1, médiane, Q3] par division NAF.
   ca = CA médian (k€), eff = effectif médian.
   --------------------------------------------------------------------- */
UA.bdf = {
  "41": { label: "Construction de bâtiments", ca: 3484, eff: 12,
    dso: [25.4, 51.5, 80.9], dpo: [35.3, 53.6, 77.3], stock: [3.2, 12.7, 40.6], bfr: [-19.6, 7.2, 38.5],
    va: [55.7, 76.1, 110.0], cout: [45.3, 57.0, 72.0], tm: [8.9, 20.3, 36.4], tva: [17.3, 26.6, 38.5] },
  "43": { label: "Travaux de construction spécialisés", ca: 2649, eff: 14,
    dso: [37.3, 61.4, 86.8], dpo: [36.2, 51.4, 71.4], stock: [4.6, 12.5, 26.6], bfr: [2.6, 25.4, 50.3],
    va: [55.8, 70.6, 92.0], cout: [45.0, 53.4, 64.3], tm: [9.8, 18.7, 30.3], tva: [31.8, 39.9, 48.0] },
  "81": { label: "Services relatifs aux bâtiments et aménagement paysager", ca: 2603, eff: 33,
    dso: [43.0, 60.7, 81.2], dpo: [35.8, 54.0, 82.7], bfr: [-13.5, 6.8, 30.8],
    va: [34.4, 46.0, 65.6], cout: [31.0, 37.4, 47.7], tm: [4.7, 12.3, 24.3], tva: [46.6, 62.6, 78.1] },
  "80": { label: "Enquêtes et sécurité", ca: 3169, eff: 40,
    dso: [45.7, 62.6, 84.6], dpo: [36.2, 59.0, 89.8], bfr: [-19.6, 1.2, 24.1],
    va: [34.2, 43.5, 71.1], cout: [32.7, 40.0, 55.4], tm: [0.6, 5.2, 16.8], tva: [45.2, 63.0, 81.8] },
  "49": { label: "Transports terrestres", ca: 3619, eff: 27,
    dso: [38.0, 48.3, 61.1], dpo: [29.1, 41.3, 59.2], bfr: [-8.8, 6.1, 21.1],
    va: [45.1, 57.5, 73.2], cout: [39.5, 45.8, 53.7], tm: [4.8, 17.0, 28.4], tva: [35.0, 43.9, 53.5] },
  "56": { label: "Restauration", ca: 2327, eff: 21,
    dso: [0.0, 1.1, 4.7], dpo: [27.0, 37.6, 59.2], bfr: [-41.0, -28.4, -18.8],
    va: [43.1, 52.4, 66.1], cout: [31.6, 37.8, 47.5], tm: [7.6, 16.5, 26.3], tva: [40.3, 46.7, 53.2],
    mc: [59.2, 70.2, 75.1] },
  "55": { label: "Hébergement", ca: 2437, eff: 16,
    dso: [-4.2, 0.9, 7.9], dpo: [35.1, 57.5, 94.5], bfr: [-61.1, -37.8, -20.0],
    va: [54.2, 77.7, 115.3], cout: [35.4, 41.1, 48.6], tm: [17.0, 35.5, 53.0], tva: [44.7, 54.0, 62.0] },
  "47": { label: "Commerce de détail", ca: 2749, eff: 8,
    dso: [0.9, 4.3, 9.6], dpo: [22.9, 34.3, 47.3], stock: [18.2, 28.6, 49.0], bfr: [-11.0, 0.9, 19.2],
    va: [49.0, 69.2, 99.3], cout: [35.9, 47.8, 66.6], tm: [12.0, 24.0, 35.6], tva: [15.4, 21.3, 25.3],
    mc: [20.6, 27.4, 37.7] },
  "45": { label: "Commerce et réparation d’automobiles", ca: 3041, eff: 9,
    dso: [7.0, 17.3, 34.1], dpo: [21.0, 38.5, 59.9], stock: [31.6, 58.4, 90.0], bfr: [14.6, 38.0, 65.3],
    va: [52.3, 68.1, 92.0], cout: [41.0, 50.0, 60.4], tm: [9.7, 21.6, 34.8], tva: [9.8, 17.4, 29.6],
    mc: [10.5, 16.9, 27.5] },
  "46": { label: "Commerce de gros", ca: 5054, eff: 10,
    dso: [26.7, 42.9, 63.1], dpo: [28.0, 44.3, 65.3], stock: [15.9, 43.1, 82.2], bfr: [10.0, 41.5, 82.9],
    va: [63.3, 92.8, 145.3], cout: [46.5, 60.0, 82.1], tm: [11.0, 27.0, 45.1], tva: [11.4, 18.4, 26.6],
    mc: [18.1, 28.5, 39.0] },
  "62": { label: "Programmation, conseil et services informatiques", ca: 3904, eff: 22,
    dso: [44.4, 65.6, 95.2], dpo: [36.8, 59.4, 93.0], bfr: [-30.3, 0.1, 27.4],
    va: [70.2, 93.4, 130.5], cout: [61.7, 76.5, 96.8], tm: [2.9, 13.3, 27.3], tva: [36.1, 54.7, 71.5] },
  "70": { label: "Sièges sociaux et conseil de gestion", ca: 3297, eff: 15,
    dso: [44.9, 71.9, 110.3], dpo: [36.1, 62.9, 108.3], bfr: [-22.5, 7.1, 42.6],
    va: [77.8, 113.0, 187.0], cout: [64.7, 88.8, 126.4], tm: [3.2, 13.9, 33.1], tva: [35.5, 58.3, 74.8] },
  "73": { label: "Publicité et études de marché", ca: 3668, eff: 15,
    dso: [50.5, 75.7, 107.4], dpo: [39.1, 67.9, 112.5], bfr: [-23.1, 7.8, 35.9],
    va: [66.3, 93.4, 136.4], cout: [54.9, 71.8, 93.9], tm: [3.6, 15.5, 32.5], tva: [25.1, 40.8, 57.0] },
  "69": { label: "Activités juridiques et comptables", ca: 2353, eff: 16,
    dso: [22.0, 71.0, 107.6], dpo: [17.7, 39.4, 75.8], bfr: [-37.3, -10.0, 39.6],
    va: [74.8, 102.7, 148.3], cout: [58.3, 79.8, 113.0], tm: [8.8, 17.1, 27.2], tva: [57.8, 70.7, 78.5] },
  "86": { label: "Activités pour la santé humaine", ca: 2633, eff: 17,
    dso: [5.0, 18.0, 36.8], dpo: [21.7, 39.3, 70.9], bfr: [-24.1, -8.9, 5.0],
    va: [59.6, 120.8, 267.3], cout: [49.1, 76.3, 172.2], tm: [8.0, 17.9, 33.9], tva: [57.9, 69.0, 78.1] },
  "25": { label: "Fabrication de produits métalliques", ca: 3574, eff: 20,
    dso: [39.7, 56.4, 73.6], dpo: [40.7, 54.3, 72.6], stock: [18.7, 40.6, 73.8], bfr: [22.6, 49.8, 83.5],
    va: [57.3, 72.9, 95.5], cout: [45.5, 52.9, 62.6], tm: [10.9, 22.2, 34.2], tva: [33.3, 43.2, 52.6] },
  "10": { label: "Industries alimentaires", ca: 3699, eff: 22,
    dso: [6.0, 28.3, 44.3], dpo: [30.4, 42.8, 61.6], stock: [6.4, 18.4, 43.2], bfr: [-20.7, 10.2, 43.1],
    va: [44.9, 58.9, 82.3], cout: [36.5, 43.6, 52.6], tm: [10.6, 21.2, 34.6], tva: [21.7, 34.4, 48.0] }
};

/* Indicateurs Banque de France : où les afficher, et comment. */
UA.bdfMetrics = {
  dso:   { kpi: "Délai de paiement clients (DSO)", unit: "jours de CA TTC", bloc: "gest.recouvrement", key: true, fmt: "j" },
  dpo:   { kpi: "Délai de paiement fournisseurs", unit: "jours d’achats TTC", bloc: "gest.tresorerie", fmt: "j" },
  bfr:   { kpi: "BFR d’exploitation", unit: "jours de CA HT", bloc: "gest.tresorerie", fmt: "j" },
  stock: { kpi: "Stocks", unit: "jours de CA HT", bloc: "gest.tresorerie", fmt: "j" },
  va:    { kpi: "Valeur ajoutée par salarié", unit: "k€ par an", bloc: "eco.productivite", key: true, fmt: "k" },
  cout:  { kpi: "Coût moyen d’un salarié", unit: "k€ par an, charges comprises", bloc: "hum.rh", fmt: "k" },
  tva:   { kpi: "Taux de valeur ajoutée", unit: "% du CA HT", bloc: "eco.marges", fmt: "%" },
  tm:    { kpi: "Taux de marge", unit: "EBE ÷ valeur ajoutée", bloc: "eco.marges", fmt: "%" },
  mc:    { kpi: "Taux de marge commerciale", unit: "% des ventes de marchandises", bloc: "eco.marges", fmt: "%" }
};

/* ---------------------------------------------------------------------
   Benchmarks spécifiques (sources métier) et benchmarks à documenter.
   --------------------------------------------------------------------- */
UA.benchmarks = [

  /* Coiffure — UNEC, données 2023 */
  { fam: ["coiffure"], kpi: "Frais de personnel", val: "55 %", unit: "du CA", bloc: "hum.rh", key: true,
    src: "unec", year: 2023, conf: "élevée", scope: "Salons de coiffure, France", note: "58,6 % en 2022" },
  { fam: ["coiffure"], kpi: "EBE", val: "5,9 %", unit: "du CA", bloc: "eco.marges", key: true,
    src: "unec", year: 2023, conf: "élevée", scope: "Salons de coiffure, France", note: "≈ 9 % sur 2018-2020, 7 % en 2022" },
  { fam: ["coiffure"], kpi: "Produits consommés (couleur, mèches, soins)", val: "12,3 %", unit: "du CA", bloc: "eco.marges",
    src: "unec", year: 2023, conf: "élevée", scope: "Salons de coiffure, France" },
  { fam: ["coiffure"], kpi: "Autres achats et charges externes", val: "25,8 %", unit: "du CA", bloc: "eco.marges",
    src: "unec", year: 2023, conf: "élevée", scope: "Salons de coiffure, France" },
  { fam: ["coiffure"], kpi: "Vente de produits (revente)", val: "10 %", unit: "du CA", bloc: "eco.ca", key: true,
    src: "unec", year: 2023, conf: "élevée", scope: "Salons de coiffure, France", note: "prestations : 86 % du CA" },
  { fam: ["coiffure"], kpi: "Prestations pour la clientèle féminine", val: "70 %", unit: "du CA", bloc: "eco.ca",
    src: "unec", year: 2023, conf: "élevée", scope: "Salons de coiffure, France" },
  { fam: ["coiffure"], kpi: "Fiche moyenne femme, hors ventes", val: "55,4 €", unit: "TTC", bloc: "eco.pricing", key: true,
    src: "unec", year: 2023, conf: "élevée", scope: "Ensemble des salons", note: "51,4 € en 2022" },
  { fam: ["coiffure"], kpi: "Fiche moyenne homme, hors ventes", val: "26,4 €", unit: "TTC", bloc: "eco.pricing",
    src: "unec", year: 2023, conf: "élevée", scope: "Ensemble des salons", note: "23,3 € en 2022" },
  { fam: ["coiffure"], kpi: "Shampooing-coupe-coiffage", val: "39,3 € femme · 25,7 € homme", unit: "TTC, prix moyen", bloc: "eco.pricing",
    src: "unec", year: 2023, conf: "élevée", scope: "Ensemble des salons" },
  { fam: ["coiffure"], kpi: "Salons ayant une prime à la revente", val: "64 %", unit: "des établissements", bloc: "hum.rh",
    src: "unec", year: 2023, conf: "élevée", scope: "Salons employeurs" },
  { sub: ["independant"], kpi: "Fiche moyenne — salons indépendants", val: "54,3 € femme · 25,5 € homme", unit: "TTC, hors ventes", bloc: "eco.pricing",
    src: "unec", year: 2023, conf: "moyenne", scope: "Salons indépendants", note: "lecture du graphique « détail selon les types d’établissements »" },
  { sub: ["enseigne"], kpi: "Fiche moyenne — salons sous enseigne", val: "57,2 € femme · 27,6 € homme", unit: "TTC, hors ventes", bloc: "eco.pricing",
    src: "unec", year: 2023, conf: "moyenne", scope: "Salons sous enseigne", note: "lecture du graphique « détail selon les types d’établissements »" },
  { sub: ["domicile"], kpi: "Fiche moyenne — coiffure à domicile", val: "47,8 € femme · 21,7 € homme", unit: "TTC, hors ventes", bloc: "eco.pricing",
    src: "unec", year: 2023, conf: "moyenne", scope: "Coiffeurs à domicile", note: "lecture du graphique « détail selon les types d’établissements »" },
  { fam: ["coiffure"], kpi: "Taux d’occupation de l’agenda", val: null, bloc: "eco.productivite" },
  { fam: ["coiffure"], kpi: "Taux de rebooking en sortie de salon", val: null, bloc: "acq.fidelisation" },

  /* Esthétique — rapport de branche, données 2023 */
  { fam: ["esthetique"], kpi: "CA moyen d’une entreprise sans salarié", val: "50 k€", unit: "par an", bloc: "eco.ca", key: true,
    src: "esth", year: 2023, conf: "élevée", scope: "Entreprises de la branche sans salarié" },
  { fam: ["esthetique"], kpi: "Répartition du CA, entreprises sans salarié", val: "épilation cire 29 % · soins visage 22,5 % · soins corps 15,5 % · cosmétiques 12 %", bloc: "eco.ca",
    src: "esth", year: 2023, conf: "moyenne", scope: "Entreprises de la branche sans salarié", note: "lecture du tableau de répartition du rapport" },
  { fam: ["esthetique"], kpi: "Taux d’occupation des cabines", val: null, bloc: "eco.productivite" },
  { fam: ["esthetique"], kpi: "CA par heure de cabine", val: null, bloc: "eco.pricing" },
  { sub: ["onglerie"], kpi: "Prix moyen d’une pose complète", val: null, bloc: "eco.pricing" },
  { sub: ["massage"], kpi: "Massages par praticien et par jour", val: null, bloc: "eco.productivite" },
  { sub: ["spa"], kpi: "Occupation de l’espace humide par créneau", val: null, bloc: "eco.productivite" },

  /* Restauration */
  { sub: ["traditionnel", "cafebar"], kpi: "Marge sur consommation — solides", val: "≈ 70 %", unit: "soit un coût matière ≈ 30 %", bloc: "eco.marges", key: true,
    src: "bpi", conf: "moyenne", scope: "Restauration traditionnelle", note: "taux « en général » constaté, sans année précisée" },
  { sub: ["traditionnel", "cafebar"], kpi: "Marge sur consommation — liquides", val: "≈ 85 %", unit: "soit un coût matière ≈ 15 %", bloc: "eco.marges", key: true,
    src: "bpi", conf: "moyenne", scope: "Restauration traditionnelle", note: "taux « en général » constaté, sans année précisée" },
  { sub: ["rapide"], kpi: "Ratio matière en restauration rapide", val: null, bloc: "eco.marges" },
  { sub: ["traiteur"], kpi: "Coût par convive", val: null, bloc: "eco.marges" },
  { sub: ["traiteur"], kpi: "Taux de transformation des devis", val: null, bloc: "gest.devis" },

  /* Hôtellerie — In Extenso, 2025 */
  { sub: ["hotel"], kpi: "Taux d’occupation", val: "64 %", unit: "moyenne France", bloc: "eco.productivite", key: true,
    src: "inextenso", year: 2025, conf: "élevée", scope: "Hôtellerie française",
    note: "super-éco 61 % · économique 62 % · milieu de gamme 67 % · haut de gamme-luxe 67 % · Paris 82 %" },
  { sub: ["hotel"], kpi: "Prix moyen par chambre vendue", val: "62 € à 369 € selon la gamme", bloc: "eco.pricing", key: true,
    src: "inextenso", year: 2025, conf: "élevée", scope: "Hôtellerie française",
    note: "super-éco 62 € · économique 82 € · milieu de gamme 139 € · haut de gamme-luxe 369 € · Paris 239 €" },
  { sub: ["hotel"], kpi: "RevPAR", val: "38 € à 247 € selon la gamme", bloc: "eco.pricing",
    src: "inextenso", year: 2025, conf: "élevée", scope: "Hôtellerie française",
    note: "super-éco 38 € · économique 53 € · milieu de gamme 93 € · haut de gamme-luxe 247 € · Paris 195 €" },
  { sub: ["hebergement"], kpi: "Taux d’occupation des gîtes et chambres d’hôtes", val: null, bloc: "eco.productivite" },

  /* Boulangerie — Syndicat des Boulangers du Grand Paris, 2026 */
  { sub: ["boulangerie"], kpi: "Taux de marge brute", val: "67 – 78 %", unit: "du CA HT", bloc: "eco.marges", key: true,
    src: "boulgp", year: 2026, conf: "moyenne", scope: "Boulangeries du Grand Paris, comparaison province", note: "73 – 78 % à Paris, 67 – 73 % en province" },
  { sub: ["boulangerie"], kpi: "Charges externes", val: "18 – 22 %", unit: "du CA HT, hors salaires et taxes", bloc: "eco.marges",
    src: "boulgp", year: 2026, conf: "moyenne", scope: "Boulangeries du Grand Paris" },
  { sub: ["boulangerie"], kpi: "Loyer commercial", val: "≈ 7 %", unit: "du CA HT", bloc: "eco.marges",
    src: "boulgp", year: 2026, conf: "moyenne", scope: "Boulangeries du Grand Paris" },
  { sub: ["boulangerie"], kpi: "Énergie : électricité, gaz, eau, carburant", val: "≈ 3 %", unit: "du CA HT", bloc: "eco.marges",
    src: "boulgp", year: 2026, conf: "moyenne", scope: "Contrats négociés par le syndicat" },
  { sub: ["boulangerie"], kpi: "CA par personne", val: "80 000 – 90 000 €", unit: "TTC par an, tout le personnel", bloc: "eco.productivite", key: true,
    src: "boulgp", year: 2026, conf: "moyenne", scope: "Boulangeries du Grand Paris" },
  { sub: ["boulangerie"], kpi: "Productivité d’un boulanger", val: "28 – 33 quintaux", unit: "de farine par mois", bloc: "eco.productivite",
    src: "boulgp", year: 2026, conf: "moyenne", scope: "Boulangeries du Grand Paris", note: "selon les variétés de pain" },
  { sub: ["boulangerie"], kpi: "Personnel de vente", val: "1 vendeur pour 180 000 – 210 000 €", unit: "de CA TTC annuel", bloc: "hum.rh",
    src: "boulgp", year: 2026, conf: "moyenne", scope: "Boulangeries du Grand Paris" },
  { sub: ["boulangerie"], kpi: "Valeur du fonds", val: "≈ 90 %", unit: "du CA HT", bloc: "eco.valorisation", key: true,
    src: "boulgp", year: 2026, conf: "moyenne", scope: "Boulangeries du Grand Paris", note: "en baisse : auparavant ≈ 100 % ; varie selon l’emplacement" },

  /* E-commerce — Fevad 2025 */
  { sub: ["ecommerce"], kpi: "Panier moyen en ligne", val: "62 €", unit: "tous achats en ligne", bloc: "eco.pricing", key: true,
    src: "fevad", year: 2025, conf: "élevée", scope: "Ensemble des achats en ligne en France, produits et services", note: "−3 % sur un an" },
  { sub: ["ecommerce"], kpi: "Taux de conversion d’un site marchand", val: null, bloc: "acq.tunnel" },

  /* Benchmarks à documenter, par métier */
  { fam: ["btp"], kpi: "Taux de transformation des devis", val: null, bloc: "gest.devis" },
  { fam: ["btp"], kpi: "Heures facturables ÷ heures payées", val: null, bloc: "eco.productivite" },
  { fam: ["nettoyage"], kpi: "Taux horaire moyen facturé", val: null, bloc: "eco.pricing" },
  { fam: ["nettoyage"], kpi: "Part du CA sous contrat récurrent", val: null, bloc: "eco.ca" },
  { sub: ["demenagement"], kpi: "Taux de transformation des devis", val: null, bloc: "gest.devis" },
  { sub: ["transport"], kpi: "Part des kilomètres à vide", val: null, bloc: "eco.productivite" },
  { sub: ["auto"], kpi: "Marge brute par véhicule d’occasion", val: null, bloc: "eco.marges" },
  { sub: ["conseil", "agencemkt", "agenceia", "coaching"], kpi: "Taux d’occupation facturable", val: null, bloc: "eco.productivite" },
  { sub: ["conseil", "esn"], kpi: "TJM moyen par profil", val: null, bloc: "eco.pricing" },
  { sub: ["esn"], kpi: "Taux d’intercontrat", val: null, bloc: "eco.productivite" },
  { sub: ["agencemkt", "agenceia"], kpi: "Part des contrats mensuels récurrents", val: null, bloc: "eco.ca" },
  { sub: ["avocat"], kpi: "Taux de recouvrement des honoraires", val: null, bloc: "gest.recouvrement" },
  { sub: ["medecin", "kine"], kpi: "Consultations ou séances par jour", val: null, bloc: "eco.productivite" },
  { fam: ["industrie"], kpi: "TRS moyen du secteur", val: null, bloc: "eco.productivite" },
  { sub: ["agenceimmo"], kpi: "Part des mandats exclusifs", val: null, bloc: "eco.productivite" },
  { sub: ["agenceimmo"], kpi: "Taux d’honoraires moyen pratiqué", val: null, bloc: "eco.pricing" },

  /* Valorisation : à documenter partout où aucune source n'existe encore */
  { all: true, fallback: true, kpi: "Multiple d’EBE constaté dans les transactions du secteur", val: null, bloc: "eco.valorisation" }
];
