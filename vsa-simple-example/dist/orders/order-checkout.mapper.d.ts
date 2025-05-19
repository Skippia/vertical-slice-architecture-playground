import { AutomapperProfile } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
export declare class OrderCheckoutProfile extends AutomapperProfile {
    constructor(mapper: Mapper);
    get profile(): (mapper: Mapper) => void;
}
