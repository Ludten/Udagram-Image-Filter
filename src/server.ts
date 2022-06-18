import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
	app.get( "/filteredimage/", async ( req: Request, res: Response ) => {
    const image_url = req.query.image_url as string;

    if ( !image_url ) {
      return res.status(400)
                .send(`image url is required`);
    };

    var validUrl = require('valid-url');
    if (!validUrl.isUri(image_url)) {
      return res.status(400)
                .send(`Enter a valid url`);
    }

    // call filterImageFromURL(image_url) to filter the image
    let filteredpath: string;
    try {
      filteredpath = await filterImageFromURL(image_url);
    } catch(err) {
      console.error(err);
      return res.status(422)
                .send(`Error while processing image`);
    }

    //send the resulting file in the response
    res.status(200).sendFile(filteredpath);

    res.on('end', () => {
      try {
        deleteLocalFiles([filteredpath]);;
      } catch(err) {
        console.error(err);
        return res.status(422)
      }
    });
  });
  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();