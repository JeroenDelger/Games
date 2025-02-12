<template>
    <div v-if="GameOn == false">
        <select v-model="typeOfPlayer">
            <option disabled value="">AI of Player</option>
            <option value="0">AI</option>
            <option value="1">Player</option>
        </select>
        <button @click="StartGame()">Start</button>
    </div>
    <table v-if="GameOn == true">
        <tr v-for="row in 10">
            <td v-for="cell in 10">
                <div
                    :id="row + '' + cell"
                    v-if="
                        (row % 2 == 0 && cell % 2 != 0) ||
                        (row % 2 != 0 && cell % 2 == 0)
                    "
                    :style="{
                        width: '50px',
                        height: '50px',
                        border: '1px solid black',
                        background: 'grey',
                    }"
                >
                    <div v-for="steen in blackBrickPositions.length">
                        <div
                            v-if="
                                row == blackBrickPositions[steen - 1][0] &&
                                cell == blackBrickPositions[steen - 1][1] &&
                                aanZet == 1 &&
                                blackBrickPositions[steen - 1][2] == 'dam'
                            "
                            :style="{
                                'border-radius': '50%',
                                width: '40px',
                                height: '40px',
                                background: 'black',
                                margin: '5px',
                                'text-color': 'red',
                            }"
                            @click="
                                dam(row, cell, blackBrickPositions[steen - 1])
                            "
                        >
                            <div
                                :style="{
                                    'border-radius': '50%',
                                    width: '20px',
                                    height: '20px',
                                    background: 'darkred',
                                    position: 'absolute',
                                    'margin-right': '-50%',
                                    transform: 'translate(-50%, -50%)',
                                    margin: '20px',
                                }"
                            ></div>
                        </div>
                        <div
                            v-else-if="
                                row == blackBrickPositions[steen - 1][0] &&
                                cell == blackBrickPositions[steen - 1][1] &&
                                blackBrickPositions[steen - 1][2] == 'dam'
                            "
                            :style="{
                                'border-radius': '50%',
                                width: '40px',
                                height: '40px',
                                background: 'black',
                                margin: '5px',
                                'text-color': 'red',
                            }"
                        >
                            <div
                                :style="{
                                    'border-radius': '50%',
                                    width: '20px',
                                    height: '20px',
                                    background: 'darkred',
                                    position: 'absolute',
                                    'margin-right': '-50%',
                                    transform: 'translate(-50%, -50%)',
                                    margin: '20px',
                                }"
                            ></div>
                        </div>
                    </div>
                    <div v-for="steen in whiteBrickPositions.length">
                        <div
                            v-if="
                                row == whiteBrickPositions[steen - 1][0] &&
                                cell == whiteBrickPositions[steen - 1][1] &&
                                aanZet == 0 &&
                                whiteBrickPositions[steen - 1][2] == 'dam'
                            "
                            :style="{
                                'border-radius': '50%',
                                width: '40px',
                                height: '40px',
                                background: 'white',
                                margin: '5px',
                                'text-color': 'red',
                            }"
                            @click="
                                dam(row, cell, whiteBrickPositions[steen - 1])
                            "
                        >
                            <div
                                :style="{
                                    'border-radius': '50%',
                                    width: '20px',
                                    height: '20px',
                                    background: 'darkred',
                                    position: 'absolute',
                                    'margin-right': '-50%',
                                    transform: 'translate(-50%, -50%)',
                                    margin: '20px',
                                }"
                            ></div>
                        </div>
                        <div
                            v-else-if="
                                row == whiteBrickPositions[steen - 1][0] &&
                                cell == whiteBrickPositions[steen - 1][1] &&
                                whiteBrickPositions[steen - 1][2] == 'dam'
                            "
                            :style="{
                                'border-radius': '50%',
                                width: '40px',
                                height: '40px',
                                background: 'white',
                                margin: '5px',
                                'text-color': 'red',
                            }"
                        >
                            <div
                                :style="{
                                    'border-radius': '50%',
                                    width: '20px',
                                    height: '20px',
                                    background: 'darkred',
                                    position: 'absolute',
                                    'margin-right': '-50%',
                                    transform: 'translate(-50%, -50%)',
                                    margin: '20px',
                                }"
                            ></div>
                        </div>
                    </div>
                    <div v-for="steen in blackBrickPositions.length">
                        <div
                            v-if="
                                aanZet == 1 &&
                                row == blackBrickPositions[steen - 1][0] &&
                                cell == blackBrickPositions[steen - 1][1] &&
                                brickSelected == false &&
                                blackBrickPositions[steen - 1][2] == 'brick'
                            "
                            :style="{
                                'border-radius': '50%',
                                width: '40px',
                                height: '40px',
                                background: 'black',
                                margin: '5px',
                            }"
                            @click="
                                dam(row, cell, blackBrickPositions[steen - 1])
                            "
                        ></div>

                        <div
                            v-else-if="
                                (aanZet == 0 || brickSelected == true) &&
                                row == blackBrickPositions[steen - 1][0] &&
                                cell == blackBrickPositions[steen - 1][1] &&
                                blackBrickPositions[steen - 1][2] == 'brick'
                            "
                            :style="{
                                'border-radius': '50%',
                                width: '40px',
                                height: '40px',
                                background: 'black',
                                margin: '5px',
                            }"
                        ></div>
                    </div>
                    <div v-for="steen in whiteBrickPositions.length">
                        <div
                            v-if="
                                aanZet == 0 &&
                                row == whiteBrickPositions[steen - 1][0] &&
                                cell == whiteBrickPositions[steen - 1][1] &&
                                brickSelected == false &&
                                whiteBrickPositions[steen - 1][2] == 'brick'
                            "
                            :style="{
                                'border-radius': '50%',
                                width: '40px',
                                height: '40px',
                                background: 'white',
                                margin: '5px',
                            }"
                            @click="
                                dam(row, cell, whiteBrickPositions[steen - 1])
                            "
                        ></div>

                        <div
                            v-else-if="
                                (aanZet == 1 || brickSelected == true) &&
                                row == whiteBrickPositions[steen - 1][0] &&
                                cell == whiteBrickPositions[steen - 1][1] &&
                                whiteBrickPositions[steen - 1][2] == 'brick'
                            "
                            :style="{
                                'border-radius': '50%',
                                width: '40px',
                                height: '40px',
                                background: 'white',
                                margin: '5px',
                            }"
                        ></div>
                    </div>
                </div>
                <div
                    v-else
                    :style="{
                        width: '50px',
                        height: '50px',
                        border: '1px solid black',
                    }"
                ></div>
            </td>
        </tr>
    </table>
