// map function from Processing converted to es6 arrow function
let remap = (val, in_min, in_max, out_min, out_max) => {
    return (val - in_min) * (out_max - out_min) / (in_max) - (in_min) + out_min;
};

// map hue value to ACNH value
let map_h = (hue) => {
    if(hue > 360 || hue < 0) {
        return -1;
    } else {
        return Math.round(remap(hue, 0, 360, 0, 29));
    }
};

// map saturation and brightness to ACNH values
// consolidated into same function because it's the same range
let map_sb = (val) => {
    if(val > 100 || val < 0) {
        return -1;
    } else {
        return Math.round(remap(val, 0, 100, 0, 14));
    }
};

// handle conversion from hsb to acnh
let convert_color = (h, s, b) => {
    // get color in animal crossing format
    let color = [0, 0, 0];
    color[0] = map_h(h);
    color[1] = map_sb(s);
    color[2] = map_sb(b);
    
    // get dom elements
    const hue = document.querySelector("#hue-arrow");
    const vivid = document.querySelector("#vivid-arrow");
    const bright = document.querySelector("#bright-arrow");
    const h_val = document.querySelector("#hue-val");
    const s_val = document.querySelector("#vivid-val");
    const b_val = document.querySelector("#bright-val");
    const display = document.querySelector("#color-display");
    const barWidth = document.querySelector("#hue").offsetWidth;
    
    // declare padding and pixel values
    // padding is determined based purely on looks/location of arrow
    // px is determined based on x * y, where x = bar width (500)
    // and y = percent of each section (3.33% for hue, 6.66% for vivid/bright)
    const hue_px = barWidth * 0.0333;
    const hue_pad = (window.innerWidth <= 500) ? -5 : -2;       // change padding if window is less than 500px wide
    const vb_px = barWidth * 0.0666;
    const vb_pad = (window.innerWidth <= 500) ? 1 : 8;          // again, change padding if window is less than 500px wide
    
    // calculate new left value based on color
    const new_hue_px = (hue_px * color[0]) + hue_pad;
    const new_vivid_px = (vb_px * color[1]) + vb_pad;
    const new_bright_px = (vb_px * color[2]) + vb_pad;
    
    // apply new style
    hue.style.left = "" + new_hue_px + "px";
    vivid.style.left = "" + new_vivid_px + "px";
    bright.style.left = "" + new_bright_px + "px";
    
    // change value displayed
    // adding 1 changes the bound from 0-29 and 0-14 to
    // 1-30 and 1-15 respectively, since these are nicer
    // numbers for the end user
    h_val.innerHTML = (color[0] + 1);
    s_val.innerHTML = (color[1] + 1);
    b_val.innerHTML = (color[2] + 1);
    
    // change box background color
    display.style.backgroundColor = "#" + document.querySelector("input").value;
};

// random hex color, from https://dev.to/akhil_001/generating-random-color-with-single-line-of-js-code-fhj
let randomColor = () => {
    return Math.floor(Math.random()*16777215).toString(16).toUpperCase();
};

// random color function for button and for init
let random = () => {
    const picker = document.querySelector("input");
    picker.value = randomColor();
    picker.jscolor.importColor();
    convert_color(picker.jscolor.hsv[0], picker.jscolor.hsv[1], picker.jscolor.hsv[2]);
};

window.onload = random;