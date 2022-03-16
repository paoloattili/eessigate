export function dateToStringFormatDDMMYYYY(d: Date): string{
    return ('0' + d.getDate()).slice(-2) + '/' + ('0'+(d.getMonth()+1)).slice(-2) + '/' + d.getFullYear();
}

export function dateToStringFormatYYYYMMDDHHMM(d: Date): string{
    return d.getFullYear() + '-' + ('0'+(d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}
