# Maisons d'étudiants — IDCC 1671

La version `2026.2` modélise les avenants n° 75 et n° 76 du **9 décembre 2025** de la convention collective nationale des maisons d'étudiants (IDCC 1671). La grille de classification et la valeur du point sont applicables au **1er janvier 2026** aux employeurs signataires ou adhérents ; l'accord a été étendu par arrêté du **3 juillet 2026**, avec effet général au **1er juillet 2026**.

La valeur Publicodes est `maisons d'étudiants` et les règles sont sous `salarié . convention collective . maisons d'étudiants`.

## Règles implémentées

- `classe` accepte les classes 1 à 20 ; la grille associe chaque classe à son coefficient conventionnel ;
- `valeur annuelle du point` est fixée à `68,80 €/an` ;
- `salaire minimum annuel conventionnel` calcule le minimum brut annuel à temps plein et le prorata selon la quotité ;
- `salaire minimum mensuel indicatif` expose seulement l'équivalent de la garantie annuelle (`minimum annuel / 12`) ;
- `treizième mois annuel` applique la montée en charge de l'avenant n° 74 : un tiers en 2026, deux tiers en 2027, puis la totalité à partir de 2028, sur une assiette annuelle fournie par l'application ;
- `prise en charge employeur santé` et `part salarié santé` répartissent la cotisation totale externe selon la clé 65 % / 35 % de l'avenant n° 76 ;
- les dates et le champ juridique sont bloqués explicitement ; une classe hors grille vaut zéro et est signalée.

## Audit explicite des rubriques de paie

L'audit a porté sur l'avenant salarial et les textes dédiés de protection sociale, de formation, de prévoyance, de santé, de primes et d'avantages, ainsi que sur les arrêtés d'extension disponibles.

- **Cotisations salarié/employeur, taux et assiettes** : les avenants n° 75 et n° 76 ne changent pas les cotisations générales de sécurité sociale. La seule clé conventionnelle calculable trouvée est la complémentaire santé : 65 % employeur et 35 % salarié ; la cotisation totale reste une entrée externe car le montant dépend du contrat assureur.
- **Bases, plafonds, tranches et forfaits** : aucun plafond, aucune tranche ni assiette forfaitaire générique nouvelle n'est calculable à partir des entrées du modèle ; omission explicite.
- **Santé** : la répartition 65 % / 35 % est modélisée sur une cotisation mensuelle totale fournie par l'application. Les garanties et le montant assureur ne sont pas inventés.
- **Prévoyance** : les textes autonomes ne fournissent pas, dans le périmètre calculable de cette version, un taux universel salarié/employeur et une assiette indépendante de l'organisme ; aucune valeur par défaut n'est ajoutée.
- **Formation professionnelle** : les contributions légales et éventuelles contributions conventionnelles dépendent de l'effectif, de la masse salariale et du dispositif ; aucun taux additionnel suffisamment paramétré n'est calculé.
- **AT/MP** : aucun taux conventionnel n'est fixé par les avenants modélisés ; la tarification dépend de l'activité et du régime réglementaire, donc elle reste hors modèle.
- **Primes et avantages** : le treizième mois est exposé avec son assiette externe et sa montée en charge. Les primes d'ancienneté, indemnités, avantages en nature, repas/logement, congés et remboursements de frais ne sont pas calculés faute d'entrées et de conditions d'attribution sûres.
- **Comparaison et proratisation** : le minimum légalement modélisé reste annuel en `€/an`; seul son équivalent indicatif est divisé par douze, et le prorata est appliqué à la quotité de travail.

## Sources officielles

- Avenant n° 75 du 9 décembre 2025 relatif à la classification et aux salaires, IDCC 1671, KALIARTI `KALIARTI000054454212`.
- Avenant n° 76 du 9 décembre 2025 relatif à la valeur du point et aux frais de santé, KALITEXT `KALITEXT000054454229`.
- Avenant n° 74 du 9 décembre 2025 relatif au treizième mois, KALITEXT `KALITEXT000054454208`.
- Avenant n° 72 du 17 avril 2025 relatif à la prévoyance, KALITEXT `KALITEXT000051314781`.
- Convention collective nationale des maisons d'étudiants, conteneur `KALICONT000005635917`, et arrêté d'extension du 3 juillet 2026.

## Limites

Les dispositifs de prévoyance, formation, AT/MP, garanties santé et avantages nécessitent des paramètres de contrat, d'effectif, d'activité ou d'organisme. Ils sont audités et explicitement laissés à l'application plutôt que remplacés par des taux ou assiettes par défaut.
