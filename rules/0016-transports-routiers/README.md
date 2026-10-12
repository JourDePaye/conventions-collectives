# Transports routiers et activités auxiliaires du transport — IDCC 16

Le fichier [2026.1](0016-transports-routiers.2026.1.publicodes) entre en vigueur le 1er juin 2026, date à laquelle les grilles des quatre sous-secteurs ci-dessous sont en vigueur. Le fichier [2026.2](0016-transports-routiers.2026.2.publicodes) conserve exactement ces minima et documente l'audit paie du 12 octobre 2026. La valeur Publicodes est `transports routiers` ; les règles sont sous `salarié . convention collective . transports routiers`.

La convention collective nationale des transports routiers et activités auxiliaires du transport du 21 décembre 1950 (brochure 3085) a une grille distincte par sous-secteur :

| Code | Sous-secteur | Texte | Application |
|---|---|---|---|
| `M` | Transport routier de marchandises et activités auxiliaires | Accord du 11 octobre 2023, étendu par arrêté du 19 décembre 2023 (JORF n° 0296 du 22 décembre 2023, texte n° 60, NOR MTRT2333106A) | 1er décembre 2023 |
| `V` | Transport routier de voyageurs | Avenants du 27 novembre 2025 n° 120, 102, 100 et 93 | 1er janvier 2026 |
| `L` | Prestations logistiques | Avenant n° 17 du 12 mars 2026, étendu par arrêté du 9 juillet 2026 (JORF n° 0163 du 14 juillet 2026) | 1er avril 2026 |
| `D` | Transports de déménagement | Avenant n° 24 du 21 janvier 2026, étendu par arrêté du 6 mai 2026 (JORF n° 0114 du 16 mai 2026, texte n° 71, NOR TRST2610632A) | 1er juin 2026 |

## Règles implémentées

- `niveau` reçoit un code `SOUS-SECTEUR-CATÉGORIE-COEFFICIENT` : le sous-secteur (`M`, `V`, `L` ou `D`), la catégorie (`O` ouvriers, `E` employés, `T` techniciens et agents de maîtrise, `C` ingénieurs et cadres) et le coefficient sans sa lettre finale. Exemples : `M-O-128`, `V-E-105`, `L-T-157.5`, `V-C-106.5`, `D-O-1A`, `D-O-1A-DC1`. Le code est nécessaire, car un même coefficient (110 par exemple) existe dans plusieurs catégories et sous-secteurs avec des montants différents. La grille compte 108 classifications (29 marchandises, 36 voyageurs, 16 logistique, 27 déménagement).
- `salaire minimum conventionnel . grille` donne le minimum mensuel à temps plein selon l’ancienneté : chaque palier s’applique à partir du nombre d’années indiqué dans la grille (par exemple 5 ans, 10 ans ou 20 ans), avec `salarié . ancienneté` de `modele-social`, calculée depuis la date d’embauche. Les taux horaires (ouvriers, employés et techniciens et agents de maîtrise de marchandises, de logistique et de déménagement) sont multipliés par 151,67 heures et arrondis au centime ; les minima mensuels (voyageurs et cadres) sont repris tels quels.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois.
- `niveau hors grille` signale une classification absente des grilles. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les échelons de début de carrière de plusieurs grilles sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Audit paie — 12 octobre 2026

Audit ciblé des différences officielles au-delà des minima, sur la convention IDCC 16 et ses textes sectoriels accessibles dans Légifrance/DILA. **Aucune règle supplémentaire n'est ajoutée sous le namespace** dans 2026.2 :

- **Assiette, taux salariés/employeurs, plafonds/tranches et forfaits :** aucun texte étendu général applicable aux quatre sous-secteurs ne fixe une règle de paie calculable avec les entrées de ce package.
- **Exemptions, avantages en nature, frais, formation professionnelle et AT/MP :** aucune dérogation ou taux conventionnel transversal identifié ; les règles de droit commun de `modele-social` restent applicables.
- **Santé :** les avenants du 13 avril 2026 identifiés pour les marchandises, le transport sanitaire et le déménagement sont non étendus au 12 octobre 2026 et portent principalement sur les garanties/prestations. Ils ne permettent pas de remplacer le montant standard de santé sans contrat, option et population couverte.
- **Prévoyance :** les textes disponibles sont sectoriels ou limités à des catégories/activités déterminées ; l'IDCC, le sous-secteur et la classification seuls ne suffisent pas à choisir l'organisme, le contrat, les options ou l'assiette. Aucun taux n'est donc appliqué par défaut.

Cette omission est volontaire : appliquer un taux santé/prévoyance ou une assiette sans ces paramètres sur-appliquerait un accord sectoriel à des salariés non couverts. Le test dédié vérifie que les endpoints standards `modele-social` (AT/MP, formation, santé, prévoyance, coût employeur) restent inchangés et que l'extension reste isolée hors IDCC 16.

Sources officielles examinées : [convention IDCC 16](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635624), [avenant salaires voyageurs n° 120](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000047394518), [avenant santé marchandises du 13 avril 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054880573), [avenant santé transport sanitaire du 13 avril 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053385431), [avenant santé déménagement du 13 avril 2026](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000050299015), et [accord prévoyance transport sanitaire](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000046043318).


- Les montants de la grille 2026.1 sont conservés sans modification par l'audit ; la version 2026.2 ne change que la traçabilité des sources et l'audit d'omission.
- Les textes antérieurs au 1er juin 2026 et les dispositions qui nécessitent une population, un contrat assureur ou une assiette annuelle dédiée ne sont pas transformés en calculs automatiques.
- **Marchandises.** C’est l’accord du 11 octobre 2023, les négociations de 2025 et de février 2026 ayant échoué : une revalorisation postérieure est possible. Le minimum mensuel publié pour les ouvriers à 151,67 heures (1 888,70 € pour 110M à 120M) est supérieur de 3 % au taux horaire multiplié par 151,67 heures (1 833,70 €), pour une raison non confirmée : la règle retient le taux horaire, plus bas. Les garanties annuelles (ouvriers, cadres) et les grilles de 169 et 200 heures ne sont pas modélisées.
- **Cadres.** Les minima mensuels imprimés valent la garantie annuelle divisée par 13,33, et non par 12 : la règle retient ces minima mensuels, sans vérifier la garantie annuelle. Pour le déménagement, la garantie annuelle est établie sur 169 heures.
- **Majorations non modélisées.** Les majorations de 10 % de la région parisienne (cadres de voyageurs), de 3 % pour les ouvriers mécaniciens ou caissiers de voyageurs, les primes de dimanche et de jour férié et les indemnités spécifiques ne sont pas modélisées.
- **Divergences tranchées sur une source.** Ouvriers 138M (garantie annuelle, non retenue ici), technicien 150 à 6 ans (13,36 €/h retenu contre 13,350) et employé 125 à 15 ans (13,9150 €/h retenu, 13,3150 étant une coquille) en marchandises ; cadres 113L en logistique (valeurs de juristique.org retenues, divergentes de celles de fiche-paie.net).
- Les grilles antérieures au 1er juin 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