</template>

<script setup>
import { ref } from "vue";

let GameOn = ref(false);
let typeOfPlayer = ref();

let whiteBrickPositions = ref([
    [1, 2, "brick"],
    [1, 4, "brick"],
    [1, 6, "brick"],
    [1, 8, "brick"],
    [1, 10, "brick"],
    [2, 1, "brick"],
    [2, 3, "brick"],
    [2, 5, "brick"],
    [2, 7, "brick"],
    [2, 9, "brick"],
    [3, 2, "brick"],
    [3, 4, "brick"],
    [3, 6, "brick"],
    [3, 8, "brick"],
    [3, 10, "brick"],
    [4, 1, "brick"],
    [4, 3, "brick"],
    [4, 5, "brick"],
    [4, 7, "brick"],
    [4, 9, "brick"],
]);
let blackBrickPositions = ref([
    [7, 2, "brick"],
    [7, 4, "brick"],
    [7, 6, "brick"],
    [7, 8, "brick"],
    [7, 10, "brick"],
    [8, 1, "brick"],
    [8, 3, "brick"],
    [8, 5, "brick"],
    [8, 7, "brick"],
    [8, 9, "brick"],
    [9, 2, "brick"],
    [9, 4, "brick"],
    [9, 6, "brick"],
    [9, 8, "brick"],
    [9, 10, "brick"],
    [10, 1, "brick"],
    [10, 3, "brick"],
    [10, 5, "brick"],
    [10, 7, "brick"],
    [10, 9, "brick"],
]);

let brickSelected = ref(false);
let aanZet = ref(0);
let teststop = ref([false, false, false, false]);
let kanSlaan = ref(false);

function StartGame() {
    GameOn.value = true;
}

