import IPlayer from "./Player";

interface IRoom {
    actualUsers: number;
    realTimeRef: string;
    roomAdmins: IPlayer[];
    roomCapacity: 30;
    roomCodeSimplified: string;
    roomOwner: IPlayer;
    votingType: {
        description: string;
        scaleValues: string[];
        title: string;
    }
}

export default IRoom