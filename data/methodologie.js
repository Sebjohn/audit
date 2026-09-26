/* =====================================================================
   Ultra Audits — MÉTHODOLOGIE GÉNÉRALE
   ---------------------------------------------------------------------
   Six piliers, chacun découpé en blocs. Chaque bloc liste des items
   génériques ; les modules économiques, les secteurs et les
   sous-secteurs y ajoutent leurs propres items (voir modules.js et
   secteurs.js). Les repères chiffrés viennent de benchmarks.js.

   Un item porte son type en clé :
     ask     À demander       (question orale — key:true = question clé)
     look    À regarder       (donnée ou document à examiner)
     calc    À calculer       (f = formule)
     alert   Alerte
     explain À expliquer      (demo = id d'une démonstration de demos.js)
     lever   Levier
     gate    Condition de passage (expansion)

   Options d'un bloc :
     skip  : modules pour lesquels le bloc est masqué
             (un sous-secteur peut le réafficher avec force:[id])
     flow  : étapes d'un tunnel (remplaçables par le module)
     cx    : complexité 1 à 5 (expansion)   capital : texte
   ===================================================================== */
window.UA = window.UA || {};

UA.types = [
  { id: "ask",     label: "À demander",   icon: "❓" },
  { id: "look",    label: "À regarder",   icon: "📊" },
  { id: "calc",    label: "À calculer",   icon: "🧮" },
  { id: "bench",   label: "Repère",       icon: "📐" },
  { id: "alert",   label: "Alerte",       icon: "⚠️" },
  { id: "explain", label: "À expliquer",  icon: "💡" },
  { id: "lever",   label: "Levier",       icon: "🚀" },
  { id: "gate",    label: "Pour passer à l’étape suivante", icon: "🎯" }
];

