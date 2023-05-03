export function tuplecmp(expected:[number,number],actual:[number,number]): boolean{
    return expected[0] === actual[0] && expected[1] === actual[1];
}