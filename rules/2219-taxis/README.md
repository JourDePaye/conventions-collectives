# Taxis — IDCC 2219

La version `2025.2` modélise l'accord du **20 juin 2025** relatif aux rémunérations minimales, applicable au **1er juin 2025** et étendu par arrêté du **9 octobre 2025**, publié au Journal officiel du **15 octobre 2025**. Elle remplace `2025.1` (même date d'effet), qui ne modélisait qu'une ligne sur onze.

## Périmètre modélisé

Les onze lignes de l'accord, désignées par `classification` :

| `classification` | Minimum mensuel (151,67 h) | Taux horaire |
|---|---|---|
| `niveau 1 — conducteur débutant — non titulaire carte professionnelle` (échelon 1) | 1 837,86 € | 12,11 € |
| `niveau 2 — conducteur confirmé — non titulaire carte professionnelle` (échelon 1) | 1 853,34 € | 12,21 € |
| `niveau 1 — conducteur débutant — titulaire carte professionnelle` (échelon 2) | 1 837,86 € | 12,11 € |
| `niveau 2 — conducteur confirmé — titulaire carte professionnelle` (échelon 2) | 1 853,34 € | 12,21 € |
| `niveau 3 — conducteur confirmé — titulaire carte professionnelle` (échelon 2) | 1 868,81 € | 12,32 € |
| `non roulant — échelon I` | 1 870,09 € (calculé) | 12,33 € |
| `non roulant — échelon II` | 1 879,19 € (calculé) | 12,39 € |
| `non roulant — échelon III` | 1 923,18 € (calculé) | 12,68 € |
| `non roulant — échelon IV` | 2 191,63 € (calculé) | 14,45 € |
| `non roulant — échelon V` | 2 501,04 € (calculé) | 16,49 € |
| `non roulant — échelon VI` | 2 816,51 € (calculé) | 18,57 € |

- Clés ajoutées par rapport à `2025.1` : toutes sauf `niveau 1 — conducteur débutant — titulaire carte professionnelle`, conservée telle quelle. Nouvelle règle : `taux horaire minimum conventionnel` (€/heure).
- `grille mensuelle` : montants publiés pour les personnels roulants ; pour les non roulants, l'article 4 ne publie qu'un taux horaire, le minimum mensuel est calculé par le modèle (taux horaire × 151,67 heures, arrondi au centime) et non repris du texte.
- `salaire minimum conventionnel` applique la quotité de travail une seule fois au minimum mensuel.
- Les niveaux et catégories non prévus par l'accord (par exemple le niveau 3 sans carte professionnelle) retournent `classification hors grille` = `oui` et un minimum nul, à ne pas interpréter comme une absence de droit conventionnel.

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
