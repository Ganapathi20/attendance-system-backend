import {NextFunction, Request, RequestHandler, Response} from "express"

const checkBodyParams = (...names : string[])=>{
    return (request: Request, response: Response, next:NextFunction)=>{
        let absent: string[] = [];
        for(let name of names){
            if(request.body[name] === undefined){
                absent.push(name);
            }
        }
        if(absent.length===0){
            next();
        }
        else{
            return response.status(400).json({msg:`${absent.join(', ')} should be present in request body`});
        }
    }
}

export default checkBodyParams;