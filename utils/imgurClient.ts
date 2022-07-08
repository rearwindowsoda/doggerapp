import ImgurClient from "imgur";
import {CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN} from "../config/config";
import {createReadStream} from "fs";
import {ValidationError} from "./errors";
//@TODO Fix this type
export async function imgurClient(uploadPath: string){

    try{
        const client = new ImgurClient({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
        });

        return await client.upload({
            image: createReadStream(uploadPath),
            type: 'stream',
        });


    }catch(e){
        throw new ValidationError('Something went wrong, sorry');
    }
}