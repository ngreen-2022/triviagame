const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// IMPORTANT: Whenever using a mongoose method, you have to use await, because it returns a promise

// @route  GET api/profile/me
// @desc   Get current users profile
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    // user we are grabbing from profile model user field... we also want to populate with name/user which are in user, not profile. Use method populate to add this to query. "populate from user", "fields to bring in"
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route  POST api/profile
// @desc   Create/Update user profile
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty()
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      location,
      bio,
      status,
      facebook,
      twitter,
      instagram,
      highScore
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (highScore) profileFields.highScore = highScore;

    // Build social object
    profileFields.social = {};
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route POST api/profile/add_friend/:user_id
// @desc Add a Friend
// @access Private
router.post('/addfriend/:user_id', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    //We need to get the userId of the friend from somwhere
    if (!profile) {
      return res.status(500).send('No Profile Found');
    }

    profile.friends.push(req.params.user_id);

    // Need to add friend both ways
    let profileTwo = await Profile.findOne({ user: req.params.user_id });
    profileTwo.friends.push(req.user.id);
    await profileTwo.save();

    await profile.save();
    // RETURNS THE USER THAT MADE THE FRIEND REQUEST BACK
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/profile/delete_friend/:user_id
// @desc Remove a friend
// @access Private
router.delete('/delete_friend/:user_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.friends
      .map(friend => friend.id)
      .indexOf(req.params.user_id);
    profile.friends.splice(removeIndex, 1);
    await profile.save();

    // Need to remove friend from both
    const profileTwo = await Profile.findOne({ user: req.params.user_id });
    const removeIndexTwo = profileTwo.friends
      .map(friend => friend.id)
      .indexOf(req.user.id);
    profileTwo.friends.splice(removeIndexTwo, 1);
    await profileTwo.save();

    // THIS RETURNS THE USER THAT MADE THE DELETE REQUESTS PROFILE
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/profile
// @desc   Get all profiles
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user id
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/profile
// @desc   Delete profile, user and posts
// @access Private
router.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users posts
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
