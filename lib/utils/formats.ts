export const cast_datetime = (args: string, format_code: string) => {
    const datetime = new Date(args);
    let formattedDatetime = '';

    switch (format_code.toLowerCase()) {
        case 'us':
            formattedDatetime = datetime.toLocaleString('en-US');
            break;
        case 'uk':
            formattedDatetime = datetime.toLocaleString('en-GB');
            break;
        case 'iso':
            formattedDatetime = datetime.toISOString();
            break;
        case 'de':
            formattedDatetime = datetime.toLocaleString('de-DE');
            break;
        default:
            formattedDatetime = args;
            break;
    }

    return formattedDatetime;
}
export const cast_date = (args: string, format_code:string) => {
    const date = new Date(args);
    let formattedDate = '';

    switch (format_code.toLowerCase()) {
        case 'us':
            formattedDate = date.toLocaleDateString('en-US');
            break;
        case 'uk':
            formattedDate = date.toLocaleDateString('en-GB');
            break;
        case 'iso':
            formattedDate = date.toISOString();
            break;
        case 'de':
            formattedDate = date.toLocaleDateString('de-DE');
            break;
        case 'time-us':
            formattedDate = date.toLocaleTimeString('en-US');
            break;
        case 'time-uk':
            formattedDate = date.toLocaleTimeString('en-GB');
            break;
        case 'time-de':
            formattedDate = date.toLocaleTimeString('de-DE');
            break;
        default:
            formattedDate = args;
            break;
    }

    return formattedDate;
}



export const date_seconds_from_now = (seconds: number) => {
    const now = new Date(); // Current date and time
    const futureDate = new Date(now.getTime() + seconds * 1000);
    return futureDate.toISOString();

}
export function isCharInAlphabet(char: string, alphabet: string): string {
    return alphabet.includes(char) ? char : 'Slug';
}
export const alpha_24 = 'abcdefghijklmnopqrstuvwxyz';