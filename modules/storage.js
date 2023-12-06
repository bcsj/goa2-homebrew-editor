
export function getBranches() {
    let branches = JSON.parse(localStorage.getItem('branches'));
    if (branches == null) {
        branches = [];
    }
    return branches;
}

export function getBranch(name) {
    let branch = localStorage.getItem(name);
    if (branch == null)
        console.log("Error: Branch not found!");
    return JSON.parse(branch);
}

export function saveWorkSpace(branch) {
    localStorage.setItem("workspace", JSON.stringify(branch));
}

export function loadWorkSpace() {
    return JSON.parse(localStorage.getItem("workspace"));
}

export function save(branch) {
    // Ensure unique name
    var name;
    let branches = getBranches();
    if (branch.id == "") {
        let hash = cyrb53(JSON.stringify(branch));
        name = "branch_" + hash;

        let i = 0;
        while (branches.indexOf(name) > -1) {
            hash = cyrb53(JSON.stringify(branch), ++i);
            name = "branch_" + hash;
        }

        branch.id = hash;
    } else {
        name = "branch_" + branch['id'];
    }

    // Check existence
    if (!(branches.indexOf(name) > -1)) {
        branches.push(name);
        localStorage.setItem('branches', JSON.stringify(branches));
    }

    // Store
    localStorage.setItem(name, JSON.stringify(branch));
}

export function localStorageUsage() {
    var sz = localStorageSize();
    return usage = sz / (5*1024);
}

export function localStorageSize() {
    var keys = Object.keys(localStorage);
    var sz_keys = keys.join('').length;
    var storage = [];
    for (var i = 0; i < keys.length; i++) {
        storage.push(localStorage.getItem(keys[i]));
    }
    var sz_storage = storage.join('').length;
    var sz_KB = (sz_keys + sz_storage)/1024;
    return sz_KB;
}

// hashing function from https://stackoverflow.com/a/52171480
const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    let t = 4294967296 * (2097151 & h2) + (h1 >>> 0);
    return t.toString(16);
};