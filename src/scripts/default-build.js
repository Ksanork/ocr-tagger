import fs from 'fs';

import DBO from '../models/DBO'
import config from '../config'

let dbo = new DBO(config.mongo_url);

dbo.removeAll(() => {
    dbo.addUser("admin", "admin", true, () => {});

    deleteFolderRecursive("../../../dataset-images");
    fs.mkdirSync("../../..//dataset-images");

    dbo.addNewProblem("Obraz jest źle przycięty", "Zgłoś źle przycięte zdjęcie", () => {});
    dbo.addNewProblem("Obraz jest nieczytelny", "Zgłoś nieczytelne zdjęcie", () => {});
    dbo.addNewProblem("Obraz nie pasuje do zbioru", "Zgłoś niepasujące zdjęcie", () => {});
});

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;

            console.log(curPath);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};