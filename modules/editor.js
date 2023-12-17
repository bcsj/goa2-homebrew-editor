import * as stats from "./statProfiles.js";
import * as colorTools from "./colors.js";

//=========================================================
// EDITOR DOM
export const container = document.getElementsByClassName("container");
export const input_card_id = document.getElementById("card-id");
export const select_supertype = document.getElementById("supertype");
export const select_stat_type = document.getElementById("stat-type");
export const select_card_color = document.getElementById("card-color");
export const input_tier_toggle = document.getElementsByName("tier-toggle");
export const input_features_toggle = document.getElementsByName("features-toggle");

export const select_stat_profile = function (stat) { return document.getElementById(stat + "-profile"); };
export const input_stats = function (stat) { return [
    document.getElementById(stat + "-tier-I"),
    document.getElementById(stat + "-tier-II"),
    document.getElementById(stat + "-tier-III")
]; };

export const input_stat_toggle = function (stat) { return document.getElementById(stat + "-toggle"); }

export const select_type = document.getElementById("card-type");
export const select_type_tier_ii = document.getElementById("card-type-tier-II");
export const select_type_tier_iii = document.getElementById("card-type-tier-III");

export const input_subtype = document.getElementsByName("subtype");
export const input_subtype_value = [
    document.getElementById("subtype-value-tier-I"),
    document.getElementById("subtype-value-tier-II"),
    document.getElementById("subtype-value-tier-III")
];

export const input_name = [
    document.getElementById("name-tier-I"),
    document.getElementById("name-tier-II"),
    document.getElementById("name-tier-III")
];
export const input_textbox = document.getElementById("textbox");

export const input_tier_ii_item = document.getElementsByName("tier-II-item");
export const input_tier_iii_item = document.getElementsByName("tier-III-item");

//=========================================================
// GET BRANCH DATA
export function get_branch() {
    var branch = {};
    branch['statType'] = select_stat_type.value.toLowerCase();
    branch['statProfile'] = {};
    ['initiative', 'attack', 'defense', 'movement'].forEach(function (stat) {
        branch['statProfile'][stat] = select_stat_profile(stat).value.toLowerCase();
    });
    branch['color'] = select_card_color.value.toLowerCase();
    branch['supertype'] = select_supertype.value.toLowerCase();
    branch['tier'] = [
        input_tier_toggle[0].checked,
        input_tier_toggle[1].checked,
        input_tier_toggle[2].checked
    ];
    ['initiative', 'attack', 'defense', 'movement'].forEach(function(stat) {
        let check = document.getElementById(stat + "-toggle").checked;
        if (check) {
            branch[stat] = [
                document.getElementById(stat + '-tier-I').value,
                document.getElementById(stat + '-tier-II').value,
                document.getElementById(stat + '-tier-III').value
            ];
            for (var i = 0; i < 3; i++) {
                branch[stat][i] = branch[stat][i] == '-' ? '' : branch[stat][i];
            }
        }
    });
    branch['type'] = select_type.value.toLowerCase();
    if (branch['type'] == "defense/skill")
        branch['type'] = "defenseSkill";
    if (document.getElementById("features-advanced").checked) {
        branch['type'] = [
            branch['type'],
            select_type_tier_ii.value.toLowerCase(),
            select_type_tier_iii.value.toLowerCase()
        ];
        if (branch['type'][1] == "defense/skill")
            branch['type'][1] = "defenseSkill";
        if (branch['type'][2] == "defense/skill")
            branch['type'][2] = "defenseSkill";
    }

    branch['subtype'] = 'none';
    ['radius', 'range'].forEach(function (subtype) {
        let check = document.getElementById('subtype-' + subtype).checked;
        branch['subtype'] = check ? subtype : branch['subtype'];
    });
    branch['subtypevalue'] = [
        document.getElementById('subtype-value-tier-I').value,
        document.getElementById('subtype-value-tier-II').value,
        document.getElementById('subtype-value-tier-III').value
    ];
    branch['name'] = [
        document.getElementById('name-tier-I').value,
        document.getElementById('name-tier-II').value,
        document.getElementById('name-tier-III').value
    ];
    branch['text'] = document.getElementById('textbox').value;
    branch['item'] = ["","",""];
    input_tier_ii_item.forEach(function (e) {
        branch['item'][1] = e.checked ? e.value.toLowerCase() : branch['item'][1];
    });
    input_tier_iii_item.forEach(function (e) {
        branch['item'][2] = e.checked ? e.value.toLowerCase() : branch['item'][2];
    });

    branch['id'] = input_card_id.value;

    return branch;
}

