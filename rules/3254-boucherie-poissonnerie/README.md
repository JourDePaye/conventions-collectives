# Boucherie, boucherie-charcuterie-traiteur, poissonnerie — IDCC 3254

La version `2026.1` modélise la grille mensuelle de l'avenant n° 9-B du 4 février 2026, applicable au 1er juin 2026 après extension par arrêté du 4 mai 2026. Les montants sont ceux de la branche boucherie-poissonnerie pour 151,67 heures et sont proratisés selon la quotité de travail.

La valeur Publicodes est `boucherie poissonnerie` et les règles sont sous `salarié . convention collective . boucherie poissonnerie`.

## Règles implémentées

- `niveau` reçoit une classification `I-A` à `VII-B`.
- `salaire minimum conventionnel` expose le minimum mensuel de la grille et le prorata de la quotité.
- `niveau hors grille` signale une classification absente de la grille ; le minimum vaut alors `0 €/mois`.

## Audit explicite des rubriques de paie

L'audit a porté sur l'avenant salarial, la convention collective consolidée, les accords dédiés et leurs textes d'extension consultables dans KALI/JORF :

- **Cotisations salarié/employeur, assiette, plafonds et tranches :** aucune modification de taux, d'assiette, de plafond ou de tranche n'est créée par l'avenant n° 9-B ; les cotisations légales de `modele-social` restent applicables. Aucun taux conventionnel calculable supplémentaire n'est ajouté.
- **Forfaits et assiettes forfaitaires :** aucun forfait de cotisation ou d'assiette forfaitaire chiffré n'est établi par les textes salariaux inspectés ; omission volontaire, sans valeur nulle implicite.
- **Santé :** l'accord du 22 novembre 2021 fixe, pour le régime général de base « famille hors conjoint », `2,36 % T1/T2 + 0,32 % PMSS`, avec une prise en charge employeur de 60 % et salarié de 40 % ; l'Alsace-Moselle, le conjoint et les régimes surcomplémentaires ont des paramètres distincts. Ces options, ayants droit et paramètres temporels ne sont pas suffisamment déterminés ici pour un calcul automatique sûr. Omission documentée.
- **Prévoyance :** l'accord du 22 novembre 2021 fixe une répartition employeur/salarié de 60/40 pour les non-cadres et 96 % employeur sur T1 pour les cadres ; les tableaux de taux contractuels sont annexés au BOCC et varient selon le statut et la période. Ils ne sont pas implémentés dans cette version faute d'un périmètre de statut et de garanties suffisant. Omission documentée.
- **Formation professionnelle :** aucun taux conventionnel additionnel calculable n'est déduit des textes inspectés ; la contribution légale reste celle de `modele-social`.
- **AT/MP :** aucun taux de branche ne peut être déduit de la convention ; le taux dépend de l'établissement et reste hors modèle.
- **Primes, majorations et indemnités :** les primes d'ancienneté, dimanche/jours fériés, panier, repas, déplacement, astreinte et autres avantages sont conventionnels ou conditionnels mais leurs conditions d'entrée ne sont pas modélisées dans cette version ; aucun montant n'est inventé.
- **Avantages en nature et rémunération variable :** non incorporés au minimum conventionnel faute de règle de calcul suffisamment déterminée dans l'avenant salarial.

Cette version est donc limitée aux minima salariaux et n'altère aucun endpoint de cotisation partagé avec une autre convention.

## Sources officielles

- Avenant n° 9-B du 4 février 2026 relatif aux salaires minima, texte KALI `KALITEXT000054254741`.
- Arrêté du 4 mai 2026 portant extension de l'avenant n° 9-B, publié au Journal officiel du 10 mai 2026.
- Convention collective nationale du 24 septembre 2024, conteneur KALI `KALICONT000052370692`.
- Accord du 22 novembre 2021 relatif aux frais de santé et à la prévoyance, articles 3 et 5, textes KALI en vigueur et BOCC.

## Tests

`test/boucherie-poissonnerie.test.ts` vérifie la date et les sources, la grille, la proratisation, les classifications hors grille et l'isolation pour une autre convention.
