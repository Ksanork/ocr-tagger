import DBO from '../models/DBO'
import config from '../config'

let dbo = new DBO(config.mongo_url);

// dbo.getDatasetsWithCounts((datasets) => {
//     datasets.forEach((dataset) => {
//        console.log(dataset.name + " - " + dataset.countAll);
//     });
// });

dbo.getNextDatasetImage("5ab01f20e539e13a606661ab", (image) => {
   console.log(image);
});

// dbo.checkIfUserExists("karol", (status) => {
//     console.log(status ? "istnieje" : "nie istnieje");
// });

// process.exit();