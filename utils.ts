export function tuplecmp(expected:[number,number],actual:[number,number]): boolean{
    return expected[0] === actual[0] && expected[1] === actual[1];
}

export function printoutSelection<T>(selection: (T | null)[]) {
    let i = 1;
    for(const item of selection) {
        if(item == null) {
            return;
        }
        console.log(`${i}) ${item}`);
        i++;
    }
}