function checkDamDirection(
    row,
    column,
    aanBeurtBrick,
    nietAanBeurtBrick,
    r,
    c,
    breakcheck,
    r1,
    c1,
    aantalChecks,
    steen
) {
    let count = [0, 0, 0, 0];

    for (let i = 0; i < nietAanBeurtBrick.length; i++) {
        if (
            r + row < 11 &&
            c + column < 11 &&
            nietAanBeurtBrick[i][0] == r + row &&
            nietAanBeurtBrick[i][1] == c + column &&
            teststop.value[breakcheck] == false
        ) {
            for (let x = 0; x < nietAanBeurtBrick.length; x++) {
                for (let y = 0; y < aanBeurtBrick.length; y++) {
                    if (
                        (nietAanBeurtBrick[x][0] == r + row + r1 &&
                            nietAanBeurtBrick[x][1] == c + column + c1) ||
                        (aanBeurtBrick[y][0] == r + row + r1 &&
                            aanBeurtBrick[y][1] == c + column + c1)
                    ) {
                        teststop.value[breakcheck] = true;
                        count[breakcheck]++;
                        break;
                    }
                }
            }
            for (let z = 1; z < aantalChecks; z++) {
                if (
                    r + row + r1 * z > 0 &&
                    c + column + c1 * z > 0 &&
                    r + row + r1 * z < 11 &&
                    c + column + c1 * z < 11 &&
                    count[breakcheck] == 0
                ) {
                    for (let a = 0; a < nietAanBeurtBrick.length; a++) {
                        for (let b = 0; b < aanBeurtBrick.length; b++) {
                            if (
                                (nietAanBeurtBrick[a][0] ==
                                    r + row + r1 * z + r1 &&
                                    nietAanBeurtBrick[a][1] ==
                                        c + column + c1 * z + c1) ||
                                (aanBeurtBrick[b][0] == r + row + r1 * z + r1 &&
                                    aanBeurtBrick[b][1] ==
                                        c + column + c1 * z + c1)
                            ) {
                                count[breakcheck]++;
                                break;
                            }
                        }
                    }
                    const move = "slaan";
                    document.getElementById(
                        r + row + r1 * z + "" + (c + column + c1 * z)
                    ).style.background = "green";
                    document
                        .getElementById(
                            r + row + r1 * z + "" + (c + column + c1 * z)
                        )
                        .addEventListener("click", slaAlleStenen);
                    document.getElementById(
                        r + row + r1 * z + "" + (c + column + c1 * z)
                    ).params = [
                        r + row,
                        c + column,
                        r + row + r1 * z,
                        c + column + c1 * z,
                        r,
                        c,
                        move,
                        steen,
                    ];
                    kanSlaan.value = true;
                }
            }
        }
    }
}

function kanNietSlaan(
    row,
    column,
    aanBeurtBrick,
    nietAanBeurtBrick,
    r,
    c,
    breakcheck,
    r1,
    c1,
    aantalChecks,
    steen
) {
    let count = [0, 0, 0, 0];

    if (kanSlaan.value == false) {
        for (let z = 1; z < aantalChecks; z++) {
            if (
                r + r1 * z > 0 &&
                c + c1 * z > 0 &&
                r + r1 * z < 11 &&
                c + c1 * z < 11 &&
                count[breakcheck] == 0
            ) {
                for (let a = 0; a < nietAanBeurtBrick.length; a++) {
                    for (let b = 0; b < aanBeurtBrick.length; b++) {
                        if (
                            (nietAanBeurtBrick[a][0] == r + r1 * z &&
                                nietAanBeurtBrick[a][1] == c + c1 * z) ||
                            (aanBeurtBrick[b][0] == r + r1 * z &&
                                aanBeurtBrick[b][1] == c + c1 * z)
                        ) {
                            count[breakcheck]++;
                            break;
                        }
                    }
                }
                if (count[breakcheck] == 0) {
                    const move = "zet";
                    document.getElementById(
                        r + r1 * z + "" + (c + c1 * z)
                    ).style.background = "green";
                    document
                        .getElementById(r + r1 * z + "" + (c + c1 * z))
                        .addEventListener("click", slaAlleStenen);
                    document.getElementById(
                        r + r1 * z + "" + (c + c1 * z)
                    ).params = [
                        r + row,
                        c + column,
                        r + r1 * z,
                        c + c1 * z,
                        r,
                        c,
                        move,
                        steen,
                    ];
                }
            }
        }
    }
}

