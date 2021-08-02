import { Coords } from "./coords.interface";
import { User } from "src/users/entities/user.entity";

export interface CoordsAndUser {
    coords: Coords,
    user: User
}