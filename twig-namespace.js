const path = require('path');

module.exports = {
    default: {
        '@': path.resolve(__dirname, "src"),
        '@partials': path.resolve(__dirname, "src/templates/partials"),
        '@components': path.resolve(__dirname, "src/templates/components")
    }
}