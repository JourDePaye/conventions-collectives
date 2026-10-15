# Personnel navigant du groupement des armateurs de services de passages d'eau (GASPE) — IDCC 3228

La version `2022.1` modélise l'accord du **14 mars 2022** relatif aux salaires minima, applicable au **1er janvier 2022**, étendu par arrêté du 26 juillet 2022.

Les versions `2025.1` (protocole du **25 avril 2025**, NAO 2025, `KALITEXT000052133151`, étendu par arrêté du 25 novembre 2025) et `2026.1` (protocole du **31 mars 2026**, NAO 2026, `KALITEXT000054872417`, étendu par arrêté du 29 septembre 2026 publié au Journal officiel du 13 octobre 2026) reprennent les barèmes « Officier » et « Appui » des 1er janvier 2025 et 1er janvier 2026 pour les employeurs membres du GASPE, avec une fonction de plus : les capitaines et chefs mécaniciens de plus de 3 000 ums (16e catégorie ENIM). Dans la version `2022.1`, les montants des deux fonctions de 12e catégorie semblent inversés par rapport aux barèmes suivants (ordre croissant du montant selon les ums) : à vérifier sur le texte du 14 mars 2022.

## Règles implémentées

- `fonction` reçoit l'une des huit fonctions de l'annexe 1 ;
- `salaire minimum conventionnel` expose le minimum mensuel brut hors accessoires, sur base de 1 607 heures annuelles, proratisé selon la quotité de travail ;
- `fonction hors grille` détecte une fonction absente et laisse le salaire à zéro.

## Audit explicite des rubriques de paie

L'accord salarial, la convention collective et les textes dédiés accessibles sur Légifrance ont été recherchés pour :

- **Cotisations salarié/employeur, taux et assiettes** : l'accord du 14 mars 2022 fixe uniquement les minima de rémunération ; il ne modifie aucun taux ni aucune assiette de cotisation conventionnelle. Aucun taux générique n'est ajouté.
- **Plafonds, tranches et forfaits** : aucun plafond, tranche ou forfait conventionnel n'est fixé par l'accord salarial ; omission documentée.
- **Santé et prévoyance** : aucun taux ou assiette chiffré et applicable à tous les salariés n'est créé par l'accord salarial ; les régimes dédiés restent distincts et nécessitent leurs propres paramètres d'affiliation.
- **Retraite** : aucune cotisation de retraite complémentaire ou supplémentaire n'est fixée ou modifiée par ce texte ; les taux de régime ne sont pas remplacés.
- **Formation professionnelle** : aucune contribution conventionnelle additionnelle chiffrée n'est créée par l'accord ; les contributions dépendent notamment de l'effectif et du dispositif.
- **AT/MP** : aucun taux conventionnel n'est fixé ; la tarification relève du régime réglementaire et de l'activité.
- **Primes, accessoires, avantages et frais** : le barème concerne le salaire minimum hors accessoires. Primes de service, indemnités de repas/déplacement, avantages en nature, congés et remboursements de frais ne sont pas calculés sans paramètres contractuels et de navigation sûrs.
- **Base et plafond de comparaison** : la base modélisée est le minimum mensuel brut de l'annexe 1 ; seule la quotité de travail la prorate. Aucune base de cotisation ni conversion annuelle implicite n'est ajoutée.

Ces omissions sont intentionnelles : aucun taux salarié/employeur, base, plafond, tranche, forfait ou montant de régime ne peut être calculé sûrement à partir de l'accord salarial seul.

## Source officielle

- [Accord du 14 mars 2022 relatif aux salaires minima — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000046565704)
- Arrêté du 26 juillet 2022 portant extension, cité dans le texte officiel.
