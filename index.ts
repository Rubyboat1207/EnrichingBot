import fetch from 'cross-fetch';
import readline from "readline"
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Client {
    auth: string;

    public constructor(auth: string) {
        this.auth = auth;
    }

    //Returns a list of Mods on that date
    public async getMods(date: EnrichedDate) {
        return fetch(
            "https://student.enrichingstudents.com/v1.0/appointment/viewschedules",
            {
              headers: {
                accept: "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
                esauthtoken:
                  this.auth
              },
              body: '{"startDate":"' + date.toString() + '"}',
              method: "POST",
            }
        ).then(async (response: any) => {
            return response.json()
        });
    }
    //Returns schedulable mods for a date and modslot
    public getScheduleList(date: EnrichedDate, slot: ModSlot) {
        return fetch(
            "https://student.enrichingstudents.com/v1.0/course/forstudentscheduling",
            {
              headers: {
                accept: "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
                esauthtoken:
                  this.auth
              },
              body: "{\"periodId\":"+ slot.id +",\"startDate\":\""+ date.toString() +"\"}",
              method: "POST",
            }
        ).then(async (response: any) => {
            return response.json()
        });
    }

    public scheduleMod(mod: Mod) {  
        return fetch(
            "https://student.enrichingstudents.com/v1.0/appointment/save",
            {
              headers: {
                accept: "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
                esauthtoken:
                  this.auth
              },
              body: "{\"courseId\":" + mod.course.id + ",\"periodId\":"+mod.course.period_id?.id+",\"scheduleDate\":\"" + mod.date.toString() + "\"}",
              method: "POST",
            }
        ).then(async (response: any) => {
            return response.json()
        });
    }
}

class Mod {
    public course: Course;
    public seats: number;
    public date: EnrichedDate;

    constructor(course: Course, seats: number, date: EnrichedDate) {
        this.course = course;
        this.seats = seats;
        this.date = date;
    }
}

class ModSlot {
    static slotList: Array<ModSlot> = []

    public id: number;
    public name: string;
    constructor(id:number, name:string) {
        this.id = id;
        this.name = name;
        ModSlot.slotList.push(this)
    }
    static MOD1 = new ModSlot(1, "Mod 1");
    static MOD2 = new ModSlot(2, "Mod 2");
    static MOD3 = new ModSlot(3, "Mod 3");
    static MOD4 = new ModSlot(4, "Mod 4");
    static MOD5 = new ModSlot(5, "Mod 5");
    static MOD6 = new ModSlot(6, "Mod 6");
    static MOD7 = new ModSlot(7, "Mod 7");
    static MOD8 = new ModSlot(8, "Mod 8");
    static TITAN_TIME = new ModSlot(9, "Titan Time");
    static FLEX_MOD1 = new ModSlot(10, "Flex Mod 1")
    static FLEX_MOD2 = new ModSlot(11, "Flex Mod 2")
    static FLEX_MOD3 = new ModSlot(12, "Flex Mod 3")
    static FLEX_MOD4 = new ModSlot(13, "Flex Mod 4")
    static FLEX_MOD5 = new ModSlot(14, "Flex Mod 5")
    static LUNCH_1 = new ModSlot(15, "Lunch 12:30-1:00")
    static LUNCH_2 = new ModSlot(16, "Lunch 1:00-1:13")

    static getMod(id: number) {
        for(let i = 0; i < ModSlot.slotList.length; i++) {
            if(ModSlot.slotList[i].id == id) {
                return ModSlot.slotList[i];
            }
        }
        return null;
    }
    
}

class Course {
    constructor() {
        this.room = "";
        this.description = "";
        this.name = "";
        this.facilitator_name = "";
        this.period_id = null;
        this.id = -1;

    }

    room: string;
    description: string;
    name: string;
    facilitator_name: string | null;
    period_id: ModSlot | null;
    id: number;

    public toString() {
        if(this.facilitator_name != "") {
            return this.name + " in " + this.room + " for " + this.period_id?.name + " by " + this.facilitator_name;
        }
        if(this.room != "None") {
            return this.name + " in " + this.room + " for " + this.period_id?.name;
        }
        return this.name + " for " + this.period_id?.name;
    }
}

