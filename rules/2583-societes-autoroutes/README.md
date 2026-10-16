# Sociétés concessionnaires ou exploitantes d'autoroutes ou d'ouvrages routiers — IDCC 2583

La version `2024.1` (12 septembre 2024) modélise l'accord collectif national de branche du **19 juin 2024** relatif aux rémunérations annuelles garanties pour l'année 2024. L'accord prend effet rétroactivement au **1er janvier 2024** et a été étendu par arrêté du **4 septembre 2024**, publié au Journal officiel le **12 septembre 2024**. La version est datée du 12 septembre 2024, date à laquelle le barème est opposable à l'ensemble du champ étendu.

La valeur Publicodes est `sociétés autoroutes` et les règles sont sous `salarié . convention collective . sociétés autoroutes`.

## Version 2025.1

La version `2025.1` modélise l'accord du **21 octobre 2025** relatif aux rémunérations annuelles garanties pour l'année **2025** (KALITEXT000053428773) : barème 2024 revalorisé de 1,8 % pour les 16 classes, de 22 681 € (classe A) à 75 951 € (classe P). L'accord prend effet rétroactivement au 1er janvier 2025 (article 6) et a été étendu par arrêté du 6 janvier 2026, publié au JORF du 17 janvier 2026.

**Choix de `validFrom` : 2025-01-01.** La RAG est une garantie pour l'année civile, comparée sur l'année. Dater la version de l'arrêté d'extension (17 janvier 2026) ferait appliquer le barème 2024 pendant toute l'année 2025, ce qui est faux. La version 2024.1, datée de son extension (12 septembre 2024), reste inchangée et couvre la fin de 2024. Les règles et les clés (`classe` A à P) sont identiques à celles de 2024.1 ; seuls les montants changent.

Aucun barème 2026 n'est publié à la date de rédaction : la version 2025.1 reste en vigueur pour les périodes ultérieures tant qu'un nouvel accord n'est pas modélisé.

## Règles implémentées

- `classe` reçoit la classe contractuelle `A` à `P`.
- `rémunération annuelle garantie` expose le barème annuel brut 2024 : exécution A à C (22 280 € à 23 649 €), maîtrise D à H (24 925 € à 33 104 €) et cadres I à P (36 321 € à 74 608 €).
- `salaire minimum annuel conventionnel` prorata le montant par `salarié . contrat . temps de travail . quotité`. La garantie est annuelle : aucune conversion mensuelle n'est inventée.
- `classe hors grille` signale une classe absente et laisse l'endpoint minimum à zéro.

## Audit paie explicite

L'accord et les textes rattachés ont été recherchés pour les rubriques suivantes :

- **Taux et assiettes de cotisations salarié/employeur** : l'accord salarial du 19 juin 2024 ne modifie ni taux ni assiette de cotisations ; aucun taux conventionnel calculable n'est ajouté.
- **Plafonds, tranches et forfaits** : aucun plafond, aucune tranche et aucun forfait de cotisation n'est fixé par cet accord ; aucune règle n'est ajoutée.
- **Santé et prévoyance** : le conteneur officiel IDCC 2583 recense des accords distincts de protection sociale complémentaire ; ils ne sont pas nécessaires au barème salarial 2024 et aucun taux/assiette directement calculable n'est introduit dans cette version.
- **Formation professionnelle** : l'accord de formation professionnelle est un texte distinct du barème salarial ; aucun taux additionnel ou assiette de formation n'est créé par l'accord du 19 juin 2024.
- **AT/MP** : aucun taux ou dispositif AT/MP conventionnel n'est fixé par l'accord salarial ; omission documentée.
- **Primes, indemnités et avantages en nature** : le texte audité fixe les rémunérations annuelles garanties et ne fournit pas de montant calculable de prime ou d'avantage à intégrer à l'endpoint ; aucune prime n'est inventée.
- **Base de comparaison** : la garantie est annuelle et les montants versés nécessaires à la comparaison (fixe, variable, absences, primes ou éléments exclus) ne sont pas des entrées génériques sûres du modèle. Seule la garantie annuelle sourcée est exposée.

Les accords dédiés de protection sociale complémentaire, de formation et les arrêtés d'extension ont été recherchés dans le conteneur officiel. Leur contenu ne justifie pas d'ajouter à cette version un taux, une base, un plafond, une tranche, un forfait, une cotisation santé/prévoyance/formation ou un taux AT/MP sans données et périmètre supplémentaires.

## Sources officielles

- Convention collective nationale des sociétés concessionnaires ou exploitantes d'autoroutes ou d'ouvrages routiers du 27 juin 2006, IDCC 2583, conteneur KALI `KALICONT000018977636`.
- Accord collectif national de branche du 19 juin 2024 relatif aux montants des rémunérations annuelles garanties pour l'année 2024, publié dans les textes de la convention sur Légifrance.
- Arrêté du 4 septembre 2024 portant extension de l'accord, JORF du 12 septembre 2024 : `JORFTEXT000050203153`.

## Limites

La version couvre le barème annuel étendu pour l'année civile 2024. Les accords salariaux ultérieurs et les accords autonomes de protection sociale ou de formation devront faire l'objet de versions ou règles distinctes, avec leur propre date d'effet, extension, assiette et taux vérifiés.
