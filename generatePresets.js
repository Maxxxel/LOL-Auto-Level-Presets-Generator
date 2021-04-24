var https = require('follow-redirects').https;
var url = "https://www.leagueofgraphs.com/champions/skills-orders";
var champions = [
	"Aatrox",
	"Ahri",
	"Akali",
	"Alistar",
	"Amumu",
	"Anivia",
	"Annie",
	"Aphelios",
	"Ashe",
	"AurelionSol",
	"Azir",
	"Bard",
	"Blitzcrank",
	"Brand",
	"Braum",
	"Caitlyn",
	"Camille",
	"Cassiopeia",
	"Chogath",
	"Corki",
	"Darius",
	"Diana",
	"DrMundo",
	"Draven",
	"Ekko",
	"Elise",
	"Evelynn",
	"Ezreal",
	"Fiddlesticks",
	"Fiora",
	"Fizz",
	"Galio",
	"Gangplank",
	"Garen",
	"Gnar",
	"Gragas",
	"Graves",
	"Gwen",
	"Hecarim",
	"Heimerdinger",
	"Illaoi",
	"Irelia",
	"Ivern",
	"Janna",
	"JarvanIV",
	"Jax",
	"Jayce",
	"Jhin",
	"Jinx",
	"Kaisa",
	"Kalista",
	"Karma",
	"Karthus",
	"Kassadin",
	"Katarina",
	"Kayle",
	"Kayn",
	"Kennen",
	"Khazix",
	"Kindred",
	"Kled",
	"KogMaw",
	"Leblanc",
	"LeeSin",
	"Leona",
	"Lillia",
	"Lissandra",
	"Lucian",
	"Lulu",
	"Lux",
	"Malphite",
	"Malzahar",
	"Maokai",
	"MasterYi",
	"MissFortune",
	"Mordekaiser",
	"Morgana",
	"Nami",
	"Nasus",
	"Nautilus",
	"Neeko",
	"Nidalee",
	"Nocturne",
	"Nunu",
	"Olaf",
	"Orianna",
	"Ornn",
	"Pantheon",
	"Poppy",
	"Pyke",
	"Qiyana",
	"Quinn",
	"Rakan",
	"Rammus",
	"RekSai",
	"Rell",
	"Renekton",
	"Rengar",
	"Riven",
	"Rumble",
	"Ryze",
	"Samira",
	"Sejuani",
	"Senna",
	"Seraphine",
	"Sett",
	"Shaco",
	"Shen",
	"Shyvana",
	"Singed",
	"Sion",
	"Sivir",
	"Skarner",
	"Sona",
	"Soraka",
	"Swain",
	"Sylas",
	"Syndra",
	"TahmKench",
	"Taliyah",
	"Talon",
	"Taric",
	"Teemo",
	"Thresh",
	"Tristana",
	"Trundle",
	"Tryndamere",
	"TwistedFate",
	"Twitch",
	"Udyr",
	"Urgot",
	"Varus",
	"Vayne",
	"Veigar",
	"Velkoz",
	"Vi",
	"Viego",
	"Viktor",
	"Vladimir",
	"Volibear",
	"Warwick",
	"MonkeyKing",
	"Xayah",
	"Xerath",
	"XinZhao",
	"Yasuo",
	"Yone",
	"Yorick",
	"Yuumi",
	"Zac",
	"Zed",
	"Ziggs",
	"Zilean",
	"Zoe",
	"Zyra"
];
var c = 0
var str = ['useless', 'Q', 'W', 'E', 'R']
var str2 = ['Usage', 'Winrate']
var finalList = "local levelPresets = {";

function reqChamp(champ, num) {
	console.log(champ, num)
	https.get(url + "/" + champ.toLowerCase() + "/platinum/sr-ranked/", (resp) => {
	let data = '';

	// A chunk of data has been recieved.
	resp.on('data', (chunk) => {
		data += chunk;
	});

	// The whole response has been received. Print out the result.
	resp.on('end', () => {
		// Parse the Data
		let last = 0;
		let skills = []

		for (var i = 0; i < 9; i++) {
			let start = data.indexOf('skillsOrdersTableContainer', last);
			let end = data.indexOf('skillsOrdersTableContainer', start + 26)
			last = end

			let skillsTable = data.indexOf('skillsOrdersTable', start + 26)
			let lastRow = skillsTable
			skills[i] = {'useless':{}, 'Q':{}, 'W':{}, 'E':{}, 'R':{}, 'Usage':0,'Winrate':0};
			
			for (var j = 0; j < 5; j++) {
				let tableRow = data.indexOf('<tr>', lastRow)
				lastRow = tableRow + 4
				let tableRowEnd = data.indexOf('</tr>', lastRow)
				skills[i][str[j]] = {}
				let entryStart = tableRow

				if (j == 0) {
					for (var x = 0; x < 19; x++) {
						let entry = data.indexOf('<th>', entryStart)
						let entryEnd = data.indexOf('</th>', entry)
						entryStart = entryEnd

						skills[i][str[j]][x] = data.substring(entry + 4, entryEnd)
					}
				} else {
					for (var x = 0; x < 19; x++) {
						let entry = data.indexOf('<td ', entryStart)
						let entryEnd = data.indexOf('</td>', entry)
						entryStart = entryEnd

						if (x != 0) {
							let ss = data.substring(entry + 4, entryEnd)
							skills[i][str[j]][x] = ss.indexOf("active") != -1 ? true : false;
						}
					}

					if (j == 1) {
						for (var x = 0; x < 2; x++) {
							let entry = data.indexOf('<td ', entryStart)
							let entryEnd = data.indexOf('</td>', entry)
							entryStart = entryEnd
							let val = data.indexOf('<progressBar data-value="', entry)
							skills[i][str2[x]] = data.substring(val + 25, val + 30)
						}
					}
				}
			}
		}

		skills.sort(function(a, b) {return a.Winrate > b.Winrate ? -1 : 1});
		let highestWinrate = skills[0]
		let hw = []

		for (var i = 1; i < 5; i++) {
			let spell = highestWinrate[str[i]]

			for (var j = 1; j < 19; j++) {
				if (spell[j]) {
					hw[j - 1] = "'" + str[i] + "'"
				}
			}
		}

		skills.sort(function(a, b) {return a.Usage > b.Usage ? -1 : 1});
		let highestUsage = skills[0]
		let hu = []

		for (var i = 1; i < 5; i++) {
			let spell = highestUsage[str[i]]

			for (var j = 1; j < 19; j++) {
				if (spell[j]) {
					hu[j - 1] = "'" + str[i] + "'"
				}
			}
		}

		finalList += "\n['"+champ+"']={";
		finalList += "\n  ['mostUsed']={" + hu.toString(); // 'Q','E','W','Q','Q','R','Q','E','Q','E','R','E','E','W','W','R','W','W'
		finalList += "},\n  ['highestRate']={" + hw.toString(); // 'Q','E','W','Q','Q','R','Q','E','Q','E','R','E','E','W','W','R','W','W'
		finalList += "}\n},";

		c += 1;

		if (c == champions.length) {
			finalList += "\n}\n\nreturn levelPresets"

			var fs = require('fs');
			fs.writeFile("levelPresests.lua", finalList, function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    console.log("The file was saved!");
			}); 
		} else {
			reqChamp(champions[num], num + 1)
		}
	});

	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}

reqChamp(champions[0], 1);
