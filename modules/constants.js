import * as colors from "./colors.js";

export var card_settings = {
    canvas: {
        bleed: 0
    },
    textbox: {
        space: 6.5,
        line_height: 34,
        padding: {
            top: 15,
            bottom: 15,
            left: 15,
            right: 15
        },
        width: 550,
        text: {
            font: "26px Arial",
            color: "black"
        }
    }
};

export const layout = {
    canvas: {
        height: 880,
        width: 630
    },
    textbox: {
        minPad: 10,
        bottom: 775,
        item_shift: 55,
        frame: {
            width: 570,
            radius: 20,
            stroke: "#616563",
            strokesize: 8,
            bgcolor: "#ccd2cd",
            inner_color_pad_x: 8,
            inner_color_pad_y: 5,
        },
        gear: {
            size: 70,
            shift_left: 13,
            shift_right: 15
        },
        gradient: {
            shift_stop: 40
        },
        text: {
            icon: { word_width: 35, symbol_size: 40 }
        }
    },
    item: {
        size: 100,
        shift_y: 5
    },
    name: {
        x: 335,
        y: 74,
        text: {
            font: "35px ModestoPosterW05-Regular",
            color: "black"
        },
        box: {
            stokesize: 8,
            width: { full: 540, regular: 455 },
            height: 60,
            x: { full: 45, regular: 130 },
            y: 35,
            bgcolor: "#cbc8bc",
            stroke: ["#464646", "#9a9a9a"]
        }
    },
    tier: {
        x: 553,
        y: 80,
        gear: {
            scale: 1.1,
            size: 76,
            shift_x: 4,
            shift_y: 20
        },
        text: {
            font: "48px ModestoPosterW05-Regular",
            color: "white",
            stroke: "black",
            strokesize: 5
        }
    },
    readability: {
        x: 600,
        y: 45,
        text: {
            font: "24px ModestoPosterW05-Regular",
            color: "#828282",
            stroke: "#202020",
            strokesize: 5
        }
    },
    banner :{
        gold: { ratio: 0.9 },
        green: { ratio: 6/7, gam: 0.5 },
        blue: { gam: 0.5 },
        red: { ratio: 0.9 },
        base: 125,
        padding: {
            top: 35,
            bottom: 25
        },
        action_size: 95,
        base_x: 30,
        base_y: 0,
        width: 90,
        strokesize: 8,
        stroke: "#616563",
        shade_alpha: .1,
        small: {
            base_shift: 25,
            stroke_alpha: .45,
            stroke: "white",
            strokesize: 10
        },
        initiative: {
            scale_add: 55,
            shift_x: 5,
            shift_y: 5,
            font: "100px ModestoPosterW05-Regular",
            text_shift_y: 100
        },
        text: {
            color: "white",
            stroke: "black"
        },
        secondary_actions: {
            font: "65px ModestoPosterW05-Regular"
        }
    },
    type: {
        shift_y: 10,
        text: {
            font: "28px ModestoPosterW05-Regular",
            color: "white",
            stroke: "black",
            strokesize: 5
        }
    },
    bg_elements: {
        strokesize: 6,
        bgcolor: "#2e2e2e",
        stroke: "#adadad",
        upper: { height: 65 },
        lower: { height: 125 }
    },
    primary: {
        x: 17,
        size: 115,
        text: {
            font: "80px ModestoPosterW05-Regular",
            color: "white",
            stroke: "black",
            strokesize: 8
        }
    },
    subtype: {
        size: 115,
        range: {
            size: 115,
            shift_x: 17,
            shift_y: 92,
            shift_img_y: 2
        },
        radius: {
            size: 130,
            shift_x: 23,
            shift_y: 92,
            shift_img_y: 10
        },
        text: {
            font: "80px ModestoPosterW05-Regular",
            color: "white",
            stroke: "black",
            strokesize: 8
        }
    }
};