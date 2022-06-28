// Ideas:
// Build dynamically created classmates: collection of first names, collection of lastnames, randomly pick birth date

import { firstNamesM, firstNamesF, Geography, lastNamesM,lastNamesF, Mathematics,classNames } from "./constants";
import { Classroom, School, Student, Teacher } from "./entities";
import { getFullName, getRandomBirthDate, getRandomValueFromArray } from "./helpers";
import * as _ from "underscore";
import { indexOf, lastIndexOf, property, random } from "underscore";

export function initializeSchool(): School {
    const student1: Student = createStudent(getRandomValueFromArray(firstNamesM), getRandomValueFromArray(lastNamesM), getRandomBirthDate());
    const student2: Student = createStudent(getRandomValueFromArray(firstNamesF), getRandomValueFromArray(lastNamesF), getRandomBirthDate());
    const student3: Student = createStudent(getRandomValueFromArray(firstNamesM), getRandomValueFromArray(lastNamesM), getRandomBirthDate());
    const student4: Student = createStudent(getRandomValueFromArray(firstNamesF), getRandomValueFromArray(lastNamesF), getRandomBirthDate());
    const student9: Student = createStudent(getRandomValueFromArray(firstNamesM), getRandomValueFromArray(lastNamesM), getRandomBirthDate());

    const teacher1: Teacher = createTeacher(getRandomValueFromArray(firstNamesF), getRandomValueFromArray(lastNamesF), [Mathematics]);

    const student5: Student = createStudent(getRandomValueFromArray(firstNamesF), getRandomValueFromArray(lastNamesF), getRandomBirthDate());
    const student6: Student = createStudent(getRandomValueFromArray(firstNamesM), getRandomValueFromArray(lastNamesM), getRandomBirthDate());
    const student7: Student = createStudent(getRandomValueFromArray(firstNamesF), getRandomValueFromArray(lastNamesF), getRandomBirthDate());
    const student8: Student = createStudent(getRandomValueFromArray(firstNamesM), getRandomValueFromArray(lastNamesM), getRandomBirthDate());

    const teacher2: Teacher = createTeacher(getRandomValueFromArray(firstNamesF), getRandomValueFromArray(lastNamesF), [Geography]);

    const mathClass: Classroom = createClassroom("Math", teacher1, [student1, student2, student3, student4, student9]);
    const geographyClass: Classroom = createClassroom("Geography", teacher2, [student5, student6, student7, student8]);

    const school:School = 
    {
        name: "Big school",
        address: "Moscow",
        phone: "+7 (916) 000 12 21",
        classes: [
            mathClass,
            geographyClass
        ]
    }

    school.classes = _.sortBy(school.classes,"name")
    school.classes.forEach(classes => {
        classes.students = _.sortBy(_.sortBy(classes.students, 'firstName'),'lastName');
    });
    return school;
    
}

//Creating randomized school
export function initializeRandomSchool(): School {
    const randomNumberOfClasses:number = Math.ceil(Math.random()*6);  //randomizing number of classes (from 1 up to 6)
    let arrayOfClasses: Classroom[] = [];       
    for(let indexOfClass:number=0;indexOfClass <= randomNumberOfClasses; indexOfClass++)
    {
        //random teacher
        let teacher: Teacher;

        //Having two sets of name pairs(first last names) for male and female randomaizing creating teacher to use one or another
        if(Math.random() < 0.5){
        teacher = createTeacher(getRandomValueFromArray(firstNamesM), getRandomValueFromArray(lastNamesM), [getRandomValueFromArray(classNames),getRandomValueFromArray(classNames)]); 
        }
        else
        {
        teacher = createTeacher(getRandomValueFromArray(firstNamesF), getRandomValueFromArray(lastNamesF), [getRandomValueFromArray(classNames),getRandomValueFromArray(classNames)]); 
        }
        //random class name from teacher professions to prevent classes with teachers of wrong profession
        const className:string = getRandomValueFromArray(teacher.professions);
        //randomizing number of students (from 1 up to 30)
        const randomNumberOfStudents:number = Math.ceil(Math.random()*30);
        let arrayOfStudentsInClass:Student[] = [];
        for(let indexOfStudent:number=0;indexOfStudent <= randomNumberOfStudents; indexOfStudent++)
        {
            let student:Student;
            if(Math.random() < 0.5)
            {
             student = createStudent(getRandomValueFromArray(firstNamesM), getRandomValueFromArray(lastNamesM), getRandomBirthDate());
            }
            else
            {
             student = createStudent(getRandomValueFromArray(firstNamesF), getRandomValueFromArray(lastNamesF), getRandomBirthDate());

            }
            arrayOfStudentsInClass.push(student);
            
        }
        const newClass:Classroom = createClassroom(className,teacher,arrayOfStudentsInClass);
        arrayOfClasses.push(newClass);

    }



    const school:School = 
    {
        name: "Big school",
        address: "Moscow",
        phone: "+7 (916) 000 12 21",
        classes: arrayOfClasses
    }

    school.classes = _.sortBy(school.classes,"name")  //sorting classes[] by name
    school.classes.forEach(classes => {
        classes.students = _.sortBy(_.sortBy(classes.students, 'firstName'),'lastName');  //sorting students in each class
    });
    return school;



}

