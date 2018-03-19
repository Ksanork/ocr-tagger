import DBO from '../models/DBO'
import config from '../config'

let dbo = new DBO(config.mongo_url);

dbo.removeAll(() => {
    // console.log("?");
    dbo.addUser("admin", "admin", true, () => {});
});

// dbo.checkIfUserExists("karol", (status) => {
//     console.log(status ? "istnieje" : "nie istnieje");
// });

// process.exit();