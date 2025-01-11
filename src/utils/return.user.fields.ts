import { User } from '../schemas/user.schema';

export const returnUserFields = (user: User) => {
    return { id: user.id, name: user.name, username: user.username };
};