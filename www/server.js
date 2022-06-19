"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
    // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
    // GET /filteredimage?image_url={{URL}}
    // endpoint to filter an image from a public url.
    app.get("/filteredimage/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const image_url = req.query.image_url;
        if (!image_url) {
            return res.status(400)
                .send(`image url is required`);
        }
        ;
        var validUrl = require('valid-url');
        if (!validUrl.isUri(image_url)) {
            return res.status(400)
                .send(`Enter a valid url`);
        }
        // call filterImageFromURL(image_url) to filter the image
        let filteredpath;
        try {
            filteredpath = yield util_1.filterImageFromURL(image_url);
        }
        catch (err) {
            console.error(err);
            return res.status(422)
                .send(`Error while processing image`);
        }
        //send the resulting file in the response
        res.status(200).sendFile(filteredpath);
        res.on('finish', () => {
            try {
                util_1.deleteLocalFiles([filteredpath]);
                ;
            }
            catch (err) {
                console.error(err);
                return res.status(422);
            }
        });
    }));
    /**************************************************************************** */
    //! END @TODO1
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send("Welcome to Ludten's image filter.\nTry GET /filteredimage?image_url={{}}");
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map