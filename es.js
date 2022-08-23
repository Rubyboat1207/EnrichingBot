import fetch from "node-fetch";
import readline from "readline"
import { isPromise } from "util/types";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
var mods = []
var authtoken = "jcnwodh2:4;wueiosdzm:326;ksdfjlsnv:1271303;qdjHDnmxadf:PUqwOmmD2gje4iKvqkOaCM2y7XyIZcL,Fb8T9A__;ofu82uicn:PUqwOmmD2ghONGhvUvYDJ2TFUgCOwCRt1dY8Ow__;kosljsdnc:PUqwOmmD2gjSelDO2AmtYnkRE7ZHcpO-INFhlA__;^ydh)9xLkxx:PUqwOmmD2gg79GPg,Y5vsTQbFl5N9Sn4gZ1zJg__";
function getSchedule(day) {
  fetch(
    "https://student.enrichingstudents.com/v1.0/appointment/viewschedules",
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json;charset=UTF-8",
        esauthtoken:
          authtoken,
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
      body: '{"startDate":"' + day + '"}',
      method: "POST",
    }
  ).then(async (response) => {
    response.json().then(data => {
        mods = [];
        let details = data[0].details;
        for(let i = 0; i < details.length; i++) {
            if(details[i].courseName != "Open Schedule" && !details[i].courseName.includes("Blocked")) {
                let cn = details[i].periodDescription + " - " + details[i].courseName;
                mods.push(cn);
            }
        }
        prompt()
    });
  });
}
init();
function init() {
    rl.question('What Day? (YYYY-MM-DD)', (question) => {
        console.log("Waiting on the Enriching Students servers to respond...");

        let date = new Date();
        if(question == "tomorrow") {
          while(date.getDay() > 5) {
            date.setDate(date.getDate() + 1)
          }
        }if(days.includes(question.toLowerCase())) {
          while(date.getDay() != days.indexOf(question.toLowerCase())) {
            date.setDate(date.getDate() + 1)
          }
        }else{
          getSchedule(question);
        }
        getSchedule(toESDateFormat(date));
    });
}

function toESDateFormat(date) {
  return date.getFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate()
}

async function prompt() {
    rl.question('Which Mod?', question => {
        if(question == "exit") {
            init();            
        } else {
            console.log(mods[Number.parseInt(question - 1)]);
            prompt();
        }
    })
}

function setSchedule(id, period, date) {
  fetch("https://student.enrichingstudents.com/v1.0/appointment/save", {
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
    "cookie": "_ga=GA1.2.2102854953.1660857336; _fbp=fb.1.1660857336127.1348881197; __utmc=64607867; __utmz=64607867.1660857338.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _gid=GA1.2.608790227.1661057802; __utma=64607867.2102854953.1660857336.1660970940.1661057809.3; __utmt=1; __utmb=64607867.1.10.1661057809",
    "Referer": "https://student.enrichingstudents.com/schedule",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "{\"courseId\":"+id+",\"periodId\":"+period+",\"scheduleDate\":\""+ date +"\"}", //271319 //10 //
  "method": "POST"
});
}