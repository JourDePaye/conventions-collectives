# Cabinets d'experts-comptables et de commissaires aux comptes (IDCC 787)

| Version | Date d'effet | Texte |
|---|---|---|
| `2024.1` | 1er janvier 2024 | Accord n° 47 du 5 octobre 2023 ([KALITEXT000048638263](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000048638263)), étendu par arrêté du 11 décembre 2023 (JORF du 14 décembre 2023) |
| `2026.2` | 1er mars 2026 | Accord n° 48 du 5 décembre 2025 ([KALITEXT000053576549](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053576549)), étendu par arrêté du 5 février 2026 (JORF du 10 février 2026), applicable le premier jour du mois civil suivant |

## Classification et salaires minima

Le modèle demande le **coefficient ou indice réellement attribué** par l'employeur. Il n'infère jamais la classification depuis un intitulé de poste.

- **Grille générale des emplois** (annexe A, avenant du 1er juillet 2016) : poste de référence de 170 (emplois généraux sans qualification) à 600 (cadre de direction), augmenté des points de la grille d'adaptation (mobilité, langues, encadrement, techniques connexes). Le minimum annuel brut à temps plein valorise les 164 premiers points à la valeur de base et les points au-delà à la valeur hiérarchique :

  | Version | Valeur de base | Valeur hiérarchique | Indice 40 |
  |---|---|---|---|
  | `2024.1` | 127,83 € | 77,60 € | 46 454 € par an |
  | `2026.2` | 131,54 € | 79,85 € | 47 801 € par an |

- **Indice 40** (annexe B) : indice unique des salariés inscrits à l'Ordre des experts-comptables ou à la Compagnie des commissaires aux comptes, attribué dès l'inscription, avec son propre minimum annuel. Le coefficient 40 suffit.
- `coefficient hors grille` : un coefficient inférieur à 170 autre que 40, ou non renseigné. Le minimum n'est alors pas calculé.

Le modèle expose aussi un équivalent mensuel (`salaire minimum conventionnel`), le douzième du minimum annuel proratisé par la quotité de travail. Le contrôle conventionnel reste annuel : un mois sous cet équivalent peut être couvert par des éléments de rémunération annuels.

## Heures supplémentaires

`majoration heures supplémentaires` remplace la majoration de droit commun de modele-social (article 8.2.3.2 de la convention, [KALIARTI000029786885](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000029786885)) : 10 % de la 36e à la 39e heure, puis la majoration légale (article L. 3121-36 du code du travail), 25 % jusqu'à la 43e heure et 50 % au-delà. Comme dans modele-social, les heures supplémentaires du mois sont réparties uniformément sur ses semaines. La convention prévoit que ces heures donnent lieu par défaut à un repos compensateur de remplacement, sauf accord pour les payer : le modèle calcule la majoration des heures payées.

## Limites explicites

- La classification et l'inscription à l'Ordre ou à la Compagnie doivent être validées en amont.
- Les primes, treizième mois, avantages en nature, forfaits, temps de travail particuliers, apprentis et contrats de professionnalisation ne sont pas automatiquement inclus ou exclus : appliquer les textes correspondants et les règles légales de comparaison.
- Le régime de prévoyance de l'article 7.4 ne fixe pas de taux (il renvoie au contrat de l'organisme assureur, cotisation partagée par moitié) : il n'est pas modélisé. Pas davantage la santé, la formation ou les autres cotisations propres à la branche.

## Relation avec l'IDCC 3160

Le champ d'application de la convention est fusionné avec celui des associations de gestion et de comptabilité (IDCC 3160) par arrêté du 27 juillet 2018. L'IDCC 3160 n'est pas traité comme une version, une extension ou un alias de l'IDCC 787 dans ce modèle ; le choix de la convention collective doit donc être confirmé séparément.

## Références officielles

- Convention collective nationale du 9 décembre 1974 : [KALICONT000005635826](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635826).
- Annexe A, grille générale des emplois : [KALIARTI000033925618](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000033925618) ; annexe B, membres de l'Ordre et de la Compagnie : [KALIARTI000005839623](https://www.legifrance.gouv.fr/conv_coll/id/KALIARTI000005839623).
- Accords salariaux n° 47 et n° 48 : voir le tableau des versions.

## Maintien de salaire

La révision 2026.3 ajoute le maintien de salaire conventionnel (article 7.3) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance-2.test.ts`. L’interface est décrite dans le README du package. Les 30 jours par arrêt et par année civile, carence comprise, sont pris comme 27 jours indemnisés par année civile.

La révision 2026.4 ajoute l'indemnité de fin de carrière du départ volontaire (article 6.2.4.1), sous `indemnité de rupture`, lus sur Légifrance le 28 octobre 2026 : les barèmes, seuils d'ancienneté et plafonds sont dans les sources de la version et dans `test/termination-indemnity.test.ts`, en mois de salaire de référence. L'indemnité de licenciement et la mise à la retraite renvoient à la loi ; la majoration de 1/10 de mois est lue par année complète au-delà de la cinquième.
