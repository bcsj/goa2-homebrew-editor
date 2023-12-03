
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

function get_stat(type, profile, color) {
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

/*
 * A group gathers cards together. 
 * It can represent a hero, or just a miscellaneous collection.
 */
var group = {
    id: 0,
    type: 'hero',
    name: 'A Brawling hero',
    cards: [0],
    statProfile: {
        initiative: 0,
        attack: 0,
        defense: 0,
        movement: 0
    }
};

/*
 * A branch is a subgroup of 1-3 connected cards.
 * They represent the same card's development as it is upgraded.
 * A branch can be rendered to each of its individual cards.
 */
var branch = {
    statType: 'profile/inherit/custom',
    statProfile: {
        initiative: [9, 9, 10],
        attack: [5, 6, 6],
        defense: [6, 6, 7],
        movement: 4,
    },
    color: "red",
    supertype: "nonbasic",   // basic, nonbasic, ultimate
    tier: [0, 1, 1],         // true or false determining which tiers of the branch exist
    initiative: 0,           // A stat is either a uniform value, or an array of 3 individual values
    attack: 0,               // If the statType is profile or inherit, the values of the stat-fields
    defense: 0,              // becomes modifiers to be added to the applied profile.
    movement: 0,
    type: "attack",          // type can also be an array, if the type changes, e.g. defense->defense/skill.
    subtype: "none",         // Anything other than "range" or "radius" is the same as "none".
    subtypevalue: 0,         // this value is ignored unless subtype is "range" or "radius"
    name: ["A", "B", "C"],
    text: "Target a unit adjacent to you. After the attack: Move up to {I:1}{II:2}{III:3} spaces to a space adjacent to the space where the target was.",
    item: ["", "defense", "radius"]
}
/* TEXT-FIELD parser:
 * The {X:<...>} syntax is kept for tier X only.
 */

/* 
 * About statTypes:
 *  Inherit - uses the statProfile of the group.
 *  Profile - uses the statProfile attached to the card.
 *  Custom - uses the values attacked to the card.
 *
 * For 'inherit' and 'profile' the cards own stat values 
 * will act as modifiers to the profile value. 
 * Whether a card has an action, e.g. attack or movement
 * is controlled by whether the card object has the 
 * corresponding key.
 */
var cards = {
    0: {
        id: 0,
        groupId: 0,
        statType: 'profile/inherit/custom',
        statProfile: {
            initiative: 0,
            attack: 0,
            defense: 0,
            movement: 0
        },
        color: "red",
        supertype: "nonbasic",
        tier: "III",
        initiative: 9,
        attack: 3,
        defense: 6,
        movement: 4,
        type: "attack",
        subtype: "range",
        subtypevalue: 2,
        name: "Repeater Shot",
        text: "Target a unit in range. After the attack, **end of turn:** Another hero in range discards a card, if able.",
        item: "range"
    }
};


/*
 * GLOBAL SETTINGS
 * Define aspects of the template
 *
 */
var globalSettings = {
    textBox: {
        width: {
            default: 500,
            value: 500
        },
        wordSpacing: {
            default: 6.5,
            value: 6.5
        },
        lineHeight: {
            default: 34,
            value: 34
        },
        fontSize: {
            default: 26,
            value: 26
        },
        verticalPadding: {
            default: 20,
            value: 20
        }
    },
    banner: {
        topPadding: {
            default: 15,
            value: 15
        },
        fontFamily: {
            default: "ModestoPosterW05-Regular",
            value: "ModestoPosterW05-Regular"
        },
        initiativeFontSize: {
            default: 100,
            value: 100
        },
        secondaryActionFontSize: {
            default: 65,
            value: 65
        },
    },
    numberFontFamily: {
        default: "ModestoPosterW05-Regular",
        value: "ModestoPosterW05-Regular"
    },
    nameFontFamily: {
        default: "ModestoPosterW05-Regular",
        value: "ModestoPosterW05-Regular"
    },
    textFontFamily: {
        default: "Arial",
        value: "Arial"
    }

};

/*
 * COLORS
 * Define the template primary colors
 *
 */
var cardColors = {
    red: "#c51a0d",
    blue: "#1b3eb6",
    green: "#64b637",
    gold: "#d4aa14",
    silver: "#aaaaaa",
    purple: "#8148ae"
};

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}