function createTeacher(firstName: string, lastName: string, professions: string[]): Teacher {
    return {
        firstName: firstName,
        lastName: lastName,
        fullName: () => {return getFullName(firstName,lastName)},
        professions: professions
    };
}


function createStudent(firstName: string, lastName: string, birthDate: Date): Student {
    return {
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        fullName: () => {return getFullName(firstName,lastName)},
        age: () => {
            const ageDifferenceInMilliseconds = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDifferenceInMilliseconds); // miliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        
        }
    };
}

function createClassroom(name: string, teacher: Teacher, students: Student[]): Classroom {
    return {
        name: name,
        teacher: teacher, 
        students: students
    };
}

export function getClassYoungestStudentFullNameByDate(classroom: Classroom): string {
    if(classroom.students.length == 0) //For the empty class
    {
        return `There's no students in the in ${classroom.name} class`;
    }
    else if(classroom.students.length == 1) //For one student in the class
    {
        return `Youngest student in ${classroom.name} class: ${classroom.students[0].fullName()}`
    }
    else
    {
        let sortedClass = _.sortBy(classroom.students, "birthDate").reverse();
        let maxDate = sortedClass[0].birthDate.getTime() //Getting max date of birth (the youngest student has it)
        //Count students with the same max date of birth
        let count = sortedClass.filter(function(sortedClass){return sortedClass.birthDate.getTime() == maxDate})
        if(count.length == 1)
        {
            return `Youngest student in ${classroom.name} class: ${sortedClass[0].fullName()}`
        }
        else
        {
            //In case there are two or more student born in one day
            let reply:string = `These students are the youngest in ${classroom.name} class: `;
            sortedClass.forEach(student => {
                if(sortedClass[0].birthDate.getTime() == student.birthDate.getTime())
                {reply +=` ${student.fullName()} /`}        //adding every youngest student to reply string 
            });          
            return reply.slice(0,-1); //deleting last "/" and return 
        }
    }


    
}

export function getYoungestStudentByAge(classroom:Classroom):string{
    if(classroom.students.length == 0) //For the empty class
    {
        return `There's no students in the in ${classroom.name} class`;
    }
    else if(classroom.students.length == 1) //For one student in the class
    {
        return `Youngest student in ${classroom.name} class: ${classroom.students[0].fullName()}`
    }
    else
    {
        for (let i:number = 0; i<classroom.students.length-1; i++){
            for(let j:number=0;j<classroom.students.length-1-i;j++){
                if(classroom.students[j+1].age()<classroom.students[j].age()){
                    let stud:Student = classroom.students[j+1]; classroom.students[j+1]=classroom.students[j]; classroom.students[j]=stud;
                }
            }
        }
        let minAge = classroom.students[0].age() //Getting min age (the youngest student has it)
        //Count students with the same min age
        let count = classroom.students.filter(function(sortedClass){return sortedClass.age() == minAge})
        if(count.length == 1)
        {
            return `Youngest student in ${classroom.name} class: ${classroom.students[0].fullName()}`
        }
        else
        {
            //In case there are two or more student born in one day
            let reply:string = `These students are the youngest in ${classroom.name} class: `;
            classroom.students.forEach(student => {
                if(classroom.students[0].age() == student.age())
                {reply +=` ${student.fullName()} /`}        //adding every youngest student to reply string 
            });          
            return reply.slice(0,-1); //deleting last "/" and return 
        }
    }
}

export function printSchool(school: School): void {
    console.log("School data:");
    console.log("============");
    console.log(school.name);
    console.log(school.address);
    console.log(school.phone);
    console.log("Classes");
    console.log("============");
    school.classes.forEach( function eachClass (classes,classNumber) {

        console.log(`Class ${classNumber+1}: ${classes.name}`);
        console.log(`Teacher: ${classes.teacher.fullName()}, Professions: ${classes.teacher.professions.join(", ")}`);
        console.log("Students: ");

        classes.students.forEach(function eachStudent (student, studentNumber) {

            console.log(`${studentNumber+1}: ${student.fullName()} : ${student.age()}`);
            

        });
    console.log("============");

        
        
    })
    
}

export function transferStudent(fullName: string, fromClassroom: Classroom, toClassrom: Classroom): void{

    const indexOfStudent:number = fromClassroom.students.findIndex(i => i.fullName() === fullName); //Gettig index of a student to transfer
    toClassrom.students.push(fromClassroom.students[indexOfStudent]);  //Pushing him to another class
    fromClassroom.students.splice(indexOfStudent,1); //Deleting student from an old class
    toClassrom.students = _.sortBy(_.sortBy(toClassrom.students, 'firstName'),'lastName'); //sorting class with a new student

}