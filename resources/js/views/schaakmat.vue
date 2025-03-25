<template>
    <div v-if="gameOn == false">
        <select v-model="typeOfPlayer">
            <option disabled value="">AI of Player</option>
            <option value="0">AI</option>
            <option value="1">Player</option>
        </select>
        <button @click="startGame()">Start</button>
    </div>
    <div v-if="gameOn == true">
        <div>
            <b>{{ aanZet }} is aan zet</b>
        </div>
        <div><b></b></div>
        <table>
            <tr v-for="row in 8">
                <td v-for="column in 8">
                    <!-- TODO: gebruik reactive styling mbv css-classes -->
                    <!-- TODO: met XOR kun je onderstaande 2 regels vervangen door: (row % 2 == 0 ^ column % 2 == 0) -->
                     <!-- TODO: het enige verschil lijkt de background (grey of white). De rest van deze twee onderstaande codeblokken zijn gelijk.
                      Je kunt dus met 1 code blok toe, en de background reactive maken -->
                    <div
                        :id="row + '' + column"
                        v-if="
                            (row % 2 == 0 && column % 2 != 0) ||
                            (row % 2 != 0 && column % 2 == 0)
                        "
                        :style="{
                            width: '65px',
                            height: '65px',
                            border: '1px solid black',
                            background: 'grey',
                        }"
                    >
                        <div v-for="piece in pieces">
                            <div
                                v-if="row == piece[0] && column == piece[1]"
                                @click="checkPieces(piece, row, column)"
                                :style="{
                                    'font-size': '50px',
                                    margin: '5px',
                                }"
                            >
                                {{ piece[4] }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        :id="row + '' + column"
                        :style="{
                            width: '65px',
                            height: '65px',
                            border: '1px solid black',
                            background: 'white',
                        }"
                    >
                        <div v-for="piece in pieces">
                            <div
                                v-if="row == piece[0] && column == piece[1]"
                                @click="checkPieces(piece, row, column)"
                                :style="{
                                    'font-size': '50px',
                                    margin: '5px',
                                }"
                            >
                                {{ piece[4] }}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script setup>
import { ref } from "vue";
let pieces = ref([
    [8, 1, "toren", "wit", "♖"],
    [8, 2, "paard", "wit", "♘"],
    [8, 3, "loper", "wit", "♗"],
    [8, 4, "koning", "wit", "♕"],
    [8, 5, "koningin", "wit", "♔"],
    [8, 6, "paard", "wit", "♘"],
    [8, 7, "loper", "wit", "♗"],
    [8, 8, "toren", "wit", "♖"],
    [7, 1, "pion", "wit", "♙"],
    [7, 2, "pion", "wit", "♙"],
    [7, 3, "pion", "wit", "♙"],
    [7, 4, "pion", "wit", "♙"],
    [7, 5, "pion", "wit", "♙"],
    [7, 6, "pion", "wit", "♙"],
    [7, 7, "pion", "wit", "♙"],
    [7, 8, "pion", "wit", "♙"],
    //
    [1, 1, "toren", "zwart", "♜"],
    [1, 2, "paard", "zwart", "♞"],
    [1, 3, "loper", "zwart", "♝"],
    [1, 4, "koning", "zwart", "♛"],
    [1, 5, "koningin", "zwart", "♚"],
    [1, 6, "loper", "zwart", "♝"],
    [1, 7, "paard", "zwart", "♞"],
    [1, 8, "toren", "zwart", "♜"],
    [2, 1, "pion", "zwart", "♟"],
    [2, 2, "pion", "zwart", "♟"],
    [2, 3, "pion", "zwart", "♟"],
    [2, 4, "pion", "zwart", "♟"],
    [2, 5, "pion", "zwart", "♟"],
    [2, 6, "pion", "zwart", "♟"],
    [2, 7, "pion", "zwart", "♟"],
    [2, 8, "pion", "zwart", "♟"],
]);

let gameOn = ref(false);
let typeOfPlayer = ref();
// TODO: probeer alles in het Engels te schrijven
let aanZet = ref("wit");
let selectedPiece = ref(false);

function startGame() {
    gameOn.value = true;
}

function checkPieces(piece, row, column) {
    if (aanZet.value == piece[3] && selectedPiece.value == false) {
        pieceFunction[piece[2]](piece, row, column);
    }
}

