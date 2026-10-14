# Remontées mécaniques et domaines skiables — IDCC 454

La version `2026.1` modélise l'avenant n° 88 du 26 novembre 2025, applicable à compter du **1er décembre 2025**, de la convention collective nationale des remontées mécaniques et domaines skiables (IDCC 454, brochure 3122). La grille officielle fixe un salaire horaire minimal professionnel garanti pour chaque niveau de rémunération (NR) de 200 à 409.

La valeur Publicodes est `remontées mécaniques domaines skiables`. Le minimum mensuel exposé est un équivalent calculé sur 151,67 heures et proratisé par la quotité ; la source est horaire, donc aucun minimum mensuel autonome n'est prétendu. Le niveau de positionnement (NP) de l'emploi, qui détermine le NR selon la classification de la convention, reste à fournir par l'application.

## Rubriques implémentées

- `salaire minimum horaire conventionnel` : grille complète NR 200 à 409, en €/heure.
- `salaire minimum mensuel conventionnel` : équivalent 151,67 heures/mois et proratisation.
- `niveau hors grille` : détection des NR hors 200–409.
- `indemnité compensatrice de panier` : 7,94 €/mois, exposée séparément.
- `indemnité compensatrice d'équipement skis et bâtons` : 51,55 €/an, exposée séparément.
- `indemnité compensatrice d'équipement chaussures` : 30 €/an, exposée séparément.
- `prime de langue étrangère` : 65,10 €/mois, exposée séparément.
- `prime d'artificier` : 50 €/mois, exposée séparément.

Les primes et indemnités ne sont pas ajoutées automatiquement au salaire : leur éligibilité, période de versement, fourniture effective de l'équipement et conditions de travail ne sont pas des entrées génériques suffisantes dans ce package.

## Audit explicite des rubriques de paie

L'audit a couvert la convention consolidée, l'avenant salarial n° 88, l'avenant n° 83 relatif aux rémunérations 2025 et les avis/arrêtés d'extension accessibles dans KALI/JORF.

- **Cotisations salarié/employeur, taux, assiettes, plafonds et tranches :** l'avenant n° 88 ne modifie aucun taux de cotisation ni assiette, plafond ou tranche. Aucun taux conventionnel générique calculable n'est ajouté ; les cotisations légales héritées de `modele-social` restent applicables.
- **Forfaits et assiettes forfaitaires :** les montants forfaitaires de panier et d'équipement sont des rubriques de rémunération, pas des assiettes de cotisation autonomes documentées par l'avenant ; leur traitement social n'est pas inventé.
- **Santé et prévoyance :** des textes dédiés de branche peuvent fixer des régimes et garanties, mais aucun taux salarié/employeur générique, période et catégorie suffisamment bornés n'est retenu ici ; omission explicite, sans valeur nulle implicite.
- **Formation professionnelle :** aucun taux additionnel chiffré et calculable n'est fixé par l'avenant salarial ; la contribution légale reste celle de `modele-social`.
- **AT/MP :** aucun taux de branche ne remplace le taux établissement ; la rubrique reste hors modèle.
- **Primes, indemnités et avantages :** les cinq montants de l'article 3 sont exposés séparément. Ancienneté, travail saisonnier, nuit, dimanche/jours fériés, astreinte, logement, repas autres que le panier, transport et autres sujétions ne sont pas calculés faute d'entrées d'éligibilité et de période sûres.
- **Base de comparaison :** les minima sont horaires ; aucune conversion en annuel ou autre forfait n'est ajoutée.

## Sources officielles

- [Convention nationale et textes attachés — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635642)
- [Avenant n° 88 du 26 novembre 2025 — Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000053576535)
- [Avis d'extension de l'avenant n° 83 — JORF](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051807027)

## Tests

`test/remontees-mecaniques-domaines-skiables.test.ts` vérifie la grille officielle, l'équivalent mensuel, les primes séparées, le hors-grille et l'isolation du namespace de cotisations.
