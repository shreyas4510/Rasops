import { USER_ROLES } from './auth';

export function getHotelUpdateDifference(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (JSON.stringify(keys1) !== JSON.stringify(keys2)) {
        console.error('Get hotel update difference object keys are different');
        return;
    }

    return keys2.reduce((cur, next) => {
        if (String(next).toUpperCase() === USER_ROLES[1]) {
            const removed = obj1[next].filter((item) => !obj2[next].includes(item));
            const added = obj2[next].filter((item) => !obj1[next].includes(item));
            cur.manager = {
                removed,
                added
            };
        } else {
            if (obj1[next] !== obj2[next]) {
                cur[next] = obj2[next];
            }
        }
        return cur;
    }, {});
}