UA.piliers = [

  /* ------------------------------------------------------------------ */
  { id: "perso", num: "01", icon: "👤", label: "Perso de l’entrepreneur", short: "Perso",
    blocs: [
      { id: "perso.etat", label: "État des lieux", items: [
        { ask: "Comment se compose votre foyer, et quelle place prend l’entreprise dans votre vie aujourd’hui ?" },
        { ask: "Sur 10, où en est votre énergie en ce moment ? Qu’est-ce qui vous pèse le plus ?" },
        { ask: "Combien d’heures par semaine y consacrez-vous réellement, soirs et week-ends compris ?", key: true },
        { ask: "Quel revenu vous versez-vous aujourd’hui, et est-il régulier ?" },
        { ask: "Jusqu’où êtes-vous prêt à prendre des risques financiers ?" },
        { ask: "Qu’aimez-vous encore dans votre travail — et que ne voulez-vous plus faire ?" },
        { look: "Rémunération totale du dirigeant : salaire, dividendes, avantages" },
        { look: "Cautions personnelles données aux banques et aux bailleurs" },
        { look: "Situation financière personnelle : charges fixes du foyer, crédits" },
        { calc: "Taux horaire réel du dirigeant", f: "rémunération annuelle ÷ heures travaillées sur l’année" },
        { alert: "Semaines de plus de 60 heures installées dans la durée" },
        { alert: "Rémunération ramenée à l’heure inférieure à celle d’un salarié de l’entreprise" },
        { alert: "Fatigue, sommeil dégradé, irritabilité : la charge mentale devient un risque pour l’entreprise" },
        { explain: "Le vrai taux horaire du dirigeant", demo: "tauxhoraire" }
      ]},
      { id: "perso.objectifs", label: "Objectifs personnels", items: [
        { ask: "Quel revenu net mensuel voulez-vous vous verser ?", key: true },
        { ask: "Combien d’heures par semaine voulez-vous travailler, et combien de semaines de congés par an ?" },
        { ask: "Quelle liberté recherchez-vous : partir un mois, choisir vos clients, travailler d’ailleurs ?" },
        { ask: "Où voulez-vous en être dans 1 an ? Dans 3 ans ? Dans 5 ans ?" },
        { ask: "Envisagez-vous de vendre ou de transmettre un jour ? À quel horizon ?" },
        { ask: "Quel niveau de vie visez-vous pour votre famille ?" },
        { calc: "Écart de revenu", f: "revenu souhaité − revenu actuel" },
        { calc: "Résultat supplémentaire nécessaire", f: "écart de revenu × coefficient de charges du statut" },
        { alert: "Objectifs contradictoires : plus de revenu, moins d’heures, sans rien changer à l’organisation" },
        { alert: "Aucun objectif chiffré au-delà de l’année en cours" },
        { explain: "Du revenu souhaité au chiffre d’affaires à trouver", demo: "revenu" },
        { lever: "Faire de l’objectif personnel le fil rouge de l’accompagnement" }
      ]},
      { id: "perso.vision", label: "Vision", items: [
        { ask: "Pourquoi cette entreprise existe-t-elle ? Qu’apporte-t-elle que les autres n’apportent pas ?" },
        { ask: "Quel rôle voulez-vous jouer dans 3 ans, 5 ans, 10 ans ?" },
        { ask: "Aujourd’hui, êtes-vous d’abord celui qui produit, ou celui qui dirige ?", key: true },
        { ask: "Votre entreprise est-elle un emploi que vous vous êtes créé, ou un actif que vous construisez ?" },
        { alert: "Le dirigeant reste le premier producteur de l’entreprise" },
        { alert: "Aucune projection au-delà des 12 prochains mois" },
        { explain: "Emploi ou actif : une entreprise qui dépend de son dirigeant se revend mal", demo: "valorisation" },
        { lever: "Formaliser une vision à 3 ans, chiffrée et partagée avec l’équipe" }
      ]},
      { id: "perso.patrimoine", label: "Patrimoine", items: [
        { ask: "Si l’entreprise s’arrêtait demain, que resterait-il à votre famille ?", key: true },
        { ask: "Les murs de l’entreprise vous appartiennent-ils ?" },
        { look: "Immobilier personnel, dont résidence principale" },
        { look: "Liquidités et épargne de précaution" },
        { look: "Investissements financiers" },
        { look: "Dettes personnelles" },
        { look: "Patrimoine professionnel : parts sociales, compte courant, murs, matériel" },
        { calc: "Dépendance du patrimoine à l’entreprise", f: "patrimoine professionnel ÷ patrimoine total" },
        { alert: "L’essentiel du patrimoine familial est investi dans l’entreprise" },
        { alert: "Aucune épargne de précaution en dehors de l’entreprise" },
        { alert: "Cautions personnelles jamais revues" },
        { lever: "Organiser la sortie de la trésorerie excédentaire — à étudier avec l’expert-comptable" },
        { lever: "Protéger la famille : prévoyance, assurance homme-clé — à étudier avec les conseils du dirigeant" }
      ]}
    ]},

  /* ------------------------------------------------------------------ */
  { id: "eco", num: "02", icon: "💰", label: "Économique", short: "Économique",
    blocs: [
      { id: "eco.ca", label: "Chiffre d’affaires", items: [
        { ask: "Quelle activité vous rapporte le plus — et laquelle vous prend le plus de temps ?", key: true },
        { ask: "Quelle part de votre chiffre d’affaires est acquise d’avance chaque mois ?" },
        { look: "CA total des 3 derniers exercices et de l’année en cours" },
        { look: "CA par activité, par produit ou service" },
        { look: "CA par client : les 10 premiers" },
        { look: "Saisonnalité mois par mois" },
        { calc: "Évolution du CA", f: "(CA N − CA N-1) ÷ CA N-1" },
        { calc: "CA par salarié et par ETP", f: "CA ÷ effectif en équivalent temps plein" },
        { calc: "CA par unité productive", f: "CA ÷ nombre d’unités productives" },
        { calc: "Part récurrente", f: "CA récurrent ÷ CA total" },
        { calc: "Concentration", f: "CA du 1er client ÷ CA — puis des 5 premiers" },
        { alert: "Hausse du CA inférieure à l’inflation : le volume recule" },
        { alert: "Un client ou un prescripteur pèse une part dominante du CA" },
        { alert: "Une activité en déclin absorbe l’essentiel du temps" },
        { lever: "Développer la part récurrente : abonnement, contrat, forfait" },
        { lever: "Rééquilibrer le mix vers les activités les plus rentables" }
      ]},
      { id: "eco.pricing", label: "Pricing", items: [
        { ask: "Quand avez-vous augmenté vos prix pour la dernière fois ?", key: true },
        { ask: "Comment avez-vous fixé vos prix : coûts, concurrents, intuition ?" },
        { ask: "Quelles remises accordez-vous, à qui, et qui décide ?" },
        { ask: "Avez-vous déjà perdu un client à cause du prix ?" },
        { look: "Prix moyen et grille par produit ou service" },
        { look: "Panier moyen et son évolution" },
        { look: "Remises et gestes commerciaux, en valeur annuelle" },
        { look: "Positionnement face à 3 concurrents directs" },
        { calc: "Panier moyen", f: "CA ÷ nombre de ventes" },
        { calc: "Taux de remise", f: "remises accordées ÷ CA brut" },
        { calc: "Élasticité, si pertinente", f: "variation du volume ÷ variation du prix" },
        { alert: "Aucune hausse de prix depuis plus de deux ans" },
        { alert: "Prix calés sur le concurrent le moins cher" },
        { alert: "Remises accordées sans règle ni suivi" },
        { explain: "Impact d’une hausse de prix sur le résultat", demo: "pricing" },
        { explain: "Combien de clients peut-on perdre sans perdre d’argent ?", demo: "volume" },
        { lever: "Hausse de prix ciblée, annoncée et argumentée" },
        { lever: "Grille à trois niveaux : essentiel, standard, premium" },
        { lever: "Suppression des remises non justifiées" }
      ]},
      { id: "eco.marges", label: "Marges", items: [
        { ask: "Quelle est votre marge sur chaque prestation ou produit ?", key: true },
        { ask: "Savez-vous quelle activité vous fait perdre de l’argent ?" },
        { look: "Coût matière et achats consommés" },
        { look: "Coûts directs par activité : main-d’œuvre, sous-traitance, commissions" },
        { look: "Charges fixes : loyer, salaires de structure, abonnements" },
        { look: "Compte de résultat et soldes intermédiaires de gestion" },
        { calc: "Marge brute", f: "CA − achats consommés" },
        { calc: "Marge sur coûts directs (MCD)", f: "CA − coûts directs de l’activité" },
        { calc: "Marge opérationnelle", f: "résultat d’exploitation ÷ CA" },
        { calc: "EBE", f: "valeur ajoutée + subventions − impôts et taxes − charges de personnel" },
        { calc: "Marge par activité, produit, client et site" },
        { calc: "Point mort", f: "charges fixes ÷ taux de marge sur coûts variables" },
        { alert: "Marge anormalement basse pour le métier" },
        { alert: "Coût matière élevé ou en dérive" },
        { alert: "Remises importantes qui écrasent la marge" },
        { alert: "Une activité à marge négative financée par les autres" },
        { explain: "Le point mort et la marge de sécurité", demo: "pointmort" },
        { lever: "Pricing" },
        { lever: "Mix produit : pousser ce qui marge le plus" },
        { lever: "Réduction des coûts directs et des achats" },
        { lever: "Upsell et vente additionnelle" }
      ]},
      { id: "eco.productivite", label: "Productivité", items: [
        { ask: "Quelle est votre capacité maximale, et quelle part en vendez-vous réellement ?", key: true },
        { ask: "Combien d’heures payées ne sont jamais facturées ?" },
        { look: "Heures travaillées, vendues et facturées" },
        { look: "Planning réel sur une semaine type" },
        { calc: "CA par salarié, par ETP et par heure" },
        { calc: "Marge par salarié et par heure" },
        { calc: "Taux d’utilisation", f: "heures vendues ÷ heures payées" },
        { calc: "Taux de remplissage", f: "capacité vendue ÷ capacité disponible" },
        { alert: "Capacité peu vendue et aucune action commerciale pour la remplir" },
        { alert: "Temps non facturé jamais mesuré" },
        { lever: "Remplir la capacité existante avant d’en ajouter" }
      ]},
      { id: "eco.potentiel", label: "Potentiel économique", items: [
        { ask: "Combien cette entreprise pourrait-elle générer avec les ressources qu’elle possède déjà ?", key: true },
        { calc: "CA potentiel", f: "formule du modèle économique, portée au niveau cible" },
        { calc: "Résultat potentiel", f: "CA potentiel × taux de marge sur coûts variables − charges fixes" },
        { calc: "Écart de potentiel", f: "CA potentiel − CA actuel" },
        { alert: "Le dirigeant veut investir alors que l’existant n’est pas rempli" },
        { explain: "Le potentiel déjà présent dans l’entreprise", demo: "potentiel" },
        { lever: "Prioriser les leviers qui ne demandent aucun investissement" }
      ]},
      { id: "eco.roi", label: "Cible de remboursement", items: [
        { ask: "Si vous pouviez améliorer un seul chiffre cette année, lequel changerait tout ?" },
        { look: "Gains possibles : prix, volume, conversion, taux d’utilisation, marge, coûts, rétention" },
        { calc: "Gain annuel par levier", f: "assiette × amélioration × taux de marge" },
        { calc: "Délai de remboursement de l’accompagnement", f: "coût de l’accompagnement ÷ gain mensuel" },
        { explain: "Trois petits leviers, un gros résultat", demo: "roi" },
        { lever: "Chiffrer 2 ou 3 leviers devant le dirigeant et démarrer par le plus rapide" }
      ]},
      { id: "eco.valorisation", label: "Valorisation", items: [
        { ask: "Avez-vous une idée de ce que vaut votre entreprise aujourd’hui ?" },
        { look: "CA, EBE, EBIT et leur tendance sur 3 ans" },
        { look: "Croissance, récurrence et concentration des clients" },
        { look: "Dépendance au dirigeant, solidité de l’équipe et des process" },
        { look: "Propriété intellectuelle, marque, fichier clients" },
        { look: "Dette financière et actifs : murs, matériel, stock" },
        { calc: "Valeur par les multiples", f: "EBE retraité × multiple du secteur − dette nette" },
        { calc: "Comparables : transactions récentes du secteur" },
        { calc: "DCF, si les flux sont prévisibles" },
        { alert: "Forte dépendance au dirigeant ou à un client : décote" },
        { alert: "EBE non retraité de la rémunération normale du dirigeant" },
        { explain: "Ce que vaut chaque euro d’EBE supplémentaire", demo: "valorisation" },
        { lever: "Augmenter l’EBE, la récurrence et l’autonomie de l’équipe" }
      ]}
    ]},

  /* ------------------------------------------------------------------ */
  { id: "gest", num: "03", icon: "📊", label: "Gestion", short: "Gestion",
    blocs: [
      { id: "gest.devis", label: "Devis", skip: ["capacite", "commerce", "abonnement", "marketplace"], items: [
        { ask: "En combien de temps un devis part-il après la demande ?", key: true },
        { ask: "Chiffrez-vous sur place, devant le client ?" },
        { ask: "Que se passe-t-il quand un devis ne revient pas ?" },
        { look: "Nombre de devis émis sur 12 mois" },
        { look: "Montant moyen des devis" },
        { look: "Délai d’envoi et délai de décision du client" },
        { look: "Procédure de relance" },
        { calc: "Taux de transformation", f: "devis signés ÷ devis émis, en nombre et en valeur" },
        { alert: "Devis envoyés plusieurs jours après la demande" },
        { alert: "Aucune relance systématique" },
        { alert: "Taux de transformation inconnu" },
        { lever: "Délais des devis et chiffrage sur place" },
        { lever: "Relance à J+3, J+8 et J+15" },
        { lever: "Devis types avec options pour gagner du temps et monter le panier" }
      ]},
      { id: "gest.facturation", label: "Facturation", items: [
        { ask: "Combien de temps s’écoule entre la fin de la prestation et l’envoi de la facture ?", key: true },
        { look: "Facturation à l’avance ou à terme" },
        { look: "Acomptes : montant, déclenchement, systématisation" },
        { look: "Conditions de paiement inscrites sur les devis et les factures" },
        { alert: "Factures émises en fin de mois, voire plus tard" },
        { alert: "Prestations démarrées sans acompte" },
        { lever: "Facturation le jour même" },
        { lever: "Acompte systématique à la commande" },
        { lever: "Paiement à la commande ou prélèvement" }
      ]},
      { id: "gest.recouvrement", label: "Recouvrement", skip: ["capacite", "commerce"], items: [
        { ask: "Qui relance les impayés, et quand ?", key: true },
        { look: "Balance âgée des créances" },
        { look: "Créances échues et impayés" },
        { look: "Procédure de relance écrite" },
        { calc: "DSO — délai de paiement clients", f: "créances clients ÷ CA TTC × 365" },
        { alert: "Créances de plus de 90 jours non traitées" },
        { alert: "Relances au feeling, sans calendrier" },
        { explain: "Le cash libéré en réduisant le délai client", demo: "dso" },
        { lever: "Relances calées : J+1, J+8, J+15 puis mise en demeure" },
        { lever: "Pénalités de retard et indemnité forfaitaire de 40 € inscrites aux conditions générales" },
        { lever: "Affacturage pour les gros comptes lents" }
      ]},
      { id: "gest.tresorerie", label: "Trésorerie", items: [
        { ask: "Quel est votre solde bancaire aujourd’hui — et le plus bas de l’année ?", key: true },
        { look: "Cash disponible" },
        { look: "BFR et son évolution" },
        { look: "Dettes fiscales et sociales, échéanciers en cours" },
        { look: "Échéances d’emprunts et de leasing" },
        { calc: "BFR", f: "stocks + créances clients − dettes fournisseurs" },
        { calc: "Délai fournisseurs (DPO)", f: "dettes fournisseurs ÷ achats TTC × 365" },
        { calc: "Runway", f: "trésorerie disponible ÷ décaissements mensuels" },
        { alert: "Dettes fiscales ou sociales en retard" },
        { alert: "Découvert utilisé en permanence" },
        { alert: "Moins de quelques mois de charges d’avance" },
        { explain: "Méthode L’Oréal : encaisser avant de décaisser", demo: "loreal" },
        { lever: "Méthode L’Oréal et optimisation du temps de paiement" },
        { lever: "Acomptes systématiques" },
        { lever: "Affacturage, cession Dailly, financement BFR, RBF" }
      ]},
      { id: "gest.previsionnel", label: "Prévisionnel", items: [
        { ask: "Savez-vous quel sera votre solde bancaire dans 3 mois ?", key: true },
        { look: "Prévisionnel de trésorerie existant" },
        { look: "Vision à 13 semaines glissantes" },
        { look: "Vision à 12 mois" },
        { look: "Scénarios haut et bas" },
        { look: "Seuils d’alerte" },
        { alert: "Aucun prévisionnel : les difficultés se découvrent sur le relevé bancaire" },
        { lever: "Plan de trésorerie à 13 semaines, mis à jour chaque semaine" },
        { lever: "Un seuil d’alerte de trésorerie défini et connu" }
      ]},
      { id: "gest.pilotage", label: "Pilotage", items: [
        { ask: "Quels chiffres regardez-vous chaque jour ? Chaque semaine ? Chaque mois ?", key: true },
        { look: "Indicateurs réellement suivis, et par qui" },
        { look: "Outils : caisse, logiciel métier, tableur, comptabilité" },
        { alert: "Le résultat se découvre au bilan, des mois après" },
        { alert: "Indicateurs suivis mais jamais transformés en décisions" },
        { lever: "Tableau de bord de 5 à 7 indicateurs adaptés au métier" },
        { lever: "Créneau de pilotage hebdomadaire bloqué dans l’agenda" }
      ]}
    ]},

  /* ------------------------------------------------------------------ */
  { id: "hum", num: "04", icon: "👥", label: "Humain & management", short: "Humain",
    blocs: [
      { id: "hum.organisation", label: "Organisation", items: [
        { ask: "Si vous disparaissez pendant 30 jours, que se passe-t-il ?", key: true },
        { ask: "Qui peut prendre une décision sans vous ?" },
        { look: "Organigramme réel, pas théorique" },
        { look: "Rôles et responsabilités écrits" },
        { look: "Managers intermédiaires" },
        { look: "Tâches encore réalisées par le dirigeant" },
        { calc: "Temps du dirigeant sur des tâches déléguables", f: "heures déléguables ÷ heures travaillées" },
        { alert: "Toutes les décisions remontent au dirigeant" },
        { alert: "Le dirigeant réalise lui-même des tâches à faible valeur" },
        { explain: "Le vrai coût des tâches de smicard", demo: "delegation" },
        { lever: "Délégation des tâches de smicard" },
        { lever: "Nommer un bras droit ou un responsable d’équipe" }
      ]},
      { id: "hum.recrutement", label: "Recrutement", items: [
        { ask: "Quel poste vous manque le plus aujourd’hui ?", key: true },
        { ask: "Combien de temps faut-il pour recruter, et combien de recrues restent au-delà de 6 mois ?" },
        { look: "Besoins et profils recherchés" },
        { look: "Coût complet d’un recrutement" },
        { look: "Canaux utilisés et délai de recrutement" },
        { look: "Parcours d’intégration" },
        { calc: "ROI d’un recrutement", f: "marge générée par le poste − coût complet annuel" },
        { alert: "Recrutements dans l’urgence, sans fiche de poste" },
        { alert: "Départs fréquents dans les premiers mois" },
        { explain: "Ce qu’un recrutement doit rapporter", demo: "recrutement" },
        { lever: "Fiche de poste, grille d’entretien et intégration écrites" }
      ]},
      { id: "hum.rh", label: "RH", items: [
        { look: "Masse salariale et son évolution" },
        { look: "Turnover et absentéisme" },
        { look: "Ancienneté moyenne" },
        { look: "Grille de rémunération et primes" },
        { look: "Plan de formation" },
        { calc: "Masse salariale ÷ CA", f: "salaires et charges ÷ CA" },
        { calc: "CA par salarié" },
        { calc: "Turnover", f: "départs de l’année ÷ effectif moyen" },
        { calc: "Taux d’absentéisme", f: "heures d’absence ÷ heures théoriques" },
        { alert: "Masse salariale qui progresse plus vite que le CA" },
        { alert: "Absentéisme ou turnover élevés, jamais analysés" },
        { lever: "Rémunération variable indexée sur les indicateurs du métier" },
        { lever: "Formation ciblée sur la vente et la productivité" }
      ]},
      { id: "hum.management", label: "Management", items: [
        { ask: "Chaque collaborateur connaît-il ses objectifs chiffrés ?", key: true },
        { look: "Objectifs individuels et collectifs" },
        { look: "Réunions : fréquence, durée, utilité" },
        { look: "Entretiens individuels (1-to-1)" },
        { look: "Feedback et reconnaissance" },
        { look: "Indicateurs partagés avec l’équipe" },
        { alert: "Aucune réunion d’équipe régulière" },
        { alert: "Objectifs non chiffrés ou inconnus de l’équipe" },
        { lever: "Rituel hebdomadaire court, centré sur les chiffres" },
        { lever: "Entretien individuel mensuel de 20 minutes" },
        { lever: "Responsabiliser : un indicateur par personne" }
      ]},
      { id: "hum.process", label: "Process & conformité", items: [
        { ask: "Qu’est-ce qui ne fonctionne que parce que vous êtes là ?", key: true },
        { look: "Processus critiques : vente, production, facturation, qualité" },
        { look: "Documentation existante" },
        { look: "Automatisations en place" },
        { look: "Contrôle qualité" },
        { alert: "Savoir-faire uniquement dans la tête du dirigeant" },
        { alert: "Erreurs répétées sur les mêmes étapes" },
        { lever: "Écrire les 5 processus critiques, une page chacun" },
        { lever: "Automatiser relances, rappels, devis et factures" }
      ]}
    ]},

  /* ------------------------------------------------------------------ */
  { id: "acq", num: "05", icon: "📣", label: "Acquisition", short: "Acquisition",
    blocs: [
      { id: "acq.communication", label: "Communication", items: [
        { ask: "Comment vos derniers clients vous ont-ils trouvé ?", key: true },
        { look: "Branding : logo, charte, cohérence" },
        { look: "Contenus publiés et fréquence" },
        { look: "Réseaux sociaux" },
        { look: "SEO et fiche Google" },
        { look: "Publicité payante et budget" },
        { look: "Réputation : note et volume d’avis" },
        { look: "Bouche-à-oreille et recommandation" },
        { alert: "Fiche Google incomplète ou avis sans réponse" },
        { alert: "Budget publicitaire dépensé sans mesure du retour" },
        { lever: "Demande d’avis systématique après chaque prestation" },
        { lever: "Un canal maîtrisé plutôt que cinq négligés" }
      ]},
      { id: "acq.positionnement", label: "Positionnement", items: [
        { ask: "Pourquoi un client vous choisit-il plutôt qu’un concurrent ?", key: true },
        { ask: "Quel problème résolvez-vous, et pour qui précisément ?" },
        { look: "Cible" },
        { look: "Problème traité" },
        { look: "Promesse" },
        { look: "Différenciation" },
        { look: "Preuves : avis, cas clients, chiffres" },
        { look: "Offre et sa lisibilité" },
        { alert: "Positionnement « on fait tout pour tout le monde »" },
        { alert: "Aucune preuve visible de résultat" },
        { lever: "Resserrer la cible et reformuler la promesse" },
        { lever: "Mettre les preuves au premier plan" }
      ]},
      { id: "acq.developpement", label: "Développement commercial", items: [
        { ask: "Combien de nouvelles demandes recevez-vous par mois, et d’où viennent-elles ?", key: true },
        { look: "Leads par source" },
        { look: "Coût par lead et qualité des leads" },
        { look: "Rendez-vous obtenus" },
        { look: "Devis et conversion" },
        { look: "Qui vend : dirigeant, équipe, commercial" },
        { calc: "Coût par lead", f: "budget ÷ leads obtenus" },
        { calc: "Coût d’acquisition client (CAC)", f: "dépenses commerciales et marketing ÷ nouveaux clients" },
        { alert: "Toute la vente repose sur le dirigeant" },
        { alert: "Origine des clients inconnue" },
        { lever: "Répondre aux demandes entrantes dans l’heure" },
        { lever: "Prescripteurs et partenaires" }
      ]},
      { id: "acq.tunnel", label: "Tunnel",
        flow: ["Audience", "Lead", "Prospect", "Rendez-vous", "Offre / devis", "Client", "Client récurrent"],
        items: [
        { ask: "À quelle étape perdez-vous le plus de monde ?", key: true },
        { calc: "Pour chaque étape", f: "volume × taux de conversion × valeur moyenne" },
        { alert: "Étape de fuite majeure jamais identifiée" },
        { explain: "Le tunnel en chiffres", demo: "tunnel" },
        { lever: "Travailler l’étape la plus faible avant d’acheter plus d’audience" }
      ]},
      { id: "acq.fidelisation", label: "Fidélisation", items: [
        { ask: "Combien de vos clients reviennent, et au bout de combien de temps ?", key: true },
        { look: "Fréquence d’achat" },
        { look: "Rétention et churn" },
        { look: "Réachat" },
        { look: "Panier moyen" },
        { look: "Durée de vie client" },
        { calc: "LTV — valeur vie client", f: "panier moyen × fréquence annuelle × durée de vie × taux de marge" },
        { calc: "Taux de rétention", f: "clients de N-1 encore actifs en N ÷ clients de N-1" },
        { alert: "Aucune action vers les clients existants" },
        { alert: "Fichier client inexploitable" },
        { explain: "Ce que vaut un client fidèle", demo: "ltv" },
        { lever: "Relance des clients dormants" },
        { lever: "Programme de fidélité ou abonnement" }
      ]}
    ]},

  /* ------------------------------------------------------------------ */
  { id: "exp", num: "06", icon: "🚀", label: "Expansion", short: "Expansion", sequence: true,
    intro: "À parcourir dans l’ordre : on ne passe à l’étape suivante qu’une fois la précédente solide.",
    blocs: [
      { id: "exp.optimisation", label: "Optimisation de l’existant", cx: 1, capital: "Aucun ou faible", items: [
        { look: "Prérequis : chiffres fiables et marges connues par activité" },
        { alert: "Risque : ouvrir trop de chantiers à la fois" },
        { lever: "Potentiel : souvent le meilleur rendement, sans investissement" },
        { gate: "Capacité remplie, marges au niveau du métier, trésorerie positive" }
      ]},
      { id: "exp.offre", label: "Nouvelle offre ou activité", cx: 2, capital: "Faible à moyen", items: [
        { look: "Conditions : clients existants demandeurs, compétence disponible" },
        { look: "Prérequis : l’activité principale tourne sans le dirigeant au quotidien" },
        { alert: "Risques : cannibalisation, image brouillée, équipe surchargée" },
        { lever: "Potentiel : panier moyen, fréquence, nouvelle cible" },
        { gate: "Nouvelle offre rentable sur 6 mois et vendue sans le dirigeant" }
      ]},
      { id: "exp.pointdevente", label: "Nouveau point de vente", cx: 3, capital: "Moyen à élevé", items: [
        { look: "Conditions : premier site saturé et rentable, zone étudiée" },
        { look: "Prérequis : un responsable capable de tenir un site seul" },
        { calc: "Capital nécessaire", f: "travaux + matériel + fonds de roulement + pertes de démarrage" },
        { alert: "Risques : pertes de lancement, dirigeant éclaté entre deux sites" },
        { lever: "Potentiel : capacité doublée, économies d’achat" },
        { gate: "Second site à l’équilibre et piloté par un responsable" }
      ]},
      { id: "exp.multisite", label: "Multi-site", cx: 4, capital: "Élevé", items: [
        { look: "Prérequis : process écrits, indicateurs par site, fonctions centrales" },
        { calc: "Contribution nette", f: "Σ contributions des sites − coûts centraux" },
        { alert: "Risque : des coûts centraux qui grossissent plus vite que les sites" },
        { explain: "Ce que coûtent vraiment les coûts centraux", demo: "multisites" },
        { lever: "Potentiel : effet d’échelle sur achats, marketing, recrutement" },
        { gate: "Chaque site contribue positivement après coûts centraux" }
      ]},
      { id: "exp.franchise", label: "Franchise ou licence", cx: 4, capital: "Moyen (structuration)", items: [
        { look: "Conditions : concept reproductible et rentable sur plusieurs sites" },
        { look: "Prérequis : savoir-faire formalisé, marque protégée, manuel opératoire" },
        { alert: "Risques : obligations d’information précontractuelle, qualité du réseau" },
        { lever: "Potentiel : croissance financée par les franchisés, redevances récurrentes" },
        { gate: "Au moins deux sites rentables pilotés sans le fondateur" }
      ]},
      { id: "exp.externe", label: "Croissance externe", cx: 5, capital: "Élevé", items: [
        { look: "Conditions : cibles identifiées, capacité d’intégration" },
        { calc: "Capital nécessaire", f: "prix d’acquisition + coûts d’intégration, financement par dette" },
        { alert: "Risques : surpayer, perdre les clients ou l’équipe rachetée" },
        { lever: "Potentiel : clients, équipes, zone ou savoir-faire acquis d’un coup" },
        { gate: "Première intégration réussie et synergies mesurées" }
      ]},
      { id: "exp.levee", label: "Levée de fonds", cx: 5, capital: "Apporté par les investisseurs", items: [
        { look: "Conditions : marché large, croissance forte, modèle qui se réplique" },
        { look: "Prérequis : prévisionnel solide, équipe dirigeante, gouvernance" },
        { alert: "Risques : dilution, perte de contrôle, pression sur la croissance" },
        { lever: "Potentiel : financer une croissance que la trésorerie ne peut pas porter" },
        { gate: "Usage des fonds précis et traction démontrée" }
      ]},
      { id: "exp.revente", label: "Revente ou transmission", cx: 4, capital: "—", items: [
        { look: "Conditions : entreprise autonome sans le dirigeant, comptes propres sur 3 ans" },
        { look: "Prérequis : dépendances réduites au dirigeant, à un client, à un fournisseur" },
        { alert: "Risque : décote si l’activité repose sur le dirigeant" },
        { explain: "Ce que vaut l’entreprise, et comment l’augmenter", demo: "valorisation" },
        { lever: "Potentiel : valeur démultipliée par la récurrence et l’EBE" },
        { gate: "Valorisation cible atteinte et repreneur identifié" }
      ]}
    ]}
];
