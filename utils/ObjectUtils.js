module.exports = {
    isNonEmptyObject: function(obj) {
        
    },
    isEmptyObject: function(obj) {
        if (typeof obj === "undefined" || obj === null || Object.keys(obj).length === 0) {
            return true;
        }
        return false;
    },
    isEmptyString(str) {
        if (typeof str === "undefined" || str === null || str.trim().length === 0) {
            return true;
        }
        return false;
    }    
}