var pieceFunction = {
    toren: function (piece, row, column) {
        pieceMovement(piece, row, column, 0, 1);
        pieceMovement(piece, row, column, 0, -1);
        pieceMovement(piece, row, column, -1, 0);
        pieceMovement(piece, row, column, 1, 0);
    },

    paard: function (piece, row, column) {
        pieceMovement(piece, row, column, 1, 2);
        pieceMovement(piece, row, column, 1, -2);
        pieceMovement(piece, row, column, -1, 2);
        pieceMovement(piece, row, column, -1, -2);
        pieceMovement(piece, row, column, 2, 1);
        pieceMovement(piece, row, column, 2, -1);
        pieceMovement(piece, row, column, -2, 1);
        pieceMovement(piece, row, column, -2, -1);
    },

    loper: function (piece, row, column) {
        pieceMovement(piece, row, column, 1, 1);
        pieceMovement(piece, row, column, 1, -1);
        pieceMovement(piece, row, column, -1, 1);
        pieceMovement(piece, row, column, -1, -1);
    },

    koning: function (piece, row, column) {
        pieceMovement(piece, row, column, 0, 1);
        pieceMovement(piece, row, column, 0, -1);
        pieceMovement(piece, row, column, -1, 0);
        pieceMovement(piece, row, column, 1, 0);
        pieceMovement(piece, row, column, 1, 1);
        pieceMovement(piece, row, column, 1, -1);
        pieceMovement(piece, row, column, -1, 1);
        pieceMovement(piece, row, column, -1, -1);
    },

    koningin: function (piece, row, column) {
        pieceMovement(piece, row, column, 0, 1);
        pieceMovement(piece, row, column, 0, -1);
        pieceMovement(piece, row, column, -1, 0);
        pieceMovement(piece, row, column, 1, 0);
        pieceMovement(piece, row, column, 1, 1);
        pieceMovement(piece, row, column, 1, -1);
        pieceMovement(piece, row, column, -1, 1);
        pieceMovement(piece, row, column, -1, -1);
    },

    pion: function (piece, row, column) {
        // TODO: gebruik Engelse naamgeving (white)
        const direction = piece[3] === "wit" ? -1 : 1;
        var count = [0, 0];

        //nog toevoegen:
        //het slaan van de pion voor je in als je in start positie staat,

        for (let i = 0; i < pieces.value.length; i++) {
            if (
                pieces.value[i][0] == piece[0] + direction &&
                pieces.value[i][1] == piece[1]
            ) {
                count[0]++;
            }

            if (
                pieces.value[i][0] == piece[0] + direction &&
                pieces.value[i][1] == piece[1] + 1 &&
                pieces.value[i][3] !== piece[3]
            ) {
                pieceMovement(piece, row, column, direction, 1);
            }

            if (
                pieces.value[i][0] == piece[0] + direction &&
                pieces.value[i][1] == piece[1] - 1 &&
                pieces.value[i][3] !== piece[3]
            ) {
                pieceMovement(piece, row, column, direction, -1);
            }
            if (
                (pieces.value[i][0] == piece[0] + direction ||
                    pieces.value[i][0] == piece[0] + direction + direction) &&
                pieces.value[i][1] == piece[1]
            ) {
                count[1]++;
            }
        }
        if (count[0] == 0) {
            pieceMovement(piece, row, column, direction, 0);
        }
        if (
            count[1] == 0 &&
            ((piece[3] == "wit" && piece[0] == 7) ||
                (piece[3] == "zwart" && piece[0] == 2))
        ) {
            pieceMovement(piece, row, column, direction + direction, 0);
        }
    },
};

function pieceMovement(
    piece,
    row,
    column,
    targetRow,
    targetColumn,
    specialPion
) {
    var kingCount = piece[2] === "koning" || "paard" || "pion" ? 2 : 8;
    var kingCount = specialPion === true ? 3 : kingCount;
    var count = 0;

    for (let i = 1; i < kingCount; i++) {
        if (
            row + targetRow * i > 0 &&
            column + targetColumn * i > 0 &&
            row + targetRow * i < 9 &&
            column + targetColumn * i < 9 &&
            count == 0
        ) {
            for (let p = 0; p < pieces.value.length; p++) {
                if (
                    piece[0] + targetRow * i == pieces.value[p][0] &&
                    piece[1] + targetColumn * i == pieces.value[p][1] &&
                    piece[3] == pieces.value[p][3]
                ) {
                    count++;
                }
            }
            if (count == 0) {
                acties(
                    piece,
                    row,
                    column,
                    row + targetRow * i,
                    column + targetColumn * i
                );
                selectedPiece.value = true;
                for (let p = 0; p < pieces.value.length; p++) {
                    if (
                        piece[0] + targetRow * i == pieces.value[p][0] &&
                        piece[1] + targetColumn * i == pieces.value[p][1]
                    ) {
                        count++;
                    }
                }
            }
        }
    }
}

function acties(piece, row, column, targetRow, targetColumn) {
    // TODO: vervang onderstaande selectors voor :class reactive bindings
    document.getElementById(targetRow + "" + targetColumn).style.background =
        "green";
    document
        .getElementById(targetRow + "" + targetColumn)
        .addEventListener("click", movePiece);
    document.getElementById(targetRow + "" + targetColumn).params = [
        piece,
        row,
        column,
        targetRow,
        targetColumn,
    ];
    selectedPiece.value = false;
}

function movePiece(evt) {
    const piece = evt.target.params[0];
    // TODO: row en column hier onder zijn overbodig en kunnen weg?
    const row = evt.target.params[1];
    const column = evt.target.params[2];
    const targetRow = evt.target.params[3];
    const targetColumn = evt.target.params[4];
    piece[0] = targetRow;
    piece[1] = targetColumn;
    for (let i = 0; i < pieces.value.length; i++) {
        if (
            pieces.value[i][0] == targetRow &&
            pieces.value[i][1] == targetColumn &&
            piece[3] != pieces.value[i][3]
        ) {
            pieces.value[i].splice(0, 1);
        }
    }

    for (let row = 1; row < 9; row++) {
        for (let column = 1; column < 9; column++) {
            if (
                (row % 2 == 0 && column % 2 != 0) ||
                (row % 2 != 0 && column % 2 == 0)
            ) {
                document.getElementById(row + "" + column).style.background =
                    "grey";
            } else {
                document.getElementById(row + "" + column).style.background =
                    "white";
            }
            document
                .getElementById(row + "" + column)
                .removeEventListener("click", movePiece, false);
        }
    }

    if (
        piece[2] == "pion" &&
        ((piece[3] == "wit" && piece[0] == 1) ||
            (piece[3] == "zwart" && piece[0] == 8))
    ) {
        piece[2] = "koningin";
        piece[4] = piece[3] === "wit" ? "♔" : "♚";
    }

    selectedPiece.value = false;
    aanZet.value = piece[3] === "wit" ? "zwart" : "wit";
}
</script>
