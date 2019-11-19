import csvToJson from "csvtojson";
import {Converter} from "csvtojson/v2/Converter";

export function readAsJson(filePath: string): Converter
{
    return csvToJson({delimiter: "\t"}).fromFile(filePath);
}
