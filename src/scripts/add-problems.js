/*
    node dist/src/scripts/add-admins.js
 */

import DBO from '../models/DBO'
import config from '../config'

let dbo = new DBO(config.mongo_url);

dbo.addNewProblem("Obraz źle przycięty", "Zgłoś źle przycięte zdjęcie", () => {});
dbo.addNewProblem("Obraz jest nieczytelny", "Zgłoś nieczytelne zdjęcie", () => {});
dbo.addNewProblem("Obraz nie pasuje do zbioru", "Zgłoś niepasujące zdjęcie", () => {});

// process.exit();