//=========================================================
// SET BRANCH DATA
String.prototype.capitalize = function() {
    return this.slice(0, 1).toUpperCase() + this.slice(1);
}

String.prototype.capitalizeAll = function(c = ' ') {
    let arr = this.split(c);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].slice(0,1).toLocaleUpperCase() + arr[i].slice(1);
    }
    return arr.join(c);
}

export function set_branch(branch) {
    select_stat_type.value = branch['statType'].capitalize();
    ['initiative', 'attack', 'defense', 'movement'].forEach(function (stat) {
        let tmp =  branch['statProfile'][stat].capitalizeAll();
        select_stat_profile(stat).value = tmp;
    });
    select_card_color.value = branch['color'].capitalize();
    select_supertype.value = branch['supertype'].capitalize();
    
    console.log(branch['tier'])
    input_tier_toggle[0].checked = branch['tier'][0];
    input_tier_toggle[1].checked = branch['tier'][1];
    input_tier_toggle[2].checked = branch['tier'][2];

    ['initiative', 'attack', 'defense', 'movement'].forEach(function(stat) {
        if (Object.keys(branch).indexOf(stat) > -1) {
            document.getElementById(stat + "-toggle").checked = true;
            document.getElementById(stat + '-tier-I')  .value = branch[stat][0];
            document.getElementById(stat + '-tier-II') .value = branch[stat][1];
            document.getElementById(stat + '-tier-III').value = branch[stat][2];
        } else {
            document.getElementById(stat + "-toggle").checked = false;
        }
    });

    if (typeof(branch['type']) == 'object') {
        document.getElementById("features-advanced").checked = true;
        
        if (branch['type'][0] == "defense/skill") {
            select_type.value = "Defense/Skill";
        } else {
            select_type.value = branch['type'][0].capitalize();
        }
        
        if (branch['type'][1] == "defense/skill") {
            select_type_tier_ii.value = "Defense/Skill";
        } else {
            select_type_tier_ii.value = branch['type'][1].capitalize();
        }

        if (branch['type'][2] == "defense/skill") {
            select_type_tier_iii.value = "Defense/Skill";
        } else {
            select_type_tier_iii.value = branch['type'][2].capitalize();
        }
        
    } else {
        if (branch['type'] == "defense/skill") {
            select_type.value = "Defense/Skill";
        } else {
            select_type.value = branch['type'].capitalize();
        }
    }

    ['none', 'radius', 'range'].forEach(function (subtype) {
        if (branch['subtype'] == subtype) {
            document.getElementById('subtype-' + subtype).checked = true;
        }
    });
    document.getElementById('subtype-value-tier-I').value = branch['subtypevalue'][0];
    document.getElementById('subtype-value-tier-II').value = branch['subtypevalue'][1];
    document.getElementById('subtype-value-tier-III').value = branch['subtypevalue'][2];

    document.getElementById('name-tier-I').value = branch['name'][0];
    document.getElementById('name-tier-II').value = branch['name'][1];
    document.getElementById('name-tier-III').value = branch['name'][2];

    document.getElementById('textbox').value = branch['text'];

    input_tier_ii_item.forEach(function (e) {
        if (branch['item'][1] == e.value.toLowerCase()) {
            e.checked = true;
        }
    });
    input_tier_iii_item.forEach(function (e) {
        if (branch['item'][2] == e.value.toLowerCase()) {
            e.checked = true;
        }
    });

    input_card_id.value = branch['id'];
}

//=========================================================
// GET STAT FROM PROFILE AND MODIFIER
function getStat(profileValue, modifierValue) {
    let val = profileValue;
    let modval = modifierValue;

    if (modval == '!') {
        val = modval;
        return val
    }

    let mod_pm = modval.slice(-1) == '+' ? '+' : '';
    mod_pm = modval.slice(-1) == '-' ? '-' : mod_pm;
    modval = mod_pm.length > 0 ? modval.slice(0, -1) : modval;
    modval = modval == '' ? '0' : modval;
    val += parseInt(modval);
    val = val < 0 ? '-' : val + mod_pm;

    return val;
}

