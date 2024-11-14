<template>
    <div>
        <table v-if="GameState === true">
            <tr>
                <td
                    v-for="n in TotaalAantalVakjes"
                    :style="{
                        width: '100px',
                        height: '50px',
                        border: '1px solid black',
                        background: Kleurcombinatie[n - 1],
                        visibility: CombiZichtbaar,
                    }"
                    :id="n"
                ></td>
            </tr>
            <tr v-if="GameStarted === false">
                <td :style="{ width: '300px', height: '50px' }">
                    Aantal Speel Beurten:<input
                        v-model="TotaalAantalBeurten"
                        type="number"
                        min="1"
                        max="30"
                    />Max:30<br />
                    Aantal Kleuren:<input
                        v-model="TotaalAantalKleuren"
                        type="number"
                        min="1"
                        max="10"
                    />Max:10<br />
                    Aantal Vakjes:<input
                        v-model="TotaalAantalVakjes"
                        type="number"
                        min="1"
                        max="10"
                    />Max:10<br />
                </td>
                <button @click="StartGame()">Start Game</button
                ><br />
            </tr>
        </table>
        <table v-if="GameBoard === true">
            <div>
                <tr v-for="i in TotaalAantalBeurten">
                    <td
                        v-for="n in TotaalAantalVakjes + 2"
                        :style="{
                            width: '100px',
                            height: '50px',
                            border: '1px solid black',
                            background: KleurKeuze[i - 1][n - 1],
                        }"
                        :id="n"
                    >
                        <div
                            v-if="n == TotaalAantalVakjes + 1"
                            :style="{ fontSize: '10px' }"
                        >
                            goede Plek:{{ GoedePlek[i - 1] }}
                        </div>
                        <div
                            v-if="n == TotaalAantalVakjes + 2"
                            :style="{ fontSize: '10px' }"
                        >
                            goede kleur:{{ GoedeKleur[i - 1] }}
                        </div>
                    </td>
                </tr>
                <br />
                <tr v-if="Playstate === true">
                    <td
                        v-for="n in TotaalAantalVakjes"
                        :style="{
                            width: '100px',
                            height: '50px',
                            border: '1px solid black',
                            background: KleurenSelectie[KleurNummer[n - 1]],
                        }"
                        :id="n"
                        @click="KleurSwitch(n - 1)"
                    ></td>
                    <button @click="CheckCombination()">Check</button>
                </tr>
            </div>
        </table>
    </div>
</template>

<script setup>
import { ref } from "vue";

// TODO: gebruik Engelse namen, camelCase, en gebruik const voor data die niet verandert
let Beurt = ref(1);
let Kleurcombinatie = ref([]);
let KopieCombinatie = ref([]);
let TotaalAantalBeurten = 10;
let Counter = ref(0);
let Gelijk = ref([]);
let KleurenSelectie = [
    "red",
    "aqua",
    "green",
    "yellow",
    "magenta",
    "darkblue",
    "lime",
    "teal",
    "goldenrod",
    "crimson",
];
let KleurKeuze = ref([]);
let KopieKeuze = ref([]);
let KleurNummer = ref([]);
let GoedeKleur = ref([]);
let GoedePlek = ref([]);
let GameState = true;
let GameStarted = false;
let GameBoard = false;
let Playstate = false;
let CombiZichtbaar = "hidden";
let TotaalAantalKleuren = 6;
let TotaalAantalVakjes = 5;
let GelijkFalse = ref([]);
let BackgroundBoard = ref([]);

function StartGame() {
    Speelbord();
    for (let i = 0; i < TotaalAantalVakjes; i++) {
        const Kleur =
            KleurenSelectie[Math.floor(Math.random() * TotaalAantalKleuren)];
        KleurNummer.value[i] = Math.floor(Math.random() * TotaalAantalKleuren);
        Kleurcombinatie.value[i] = Kleur;
        GameState = false;
        GameBoard = true;
        Playstate = true;
        GameStarted = true;
    }
}

function Speelbord() {
    for (let y = 0; y < TotaalAantalVakjes; y++) {
        BackgroundBoard.value[y] = "white";
        GelijkFalse.value[y] = false;
        for (let x = 0; x < TotaalAantalBeurten; x++) {
            KleurKeuze.value[x] = JSON.parse(
                JSON.stringify(BackgroundBoard.value)
            );
            Gelijk.value[x] = JSON.parse(JSON.stringify(GelijkFalse.value));
        }
    }
}

function KleurSwitch(n) {
    KleurNummer.value[n]++;
    if (KleurNummer.value[n] > TotaalAantalKleuren - 1) {
        KleurNummer.value[n] = 0;
    }
}

function CheckCombination() {
    KopieCombinatie.value = [];
    for (let i = 0; i < TotaalAantalVakjes; i++) {
        KopieCombinatie.value.push(Kleurcombinatie.value[i]);
        KleurKeuze.value[TotaalAantalBeurten - Beurt.value][i] =
            KleurenSelectie[KleurNummer.value[i]];
        KopieKeuze.value[i] = KleurenSelectie[KleurNummer.value[i]];
        if (
            Kleurcombinatie.value[i] ==
            KleurKeuze.value[TotaalAantalBeurten - Beurt.value][i]
        ) {
            Gelijk.value[TotaalAantalBeurten - Beurt.value][i] = true;
            KopieKeuze.value[
                KopieKeuze.value.indexOf(KopieCombinatie.value[i])
            ] = "Gelijk";
        }
    }
    GoedePlek.value[TotaalAantalBeurten - Beurt.value] =
        Gelijk.value[TotaalAantalBeurten - Beurt.value].filter(Boolean).length;
    let Gewonnen =
        Gelijk.value[TotaalAantalBeurten - Beurt.value].every(Boolean);
    if (Gewonnen === true) {
        GameState = true;
        CombiZichtbaar = "visible";
        Playstate = false;
        return window.alert("Je hebt het goed geraden!");
    }

    for (let i = 0; i < TotaalAantalVakjes; i++) {
        if (
            Gelijk.value[TotaalAantalBeurten - Beurt.value][i] == false &&
            KopieKeuze.value.includes(KopieCombinatie.value[i])
        ) {
            Counter.value++;
            KopieKeuze.value[
                KopieKeuze.value.indexOf(KopieCombinatie.value[i])
            ] = "Kleur";
            KopieCombinatie.value[i] = "GoedeplekCombinatie";
        }
    }
    GoedeKleur.value[TotaalAantalBeurten - Beurt.value] = Counter.value;
    Counter.value = 0;
    Beurt.value++;
    if (Beurt.value == TotaalAantalBeurten + 1) {
        GameState = true;
        Playstate = false;
        CombiZichtbaar = "visible";
    }
}
</script>
