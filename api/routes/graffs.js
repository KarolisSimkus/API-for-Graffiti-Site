const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkToken = require('../middleware/check-auth');
const GraffController = require('../controllers/graffs');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads/");
    },
    filename:function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
});

const fileFilters = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits:{ fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilters

}).single('image');

router.get('/', GraffController.get_all_graff);

router.post('/', checkToken, upload, GraffController.create_new_graff);

router.get('/:graffId', GraffController.get_graff);

router.patch('/:graffId', checkToken, GraffController.patch_graff);

router.delete('/:graffId', checkToken, GraffController.delete_graff);

module.exports = router;