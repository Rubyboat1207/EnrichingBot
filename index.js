var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var node_fetch = require('node-fetch');
var Client = /** @class */ (function () {
    function Client(auth) {
        this.auth = auth;
    }
    //Returns a list of Mods on that date
    Client.prototype.getMods = function (date) {
        var _this = this;
        return node_fetch.fetch("https://student.enrichingstudents.com/v1.0/appointment/viewschedules", {
            headers: {
                accept: "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json;charset=UTF-8",
                esauthtoken: this.auth,
                "sec-ch-ua": '"Opera GX";v="89", "Chromium";v="103", "_Not:A-Brand";v="24"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                cookie: "__utmc=64607867; __utma=64607867.313069578.1660582665.1660582665.1660847704.2; __utmz=64607867.1660847704.2.2.utmcsr=student.enrichingstudents.com|utmccn=(referral)|utmcmd=referral|utmcct=/",
                Referer: "https://student.enrichingstudents.com/dashboard",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: '{"startDate":"' + date.toString() + '"}',
            method: "POST"
        }).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, response.json()];
            });
        }); });
    };
    Client.prototype.setMod = function (id, date, slot) {
    };
    //Returns schedulable mods for a date and modslot
    Client.prototype.getScheduleList = function (date, slot) {
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
    };
    return Client;
}());
var Mod = /** @class */ (function () {
    function Mod() {
    }
    return Mod;
}());
var ModSlot = /** @class */ (function () {
    function ModSlot(id, name) {
        this.id = id;
        this.name = name;
        ModSlot.slotList.push(this);
    }
    ModSlot.getMod = function (id) {
        for (var i = 0; i < ModSlot.slotList.length; i++) {
            if (ModSlot.slotList[i].id == id) {
                return ModSlot.slotList[i];
            }
        }
        return null;
    };
    ModSlot.slotList = [];
    ModSlot.MOD1 = new ModSlot(1, "Mod 1");
    ModSlot.MOD2 = new ModSlot(2, "Mod 2");
    ModSlot.MOD3 = new ModSlot(3, "Mod 3");
    ModSlot.MOD4 = new ModSlot(4, "Mod 4");
    ModSlot.MOD5 = new ModSlot(5, "Mod 5");
    ModSlot.MOD6 = new ModSlot(6, "Mod 6");
    ModSlot.MOD7 = new ModSlot(7, "Mod 7");
    ModSlot.MOD8 = new ModSlot(8, "Mod 8");
    ModSlot.TITAN_TIME = new ModSlot(9, "Titan Time");
    ModSlot.FLEX_MOD1 = new ModSlot(10, "Flex Mod 1");
    ModSlot.FLEX_MOD2 = new ModSlot(11, "Flex Mod 2");
    ModSlot.FLEX_MOD3 = new ModSlot(12, "Flex Mod 3");
    ModSlot.FLEX_MOD4 = new ModSlot(13, "Flex Mod 4");
    ModSlot.FLEX_MOD5 = new ModSlot(14, "Flex Mod 5");
    ModSlot.LUNCH_1 = new ModSlot(15, "Lunch 12:30-1:00");
    ModSlot.LUNCH_2 = new ModSlot(16, "Lunch 1:00-1:13");
    return ModSlot;
}());
var Course = /** @class */ (function () {
    function Course() {
    }
    Course.prototype.toString = function () {
        var _a;
        return this.name + " " + this.description + " in " + this.room + " at " + ((_a = this.period_id) === null || _a === void 0 ? void 0 : _a.name) + " by " + this.facilitator_name;
    };
    return Course;
}());
var EnrichedDate = /** @class */ (function () {
    function EnrichedDate(date) {
        this.date = date;
    }
    EnrichedDate.prototype.toString = function () {
        return this.date.getFullYear() + "-" + (this.date.getUTCMonth() + 1) + "-" + this.date.getUTCDate();
    };
    return EnrichedDate;
}());
function toCourseList(json) {
    var courseList = [];
    for (var i = 0; i < json.courses.length; i++) {
        var cc = json.courses[i];
        var course = new Course();
        course.description = cc.courseDescription;
        course.facilitator_name = cc.staffFirstName + " " + cc.staffLastName;
        course.name = cc.courseName;
        course.period_id = ModSlot.getMod(cc.periodId);
        course.room = cc.room;
        course.id = cc.courseId;
    }
}
var client = new Client("jcnwodh2:4;wueiosdzm:326;ksdfjlsnv:1271303;qdjHDnmxadf:PUqwOmmD2gje4iKvqkOaCM2y7XyIZcL,Fb8T9A__;ofu82uicn:PUqwOmmD2ghONGhvUvYDJ2TFUgCOwCRt1dY8Ow__;kosljsdnc:PUqwOmmD2gjSelDO2AmtYnkRE7ZHcpO-INFhlA__;^ydh)9xLkxx:PUqwOmmD2gg79GPg,Y5vsTQbFl5N9Sn4gZ1zJg__");
var cs;
console.log("Waiting on the ES Server");
client.getMods(new EnrichedDate(new Date())).then(function (json) {
    cs = toCourseList(json);
    for (var i = 0; i < cs.length; i++) {
        console.log(cs[i].toString());
    }
});
