const fs = require('fs');
fs.writeFileSync('hello.txt','Hello world nodejs');
// console.log(fs);

// core syntaxe
var name = 'nyira';
var age = 30;
var hobbie = "Music";

const  mySummary = (username,myage,myhobbies) => {
    return (
        'my name is : '
        +username+
        ' I am '
        +myage+
        ' years old and my hobbies is '
        +myhobbies
    )
}

const add = (a,b) => {
    return a+b;
}
console.log(add(1,2));

const addOne = a => a + 1
console.log(addOne(22));

console.log(mySummary(name,age,hobbie));

//........................................................................

//array,objects and references
let  hobbies = ['music','predications'];
 for(let hobby of hobbies){
    console.log(hobby);
}

console.log(hobbies.map(hobby => 'Hobby : ' + hobby));

// references type add to the array using push function
hobbies.push('prayer');
console.log(hobbies);
// ...........................................................................

//Spread and Rest Operators understanding

//copy an array differents methods
const copyArray = hobbies.slice();
console.log(copyArray);

// nested array in array
const copyArray2 = [hobbies]; 
console.log(copyArray2);

//spread operators works for both copy an array or an object
const copyArray3 = [...hobbies];
console.log(copyArray3);

//A rest operators
const toArray = (...args) => {
    return args;
}
console.log(toArray(1,2,3,3));
//...........................................................................

//Destructring
let person = {
    age:"30",
    name:"Nyira",
    getName(){
        console.log("My name is " + this.name);
    }
}
console.log(person.getName());

const printName = (personData) => {
    console.log(personData.name);
}
console.log(printName(person));

