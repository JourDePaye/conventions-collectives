# ÉCLAT — IDCC 1518

Le modèle `1518-eclat` expose la version `2026.2` sous l'espace de noms
`salarié . convention collective . éclat`.

## Périmètre salarial

La version `2026.1` reprend l'avenant n° 208 du 23 juin 2025, étendu par arrêté
du 9 octobre 2025 : valeur V1 de 6,81 €, valeur V2 de 7,23 €, formule de
rémunération par coefficient et groupe A à J, points de coordination du groupe
C et points d'ancienneté. Les minima sont mensuels et proratisés une seule fois
par la quotité de travail.

La version `2026.2` conserve cette grille et ajoute l'avenant n° 209 du
9 juillet 2025, étendu par arrêté du 26 mars 2026 (JORF du 3 avril 2026),
d'application au 1er janvier 2026. Elle modélise les deux contributions
calculables sur l'assiette de cotisations :

- contribution totale de formation professionnelle : **2,10 %** des rémunérations ;
- contribution conventionnelle dédiée à la formation des dirigeants bénévoles :
  **0,05 %** des rémunérations.

Les deux taux sont exposés en montants mensuels et utilisent l'assiette
`salarié . cotisations . assiette` de `modele-social`. Le 2,10 % inclut la
contribution légale et la contribution conventionnelle ; il ne faut donc pas
additionner le taux légal une seconde fois.

## Audit du référentiel de paie

Les sources officielles consultées couvrent la grille salariale et les
contributions de formation. Elles ne fournissent pas, dans les textes retenus,
de règle générique et calculable propre à ÉCLAT sur les bases de cotisations
hors assiette générale, plafonds ou tranches, forfaits, avantages en nature,
frais de santé, prévoyance, AT/MP ou exonérations. Ces rubriques restent
héritées de `modele-social` et aucun taux de branche n'est inventé.

Les dispositifs de collecte, de mutualisation, de CPF-CDD, d'apprentissage et
la répartition de l'enveloppe entre structures nécessitent des paramètres
juridiques ou déclaratifs supplémentaires ; ils restent documentés mais ne
sont pas calculés par ce modèle. Les primes et indemnités de la convention
restent également hors périmètre.

## Sources officielles

- Avenant n° 208 du 23 juin 2025 relatif à la négociation salariale annuelle obligatoire, KALITEXT000052447622.
- Avenant n° 209 du 9 juillet 2025 relatif à la formation professionnelle et à l'apprentissage, notamment articles 5 et 12, KALIARTI000052447643 et KALIARTI000052447694.
- Arrêté du 26 mars 2026 portant extension de l'avenant n° 209, JORF du 3 avril 2026.
- Convention collective nationale ÉCLAT du 28 juin 1988, IDCC 1518.
