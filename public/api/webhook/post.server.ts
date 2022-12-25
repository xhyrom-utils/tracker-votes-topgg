import { BuchtaRequest as Request, BuchtaResponse as Response } from "buchta";
import { User } from "../../../structs/User";

const value = async(req: Request, res: Response) => {
    const authorization = req.headers.get("authorization");
    if (authorization !== process.env.AUTHORIZATION_TOKEN) {
        res.setStatus(403);
        return res.send("Invalid authorization token.");
    };

    const id = req.query.get("id");

    switch (id) {
        case "roles-bot": {
            const body = await req.json() as { user: string };
            const user = await User.fromId(body.user);

            fetch("https://discord.com/api/webhooks/1056340153863516191/dpxyCfGz4L_0CsPyHdBj3_pjfcg0SsQxC8smvNQfqWfbXYJoJzjXCNgOeZA1XZ0MfN8a?thread_id=1056335518855602257", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: `User <@${body.user}> voted for the bot on top.gg!`,
                    username: `${user.name ?? "??"}#${user.discriminator ?? "0000"}`,
                    avatar_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                })
            })
        }
    }
    res.send("Hello World!");
}

export default value;