function dam(r, c, steen) {
    const aanBeurtBrick =
        aanZet.value === 0
            ? whiteBrickPositions.value
            : blackBrickPositions.value;
    const nietAanBeurtBrick =
        aanZet.value === 1
            ? whiteBrickPositions.value
            : blackBrickPositions.value;

    const typeSteen = steen[2] === "brick" ? 2 : 10;
    brickSelected.value = true;
    document.getElementById(r + "" + c).style.background = "orange";

    for (let check = 1; check < typeSteen; check++) {
        if (teststop.value[0] == false) {
            checkDamDirection(
                check,
                check,
                aanBeurtBrick,
                nietAanBeurtBrick,
                r,
                c,
                0,
                +1,
                +1,
                typeSteen,
                steen[2]
            );
        }
        if (teststop.value[1] == false) {
            checkDamDirection(
                check,
                -check,
                aanBeurtBrick,
                nietAanBeurtBrick,
                r,
                c,
                1,
                +1,
                -1,
                typeSteen,
                steen[2]
            );
        }
        if (teststop.value[2] == false) {
            checkDamDirection(
                -check,
                check,
                aanBeurtBrick,
                nietAanBeurtBrick,
                r,
                c,
                2,
                -1,
                +1,
                typeSteen,
                steen[2]
            );
        }
        if (teststop.value[3] == false) {
            checkDamDirection(
                -check,
                -check,
                aanBeurtBrick,
                nietAanBeurtBrick,
                r,
                c,
                3,
                -1,
                -1,
                typeSteen,
                steen[2]
            );
        }
    }
    for (let check = 1; check < typeSteen; check++) {
        if (
            (kanSlaan.value == false &&
                steen[2] === "brick" &&
                aanZet.value == 0) ||
            steen[2] === "dam"
        ) {
            kanNietSlaan(
                check,
                check,
                aanBeurtBrick,
                nietAanBeurtBrick,
                r,
                c,
                0,
                1,
                1,
                typeSteen,
                steen[2]
            );
            kanNietSlaan(
                check,
                -check,
                aanBeurtBrick,
                nietAanBeurtBrick,
                r,
                c,
                1,
                1,
                -1,
                typeSteen,
                steen[2]
            );
        }
        if (
            (kanSlaan.value == false &&
                steen[2] === "brick" &&
                aanZet.value == 1) ||
            steen[2] === "dam"
        ) {
            kanNietSlaan(
                -check,
                check,
                aanBeurtBrick,
                nietAanBeurtBrick,
                r,
                c,
                2,
                -1,
                1,
                typeSteen,
                steen[2]
            );
            kanNietSlaan(
                -check,
                -check,
                aanBeurtBrick,
                nietAanBeurtBrick,
                r,
                c,
                3,
                -1,
                -1,
                typeSteen,
                steen[2]
            );
        }
    }
}

function slaAlleStenen(evt) {
    const aanBeurtBrick =
        aanZet.value === 0
            ? whiteBrickPositions.value
            : blackBrickPositions.value;
    const nietAanBeurtBrick =
        aanZet.value === 1
            ? whiteBrickPositions.value
            : blackBrickPositions.value;
    const a = evt.target.params[0];
    const b = evt.target.params[1];
    const tr = evt.target.params[2];
    const tc = evt.target.params[3];
    const r = evt.target.params[4];
    const c = evt.target.params[5];
    const move = evt.target.params[6];
    const steen = evt.target.params[7];

    for (let i = 0; i < aanBeurtBrick.length; i++) {
        if (aanBeurtBrick[i][0] == r && aanBeurtBrick[i][1] == c) {
            aanBeurtBrick[i][0] = tr;
            aanBeurtBrick[i][1] = tc;
        }
    }

    for (let i = 0; i < nietAanBeurtBrick.length; i++) {
        if (
            move === "slaan" &&
            nietAanBeurtBrick[i][0] == a &&
            nietAanBeurtBrick[i][1] == b
        ) {
            nietAanBeurtBrick.splice(i, 1);
        }
    }
    if (move === "zet") {
        aanZet.value = aanZet.value === 0 ? 1 : 0;
    }

    brickSelected.value = false;
    kanSlaan.value = false;
    teststop.value = [false, false, false, false];

    for (let i = 0; i < 10; i++) {
        if (r + i < 11 && c + i < 11) {
            document.getElementById(r + i + "" + (c + i)).style.background =
                "grey";
            document
                .getElementById(r + i + "" + (c + i))
                .removeEventListener("click", slaAlleStenen, false);
        }
        if (c - i > 0 && r - i > 0) {
            document.getElementById(r - i + "" + (c - i)).style.background =
                "grey";
            document
                .getElementById(r - i + "" + (c - i))
                .removeEventListener("click", slaAlleStenen, false);
        }
        if (r + i < 11 && c - i > 0) {
            document.getElementById(r + i + "" + (c - i)).style.background =
                "grey";
            document
                .getElementById(r + i + "" + (c - i))
                .removeEventListener("click", slaAlleStenen, false);
        }
        if (r - i > 0 && c + i < 11) {
            document.getElementById(r - i + "" + (c + i)).style.background =
                "grey";
            document
                .getElementById(r - i + "" + (c + i))
                .removeEventListener("click", slaAlleStenen, false);
        }
    }
    if (steen == "brick") {
        checkDam(parseFloat(tr + "" + tc), tr, tc, aanBeurtBrick);
    }
}

function checkDam(id, row, column, speler) {
    for (let i = 0; i < speler.length; i++) {
        if (
            speler[i][0] == row &&
            speler[i][1] == column &&
            ((aanZet.value == 1 &&
                (id == 101 ||
                    id == 103 ||
                    id == 105 ||
                    id == 107 ||
                    id == 109)) ||
                (aanZet.value == 0 &&
                    (id == 12 ||
                        id == 14 ||
                        id == 16 ||
                        id == 18 ||
                        id == 110)))
        ) {
            speler[i][2] = "dam";
        }
    }
}
</script>
