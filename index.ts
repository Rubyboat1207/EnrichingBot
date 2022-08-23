const node_fetch = require('node-fetch')

class Client {
    auth: string;

    public constructor(auth: string) {
        this.auth = auth;
    }

    //Returns a list of Mods on that date
    public getMods(date) {
        return node_fetch.fetch(
            "https://student.enrichingstudents.com/v1.0/appointment/viewschedules",
            {
              headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json;charset=UTF-8",
                esauthtoken:
                  this.auth,
                "sec-ch-ua":
                  '"Opera GX";v="89", "Chromium";v="103", "_Not:A-Brand";v="24"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                cookie:
                  "__utmc=64607867; __utma=64607867.313069578.1660582665.1660582665.1660847704.2; __utmz=64607867.1660847704.2.2.utmcsr=student.enrichingstudents.com|utmccn=(referral)|utmcmd=referral|utmcct=/",
                Referer: "https://student.enrichingstudents.com/dashboard",
                "Referrer-Policy": "strict-origin-when-cross-origin",
              },
              body: '{"startDate":"' + date.toString() + '"}',
              method: "POST",
            }
        ).then(async (response) => {
            return response.json()
        });
    }

    public setMod(id, date: EnrichedDate, slot: ModSlot) {

    }
    //Returns schedulable mods for a date and modslot
    public getScheduleList(date: EnrichedDate, slot: ModSlot) {
        node_fetch.fetch("https://student.enrichingstudents.com/v1.0/course/forstudentscheduling", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json;charset=UTF-8",
                "esauthtoken": "jcnwodh2:4;wueiosdzm:326;ksdfjlsnv:1271303;qdjHDnmxadf:s49-Z1KF2ggTbFUTS8lD944xUXn8C2yGj5IrLQ__;ofu82uicn:s49-Z1KF2ghvgF3HiYf7DlafardIYECakHw,Vg__;kosljsdnc:s49-Z1KF2ghnJtPCLKe-Hnz-oQwH7iwCrQJAyw__;^ydh)9xLkxx:s49-Z1KF2ggToXh1yz6ekpFihfZ7RsenCdWiRg__",
                "sec-ch-ua": "\"Opera GX\";v=\"89\", \"Chromium\";v=\"103\", \"_Not:A-Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "_ga=GA1.2.2102854953.1660857336; _fbp=fb.1.1660857336127.1348881197; __utmc=64607867; __utmz=64607867.1660857338.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _gid=GA1.2.608790227.1661057802; __utma=64607867.2102854953.1660857336.1660970940.1661057809.3; __utmb=64607867.1.10.1661057809",
                "Referer": "https://student.enrichingstudents.com/schedule",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"periodId\":11,\"startDate\":\"2022-08-29\"}",
            "method": "POST"
        });
    }
}

class Mod {
    course: Course;
    date: EnrichedDate;
    id: number;
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
    room: string;
    description: string;
    name: string;
    facilitator_name: string;
    period_id: ModSlot | null;
    id: number;

    public toString() {
        return this.name + " " + this.description + " in " + this.room + " at " + this.period_id?.name + " by " + this.facilitator_name;
    }
}

class EnrichedDate {
    public date: Date;
    toString() {
        return this.date.getFullYear() + "-" + (this.date.getUTCMonth() + 1) + "-" + this.date.getUTCDate()
    }

    constructor(date: Date) {
        this.date = date
    }
}

function toCourseList(json) {
    let courseList = []

    for(let i = 0; i < json.courses.length; i++) {
        let cc = json.courses[i];
        let course = new Course();
        course.description = cc.courseDescription
        course.facilitator_name = cc.staffFirstName + " " + cc.staffLastName
        course.name = cc.courseName;
        course.period_id = ModSlot.getMod(cc.periodId);
        course.room = cc.room;
        course.id = cc.courseId;
    }
}










let client = new Client("jcnwodh2:4;wueiosdzm:326;ksdfjlsnv:1271303;qdjHDnmxadf:PUqwOmmD2gje4iKvqkOaCM2y7XyIZcL,Fb8T9A__;ofu82uicn:PUqwOmmD2ghONGhvUvYDJ2TFUgCOwCRt1dY8Ow__;kosljsdnc:PUqwOmmD2gjSelDO2AmtYnkRE7ZHcpO-INFhlA__;^ydh)9xLkxx:PUqwOmmD2gg79GPg,Y5vsTQbFl5N9Sn4gZ1zJg__");

let cs: any;

console.log("Waiting on the ES Server")
client.getMods(new EnrichedDate(new Date())).then(json => {
    cs = toCourseList(json)
    for(let i = 0; i < cs.length; i++) {
        console.log(cs[i].toString())
    }
})