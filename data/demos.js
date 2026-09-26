/* =====================================================================
   Ultra Audits — DÉMONSTRATIONS
   ---------------------------------------------------------------------
   Chaque démonstration calcule un exemple illustratif à partir du
   profil du modèle économique (modules.js), surchargé par le secteur et
   le sous-secteur (champ ex de secteurs.js).

     title    : titre affiché
     presets  : variantes cliquables { label, v }
     run(p, v, ctx) → { rows: [[libellé, valeur, classe]], note }
        classe : "strong" (résultat), "up" (gain), "sub" (détail)
        ctx    : { mod: id du modèle principal, flow: étapes du tunnel,
                   unit: unité productive, f: formatage }

   Les chiffres sont des EXEMPLES, jamais des benchmarks.
   ===================================================================== */
window.UA = window.UA || {};

/* CA de l'exemple selon le modèle économique. */
UA.demoBase = {
  capacite:     function (p) { return p.units * p.slots * p.days * p.occ * p.price; },
  intellectuel: function (p) { return p.staff * p.daysAvail * p.occ * p.tjm; },
  commerce:     function (p) { return p.traffic * p.conv * p.basket; },
  abonnement:   function (p) { return p.clients * p.arpu * 12; },
  chantier:     function (p) { return p.quotes * p.transfo * p.avg; },
  pipeline:     function (p) { return p.quotes * p.transfo * p.avg; },
  heures:       function (p) { return p.agents * p.hoursPaid * p.billed * p.rate; },
  negoce:       function (p) { return p.units * (p.avgCost + p.unitMargin); },
  production:   function (p) { return p.hours * p.trs * p.mph / p.mcv; },
  marketplace:  function (p) { return p.traffic * p.conv * p.basket * p.take; }
};

