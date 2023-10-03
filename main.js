
import { compareAsc, format } from 'date-fns'

const getButton = document.querySelector(".get");
const createButton = document.querySelector(".create");

getButton.addEventListener("click", handleGetButton);
createButton.addEventListener("click", handleCreateButton);

const workingData = [
    {
        "label": "test one",
        "description": "description test one",
        "start_date": "2022-01-01T15:00:00Z",
        "end_date": ""
    },
    {
        "label": "test twoo",
        "description": "description test twoo",
        "start_date": "2022-02-01T15:00:00Z",
        "end_date": ""
    },
    {
        "label": "test three",
        "description": "description test three",
        "start_date": "2022-03-01T15:00:00Z",
        "end_date": ""
    },
    {
        "label": "test for and last",
        "description": "description test for and last",
        "start_date": "2022-04-01T15:00:00Z",
        "end_date": ""
    },
    {
        "label": "test five with end_date",
        "description": "description test five",
        "start_date": "2022-06-01T15:00:00Z",
        "end_date": ""
    },
    {
        "label": "test six with end_date real",
        "description": "description test six",
        "start_date": "2022-06-01T15:00:00Z",
        "end_date": ""
    }
]


function handleGetButton( event ){
    console.log("ok click");


    fetch("http://localhost:9000/v1/tasks", {
        method: "GET",
        mode: "cors"
    })
    .then(response => response.json())
    .then(response => console.log(response))

}

function handleCreateButton( event ){
    console.log("ok click");

    fetch("http://localhost:9000/v1/tasks", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
            label: "test six with end_date real",
            description: "description test six",
            start_date: "2022-06-01T15:00:00Z",
            // end_date: "2022-07-01T15:00:00Z",
            // end_date only works for an updateTask
        })
    })
    .then(data => {
        console.log("data : ", data)
    })


}




format(new Date(2014, 1, 11), 'yyyy-MM-dd')
//=> '2014-02-11'

const dates = [
    new Date(1995, 6, 2),
    new Date(1987, 1, 11),
    new Date(1989, 6, 10),
]

console.log("test date sorting : ", dates.sort(compareAsc));
