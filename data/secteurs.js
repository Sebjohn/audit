/* =====================================================================
   Ultra Audits — SECTEURS ET SOUS-SECTEURS
   ---------------------------------------------------------------------
   Secteur (famille)     : modules, unité, naf, inject partagés
   Sous-secteur          : précise ou remplace ces valeurs
     modules : modèles économiques (le 1er est le principal)
     unit    : unité productive
     naf     : division NAF pour les ratios Banque de France (benchmarks.js)
     bdfSkip : ratios Banque de France à ne pas afficher (ex. "mc")
     force   : blocs à afficher même si le modèle les masque
     ex      : exemple chiffré illustratif (surcharge du profil du module)
     inject  : items ajoutés aux blocs { "id.du.bloc": [ items ] }
   Pour ajouter un métier : ajouter un objet dans subs. Rien d'autre.
   ===================================================================== */
window.UA = window.UA || {};

UA.secteurs = [

  /* ================================================================== */
  { id: "btp", label: "BTP & artisanat du bâtiment", modules: ["chantier"], naf: "43", unit: "compagnon",
    inject: {
      "eco.pricing": [
        { ask: "Votre taux horaire couvre-t-il réellement vos frais de structure ?", key: true }
      ],
      "eco.marges": [
        { calc: "Coefficient de vente appliqué", f: "prix de vente HT ÷ déboursé sec" },
        { look: "Achats et fournisseurs : remises négociées, comptes ouverts, mise en concurrence" },
        { lever: "Frais de chantier refacturés : déplacements, benne, protections, petites fournitures" }
      ],
      "eco.productivite": [
        { look: "Pointage des heures par chantier" },
        { lever: "Un pointage simple, même sur papier, révèle les heures offertes" }
      ],
      "gest.devis": [
        { alert: "Visite technique jamais facturée sur les gros devis" },
        { lever: "Visite technique payante, déduite si le chantier est signé" }
      ],
      "gest.facturation": [
        { look: "Acompte à la signature et situations de travaux" },
        { look: "Retenue de garantie : 5 % bloqués un an, ou caution bancaire de substitution" }
      ],
      "gest.tresorerie": [
        { alert: "Chantiers financés par la trésorerie avant le premier acompte" }
      ],
      "hum.organisation": [
        { look: "Chefs d’équipe capables de mener un chantier seuls" }
      ],
      "hum.rh": [
        { look: "Sous-traitance : contrat et attestation de vigilance URSSAF" },
        { alert: "Recours à l’intérim non maîtrisé" }
      ],
      "hum.process": [
        { look: "Réception de chantier et procès-verbal signé" },
        { alert: "Activités exercées absentes de l’attestation décennale" }
      ],
      "acq.communication": [
        { lever: "Photos avant / après et demande d’avis à chaque réception" }
      ],
      "acq.developpement": [
        { look: "Prescripteurs : architectes, maîtres d’œuvre, agences, syndics" }
      ],
      "exp.offre": [
        { lever: "Contrat d’entretien ou de maintenance récurrent" }
      ]
    },
    subs: [
      { id: "construction", label: "Gros œuvre & construction", naf: "41", unit: "équipe de chantier",
        desc: "Maçonnerie, construction neuve, extension",
        ex: { quotes: 60, avg: 25000, transfo: 0.30, transfoTarget: 0.38, mcv: 0.40 },
        inject: {
          "eco.marges": [ { calc: "Marge par lot : terrassement, maçonnerie, béton, main-d’œuvre" } ],
          "gest.tresorerie": [ { alert: "Avances importantes sur matériaux avant le premier règlement" } ],
          "acq.developpement": [ { alert: "Dépendance à un promoteur ou un constructeur de maisons individuelles" } ]
        }},
      { id: "renovation", label: "Rénovation tous corps d’état",
        desc: "Rénovation intérieure et énergétique, coordination de lots",
        inject: {
          "gest.devis": [ { lever: "Options chiffrées dans le devis : gammes et finitions" } ],
          "hum.organisation": [ { look: "Coordination des sous-traitants et planning des corps d’état" } ],
          "acq.developpement": [ { look: "Part des chantiers financés par des aides à la rénovation" } ]
        }},
      { id: "electricite", label: "Électricité",
        desc: "Installation, dépannage, tertiaire",
        inject: {
          "eco.ca": [ { look: "Part dépannage, rénovation, neuf et tertiaire" } ],
          "eco.pricing": [ { lever: "Forfaits de dépannage affichés" } ],
          "exp.offre": [ { lever: "Bornes de recharge, domotique, contrats de maintenance" } ]
        }},
      { id: "plomberie", label: "Plomberie & chauffage",
        desc: "Installation, dépannage, entretien de chaudières et pompes à chaleur",
        inject: {
          "eco.ca": [ { look: "Part dépannage, installation et entretien" } ],
          "eco.pricing": [ { lever: "Déplacement et diagnostic facturés" } ],
          "acq.fidelisation": [ { lever: "Contrats d’entretien annuels, relancés automatiquement" } ]
        }},
      { id: "menuiserie", label: "Menuiserie",
        desc: "Fabrication en atelier et pose",
        inject: {
          "eco.marges": [ { look: "Marge séparée : fabrication atelier et pose" } ],
          "eco.productivite": [ { calc: "Taux d’occupation de l’atelier et des machines" } ],
          "gest.tresorerie": [ { alert: "Acompte client inférieur aux commandes passées aux fournisseurs" } ]
        }},
      { id: "peinture", label: "Peinture & revêtements",
        desc: "Peinture, sols, façades",
        inject: {
          "eco.productivite": [ { calc: "Mètres carrés réalisés par heure et par compagnon" } ],
          "eco.pricing": [ { calc: "Prix au m² réel après préparation des supports" } ],
          "eco.marges": [ { alert: "Préparation des supports sous-estimée au devis" } ]
        }},
      { id: "couverture", label: "Couverture & charpente",
        desc: "Toitures, charpente, zinguerie",
        inject: {
          "eco.ca": [ { look: "Part urgences, sinistres assurés et rénovation" } ],
          "hum.organisation": [ { alert: "Intempéries jamais anticipées dans le planning" } ],
          "acq.developpement": [ { lever: "Partenariats avec experts d’assurance et syndics" } ]
        }},
      { id: "paysagisme", label: "Paysagisme & espaces verts", modules: ["chantier", "heures"], naf: "81",
        desc: "Création de jardins et entretien sous contrat",
        inject: {
          "eco.ca": [ { look: "Part création et part entretien sous contrat" } ],
          "gest.tresorerie": [ { alert: "Creux d’hiver non anticipé dans la trésorerie" } ],
          "acq.fidelisation": [ { lever: "Contrats d’entretien annuels mensualisés" } ],
          "eco.pricing": [ { look: "Entretien chez les particuliers : éligibilité au crédit d’impôt des services à la personne" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "nettoyage", label: "Nettoyage & propreté", modules: ["heures"], naf: "81", unit: "agent",
    inject: {
      "eco.ca": [
        { calc: "Part du CA sous contrat récurrent", f: "CA des contrats ÷ CA total" },
        { look: "Rentabilité par type de client : particuliers, syndics, entreprises, chantiers" }
      ],
      "eco.marges": [
        { lever: "Produits et consommables refacturés, jamais offerts" },
        { lever: "Prestations exceptionnelles valorisées : vitrerie, remise en état, shampouinage" }
      ],
      "eco.productivite": [
        { calc: "Cadence réelle par site", f: "surface traitée ÷ heures réellement passées" },
        { alert: "Temps alloué au devis intenable sur le terrain" }
      ],
      "gest.devis": [
        { look: "Clause de révision de prix annuelle dans chaque contrat" },
        { alert: "Contrat sans indexation : la marge fond chaque année" }
      ],
      "gest.facturation": [
        { lever: "Contrats mensualisés et prélèvement automatique" }
      ],
      "hum.organisation": [
        { lever: "Sectoriser les tournées : le trajet n’est jamais payé par le client" }
      ],
      "hum.rh": [
        { look: "Absentéisme et organisation des remplacements" }
      ],
      "hum.process": [
        { lever: "Contrôle qualité et cahier de passage signé" },
        { look: "Reprise du personnel lors d’un changement de prestataire (annexe 7 de la convention collective)" }
      ]
    },
    subs: [
      { id: "bureaux", label: "Bureaux & entreprises",
        desc: "Contrats d’entretien de locaux professionnels",
        inject: {
          "eco.marges": [ { alert: "Contrats remportés au prix plancher" } ],
          "acq.developpement": [ { lever: "Référencement grands comptes et appels d’offres privés" } ]
        }},
      { id: "syndics", label: "Syndics & copropriétés",
        desc: "Parties communes, sortie des conteneurs",
        force: ["gest.recouvrement"],
        inject: {
          "acq.developpement": [ { lever: "Cibler le gestionnaire du syndic : plusieurs immeubles d’un coup" } ],
          "gest.recouvrement": [ { alert: "Délais de paiement longs des syndics" } ],
          "hum.process": [ { look: "Cahier des charges précis par immeuble" } ]
        }},
      { id: "particuliers", label: "Ménage chez les particuliers",
        desc: "Services à la personne",
        inject: {
          "eco.pricing": [ { look: "Avance immédiate du crédit d’impôt proposée aux clients" } ],
          "hum.rh": [ { alert: "Turnover élevé des intervenants" } ],
          "acq.fidelisation": [ { lever: "Même intervenant, même créneau : la fidélité en dépend" } ]
        }},
      { id: "finchantier", label: "Fin de chantier", modules: ["pipeline", "heures"],
        desc: "Nettoyage avant livraison, remise en état",
        inject: {
          "acq.developpement": [ { lever: "Référencement chez les entreprises du bâtiment et les promoteurs" } ],
          "eco.pricing": [ { lever: "Urgence et délais courts facturés" } ],
          "gest.devis": [ { lever: "Devis sur plan en 24 heures" } ]
        }},
      { id: "vehicules", label: "Lavage & detailing automobile", modules: ["capacite"], naf: null, unit: "poste de lavage",
        desc: "Station, detailing, flottes",
        ex: { units: 2, slots: 6, slot: "créneau", days: 280, occ: 0.50, occTarget: 0.65, price: 45, mcv: 0.85 },
        inject: {
          "eco.pricing": [ { lever: "Formules à paliers : intérieur, extérieur, rénovation" } ],
          "eco.productivite": [ { calc: "Véhicules traités par jour et par poste" } ],
          "acq.fidelisation": [ { lever: "Abonnements mensuels et contrats de flottes d’entreprise" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "terrain", label: "Services terrain & transport", modules: ["heures"], unit: "intervenant",
    subs: [
      { id: "securite", label: "Sécurité & gardiennage", naf: "80",
        desc: "Surveillance, événementiel, sécurité incendie",
        inject: {
          "eco.marges": [ { alert: "Taux horaire vendu à peine supérieur au coût salarial" } ],
          "eco.pricing": [ { alert: "Nuits, dimanches et jours fériés mal refacturés" } ],
          "hum.rh": [ { look: "Cartes professionnelles des agents à jour" } ],
          "exp.offre": [ { lever: "Télésurveillance, sécurité incendie, événementiel" } ]
        }},
      { id: "sap", label: "Services à la personne", naf: null,
        desc: "Aide à domicile, garde, assistance",
        inject: {
          "eco.pricing": [ { look: "Avance immédiate du crédit d’impôt proposée aux clients" } ],
          "hum.rh": [ { alert: "Turnover des intervenants" } ],
          "hum.organisation": [ { look: "Planning et temps de trajet entre deux domiciles" } ],
          "acq.developpement": [ { look: "Prescripteurs : CCAS, caisses de retraite, hôpitaux" } ]
        }},
      { id: "demenagement", label: "Déménagement & débarras", modules: ["pipeline", "heures"], naf: "49", unit: "camion et équipe",
        desc: "Déménagement, garde-meuble, débarras, successions",
        inject: {
          "eco.marges": [
            { calc: "Coût de revient camion et équipe, à la journée" },
            { calc: "Volume estimé face au volume réel", f: "m³ du devis ÷ m³ chargés" },
            { lever: "Prestations annexes : emballage, monte-meuble, démontage, garde-meuble" },
            { lever: "Valorisation des débarras : revente de mobilier, métaux, électroménager" }
          ],
          "eco.productivite": [ { lever: "Grouper les trajets et chercher du fret retour" } ],
          "gest.facturation": [ { lever: "Acompte à la réservation, solde encaissé avant le déchargement" } ],
          "gest.devis": [ { lever: "Estimation à distance en visio ou sur photos" } ],
          "hum.process": [
            { look: "Inventaire signé et photos au départ" },
            { look: "Déclaration de valeur et assurance dommages connues du client" },
            { look: "Licence de transport et inscription au registre" }
          ],
          "acq.developpement": [ { lever: "Prescripteurs : agences immobilières, notaires, syndics, maisons de retraite" } ]
        }},
      { id: "transport", label: "Transport de marchandises", naf: "49", unit: "véhicule-jour",
        desc: "Transport routier, messagerie, livraison",
        inject: {
          "eco.marges": [ { calc: "Coût de revient : kilomètres, heures conducteur et coûts journaliers (méthode du trinôme CNR)" } ],
          "eco.pricing": [ { lever: "Indexation carburant appliquée sur tous les contrats" } ],
          "eco.productivite": [
            { calc: "Part des kilomètres à vide" },
            { calc: "Taux de remplissage des véhicules" }
          ],
          "acq.developpement": [ { alert: "Dépendance à un donneur d’ordre ou à une bourse de fret" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "coiffure", label: "Coiffure", modules: ["capacite"], naf: null, unit: "fauteuil de coiffage",
    ex: { units: 4, slots: 8, days: 250, occ: 0.55, occTarget: 0.70, price: 60, mcv: 0.85, rm: 0.06, basket: 55, freq: 6, years: 4 },
    inject: {
      "eco.ca": [
        { look: "Répartition femmes, hommes, couleur, soins" },
        { look: "Part de la revente de produits dans le CA" }
      ],
      "eco.pricing": [
        { ask: "Le prix de la couleur intègre-t-il le temps de pose et le produit ?" },
        { look: "Fiche moyenne hors ventes, femmes et hommes" },
        { lever: "Services additionnels proposés à chaque passage : soin, couleur, coiffage" }
      ],
      "eco.marges": [
        { calc: "Coût produit par prestation : couleur, mèches, soins" },
        { alert: "Doses de couleur jamais mesurées" },
        { lever: "Revente de produits portée par une prime à la revente" }
      ],
      "eco.productivite": [
        { calc: "CA par coiffeur et par heure de présence" },
        { alert: "Temps de pose non utilisé pour une autre cliente" }
      ],
      "hum.rh": [
        { look: "Rémunération : fixe, commission sur prestations, prime à la revente" },
        { alert: "Dépendance à un coiffeur qui a sa propre clientèle" }
      ],
      "acq.communication": [
        { lever: "Réservation en ligne 24 h / 24 et rappel automatique" }
      ],
      "acq.fidelisation": [
        { lever: "Relance des clientes dont le délai habituel de visite est dépassé" }
      ]
    },
    subs: [
      { id: "independant", label: "Salon indépendant",
        desc: "Salon de quartier ou de centre-ville, sans enseigne",
        inject: {
          "eco.pricing": [ { lever: "Grille revue chaque année, calée sur le temps réel" } ]
        }},
      { id: "enseigne", label: "Salon sous enseigne ou franchisé",
        desc: "Salon affilié à un réseau",
        inject: {
          "eco.marges": [ { look: "Redevances et marketing réseau en % du CA" } ],
          "eco.pricing": [ { alert: "Marge de manœuvre limitée par les prix imposés par l’enseigne" } ]
        }},
      { id: "barbier", label: "Barbier", unit: "fauteuil de barbier",
        desc: "Coupe homme, barbe, soins",
        ex: { price: 45, basket: 30, freq: 9 },
        inject: {
          "eco.pricing": [ { lever: "Forfaits coupe + barbe et soins visage" } ],
          "eco.productivite": [ { calc: "Durée moyenne d’une prestation et clients par jour" } ],
          "acq.fidelisation": [ { lever: "Abonnement mensuel : passages illimités ou deux passages" } ]
        }},
      { id: "domicile", label: "Coiffure à domicile", unit: "coiffeur itinérant",
        desc: "Prestations chez le client",
        ex: { units: 1, occ: 0.60, occTarget: 0.72 },
        inject: {
          "eco.productivite": [
            { calc: "Temps de trajet ÷ temps facturé" },
            { lever: "Tournées regroupées par zone et par jour" }
          ],
          "eco.pricing": [ { lever: "Frais de déplacement facturés au-delà d’une zone" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "esthetique", label: "Esthétique & bien-être", modules: ["capacite"], naf: null, unit: "cabine",
    ex: { units: 2, slots: 8, days: 260, occ: 0.50, occTarget: 0.65, price: 65, mcv: 0.82, rm: 0.07, basket: 60, freq: 5, years: 4 },
    inject: {
      "eco.pricing": [
        { calc: "CA par heure de cabine", f: "prix ÷ durée totale mobilisée, préparation et nettoyage compris" },
        { lever: "Cures et forfaits de plusieurs séances payés d’avance" }
      ],
      "eco.marges": [
        { calc: "Coût des consommables par prestation" },
        { lever: "Revente de produits en fin de soin" }
      ],
      "eco.productivite": [
        { calc: "Taux d’occupation par cabine et par praticienne" },
        { alert: "Battement entre deux clientes jamais optimisé" }
      ],
      "gest.facturation": [
        { lever: "Cartes cadeaux et forfaits prépayés" }
      ],
      "hum.process": [
        { look: "Protocoles d’hygiène écrits" },
        { alert: "Actes pratiqués non couverts par l’assurance" }
      ],
      "acq.communication": [
        { lever: "Avis Google, Instagram, photos avant / après avec accord écrit" }
      ],
      "acq.fidelisation": [
        { lever: "Prochain rendez-vous et programme de fidélité" }
      ]
    },
    subs: [
      { id: "institut", label: "Institut de beauté",
        desc: "Épilation, soins visage et corps, ongles",
        inject: {
          "eco.ca": [ { look: "Répartition épilation, soins visage, soins corps, ongles, revente" } ],
          "eco.marges": [ { lever: "Développer les soins à plus forte valeur par heure de cabine" } ]
        }},
      { id: "onglerie", label: "Onglerie", unit: "poste de pose",
        desc: "Prothésie ongulaire, beauté des mains et des pieds",
        ex: { price: 50, basket: 45, freq: 10 },
        inject: {
          "eco.pricing": [ { calc: "Prix et durée : pose complète, remplissage, dépose" } ],
          "eco.marges": [ { look: "Coût des gels, capsules et consommables par pose" } ],
          "acq.fidelisation": [ { lever: "Remplissage suivant planifié dès la pose" } ],
          "hum.process": [ { look: "Aspiration et ventilation des postes" } ]
        }},
      { id: "massage", label: "Massage & bien-être", unit: "cabine de massage",
        desc: "Massages de bien-être, relaxation",
        ex: { price: 70, occ: 0.45, occTarget: 0.60 },
        inject: {
          "eco.productivite": [
            { calc: "Massages par praticien et par jour" },
            { alert: "Fatigue physique qui plafonne la capacité réelle" }
          ],
          "eco.pricing": [ { lever: "Durées 30 / 60 / 90 minutes avec un prix à la minute cohérent" } ],
          "gest.facturation": [ { look: "Cartes cadeaux : forte saisonnalité autour des fêtes" } ],
          "acq.developpement": [ { lever: "Partenariats hôtels, comités d’entreprise, interventions en entreprise" } ],
          "hum.process": [ { alert: "Communication qui revendique une visée thérapeutique, réservée aux professions de santé" } ]
        }},
      { id: "spa", label: "Spa", unit: "cabine et espace humide",
        desc: "Soins, espace humide, forfaits duo",
        ex: { units: 4, price: 80 },
        inject: {
          "eco.ca": [ { look: "Répartition soins, accès à l’espace humide, boutique, forfaits duo" } ],
          "eco.marges": [ { alert: "Énergie et entretien de l’espace humide jamais affectés" } ],
          "eco.productivite": [ { calc: "Occupation des cabines et de l’espace humide par créneau" } ],
          "eco.pricing": [ { lever: "Tarifs différenciés semaine / week-end" } ],
          "acq.developpement": [ { lever: "Coffrets cadeaux, séminaires, partenariats hôteliers" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "resto", label: "Restauration & hospitalité", modules: ["capacite"], naf: "56", unit: "place assise",
    ex: { units: 50, slots: 2, slot: "service", days: 300, occ: 0.60, occTarget: 0.70, price: 25, mcv: 0.68, rm: 0.06, basket: 25, freq: 6, years: 3 },
    inject: {
      "eco.marges": [
        { calc: "Ratio matière", f: "achats consommés ÷ CA HT — solides et liquides séparés" },
        { calc: "Prime cost", f: "(coût matière + masse salariale) ÷ CA" },
        { lever: "Fiches techniques à jour et prix de revient par plat" }
      ],
      "eco.pricing": [
        { calc: "Ticket moyen par couvert" },
        { calc: "Taux de captation : entrée, dessert, boisson, café" },
        { lever: "Menu engineering : étoiles, vaches à lait, énigmes, poids morts" }
      ],
      "eco.productivite": [
        { calc: "Couverts par service et par place (rotation)" },
        { alert: "Services creux ouverts à perte" }
      ],
      "gest.tresorerie": [
        { look: "Inventaire hebdomadaire et démarque" }
      ],
      "hum.rh": [
        { calc: "Masse salariale par service, extras compris" },
        { alert: "Plannings qui ne suivent pas l’affluence" }
      ],
      "hum.process": [
        { look: "Plan de maîtrise sanitaire, traçabilité, allergènes" }
      ],
      "acq.communication": [
        { look: "Fiche Google, menu en ligne, lien de réservation" }
      ],
      "acq.fidelisation": [
        { lever: "Fichier client et offres ciblées sur les services creux" }
      ]
    },
    subs: [
      { id: "traditionnel", label: "Restaurant traditionnel",
        desc: "Service à table, cuisine du marché ou brasserie",
        inject: {
          "eco.marges": [ { look: "Marge sur solides et marge sur liquides suivies séparément" } ]
        }},
      { id: "rapide", label: "Restauration rapide", modules: ["commerce"], unit: "caisse et borne",
        desc: "Comptoir, vente à emporter, livraison",
        ex: { traffic: 60000, conv: 0.9, convTarget: 0.92, basket: 12, basketTarget: 13, mcv: 0.68 },
        inject: {
          "eco.productivite": [ { calc: "Commandes par heure au coup de feu et temps de service" } ],
          "eco.marges": [ { alert: "Commissions des plateformes de livraison non répercutées" } ],
          "eco.pricing": [ { lever: "Menus et formules pour monter le panier" } ],
          "acq.developpement": [ { lever: "Bornes et commande en ligne" } ]
        }},
      { id: "cafebar", label: "Café-bar", modules: ["commerce"], unit: "comptoir et salle",
        desc: "Café, bar, brasserie de quartier",
        ex: { traffic: 45000, conv: 0.9, convTarget: 0.92, basket: 9, basketTarget: 10, mcv: 0.78 },
        inject: {
          "eco.marges": [ { calc: "Ratio liquides et marge par boisson" } ],
          "eco.ca": [ { lever: "Snacking et afterwork pour remplir les creux" } ],
          "hum.process": [ { look: "Licence de débit de boissons et permis d’exploitation" } ]
        }},
      { id: "traiteur", label: "Traiteur & événementiel", modules: ["pipeline"], unit: "prestation",
        desc: "Mariages, entreprises, prestations sur site",
        ex: { quotes: 200, transfo: 0.30, transfoTarget: 0.38, avg: 4500, mcv: 0.55 },
        inject: {
          "eco.marges": [
            { calc: "Coût par convive", f: "matière + personnel + logistique + matériel ÷ couverts servis" },
            { calc: "Ratio matière par formule" },
            { look: "Heures d’extras : montage, service, démontage" },
            { lever: "Location de matériel refacturée avec marge" }
          ],
          "eco.productivite": [ { alert: "Surproduction et pertes jamais mesurées par prestation" } ],
          "gest.facturation": [ { lever: "Acompte à la réservation, solde avant l’événement" } ],
          "gest.tresorerie": [ { look: "Saisonnalité : les mois creux se financent avec les mois pleins" } ],
          "gest.devis": [
            { lever: "Relance planifiée des devis jusqu’à la décision" },
            { look: "Conditions d’annulation et date de confirmation des effectifs" }
          ],
          "hum.process": [ { look: "Chaîne du froid et transport en température" } ],
          "acq.developpement": [ { lever: "Prescripteurs : salles de réception, wedding planners, CSE" } ]
        }},
      { id: "hotel", label: "Hôtel", naf: "55", unit: "chambre",
        desc: "Hôtellerie classée, indépendante ou affiliée",
        force: ["gest.devis", "gest.recouvrement"],
        ex: { units: 30, slots: 1, slot: "nuit", days: 365, occ: 0.60, occTarget: 0.68, price: 110, mcv: 0.80, rm: 0.08, basket: 180, freq: 1.5, years: 3 },
        inject: {
          "eco.pricing": [
            { calc: "Prix moyen (ADR)", f: "CA hébergement ÷ chambres vendues" },
            { calc: "RevPAR", f: "CA hébergement ÷ chambres disponibles" },
            { lever: "Yield management : prix ajustés à la demande" }
          ],
          "eco.productivite": [ { calc: "Taux d’occupation", f: "chambres vendues ÷ chambres disponibles" } ],
          "eco.ca": [ { look: "CA annexes : petit-déjeuner, bar, séminaires" } ],
          "acq.developpement": [
            { calc: "Part des réservations directes et coût des commissions des agences en ligne" },
            { lever: "Réservation directe : site, fidélité, meilleur prix garanti" }
          ]
        }},
      { id: "hebergement", label: "Gîtes & chambres d’hôtes", naf: null, unit: "logement",
        desc: "Hébergement touristique",
        ex: { units: 4, slots: 1, slot: "nuit", days: 365, occ: 0.45, occTarget: 0.55, price: 90, mcv: 0.80, rm: 0.15, basket: 400, freq: 1, years: 3 },
        inject: {
          "eco.productivite": [ { calc: "Nuitées vendues ÷ nuitées disponibles, par saison" } ],
          "eco.pricing": [ { lever: "Tarifs saisonniers et durée minimale de séjour" } ],
          "acq.developpement": [ { alert: "Dépendance aux plateformes et à leurs commissions" } ],
          "hum.process": [ { look: "Déclaration en mairie, classement, taxe de séjour" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "bouche", label: "Métiers de bouche", modules: ["commerce"], naf: "47", bdfSkip: ["mc"], unit: "boutique",
    ex: { traffic: 55000, conv: 0.85, convTarget: 0.88, basket: 14, basketTarget: 15, mcv: 0.55, rm: 0.06, freq: 40, years: 5 },
    inject: {
      "eco.marges": [
        { calc: "Taux de marge brute par famille de produits" },
        { calc: "Coefficient multiplicateur par famille" },
        { alert: "Un coefficient unique appliqué à toute la vitrine" }
      ],
      "gest.tresorerie": [
        { look: "Démarque, invendus et pertes pesés chaque jour" }
      ],
      "eco.ca": [
        { lever: "Traiteur du quotidien : plats cuisinés, plateaux, snacking" }
      ],
      "hum.process": [
        { look: "Plan de maîtrise sanitaire et traçabilité" }
      ],
      "acq.fidelisation": [
        { lever: "Précommandes pour les fêtes et le week-end" }
      ]
    },
    subs: [
      { id: "boulangerie", label: "Boulangerie-pâtisserie", naf: null, unit: "fournil et boutique",
        desc: "Pain, viennoiserie, pâtisserie, snacking",
        ex: { traffic: 90000, basket: 5.5, basketTarget: 6, mcv: 0.70 },
        inject: {
          "eco.marges": [ { calc: "Coût matière par famille : pain, viennoiserie, pâtisserie, snacking" } ],
          "eco.productivite": [
            { calc: "CA par personne" },
            { calc: "Quintaux de farine travaillés par mois" }
          ],
          "eco.ca": [ { lever: "Offre du midi : sandwichs, formules" } ],
          "gest.tresorerie": [ { alert: "Invendus du soir jamais valorisés" } ],
          "hum.rh": [ { look: "Organisation fournil, laboratoire et vente" } ]
        }},
      { id: "boucherie", label: "Boucherie-charcuterie",
        desc: "Boucherie, charcuterie, traiteur",
        inject: {
          "eco.marges": [
            { calc: "Rendement matière à la découpe", f: "kilos vendables ÷ kilos achetés" },
            { look: "Achat en carcasse ou en pièces : coût au kilo utile, main-d’œuvre de découpe comprise" }
          ],
          "eco.ca": [ { lever: "Transformation : charcuterie maison, plats cuisinés, préparations" } ],
          "hum.rh": [ { alert: "Dépendance à un boucher qualifié difficile à remplacer" } ]
        }},
      { id: "fromagerie", label: "Fromagerie",
        desc: "Crèmerie, fromagerie, affinage",
        inject: {
          "eco.marges": [ { calc: "Perte de poids à l’affinage et pertes à la coupe" } ],
          "eco.ca": [ { lever: "Plateaux, raclettes, paniers cadeaux" } ],
          "gest.tresorerie": [ { alert: "Stock d’affinage qui immobilise la trésorerie" } ]
        }},
      { id: "epicerie", label: "Épicerie fine & alimentaire",
        desc: "Épicerie, cave, produits régionaux",
        inject: {
          "eco.marges": [ { alert: "Produits d’appel à marge nulle" } ],
          "gest.tresorerie": [ { calc: "Rotation par référence et suivi des dates limites" } ],
          "eco.ca": [ { lever: "Coffrets et paniers cadeaux d’entreprise" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "commerce", label: "Commerce & e-commerce", modules: ["commerce"], naf: "47", unit: "point de vente",
    inject: {
      "eco.marges": [
        { calc: "Taux de marge commerciale par famille" }
      ],
      "gest.tresorerie": [
        { calc: "Rotation du stock par famille" },
        { alert: "Stock ancien jamais soldé" }
      ],
      "eco.productivite": [
        { calc: "CA au m² et par vendeur" }
      ],
      "acq.fidelisation": [
        { lever: "Fichier client et relances ciblées" }
      ]
    },
    subs: [
      { id: "mode", label: "Mode & accessoires",
        desc: "Prêt-à-porter, chaussures, accessoires",
        inject: {
          "eco.marges": [ { alert: "Soldes et démarques jamais budgétées" } ],
          "gest.tresorerie": [ { look: "Précommandes de collections et engagements fournisseurs" } ],
          "eco.productivite": [ { calc: "Taux de transformation entrées → achats" } ]
        }},
      { id: "beautepar", label: "Beauté & parfumerie",
        desc: "Parfumerie, cosmétiques",
        inject: {
          "eco.marges": [ { look: "Conditions des marques : remises, objectifs, animations" } ],
          "acq.communication": [ { lever: "Services en boutique pour créer du trafic : maquillage, diagnostics" } ]
        }},
      { id: "maison", label: "Équipement de la maison",
        desc: "Meuble, décoration, électroménager",
        inject: {
          "eco.ca": [ { look: "Part des commandes spéciales et de la livraison-pose" } ],
          "gest.facturation": [ { lever: "Acompte à la commande" } ],
          "exp.offre": [ { lever: "Services payants : livraison, installation, SAV" } ]
        }},
      { id: "specialise", label: "Commerce spécialisé",
        desc: "Sport, loisirs, culture, jeux…",
        inject: {
          "acq.communication": [ { lever: "Animations, ateliers, communauté de clients" } ],
          "eco.marges": [ { alert: "Concurrence en ligne sur les références standard" } ]
        }},
      { id: "ecommerce", label: "E-commerce", modules: ["commerce", "abonnement"], unit: "site marchand",
        desc: "Vente en ligne de produits",
        ex: { traffic: 300000, conv: 0.018, convTarget: 0.022, basket: 55, basketTarget: 58, mcv: 0.35 },
        inject: {
          "eco.marges": [ { calc: "Marge après frais de port, retours et commissions de paiement" } ],
          "acq.developpement": [
            { calc: "Coût d’acquisition par canal : moteurs, réseaux sociaux, marketplaces" },
            { calc: "Retour sur dépenses publicitaires (ROAS)", f: "CA attribué ÷ dépenses publicitaires" },
            { alert: "Dépendance à un seul canal publicitaire" }
          ],
          "acq.fidelisation": [ { calc: "Taux de réachat à 12 mois" } ],
          "gest.tresorerie": [ { alert: "Stock acheté longtemps avant d’être vendu" } ],
          "exp.offre": [ { lever: "Abonnement ou réassort automatique" } ]
        }},
      { id: "auto", label: "Achat-revente automobile", modules: ["negoce"], naf: "45", unit: "véhicule",
        desc: "Véhicules d’occasion, négoce",
        inject: {
          "eco.marges": [
            { ask: "D’où viennent vos meilleures affaires à l’achat ?", key: true },
            { lever: "Frais de remise en état chiffrés avant d’acheter" },
            { lever: "Services associés : financement, extension de garantie, carte grise, livraison" }
          ],
          "gest.tresorerie": [
            { look: "Financement du stock : crédit stock, découvert, apport" },
            { alert: "Véhicules de plus de 90 jours sans décision de prix" }
          ],
          "eco.productivite": [ { calc: "Délai entre l’achat et la mise en ligne" } ],
          "acq.communication": [ { lever: "Annonces : photos nombreuses, description complète, prix cohérent avec la cote" } ],
          "acq.developpement": [ { look: "Canaux de diffusion : coût par contact et par vente" } ],
          "hum.process": [
            { look: "Régime de TVA appliqué véhicule par véhicule : sur marge ou classique" },
            { look: "Garantie légale, historique, contrôle technique, kilométrage" }
          ]
        }}
    ]},

  /* ================================================================== */
  { id: "intellectuel", label: "Services intellectuels", modules: ["intellectuel"], unit: "consultant",
    inject: {
      "acq.positionnement": [
        { lever: "Cas clients chiffrés en avant" }
      ],
      "gest.devis": [
        { lever: "Périmètre écrit ; tout ajout fait l’objet d’un avenant" }
      ]
    },
    subs: [
      { id: "conseil", label: "Conseil", naf: "70",
        desc: "Stratégie, gestion, organisation, RH",
        inject: {
          "eco.pricing": [ { lever: "Offre d’entrée à prix fixe : diagnostic ou audit" } ],
          "exp.offre": [ { lever: "Productiser la méthode : formation, licence, outil" } ]
        }},
      { id: "coaching", label: "Coaching & formation", naf: null, unit: "formateur ou coach",
        desc: "Accompagnement individuel, formation professionnelle",
        ex: { staff: 2, tjm: 900, occ: 0.45, occTarget: 0.55 },
        inject: {
          "eco.ca": [ { look: "Part individuel, groupe, entreprise, en ligne" } ],
          "eco.pricing": [ { lever: "Programmes de groupe : même temps passé, plusieurs clients" } ],
          "gest.facturation": [ { look: "Financements : OPCO, CPF, plans de développement des compétences" } ],
          "hum.process": [ { look: "Certification Qualiopi si les formations sont financées par des fonds publics ou mutualisés" } ],
          "exp.offre": [ { lever: "Formation en ligne et communauté payante" } ]
        }},
      { id: "agencemkt", label: "Agence marketing & communication", modules: ["intellectuel", "abonnement"], naf: "73",
        desc: "Communication, publicité, social media, site",
        inject: {
          "eco.ca": [ { calc: "Part des contrats mensuels récurrents" } ],
          "eco.marges": [
            { calc: "Rentabilité par client et par mission" },
            { alert: "Allers-retours illimités sur les créations" }
          ],
          "hum.process": [ { look: "Propriété des comptes publicitaires, des accès et des livrables" } ],
          "acq.positionnement": [ { lever: "Spécialisation sur un secteur ou un canal" } ]
        }},
      { id: "agenceia", label: "Agence IA & automatisation", modules: ["intellectuel", "abonnement"], naf: "62",
        desc: "Automatisation, agents, intégration d’outils",
        inject: {
          "eco.ca": [ { look: "Part projet, maintenance et abonnement" } ],
          "eco.marges": [
            { calc: "Coûts d’usage (API, hébergement, licences) par client" },
            { alert: "Coûts variables d’usage jamais refacturés" }
          ],
          "acq.fidelisation": [ { lever: "Maintenance et évolutions en abonnement mensuel" } ],
          "hum.process": [ { look: "Données clients, confidentialité, RGPD" } ],
          "acq.positionnement": [ { lever: "Cas d’usage chiffrés en heures gagnées pour le client" } ]
        }},
      { id: "esn", label: "ESN & informatique", naf: "62",
        desc: "Régie, forfait, développement, infogérance",
        ex: { staff: 20, tjm: 550, occ: 0.82, occTarget: 0.88, mcv: 0.95, rm: 0.06 },
        inject: {
          "eco.productivite": [
            { calc: "Taux d’intercontrat", f: "jours non facturés ÷ jours disponibles" },
            { calc: "TACE — taux d’activité congés exclus" },
            { alert: "Intercontrat qui s’allonge" }
          ],
          "eco.marges": [ { calc: "Marge par consultant", f: "TJM × jours facturés − coût complet" } ],
          "hum.rh": [ { alert: "Turnover des consultants" } ],
          "acq.developpement": [ { look: "Dépendance aux référencements grands comptes et aux plateformes" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "reglemente", label: "Professions réglementées", modules: ["intellectuel"], unit: "praticien",
    subs: [
      { id: "avocat", label: "Avocat", naf: "69", force: ["gest.recouvrement"],
        desc: "Cabinet individuel ou associé",
        ex: { staff: 3, tjm: 1200, occ: 0.55, occTarget: 0.62 },
        inject: {
          "eco.pricing": [
            { look: "Honoraires : temps passé, forfait, honoraire de résultat" },
            { calc: "Taux de réalisation", f: "honoraires facturés ÷ temps valorisé" },
            { lever: "Convention d’honoraires systématique" }
          ],
          "gest.recouvrement": [
            { calc: "Taux de recouvrement", f: "honoraires encaissés ÷ honoraires facturés" },
            { alert: "Provisions sur honoraires insuffisantes" }
          ]
        }},
      { id: "comptable", label: "Expert-comptable", modules: ["intellectuel", "abonnement"], naf: "69",
        desc: "Cabinet d’expertise comptable",
        inject: {
          "eco.ca": [ { calc: "Honoraires par dossier et par collaborateur" } ],
          "eco.productivite": [ { calc: "Dossiers par collaborateur" } ],
          "eco.pricing": [ { alert: "Lettres de mission jamais révisées" } ],
          "exp.offre": [ { lever: "Missions de conseil au-delà de la tenue et de la révision" } ],
          "exp.externe": [ { look: "Rachat de portefeuilles de clients" } ]
        }},
      { id: "architecte", label: "Architecte", naf: null,
        desc: "Maîtrise d’œuvre, conception",
        inject: {
          "eco.pricing": [ { look: "Honoraires en % des travaux ou forfait par phase" } ],
          "gest.facturation": [
            { lever: "Facturation à chaque phase de la mission" },
            { alert: "Phase chantier sous-évaluée au contrat" }
          ],
          "hum.process": [ { look: "Assurance professionnelle obligatoire à jour" } ]
        }},
      { id: "medecin", label: "Médecin & centre médical", modules: ["capacite"], naf: "86", unit: "praticien et cabinet",
        desc: "Cabinet, maison ou centre de santé",
        force: ["gest.recouvrement"],
        ex: { units: 1, slots: 8, slot: "heure", days: 220, occ: 0.85, occTarget: 0.90, price: 90, mcv: 0.95, rm: 0.35, basket: 30, freq: 3, years: 8 },
        inject: {
          "eco.productivite": [
            { calc: "Consultations par jour et par praticien" },
            { alert: "Temps administratif jamais délégué" }
          ],
          "hum.organisation": [ { lever: "Secrétariat et prise de rendez-vous en ligne" } ],
          "exp.multisite": [ { look: "Maison ou centre de santé : partage des coûts entre praticiens" } ]
        }},
      { id: "dentiste", label: "Dentiste", modules: ["capacite"], naf: "86", unit: "fauteuil dentaire",
        desc: "Cabinet dentaire",
        force: ["gest.recouvrement"],
        ex: { units: 2, slots: 8, slot: "heure", days: 210, occ: 0.70, occTarget: 0.78, price: 220, mcv: 0.80, rm: 0.25, basket: 180, freq: 1.5, years: 8 },
        inject: {
          "eco.ca": [ { look: "Part soins conventionnés, prothèses, implantologie, orthodontie" } ],
          "eco.productivite": [ { calc: "CA par heure de fauteuil" } ],
          "eco.marges": [ { calc: "Coût du prothésiste par acte" } ],
          "hum.organisation": [ { lever: "Assistante au fauteuil pour augmenter la capacité" } ],
          "acq.fidelisation": [ { lever: "Rappels de contrôle annuels" } ]
        }},
      { id: "kine", label: "Kinésithérapeute & paramédical", modules: ["capacite"], naf: "86", unit: "praticien",
        desc: "Kinésithérapie, ostéopathie, orthophonie…",
        ex: { units: 1, slots: 9, slot: "heure", days: 220, occ: 0.85, occTarget: 0.90, price: 40, mcv: 0.95, rm: 0.35, basket: 35, freq: 10, years: 1 },
        inject: {
          "eco.productivite": [ { calc: "Séances par jour et durée réelle" } ],
          "eco.ca": [ { lever: "Activités hors nomenclature : prévention, sport-santé" } ],
          "hum.organisation": [ { look: "Collaborateurs et assistants : rétrocessions d’honoraires" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "industrie", label: "Industrie & négoce", modules: ["production"], unit: "machine ou ligne",
    subs: [
      { id: "fabrication", label: "Fabrication & mécanique", naf: "25",
        desc: "Usinage, chaudronnerie, fabrication métallique",
        inject: {
          "eco.marges": [ { alert: "Prix jamais révisés malgré la hausse des matières" } ],
          "eco.pricing": [ { lever: "Clauses d’indexation sur les matières" } ],
          "eco.productivite": [ { look: "Goulot d’étranglement de l’atelier" } ],
          "hum.rh": [ { alert: "Compétence clé détenue par un seul opérateur" } ]
        }},
      { id: "agroalimentaire", label: "Agroalimentaire", naf: "10",
        desc: "Transformation et fabrication alimentaire",
        inject: {
          "eco.marges": [ { look: "Marge par canal : grande distribution, grossistes, vente directe" } ],
          "eco.ca": [ { alert: "Dépendance à la grande distribution" } ],
          "hum.process": [ { look: "Sécurité sanitaire et certifications exigées par les clients" } ]
        }},
      { id: "negoceindus", label: "Négoce industriel", modules: ["negoce"], naf: "46", unit: "référence en stock",
        desc: "Distribution B2B, commerce de gros",
        ex: { units: 4000, unitMargin: 90, avgCost: 310, stockDays: 60, stockDaysTarget: 45, mcv: 0.22 },
        inject: {
          "eco.marges": [ { calc: "Taux de marge commerciale par famille et par client" } ],
          "gest.tresorerie": [ { alert: "BFR qui absorbe toute la croissance" } ],
          "eco.pricing": [ { lever: "Conditions fournisseurs et remises de fin d’année renégociées" } ]
        }},
      { id: "soustraitance", label: "Sous-traitance industrielle", naf: "25",
        desc: "Production pour donneurs d’ordre",
        inject: {
          "eco.ca": [ { alert: "Dépendance à un donneur d’ordre" } ],
          "eco.pricing": [ { lever: "Révision de prix inscrite au contrat" } ],
          "exp.offre": [ { lever: "Produit propre pour réduire la dépendance" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "immobilier", label: "Immobilier", modules: ["pipeline"], unit: "négociateur",
    subs: [
      { id: "agenceimmo", label: "Agence immobilière",
        desc: "Transaction, location",
        ex: { quotes: 120, transfo: 0.35, transfoTarget: 0.42, avg: 8500, mcv: 0.75 },
        inject: {
          "eco.ca": [ { look: "Part transaction, gestion locative, location" } ],
          "eco.productivite": [
            { calc: "Mandats et ventes par négociateur" },
            { calc: "Part des mandats exclusifs" }
          ],
          "eco.pricing": [ { calc: "Taux d’honoraires réellement pratiqué après négociation" } ],
          "acq.developpement": [ { lever: "Mandats exclusifs" } ],
          "hum.rh": [ { look: "Statut des négociateurs : salariés ou agents commerciaux" } ],
          "hum.process": [ { look: "Carte professionnelle et garantie financière" } ]
        }},
      { id: "gestionloc", label: "Gestion locative & syndic", modules: ["abonnement"], unit: "lot géré",
        desc: "Administration de biens",
        ex: { clients: 800, arpu: 45, churn: 0.008, churnTarget: 0.005, newPerMonth: 6, mcv: 0.85 },
        inject: {
          "eco.ca": [ { calc: "CA récurrent", f: "lots gérés × honoraires moyens par lot" } ],
          "eco.productivite": [ { calc: "Lots par gestionnaire" } ],
          "acq.fidelisation": [ { calc: "Taux de résiliation des mandats" } ]
        }}
    ]},

  /* ================================================================== */
  { id: "autres", label: "Autre activité", unit: "unité productive",
    subs: [
      { id: "autrecapacite", label: "Activité à capacité physique", modules: ["capacite"], desc: "Salle, cabinet, atelier, équipement à remplir" },
      { id: "autreintellectuel", label: "Prestation intellectuelle", modules: ["intellectuel"], desc: "Vente de temps et d’expertise" },
      { id: "autrecommerce", label: "Commerce", modules: ["commerce"], desc: "Boutique, vente de produits" },
      { id: "autredevis", label: "Vente sur devis", modules: ["pipeline"], desc: "Prestations vendues au cas par cas" },
      { id: "autreabonnement", label: "Abonnement", modules: ["abonnement"], desc: "Revenus mensuels récurrents" },
      { id: "autremarketplace", label: "Plateforme ou marketplace", modules: ["marketplace"], desc: "Mise en relation, commission" }
    ]}
];
