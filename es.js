import fetch from "node-fetch";
import readline from "readline"
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var mods = []
var authtoken = "YOUR_AUTH_TOKEN_HERE";
//jcnwodh2:4;wueiosdzm:326;ksdfjlsnv:1271303;qdjHDnmxadf:PUqwOmmD2gje4iKvqkOaCM2y7XyIZcL,Fb8T9A__;ofu82uicn:PUqwOmmD2ghONGhvUvYDJ2TFUgCOwCRt1dY8Ow__;kosljsdnc:PUqwOmmD2gjSelDO2AmtYnkRE7ZHcpO-INFhlA__;^ydh)9xLkxx:PUqwOmmD2gg79GPg,Y5vsTQbFl5N9Sn4gZ1zJg__
function fet(day) {
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
                let cn = details[i].courseName;
                mods.push(cn);
            }
        }
        //flip order of mods
        prompt();
    });
  });
}
init();
function init() {
    rl.question('What Day? (YYYY-MM-DD)', (question) => {

        console.log("Waiting on the Enriching Students servers to respond...");
        if(question == "today") {
            let today = new Date();
            fet(today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + "-" + today.getUTCDate());
        }else{
            fet(question);
        }
    });
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