export class User {
    public name: string | undefined;
    public discriminator: string | undefined;
    public avatar: string | undefined;
    public id: string;
    
    constructor(id: string) {
        this.id = id;
    }

    public async fetchFromDstnt(): Promise<this> {
        const user = await fetch(`https://dcdn.dstn.to/profile/${this.id}`).catch(() => null);

        if (user?.status !== 200) return this;

        const userObject = await user.json() as { user: { id: string, username: string, avatar: string, discriminator: string } };

        this.name = userObject.user.username;
        this.avatar = userObject.user.avatar;
        this.discriminator = userObject.user.discriminator;

        return this;
    }

    private async fetch(): Promise<this> {
        const user = await fetch(`https://discord.com/api/users/${this.id}`, {
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`
            }
        }).catch(() => null);

        if (user?.status !== 200) return await this.fetchFromDstnt();

        const userObject = await user.json() as { id: string, username: string, avatar: string, discriminator: string };

        this.name = userObject.username;
        this.avatar = userObject.avatar;
        this.discriminator = userObject.discriminator;

        return this;
    }

    public static async fromId(id: string): Promise<User> {
        return new User(id).fetch();
    }
}
