<template>
    <div>
        <div v-if="StenenGegooid == true">
            <tr>
                <td v-for="i in 6" :style="{width:'50px', height:'50px', border:'1px solid black', background:BordKleuren[i-3],}">
                    {{ Dobbelstenen[i-1] }}
                </td>
                <td> 
                    <button v-if="whiteclick[ActivePlayer-1] == true || colorclick[ActivePlayer-1] == true"  @click="NextTurn()">Volgende Speler</button>
                    <button v-else-if="ResetState == true" @click="ResetGame()">Volgende Game</button>
                    <button v-else @click="SkipTurn()">Sla Beurt over</button>
                </td>
            </tr>
        </div>
        <div v-if="PlayerSelect == false">
            Aantal Players:
            <select v-model.number="AantalPlayers">
                <option disabled value="">Hoeveel Spelers</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
            </select>
            <button @click="StartGame()">
                Start Game
            </button>
        </div>
        <div v-if="PlayerSelect == true">
            <table :style="{width:'750px', height:'200px', border:'1px solid black'}" v-for="Player in AantalPlayers">
                <tr v-for="kleur in 4">
                    <td v-for="Getal in 11" v-if="kleur < 3" :style="{width:'50px', height:'50px', border:'1px solid black', background:SpelBorden[Player-1]['background'+[BordKleuren[kleur-1]]][Getal-1]}">
                        <div v-if="SpelBorden[Player-1][BordKleuren[kleur-1]].lastIndexOf(true) < Getal && Gesloten[kleur-1] == false && SpelBorden[Player-1][BordKleuren[kleur-1]][Getal-1] == false && UitkomstStenen[0][0] == Getal+1 && whiteclick[Player-1] == false && colorclick[Player-1] == false"@click="ClickedWhite(Getal-1, kleur-1, Player-1)" :style="{background:'white'}">
                            {{ Getal+1 }}
                        </div>
                        <div v-else-if="SpelBorden[Player-1][BordKleuren[kleur-1]].lastIndexOf(true) < Getal && Gesloten[kleur-1] == false && Player == ActivePlayer && SpelBorden[Player-1][BordKleuren[kleur-1]][Getal-1] == false && colorclick[Player-1] == false && (UitkomstStenen[kleur][0] == Getal+1  || UitkomstStenen[kleur][1] == Getal+1)" :style="{background:klickedBackground[kleur-1]}" @click="ClickedColor(Getal-1, kleur-1, Player-1)">
                            {{ Getal+1 }}
                        </div>
                        <div v-else>
                            {{ Getal+1 }}
                        </div>
                    </td>
                    <td v-for="Getal in 11" v-if="kleur > 2" :style="{width:'50px', height:'50px', border:'1px solid black', background:SpelBorden[Player-1]['background'+[BordKleuren[kleur-1]]][Getal-1]}">
                        <div v-if="SpelBorden[Player-1][BordKleuren[kleur-1]].lastIndexOf(true) < Getal 
                            && Gesloten[kleur-1] == false 
                            && SpelBorden[Player-1][BordKleuren[kleur-1]][Getal-1] == false 
                            && UitkomstStenen[0][0] == 13-Getal 
                            && whiteclick[Player-1] == false 
                            && colorclick[Player-1] == false"
                            @click="ClickedWhite(Getal-1, kleur-1, Player-1)" 
                            :style="{background:'white'}"
                        >
                            {{ 13-Getal }}
                        </div>
                        <div v-else-if="SpelBorden[Player-1][BordKleuren[kleur-1]].lastIndexOf(true) < Getal 
                            && Gesloten[kleur-1] == false 
                            && Player == ActivePlayer 
                            && SpelBorden[Player-1][BordKleuren[kleur-1]][Getal-1] == false 
                            && colorclick[Player-1] == false 
                            && (UitkomstStenen[kleur][0] == 13-Getal || UitkomstStenen[kleur][1] == 13-Getal)"
                            :style="{background:klickedBackground[kleur-1]}" 
                            @click="ClickedColor(Getal-1, kleur-1, Player-1)"
                        >
                            {{ 13-Getal }}
                        </div>
                        <div v-else>
                            {{ 13-Getal }}
                        </div>
                    </td>
                    <td v-if="SpelerPuntenKleur[Player-1][kleur-1] > 0" :style="{width:'50px', height:'50px', border:'1px solid black', background:SpelBorden[Player-1]['background'+[BordKleuren[kleur-1]]][11]}">
                        {{ SpelerPuntenKleur[Player-1][kleur-1] }}
                    </td>
                    <td v-else-if="SpelBorden[Player-1][BordKleuren[kleur-1]].filter(Boolean).length > 3
                        && Gesloten[kleur-1] == false 
                        && SpelBorden[Player-1][BordKleuren[kleur-1]][10] == false
                        && SpelBorden[Player-1][BordKleuren[kleur-1]][11] == false
                        && kleur < 3
                        && Player == ActivePlayer
                        && ((UitkomstStenen[kleur][0] == 12 && colorclick[Player-1] == false) 
                            || (UitkomstStenen[0][0] == 12 && whiteclick[Player-1] == false && colorclick[Player-1] == false) 
                            || (UitkomstStenen[kleur][1] == 12 && colorclick[Player-1] == false))"
                        :style="{width:'50px', height:'50px', border:'1px solid black', background:'gray'}"
                        @click="SluitKleur(kleur-1, Player-1)">
                        🔒
                    </td>
                    <td v-else-if="SpelBorden[Player-1][BordKleuren[kleur-1]].filter(Boolean).length > 4 
                        && Gesloten[kleur-1] == false
                        && SpelBorden[Player-1][BordKleuren[kleur-1]][10] == false
                        && SpelBorden[Player-1][BordKleuren[kleur-1]][11] == false
                        && kleur >= 3
                        && Player == ActivePlayer
                        && ((UitkomstStenen[kleur][0] == 2 && colorclick[Player-1] == false)
                            || (UitkomstStenen[0][0] == 2 && whiteclick[Player-1] == false && colorclick[Player-1] == false) 
                            || (UitkomstStenen[kleur][1] == 2 && colorclick[Player-1] == false))"
                        :style="{width:'50px', height:'50px', border:'1px solid black', background:'gray'}"
                        @click="SluitKleur(kleur-1, Player-1)">
                        🔒
                    </td>
                    <td v-else :style="{width:'50px', height:'50px', border:'1px solid black', background:SpelBorden[Player-1]['background'+[BordKleuren[kleur-1]]][11]}">
                        🔒
                    </td>
                </tr>
                <th v-for="game in 4">
                    <td :style="{background:'lightgray', width:'50px', height:'25px', border:'1px solid red'}">
                        Game:{{game}}<br/>
                        {{ SpelerPuntenGame[Player-1][game-1] }}
                    </td>
                </th>
                <th v-for="checkbox in 4">
                    <td v-if="minpunten[Player-1][checkbox-1] == true" :style="{background:'black', width:'40px', height:'40px', border:'1px solid red'}">
                        x
                    </td>
                </th>
            </table>
            <br/>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    let AantalPlayers = ref(1)
    let SpelBorden = ref([])
    let PlayerSelect = ref(false)
    let StenenGegooid = ref(false)
    let BordKleuren = ['red', 'yellow', 'green', 'blue']
    let Dobbelstenen = ref([])
    let UitkomstStenen = ref([[],[],[],[],[]])
    let klickedBackground = ['darkred', 'orange', 'darkgreen', 'navy']
    let ActivePlayer = ref(1)
    let whiteclick = ref([false, false, false, false])
    let colorclick = ref([false, false, false, false])
    let minpunten = ref([[false, false, false, false],[false, false, false, false],[false, false, false, false],[false, false, false, false]])
    let Gesloten = ref([false, false, false, false])
    let Punten = [0,1,3,6,10,15,21,28,36,45,55,66,78]
    let SpelerPuntenKleur = ref([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])
    let SpelerPuntenGame = ref([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])
    let game = ref(0)  
    let ResetState = ref(false)  

    function PuntenBerekining(k){
        for(let k = 0; k < BordKleuren.length; k++){
            if(Gesloten.value[k] == true){
                for(let i = 0; i < AantalPlayers.value; i++){
                    SpelerPuntenKleur.value[i][k] = Punten[SpelBorden.value[i][BordKleuren[k]].filter(Boolean).length]
                }
            }
        }
        if (Gesloten.value.filter(Boolean).length > 1){
            for(let i = 0; i < AantalPlayers.value; i++){
                for(let k = 0; k < BordKleuren.length; k++){
                    SpelerPuntenKleur.value[i][k] = Punten[SpelBorden.value[i][BordKleuren[k]].filter(Boolean).length]
                    SpelerPuntenGame.value[i][game.value] = SpelerPuntenGame.value[i][game.value] + SpelerPuntenKleur.value[i][k] 
                }
            }
        ResetState.value = true
        }
    }
    

    function ResetGame(){
        for(let i = 0; i < AantalPlayers.value; i++){
            let boardstate = {red: [false, false, false, false, false, false, false, false, false, false, false, false],
                yellow: [false, false, false, false, false, false, false, false, false, false, false, false], 
                green: [false, false, false, false, false, false, false, false, false, false, false, false], 
                blue: [false, false, false, false, false, false, false, false, false, false, false, false],
                backgroundred: ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'],
                backgroundyellow: ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'], 
                backgroundgreen: ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'], 
                backgroundblue: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue']    
            }
        SpelBorden.value[i] = boardstate;
        }
        game.value++
        WerpStenen()
        return SpelBorden.value
    }

    function SluitKleur(k, p){
        SpelBorden.value[p][BordKleuren[k]][10] = true
        SpelBorden.value[p][BordKleuren[k]][11] = true
        SpelBorden.value[p]['background'+[BordKleuren[k]]][10] = klickedBackground[k]
        SpelBorden.value[p]['background'+[BordKleuren[k]]][11] = klickedBackground[k]
        Gesloten.value[k] = true
        if((UitkomstStenen[0] == 12 && k < 2) || (UitkomstStenen[0] == 2 && k > 1)){
            whiteclick.value[p] = true
        }
        else {
            colorclick.value[p] = true
        }
        PuntenBerekining(k)
    }

    function SkipTurn(){
        minpunten.value[ActivePlayer.value-1][minpunten.value[ActivePlayer.value-1].lastIndexOf(true)+1] = true
        if(minpunten.value[ActivePlayer.value-1].lastIndexOf(true) > 2){
            PuntenBerekining()
            window.alert("Game Over")
        }
        NextTurn()
    }

    function NextTurn(){
        ActivePlayer.value++
        if(ActivePlayer.value > AantalPlayers.value){
            ActivePlayer.value = 1
        }
        for(let i = 0; i < AantalPlayers.value; i++){
            colorclick.value[i] = false
            whiteclick.value[i] = false
        }
        WerpStenen()
    }

    function StartGame(){
        for(let i = 0; i < AantalPlayers.value; i++){
            let boardstate = {red: [false, false, false, false, false, false, false, false, false, false, false, false],
                yellow: [false, false, false, false, false, false, false, false, false, false, false, false], 
                green: [false, false, false, false, false, false, false, false, false, false, false, false], 
                blue: [false, false, false, false, false, false, false, false, false, false, false, false],
                backgroundred: ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'],
                backgroundyellow: ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'], 
                backgroundgreen: ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'], 
                backgroundblue: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue']    
            }
        SpelBorden.value.push(boardstate);
        }
        PlayerSelect.value = true
        WerpStenen()
        return SpelBorden.value
    }

    function DobbelsteenBerekening(){
        UitkomstStenen.value[0][0] = Dobbelstenen.value[0] + Dobbelstenen.value[1]
        UitkomstStenen.value[1][0] = Dobbelstenen.value[0] + Dobbelstenen.value[2]
        UitkomstStenen.value[1][1] = Dobbelstenen.value[1] + Dobbelstenen.value[2]
        UitkomstStenen.value[2][0] = Dobbelstenen.value[0] + Dobbelstenen.value[3]
        UitkomstStenen.value[2][1] = Dobbelstenen.value[1] + Dobbelstenen.value[3]
        UitkomstStenen.value[3][0] = Dobbelstenen.value[0] + Dobbelstenen.value[4]
        UitkomstStenen.value[3][1] = Dobbelstenen.value[1] + Dobbelstenen.value[4]
        UitkomstStenen.value[4][0] = Dobbelstenen.value[0] + Dobbelstenen.value[5]
        UitkomstStenen.value[4][1] = Dobbelstenen.value[1] + Dobbelstenen.value[5]
    }

    function ClickedColor(g, k, p){
        SpelBorden.value[p][BordKleuren[k]][g] = true
        SpelBorden.value[p]['background'+[BordKleuren[k]]][g] = klickedBackground[k]
        colorclick.value[p] = true
    }

    function ClickedWhite(g, k, p){
        if(colorclick.value[p] == false){
            SpelBorden.value[p][BordKleuren[k]][g] = true
            SpelBorden.value[p]['background'+[BordKleuren[k]]][g] = klickedBackground[k]
            whiteclick.value[p] = true
        }
    }

    function WerpStenen(){
        for (let i = 0; i < 6; i++){
                const RGetal = Math.floor(Math.random() * (6) + 1);
                Dobbelstenen.value[i] = RGetal
            }
            StenenGegooid.value = true
            DobbelsteenBerekening()
        return Dobbelstenen.value;
    }
</script>