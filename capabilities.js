const capability = {
	"browserName": "Chrom",
	"browserVersion": "126",
	"LT:Options": {
		"username": "ihor.bezeka",
		"accessKey": "EaxeGHtAOKgDGJn4unvpTIo9UVib43mg3MXMHztSNP8M19lJ2E",
		"platformName": "Windows 10",
		"build": "Colorjob Main Auto tests",
		"project": "Colorjob",
		"name":'login',
		"console": true,
		"network": true,
		"w3c": true,
		"plugin": "node_js-mocha",
		"chromeOptions" : {
               "args" : ["incognito"]
   			}
	},
	"lambda:userFiles": [
      "JavaScript.png",
      "doc.pdf",
      "doc.zip",
	  "video.MP4"
    ],
}
module.exports = {capability}