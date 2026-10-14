# Taxis — IDCC 2219

La version `2025.1` modélise l'accord du **20 juin 2025** relatif aux rémunérations minimales, applicable au **1er juin 2025** et étendu par arrêté du **9 octobre 2025**, publié au Journal officiel du **15 octobre 2025**.

## Périmètre modélisé

- `classification` accepte `niveau 1 — conducteur débutant — titulaire carte professionnelle` ;
- `salaire minimum conventionnel` expose le minimum mensuel brut de **1 837,86 €** et le prorata par la quotité de travail ;
- les autres niveaux, personnels roulants non titulaires de la carte professionnelle, personnels non roulants, titulaires expérimentés et catégories cadres restent explicitement hors du périmètre de cette version ;
- une classification absente de cette ligne retourne zéro et ne doit pas être interprétée comme une absence de droit conventionnel.

## Audit explicite des rubriques de paie

L'accord salarial, la convention collective nationale et les textes dédiés disponibles dans le conteneur officiel Légifrance de l'IDCC 2219 ont été recherchés séparément pour :

- **Cotisations salarié/employeur, taux et assiettes** : l'accord du 20 juin 2025 fixe des rémunérations minimales, sans modifier un taux ou une assiette générique de cotisation. Aucun taux salarié ou employeur n'est inventé.
- **Plafonds, tranches et forfaits** : aucune évolution chiffrée calculable à partir de la ligne salariale modélisée ; plafonds, tranches et forfaits restent ceux des régimes applicables.
- **Santé et prévoyance** : les recherches dédiées n'ont pas fourni dans le périmètre officiellement applicable un taux et une assiette génériques, indépendants de l'organisme ou de la situation d'affiliation, pouvant être calculés par ce modèle ; aucune cotisation santé/prévoyance n'est remplacée.
- **Retraite** : aucun taux conventionnel de retraite complémentaire ou supplémentaire n'est modifié par l'accord salarial ; les cotisations de régime restent externes.
- **Formation professionnelle** : aucun taux additionnel de branche calculable et applicable à tous les salariés n'est créé par l'accord salarial ; les contributions légales et éventuelles contributions dédiées dépendent de l'effectif, de l'assiette et du dispositif.
- **AT/MP** : aucun taux conventionnel n'est fixé ; la tarification dépend de l'activité, de la sinistralité et de la notification réglementaire.
- **Primes, majorations, avantages et frais** : les primes liées à la conduite, à l'ancienneté, aux heures supplémentaires, au travail de nuit, aux repas, aux déplacements, aux avantages en nature et aux remboursements de frais exigent des paramètres individuels ou contractuels absents de cette version ; ils ne sont pas calculés.
- **Base et comparaison** : la seule base automatisée est le minimum mensuel brut publié pour la classification couverte, proratisé uniquement par la quotité de travail ; aucune conversion annuelle ou base de cotisation implicite n'est ajoutée.

Ces omissions sont intentionnelles : l'audit a recherché explicitement les changements de taux, bases, plafonds, tranches, forfaits et toutes les rubriques de paie demandées, mais aucun montant conventionnel générique supplémentaire n'est calculable de façon sûre avec les entrées de ce modèle.

## Sources officielles

- [Accord du 20 juin 2025 relatif aux rémunérations minimales — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000052447745)
- [Arrêté du 9 octobre 2025 portant extension — Journal officiel/Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052391450)
- [Convention collective nationale des taxis du 11 septembre 2001 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000021125058)
