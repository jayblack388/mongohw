function contains(obj, key, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].key === obj.key) {
            return true;
        }
    }
    return false;
}

module.exports = contains;