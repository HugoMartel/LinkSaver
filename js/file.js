import fs from "fs";

export let File = function() {

    /*
     * ADD 
     */
    function addCall(fileName, title, link) {
        //Writes the lines into the specified file
        //could have used fs.appendFile(...);
        let content = title + "\n" + link + "\n";
        fs.writeFileSync(fileName, content, { encoding: 'utf8', flag: 'a' });
        console.log("The file has been saved!");
    }

    /*
     * DEL 
     */
    function delCall(fileName, title, link, fileContent) {
        let indexToRemove = fileContent.titles.findIndex(a => title == a);
        //console.log(indexToRemove);
        if (indexToRemove == fileContent.links.findIndex(a => link == a) && indexToRemove != -1) {
            fileContent.links.splice(indexToRemove, 1);
            fileContent.titles.splice(indexToRemove, 1);
        }
        let newFileString = "";
        for (let i = 0; i < fileContent.titles.length; ++i)
            newFileString += fileContent.titles[i] + "\n" + fileContent.links[i] + "\n";
        fs.writeFileSync(fileName, newFileString);
    }

    /*
     * CLEAR 
     */
    function clearCall(fileName) {
        fs.writeFile(fileName, "", { encoding: 'utf8', flag: 'w' }, err => {
            if (err) throw err;
            console.log("The file has been cleared!");
        })
    }


    /*
     * SETUP HTML 
     */
    let htmlToReturn = ["", ""];

    function setupHtmlCall(pathTop, pathBottom) {
        fs.readFile(pathTop, (err, content) => {
            if (err) throw err;
            htmlToReturn[0] = content.toString();
        });
        fs.readFile(pathBottom, (err, content) => {
            if (err) throw err;
            htmlToReturn[1] = content.toString();
        });
    }

    /*
     * GET TXT 
     */
    function getTxtCall(path, fileContent) {
        let fullFile = fs.readFileSync(path).toString().trim().split("\n");

        for (let i = 0; i < fullFile.length; ++i) {
            if (i % 2)
                fileContent.links.push(fullFile[i]);
            else
                fileContent.titles.push(fullFile[i]);
        }
        //console.log(fileContent);
    }

    return {
        add: (title, link) => addCall("input.txt", title, link),
        del: (title, link, content) => delCall("input.txt", title, link, content),
        setupHtml: () => setupHtmlCall("./indexTop.html", "./indexBottom.html"),
        getHtml: () => htmlToReturn,
        clear: () => clearCall("input.txt"),
        getTxt: (content) => getTxtCall("input.txt", content),
    }
}();