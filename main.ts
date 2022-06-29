import { School } from "./entities";
import { getRandomValueFromArray } from "./helpers";
import { getClassYoungestStudentFullNameByDate,getYoungestStudentByAge, initializeSchool,initializeRandomSchool, printSchool, transferStudent } from "./services";

//const school: School = initializeSchool();

const randomSchool: School = initializeRandomSchool();

printSchool(randomSchool);


console.log("============");
randomSchool.classes.forEach(clas => {
    console.log(getClassYoungestStudentFullNameByDate(clas));
    console.log("============");
    
});
//console.log(getClassYoungestStudentFullName(randomSchool.classes[0]));

/*console.log("============");

console.log("============");
randomSchool.classes.forEach(clas => {
    console.log(getYoungestStudentByAge(clas));
    console.log("============");
    
});*/

transferStudent(randomSchool.classes[0].students[1].fullName(),randomSchool.classes[0],randomSchool.classes[1]);

printSchool(randomSchool);