//=========================================================
// GET CARD
export function getCard(branch, tier) {
    if (typeof(tier) == 'string') {
        tier = tier == 'I' ? 0 : tier == 'II' ? 1 : 2; 
    }
    let card = {};
    card['color'] = branch['color'];
    card['supertype'] = branch['supertype'];
    card['tier'] = "";
    if (branch['supertype'] == "ultimate") {
        card['tier'] = "IV";
    } else if (branch['supertype'] == "nonbasic") {
        card['tier'] = "I".repeat(tier+1);
    }
    if (typeof(branch['type']) == "object") {
        card['type'] = branch['type'][tier];
    } else {
        card['type'] = branch['type'];
    }
    card['subtype'] = branch['subtype'];
    card['subtypevalue'] = branch['subtype'] != "none" ? branch['subtypevalue'] : "";
    if (typeof(card['subtypevalue'] == 'object')) {
        card['subtypevalue'] = card['subtypevalue'][tier];
    }
    ['initiative', 'attack', 'defense', 'movement'].forEach(function (stat) {
        if (Object.keys(branch).indexOf(stat) > -1) {
            
            let val = [0, 0, 0];
            let profile = branch['statProfile'][stat];
            if (profile != 'custom') {
                val = stats.get(stat, branch['statProfile'][stat], branch['color']);
                if (typeof(val) == "number") {
                    val = [val, val, val];
                }
            }
            
            if (typeof(branch[stat]) == 'object') {
                card[stat] = branch[stat][tier];
            } else {
                card[stat] = branch[stat];
            }
            card[stat] = getStat(val[tier], card[stat]);
            if (card[stat] == '-')
                delete card[stat];
        }
    });

    ['name', 'item'].forEach(function (prop) {
        if (Object.keys(branch).indexOf(prop) > -1) {
            if (typeof(branch[prop]) == 'object') {
                card[prop] = branch[prop][tier];
            } else {
                card[prop] = branch[prop];
            }
            if (card[prop] == '') {
                delete card[prop];
            }
        }
    });
    var tier_str = 'I'.repeat(tier+1);
    card['text'] = textbox_parser(branch['text'], tier_str, false);
    return card;
}

//=========================================================
// TEXTBOX-PARSER
export function textbox_parser(str, tier, html = true) {
    var tiers = ['I','II','III'];
    const idx = tier.length - 1;
    tiers[idx] = '!' + tiers[idx]; 

    const rem = new RegExp('{(' + tiers.join('|') + '):[^}]*}', 'g');
    const all = /{([^}/]*)\/([^}/]*)\/([^}/]*)}/g;
    const all_variant = /{([^}/]*)\/([^}/]*)}/g;
    const keep = /{!?(I|II|III):([^}]*)}/g;
    const bold = /\*\*([^*]*)\*\*/g;
    const bullet = /(?<!\*)(\*)\s/g;
    const dash = /(\-)/g;
    const newline = /(\n)/g;

    str = str.replace(rem, '');
    str = str.replace(all, '$' + (idx+1));
    str = str.replace(all_variant, idx > 0 ? '$' + idx : '');
    str = str.replace(keep, '$2');
    if (html) str = str.replace(bold, '<b>$1</b>');
    str = str.replace(bullet, '● ');
    str = str.replace(dash, '—');
    if (html) 
        str = str.replace(newline, '<br />');
    return str.trim();
}

//=========================================================
// GUI UPDATERS
export function get_feature_level() {
    const normal = document.getElementById("features-normal").checked;
    if (normal) return "normal";
    const advanced = document.getElementById("features-advanced").checked;
    if (advanced) return "advanced";
}

function guiSetColorOpts(colors) {
    const color_opts = select_card_color.children;
    const color = select_card_color.value.toLowerCase();

    for (var i = 0; i < color_opts.length; i++) {
        let val = color_opts[i].value.toLowerCase();
        if (colors.includes(val)) { 
            color_opts[i].hidden = false; 
        } else {
            color_opts[i].hidden = true;
            if (color == val) { 
                select_card_color.value = colors[0].capitalize(); 

                // TODO: CONSIDER CHANGING THIS???
                let event = new Event("change");
                select_card_color.dispatchEvent(event);
            }
        }
    }
}

