import express from 'express';
let router = express.Router();

router.get('/', (req, res) => {
    res.render("main");
});

export default router;