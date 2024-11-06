<template>
    <div>
        <table>
            <br/>
            <tr>
                <th>
                    <!--  Lege cell voor spacing -->
                </th>
                <td v-for="i in 5" :style="{width:'100px', height:'50px', border:'1px solid black', background:DobbelsteenBackground[i-1]}" @click="SteenKeuze(i-1)">
                    {{ Dobbelstenen[i-1] }}
                </td>
                <td> 
                    <button @click="WerpStenen(Dobbelstenen)">Gooi Stenen</button>
                </td>
            </tr>
            <tr>
                <th>
                    <!--  Lege cell voor spacing -->
                </th>
                <th v-for="i in 6" :id="i" :style="{width:'100px', height:'50px', border:'1px solid black'}"  >
                     Game:{{ i }}
                </th>
            </tr>

            <!-- Bovenste rij -->
            <tr v-for="i in 6">
                Totaal aantal: {{ i }}
                <td v-for="n in 6" :style="{width:'100px', height:'50px', border:'1px solid black', background:BackgroundColorBoven[n-1][i-1]}" :id="n">
                    <!-- <div v-if="n === Game"> -->
                        <div v-if="VastzettenBoven[n-1][i-1] == true" >
                            <!-- <div :style="{background:'lightgray'}"> -->
                                {{ScoreBoven[n-1][i-1]}}
                            <!-- </div> -->
                        </div>
                        <div v-if="VastzettenBoven[n-1][i-1] == false && n === Game" @click="ScoreVastzettenBoven(i, $event.target.innerHTML)">    
                            {{ BovensteHelftBerekening(i) }} 
                        </div>
                        <div v-else="0"></div>
                    <!-- </div> -->
                </td>
            </tr>

            <!-- Totaal aantal bovenste rij -->
            <tr v-for="i in 3"> 
                {{ BovensteRijScoreNamen[i-1]}}
                <td v-for="n in 6" :style="{width:'100px', height:'50px', border:'1px solid black'}" :id="n">
                    <div v-if=" i == 1 && n === Game">
                        {{  ScoreBerekeningBoven() }}
                    </div>
                    <div v-if="i == 2 && n === Game">
                        {{  Bonus() }}
                    </div>
                    <div v-if="i == 3 && n === Game">
                        {{  ScoreBerekeningBovenTotaal() }}
                    </div>
                </td>
            </tr>
            <br/>

            <!-- Onderste rij -->
            <tr v-for="i in 7" :id="i">
                {{ NamenOndersteRij[i-1] }}
                <td v-for="n in 6" :style="{width:'100px', height:'50px', border:'1px solid black', background:BackgroundColorBeneden[n-1][i-1]}" :id="n">
                    <div v-if="VastzettenOnder[n-1][i-1] == true" >
                            {{ScoreOnder[n-1][i-1]}}
                        </div>
                    <div v-if="n === Game && VastzettenOnder[n-1][i-1] == false && Worp > 0"  @click="ScoreVastzetenBeneden(i, $event.target.innerHTML)">
                       <div v-if="i == 1">
                           {{ TreeOfAKind()}}                           
                        </div>
                        <div v-if="i == 2">
                            {{ FourOfAKind() }} 
                        </div>
                        <div v-if="i == 3">
                            {{ FullHouse() }} 
                        </div>
                        <div v-if="i == 4">
                            {{ KleineStraatBerekening() }} 
                        </div>
                        <div v-if="i == 5">
                            {{ GroteStraatBerekening() }} 
                        </div>
                        <div v-if="i == 6">
                            {{ Yahtzee() }} 
                        </div>
                        <div v-if="i == 7">
                            {{ Chance() }} 
                        </div>
                    </div>
                </td>
            </tr>

            <!-- Totaal aantal bovenste rij -->
            <tr v-for="i in 3">
                {{ OndersteRijScoreNamen[i-1] }}
                <td v-for="n in 6" :style="{width:'100px', height:'50px', border:'1px solid black'}" :id="n">
                    <div v-if="i == 1 && n === Game">
                        {{  ScoreBerekeningBeneden() }}
                    </div>
                    <div v-if="i == 2 && n === Game">
                        {{  ScoreBerekeningBoven() }}
                    </div>
                    <div v-if="i == 3 && n === Game">
                        {{  TotaalScoreBerekening() }}
                    </div>
                </td>
            </tr>

    
        </table>
    </div>

</template>

<script setup>
import { ref } from 'vue'
let Dobbelstenen = ref([0,0,0,0,0]);
let DobbelsteenKeuze = ref([false, false, false, false, false]);
let DobbelsteenBackground = ref(['white','white','white','white','white']);
let AantalHetzelfde = ref([0,0,0,0,0,0]);
let Worp = ref(0);
let Game = ref(1)

const OndersteRijScoreNamen = ['Score onder', 'Score boven', 'Totaal'];
const BovensteRijScoreNamen = ['Score boven', 'Bonus punten', 'Totaalscore boven'];
const NamenOndersteRij = ['Tree of a kind', 'Carre', 'Full House', 'Kleine straat', 'Grote straat', 'Yahtzee', 'Chance'];

