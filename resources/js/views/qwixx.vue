<template>
    <div>
        <b>Rules:</b><br/>
        Any player may mark the sum of the white dice<br/>
        Marks may only be placed after the last mark in that row<br/>
        The player who's turn it is may also mark a combination of white with a color<br/>
        White should always be marked before the colored combination<br/>
        When a player gets 12 red/yellow or 2 green/blue and at least 5 marks in that row they may close the row<br/>
        When the active player can't or dont want to mark they get 5 penalty points<br/>
        After the 4th penalty or when 2 rows are closed the game ends<br/>
        <br/>
        <a href="https://gamewright.com/pdfs/Rules/QwixxTM-RULES.pdf">
            <b>Official rules:</b>
        </a>
        <br/><br/>
        <div v-if="DiceRolled == true">
            <tr>
                <td v-for="i in 6" :style="{width:'50px', height:'50px', border:'1px solid black', background:BoardColors[i-3],}">
                    {{ Dice[i-1] }}
                </td>
                <td> 
                    <button v-if="Whiteclick[ActivePlayer-1] == true || Colorclick[ActivePlayer-1] == true"  @click="NextTurn()">Volgende Speler</button>
                    <button v-else-if="ResetState == true" @click="ResetGame()">Volgende Game</button>
                    <button v-else @click="SkipTurn()">Sla Beurt over</button>
                </td>
            </tr>
        </div>
        <div v-if="PlayerSelect == false">
            Aantal Players:
            <select v-model.number="NumberOfPlayers">
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
            <br/>
            <b :style="{'font-size':'20px'}">Active Player:{{ ActivePlayer }}</b>
            <br/><br/>
            <table :style="{width:'750px', height:'200px', border:'1px solid black'}" v-for="Player in NumberOfPlayers">
                <tr v-for="kleur in 4">
                    <td v-for="Getal in 11" v-if="kleur < 3" :style="{width:'50px', height:'50px', border:'1px solid black', background:PlayingBoards[Player-1]['background'+[BoardColors[kleur-1]]][Getal-1]}">
                        <div v-if="PlayingBoards[Player-1][BoardColors[kleur-1]].lastIndexOf(true) < Getal && Locked[kleur-1] == false && PlayingBoards[Player-1][BoardColors[kleur-1]][Getal-1] == false && CombinedDice[0][0] == Getal+1 && Whiteclick[Player-1] == false && Colorclick[Player-1] == false"@click="ClickedWhite(Getal-1, kleur-1, Player-1)" :style="{background:'white'}">
                            {{ Getal+1 }}
                        </div>
                        <div v-else-if="PlayingBoards[Player-1][BoardColors[kleur-1]].lastIndexOf(true) < Getal && Locked[kleur-1] == false && Player == ActivePlayer && PlayingBoards[Player-1][BoardColors[kleur-1]][Getal-1] == false && Colorclick[Player-1] == false && (CombinedDice[kleur][0] == Getal+1  || CombinedDice[kleur][1] == Getal+1)" :style="{background:ClickedBackground[kleur-1]}" @click="ClickedColor(Getal-1, kleur-1, Player-1)">
                            {{ Getal+1 }}
                        </div>
                        <div v-else>
                            {{ Getal+1 }}
                        </div>
                    </td>
                    <td v-for="Getal in 11" v-if="kleur > 2" :style="{width:'50px', height:'50px', border:'1px solid black', background:PlayingBoards[Player-1]['background'+[BoardColors[kleur-1]]][Getal-1]}">
                        <div v-if="PlayingBoards[Player-1][BoardColors[kleur-1]].lastIndexOf(true) < Getal 
                            && Locked[kleur-1] == false 
                            && PlayingBoards[Player-1][BoardColors[kleur-1]][Getal-1] == false 
                            && CombinedDice[0][0] == 13-Getal 
                            && Whiteclick[Player-1] == false 
                            && Colorclick[Player-1] == false"
                            @click="ClickedWhite(Getal-1, kleur-1, Player-1)" 
                            :style="{background:'white'}"
                        >
                            {{ 13-Getal }}
                        </div>
                        <div v-else-if="PlayingBoards[Player-1][BoardColors[kleur-1]].lastIndexOf(true) < Getal 
                            && Locked[kleur-1] == false 
                            && Player == ActivePlayer 
                            && PlayingBoards[Player-1][BoardColors[kleur-1]][Getal-1] == false 
                            && Colorclick[Player-1] == false 
                            && (CombinedDice[kleur][0] == 13-Getal || CombinedDice[kleur][1] == 13-Getal)"
                            :style="{background:ClickedBackground[kleur-1]}" 
                            @click="ClickedColor(Getal-1, kleur-1, Player-1)"
                        >
                            {{ 13-Getal }}
                        </div>
                        <div v-else>
                            {{ 13-Getal }}
                        </div>
                    </td>
                    <td v-if="PlayerPointsColor[Player-1][kleur-1] > 0" :style="{width:'50px', height:'50px', border:'1px solid black', background:PlayingBoards[Player-1]['background'+[BoardColors[kleur-1]]][11]}">
                        {{ PlayerPointsColor[Player-1][kleur-1] }}
                    </td>
                    <td v-else-if="PlayingBoards[Player-1][BoardColors[kleur-1]].filter(Boolean).length > 3
                        && Locked[kleur-1] == false 
                        && PlayingBoards[Player-1][BoardColors[kleur-1]][10] == false
                        && PlayingBoards[Player-1][BoardColors[kleur-1]][11] == false
                        && kleur < 3
                        && Player == ActivePlayer
                        && ((CombinedDice[kleur][0] == 12 && Colorclick[Player-1] == false) 
                            || (CombinedDice[0][0] == 12 && Whiteclick[Player-1] == false && Colorclick[Player-1] == false) 
                            || (CombinedDice[kleur][1] == 12 && Colorclick[Player-1] == false))"
                        :style="{width:'50px', height:'50px', border:'1px solid black', background:'gray'}"
                        @click="SluitKleur(kleur-1, Player-1)">
                        🔒
                    </td>
                    <td v-else-if="PlayingBoards[Player-1][BoardColors[kleur-1]].filter(Boolean).length > 4 
                        && Locked[kleur-1] == false
                        && PlayingBoards[Player-1][BoardColors[kleur-1]][10] == false
                        && PlayingBoards[Player-1][BoardColors[kleur-1]][11] == false
                        && kleur >= 3
                        && Player == ActivePlayer
                        && ((CombinedDice[kleur][0] == 2 && Colorclick[Player-1] == false)
                            || (CombinedDice[0][0] == 2 && Whiteclick[Player-1] == false && Colorclick[Player-1] == false) 
                            || (CombinedDice[kleur][1] == 2 && Colorclick[Player-1] == false))"
                        :style="{width:'50px', height:'50px', border:'1px solid black', background:'gray'}"
                        @click="SluitKleur(kleur-1, Player-1)">
                        🔒
                    </td>
                    <td v-else :style="{width:'50px', height:'50px', border:'1px solid black', background:PlayingBoards[Player-1]['background'+[BoardColors[kleur-1]]][11]}">
                        🔒
                    </td>
                </tr>
                <th v-for="game in 4">
                    <td :style="{background:'lightgray', width:'50px', height:'25px', border:'1px solid red'}">
                        Game:{{game}}<br/>
                        {{ PlayerPointsGame[Player-1][game-1] }}
                    </td>
                </th>
                <th v-for="checkbox in 4">
                    <td v-if="Penaltypoints[Player-1][checkbox-1] == true" :style="{background:'black', width:'40px', height:'40px', border:'1px solid red'}">
                        x
                    </td>
                </th>
            <br/>
            </table>
        <br/>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    let NumberOfPlayers = ref(1)
    let PlayingBoards = ref([])
    let PlayerSelect = ref(false)
    let DiceRolled = ref(false)
    let BoardColors = ['red', 'yellow', 'green', 'blue']
    let Dice = ref([])
    let CombinedDice = ref([[],[],[],[],[]])
    let ClickedBackground = ['darkred', 'orange', 'darkgreen', 'navy']
    let ActivePlayer = ref(1)
    let Whiteclick = ref([false, false, false, false])
    let Colorclick = ref([false, false, false, false])
    let Penaltypoints = ref([[false, false, false, false],[false, false, false, false],[false, false, false, false],[false, false, false, false]])
    let Locked = ref([false, false, false, false])
    let Points = [0,1,3,6,10,15,21,28,36,45,55,66,78]
    let PlayerPointsColor = ref([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])
    let PlayerPointsGame = ref([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])
    let GameNumber = ref(0)  
    let ResetState = ref(false)  

    function PointsCalc(k){
        for(let k = 0; k < BoardColors.length; k++){
            if(Locked.value[k] == true){
                for(let i = 0; i < NumberOfPlayers.value; i++){
                    PlayerPointsColor.value[i][k] = Points[PlayingBoards.value[i][BoardColors[k]].filter(Boolean).length]
                }
            }
        }
        if (Locked.value.filter(Boolean).length > 1){
            for(let i = 0; i < NumberOfPlayers.value; i++){
                for(let k = 0; k < BoardColors.length; k++){
                    PlayerPointsColor.value[i][k] = Points[PlayingBoards.value[i][BoardColors[k]].filter(Boolean).length]
                    PlayerPointsGame.value[i][GameNumber.value] = PlayerPointsGame.value[i][GameNumber.value] + PlayerPointsColor.value[i][k] 
                }
                PlayerPointsGame.value[i][GameNumber.value] = PlayerPointsGame.value[i][GameNumber.value] - Penaltypoints.value[i].filter(Boolean).length*5
            }
        ResetState.value = true
        }
    }
    

    function ResetGame(){
        for(let i = 0; i < NumberOfPlayers.value; i++){
            let boardstate = {red: [false, false, false, false, false, false, false, false, false, false, false, false],
                yellow: [false, false, false, false, false, false, false, false, false, false, false, false], 
                green: [false, false, false, false, false, false, false, false, false, false, false, false], 
                blue: [false, false, false, false, false, false, false, false, false, false, false, false],
                backgroundred: ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'],
                backgroundyellow: ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'], 
                backgroundgreen: ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'], 
                backgroundblue: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue']    
            }
        PlayingBoards.value[i] = boardstate;
        }
        GameNumber.value++
        WerpStenen()
        return PlayingBoards.value
    }

    function SluitKleur(k, p){
        PlayingBoards.value[p][BoardColors[k]][10] = true
        PlayingBoards.value[p][BoardColors[k]][11] = true
        PlayingBoards.value[p]['background'+[BoardColors[k]]][10] = ClickedBackground[k]
        PlayingBoards.value[p]['background'+[BoardColors[k]]][11] = ClickedBackground[k]
        Locked.value[k] = true
        if((CombinedDice[0] == 12 && k < 2) || (CombinedDice[0] == 2 && k > 1)){
            Whiteclick.value[p] = true
        }
        else {
            Colorclick.value[p] = true
        }
        PointsCalc(k)
    }

    function SkipTurn(){
        Penaltypoints.value[ActivePlayer.value-1][Penaltypoints.value[ActivePlayer.value-1].lastIndexOf(true)+1] = true
        if(Penaltypoints.value[ActivePlayer.value-1].lastIndexOf(true) > 2){
            PointsCalc()
            window.alert("Game Over")
        }
        NextTurn()
    }

    function NextTurn(){
        ActivePlayer.value++
        if(ActivePlayer.value > NumberOfPlayers.value){
            ActivePlayer.value = 1
        }
        for(let i = 0; i < NumberOfPlayers.value; i++){
            Colorclick.value[i] = false
            Whiteclick.value[i] = false
        }
        WerpStenen()
    }

    function StartGame(){
        for(let i = 0; i < NumberOfPlayers.value; i++){
            let boardstate = {red: [false, false, false, false, false, false, false, false, false, false, false, false],
                yellow: [false, false, false, false, false, false, false, false, false, false, false, false], 
                green: [false, false, false, false, false, false, false, false, false, false, false, false], 
                blue: [false, false, false, false, false, false, false, false, false, false, false, false],
                backgroundred: ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'],
                backgroundyellow: ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'], 
                backgroundgreen: ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'], 
                backgroundblue: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue']    
            }
        PlayingBoards.value.push(boardstate);
        }
        PlayerSelect.value = true
        WerpStenen()
        return PlayingBoards.value
    }

    function DobbelsteenBerekening(){
        CombinedDice.value[0][0] = Dice.value[0] + Dice.value[1]
        CombinedDice.value[1][0] = Dice.value[0] + Dice.value[2]
        CombinedDice.value[1][1] = Dice.value[1] + Dice.value[2]
        CombinedDice.value[2][0] = Dice.value[0] + Dice.value[3]
        CombinedDice.value[2][1] = Dice.value[1] + Dice.value[3]
        CombinedDice.value[3][0] = Dice.value[0] + Dice.value[4]
        CombinedDice.value[3][1] = Dice.value[1] + Dice.value[4]
        CombinedDice.value[4][0] = Dice.value[0] + Dice.value[5]
        CombinedDice.value[4][1] = Dice.value[1] + Dice.value[5]
    }

    function ClickedColor(g, k, p){
        PlayingBoards.value[p][BoardColors[k]][g] = true
        PlayingBoards.value[p]['background'+[BoardColors[k]]][g] = ClickedBackground[k]
        Colorclick.value[p] = true
    }

    function ClickedWhite(g, k, p){
        if(Colorclick.value[p] == false){
            PlayingBoards.value[p][BoardColors[k]][g] = true
            PlayingBoards.value[p]['background'+[BoardColors[k]]][g] = ClickedBackground[k]
            Whiteclick.value[p] = true
        }
    }

    function WerpStenen(){
        for (let i = 0; i < 6; i++){
                const RGetal = Math.floor(Math.random() * (6) + 1);
                Dice.value[i] = RGetal
            }
            DiceRolled.value = true
            DobbelsteenBerekening()
        return Dice.value;
    }
</script>