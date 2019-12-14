export default function (id = '', action) {

    if (action.type == 'getID') {
        var newID = action.id;
        return newID;
    } else {
        return id;
    }
}