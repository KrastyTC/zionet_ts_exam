export function getRandomValueFromArray(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandomBirthDate(): Date {
    const year: number = (Math.floor(Math.random()*(2005 - 1990)))  + 1990;
    const month: number = Math.floor(Math.random()*(12));
    const day: number = Math.floor(Math.random()*(29));
    return new Date(year, month, day);
}

export function getFullName(firstName:string,lastName:string):string{
    return `${firstName} ${lastName}`
}