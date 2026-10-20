# Travaux publics — ETAM (IDCC 2614)

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

Modèle `2614-travaux-publics-etam`, version `2026.2`, espace de noms
`salarié . convention collective . travaux publics ETAM`.

## Périmètre juridiquement borné

Cette version couvre uniquement les ETAM des travaux publics en **Île-de-France**,
du **17 avril au 31 décembre 2026**, à partir de l'accord régional publié sous
la référence KALITEXT000054162121 et de son entrée en vigueur vérifiée. Elle ne
fabrique pas de grille nationale, ne couvre pas les autres régions et ne calcule
pas de minimum pour les cadres.

## Grille annuelle Île-de-France — 2026

| Niveau | Minimum annuel brut |
|---:|---:|
| A | 23 545 € |
| B | 25 372 € |
| C | 27 185 € |
| D | 29 847 € |
| E | 33 260 € |
| F | 37 255 € |
| G | 39 628 € |
| H | 40 624 € |

Les niveaux F, G et H peuvent relever d'un forfait annuel en jours. Dans ce cas,
le modèle utilise la grille spécifique forfait-jours : **F 42 843 €, G 45 572 €,
H 46 718 €**. Ces montants correspondent à la majoration conventionnelle de 15 %,
arrondie à l'euro publié.

## Corrections BTP applicables et isolées

Les règles restent exclusivement dans l'espace de noms IDCC 2614 et ne redéfinissent
pas les clés globales de `modele-social`.

- **Congés payés CIBTP** : assiette standard et taux CIBTP Île-de-France de 20,20 % à compter du 1er avril 2026.
- **Chômage intempéries** : assiette plafonnée au PMSS ; 0,68 % pour le gros œuvre,
  0,13 % pour le second œuvre, zéro pour une activité non exposée. L'abattement
  annuel reste un calcul d'entreprise et n'est pas simulé salarié par salarié.
- **OPPBTP** : taux 2026 de 0,11 % sur l'assiette BTP conventionnelle retenue.
- **RNPC cadre** : aucune correction de prévoyance cadre ; ce modèle porte sur les ETAM.

## Sources

- [Légifrance — accord régional Île-de-France ETAM TP](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054162121)
- [CIBTP France — principales revalorisations pour 2026](https://www.cibtp.fr/actualite-/-presse/actualites/actualite/principales-revalorisations-pour-2026)
- [CIBTP France — réglementation](https://www.cibtp.fr/documentation/reglementation)
- [OPPBTP — arrêté fixant le taux 2026](https://www.oppbtp.com/app/uploads/2025/12/arrete-2025-taux-2026.pdf)

## Limites

La version ne couvre pas les autres régions, les années antérieures ou postérieures,
les cadres, les primes, les indemnités de petits déplacements, les remboursements
d'intempéries ni le calcul de l'abattement annuel CIBTP au niveau de l'entreprise.
La compatibilité avec le SMIC et le choix de période de paie restent à la charge
de l'application consommatrice.