function guiToggleTiers(tiers) {
    input_tier_toggle.forEach(function (ee, i) {
        //ee.checked = tiers[i];

        // TODO: CONSIDER CHANGING THIS???
        let event = new Event("change");
        ee.dispatchEvent(event);
    });
}

function guiSetAttributes(attributes, revealIni = false) {
    ['attack','defense','movement','initiative'].forEach(function (stat) {
        let ee = input_stat_toggle(stat);
        ee.checked = attributes.includes(stat);

        // TODO: CONSIDER CHANGING THIS???
        let event = new Event("change");
        ee.dispatchEvent(event);
        
        if (stat == 'initiative') {
            ee.nextElementSibling.style.display = revealIni ? "flex" : "none";
        }
    });
}

function guiSetTypeOpts(types) {
    const type_opts = select_type.children;
    const type = select_type.value.toLowerCase();
    
    for (var i = 0; i < type_opts.length; i++) {
        let val = type_opts[i].value.toLowerCase();
        if (types.includes(val)) { 
            type_opts[i].hidden = false; 
        } else {
            type_opts[i].hidden = true;
            if (type == val) { 
                select_type.value = types[0].capitalize(); 
                
                // TODO: CONSIDER CHANGING THIS???
                let event = new Event("change");
                select_type.dispatchEvent(event);
            }
        }
    }
}

function guiUpdateNonbasic(change) {
    const isAdv = (get_feature_level() == "advanced");

    // CHANGES ONLY WHEN THE SUPERTYPE WAS CAHNGED
    if (change == "supertype" || change == "features") {
        // Set available colors 
        let colors = ['red', 'blue', 'green'];
        if (isAdv) colors.push('custom');
        guiSetColorOpts(colors);
        guiToggleTiers([1, 1, 1]);
    }

    // CHANGES ONLY WHEN THE COLOR WAS CHANGED
    if (change == "color" || change == "features") {
        let color = select_card_color.value.toLowerCase();
        let attributes = ['attack','defense','movement','initiative'];
        if (!isAdv && color != "red") attributes.shift();
        guiSetAttributes(attributes);
        
        let types = ['attack','defense','skill','defense/skill','movement'];
        if (!isAdv && color != "red") attributes.shift();
        guiSetTypeOpts(types);
        
    }
}

function guiUpdateBasic(change) {
    const isAdv = (get_feature_level() == "advanced");

    // CHANGES ONLY WHEN THE SUPERTYPE WAS CAHNGED
    if (change == "supertype" || change == "features") {
        // Set available colors 
        let colors = ['gold', 'silver'];
        if (isAdv) colors.push('custom');
        guiSetColorOpts(colors);
        guiToggleTiers([1, 0, 0]);
    }

    // CHANGES ONLY WHEN THE COLOR WAS CHANGED
    if (change == "color" || change == "features") {
        let color = select_card_color.value.toLowerCase();
        let attributes = ['attack','defense','movement','initiative'];
        if (!isAdv && color == "silver") {
            attributes.shift();      // Remove attack
            attributes.splice(1, 1); // Remove movement
        }
        guiSetAttributes(attributes);
        
        let types = ['attack','defense','skill','defense/skill','movement'];
        if (!isAdv && color == "silver") {
            types.shift(); // Remove attack
            types.pop();   // Remove movement
        }
        guiSetTypeOpts(types);
        
    }
}

function guiUpdateUltimate(change) {
    const isAdv = (get_feature_level() == "advanced");

    // CHANGES ONLY WHEN THE SUPERTYPE WAS CAHNGED
    if (change == "supertype" || change == "features") {
        // Set available colors 
        let colors = ['purple'];
        if (isAdv) colors.push('custom');
        guiSetColorOpts(colors);
        guiToggleTiers([1, 0, 0]);

        /*input_tier_toggle.forEach(function (ee, i) {
            ee.checked = i == 0;

            // TODO: CONSIDER CHANGING THIS???
            let event = new Event("change");
            ee.dispatchEvent(event);
        });*/
    }

    // CHANGES ONLY WHEN THE COLOR WAS CHANGED
    if (change == "color" || change == "features") {
        guiSetAttributes([], isAdv);
        
        let types = ['ultimate'];
        guiSetTypeOpts(types);
    }
}


