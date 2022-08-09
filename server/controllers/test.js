let students = [
    {
        fname : "Rohan",
        lname : "Dalal",
        age : 19
    },

    {
        fname : "Zain",
        lname : "Ahmed",
        age : 21
    },

    {
        fname : "Anadi",
        lname : "Malhotra",
        age : 16
    },

    {
        fname : "Anad",
        lname : "Malhotr",
        age : 26
    },

    {
        fname : "Ana",
        lname : "Malhot",
        age : 38
    },

    {
        fname : "An",
        lname : "Malh",
        age : 12
    }
];

//students.sort((a, b) => {
//    return a.fname - b.fname;
//});
//students.sort((a, b) => (a.fname > b.fname) ? 1 : -1);

students.sort((a, b) => (a.age > b.age) ? 1 : -1);

console.log(students);