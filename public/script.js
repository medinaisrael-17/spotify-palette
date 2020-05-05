let hex_1;
let hex_2;
let hex_3;
let hex_4;
let hex_5;

let dance_arr = []
let energy_arr = [];
let valence_arr = [];

let high_dance_count = 0;
let high_energy_count = 0;
let high_valence_count = 0;

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

const params = getHashParams();

var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

if (error) {
    alert("Looks like there was an error authorizing your account :-(")
}

else {
    if (access_token) {
        $.ajax({
            url: "https://api.spotify.com/v1/me",
            headers: {
                "Authorization": "Bearer " + access_token
            },
            success: function (response) { init(response, access_token) }
        })
    }
    else {
        $("#welcome").show()
    }
}

async function init(data, token) {
    let R = [];
    let G = [];
    let B = [];


    console.log(data);

    $("#welcome").hide();
    $("#palette-card").show();

    $("#name").text(`${data.display_name}'s`)

    const { items } = await getTopTracks(token);
    console.log(items);

    calcColor(0, 50, items, token, R, G, B, 3);

}

function rgbToHex(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

function fullColorHex(r, g, b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return "#" + red + green + blue;
};

async function calcColor(i_min, i_max, items, token, R, G, B, color_number) {

    let final_color;
    let final_color_hex;

    let RedAVG;
    let GreenAVG;
    let BlueAVG;

    for (let i = i_min; i < i_max; i++) {

        const audio_features = await getAudioFeatures(items[i].id, token);

        const danceability = audio_features.danceability;
        const valence = audio_features.valence;
        const energy = audio_features.energy;

        calcDanceability(danceability, R, G, B);
        calcValence(valence, R, G, B);
        calcEnergy(energy, R, G, B);

        RedAVG = calcAverage(R);

        GreenAVG = calcAverage(G);

        BlueAVG = calcAverage(B);

        $(`#color-${color_number}`).attr("style", `background-color: rgb(${RedAVG.toFixed()}, ${GreenAVG.toFixed()}, ${BlueAVG.toFixed()}) `)
    }

    console.log("R: " + R);

    console.log("G: " + G);

    console.log("B: " + B);


    final_color = `rgb(${RedAVG.toFixed()}, ${GreenAVG.toFixed()}, ${BlueAVG.toFixed()})`

    console.log("FINAL COLOR AS RGB: " + final_color);

    let red = RedAVG.toFixed();

    let green = GreenAVG.toFixed();

    let blue = BlueAVG.toFixed();

    final_color_hex = fullColorHex(red, green, blue);

    switch (color_number) {
        case 1:
            hex_1 = final_color_hex;
        case 2:
            hex_2 = final_color_hex;
        case 3:
            hex_3 = final_color_hex;
        case 4:
            hex_4 = final_color_hex;
        case 5:
            hex_5 = final_color_hex;
    }

    console.log("FINAL COLOR AS HEX: " + final_color_hex);

    console.log(`*** DONE WITH COLOR ${color_number} ***`);

    console.log("Amount of songs with high energy: " + high_energy_count);
    console.log("Amount of songs with high danceability: " + high_dance_count);
    console.log("Amount of songs with high valence: " + high_valence_count);

    const avg_energy = calcAverage(energy_arr);
    const avg_dance = calcAverage(dance_arr);
    const avg_valence = calcAverage(valence_arr);

    //hard code to test
    


    console.log("Average Energy: " + avg_energy.toFixed(2));
    console.log("Average Danceability: " + avg_dance.toFixed(2));
    console.log("Average Valence: " + avg_valence.toFixed(2));

    if (high_dance_count > high_energy_count && high_dance_count > high_valence_count) {
        console.log("high dance selected");
        //this will deal with orange so rgb red must 255 and blue must be 0
        //rgb(255, ???, ???)
        //75-174 
        //0-100
        const green = Math.floor(Math.random() * 175) + 75;
        const blue = Math.floor(Math.random() * 101);

        console.log(green);
        console.log(blue)

        const base_color_hex = fullColorHex(255, green, blue);

        hex_3 = base_color_hex;

        $("#color-3").attr("style", `background-color: ${base_color_hex}`);
    }

    else if (high_energy_count > high_dance_count && high_energy_count > high_valence_count) {
        console.log("high energy selected");
        //this will deal with red
        //rgb (255, ???, ???)
        //rgb(255, 0, ???)

        const light_or_bright = Math.random(Math.floor() * 2)

        if (light_or_bright === 1) {
            const b_and_g = Math.floor(Math.random() * 101);

            const base_color_hex = fullColorHex(255, b_and_g, b_and_g);

            hex_3 = base_color_hex;

            $("#color-3").attr("style", `background-color: ${base_color_hex}`);
        }

        const blue = Math.floor(Math.random() * 171);
 
        const base_color_hex = fullColorHex(255, 0, blue);

        hex_3 = base_color_hex;

        $("#color-3").attr("style", `background-color: ${base_color_hex}`);
    }

    else if (high_valence_count > high_dance_count && high_valence_count > high_energy_count) {
        
    }



    // R = [];
    // G = [];
    // B = [];


    // const new_i_min = i_min + 10;

    // const new_i_max = i_max + 10;

    // if (new_i_min > 20 && new_i_max > 30) {

    //     return;
    // }
}

// function calcLoudness(loudness, R_array, G_array, B_array) {
//     let chosen_color;
//     let color_value;

//     if (loudness <= 2) {

//         const dec_loud = loudness * .1

//         chosen_color = "R"

//         color_value = 255 * dec_loud;

//         R_array.push(color_value.toFixed());

//         return;
//     }

//     else if (loudness >= 2 && loudness <= 5) {
//         const b_or_g = Math.floor(Math.random() * 2);

//         const dec_loud = loudness * .1

//         if (b_or_g === 1) {

//             chosen_color = "G"

//             color_value = 255 * dec_loud;

//             G_array.push(color_value.toFixed());

//             return;
//         }

//         chosen_color = "B"

//         color_value = 255 * dec_loud;

//         B_array.push(color_value.toFixed());

//         return;
//     }


//     else if (loudness >= 5 && loudness <= 7) {
//         const high_or_low = Math.floor(Math.random() * 2);

//         const dec_loud = loudness * .1

//         if (high_or_low === 1) {

//             chosen_color = 'R'

//             color_value = 255 * dec_loud;

//             R_array.push(color_value.toFixed());

//             return;
//         }

//         chosen_color = 'G'

//         color_value = 255 * dec_loud;

//         G_array.push(color_value.toFixed());

//         return;
//     }

//     else if (loudness >= 7) {

//         chosen_color = 'G'

//         color_value = 255;

//         G_array.push(color_value);

//         return;
//     }
// }

function calcEnergy(energy, R_array, G_array, B_array) {
    let chosen_color;
    let color_value;

    energy_arr.push(energy);

    if (energy <= .25) {

        chosen_color = "G"

        color_value = 255 * energy;

        G_array.push(color_value.toFixed());


        return;
    }

    else if (energy >= .25 && energy <= .5) {
        const b_or_g = Math.floor(Math.random() * 2)

        if (b_or_g === 1) {

            chosen_color = "G"

            color_value = 255 * energy;

            G_array.push(color_value.toFixed());



            return;
        }

        chosen_color = "B"

        color_value = 255 * energy;

        B_array.push(color_value.toFixed());


        return;
    }


    else if (energy >= .5 && energy <= .75) {
        const high_or_low = Math.floor(Math.random() * 2);

        if (high_or_low === 1) {

            chosen_color = 'R'

            color_value = 255 * energy;

            R_array.push(color_value.toFixed());



            return;
        }

        chosen_color = 'G'

        color_value = 255 * energy;

        G_array.push(color_value.toFixed());

        return;
    }

    else if (energy >= .75) {

        chosen_color = 'R'

        color_value = 255 * energy;

        R_array.push(color_value.toFixed());


        high_energy_count++;

        return;
    }
}

function calcValence(valence, R_array, G_array, B_array) {
    let chosen_color;
    let color_value;

    valence_arr.push(valence);

    if (valence <= .25) {

        chosen_color = "B"

        color_value = 255 * valence;

        B_array.push(color_value.toFixed());


        return;
    }

    else if (valence >= .25 && valence <= .5) {
        const b_or_g = Math.floor(Math.random() * 2)

        if (b_or_g === 1) {

            chosen_color = "G"

            color_value = 255 * valence;

            G_array.push(color_value.toFixed());



            return;
        }

        chosen_color = "B"

        color_value = 255 * valence;

        B_array.push(color_value.toFixed());


        return;
    }


    else if (valence >= .5 && valence <= .75) {
        const high_or_low = Math.floor(Math.random() * 2);

        if (high_or_low === 1) {

            chosen_color = 'R'

            color_value = 255 * valence;

            R_array.push(color_value.toFixed());



            return;
        }

        chosen_color = 'B'

        color_value = 255 * valence;

        B_array.push(color_value.toFixed());


        return;
    }

    else if (valence >= .75) {

        chosen_color = 'R'

        color_value = 255 * valence;

        R_array.push(color_value.toFixed());


        high_valence_count++;

        return;
    }
}

function calcDanceability(danceability, R_array, G_array, B_array) {
    let chosen_color;
    let color_value;

    dance_arr.push(danceability);

    if (danceability <= .25) {

        chosen_color = "B"

        color_value = 255 * danceability;

        B_array.push(color_value.toFixed());

        return;
    }

    else if (danceability >= .25 && danceability <= .5) {
        const b_or_g = Math.floor(Math.random() * 2)

        if (b_or_g === 1) {

            chosen_color = "G"

            color_value = 255 * danceability;

            G_array.push(color_value.toFixed());


            return;
        }

        chosen_color = "B"

        color_value = 255 * danceability;

        B_array.push(color_value.toFixed());

        return;
    }


    else if (danceability >= .5 && danceability <= .75) {
        const high_or_low = Math.floor(Math.random() * 2);

        if (high_or_low === 1) {
            chosen_color = 'R'

            color_value = 255 * danceability;

            R_array.push(color_value.toFixed());


            return;
        }

        chosen_color = 'B'

        color_value = 255 * danceability;

        B_array.push(color_value.toFixed());

        return;
    }

    else if (danceability >= .75) {

        chosen_color = 'R'

        color_value = 255 * danceability;

        R_array.push(color_value.toFixed());

        high_dance_count++;

        return;
    }
}

function getTopTracks(token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.spotify.com/v1/me/top/tracks?limit=50",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (data) {
                resolve(data)
            }
        });
    });
}

function getAudioFeatures(id, token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.spotify.com/v1/audio-features/${id}`,
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (data) {
                resolve(data);
            }
        });
    });
};

function getAudioAnalysis(id, token) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.spotify.com/v1/audio-analysis/${id}`,
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (data) {
                resolve(data);
            }
        })
    })
};

function calcAverage(array) {
    let total = 0;

    for (let i = 0; i < array.length; i++) {

        total += parseFloat(array[i]);

    };

    return total / parseInt(array.length);
};

function hexToComplimentary(hex) {

    // Convert hex to rgb
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length / 3 + '})', 'g')).map(function (l) { return parseInt(hex.length % 2 ? l + l : l, 16); }).join(',') + ')';

    // Get array of RGB values
    rgb = rgb.replace(/[^\d,]/g, '').split(',');

    var r = rgb[0], g = rgb[1], b = rgb[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if (max == min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if (max == r && g >= b) {
            h = 1.0472 * (g - b) / d;
        } else if (max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if (max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if (max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h += 180;
    if (h > 360) { h -= 360; }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);

    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16);
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
}
