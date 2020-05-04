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

    const { items } = await getTopTracks(token);
    console.log(items);

    for (let i = 0; i < items.length; i++) {
        const audio_features = await getAudioFeatures(items[i].id, token);
        console.log(audio_features);

        console.log("===========================");
        console.log("audio feature for " + items[i].name);
        console.log("danceability: " + audio_features.danceability.toFixed(2));

        let chosen_color;
        let color_value;

        const danceability = audio_features.danceability;

        if (danceability <= .25) {
            console.log("B");

            chosen_color = "B"

            color_value = 255 * danceability; 

            B.push(color_value.toFixed());

            console.log(`${chosen_color} value is ${color_value.toFixed()}`);

            continue;
        }

        else if (danceability >= .25 && danceability <= .5) {
            const b_or_g = Math.floor(Math.random() * 2)

            console.log("B or G " + b_or_g);

            if (b_or_g === 1) {
                console.log("G");

                chosen_color = "G"

                color_value = 255 * danceability;

                G.push(color_value.toFixed());

                console.log(`${chosen_color} value is ${color_value.toFixed()}`);

                continue;
            }

            console.log("B")

            chosen_color = "B"

            color_value = 255 * danceability; 

            B.push(color_value.toFixed());

            console.log(`${chosen_color} value is ${color_value.toFixed()}`);

            continue;
        }

        else if (danceability >= .5 && danceability <= .75) {
            const high_or_low = Math.floor(Math.random() * 2);

            console.log("High or Low " + high_or_low);

            if (high_or_low === 1) {
                console.log("R");

                chosen_color = 'R'

                color_value = 255 * danceability; 

                R.push(color_value.toFixed());

                console.log(`${chosen_color} value is ${color_value.toFixed() }`);

                continue;
            }

            console.log("B")

            chosen_color = 'B'

            color_value = 255 * danceability; 

            B.push(color_value.toFixed());

            console.log(`${chosen_color} value is ${color_value.toFixed()}`);

            continue;
        }

        else if (danceability >= .75) {
            console.log("R");

            chosen_color = 'R'

            color_value = 255 * danceability; 

            R.push(color_value.toFixed());

            console.log(`${chosen_color} value is ${color_value.toFixed()}`);

            continue;
        }
    }

    console.log("*************************");

    console.log(R);

    console.log(G);

    console.log(B);

    const RedAVG = calcAverage(R);

    const GreenAVG = calcAverage(G);

    const BlueAVG = calcAverage(B);

    console.log("Average Red is: " + RedAVG.toFixed());

    console.log("Average Green is: " + GreenAVG.toFixed());

    console.log("Average Blue is: " + BlueAVG.toFixed());

    $("#color-one").attr("style", `background-color: rgb(${RedAVG.toFixed()}, ${GreenAVG.toFixed()}, ${BlueAVG.toFixed()}) `)
    // const audio_features = await getAudioFeatures(items[14].id, token);
    // console.log(audio_features);
    // const audio_analysis = await getAudioAnalysis(items[14].id, token);
    // console.log(audio_analysis);
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
}

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
}

function calcAverage(array) {
    let total = 0;

    for (let i = 0; i < array.length; i++) {

        total += parseInt(array[i]);

    };

    return total / parseInt(array.length);
}