import * as es from "./index"

import readline from "readline"
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//To get your authtoken type:
//localStorage.ESAuthToken
//in the console in enriching students
const client = new es.Client("YOUR ENRICHING STUDENTS AUTH TOKEN HERE")
function init() {
    rl.question("Get Courses or Schedule Courses?\n0 > Get Courses\n1 > Schedule Flex Mods\n\n", (get_sche: string) => {
        if(get_sche.includes("1")) {
            rl.question("Which mod: ", (mod: string) => {
                console.log("Waiting on the Enriching Student's Server")
                let slot: any = es.ModSlot.getMod(Number.parseInt(mod) + 9);
                if(slot instanceof es.ModSlot) {
                    client.getScheduleList(es.EnrichedDate.getDate("monday"), slot).then((json: any) => {
                        console.log("Parsing results...")
                        if(json.courseListStatusId == 4) {
                            console.log("This mod is scheduled already by a teacher");
                            init();
                        }
    
                        let cs = es.toScheduleableList(json, slot)
                        for(let i = 0; i < cs.length; i++) {
                            console.log(i + ">" + cs[i].course.toString())
                        }
                        rl.question("Which class: ", (res: string) => {
                            client.scheduleMod(cs[Number.parseInt(res)]).then((json: any) => {
                                console.log(json);
                            })
                        })
                    })
                }
            })
        }else{
            rl.question("What day?", (day: string) => {
                let date = new es.EnrichedDate(new Date());
                if(day == "today") {
                }else {
                    date = es.EnrichedDate.getDate(day);
                }
                console.log("Waiting on Enriching Students...")
                client.getMods(date).then((json: any) => {
                    let cs: Array<es.Course> = es.toCourseList(json);
                    cs.forEach((course: es.Course) => {
                        console.log(course.toString())
                    });
                    init();
                })
            } )
        }
    })
}
init();
