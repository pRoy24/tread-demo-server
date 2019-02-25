module.exports = {
    isNonEmptyObject: function(obj) {
        if (typeof obj === "undefined" || obj === null || Object.keys(obj).length === 0) {
            return false;
        }
        return true;        
    },
    isEmptyObject: function(obj) {
        if (typeof obj === "undefined" || obj === null || Object.keys(obj).length === 0) {
            return true;
        }
        return false;
    },
    isEmptyString: function(str) {
        if (typeof str === "undefined" || str === null || str.trim().length === 0) {
            return true;
        }
        return false;
    },
    isNonEmptyArray: function(arr) {
        if (typeof arr === "undefined" || arr === null || arr.length === 0) {
            return false;
        }
        return true;        
    }
}