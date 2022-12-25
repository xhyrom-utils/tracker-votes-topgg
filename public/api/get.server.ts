import { BuchtaRequest as Request, BuchtaResponse as Response } from "buchta";

export default function (req: Request, res: Response) {
    res.send("Hello World!");
}