// implement your posts router here
const express = require("express");
const router = express.Router();

const Post = require('./posts-model')

// Get all
router.get('/', (req, res) => {
    Post.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        console.error(err.message);
        res.status(500).json({ message: "The posts information could not be retrieved" })
    })
});

// Get by id
router.get('/:id', (req, res) => {
    const {id} = req.params;

    Post.findById(id)
    .then(post => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    })
    .catch(err => {
        console.error(err.message);
        res.status(500).json({ message: "The post information could not be retrieved" })
    })
})

// Create Post
router.post('/', (req, res) => {
    const post = req.body;

    if( !post.title || !post.contents ) {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    } else {
        Post.insert(post)
            .then(p => {
                res.status(201).json({p});
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).json({ message: "There was an error while saving the post to the database" });
            });
    }
});

// Update Post
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const post = req.body;

    Post.update(id, post)
        .then(p => {
            if(!p) {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            } else if ( !post.title || !post.contents ) {
                res.status(400).json({ message: "Please provide title and contents for the post" });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).json({ message: "The post information could not be modified" });
        })
});

// Delete post
router.delete('/:id', (req, res) => {
    const {id} = req.params;

    Post.remove(id)
        .then(p => {
            if(p) {
                res.status(200).json(p);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            }
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).json({ message: "The post could not be removed" });
        })
});

// Get comments
router.get('/:id/comments', (req, res) => {
    const {id} = req.params;

    Post.findPostComments(id)
        .then(p => {
            if(!p) {
                res.status(404).json({ message: "The post with the specified ID does not exist" });
            } else {
                res.status(200).json(p);
            }
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).json({ message: "The comments information could not be retrieved" });
        })
});


module.exports = router;