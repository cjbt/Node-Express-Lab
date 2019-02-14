const express = require('express');
const db = require('../data/db');
const router = express.Router();

router.post('/', (req, res) => {
  const posts = req.body;
  db.insert(posts)
    .then(post => {
      if (!post) {
        res.status(500).json({
          error: 'There was an error while saving the post to the database'
        });
      } else {
        res.status(201).json(post);
      }
    })
    .catch(() => {
      res.status(400).json({
        errorMessage: 'Please provide title and contents for the post.'
      });
    });
});

router.get('/', (req, res) => {
  db.find()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: 'The posts infomation could not be retrieved.' });
    });
});

router.get('/:id', (req, res) => {
  const postId = req.params.id;

  return db
    .findById(postId)
    .then(post => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: 'the user with the specified ID does not exist.' });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' });
    });
});

router.delete('/:id', (req, res) => {
  const postId = req.params.id;

  db.findById(postId)
    .then(post => {
      db.remove(postId)
        .then(() => {
          res.status(200).json(post);
        })
        .catch(() => {
          res.status(500).json({ error: 'The post could not be removed' });
        });
    })
    .catch(() => {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    });
});

router.put('/:id', (req, res) => {
  const postId = req.params.id;
  const body = req.body;

  db.findById(postId)
    .then(post => {
      console.log(post[0].title);
      if (!post[0].title || !post[0].contents) {
        res.status(400).json({
          errorMessage: 'Please provide title and contents for the post.'
        });
      } else {
        db.update(postId, body)
          .then(() => {
            db.findById(postId)
              .then(updatedPost => {
                res.status(200).json(updatedPost);
              })
              .catch(() => {
                res.status(404).json({
                  message: 'The post with the specified ID does not exist'
                });
              });
          })
          .catch(() => {
            res
              .status(500)
              .json({ error: 'The post information could not be modified.' });
          });
      }
    })
    .catch(() => {
      console.log(postId);
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    });
});

module.exports = router;
