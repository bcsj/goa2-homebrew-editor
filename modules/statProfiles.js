
const statProfileNames = [
    'very poor',
    'poor',
    'below average',
    'average',
    'above average',
    'good',
    'very good',
    'exceptional'
];

const statProfiles = {
    movement: { // [Red, Blue, Green, Gold]
        'very poor':    [3, 2, 2, 1],
        'poor':         [4, 2, 2, 1],
        'below average':[3, 3, 2, 1],
        'average':      [4, 3, 2, 1],
        'above average':[5, 3, 2, 1],
        'good':         [4, 3, 3, 1],
        'very good':    [5, 3, 3, 1],
        'exceptional':  [5, 3, 3, 2]
    },
    attack: { // [Red1,2,3; Gold]
        'very poor':    [4, 4, 5,   1],
        'poor':         [4, 5, 5,   2],
        'below average':[5, 5, 6,   2],
        'average':      [5, 5, 6,   3],
        'above average':[5, 6, 6,   3],
        'good':         [6, 6, 7,   3],
        'very good':    [6, 6, 7,   4],
        'exceptional':  [6, 7, 7,   4]
    },
    defense: { // [Red1,2,3; Blue1,2,3; Green1,2,3; Silver; Gold]
        'very poor':    [5, 5, 6,   4, 4, 5,   1, 2, 2,   1,   1],
        'poor':         [5, 6, 6,   4, 5, 5,   2, 2, 3,   2,   1],
        'below average':[6, 6, 7,   4, 5, 5,   2, 3, 3,   2,   2],
        'average':      [6, 6, 7,   5, 5, 6,   3, 3, 4,   2,   2],
        'above average':[6, 7, 7,   5, 6, 6,   3, 3, 4,   3,   2],
        'good':         [7, 7, 8,   5, 6, 6,   3, 4, 4,   3,   2],
        'very good':    [7, 7, 8,   6, 6, 7,   3, 4, 4,   3,   3],
        'exceptional':  [7, 8, 8,   6, 7, 7,   4, 4, 5,   4,   3]
    },
    initiative: { // [Gold; Blue1,2,3; Red1,2,3; Green1,2,3]
        'very poor':    [11,    8,  9,  9,   7, 7,  8,   6, 5, 5],
        'poor':         [11,    9,  9, 10,   7, 7,  8,   5, 5, 4],
        'below average':[11,    9, 10, 10,   7, 8,  8,   5, 4, 4],
        'average':      [11,    9, 10, 10,   8, 8,  9,   4, 4, 3],
        'above average':[12,    9, 10, 10,   8, 9,  9,   4, 3, 3],
        'good':         [12,   10, 10, 11,   8, 9,  9,   3, 3, 2],
        'very good':    [12,   10, 10, 11,   9, 9, 10,   3, 2, 2],
        'exceptional':  [13,   10, 11, 11,   9, 9, 10,   2, 2, 1]
    }
};

export function get(type, profile, color) {
    type = type.toLowerCase();
    profile = profile.toLowerCase();
    color = color.toLowerCase();
    switch (type) {
        case 'movement':
            const key = {'red': 0, 'blue': 1, 'green': 2, 'gold': 3, 'silver': -1};
            switch (color) {
                case 'red':
                    return statProfiles[type][profile][0];
                case 'blue':
                    return statProfiles[type][profile][1];
                case 'green':
                    return statProfiles[type][profile][2];
                case 'gold':
                    return statProfiles[type][profile][3];
                case 'silver':
                    return -1;
            }
        case 'attack':
            switch (color) {
                case 'red':
                    return statProfiles[type][profile].slice(0, 3);
                case 'gold':
                    return statProfiles[type][profile][3];
                default:
                    return 0;
            }
        case 'defense':
            switch (color) {
                case 'red':
                    return statProfiles[type][profile].slice(0, 3); 
                case 'blue':
                    return statProfiles[type][profile].slice(3, 6); 
                case 'green':
                    return statProfiles[type][profile].slice(6, 9); 
                case 'silver':
                    return statProfiles[type][profile][9]; 
                case 'gold':
                    return statProfiles[type][profile][10];
            }
        case 'initiative':
            switch (color) {
                case 'gold':
                    return statProfiles[type][profile][0];
                case 'blue':
                    return statProfiles[type][profile].slice(1, 4);
                case 'red':
                    return statProfiles[type][profile].slice(4, 7);
                case 'green':
                    return statProfiles[type][profile].slice(7, 10);
                default:
                    return 0;
            }
    }
}