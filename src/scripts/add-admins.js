/*
    node dist/src/scripts/add-admins.js
 */

import DBO from '../models/DBO'
import config from '../config'

let dbo = new DBO(config.mongo_url);

dbo.addUser("admin", "admin");

// process.exit();