let GroteStraat = [
    [1,2,3,4,5],
    [2,3,4,5,6]
];

let KleineStraat = [
    [1,2,3,4], 
    [2,3,4,5], 
    [3,4,5,6]]

// let Scores = ref([
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0],
    //     [0,0,0,0,0,0,0,0,0,0,0,0,0],
    // ])


    //Beide Scores in 1 array > functie is mooier
    let ScoreBoven = ref([
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
    ])

    let ScoreOnder = ref([
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
    ])

    // let VastzettenScore = ref([
    //     [false, false, false, false, false, false, false, false, false, false, false, false, false],
    //     [false, false, false, false, false, false, false, false, false, false, false, false, false],
    //     [false, false, false, false, false, false, false, false, false, false, false, false, false],
    //     [false, false, false, false, false, false, false, false, false, false, false, false, false],
    //     [false, false, false, false, false, false, false, false, false, false, false, false, false],
    //     [false, false, false, false, false, false, false, false, false, false, false, false, false],]);


    //Beide vastgezette scores in 1 array, zoals hierboven
    let VastzettenBoven = ref([
       [false, false, false, false, false, false],
       [false, false, false, false, false, false],
       [false, false, false, false, false, false],
       [false, false, false, false, false, false],
       [false, false, false, false, false, false],
       [false, false, false, false, false, false]]);

    let VastzettenOnder = ref([
       [false, false, false, false, false, false, false],
       [false, false, false, false, false, false, false],
       [false, false, false, false, false, false, false],
       [false, false, false, false, false, false, false],
       [false, false, false, false, false, false, false],
       [false, false, false, false, false, false, false]]);
    

    //Beide background collors combineren in 1 functie   
    let BackgroundColorBoven = ref([
        ['white','white','white','white','white','white'],
        ['white','white','white','white','white','white'],
        ['white','white','white','white','white','white'],
        ['white','white','white','white','white','white'],
        ['white','white','white','white','white','white'],
        ['white','white','white','white','white','white'],
    ]);
    
    let BackgroundColorBeneden = ref([
        ['white','white','white','white','white','white','white'],
        ['white','white','white','white','white','white','white'],
        ['white','white','white','white','white','white','white'],
        ['white','white','white','white','white','white','white'],
        ['white','white','white','white','white','white','white'],
        ['white','white','white','white','white','white','white'],
    ]);


    function ScoreVastzettenBoven(i, score){
        if (Worp.value > 0){
            let ScoreFloat = parseInt(score)
            VastzettenBoven.value[Game.value-1][i-1] = true;
            BackgroundColorBoven.value[Game.value-1][i-1] = 'lightgrey'
            ScoreBoven.value[Game.value-1][i-1] = ScoreFloat
            Worp.value = 0;
            Dobbelstenen.value = [0,0,0,0,0];
            DobbelsteenBackground.value = ['white', 'white', 'white', 'white', 'white']
            DobbelsteenKeuze.value = [false, false, false, false, false]
        }
    }

    function ScoreVastzetenBeneden(i, score){
        if (Worp.value > 0){
            let ScoreFloat = parseInt(score)
            VastzettenOnder.value[Game.value-1][i-1] = true;
            BackgroundColorBeneden.value[Game.value-1][i-1] = 'lightgrey'
            ScoreOnder.value[Game.value-1][i-1] = ScoreFloat
            Worp.value = 0;
            Dobbelstenen.value = [0,0,0,0,0];
            DobbelsteenBackground.value = ['white', 'white', 'white', 'white', 'white']
            DobbelsteenKeuze.value = [false, false, false, false, false]
        }
    }

    function ScoreBerekeningBoven(){
       let ScoreCheck = VastzettenBoven.value[Game.value-1].every(Boolean)
       if (ScoreCheck == true){
           return  ScoreBoven.value[Game.value-1].reduce((a, b) => a + b, 0)
       }
    }
    
    function ScoreBerekeningBeneden(){
        let ScoreCheck = VastzettenOnder.value[Game.value-1].every(Boolean)
        if (ScoreCheck == true){
            return  ScoreOnder.value[Game.value-1].reduce((a, b) => a + b, 0)
        }
    }
    
    function TotaalScoreBerekening(){
       let ScoreCheck1 = VastzettenBoven.value[Game.value-1].every(Boolean)
       let ScoreCheck2 = VastzettenOnder.value[Game.value-1].every(Boolean)
       if (ScoreCheck1 == true && ScoreCheck2 == true){
            Game.value = Game.value+1
           return  ScoreOnder.value[Game.value-1].reduce((a, b) => a + b, 0) + ScoreBoven.value[Game.value-1].reduce((a, b) => a + b, 0)
       }
    }

    function Bonus(){
        let ScoreCheck = VastzettenBoven.value[Game.value-1].every(Boolean)
        if (ScoreBoven.value[Game.value-1].reduce((a, b) => a + b, 0) > 62 && ScoreCheck == true){
            return 35
        }
        else if (ScoreCheck == true) return 0
    }

    function ScoreBerekeningBovenTotaal(){
        let ScoreCheck = VastzettenBoven.value[Game.value-1].every(Boolean)
        if (ScoreBoven.value[Game.value-1].reduce((a, b) => a + b, 0) > 62 && ScoreCheck == true){
            return ScoreBoven.value[Game.value-1].reduce((a, b) => a + b, 0)+35
        }
        else if (ScoreCheck == true) return ScoreBoven.value[Game.value-1].reduce((a, b) => a + b, 0)

    }

    //Functie na klikken, is dit gewenst?
    function SteenKeuze(i){
        if(Worp.value > 0){
            DobbelsteenKeuze.value[i] = !DobbelsteenKeuze.value[i],
            DobbelBackground(i)
        } 
        return DobbelsteenKeuze.value;
    }

    function DobbelBackground(i){
        if(DobbelsteenKeuze.value[i] == true){
            DobbelsteenBackground.value[i] = 'lightgrey'
        }
        else DobbelsteenBackground.value[i] = 'white'
    }


    function WerpStenen(){
        for (let i = 0; i < 5; i++){
            if (DobbelsteenKeuze.value[i] === false && Worp.value <= 2){
                const RGetal = Math.floor(Math.random() * (6) + 1);
                Dobbelstenen.value[i] = RGetal
                }
            }
        Worp.value++;
        return Dobbelstenen.value;
    }

    // 2x if
    // worp > 0 anders returnt er 0 als er niet gegooid is
    function BovensteHelftBerekening(z){
        for (let i = 1; i < 7; i++){
           var aantal = this.Dobbelstenen.filter((x) => x === i).length;
           if (Worp.value > 0){
               if (z === i){
                   return aantal*i;
                }
            }
            else return
        }
    }

    function TreeOfAKind(){       
        for (let i = 1; i < 7; i++){
            var Aantal = this.Dobbelstenen.filter((x) => x === i).length;
            AantalHetzelfde.value[i] = Aantal
            }
        let AantalNewArray = JSON.parse(JSON.stringify(AantalHetzelfde.value))
        let AantalSort = AantalNewArray.sort().reverse()
        const totaal = this.Dobbelstenen.reduce((a, b) => a + b, 0);
        if (AantalSort[0] > 2){
            return totaal
        }
        else return 0
    }

    function FourOfAKind(){
        for (let i = 1; i < 7; i++){
            var Aantal = this.Dobbelstenen.filter((x) => x === i).length;
            AantalHetzelfde.value[i] = Aantal
            }
        let AantalNewArray = JSON.parse(JSON.stringify(AantalHetzelfde.value))
        let AantalSort = AantalNewArray.sort().reverse()
        const totaal = this.Dobbelstenen.reduce((a, b) => a + b, 0);
        if (AantalSort[0] > 3){
            return totaal
        }
        else return 0
    }

    function FullHouse(){
        var FullHouseCheck = JSON.parse(JSON.stringify(Dobbelstenen.value));
        FullHouseCheck.sort()
        if(FullHouseCheck[0] == FullHouseCheck[1] && FullHouseCheck[2] == FullHouseCheck[4] 
        || FullHouseCheck[0] == FullHouseCheck[2] && FullHouseCheck[3] == FullHouseCheck[4]
        || FullHouseCheck[0] == FullHouseCheck[4]) {
            return 25
        }   
        else return 0
    }


    function KleineStraatBerekening(){
        var StraatCheck = JSON.parse(JSON.stringify(Dobbelstenen.value));
        let KleineStraatLaag = KleineStraat[0].every((val) => StraatCheck.includes(val))
        let KleineStraatMidden = KleineStraat[1].every((val) => StraatCheck.includes(val))
        let KleineStraatHoog = KleineStraat[2].every((val) => StraatCheck.includes(val))
        if (KleineStraatLaag || KleineStraatMidden || KleineStraatHoog == true){
            return 30
        }
        else return 0
    }

    function GroteStraatBerekening(){
        var StraatCheck = JSON.parse(JSON.stringify(Dobbelstenen.value));
        let GroteStraatLaag = GroteStraat[0].every((val) => StraatCheck.includes(val))
        let GroteStraatHoog = GroteStraat[1].every((val) => StraatCheck.includes(val))

      if (GroteStraatLaag || GroteStraatHoog == true){
        return 40
        }
        else return 0
    }

    function Yahtzee(){
        var YahtzeeCheck = JSON.parse(JSON.stringify(Dobbelstenen.value));
        YahtzeeCheck.sort()
        if(YahtzeeCheck[0] == YahtzeeCheck[4]){
            return 50
        }   
        else return 0
    }


    function Chance(){
        return this.Dobbelstenen.reduce((a, b) => a + b, 0);
    }

</script>