class EnrichedDate {
    public date: Date;
    toString() {
        return this.date.getFullYear() + "-" + (this.date.getUTCMonth() + 1) + "-" + this.date.getUTCDate()
    }
    static days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

    constructor(date: Date) {
        this.date = date
    }

    public static of(string: string) {
        let date = new Date();
        date.setFullYear(Number.parseInt(string.split("-")[0]))
        date.setMonth(Number.parseInt(string.split("-")[1]) - 1)
        date.setDate(Number.parseInt(string.split("-")[2]))
        return new EnrichedDate(date)
    }

    public static getDate(dotw: string) {
        let date = new EnrichedDate(new Date());
        if(EnrichedDate.days.includes(dotw.toLowerCase())) {
            while(date.date.getDay() != EnrichedDate.days.indexOf(dotw.toLowerCase()) + 1) {
                date.date.setDate(date.date.getDate() + 1)
            }
        }
        return date;
    }
}



function toCourseList(json: any) {
    let courseList: Array<any> = []
    for(let i = 0; i < json[0].details.length; i++) {
        let cc = json[0].details[i];
        let course = new Course();
        course.name = cc.courseName;
        if(course.name == "Open Schedule" || course.name.includes("Blocked for:")) {
            continue;
        }
        course.description = cc.courseDescription
        if(cc.instructorFirstName != undefined) {
            course.facilitator_name = cc.instructorFirstName + " " + cc.instructorLastName
        }
        course.period_id = ModSlot.getMod(cc.periodId);
        course.room = cc.courseRoom;
        course.id = cc.courseId;
        courseList.push(course);
    }
    return courseList;
}
function toScheduleableList(json: any, mod: ModSlot) {
    let courseList: Array<Mod> = []
    for(let i = 0; i < json.courses.length; i++) {
        let cc = json.courses[i];
        if(!cc.isOpenForScheduling || cc.maxNumberStudents <= 0 || cc.courseName == "This course does not allow for student self-scheduling") {
            continue;
        }
        let course = new Course();
        course.name = cc.courseName;
        course.id = cc.courseId;
        course.description = cc.courseDescription
        if(cc.instructorFirstName != undefined) {
            course.facilitator_name = cc.instructorFirstName + " " + cc.instructorLastName
        }
        course.period_id = mod;
        course.room = cc.courseRoom;
        courseList.push(new Mod(course, cc.maxNumberStudents, EnrichedDate.of(cc.scheduleDate.split('T')[0])));
    }
    return courseList;
}

let client = new Client("jjcnwodh2:4;wueiosdzm:326;ksdfjlsnv:1271303;qdjHDnmxadf:X2i4,H-G2gidmBpNdveyLaWxsfYfayd4MTKv3w__;ofu82uicn:X2i4,H-G2ggWmiZ6xOYyTMUFELBkkzvdW0s5ZQ__;kosljsdnc:X2i4,H-G2gjjxyze,kNCxuRf0vBtXYozbynQUw__;^ydh)9xLkxx:X2i4,H-G2gilsNjH4E9y7hbTT7rNQLVkNxJyQw__");

let cs: Array<Mod>;

function query() {
    rl.question("Which mod: ", (mod: string) => {
        console.log("Waiting on the ES Server")
        let slot: any = ModSlot.getMod(Number.parseInt(mod));
        if(slot instanceof ModSlot) {
            client.getScheduleList(EnrichedDate.getDate("monday"), slot).then((json: any) => {
                console.log("Parsing results...")
                cs = toScheduleableList(json, slot)
                for(let i = 0; i < cs.length; i++) {
                    console.log(i + ">" + cs[i].course.toString())
                }
                rl.question("Which class: ", (res: string) => {
                    client.scheduleMod(cs[Number.parseInt(res)]).then((json: any) => {
                        console.log(json);
                        query();
                    })
                })
            })
        }
    })
}

query();