function contains(obj, key, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].key === obj.key) {
            return true;
        }
    }
    return false;
}

module.exports = contains;
/* let Article1 = {
    title: "title1"
}
let Article3 = {
    title: "title3"
}
let Article17 = {
    title: "title17"
}
let Article18 = {
    title: "title17"
}
let Article6 = {
    title: "title6"
}

const dbHeadlines = [Article1, Article3, Article18]
const newHeadlines = [Article6, Article1, Article17]

console.log(contains(Article18, Article18.title, newHeadlines)) */