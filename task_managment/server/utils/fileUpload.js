var path=require('path');
var multer  = require('multer')

var storage=multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, path.basename(file.originalname,path.extname(file.originalname))+ '-' + Date.now()+path.extname(file.originalname))
  }
});
module.exports = multer({storage:storage});