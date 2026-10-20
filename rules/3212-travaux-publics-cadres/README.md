# Travaux publics — cadres (IDCC 3212)

## Version en vigueur : `2026.5`, commune aux trois conventions des travaux publics

Les versions `2026.4` et `2026.5` (qui ajoute les indemnités de petits déplacements) sont publiées à l'identique pour les IDCC 1702, 2614 et 3212, depuis le fichier
commun [`rules/commun/travaux-publics/travaux-publics.2026.4.publicodes`](../commun/travaux-publics/travaux-publics.2026.4.publicodes)
(voir son [README](../commun/travaux-publics/README.md)). Elle complète et corrige les règles du
BTP de modele-social pour les travaux publics : cotisation congés payés de la CNETP, cotisation
chômage intempéries, prévoyance des cadres (RNPC) comptée une seule fois, et salaires minima
hiérarchiques régionaux de 2026 des ouvriers et des ETAM (forfait jours compris).

**Les versions antérieures ci-dessous ne sont plus utilisées** : elles calculaient leurs
cotisations dans un espace de noms à part, sans remplacer celles de modele-social. Elles restent
publiées pour l'historique ; un consommateur qui choisit la version par date doit partir de
`2026.4`.

## Versions antérieures, plus utilisées

Modèle `3212-travaux-publics-cadres`, version `2024.1`, espace de noms
`salarié . convention collective . travaux publics cadres`.

## Statut officiel vérifié au 12 octobre 2026

La source officielle de salaires actuellement publiée pour l'IDCC 3212 est
l'accord du **14 novembre 2023 relatif aux salaires minima hiérarchiques des
cadres pour 2024**, étendu par arrêté du 21 février 2024 (JORF du 16 mars
2024). Il fixe l'effet au **1er janvier 2024**. La page officielle consultée
le 12 octobre 2026 liste cet accord comme dernier texte salarial ; le texte
attaché du 28 octobre 2025 concernant l'activité partielle de longue durée
rebond n'est pas un accord de salaires et ne fournit pas de nouvelle grille.
Cette version reste donc explicitement `2024.1`, sans relabelliser les montants
comme 2025 ou 2026.

## Grilles annuelles brutes 2024

Les valeurs sont des **minima annuels** et restent en `€/an`. Aucune division
par douze ni sortie mensuelle n'est introduite.

| Position | Grille annuelle | Forfait jours |
|---|---:|---:|
| A1 | 33 257 € | 38 245 € |
| A2 | 36 066 € | 41 476 € |
| B | 37 627 € | 43 271 € |
| B1 | 40 566 € | 46 651 € |
| B2 | 43 269 € | 49 759 € |
| B3 | 44 368 € | 51 023 € |
| B4 | 47 430 € | 54 544 € |
| C1 | 49 414 € | 56 826 € |
| C2 | 57 592 € | 66 230 € |

## Correction BTP applicable

Le modèle ajoute uniquement, dans son propre espace de noms, la correction du
**régime national de prévoyance des cadres (RNPC)** : tranche A employeur à
1,50 %, et tranche B partagée à 50 % de 2,40 % jusqu'à quatre plafonds de
sécurité sociale. La tranche C optionnelle à 3,60 % n'est pas calculée. La
correction remplace les endpoints de prévoyance cadre de droit commun lorsque
le statut cadre est explicitement `oui`.

Les cotisations CIBTP, le chômage intempéries et l'OPPBTP ne sont **pas**
calculés dans cette version : leurs assiettes, affiliations, abattement annuel
et taux dépendent de données BTP/entreprise qui ne sont pas fixées par l'accord
salarial 2024 des cadres. Aucun taux 2026 n'est rétro-importé dans une version
2024 et aucune applicabilité automatique n'est inventée.

## Limites

La version couvre la grille salariale et le forfait jours du 1er janvier au
31 décembre 2024. Les accords de salaires ultérieurs, s'ils sont publiés,
devront donner lieu à une nouvelle version immuable. L'application de paie
doit traiter séparément la comparaison annuelle, le SMIC périodique, les
proratisations validées et les contrats particuliers.

## Sources

- [Accord 2024 — texte officiel](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000049150748)
- [Article 1 — grille annuelle](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000049150752)
- [Article 2 — forfait jours](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000049150753)
- [Page officielle IDCC 3212 et textes attachés](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000032437525?facetteEtat=VIGUEUR_ETEN)
- [PRO BTP — notice entreprise assiette et taux](https://www.probtp.com/files/live/sites/probtp/files/media/pdf/PRO/declarations/notice-entreprise-assiette-taux.pdf)
