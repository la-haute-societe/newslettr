var crypto = require('crypto');

module.exports = function (obj) {

    var pad = crypto.randomBytes(10).toString('hex');
    obj.subject += ' - ' + pad;
  
    if (obj.headers && typeof obj.headers === 'object') {
        obj.headers['In-Reply-To'] =  "<" + pad + ">";
    } else {
      obj.headers = obj.headers || "";
      obj.headers += "\nIn-Reply-To: <" + pad + ">";
    }
    return obj;
}
