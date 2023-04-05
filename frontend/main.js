/*Skapa en frontend där du skapar en klasslista där du skriver ut samtliga elever.
(Extra) Skapa funktionalitet (i frontend) för att filtrera listan baserat på utbildning.
(Extra) Skapa funktionalitet (i frontend) för att sortera klasslistan baserat på ålder (stigande och fallande).*/

let studentDiv = document.querySelector(".allStudents");
let select = document.querySelector(".select");
let sortByAgeSelect = document.querySelector(".sortByAge");

let getData = async (url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data.data;
};


let byEducation;


let renderShoolInfo = (school) => {
    let schoolName = document.querySelector("#schoolName");
    let contactEmail = document.querySelector("#contactEmail");
    let amountOfStudents = document.querySelector("#amountOfStudents");
    let location = document.querySelector("#location");

    schoolName.innerText = school.attributes.name + "-" + school.attributes.motto;
    contactEmail.innerText = school.attributes.contactEmail;
    amountOfStudents.innerText = school.attributes.numberOfStudents;
    location.innerText = school.attributes.location.city + ", " + school.attributes.location.country;

}

let getSchool = async () => {
    const school = await getData("http://localhost:1337/api/school?populate=*");
    renderShoolInfo(school);
}

getSchool();



select.addEventListener("change", async (e) => {
    const studentInfo = await getData("http://localhost:1337/api/students?populate=*");
    console.log(studentInfo)

    if (select.value === "Alla") {
        byEducation = studentInfo
        renderStudents(studentInfo)
    } else {
        byEducation = studentInfo.filter((student) => student.attributes.Education === e.target.value);
        renderStudents(byEducation)
    }

    sortByAgeSelect.addEventListener("change", () => {
        if (sortByAgeSelect.value === "Oldest to youngest") {
            byEducation.sort((a, b) => b.attributes.Age - a.attributes.Age);
            renderStudents(byEducation);
        } else if (sortByAgeSelect.value === "Youngest to oldest") {
            byEducation.sort((a, b) => a.attributes.Age - b.attributes.Age);
            renderStudents(byEducation);
        }
    })
})



let renderStudents = (students) => {
    studentDiv.innerHTML = "";

    students.forEach((student) => {
        let { Firstname, Surname, Age, Education, courses, teacher } = student.attributes;
        let allCourses = "";
        courses.forEach((course => allCourses += course.name + " "));
        let infoDiv = document.createElement("div")
        infoDiv.innerHTML = `
        Namn: ${Firstname} ${Surname}<br> 
        Ålder: ${Age}<br> 
        Utbildning: ${Education}<br>
        Courses: ${allCourses}<br>
        Teacher: ${teacher.data?.attributes.name ? teacher.data?.attributes.name : "Ingen lärare"}
        `
        studentDiv.append(infoDiv);
    });

}

