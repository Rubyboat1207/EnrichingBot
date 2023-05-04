import { Client, EnrichedDate, Mod, ModSlot } from "./index.ts";
import { parse } from "https://deno.land/std@0.184.0/flags/mod.ts";
import { TokenServer } from "./tokenServer.ts";
import { open } from "https://deno.land/x/open@v0.0.6/index.ts";
import {  writeText } from "https://deno.land/x/copy_paste@v1.1.3/mod.ts";
import { printoutSelection } from "./utils.ts";

const flags = parse(Deno.args, {
    string: ['-token', 't'],
})

const useTokenServer = Deno.args.includes('-ts');

if(!(flags["-token"] || flags.t || useTokenServer)) {
    console.log("you must provide a token using --token, or -t, or use the token server (-ts)")

    Deno.exit();
}

let student: Client;

if(flags['-token']) {
    student = new Client(flags['-token']);
}else if(flags.t) {
    student = new Client(flags.t);
}else if(useTokenServer) {
    console.log('Opening enriching students...')


    
    await open('https://enrichingstudents.com/');

    console.log('When you are loggen in, open the developer tools, and paste the command in your clipboard into the developer console.')
    console.log('This command will send your login token to the local server running in this app.')
    console.log('It will stay on your computer, and will not be uploaded elsewhere')
    
    writeText(`fetch('http://localhost:3002/token/' + localStorage.getItem('ESAuthToken'))`);

    const tokenServer = new TokenServer(3002);

    const token = await tokenServer.awaitConnections();

    if(!token) {
        console.log('No token was received. Exiting...')
        Deno.exit();
    }

    console.log('You may now close your browser...')

    student = new Client(token);
}else {
    Deno.exit();
}

const today = new EnrichedDate(new Date());

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
        let hrs = now.getHours();

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
            const res = await mod.schedule(student);

            if(res.errorMessages.length > 1) {
                return res.errorMessages.join('\n');
            }
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

        printoutSelection<string>(mods.map(i => i.course.facilitator_name))

        const selection = prompt("Which Teacher?") as string;

        const mod = Mod.getByUserInput(mods, selection);
        
        if(mod == null) {
            return '';
        }

        const res = await mod.schedule(student);

        if(res.errorMessages.length >= 1) {
            return res.errorMessages.join('\n');
        }
        return `Scheduled ${mod.course.toString()}`;
    }),
    new UserPrompt("Refresh", async () => {
        mods = await student.getMods(today);

        return "refreshed";
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