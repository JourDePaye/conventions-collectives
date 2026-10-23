# Promotion immobilière — IDCC 1512

Modèle `1512-promotion-immobiliere`, version `2026.4`, espace de noms
`salarié . convention collective . promotion immobilière`.

## Périmètre

La version `2026.3` reprend la version `2026.2` à l'identique, à la même date, et corrige `coefficient hors grille` : l'expression `coefficient < 100 ou coefficient > 787` n'est pas une condition publicodes valide et ne valait jamais vrai. La règle vaut désormais vrai lorsque le coefficient n'est pas dans la grille (minimum mensuel nul).

La version `2026.4` reprend `2026.3` à la même date et corrige les taux de prévoyance : `2026.2` et `2026.3` appliquaient les taux d'appel réduits que l'article 2.3.1 de l'accord du 23 octobre 2024 ([KALITEXT000050792995](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000050792995)) ne fixe que du 1er janvier au 31 décembre 2025 ; en 2026, ce sont les taux contractuels de ses tableaux, que l'avenant n° 1 du 20 octobre 2025 ne modifie pas.

Cette version couvre la grille des salaires minima de l'avenant n° 51 du
12 janvier 2026, ainsi que les régimes collectifs de frais de santé et de
prévoyance applicables au 1er janvier 2026. L'avenant salarial est applicable
au **1er janvier 2026** et référencé comme **en vigueur étendu** dans la fiche
officielle Légifrance de la convention IDCC 1512.

La première valeur de point est de 18,85 € pour le coefficient 100, et la
seconde valeur de point est de 4,50 € pour chaque point au-delà de 100. Les
minima mensuels résultants sont arrondis à l'euro supérieur. La grille couvre
les coefficients 100, 110, 123, 143, 163, 176, 203, 300, 390, 457, 590, 723
et 787.

Pour les salariés des niveaux 4 à 6 au forfait annuel de 218 jours, l'avenant
fixe un minimum distinct de **36 276 € bruts par an**. Le modèle expose ce
minimum sans le convertir en garantie mensuelle.

Le régime conventionnel de frais de santé est modélisé à **2,60 % du PMSS**,
réparti à parts égales. La prévoyance est calculée sur le brut jusqu'à quatre
PMSS : non-cadres à 0,745 % en T1 et 1,125 % en T2 pour chaque part ; cadres à
1,50 % employeur et 0 % salarié en T1, puis 1,13 % pour chaque part en T2 (taux
contractuels, depuis `2026.4`).

## Sources officielles

- [Légifrance — convention collective nationale de la promotion immobilière, IDCC 1512](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635181)
- [Légifrance — accords et conventions collectives, avenant n° 51](https://www.legifrance.gouv.fr/liste/idcc?ctx=eJyLz2FIzWOIL8tjSMpPTmaIz2bQdnZWMDIwMGOIz8gscSvNyWEwNDBgAADlcwqk&page=30)
- [Journal officiel — recherche des arrêtés d'extension](https://www.legifrance.gouv.fr/jorf)

## Limites

Les primes, indemnités, classifications détaillées et autres dispositions de
la convention ne sont pas modélisées. Le contrôle du SMIC, la proratisation du
minimum mensuel selon la quotité de travail, les options/dispenses de santé et
prévoyance, la portabilité, ainsi que le choix de la version applicable à la
période de paie restent à la charge de l'application consommatrice.
