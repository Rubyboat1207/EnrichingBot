import { Client, EnrichedDate, ModSlot } from "./index.ts";
import { tuplecmp } from "./math.ts";

const student = new Client("jcnwodh2:4;wueiosdzm:326;ksdfjlsnv:1271303;qdjHDnmxadf:PHh0dFlN2wjYLmfKS-bsaoPFKhsalGoey8uNLA__;ofu82uicn:PHh0dFlN2wg18W283zEw7f7j7QWYmDqCaSG-Hw__;kosljsdnc:PHh0dFlN2wgbw8c56JX57T,VuHLg0qwr661Cpg__;^ydh)9xLkxx:PHh0dFlN2wgesfuHGGf0T1PIU8dt8dls,VoJiw__")

let today = new EnrichedDate(new Date());

let mods = await student.getMods(today);

class UserPrompt {
    promptText: string;
    action: () => (string | Promise<string>);
    isAysnc = false;

    constructor(promptText: string, action: () => string | Promise<string>) {
        this.promptText = promptText;
        this.action = action;

        if(action instanceof Function) {
            this.isAysnc = true;
        }
    }
    
}



let stopped = false;

const prompts = [
    new UserPrompt("Stop", () => {
        stopped = true;
        return "Stopped";
    }),
    new UserPrompt("Date", () => {
        return today.toString();
    }),
    new UserPrompt("Check Classes", () => {
        const courses = mods;

        let text = '';

        for(const course of courses) {
            text += course.toString() + "\n";
        }

        return text;
    }),
    new UserPrompt("What class am I in?", () => {
        const mod = ModSlot.getCurrentSlot();
        if(mod) {
            return mod.name;
        }
        const now = new Date();

        let mins = now.getHours();
        let hrs = now.getMinutes();

        console.log(hrs)

        console.log(hrs > 12 + 4);

        if(hrs > 12 + 4 && !(hrs == 12 + 4 && mins == 30)) {
            return 'You are not in school';
        }
        else if(hrs < 9) {
            //jump to first class period
            hrs = 0;
            mins = 30;
        }

        return 'Unknown Error Occured'
    }),
    new UserPrompt("Schedule Mod", async () => {
        const slot = ModSlot.promptMods();

        if(slot == null) {
            return '';
        }

        const mods = await student.getScheduleList(new EnrichedDate(new Date()), slot);


        let i = 0;
        for(const mod of mods) {
            console.log(`${i})` + mod.course.toString());
            i++;
        }
        
        const selection = prompt("Select Mod: ") as string;

        if(selection == null) {
            return '';
        }

        if(!isNaN(parseInt(selection))) {
            const mod = mods[parseInt(selection)];
            console.log(await mod.schedule(student));
            return `Scheduled ${mod.course.toString()}`;
        }

        return '';
    }),
    new UserPrompt("Schedule Teacher", async () => {
        const slot = ModSlot.promptMods();

        if(slot == null) {
            return '';
        }

        const mods = await student.getScheduleList(new EnrichedDate(new Date()), slot);

        let i = 0;
        for(const mod of mods) {
            console.log(`${i})` + mod.course.facilitator_name);
            i++;
        }

        const selection = prompt("Which Teacher?");

        if(selection == null) {
            return '';
        }

        const loweredSel = selection.toLowerCase();

        const isNumber = !isNaN(parseInt(selection));

        const mod = mods.find(mod => {
            if(isNumber) {
                return mods.indexOf(mod) == parseInt(selection);
            }else {
                if(mod.course.facilitator_name?.toLowerCase() == loweredSel) {
                    return true;
                }else if(mod.course.facilitator_name?.includes(' ') && mod.course.facilitator_name?.split(' ')[1].toLowerCase() == loweredSel) {
                    return true;
                }else {
                    return false;
                }
            }
        });
        
        if(mod == null) {
            return '';
        }

        student.scheduleMod(mod);

        return `Scheduled ${mod.course.toString()}`;
    }),
    new UserPrompt("Refresh", async () => {
        mods = await student.getMods(today);

        return "refreshed";
    })
];

while(!stopped) {
    let i = 0;
    for(const prompt of prompts) {
        console.log(`${i++}) ${prompt.promptText}`);
    }

    const input = prompt("Input: ") as string;

    // console.log(input + "------------------");

    const action = prompts.find(prompt => {
        if(!isNaN(parseInt(input))) {
            return prompts.indexOf(prompt) == parseInt(input);
        }
        
        return input.toLowerCase().includes(prompt.promptText.toLowerCase())
    });

    if(action) {
        if(action.isAysnc) {
            console.log(await action.action());
        }else {
            console.log(action.action());
        }
    }

    console.log("-----------------------");
}