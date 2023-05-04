import { tuplecmp } from "./utils.ts";

export class Client {
    auth: string;

    public constructor(auth: string) {
        this.auth = auth;
    }

    //Returns a list of Mods on that date
    private async getModsInternal(date: EnrichedDate) {
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
        ).then((response: any) => {
            return response.json()
        });
    }

    //Returns a list of Mods on that date
    public async getMods(date: EnrichedDate): Promise<Course[]> {
        return toCourseList(await this.getModsInternal(date))
    }
    
    //Returns schedulable mods for a date and modslot
    private getScheduleListInternal(date: EnrichedDate, slot: ModSlot) {
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
        ).then((response: any) => {
            return response.json()
        });
    }

    public async getScheduleList(date: EnrichedDate, slot: ModSlot):  Promise<Mod[]> {
        return toScheduleableList(await this.getScheduleListInternal(date, slot), slot);
    }

    public scheduleMod(mod: Mod): Promise<ScheduleResponse> {  
        console.log(`Scheduling Mod ${mod.course.name} on ${mod.date.toString()} using id: ${mod.course.period_id?.id} (${mod.course.period_id?.name})`)
        
        const body = {
            courseId: mod.course.id,
            periodId: mod.course.period_id?.id,
            scheduleDate: mod.date.toString()
        }

        // console.log(eightmothsagorudyisabitch)
        
        return fetch(
            "https://student.enrichingstudents.com/v1.0/appointment/save",
            {
              headers: {
                accept: "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
                esauthtoken:
                  this.auth
              },
              body: JSON.stringify(body),
              method: "POST",
            }
        ).then((response: any) => {
            return response.json()
        }) as Promise<ScheduleResponse>;
    }
}

export interface ScheduleResponse {
    appointmentEditorResponse: number;
    errorMessages: string[];
}

export class Mod {
    public course: Course;
    public seats: number;
    public date: EnrichedDate;

    constructor(course: Course, seats: number, date: EnrichedDate) {
        this.course = course;
        this.seats = seats;
        this.date = date;
    }

    async schedule(client: Client) {
        return await client.scheduleMod(this);
    }

    static getByUserInput(courses: Mod[], input: string) {
        const isNumber = !isNaN(parseInt(input));
        const lower = input.toLowerCase();

        return courses.find(mod => {
            if(isNumber) {
                return courses.indexOf(mod) == parseInt(input);
            }else {
                if(mod.course.facilitator_name?.toLowerCase() == lower) {
                    return true;
                }else if(mod.course.facilitator_name?.includes(' ') && mod.course.facilitator_name?.split(' ')[1].toLowerCase() == lower) {
                    return true;
                }else {
                    return false;
                }
            }
        });
    }
}

export class ModSlot {
    static slotList: Array<ModSlot> = []

    public id: number;
    public name: string;
    public time: [number, number] = [-1, -1];
    constructor(id:number, name:string) {
        this.id = id;
        this.name = name;
        ModSlot.slotList.push(this)
    }

    static MORNING1 = ModSlot.withTime(1, "9:20 - 10:00", [9, 30]);
    static MORNING2 = ModSlot.withTime(2, "10:00 - 10:30", [10, 0]);
    static MORNING3 = ModSlot.withTime(3, "10:30 - 11:00", [10, 30]);
    static MORNING4 = ModSlot.withTime(4, "11:00 - 11:30", [11, 0]);
    static MORNING5 = ModSlot.withTime(5, "11:30 - 12:00", [11, 30]);
    static MORNING6 = ModSlot.withTime(6, "12:00 - 12:30", [12, 0]);

    static AFTERNOON1 = ModSlot.withTime(7, "1:30 - 2:00", [12 + 1, 30]);
    static AFTERNOON2 = ModSlot.withTime(8, "2:00 - 2:30", [12 + 2, 0]);
    static AFTERNOON3 = ModSlot.withTime(9, "2:30 - 3:00", [12 + 2, 30]);
    static AFTERNOON4 = ModSlot.withTime(10, "3:00 - 3:30", [12 + 3, 0]);
    static AFTERNOON5 = ModSlot.withTime(11, "3:30 - 4:00", [12 + 3, 30]);
    static AFTERNOON6 = ModSlot.withTime(12, "4:00 - 4:30", [12 + 4, 0]);

    static TITAN_TIME = new ModSlot(13, "Titan Time");
    static FLEX_MOD1 = new ModSlot(14, "Flex Mod 1")
    static FLEX_MOD2 = new ModSlot(15, "Flex Mod 2")
    static FLEX_MOD3 = new ModSlot(16, "Flex Mod 3")
    static FLEX_MOD4 = new ModSlot(17, "Flex Mod 4")
    static FLEX_MOD5 = new ModSlot(18, "Flex Mod 5")
    static LUNCH_1 = new ModSlot(19, "Lunch 12:30-1:00")
    static LUNCH_2 = new ModSlot(20, "Lunch 1:00-1:13")

    static getMod(id: number) {
        for(let i = 0; i < ModSlot.slotList.length; i++) {
            if(ModSlot.slotList[i].id == id) {
                return ModSlot.slotList[i];
            }
        }
        return null;
    }

    static withTime(id: number, name: string, time: [number, number]): ModSlot {  

        const slot = new ModSlot(id, name);

        slot.time = time;

        return slot;
    }
    
    static promptMods() {
        console.log("Available Mods:");
        for(let i = 0; i < ModSlot.slotList.length; i++) {
            console.log(`[${ModSlot.slotList[i].id}] ${ModSlot.slotList[i].name}`);
        }
        const input: string | null = prompt("Enter Mod Slot ID: ");
        if(input == null) {
            return null;
        }

        const id: number = Number.parseInt(input);
        if(id < 1 || id > ModSlot.slotList.length) {
            return null;
        }
        return ModSlot.getMod(id);
    }

    static getCurrentSlot() {
        const now = new Date();

        let mins = now.getHours();
        let hrs = now.getMinutes();

        //floor to 30 mins

        if(mins >= 30) {
            mins = 30;
        }else {
            mins = 0;
        }

        for(const slot of ModSlot.slotList) {
            if(tuplecmp(slot.time, [hrs, mins])) {
                return slot;
            }
        }

        return null;
    }
}

export class Course {
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

export class EnrichedDate {
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
        date.setDate(Number.parseInt(string.split("-")[2]) - 1)
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
// deno-lint-ignore no-explicit-any
export function toCourseList(json: any): Array<Course> {
    const courseList: Array<Course> = []
    for(let i = 0; i < json[0].details.length; i++) {
        const cc = json[0].details[i];
        const course = new Course();


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
export function toScheduleableList(json: any, mod: ModSlot) {
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
        if(cc.instructorFirstName) {
            course.facilitator_name = cc.instructorFirstName + " " + cc.instructorLastName
        }else {
            const split = cc.courseName.split("-") as string[];
            course.facilitator_name = split[0].replaceAll('_', ' ');
        }
        course.period_id = mod;
        course.room = cc.courseRoom;
        courseList.push(new Mod(course, cc.maxNumberStudents, EnrichedDate.of(cc.scheduleDate.split('T')[0])));
    }
    return courseList;
}
