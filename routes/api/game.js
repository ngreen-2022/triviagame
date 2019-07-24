const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const uuidv4 = require('uuid/v4');
const axios = require('axios');
const Game = require('../../models/Game');

// @route  GET api/game
// @desc   Get current games
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const games = await Game.find().populate();
    return res.json(games);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/game/:id
// @desc   Get game by id
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) return res.status(400).json({ msg: 'Game not found' });

    res.json(game);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Game not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route  POST api/game
// @desc   Create a new game room
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('isPublic', 'Public/Private Required')
        .not()
        .isEmpty(),
      check('roomName', 'Must provide a room name')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // create the game information
      const gameFields = {};
      const isPublic = req.body.isPublic === true;
      gameFields.isPublic = isPublic;
      gameFields.isPlaying = false;
      gameFields.curQuestion = {};
      gameFields.roomName = req.body.roomName;
      gameFields.owner = req.user.id;
      // push the creator userId onto the currentusers field
      gameFields.players = [{ playerId: req.user.id }];

      // create new game and save to database
      game = new Game(gameFields);
      await game.save();
      res.json(game);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route  PUT /api/game/:id
// @desc   Update Score
// @access Private
router.put('/update/:id', auth, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);

    if (!game) return res.status(400).json({ msg: 'Game not found ' });

    const { score } = req.body;

    game = await Game.findOneAndUpdate(
      { 'players.playerId': req.user.id },
      {
        $set: {
          'players.$.playerId': req.user.id,
          'players.$.score': score
        }
      },
      { new: true }
    );

    return res.json(game);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  PUT /api/game/:id
// @desc   Add Player to Room
// @access Private
router.put('/join/:id', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) return res.status(400).json({ msg: 'Game not found ' });

    game.players.push({ playerId: req.user.id });

    await game.save();
    return res.json(game);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  PUT /api/game/:id
// @desc   Update the current question
// @access Private
router.put('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    const question = await axios.get('http://jservice.io/api/random');

    game.curQuestion = question.data[0];
    await game.save();
    return res.json(game);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/game/:id
// @desc   Delete Game Session
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }

    // Check that user is game owner
    if (game.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await game.remove();

    res.json({ msg: 'Game removed' });
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Game not found' });
    }
  }
});

module.exports = router;
