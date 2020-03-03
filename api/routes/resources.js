const express = require('express');
const router = express.Router();
const multer = require('multer');

const ResourcesController = require('../controllers/resources');
const checkAuth = require('../auth/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const uploadPath = './uploads/';

        cb(null, uploadPath);
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') ? cb(null, true) : cb(null, false);

    // Could pass new Error instead of null on false
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// routes

router.get('/', ResourcesController.get_all_resources);

router.get('/:resourceId', ResourcesController.get_single_resource);

router.post('/', upload.single('resourceFile'), ResourcesController.create_resource);

router.patch('/:resourceId', checkAuth, ResourcesController.update_resource);

router.delete('/:resourceId', checkAuth, ResourcesController.delete_resource);

module.exports = router;