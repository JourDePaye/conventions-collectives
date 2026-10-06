# Transports routiers et activités auxiliaires du transport — IDCC 16

Le fichier [2026.1](0016-transports-routiers.2026.1.publicodes) entre en vigueur le 1er juin 2026, date à laquelle les grilles des quatre sous-secteurs ci-dessous sont en vigueur. Ses sources sont citées dans ses métadonnées. La valeur Publicodes est `transports routiers` ; les règles sont sous `salarié . convention collective . transports routiers`.

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

## Limites

- Aucun texte officiel n’a été lu directement : les montants viennent de pages de synthèse et de PDF d’avenants hébergés par des sites d’information, recoupés en partie seulement. À recouper avec les textes sur Légifrance avant toute publication.
- **Voyageurs.** L’arrêté d’extension des avenants du 27 novembre 2025 n’a pas été trouvé et semblait en attente en octobre 2026 : le minimum s’impose aux seuls employeurs adhérents aux organisations signataires. Le groupe 7 (cadres supérieurs) n’a pas de montants dans la source.
- **Marchandises.** C’est l’accord du 11 octobre 2023, les négociations de 2025 et de février 2026 ayant échoué : une revalorisation postérieure est possible. Le minimum mensuel publié pour les ouvriers à 151,67 heures (1 888,70 € pour 110M à 120M) est supérieur de 3 % au taux horaire multiplié par 151,67 heures (1 833,70 €), pour une raison non confirmée : la règle retient le taux horaire, plus bas. Les garanties annuelles (ouvriers, cadres) et les grilles de 169 et 200 heures ne sont pas modélisées.
- **Cadres.** Les minima mensuels imprimés valent la garantie annuelle divisée par 13,33, et non par 12 : la règle retient ces minima mensuels, sans vérifier la garantie annuelle. Pour le déménagement, la garantie annuelle est établie sur 169 heures.
- **Majorations non modélisées.** Les majorations de 10 % de la région parisienne (cadres de voyageurs), de 3 % pour les ouvriers mécaniciens ou caissiers de voyageurs, les primes de dimanche et de jour férié et les indemnités spécifiques ne sont pas modélisées.
- **Divergences tranchées sur une source.** Ouvriers 138M (garantie annuelle, non retenue ici), technicien 150 à 6 ans (13,36 €/h retenu contre 13,350) et employé 125 à 15 ans (13,9150 €/h retenu, 13,3150 étant une coquille) en marchandises ; cadres 113L en logistique (valeurs de juristique.org retenues, divergentes de celles de fiche-paie.net).
- Les grilles antérieures au 1er juin 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
