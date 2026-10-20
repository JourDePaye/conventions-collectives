# Bâtiment — cadres (IDCC 2420)

## Version en vigueur : `2026.5`, commune aux quatre conventions du bâtiment

Les versions `2026.4` et `2026.5` sont publiées à l'identique pour les IDCC 1596, 1597, 2609 et
2420, depuis les fichiers communs de [`rules/commun/batiment`](../commun/batiment/) (voir leur
[README](../commun/batiment/README.md)) ; `2026.5`, de même date d'effet, l'emporte. Elle complète et corrige la convention du bâtiment
de modele-social (`salarié . convention collective . BTP`), qui couvre à la fois les ouvriers, les
ETAM et les cadres : taux de la cotisation congés payés CIBTP par caisse et par date, cotisation
chômage intempéries, prévoyance des cadres (RNPC) comptée une seule fois, et grilles régionales des
ouvriers et des ETAM à partir de la publication de leur arrêté d'extension : celles de toutes les
régions dans `2026.5`, quatre seulement dans `2026.4`.

**La version `2026.1` ci-dessous n'est plus utilisée** : elle calculait ses cotisations
dans un espace de noms à part, sans remplacer celles de modele-social. Elle reste publiée pour
l'historique ; un consommateur qui choisit la version par date doit partir de `2026.4`.

Les versions `2026.4` et `2026.5` n'ont pas de grille des cadres : l'avenant n° 78 du 19 janvier 2026 n'est pas
étendu, et une version commune ne peut pas réserver une seule de ses grilles aux adhérents d'une
organisation signataire. Seul le SMIC s'impose aux cadres jusqu'à son extension.

## Versions antérieures, plus utilisées

Modèle `2420-batiment-cadres`, version `2026.1`, espace de noms
`salarié . convention collective . bâtiment cadres`.

## Périmètre juridique explicite

Cette version reprend exclusivement l'**avenant n° 78 du 19 janvier 2026**,
avec effet au **1er février 2026**, pour les appointements minimaux des
ingénieurs et cadres du bâtiment et un horaire hebdomadaire de **39 heures**.
La page officielle consultée le **12 octobre 2026** qualifie ce texte **« en
vigueur non étendu »**. Le modèle demande donc explicitement que l'employeur
soit signataire ou adhérent et **ne présente pas ces minima comme
universellement étendus**. Aucun arrêté d'extension de cet avenant n'a été
identifié dans la page officielle consultée à cette date.

La version est bornée au 1er février–31 décembre 2026. Une extension ultérieure
ou un nouvel accord salarial devra donner lieu à une nouvelle vérification et à
une version immuable distincte.

## Grille mensuelle brute — 39 heures

| Coefficient | Minimum mensuel |
|---:|---:|
| 60 | 2 356 € |
| 65 | 2 553 € |
| 70 | 2 740 € |
| 75 | 2 853 € |
| 80 | 3 036 € |
| 85 | 3 197 € |
| 90 | 3 353 € |
| 95 | 3 504 € |
| 100 | 3 622 € |
| 103 | 3 693 € |
| 108 | 3 827 € |
| 120 | 4 145 € |
| 130 | 4 411 € |
| 162 | 5 472 € |

Les montants sont mensuels et ne sont pas convertis depuis une grille annuelle.
Le modèle bloque les coefficients non publiés, les dates hors période et les
employeurs déclarés hors du périmètre signataire/adhérent.

## Correction BTP RNPC cadre

Le modèle ajoute uniquement dans son propre espace de noms la correction du
régime national de prévoyance des cadres du BTP :

- tranche A employeur : **1,50 %** ;
- tranche B : **2,40 %**, partagée à 50 % entre employeur et salarié, jusqu'à
  quatre plafonds de sécurité sociale ;
- tranche C optionnelle : **non calculée**.

Les règles ne redéfinissent pas les clés globales de `modele-social` et
remplacent seulement l'endpoint de prévoyance cadre lorsque le statut cadre est
explicitement `oui`.

Les cotisations CIBTP, le chômage intempéries et l'OPPBTP ne sont pas ajoutés :
leur applicabilité, assiette et taux ne sont pas établis par l'accord salarial
cité et aucun taux BTP 2026 n'est rétro-importé dans cette version.

## Sources

- [Avenant n° 78 — texte officiel](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054092365)
- [Article 1 — grille des appointements](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054092368)
- [Page officielle de la convention IDCC 2420](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000017941839?facetteEtat=VIGUEUR_ETEN)
- [PRO BTP — notice entreprise assiette et taux](https://www.probtp.com/files/live/sites/probtp/files/media/pdf/PRO/declarations/notice-entreprise-assiette-taux.pdf)

## Limites

Le modèle ne détermine pas l'adhésion ou la qualité de signataire : cette
information doit être fournie et vérifiée par l'application consommatrice. Il
ne couvre ni les salariés hors statut cadre, ni les accords ultérieurs, ni les
primes, ni CIBTP, intempéries ou OPPBTP.
