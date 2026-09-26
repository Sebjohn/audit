/* =====================================================================
   Ultra Audits — MOTEUR D'INTERFACE
   ---------------------------------------------------------------------
   Aucun contenu métier ici : la fiche est assemblée à partir de
   data/methodologie.js, modules.js, secteurs.js, benchmarks.js,
   demos.js et annonces.js.

   Fiche d'un sous-secteur = méthodologie générale
                           + items des modules économiques
                           + items du secteur, puis du sous-secteur
                           + repères (Banque de France par NAF, sources métier)
   Rien n'est enregistré : l'état vit en mémoire le temps de la session.
   ===================================================================== */
(function () {
  "use strict";

  var UA = window.UA;
  var ORDER = ["ask", "look", "calc", "bench", "alert", "explain", "lever", "gate"];
  var TYPES = {};
  UA.types.forEach(function (t) { TYPES[t.id] = t; });
  var SUB = {};
  UA.secteurs.forEach(function (f) { f.subs.forEach(function (s) { SUB[s.id] = { s: s, f: f }; }); });

  /* sub : fiche ouverte — st : état des blocs (1 abordé, 2 à approfondir)
     open / shut : blocs rouverts / repliés — pil : piliers repliés
     demo / preset : démonstrations ouvertes et variante choisie
     multi : format multi-sites — ann : annonces cochées */
  var state = { sub: null, st: {}, open: {}, shut: {}, pil: {}, demo: {}, preset: {}, multi: {}, ann: {} };
  var resetArmed = false, resetTimer = null;

  /* ------------------------------------------------------------------ */
  /* Formatage                                                           */
  var NB = " ";
  var NF = {};
  function nf(d) { return NF[d] || (NF[d] = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d })); }
  var F = {
    num:  function (n) { return nf(0).format(Math.round(n)); },
    eur:  function (n) { return nf(0).format(Math.round(n)) + NB + "€"; },
    eur2: function (n) { return nf(Math.abs(n - Math.round(n)) < 0.005 ? 0 : 2).format(n) + NB + "€"; },
    pct:  function (x, d) { return nf(d || 0).format(x * 100) + NB + "%"; },
    dec:  function (x) { return nf(Math.abs(x % 1) > 0.05 ? 1 : 0).format(x); },
    mult: function (x) { return "×" + NB + nf(1).format(x); },
    cents: function (x) { return Math.round(x * 100) + NB + "centimes"; },
    day:  function (d) {
      var dt = new Date(2026, 0, Math.max(1, Math.min(365, d)));
      return dt.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    }
  };
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ------------------------------------------------------------------ */
  /* Contexte d'une fiche                                                */
  function ctx(id) {
    var e = SUB[id], s = e.s, f = e.f, k;
    var mods = (s.modules || f.modules || ["capacite"]).slice();
    if (state.multi[id] && mods.indexOf("multisites") < 0) mods.push("multisites");
    var main = mods[0], M = UA.modules[main], p = {};
    for (k in M.profile) p[k] = M.profile[k];
    if (f.ex && (f.modules || [])[0] === main) for (k in f.ex) p[k] = f.ex[k];
    if (s.ex) for (k in s.ex) p[k] = s.ex[k];
    if ((main === "pipeline" || main === "chantier") && !(s.ex && s.ex.basket)) p.basket = p.avg;
    p.ca = UA.demoBase[main](p);
    return {
      id: id, s: s, f: f, mods: mods, main: main, M: M, p: p,
      unit: s.unit || f.unit || M.unit,
      naf: ("naf" in s ? s.naf : f.naf) || null,
      skip: s.bdfSkip || f.bdfSkip || [],
      force: s.force || []
    };
  }

  function visible(b, cx) {
    if (!b.skip || cx.force.indexOf(b.id) >= 0) return true;
    return b.skip.indexOf(cx.main) < 0;
  }
  function blocsOf(P, cx) { return P.blocs.filter(function (b) { return visible(b, cx); }); }
  function allBlocs(cx) {
    var out = [];
    UA.piliers.forEach(function (P) { out = out.concat(blocsOf(P, cx)); });
    return out;
  }
  function stOf(id, b) { return (state.st[id] || {})[b] || 0; }

  function typeOf(it) {
    for (var i = 0; i < ORDER.length; i++) if (it[ORDER[i]] != null) return ORDER[i];
    return "look";
  }

  /* Items d'un bloc, regroupés par type.
     Ordre : questions clés de la méthode, puis ce qui est propre au métier
     (sous-secteur, secteur, modèle), puis le reste de la méthode. */
  function groupsFor(b, cx) {
    var g = {};
    ORDER.forEach(function (t) { g[t] = []; });
    function add(list, own) {
      (list || []).forEach(function (it) { g[typeOf(it)].push({ it: it, own: own }); });
    }
    var gen = b.items || [];
    add(gen.filter(function (i) { return i.key; }), false);
    add(cx.s.inject && cx.s.inject[b.id], true);
    add(cx.f.inject && cx.f.inject[b.id], true);
    cx.mods.forEach(function (m) { var inj = UA.modules[m].inject; add(inj && inj[b.id], true); });
    add(gen.filter(function (i) { return !i.key; }), false);
    g.bench = benchFor(b.id, cx).map(function (x) { return { it: x, own: true }; });
    return g;
  }

  /* ------------------------------------------------------------------ */
  /* Repères                                                             */
  function fmtQ(v, fm) {
    if (fm === "j") return F.num(v) + NB + "j";
    if (fm === "k") return F.num(v) + NB + "k€";
    return nf(Math.abs(v) < 10 ? 1 : 0).format(v) + NB + "%";
  }
  function benchFor(blocId, cx) {
    var out = [], d = cx.naf && UA.bdf[cx.naf];
    if (d) Object.keys(UA.bdfMetrics).forEach(function (k) {
      var m = UA.bdfMetrics[k];
      if (m.bloc !== blocId || !d[k] || cx.skip.indexOf(k) >= 0) return;
      out.push({
        kpi: m.kpi, val: fmtQ(d[k][1], m.fmt), unit: m.unit, key: m.key,
        range: "la moitié des entreprises entre " + fmtQ(d[k][0], m.fmt) + " et " + fmtQ(d[k][2], m.fmt),
        src: "bdf", year: 2024, conf: "élevée",
        scope: "Médiane NAF " + cx.naf + " — " + d.label + " · sociétés de " + F.dec(d.ca / 1000) + NB + "M€ de CA et " + d.eff + " salariés en médiane"
      });
    });
    UA.benchmarks.forEach(function (b) {
      if (b.bloc !== blocId || b.fallback) return;
      if ((b.sub && b.sub.indexOf(cx.id) >= 0) || (b.fam && b.fam.indexOf(cx.f.id) >= 0) ||
          (b.naf && b.naf === cx.naf) || b.all) out.push(b);
    });
    if (!out.some(function (b) { return b.val != null; })) {
      UA.benchmarks.forEach(function (b) { if (b.fallback && b.bloc === blocId) out.push(b); });
    }
    return out;
  }
  function keyBench(cx) {
    var out = [];
    allBlocs(cx).forEach(function (b) {
      benchFor(b.id, cx).forEach(function (x) { if (x.key && x.val != null) out.push({ x: x, bloc: b.id }); });
    });
    return out.slice(0, 8);
  }

  /* ------------------------------------------------------------------ */
  /* Rendu : barre haute                                                 */
  function renderTop(cx) {
    var h = '<div class="tb-in">' +
      '<button class="brand" type="button" data-act="home" aria-label="Ultra Audits — choisir un métier">' +
      '<span class="b1">Ultra</span><span class="b2">Audits</span></button>';
    if (cx) {
      var bl = allBlocs(cx), done = 0, flag = 0;
      bl.forEach(function (b) { var s = stOf(cx.id, b.id); if (s) done++; if (s === 2) flag++; });
      var pct = bl.length ? Math.round(done / bl.length * 100) : 0;
      h += '<button class="crumb" type="button" data-act="home">' +
        '<span class="cr-back">Changer de métier</span>' +
        '<span class="cr-f">' + esc(cx.f.label) + '</span>' +
        '<span class="cr-s">' + esc(cx.s.label) + '</span></button>' +
        '<div class="prog" aria-live="polite"><span class="pg-n">' + done + '<i>/' + bl.length + '</i></span>' +
        '<span class="pg-l">blocs abordés' + (flag ? ' · <b>' + flag + ' à approfondir</b>' : '') + '</span></div>' +
        '<button class="reset' + (resetArmed ? ' armed' : '') + '" type="button" data-act="reset">' +
        (resetArmed ? 'Confirmer la remise à zéro' : 'Réinitialiser la fiche') + '</button>' +
        '</div><div class="pg-bar"><span style="width:' + pct + '%"></span></div>';
    } else {
      h += '<span class="tb-note">Fiches de référence pour conduire un audit</span></div>';
    }
    return h;
  }

  /* ------------------------------------------------------------------ */
  /* Rendu : choix du métier                                             */
  function renderPicker() {
    var n = 0;
    UA.secteurs.forEach(function (f) { n += f.subs.length; });
    var h = '<section class="pick"><div class="pick-head">' +
      '<h1>Quel métier auditez-vous ?</h1>' +
      '<p>Un clic ouvre la fiche complète : questions, calculs, repères, alertes, démonstrations et leviers. ' +
      n + ' métiers, 6 piliers.</p></div><div class="fams">';
    UA.secteurs.forEach(function (f) {
      h += '<article class="fam"><h2>' + esc(f.label) + '</h2><ul>';
      f.subs.forEach(function (s) {
        var mods = s.modules || f.modules || ["capacite"];
        var st = state.st[s.id], cnt = 0;
        if (st) Object.keys(st).forEach(function (k) { if (st[k]) cnt++; });
        h += '<li><button type="button" class="sub-b" data-act="open" data-sub="' + s.id + '">' +
          '<span class="sb-t">' + esc(s.label) + '</span>' +
          (cnt ? '<span class="sb-p">' + cnt + ' abordé' + (cnt > 1 ? 's' : '') + '</span>' : '') +
          '<span class="sb-m">' + esc(UA.modules[mods[0]].short) + '</span></button></li>';
      });
      h += '</ul></article>';
    });
    h += '</div><p class="foot-note">Rien n’est enregistré : les cases se vident à la fermeture de la page. ' +
      'Les repères chiffrés sont sourcés ; faute de source fiable, ils sont indiqués « à documenter ».</p></section>';
    return h;
  }

  /* ------------------------------------------------------------------ */
  /* Rendu : en-tête de fiche                                            */
  function renderHead(cx) {
    var M = cx.M;
    var h = '<header class="sheet-head"><div class="sh-top"><div class="sh-id">' +
      '<span class="eyebrow">Fiche d’audit · ' + esc(cx.f.label) + '</span>' +
      '<h1>' + esc(cx.s.label) + '</h1>' +
      (cx.s.desc ? '<p class="sh-desc">' + esc(cx.s.desc) + '</p>' : '') + '</div>' +
      '<div class="fmt" role="group" aria-label="Format de l’entreprise">' +
      '<button type="button" data-act="multi" data-v="0" aria-pressed="' + !state.multi[cx.id] + '">Site unique</button>' +
      '<button type="button" data-act="multi" data-v="1" aria-pressed="' + !!state.multi[cx.id] + '">Multi-sites</button></div></div>';

    /* modèle économique */
    h += '<div class="model"><div class="model-l"><span class="ml-k">Modèle économique</span>' +
      '<span class="ml-v">' + esc(M.label) + '</span>' +
      '<span class="ml-u">Unité productive : <b>' + esc(cx.unit) + '</b></span></div>' +
      '<div class="formula">' + M.formula.map(function (x, i) {
        return (i ? '<span class="op" aria-hidden="true">×</span>' : '') +
          '<span class="fx"><b>' + esc(x.k) + '</b><i>' + esc(x.d) + '</i></span>';
      }).join('') + '</div>';
    if (M.capacity) h += '<p class="model-x">' + esc(M.capacity) + '</p>';
    cx.mods.slice(1).forEach(function (m) {
      var X = UA.modules[m];
      h += '<p class="model-x"><b>' + esc(X.label) + '</b> — ' +
        X.formula.map(function (x) { return esc(x.k); }).join(X.overlay && m === "multisites" ? ' ' : ' × ') + '</p>';
    });
    h += '</div>';

    /* indicateurs à suivre */
    var K = { jour: [], semaine: [], mois: [] };
    cx.mods.forEach(function (m) {
      var k = UA.modules[m].kpis || {};
      ["jour", "semaine", "mois"].forEach(function (p) { K[p] = K[p].concat(k[p] || []); });
    });
    var lab = { jour: "Chaque jour", semaine: "Chaque semaine", mois: "Chaque mois" };
    h += '<div class="kpis"><span class="sec-l">Indicateurs à suivre</span><div class="kp-g">';
    ["jour", "semaine", "mois"].forEach(function (p) {
      if (!K[p].length) return;
      h += '<div class="kp"><h3>' + lab[p] + '</h3><ul>' +
        K[p].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    });
    h += '</div></div>';

    /* repères clés */
    var kb = keyBench(cx);
    h += '<div class="keys"><span class="sec-l">📐 Repères clés du métier</span>';
    if (kb.length) {
      h += '<div class="kb-g">' + kb.map(function (e) {
        var x = e.x, src = UA.sources[x.src] || {};
        return '<button type="button" class="kb" data-act="goto" data-bloc="' + e.bloc + '">' +
          '<span class="kb-k">' + esc(x.kpi) + '</span>' +
          '<span class="kb-v">' + esc(x.val) + '</span>' +
          (x.unit ? '<span class="kb-u">' + esc(x.unit) + '</span>' : '') +
          '<span class="kb-s">' + esc(shortSrc(x.src)) + (x.year ? ' · ' + x.year : '') + '</span></button>';
      }).join('') + '</div>';
    } else {
      h += '<p class="kb-none">Aucun repère sourcé pour ce métier pour l’instant : les indicateurs à documenter figurent dans chaque bloc.</p>';
    }
    h += '</div>';

    /* légende */
    h += '<div class="legend">' + UA.types.filter(function (t) { return t.id !== "gate"; }).map(function (t) {
      return '<span class="lg g-' + t.id + '"><span aria-hidden="true">' + t.icon + '</span> ' + esc(t.label) + '</span>';
    }).join('') + '<span class="lg-own"><span class="dot own"></span> propre à ce métier <span class="dot"></span> méthode générale</span></div>';
    return h + '</header>';
  }
  function shortSrc(id) {
    return { bdf: "Banque de France", unec: "UNEC", esth: "Branche Esthétique", bpi: "Bpifrance Création",
      inextenso: "In Extenso", boulgp: "Boulangers du Grand Paris", fevad: "Fevad" }[id] || id;
  }

  /* ------------------------------------------------------------------ */
  /* Rendu : un bloc                                                     */
  function renderBloc(b, cx, idx, P) {
    var s = stOf(cx.id, b.id), k = cx.id + "|" + b.id;
    var closed = s === 1 ? !state.open[k] : !!state.shut[k];
    var g = groupsFor(b, cx);
    var h = '<article class="bloc s' + s + (closed ? ' closed' : '') + '" id="b-' + b.id + '">' +
      '<div class="bh">' +
      '<button type="button" class="chk" data-act="chk" data-bloc="' + b.id + '" role="checkbox" aria-checked="' +
      (s === 1 ? 'true' : s === 2 ? 'mixed' : 'false') + '" aria-label="' + esc(b.label) + ' abordé"></button>' +
      '<button type="button" class="bt" data-act="tog" data-bloc="' + b.id + '" aria-expanded="' + !closed + '">' +
      (P.sequence ? '<span class="step">' + (idx + 1) + '</span>' : '') +
      '<span class="bt-t">' + esc(b.label) + '</span>' +
      (b.cx ? '<span class="cxm" title="Complexité ' + b.cx + ' sur 5">' + dots(b.cx) + '<span class="cap">Capital : ' + esc(b.capital) + '</span></span>' : '') +
      '<span class="bt-n">' + summary(g) + '</span>' +
      '<span class="chev" aria-hidden="true"></span></button>' +
      '<button type="button" class="flag" data-act="flag" data-bloc="' + b.id + '" aria-pressed="' + (s === 2) + '">À approfondir</button>' +
      '</div>';
    if (!closed) {
      h += '<div class="bb">';
      if (b.flow) {
        var flow = cx.M.flow || b.flow;
        h += '<div class="flow" aria-label="Étapes du tunnel">' + flow.map(function (x, i) {
          return (i ? '<span class="fa" aria-hidden="true">→</span>' : '') + '<span class="fs">' + esc(x) + '</span>';
        }).join('') + '</div>';
      }
      ORDER.forEach(function (t) {
        if (!g[t].length) return;
        h += '<div class="grp g-' + t + '"><div class="gl"><span class="gi" aria-hidden="true">' + TYPES[t].icon + '</span>' +
          esc(TYPES[t].label) + '</div><ul class="gv gv-' + t + '">' +
          g[t].map(function (e, i) { return renderItem(t, e, b, cx, i); }).join('') + '</ul></div>';
      });
      h += '</div>';
    }
    return h + '</article>';
  }
  function dots(n) {
    var o = '<span class="dots" aria-hidden="true">';
    for (var i = 1; i <= 5; i++) o += '<i' + (i <= n ? ' class="on"' : '') + '></i>';
    return o + '</span>';
  }
  function summary(g) {
    var n = 0;
    ["ask", "look", "calc", "alert", "lever"].forEach(function (t) { n += g[t].length; });
    return n + ' points';
  }

  function renderItem(t, e, b, cx, i) {
    var it = e.it, cls = e.own ? ' class="own"' : '';
    if (t === "bench") return renderBench(it);
    if (t === "calc") {
      return '<li' + cls + '><span class="c-n">' + esc(it.calc) + '</span>' +
        (it.f ? '<code class="c-f">' + esc(it.f) + '</code>' : '') + '</li>';
    }
    if (t === "explain") {
      var dk = cx.id + "|" + b.id + "|" + i, open = !!state.demo[dk], D = it.demo && UA.demos[it.demo];
      return '<li' + cls + '><div class="ex-row"><span>' + esc(it.explain) + '</span>' +
        (D ? '<button type="button" class="demo-b" data-act="demo" data-k="' + dk + '" aria-expanded="' + open + '">' +
          (open ? 'Masquer la démonstration' : 'Voir la démonstration') + '</button>' : '') +
        '</div>' + (D && open ? renderDemo(it.demo, dk, cx) : '') + '</li>';
    }
    var txt = it[t];
    return '<li' + (it.key ? ' class="key' + (e.own ? ' own' : '') + '"' : cls) + '>' + esc(txt) +
      (it.key ? '<span class="kq">question clé</span>' : '') + '</li>';
  }

  function renderBench(x) {
    var src = UA.sources[x.src];
    if (x.val == null) {
      return '<li class="bm todo"><span class="bm-k">' + esc(x.kpi) + '</span><span class="bm-todo">Benchmark à documenter</span></li>';
    }
    var conf = { "élevée": 3, "moyenne": 2, "faible": 1 }[x.conf] || 1;
    return '<li class="bm"><div class="bm-r"><span class="bm-k">' + esc(x.kpi) + '</span>' +
      '<span class="bm-v">' + esc(x.val) + '</span>' +
      (x.unit ? '<span class="bm-u">' + esc(x.unit) + '</span>' : '') + '</div>' +
      (x.range ? '<div class="bm-rg">' + esc(x.range) + '</div>' : '') +
      (x.note ? '<div class="bm-no">' + esc(x.note) + '</div>' : '') +
      '<div class="bm-m"><span class="conf c' + conf + '" title="Niveau de confiance : ' + esc(x.conf || '') + '">' +
      '<i></i><i></i><i></i> ' + esc(x.conf || '') + '</span>' +
      (src ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.label) + '</a>' : '') +
      (x.year ? ' · données ' + x.year : '') + ' · France' +
      (x.scope ? '<span class="bm-sc">' + esc(x.scope) + '</span>' : '') + '</div></li>';
  }

  /* ------------------------------------------------------------------ */
  /* Rendu : démonstration                                               */
  function renderDemo(id, dk, cx) {
    var D = UA.demos[id];
    var presets = (D.presetsBy && D.presetsBy[cx.main]) || D.presets || null;
    var pi = state.preset[dk] || 0;
    if (presets && pi >= presets.length) pi = 0;
    var v = presets ? presets[pi].v : null;
    var r;
    try {
      r = D.run(cx.p, v, { mod: cx.main, flow: cx.M.flow || flowDefault(), unit: cx.unit, f: F });
    } catch (err) {
      return '<div class="demo"><p class="dm-note">Démonstration indisponible pour ce modèle.</p></div>';
    }
    var h = '<div class="demo"><div class="dm-h"><span class="dm-t">' + esc(D.title) + '</span>' +
      '<span class="dm-x">Exemple chiffré illustratif — ' + esc(cx.M.label.toLowerCase()) + '</span></div>';
    if (presets) {
      h += '<div class="dm-p" role="group" aria-label="Variantes">' + presets.map(function (x, i) {
        return '<button type="button" data-act="preset" data-k="' + dk + '" data-i="' + i + '" aria-pressed="' + (i === pi) + '">' + esc(x.label) + '</button>';
      }).join('') + '</div>';
    }
    h += '<table class="dm-tb"><tbody>' + r.rows.map(function (row) {
      return '<tr class="' + (row[2] || '') + '"><th scope="row">' + esc(row[0]) + '</th><td>' + esc(row[1]) + '</td></tr>';
    }).join('') + '</tbody></table>';
    if (r.note) h += '<p class="dm-note">' + esc(r.note) + '</p>';
    return h + '</div>';
  }
  function flowDefault() {
    var b = null;
    UA.piliers.forEach(function (P) { P.blocs.forEach(function (x) { if (x.flow) b = x; }); });
    return b ? b.flow : ["Audience", "Lead", "Client", "Client récurrent"];
  }

  /* ------------------------------------------------------------------ */
  /* Rendu : parcours (colonne de gauche) et piliers                     */
  function renderRail(cx) {
    var h = '<div class="rail-in"><span class="sec-l">Parcours de l’audit</span>';
    UA.piliers.forEach(function (P) {
      var bl = blocsOf(P, cx), d = 0;
      bl.forEach(function (b) { if (stOf(cx.id, b.id)) d++; });
      h += '<div class="rp"><button type="button" class="rp-t" data-act="goto" data-pil="' + P.id + '">' +
        '<span aria-hidden="true">' + P.icon + '</span><span class="rp-l">' + esc(P.short) + '</span>' +
        '<span class="rp-n' + (d === bl.length ? ' full' : '') + '">' + d + '/' + bl.length + '</span></button><ul>';
      bl.forEach(function (b) {
        var s = stOf(cx.id, b.id);
        h += '<li><button type="button" class="rb s' + s + '" data-act="goto" data-bloc="' + b.id + '">' +
          '<span class="rg" aria-hidden="true"></span>' + esc(b.label) + '</button></li>';
      });
      h += '</ul></div>';
    });
    return h + '<div class="rail-f"><button type="button" data-act="pilall" data-v="0">Tout déplier</button>' +
      '<button type="button" data-act="pilall" data-v="1">Tout replier</button></div></div>';
  }

  function renderPillars(cx) {
    var h = '<nav class="jumpbar" aria-label="Piliers">' + UA.piliers.map(function (P) {
      var bl = blocsOf(P, cx), d = 0;
      bl.forEach(function (b) { if (stOf(cx.id, b.id)) d++; });
      return '<button type="button" data-act="goto" data-pil="' + P.id + '"><span aria-hidden="true">' + P.icon + '</span> ' +
        esc(P.short) + ' <i>' + d + '/' + bl.length + '</i></button>';
    }).join('') + '</nav>';
    UA.piliers.forEach(function (P) {
      var bl = blocsOf(P, cx), d = 0, closed = !!state.pil[P.id];
      bl.forEach(function (b) { if (stOf(cx.id, b.id)) d++; });
      h += '<section class="pil' + (closed ? ' closed' : '') + '" id="pil-' + P.id + '">' +
        '<button type="button" class="pil-h" data-act="pil" data-pil="' + P.id + '" aria-expanded="' + !closed + '">' +
        '<span class="pil-ic" aria-hidden="true">' + P.icon + '</span><span class="pil-num">' + P.num + '</span>' +
        '<span class="pil-t">' + esc(P.label) + '</span>' +
        '<span class="pil-pr">' + bl.map(function (b) {
          return '<i class="s' + stOf(cx.id, b.id) + '" title="' + esc(b.label) + '"></i>';
        }).join('') + '<b>' + d + '/' + bl.length + '</b></span>' +
        '<span class="chev" aria-hidden="true"></span></button>';
      if (!closed) {
        h += '<div class="pil-b">' + (P.intro ? '<p class="pil-intro">' + esc(P.intro) + '</p>' : '') +
          bl.map(function (b, i) { return renderBloc(b, cx, i, P); }).join('') + '</div>';
      }
      h += '</section>';
    });
    return h;
  }

  function renderAnn() {
    var n = 0;
    UA.annonces.forEach(function (_, i) { if (state.ann[i]) n++; });
    return '<div class="ann-in"><div class="ann-h"><span class="eyebrow">À annoncer en fin de rendez-vous</span>' +
      '<h2>Les ' + UA.annonces.length + ' annonces</h2><span class="ann-n' + (n === UA.annonces.length ? ' full' : '') + '">' +
      n + '/' + UA.annonces.length + '</span></div><ol>' +
      UA.annonces.map(function (t, i) {
        return '<li><button type="button" class="an' + (state.ann[i] ? ' on' : '') + '" data-act="ann" data-i="' + i + '" role="checkbox" aria-checked="' + !!state.ann[i] + '">' +
          '<span class="an-b" aria-hidden="true"></span><span class="an-n">' + (i + 1) + '.</span><span class="an-t">' + esc(t) + '</span></button></li>';
      }).join('') + '</ol><p class="ann-f">Dans cet ordre, avant de clore le rendez-vous.</p></div>';
  }

  /* ------------------------------------------------------------------ */
  /* Rendu global, avec maintien de la position à l'écran                */
  var $top = document.getElementById("top"), $app = document.getElementById("app");

  function render(anchorSel) {
    var anchor = anchorSel && document.querySelector(anchorSel), before = anchor ? anchor.getBoundingClientRect().top : null;
    var focusSel = focusKey();
    var cx = state.sub ? ctx(state.sub) : null;
    $top.innerHTML = renderTop(cx);
    if (!cx) {
      $app.className = "view-pick";
      $app.innerHTML = renderPicker();
    } else {
      $app.className = "view-fiche";
      $app.innerHTML = '<div class="fiche"><nav class="rail" aria-label="Parcours de l’audit">' + renderRail(cx) + '</nav>' +
        '<main class="sheet">' + renderHead(cx) + renderPillars(cx) + '</main>' +
        '<aside class="ann" aria-label="Annonces">' + renderAnn() + '</aside></div>';
    }
    if (anchorSel && before != null) {
      var a2 = document.querySelector(anchorSel);
      if (a2) window.scrollBy(0, a2.getBoundingClientRect().top - before);
    }
    if (focusSel) { var el = document.querySelector(focusSel); if (el) el.focus({ preventScroll: true }); }
  }
  function focusKey() {
    var a = document.activeElement;
    if (!a || !a.getAttribute || !a.getAttribute("data-act")) return null;
    var sel = '[data-act="' + a.getAttribute("data-act") + '"]';
    ["data-bloc", "data-pil", "data-k", "data-i", "data-v", "data-sub"].forEach(function (k) {
      if (a.hasAttribute(k)) sel += '[' + k + '="' + a.getAttribute(k) + '"]';
    });
    return sel;
  }

  function scrollToEl(el) {
    if (!el) return;
    var y = el.getBoundingClientRect().top + window.pageYOffset - 78;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }

  /* ------------------------------------------------------------------ */
  /* Interactions : un seul écouteur, par délégation                     */
  function setSt(bloc, v) {
    var m = state.st[state.sub] || (state.st[state.sub] = {});
    if (v) m[bloc] = v; else delete m[bloc];
    delete state.open[state.sub + "|" + bloc];
  }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-act]");
    if (!t) return;
    var act = t.getAttribute("data-act"), bloc = t.getAttribute("data-bloc"), k;

    if (act !== "reset" && resetArmed) { resetArmed = false; clearTimeout(resetTimer); }

    switch (act) {
      case "home":
        state.sub = null; render(); window.scrollTo(0, 0); break;
      case "open":
        state.sub = t.getAttribute("data-sub"); render(); window.scrollTo(0, 0); break;
      case "chk":
        setSt(bloc, stOf(state.sub, bloc) === 1 ? 0 : 1);
        render("#b-" + cssId(bloc)); break;
      case "flag":
        setSt(bloc, stOf(state.sub, bloc) === 2 ? 0 : 2);
        render("#b-" + cssId(bloc)); break;
      case "tog":
        k = state.sub + "|" + bloc;
        if (stOf(state.sub, bloc) === 1) state.open[k] = !state.open[k];
        else state.shut[k] = !state.shut[k];
        render("#b-" + cssId(bloc)); break;
      case "pil":
        k = t.getAttribute("data-pil");
        state.pil[k] = !state.pil[k];
        render("#pil-" + k); break;
      case "pilall":
        UA.piliers.forEach(function (P) { state.pil[P.id] = t.getAttribute("data-v") === "1"; });
        render(); break;
      case "goto":
        if (bloc) {
          var P = UA.piliers.filter(function (x) { return bloc.indexOf(x.id + ".") === 0; })[0];
          if (P) state.pil[P.id] = false;
          k = state.sub + "|" + bloc;
          if (stOf(state.sub, bloc) === 1) state.open[k] = true; else state.shut[k] = false;
          render();
          scrollToEl(document.getElementById("b-" + bloc));
        } else {
          k = t.getAttribute("data-pil");
          state.pil[k] = false; render();
          scrollToEl(document.getElementById("pil-" + k));
        }
        break;
      case "demo":
        k = t.getAttribute("data-k"); state.demo[k] = !state.demo[k];
        render('[data-act="demo"][data-k="' + k + '"]'); break;
      case "preset":
        k = t.getAttribute("data-k"); state.preset[k] = +t.getAttribute("data-i");
        render('[data-act="demo"][data-k="' + k + '"]'); break;
      case "multi":
        state.multi[state.sub] = t.getAttribute("data-v") === "1"; render(".sheet-head"); break;
      case "ann":
        k = +t.getAttribute("data-i"); state.ann[k] = !state.ann[k]; render(); break;
      case "reset":
        if (!resetArmed) {
          resetArmed = true; render();
          resetTimer = setTimeout(function () { resetArmed = false; render(); }, 3500);
        } else {
          resetArmed = false; clearTimeout(resetTimer);
          delete state.st[state.sub];
          Object.keys(state.open).concat(Object.keys(state.shut), Object.keys(state.demo), Object.keys(state.preset)).forEach(function (x) {
            if (x.indexOf(state.sub + "|") === 0) { delete state.open[x]; delete state.shut[x]; delete state.demo[x]; delete state.preset[x]; }
          });
          state.ann = {}; state.pil = {};
          render(); window.scrollTo(0, 0);
        }
        break;
    }
  });
  function cssId(id) { return id.replace(/\./g, "\\."); }

  /* ------------------------------------------------------------------ */
  /* Démarrage — l'état survit à une republication de la page            */
  function start(saved) {
    if (saved && saved.st) {
      ["sub", "st", "open", "shut", "pil", "demo", "preset", "multi", "ann"].forEach(function (k) {
        if (saved[k] != null) state[k] = saved[k];
      });
      if (state.sub && !SUB[state.sub]) state.sub = null;
    }
    render();
  }
  var hot = window.claude && window.claude.hot;
  if (hot && hot.ready) hot.ready(start); else start((hot && hot.data) || {});
  if (hot && hot.snapshot) hot.snapshot(function () { return state; });
})();
