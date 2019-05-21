const express = require('express');
const {body, validationResult} = require('express-validator/check/index');
const database = require('../../controller/db_controller');
const router = express.Router();

router.get('/getAll/:userId([0-9]+)',  async (req, res, next) => {
    try {
        const data = await database.dbInterface.getSubjects(req.params.userId);
        res.json({ data });
    } catch (e) {
        next({message: 'Something went wrong'});
    }
});

router.get('/:id([0-9]+)', async (req, res, next) => {
    const subject = await database.dbInterface.getSubject(req.params.id);
    res.render('edit', {
        subject: subject[0].dataValues
    })
});

router.post('/', [
    body('subjectName')
        .isLength({min: 1}),
    body('userId')
        .isLength({min: 1}),
], async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const data = await database.dbInterface.addSubject(req.subjectName, req.userId);
            res.json({data});
        } catch (e) {
            next({message: 'Something went wrong'});
        }
    } else {
        res.render('Subject', {
            title: 'Subject Error',
            errors: errors.array(),
            data: req.body,
        })
    }
});

router.post('/update', [
    body('subjectName')
        .isLength({min: 1}),
    body('subjectId')
        .isLength({min: 1}),
], async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        try {
            const data = await database.dbInterface.updateSubject(req.body.subjectName, req.body.subjectId);
            res.redirect('/home')
        } catch (e) {
            next({message: 'Something went wrong'});
        }
    } else {
        res.render('error', {
            title: 'Subject Error',
            errors: errors.array(),
            data: req.body,
        })
    }
});

router.get('/delete/:id([0-9]+)', async (req, res, next) => {
    try {
        console.log(req.params.id)
        await database.dbInterface.deleteSubject(req.params.id);
        res.redirect('/home');
    } catch (e) {
        next({message: 'Something went wrong'});
    }
});


module.exports = router;
