// import required libraries
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const tabletojson = require('tabletojson').Tabletojson;

// netlify function
exports.handler = async (event, context) => {
    let response;
    response = "0"; console.log(response);
    // get the query string from the url
    if (event.queryStringParameters && event.queryStringParameters.username && event.queryStringParameters.password) {
        const { username, password } = event.queryStringParameters;
        // liam code - create a new browser instance
        /*const browser = await puppeteer.launch({
            headless: true
        });*/
        console.log(1, "Loading page...");
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: true,
            ignoreHTTPSErrors: true
        });
        console.log(2, "Loading page...");
        const page = await browser.newPage();
        /*await page.setViewport({
            width: 1200,
            height: 720
        });*/
        console.log(3, "Loading page...");
        await page.goto('https://aps.powerschool.com/public/home.html', {waitUntil: 'networkidle0'});
        //await page.goto('https://irom.one/', { waitUntil: 'networkidle2' });
        // log page title
        const title = await page.title();
        console.log(3.5, title);
        console.log(4, "Loading page...");
        await page.type('#fieldAccount', username);
        await page.type('#fieldPassword', password);
        // click and wait for navigation
        await Promise.all([
            page.click('#btn-enter-sign-in'),
            page.waitForNavigation({
                waitUntil: 'networkidle0'
            }),
        ]);
        response = "1"; console.log(response); // check in
        const data = await page.evaluate(() => document.querySelector('#quickLookup').innerHTML);
        console.log(data);
        
        const jsonTables = tabletojson.convert(data);
        var results = jsonTables[0];
        console.log(results);

        /*
        var url = "https://blockstatus.app/data/classes.json";
        
        request.get({
            url: url,
            json: true,
            headers: { 'User-Agent': 'request' }
        }, (err, res, data) => {
            if (err) {
                console.log('Error:', err);
            } else if (res.statusCode !== 200) {
                console.log('Status:', res.statusCode);
            } else {
                // data is already parsed as JSON:
                //console.log(data);
                classes = data;
                write();
            }
        });*/
        var classes;
        //fs.writeFileSync('tabledata.json', JSON.stringify(results));
        classes = JSON.parse(`{"Free Block":[null],"Wellness":["Jeff Bruno","Will Darling","Lauren Geiger","Jay Lamoureux","Kim Visco","Gianna Kaski"],"Drama":["Michael Byrne"],"Chorus":["Mara Walker"],"Music Technology":["John DiTomaso"],"Band":["Sabato D’Agostino"],"Orchestra":["Sabato D’Agostino"],"Visual Arts":["Nikki McCulloch","AnnMarie Rebola","Melody Wolfe Thomas","Nathan Muehleisen","David Moore","Cara McMillin"],"Woodworking":["Nathan Muehleisen"],"Digital Photography":["David Moore"],"CADD":["Kambiz Vatan"],"Psychology":["Michael Sandler","Kristen Arabasz"],"English":["Elizabeth Basso","Lianna Bessette","Justin Bourassa","Matthew Cincotta","Chris Dangel","Kathleen Driscoll","Nicole Eidson","Lauren Geiger","Ariana Gomez","Julia Grace","Elizabeth Harple","Erin Heyneman","Meagan Miller","Allison Lee","Timothy Marten","Erin McLean","Deborah Perry","Kevin Richardson","Duncan Slobodzian","Scott Stelter","Kim Walls","Lucie Berjoan"],"FACS":["Patricia Bellahrossi","Jennie Craigie","Cara McMillin"],"Math":["Alina Artyunova","Joanna Begin","Octavia Brauner","Allison Bukys","Zachary Burdeau","Matt Coleman","Katelyn Coleman","Blythe Colyer","Shai Fischmann","Clayton Jones","Samuel Gebremedhin","Thomas McCauley","Lindsey McPherson","Lucinda Robinson","Reina Secor","Daniel Sheldon","Kambiz Vatan","Kent Werst","Catherine Willwerth","Jessica Toupin","Yu Yan Hayford"],"Science":["Rebecca Bennett","David Conneely","Graham Daley","Graham Dimmock","Karlee Eagan","Farwa Faisal","Sebastian Garza","Sam Hoyo","Shannon Knuth","Martyna Laszcz","Jean Lindsay-Dwyer","John Macuk","Alicia Majid","Jayce McG","Laura Patriarca","Mark Petrozzino","Lindsay Plummer","Joshua Roth","Robin Varghese","David Peal","Alex Hajdukiewicz","Gregory Langham"],"History":["John Amirault","Kristen Arabasz","James Barry","Elizabeth Basso","Lisa Clark","Denny Conklin","Alyssa Ford","Melanie Konstandakis","Ian MacKay","Nicholas Martinelli","Scott Matson","Meredith O’Brien","James Paras","Joseph Sancinito","Michael Sandler","Sarah Stoe","Erica Tonachel","Kevin Toro","Alexis Daggett","Emily Tessier","Alvaro Quintero"],"French":["JoLinda Alderuccio","Veronique Lahey","Rosa Frank","Sean Rufo-Curran","Elizabeth Kaminga"],"Spanish":["Maria Arevalo","Heather Barber","Meagan Bassett","Molly Dingley","Alyssa Lee","Cassandra Mea","Kathryn Mostow","Christina Toro","Sein Park","Ana Paus"],"Mandarin":["Xioahui Cao"],"Latin":["Edward Foley","Cassandra Mea"],"Italian":["Anthony DiSanzo","Edward Foley"],"Harbor":["Adam Russo"],"Learning Center":["Linda Bagdis"],"Academic Internship":["Nicole Eidson"]}`);
        response = "2"; console.log(response);

        var schedule = {};

        for (var i = 0; i < results.length - 1; i++) {
            var name;
            var room = "";
            var fullClass = "";
            var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

            var split = results[i].Absences.replace(/[^ -~]+/g, " ").split(" ");

            for (var j = 0; j < split.length; j++) {
                if (split[j].includes(",")) {
                    name = split[j + 1] + " " + split[j].replace(",", "");
                }

                if (split[j].includes("Email")) {
                    for (var k = 0; k < j; k++) {
                        fullClass += " " + split[k]
                    }
                    fullClass = fullClass.trim();
                }

                if (split[j].includes("Rm:")) {
                    if (isNaN(split[j + 1])) {
                        //room = split[j+1] + split[j+2];

                        for (var k = j + 1; k < split.length; k++) {
                            room += " " + split[k];
                        }

                    } else {
                        room = split[j + 1];
                    }
                    room = room.trim();
                }

            }



            var block = results[i].M.split("(")[0];


            // figure out days that class is
            var dropDays = {
                "A": "Thursday",
                "B": "Friday",
                "C": "Monday",
                "D": "Tuesday",
                "E": "Wednesday",
                "F": "Thursday",
                "G": "Tuesday"
            }
            let dayExtensions = {
                "Mon": "Monday",
                "Tue": "Tuesday",
                "Wed": "Wednesday",
                "Thu": "Thursday",
                "Fri": "Friday"
            }
            let blockDays = [], sDays;
            if (results[i].M.includes(",")) {
                sDays = results[i].M.trim().split("(")[1].split(")")[0].split(",");
            } else if (results[i].M.includes("-")) {
                sDays = results[i].M.trim().split("(")[1].split(")")[0].split("-");
                let found = false;
                Object.keys(dayExtensions).forEach(day => {
                    if (sDays[0] == day) {
                        found = true;
                    } else if (sDays[1] == day) {
                        found = false;
                    } else if (found == true) {
                        sDays.push(day);
                    }
                });
            } else {
                sDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
            }
            sDays.forEach((day) => {
                day = dayExtensions[day.trim()];
                if (!Object.keys(dropDays).includes(block)) return;
                if (dropDays[block] == day) return;
                blockDays.push(day);
            });
            //console.log(results[i].M,block,blockDays);


            if (block == "ADV") {
                block = "HR";
            }

            var subject = "";

            Object.keys(classes).forEach((item, j) => {
                if (classes[item].includes(name)) {
                    subject = item;
                }
            });

            var house = "steam";
            let downsHouse = ["History"];
            let fuscoHouse = ["Spanish", "Latin", "English", "Italian", "Mandarin", "French", "Wellness"];
            let performingArts = ["Band", "Chorus", "Orchestra"]
            if (downsHouse.includes(subject)) {
                house = "downs";
            } else if (fuscoHouse.includes(subject)) {
                house = "fusco";
            } else if (performingArts.includes(subject)) {
                house = "arts";
            }
            for (var j = 0; j < days.length; j++) {
                let day = days[j];
                if (block == "HR") {
                    schedule.HR = name;
                } else if (block && dropDays[block] != day) {
                    if (!schedule[block]) {
                        schedule[block] = {};
                    }
                    if (blockDays.includes(day)) {
                        schedule[block][day] = {
                            "room": room,
                            "subject": subject,
                            "customSubject": fullClass,
                            "teacher": name,
                            "building": house
                        }
                    } else {
                        schedule[block][day] = {
                            "subject": "Free Block"
                        }
                    }
                }
            }

            //console.log(block + ", " + name + ", " + room + ", " + subject);

        }
        //fs.writeFileSync('test.json', JSON.stringify(schedule));
        //console.log(3, schedule);
        response = JSON.stringify(schedule);


        //netlify code end
    } else {
        response = "error";
    }

    return {
        statusCode: 200,
        body: response,
        headers: {
            "Content-Type": "application/json"
        }
    }
}