export function guiUpdate(change = "") {
    // CHANGE can be SUPERTYPE, COLOR, or FEATURES

    console.log("update gui called! (change type '" + change + "')");
    const isAdv = get_feature_level() == "advanced";
    const supertype = select_supertype.value.toLowerCase();

    // Changing card type UI
    if (change == "features") {
        ['II', 'III'].forEach(function (tier) {
            const e = document.getElementById("card-type-tier-" + tier);
            e.style.display = isAdv ? "block" : "none";
        });
    }

    switch (supertype) {
        case 'nonbasic':
            guiUpdateNonbasic(change);
            break;

        case 'basic':
            guiUpdateBasic(change);
            break;

        case 'ultimate':
            guiUpdateUltimate(change);
            break;
    }

    // Finalize
    if (change == "color") guiUpdateColors();
    guiUpdateStat(); 
} // function guiUpdate()

export function guiUpdateColors() {

    // Default colors
    var color_fg = 'teal';
    var color_bg = 'lightblue';
    var color_on = 'lightsalmon';
    var color_fg_off = 'lightgray';
    var color_bg_off = 'whitesmoke';

    const color_str = select_card_color.value.toLowerCase();
    if (Object.keys(colorTools.color_map).indexOf(color_str) >= 0) {
        color_fg = colorTools.color_map[color_str];
        /*var color_rgb = colorTools.hexToRgb(color_fg);
        var alpha = .875;
        Object.keys(color_rgb).forEach(function (k) {
            color_rgb[k] = parseInt(color_rgb[k] + alpha * (255 - color_rgb[k]));
        });
        color_bg = colorTools.rgbToHex(color_rgb['r'], color_rgb['g'], color_rgb['b']);
        */
        color_bg = colorTools.lightenColor(color_fg, .875);
        if (color_str == "silver") {
            color_fg_off = color_bg;
            color_bg_off = color_fg;
        }
    }

    // select_card_color.style.setProperty('--fg-color', color_fg);
    // select_card_color.style.setProperty('--bg-color', color_bg);
    // select_card_color.style.setProperty('--on-color', color_on);
    // select_card_color.style.setProperty('--off-bg-color', color_bg_off);
    // select_card_color.style.setProperty('--off-fg-color', color_fg_off);
    
    container[0].style.setProperty('--fg-color', color_fg);
    container[0].style.setProperty('--bg-color', color_bg);
    container[0].style.setProperty('--on-color', color_on);
    container[0].style.setProperty('--off-bg-color', color_bg_off);
    container[0].style.setProperty('--off-fg-color', color_fg_off);
    
}

function guiUpdateStat(stat = "all") {
    stat = stat.toLowerCase();
    if (stat == "all") {
        guiUpdateStat("attack");
        guiUpdateStat("defense");
        guiUpdateStat("movement");
        guiUpdateStat("initiative");
        return;
    }
    
    let val = [0, 0, 0];
    
    const stat_profile = select_stat_profile(stat);
    const cardcolor = select_card_color.value;
    const profile = stat_profile.value;

    if (profile == "Custom") {
        // Use the modifiers directly
        for (var i = 0; i < val.length; i++)
            val[i] = input_stats(stat)[i].value;

    } else {
        // Get profile and add modifiers
        val = stats.get(stat, profile, cardcolor);
        if (typeof(val) == "number") {
            val = [val, val, val];
        }

        // Modifiers
        for (var i = 0; i < val.length; i++) {
            let modval = input_stats(stat)[i].value;
            if (modval == '!') {
                val[i] = modval;
                continue;
            }
            let mod_pm = modval.slice(-1) == '+' ? '+' : '';
            mod_pm = modval.slice(-1) == '-' ? '-' : mod_pm;
            modval = mod_pm.length > 0 ? modval.slice(0, -1) : modval;
            modval = modval == '' ? '0' : modval;
            val[i] += parseInt(modval);
            val[i] = val[i] < 0 ? '-' : val[i] + mod_pm;
        }
    }
    
    // Update preview
    ['I','II','III'].forEach(function(tier) {
        const elem = document.getElementById("preview-" + stat + "-tier-" + tier);
        const idx = tier.length - 1;
        elem.innerHTML = val[idx];
    });
}
