# Ce projet contient le code du 9ème projet de la formation de Développeur JS-React chez OpenClassrooms

- Code original du Front-end: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front

- Code original du Back-end: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back

---

Nous avons dans la [Kanban Notion](https://www.notion.so/a7a612fc166747e78d95aa38106a55ec?v=2a8d3553379c4366b6f66490ab8f0b90&p=01b2963f50654215baae678fa4dc4851&pm=s):

> 4 bugs à corriger:

1. Le test Bills / les notes de frais s'affichent par ordre décroissant est passé au rouge.

2. Dans le rapport de test "Login, si un administrateur remplit correctement les champs du Login, il devrait naviguer sur la page Dashboard", le test est passé au rouge.

3. On peut soit ne pas envoyer d'image soit envoyer des fichiers autres que des images

4. Dans la partie Admin RH → Si on déplie une liste de tickets et on en ouvre une autre, on ne peux plus sélectionner un ticket de la première liste.

> Créer 2 tests d'intégration avec Jest avec minimum 80% de _code coverage_

1. Pour le fichier Bill.js

2. Pour le fichier NewBill.js

> Rédiger un test "End-to-end" sur le parcours employé sur Word

> Pour voir le taux du code coverage:

```cmd
http://127.0.0.1:8080/coverage/lcov-report/
```

---

## Commandes utiles:

### 1. Front-end

Pour démarrer le serveur Front-end

```cmd
live-server
```

Pour tester _un seul_ fichier sur Jest en affichant les valeurs du `console.log()`

```cmd
npm run test -- [FILE].js --silent=false --coverage=false
```

Pour tester _tous_ les fichiers sur Jest

```cmd
npm run test
```

### 2. Back-end

Pour démarrer le serveur Back-end

```cmd
npm run nodemon
```
