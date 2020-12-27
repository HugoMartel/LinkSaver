// server.js
// where the node app starts

// init project
import http from "http";
import url from "url";
import { File } from "./js/file.js"

const host = 'localhost';
const port = 8000;

let indexHtmlLinks;

let fileContent = {
    "titles": [],
    "links": []
}

const requestListener = function(req, res) {
    if (req.url != "/favicon.ico") {

        // * Check if the request contains a special action
        if (req.url != "/") {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200, { Location: 'http://localhost:8000/' });

            let q = url.parse(req.url, true).query;
            let mode = q.mode;
            let title = q.title;
            let link = q.link;
            //console.log(mode + ", " + title + ": " + link);
            if (mode == undefined && title != "" && link != "")
                File.add(title, link);
            else if (mode == "clear")
                File.clear();
            else if (mode == "del" && title != "" && link != "")
                File.del(title, link, fileContent);

            res.end('<html><script>window.location.replace("http://localhost:8000/");</script></html>');
        } else {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200, { Location: 'http://localhost:8000/' });
            // * Build the html
            fileContent.titles = [];
            fileContent.links = [];
            File.getTxt(fileContent);
            indexHtmlLinks = "";
            for (let i = 0; i < fileContent.links.length; ++i) {
                indexHtmlLinks += `<li><a class="link" href="${fileContent.links[i]}" target="_blank">${fileContent.titles[i]}</a>`;
                indexHtmlLinks += `<form class="link-form" action="" method="GET"><input name="title" style="display: none;" type="text" value="${fileContent.titles[i]}" />`;
                indexHtmlLinks += `<input name="link" style="display: none;" type="text" value="${fileContent.links[i]}" />`;
                indexHtmlLinks += `<button id="del-link" type="submit" value="del" name="mode">x</button></form></li>`;
            }

            res.end(File.getHtml()[0] + indexHtmlLinks + File.getHtml()[1]);
        }
    }
};

let server = http.createServer(requestListener);

File.setupHtml();

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

//File.add("Shakespeare", "https://fr.wikipedia.org/wiki/William_Shakespeare");