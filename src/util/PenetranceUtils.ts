import {PenetranceLevel} from "../model/Penetrance";

export function getPenetranceLevel(penetrance?: string): PenetranceLevel | undefined
{
    switch (penetrance?.toLowerCase()) {
        case 'uncertain':
            return PenetranceLevel.Uncertain;
        case 'low':
            return PenetranceLevel.Low;
        case 'moderate':
            return PenetranceLevel.Moderate;
        case 'high':
            return PenetranceLevel.High;
        default:
            return undefined;
    }
}
