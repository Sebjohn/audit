/* =====================================================================
   Ultra Audits — MODULES ÉCONOMIQUES
   ---------------------------------------------------------------------
   Un module décrit un modèle économique récurrent. Chaque sous-secteur
   en déclare un ou plusieurs (le premier est le modèle principal).

     formula : facteurs du modèle (k = facteur, d = définition courte)
     unit    : unité productive par défaut (le sous-secteur peut la préciser)
     kpis    : indicateurs à suivre — jour / semaine / mois
     flow    : étapes du tunnel propres au modèle
     profile : exemple chiffré illustratif utilisé par les démonstrations
               (ca = chiffre d'affaires, mcv = taux de marge sur coûts
               variables, rm = résultat ÷ CA de l'exemple)
     inject  : items ajoutés aux blocs de la méthodologie (même format)
   ===================================================================== */
window.UA = window.UA || {};

UA.modules = {

  capacite: {
    label: "Activité à capacité physique", short: "Capacité",
    formula: [
      { k: "Capacité", d: "unités × créneaux par jour" },
      { k: "Taux d’occupation", d: "créneaux vendus ÷ créneaux disponibles" },
      { k: "Prix", d: "CA moyen par créneau vendu" },
      { k: "Temps", d: "jours d’ouverture par an" }
    ],
    unit: "poste",
    kpis: {
      jour: ["Taux de remplissage du planning", "CA du jour par unité"],
      semaine: ["Taux d’occupation par unité et par praticien", "Annulations et rendez-vous non honorés"],
      mois: ["CA par unité productive", "Panier moyen", "Fréquence de visite"]
    },
    flow: ["Audience", "Demande", "Réservation", "Venue honorée", "Client", "Client régulier"],
    profile: { units: 4, slots: 8, slot: "heure", days: 250, occ: 0.55, occTarget: 0.70, price: 60,
               mcv: 0.85, rm: 0.055, basket: 55, freq: 5, years: 4, dso: 0 },
    inject: {
      "eco.productivite": [
        { calc: "Capacité théorique", f: "unités × créneaux par jour × jours d’ouverture" },
        { calc: "Taux d’occupation", f: "créneaux vendus ÷ créneaux disponibles" },
        { calc: "CA par unité et par jour d’ouverture" },
        { alert: "Heures creuses jamais travaillées commercialement" },
        { lever: "Remplir les creux avant d’allonger les horaires" }
      ],
      "eco.pricing": [
        { calc: "CA par créneau vendu", f: "prix ÷ durée réellement mobilisée" },
        { lever: "Prix calé sur la durée réelle, préparation et remise en état comprises" },
        { lever: "Tarifs différenciés heures pleines / heures creuses" }
      ],
      "eco.potentiel": [
        { calc: "CA potentiel du modèle", f: "capacité × taux d’occupation cible × prix × jours" }
      ],
      "acq.fidelisation": [
        { calc: "Fréquence de visite", f: "visites annuelles ÷ clients actifs" },
        { lever: "Prochain rendez-vous pris avant le départ" }
      ],
      "gest.facturation": [
        { look: "Rendez-vous non honorés : acompte ou empreinte bancaire à la réservation" }
      ]
    }
  },

  intellectuel: {
    label: "Prestation intellectuelle", short: "TJM",
    formula: [
      { k: "TJM", d: "taux journalier moyen réellement facturé" },
      { k: "Jours disponibles", d: "par personne et par an" },
      { k: "Taux d’occupation", d: "jours facturés ÷ jours disponibles" },
      { k: "Effectif", d: "personnes productives" }
    ],
    unit: "consultant",
    kpis: {
      jour: ["Temps saisi par mission"],
      semaine: ["Jours facturés par personne", "Carnet de commandes en jours"],
      mois: ["Taux d’occupation facturable", "TJM moyen réalisé", "Marge par mission"]
    },
    flow: ["Audience", "Lead", "Rendez-vous de découverte", "Proposition", "Mission signée", "Client récurrent"],
    profile: { staff: 5, daysAvail: 200, occ: 0.60, occTarget: 0.70, tjm: 600,
               mcv: 0.90, rm: 0.07, basket: 12000, freq: 1.5, years: 3, dso: 60 },
    inject: {
      "eco.pricing": [
        { calc: "TJM réalisé", f: "CA de la mission ÷ jours réellement passés" },
        { alert: "TJM affiché élevé mais TJM réalisé bas : dépassements non facturés" },
        { lever: "Forfaits à la valeur plutôt qu’au temps passé" }
      ],
      "eco.productivite": [
        { calc: "Jours disponibles", f: "jours ouvrés − congés − formation − temps interne" },
        { calc: "Taux d’occupation facturable", f: "jours facturés ÷ jours disponibles" },
        { alert: "Temps passé jamais saisi" }
      ],
      "eco.marges": [
        { calc: "Coût journalier complet d’un collaborateur", f: "coût annuel chargé ÷ jours disponibles" },
        { calc: "Marge par mission", f: "CA − jours passés × coût journalier complet" }
      ],
      "eco.potentiel": [
        { calc: "CA potentiel du modèle", f: "effectif × jours disponibles × occupation cible × TJM" }
      ],
      "gest.devis": [
        { look: "Propositions commerciales : délai d’envoi et taux de signature" }
      ]
    }
  },

  commerce: {
    label: "Commerce", short: "Commerce",
    formula: [
      { k: "Trafic", d: "passages, entrées ou visites" },
      { k: "Conversion", d: "acheteurs ÷ visiteurs" },
      { k: "Panier moyen", d: "CA ÷ nombre de tickets" },
      { k: "Fréquence", d: "achats par client et par an" }
    ],
    unit: "point de vente",
    kpis: {
      jour: ["CA et nombre de tickets", "Panier moyen"],
      semaine: ["Taux de transformation", "Ruptures de stock"],
      mois: ["Marge commerciale", "Rotation du stock", "Démarque", "CA au m²"]
    },
    flow: ["Passants / visiteurs", "Entrées", "Acheteurs", "Clients fidèles"],
    profile: { traffic: 40000, conv: 0.25, convTarget: 0.28, basket: 30, basketTarget: 32,
               mcv: 0.40, rm: 0.06, freq: 8, years: 3, dso: 0 },
    inject: {
      "eco.ca": [
        { calc: "CA au m²", f: "CA ÷ surface de vente" }
      ],
      "eco.marges": [
        { calc: "Taux de marge commerciale", f: "(ventes − coût d’achat des marchandises vendues) ÷ ventes" },
        { calc: "Coefficient multiplicateur", f: "prix de vente HT ÷ prix d’achat HT" },
        { alert: "Démarque et invendus jamais mesurés" }
      ],
      "eco.productivite": [
        { calc: "CA par vendeur et par heure d’ouverture" },
        { calc: "Articles par ticket" }
      ],
      "eco.potentiel": [
        { calc: "CA potentiel du modèle", f: "trafic × conversion cible × panier cible" }
      ],
      "gest.tresorerie": [
        { calc: "Rotation du stock", f: "stock moyen ÷ coût d’achat des ventes × 365" },
        { alert: "Stock dormant qui immobilise la trésorerie" }
      ]
    }
  },

  abonnement: {
    label: "Abonnement", short: "Abonnement",
    formula: [
      { k: "Clients", d: "abonnés actifs" },
      { k: "ARPU", d: "revenu moyen par client et par mois" },
      { k: "Churn", d: "clients perdus ÷ clients, par mois" },
      { k: "Durée de vie", d: "1 ÷ churn" }
    ],
    unit: "abonné",
    kpis: {
      semaine: ["Nouveaux abonnés", "Résiliations"],
      mois: ["Revenu récurrent mensuel (MRR)", "Churn", "ARPU", "LTV ÷ CAC"]
    },
    profile: { clients: 200, arpu: 150, churn: 0.03, churnTarget: 0.02, newPerMonth: 6,
               mcv: 0.80, rm: 0.08, cac: 600, basket: 150, freq: 12, years: 2.8, dso: 5 },
    inject: {
      "eco.ca": [
        { calc: "Revenu récurrent mensuel (MRR)", f: "abonnés × ARPU" }
      ],
      "acq.fidelisation": [
        { calc: "Durée de vie moyenne", f: "1 ÷ churn mensuel" },
        { calc: "LTV", f: "ARPU × taux de marge × durée de vie" },
        { calc: "Ratio LTV ÷ CAC" },
        { alert: "Churn jamais mesuré" }
      ],
      "eco.potentiel": [
        { calc: "Base d’abonnés à l’équilibre", f: "nouveaux abonnés par mois ÷ churn mensuel" }
      ]
    }
  },

  chantier: {
    label: "Chantier sur devis", short: "Chantier",
    formula: [
      { k: "Devis émis", d: "par an" },
      { k: "Taux de transformation", d: "devis signés ÷ devis émis" },
      { k: "Montant moyen", d: "par chantier signé" }
    ],
    capacity: "Capacité de production : compagnons × heures facturables × taux horaire",
    unit: "compagnon",
    kpis: {
      semaine: ["Heures pointées par chantier", "Devis émis et signés"],
      mois: ["Carnet de commandes en mois de production", "Écart devis / réalisé", "Marge par chantier"]
    },
    flow: ["Audience", "Demande", "Visite technique", "Devis", "Chantier signé", "Client prescripteur"],
    profile: { quotes: 120, transfo: 0.35, transfoTarget: 0.45, avg: 8000,
               mcv: 0.45, rm: 0.06, basket: 8000, freq: 0.3, years: 10, dso: 50 },
    inject: {
      "eco.marges": [
        { calc: "Coût de revient horaire", f: "coût complet de la main-d’œuvre et de la structure ÷ heures facturables" },
        { calc: "Marge par chantier", f: "montant facturé − heures × coût horaire − achats − sous-traitance" },
        { alert: "Écart devis / réalisé jamais calculé" },
        { alert: "Travaux supplémentaires réalisés sans avenant signé" }
      ],
      "eco.productivite": [
        { calc: "Heures facturables ÷ heures payées" },
        { alert: "Trajets, reprises et SAV jamais comptés" }
      ],
      "eco.potentiel": [
        { calc: "CA potentiel du modèle", f: "devis × transformation cible × montant moyen — dans la limite de la capacité de production" }
      ],
      "gest.facturation": [
        { lever: "Situations de travaux mensuelles plutôt qu’une facture en fin de chantier" }
      ],
      "gest.pilotage": [
        { look: "Carnet de commandes exprimé en mois de production" }
      ]
    }
  },

  pipeline: {
    label: "Vente sur devis", short: "Devis",
    formula: [
      { k: "Demandes", d: "par an" },
      { k: "Taux de transformation", d: "prestations signées ÷ demandes" },
      { k: "Valeur moyenne", d: "par prestation" }
    ],
    unit: "prestation",
    kpis: {
      semaine: ["Demandes reçues", "Devis envoyés et relancés"],
      mois: ["Taux de transformation", "Valeur moyenne", "Marge par prestation"]
    },
    flow: ["Audience", "Demande", "Échange ou visite", "Devis", "Prestation signée", "Client ou prescripteur récurrent"],
    profile: { quotes: 300, transfo: 0.30, transfoTarget: 0.36, avg: 3000,
               mcv: 0.55, rm: 0.07, basket: 3000, freq: 0.5, years: 4, dso: 30 },
    inject: {
      "eco.marges": [
        { calc: "Marge par prestation", f: "prix − coûts directs de la prestation" }
      ],
      "eco.potentiel": [
        { calc: "CA potentiel du modèle", f: "demandes × transformation cible × valeur moyenne" }
      ]
    }
  },

  heures: {
    label: "Service à l’heure", short: "À l’heure",
    formula: [
      { k: "Intervenants", d: "agents ou équipes" },
      { k: "Heures payées", d: "par intervenant et par an" },
      { k: "Part facturée", d: "heures facturées ÷ heures payées" },
      { k: "Taux horaire", d: "prix moyen facturé par heure" }
    ],
    unit: "heure facturée",
    kpis: {
      semaine: ["Heures facturées ÷ heures payées", "Absences et remplacements"],
      mois: ["Taux horaire moyen facturé", "Part du CA sous contrat", "Marge par contrat"]
    },
    flow: ["Audience", "Demande", "Visite ou chiffrage", "Contrat", "Client sous contrat", "Contrat renouvelé"],
    profile: { agents: 10, hoursPaid: 1500, billed: 0.82, billedTarget: 0.90, rate: 30,
               mcv: 0.95, rm: 0.07, basket: 12000, freq: 1, years: 4, dso: 55 },
    inject: {
      "eco.marges": [
        { calc: "Coût de revient horaire", f: "salaire chargé + trajets + encadrement + produits, par heure facturée" },
        { calc: "Marge par contrat", f: "CA du contrat − heures × coût de revient horaire" }
      ],
      "eco.productivite": [
        { calc: "Part des heures facturées", f: "heures facturées ÷ heures payées" },
        { alert: "Trajets et temps morts jamais mesurés" }
      ],
      "eco.potentiel": [
        { calc: "CA potentiel du modèle", f: "heures payées × part facturée cible × taux horaire" }
      ],
      "hum.rh": [
        { alert: "Remplacements assurés à perte ou non facturés" }
      ]
    }
  },

  negoce: {
    label: "Achat-revente et stock", short: "Négoce",
    formula: [
      { k: "Unités vendues", d: "par an" },
      { k: "Marge unitaire", d: "prix de vente − coût complet d’achat" },
      { k: "Rotation", d: "nombre de fois où le stock tourne dans l’année" }
    ],
    unit: "unité en stock",
    kpis: {
      semaine: ["Stock par ancienneté", "Contacts par annonce ou par référence"],
      mois: ["Marge par unité", "Jours de stock", "Unités vendues"]
    },
    profile: { units: 80, unitMargin: 1800, avgCost: 12000, stockDays: 75, stockDaysTarget: 50,
               mcv: 0.13, rm: 0.03, basket: 13800, freq: 0.2, years: 5, dso: 15 },
    inject: {
      "eco.marges": [
        { calc: "Marge par unité", f: "prix de vente − prix d’achat − frais de préparation − garantie" },
        { alert: "Marge moyenne correcte qui masque des unités vendues à perte" }
      ],
      "gest.tresorerie": [
        { calc: "Jours de stock", f: "stock ÷ coût d’achat des ventes × 365" },
        { calc: "Coût de détention du stock", f: "valeur du stock × coût du financement + décote dans le temps" },
        { alert: "Stock âgé sans décision de prix" }
      ],
      "eco.potentiel": [
        { calc: "CA potentiel du modèle", f: "même stock financé × rotations cibles × marge unitaire" }
      ]
    }
  },

  production: {
    label: "Production et fabrication", short: "Production",
    formula: [
      { k: "Capacité", d: "heures machine ou ligne disponibles" },
      { k: "TRS", d: "disponibilité × performance × qualité" },
      { k: "Marge horaire", d: "marge sur coût variable par heure produite" }
    ],
    unit: "machine ou ligne",
    kpis: {
      jour: ["TRS", "Rebuts"],
      semaine: ["Livraisons à l’heure", "Charge ÷ capacité"],
      mois: ["Coût de revient unitaire", "Marge par référence", "Carnet de commandes"]
    },
    profile: { hours: 4000, trs: 0.60, trsTarget: 0.70, mph: 110, mcv: 0.40, rm: 0.05, basket: 5000, freq: 4, years: 5, dso: 55 },
    inject: {
      "eco.productivite": [
        { calc: "TRS", f: "disponibilité × performance × qualité" },
        { calc: "Charge ÷ capacité" },
        { alert: "Arrêts machine jamais mesurés" }
      ],
      "eco.marges": [
        { calc: "Coût de revient unitaire complet" },
        { calc: "Marge sur coût variable par référence et par client" }
      ],
      "eco.potentiel": [
        { calc: "CA potentiel du modèle", f: "heures disponibles × TRS cible × marge horaire" }
      ],
      "gest.tresorerie": [
        { calc: "Jours de stock : matières, en-cours, produits finis" }
      ]
    }
  },

  marketplace: {
    label: "Plateforme ou marketplace", short: "Plateforme",
    formula: [
      { k: "Trafic", d: "visites" },
      { k: "Conversion", d: "commandes ÷ visites" },
      { k: "GMV", d: "volume d’affaires = commandes × panier moyen" },
      { k: "Take rate", d: "commission ÷ GMV" }
    ],
    unit: "transaction",
    kpis: {
      semaine: ["Visites et commandes", "Nouveaux vendeurs actifs"],
      mois: ["GMV", "Take rate", "Part des acheteurs récurrents"]
    },
    profile: { traffic: 500000, conv: 0.020, convTarget: 0.025, basket: 60, take: 0.12,
               mcv: 0.90, rm: 0.08, freq: 3, years: 2, dso: 5 },
    inject: {
      "eco.ca": [
        { calc: "GMV", f: "commandes × panier moyen" },
        { calc: "Revenu de la plateforme", f: "GMV × take rate" }
      ],
      "eco.potentiel": [
        { calc: "CA potentiel du modèle", f: "trafic × conversion cible × panier × take rate" }
      ]
    }
  },

  multisites: {
    label: "Multi-sites", short: "Multi-sites", overlay: true,
    formula: [
      { k: "Σ contributions des sites", d: "marge de chaque site − ses charges propres" },
      { k: "− coûts centraux", d: "direction, fonctions support, marketing commun" }
    ],
    unit: "site",
    kpis: {
      mois: ["Contribution par site", "Coûts centraux ÷ CA", "Écart entre le meilleur et le moins bon site"]
    },
    inject: {
      "eco.marges": [
        { calc: "Contribution par site", f: "marge du site − charges propres au site" },
        { calc: "Poids des coûts centraux", f: "coûts centraux ÷ CA total" },
        { alert: "Un site déficitaire financé par les autres" }
      ],
      "gest.pilotage": [
        { look: "Tableau de bord comparatif par site" }
      ],
      "hum.organisation": [
        { look: "Responsables de site et niveau de délégation" }
      ]
    }
  }
};
