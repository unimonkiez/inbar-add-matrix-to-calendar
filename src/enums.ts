export enum eMeet {
    lecture,
    exercise,
    lab,
    freeHours,
};
export enum eSelectPick {
    all = 1,
    multi = 2,
}
export const textToEMeet: { [key: string]: eMeet } = {
    'הרצאה': eMeet.lecture,
    'תרגיל': eMeet.exercise,
    'מעבדה': eMeet.lab,
    'ש.מחלקה': eMeet.freeHours,
};

export const eMeetText: { [key in eMeet]: string } = {
    [eMeet.lecture]: 'הרצאה',
    [eMeet.exercise]: 'תרגיל',
    [eMeet.lab]: 'מעבדה',
    [eMeet.freeHours]: '',
};
export const eSelectPickText: { [key in eSelectPick]: string } = {
    [eSelectPick.all]: 'הכל',
    [eSelectPick.multi]: 'בחירה',
};