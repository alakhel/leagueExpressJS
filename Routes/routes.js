const express = require('express');
const router = express.Router();
const { homePage, logMe } = require('../Controllers/home')
const { addTeam, addTeam_, readTeam, deleteTeam } = require('../Controllers/team');
const { newMatch, readMatch } = require('../Controllers/match');
const { verifyAuth, refresh_session } = require('../Config/auth');


router.get('/', homePage);
router.get('/readTeam', verifyAuth, readTeam);
router.get('/delete/:teamName', verifyAuth, deleteTeam);
router.get('/readMatch', readMatch);
router.get('/refresh_session', verifyAuth, refresh_session)

router.post('/logMe', logMe);
router.post('/addTeam_'/*, verifyAuth*/, addTeam_);
router.post('/addTeam', addTeam);
router.post('/newMatch', verifyAuth, newMatch); // would add a verificator if he can create match even if loggedin

module.exports = router;