UA.demos = {

  /* ------------------------------------------------------------------ */
  pricing: {
    title: "Impact d’une hausse de prix",
    presets: [ { label: "+5 %", v: 0.05 }, { label: "+10 %", v: 0.10 } ],
    run: function (p, v, c) {
      var f = c.f, r0 = p.ca * p.rm, r1 = r0 + p.ca * v;
      return {
        rows: [
          ["CA actuel", f.eur(p.ca)],
          ["CA après hausse, à volume constant", f.eur(p.ca * (1 + v))],
          ["Résultat actuel", f.eur(r0), "sub"],
          ["Résultat après hausse", f.eur(r1), "strong"],
          ["Effet sur le résultat", "+" + f.pct((r1 - r0) / r0) + " (" + f.mult(r1 / r0) + ")", "up"]
        ],
        note: "Une hausse de prix ne coûte rien à produire : si les coûts restent identiques, elle tombe entièrement dans le résultat. +" +
              f.pct(v) + " de prix, c’est " + f.mult(r1 / r0) + " de résultat."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  volume: {
    title: "Combien de clients peut-on perdre ?",
    presets: [ { label: "+5 %", v: 0.05 }, { label: "+10 %", v: 0.10 }, { label: "+15 %", v: 0.15 } ],
    run: function (p, v, c) {
      var f = c.f, loss = v / (p.mcv + v);
      return {
        rows: [
          ["Taux de marge sur coûts variables", f.pct(p.mcv)],
          ["Hausse de prix", "+" + f.pct(v)],
          ["Perte de volume supportable", "jusqu’à " + f.pct(loss, 1), "strong"]
        ],
        note: "Au même résultat, la hausse de " + f.pct(v) + " reste gagnante tant que l’on perd moins de " +
              f.pct(loss, 1) + " des ventes. En pratique, on en perd presque toujours bien moins."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  pointmort: {
    title: "Point mort et marge de sécurité",
    run: function (p, v, c) {
      var f = c.f, cf = p.ca * p.mcv - p.ca * p.rm, capm = cf / p.mcv, day = Math.round(capm / p.ca * 365);
      return {
        rows: [
          ["Charges fixes", f.eur(cf)],
          ["Taux de marge sur coûts variables", f.pct(p.mcv)],
          ["CA du point mort", f.eur(capm), "strong"],
          ["CA actuel", f.eur(p.ca)],
          ["Marge de sécurité", f.pct((p.ca - capm) / p.ca, 1), "up"],
          ["Point mort atteint vers le", f.day(day), "sub"]
        ],
        note: "Jusqu’au " + f.day(day) + ", l’entreprise travaille pour payer ses charges. Chaque euro de CA au-delà rapporte " +
              f.cents(p.mcv) + " de résultat."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  potentiel: {
    title: "Le potentiel déjà présent dans l’entreprise",
    presetsBy: {
      capacite:     [ { label: "+5 points d’occupation", v: 0.05 }, { label: "+10 points", v: 0.10 }, { label: "+15 points", v: 0.15 } ],
      intellectuel: [ { label: "+5 points d’occupation", v: 0.05 }, { label: "+10 points", v: 0.10 } ],
      commerce:     [ { label: "+2 points de conversion", v: "conv" }, { label: "+5 % de panier", v: "basket" }, { label: "Les deux", v: "both" } ],
      abonnement:   [ { label: "Churn réduit d’un quart", v: 0.75 }, { label: "Churn réduit d’un tiers", v: 0.667 } ],
      chantier:     [ { label: "+5 points de transformation", v: 0.05 }, { label: "+10 points", v: 0.10 } ],
      pipeline:     [ { label: "+5 points de transformation", v: 0.05 }, { label: "+10 points", v: 0.10 } ],
      heures:       [ { label: "+4 points d’heures facturées", v: 0.04 }, { label: "+8 points", v: 0.08 } ],
      negoce:       [ { label: "Stock ramené à 60 jours", v: 60 }, { label: "Stock ramené à 45 jours", v: 45 } ],
      production:   [ { label: "+5 points de TRS", v: 0.05 }, { label: "+10 points", v: 0.10 } ],
      marketplace:  [ { label: "+0,25 point de conversion", v: 0.0025 }, { label: "+0,5 point", v: 0.005 } ]
    },
    run: function (p, v, c) {
      var f = c.f, m = c.mod, ca0 = p.ca, rows = [], ca1 = ca0, note = "";
      if (m === "capacite") {
        var cap = p.units * p.slots * p.days;
        ca1 = cap * (p.occ + v) * p.price;
        rows.push(["Capacité annuelle", f.num(p.units) + " " + c.unit + " × " + f.num(p.slots) + " " + p.slot + (p.slots > 1 ? "s" : "") + " × " + f.num(p.days) + " jours = " + f.num(cap) + " " + p.slot + "s"]);
        rows.push(["Occupation actuelle → cible", f.pct(p.occ) + " → " + f.pct(p.occ + v)]);
        rows.push(["CA moyen par " + p.slot + " vendu", f.eur(p.price)]);
        note = "Aucun investissement : les mêmes " + c.unit + ", simplement mieux remplis.";
      } else if (m === "intellectuel") {
        ca1 = p.staff * p.daysAvail * (p.occ + v) * p.tjm;
        rows.push(["Effectif × jours disponibles", f.num(p.staff) + " × " + f.num(p.daysAvail) + " jours"]);
        rows.push(["Occupation actuelle → cible", f.pct(p.occ) + " → " + f.pct(p.occ + v)]);
        rows.push(["TJM", f.eur(p.tjm)]);
        note = "À effectif constant : chaque point d’occupation vaut " + f.eur(p.staff * p.daysAvail * 0.01 * p.tjm) + " de CA.";
      } else if (m === "commerce") {
        var cv = (v === "conv" || v === "both") ? p.conv + 0.02 : p.conv;
        var bk = (v === "basket" || v === "both") ? p.basket * 1.05 : p.basket;
        ca1 = p.traffic * cv * bk;
        rows.push(["Trafic annuel", f.num(p.traffic) + " visites"]);
        rows.push(["Conversion", f.pct(p.conv, 1) + " → " + f.pct(cv, 1)]);
        rows.push(["Panier moyen", f.eur2(p.basket) + " → " + f.eur2(bk)]);
        note = "Même trafic, même surface : seul change ce que l’on fait des clients déjà présents.";
      } else if (m === "abonnement") {
        var ch1 = p.churn * v, base0 = p.newPerMonth / p.churn, base1 = p.newPerMonth / ch1;
        ca0 = base0 * p.arpu * 12; ca1 = base1 * p.arpu * 12;
        rows.push(["Nouveaux abonnés par mois", f.num(p.newPerMonth)]);
        rows.push(["Churn mensuel", f.pct(p.churn, 1) + " → " + f.pct(ch1, 1)]);
        rows.push(["Base à l’équilibre", f.num(base0) + " → " + f.num(base1) + " abonnés"]);
        note = "À acquisition égale, la base d’abonnés se stabilise là où les départs égalent les arrivées : réduire le churn la fait grossir durablement.";
      } else if (m === "chantier" || m === "pipeline") {
        ca1 = p.quotes * (p.transfo + v) * p.avg;
        rows.push([m === "chantier" ? "Devis émis par an" : "Demandes par an", f.num(p.quotes)]);
        rows.push(["Transformation", f.pct(p.transfo) + " → " + f.pct(p.transfo + v)]);
        rows.push(["Montant moyen", f.eur(p.avg)]);
        note = m === "chantier" ? "Mêmes demandes, meilleure relance — à condition que la capacité de production suive." :
                                  "Mêmes demandes : le gain vient de la vitesse de réponse et de la relance.";
      } else if (m === "heures") {
        ca1 = p.agents * p.hoursPaid * (p.billed + v) * p.rate;
        rows.push(["Heures payées", f.num(p.agents * p.hoursPaid) + " h"]);
        rows.push(["Part facturée", f.pct(p.billed) + " → " + f.pct(p.billed + v)]);
        rows.push(["Taux horaire", f.eur2(p.rate)]);
        note = "Les heures sont déjà payées : les facturer ne coûte presque rien.";
      } else if (m === "negoce") {
        var u1 = p.units * p.stockDays / v, m0 = p.units * p.unitMargin, m1 = u1 * p.unitMargin;
        ca1 = u1 * (p.avgCost + p.unitMargin);
        rows.push(["Stock actuel → cible", f.num(p.stockDays) + " jours → " + f.num(v) + " jours"]);
        rows.push(["Unités vendues avec le même stock", f.num(p.units) + " → " + f.num(u1)]);
        rows.push(["Marge brute", f.eur(m0) + " → " + f.eur(m1)]);
        note = "Le même argent immobilisé tourne plus vite : chaque rotation supplémentaire est de la marge en plus.";
      } else if (m === "production") {
        ca1 = p.hours * (p.trs + v) * p.mph / p.mcv;
        rows.push(["Heures disponibles", f.num(p.hours) + " h"]);
        rows.push(["TRS", f.pct(p.trs) + " → " + f.pct(p.trs + v)]);
        note = "Mêmes machines, mêmes équipes : moins d’arrêts, de réglages et de rebuts.";
      } else if (m === "marketplace") {
        ca1 = p.traffic * (p.conv + v) * p.basket * p.take;
        rows.push(["Trafic", f.num(p.traffic) + " visites"]);
        rows.push(["Conversion", f.pct(p.conv, 2) + " → " + f.pct(p.conv + v, 2)]);
        rows.push(["Take rate", f.pct(p.take)]);
        note = "Même audience : le revenu suit directement la conversion.";
      }
      var r0 = ca0 * p.rm, r1 = r0 + (ca1 - ca0) * p.mcv;
      rows.push(["CA actuel", f.eur(ca0), "sub"]);
      rows.push(["CA potentiel", f.eur(ca1), "strong"]);
      rows.push(["Résultat : actuel → potentiel", f.eur(r0) + " → " + f.eur(r1), "up"]);
      return { rows: rows, note: note };
    }
  },

  /* ------------------------------------------------------------------ */
  roi: {
    title: "Trois petits leviers, un gros résultat",
    presets: [
      { label: "Prudent", v: { prix: 0.02, vol: 0.03, couts: 0.02 } },
      { label: "Réaliste", v: { prix: 0.03, vol: 0.05, couts: 0.03 } },
      { label: "Ambitieux", v: { prix: 0.05, vol: 0.08, couts: 0.05 } }
    ],
    run: function (p, v, c) {
      var f = c.f, cf = p.ca * p.mcv - p.ca * p.rm;
      var g1 = p.ca * v.prix, g2 = p.ca * v.vol * p.mcv, g3 = cf * v.couts, t = g1 + g2 + g3;
      return {
        rows: [
          ["Prix +" + f.pct(v.prix), "+" + f.eur(g1)],
          ["Volume +" + f.pct(v.vol) + " (à marge constante)", "+" + f.eur(g2)],
          ["Charges fixes −" + f.pct(v.couts), "+" + f.eur(g3)],
          ["Gain annuel", "+" + f.eur(t), "strong"],
          ["Soit par mois", "+" + f.eur(t / 12), "up"],
          ["Résultat actuel de l’exemple", f.eur(p.ca * p.rm), "sub"]
        ],
        note: "Aucun levier n’est spectaculaire seul ; ensemble, ils représentent " + f.mult(t / (p.ca * p.rm)) +
              " le résultat actuel. Délai de remboursement de l’accompagnement = son coût ÷ " + f.eur(t / 12) + " par mois."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  dso: {
    title: "Le cash libéré en réduisant le délai client",
    presets: [ { label: "−10 jours", v: 10 }, { label: "−20 jours", v: 20 }, { label: "−30 jours", v: 30 } ],
    run: function (p, v, c) {
      var f = c.f, ttc = p.ca * 1.2, d = ttc / 365;
      return {
        rows: [
          ["CA TTC annuel", f.eur(ttc)],
          ["Un jour de délai client vaut", f.eur(d)],
          ["Réduction du délai", v + " jours"],
          ["Trésorerie libérée, une fois pour toutes", f.eur(d * v), "strong"]
        ],
        note: "Aucun client en plus, aucune marge en plus : seulement le même argent, encaissé plus tôt."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  loreal: {
    title: "Méthode L’Oréal : encaisser avant de décaisser",
    run: function (p, v, c) {
      var f = c.f, ttc = p.ca * 1.2, achats = p.ca * (1 - p.mcv) * 1.2;
      var dso0 = p.dso, dso1 = Math.max(0, dso0 - 30), dpo0 = 30, dpo1 = 45;
      var b0 = ttc / 365 * dso0 - achats / 365 * dpo0, b1 = ttc / 365 * dso1 - achats / 365 * dpo1;
      return {
        rows: [
          ["Avant : clients à " + dso0 + " j, fournisseurs à " + dpo0 + " j", f.eur(b0) + " à financer"],
          ["Après : acomptes, clients à " + dso1 + " j, fournisseurs à " + dpo1 + " j", f.eur(b1) + " à financer"],
          ["Trésorerie récupérée", f.eur(b0 - b1), "strong"]
        ],
        note: "Quand les clients paient avant les fournisseurs, ce sont eux qui financent l’activité — pas la banque, ni le dirigeant."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  delegation: {
    title: "Le vrai coût des tâches de smicard",
    presets: [ { label: "5 h / semaine", v: 5 }, { label: "10 h / semaine", v: 10 }, { label: "15 h / semaine", v: 15 } ],
    run: function (p, v, c) {
      var f = c.f, h = v * 45, exec = 18, lead = 80;
      return {
        rows: [
          ["Heures libérées par an (45 semaines)", f.num(h) + " h"],
          ["Coût de la délégation (" + exec + " €/h chargé, exemple)", f.eur(h * exec)],
          ["Valeur de ces heures en développement (" + lead + " €/h, exemple)", f.eur(h * lead)],
          ["Gain net pour l’entreprise", f.eur(h * (lead - exec)), "strong"]
        ],
        note: "La bonne question n’est pas « combien coûte un salarié ? », mais « combien me coûte chaque heure passée à faire son travail ? »."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  recrutement: {
    title: "Ce qu’un recrutement doit rapporter",
    presets: [ { label: "CA généré 50 k€", v: 50000 }, { label: "70 k€", v: 70000 }, { label: "90 k€", v: 90000 } ],
    run: function (p, v, c) {
      var f = c.f, cost = 38000, seuil = cost / p.mcv, gain = v * p.mcv - cost;
      return {
        rows: [
          ["Coût complet annuel du poste (exemple)", f.eur(cost)],
          ["Taux de marge sur coûts variables", f.pct(p.mcv)],
          ["CA à générer pour couvrir le poste", f.eur(seuil), "strong"],
          ["Avec " + f.eur(v) + " de CA généré", (gain >= 0 ? "+" : "") + f.eur(gain) + " de résultat", gain >= 0 ? "up" : "sub"]
        ],
        note: "Recruter se décide sur le CA que le poste permettra de produire ou de libérer, pas sur la charge de travail."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  tunnel: {
    title: "Le tunnel en chiffres",
    presets: [ { label: "Actuel", v: 0 }, { label: "+5 points sur l’étape la plus faible", v: 0.05 } ],
    run: function (p, v, c) {
      /* Étape « client » = avant-dernière du tunnel. La première transition
         (audience → contact) est naturellement faible : on cherche l'étape
         la plus faible parmi les suivantes. */
      var f = c.f, flow = c.flow, rates = [0.05, 0.5, 0.6, 0.5, 0.4, 0.4];
      var ci = flow.length - 2, vols = [10000], weakest = 2, i;
      for (i = 2; i <= ci; i++) { if (rates[i - 1] < rates[weakest - 1]) weakest = i; }
      if (ci < 2) weakest = ci;
      for (i = 1; i < flow.length; i++) {
        vols.push(vols[i - 1] * (rates[i - 1] + (i === weakest ? v : 0)));
      }
      var rows = flow.map(function (s, i) {
        var r = i === 0 ? "" : " · " + f.pct(rates[i - 1] + (i === weakest ? v : 0)) + (i === weakest ? " ◀ étape la plus faible" : "");
        return [s, f.num(vols[i]) + r, i === weakest && v ? "up" : ""];
      });
      var clients = vols[ci];
      var base = vols[0]; for (i = 1; i <= ci; i++) base *= rates[i - 1];
      rows.push(["CA des nouveaux clients (" + f.eur(p.basket) + " chacun)", f.eur(clients * p.basket), "strong"]);
      if (v) rows.push(["Gain", "+" + f.eur((clients - base) * p.basket), "up"]);
      return {
        rows: rows,
        note: "Chaque étape multiplie les suivantes : 5 points gagnés sur l’étape la plus faible valent plus que 10 % d’audience en plus."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  ltv: {
    title: "Ce que vaut un client fidèle",
    presets: [ { label: "+1 achat par an", v: "freq" }, { label: "+1 an de fidélité", v: "years" }, { label: "Les deux", v: "both" } ],
    run: function (p, v, c) {
      var f = c.f, fr1 = p.freq + ((v === "freq" || v === "both") ? 1 : 0), y1 = p.years + ((v === "years" || v === "both") ? 1 : 0);
      var l0 = p.basket * p.freq * p.years * p.mcv, l1 = p.basket * fr1 * y1 * p.mcv;
      var n = Math.round(p.ca / (p.basket * p.freq));
      return {
        rows: [
          ["Panier moyen", f.eur(p.basket)],
          ["Achats par an", f.dec(p.freq) + " → " + f.dec(fr1)],
          ["Durée de vie", f.dec(p.years) + " ans → " + f.dec(y1) + " ans"],
          ["Marge laissée par un client sur sa vie", f.eur(l0) + " → " + f.eur(l1), "strong"],
          ["Sur " + f.num(n) + " clients actifs", "+" + f.eur((l1 - l0) * n), "up"]
        ],
        note: "Garder un client coûte presque toujours moins cher que d’en trouver un nouveau."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  valorisation: {
    title: "Ce que vaut chaque euro d’EBE",
    presets: [ { label: "+15 k€ d’EBE", v: 15000 }, { label: "+40 k€ d’EBE", v: 40000 }, { label: "Dépendance au dirigeant", v: "dep" } ],
    run: function (p, v, c) {
      var f = c.f, ebe = p.ca * (p.rm + 0.03), mult = 4, dette = p.ca * 0.05;
      var ve0 = ebe * mult, ve1, label;
      if (v === "dep") { ve1 = ve0 * 0.75; label = "Valeur avec une décote de 25 % (exemple)"; }
      else { ve1 = (ebe + v) * mult; label = "Valeur avec +" + f.eur(v) + " d’EBE"; }
      return {
        rows: [
          ["EBE retraité", f.eur(ebe)],
          ["Multiple retenu pour l’exemple", "× " + mult],
          ["Valeur d’entreprise", f.eur(ve0)],
          ["Dette nette", "−" + f.eur(dette), "sub"],
          [label, f.eur(ve1 - dette), "strong"],
          ["Écart", (ve1 >= ve0 ? "+" : "−") + f.eur(Math.abs(ve1 - ve0)), ve1 >= ve0 ? "up" : ""]
        ],
        note: "Le multiple dépend du secteur, de la taille, de la récurrence et des risques : il reste à documenter pour chaque métier. Le mécanisme, lui, est universel."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  revenu: {
    title: "Du revenu souhaité au chiffre d’affaires à trouver",
    presets: [ { label: "Gérant non salarié (≈ × 1,45)", v: 1.45 }, { label: "Dirigeant assimilé salarié (≈ × 1,85)", v: 1.85 } ],
    run: function (p, v, c) {
      var f = c.f, now = 2500, want = 4000, cost = (want - now) * 12 * v;
      return {
        rows: [
          ["Revenu net mensuel : actuel → souhaité (exemple)", f.eur(now) + " → " + f.eur(want)],
          ["Coût annuel supplémentaire pour l’entreprise", f.eur(cost)],
          ["Si le gain vient des prix", f.eur(cost) + " de CA en plus", "strong"],
          ["Si le gain vient du volume", f.eur(cost / p.mcv) + " de CA en plus", "strong"]
        ],
        note: "Coefficients approximatifs, à valider avec l’expert-comptable. L’objectif personnel devient un objectif de CA — et un choix de levier."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  tauxhoraire: {
    title: "Le vrai taux horaire du dirigeant",
    presets: [ { label: "50 h / semaine", v: 50 }, { label: "60 h / semaine", v: 60 }, { label: "70 h / semaine", v: 70 } ],
    run: function (p, v, c) {
      var f = c.f, pay = 36000, h = v * 46;
      return {
        rows: [
          ["Rémunération annuelle nette (exemple)", f.eur(pay)],
          ["Heures travaillées par an (46 semaines)", f.num(h) + " h"],
          ["Taux horaire réel", f.eur2(pay / h) + " de l’heure", "strong"]
        ],
        note: "À comparer au coût horaire des salariés de l’entreprise : le dirigeant est souvent le moins bien payé à l’heure."
      };
    }
  },

  /* ------------------------------------------------------------------ */
  multisites: {
    title: "Ce que coûtent vraiment les coûts centraux",
    presets: [ { label: "Actuel", v: 0 }, { label: "Site C à l’équilibre", v: "c" }, { label: "Coûts centraux −15 %", v: "central" } ],
    run: function (p, v, c) {
      var f = c.f, a = 90000, b = 45000, cc = -15000, central = 80000;
      if (v === "c") cc = 0;
      if (v === "central") central = central * 0.85;
      var net = a + b + cc - central;
      return {
        rows: [
          ["Contribution site A", f.eur(a)],
          ["Contribution site B", f.eur(b)],
          ["Contribution site C", (cc < 0 ? "−" : "") + f.eur(Math.abs(cc)), cc < 0 ? "sub" : ""],
          ["Coûts centraux", "−" + f.eur(central)],
          ["Résultat du réseau", f.eur(net), "strong"]
        ],
        note: "Un site qui perd de l’argent coûte deux fois : sa perte, et l’attention qu’il prend au dirigeant. Les coûts centraux doivent être portés par des sites qui contribuent."
      };
    }
  }
};
