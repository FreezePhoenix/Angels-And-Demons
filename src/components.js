Vue.component('card', {
  'template': `<div class="card"> 
               <div class="tag" v-bind:style="{
                 'cursor': !item.locked && !item.used && ( (item.inHand ? item.summonCost : item.manaCost) <= item.manaManager.mana) && !item.isLand && (item.isDecksTurn) ? 'pointer' : 'default',
                 'width': '100px',
                 'color': (item.locked  || item.used || ( (item.inHand ? item.summonCost : item.manaCost) > item.manaManager.mana) || item.isLand) ? (colors.DarkerColors[item.nameColor]) : ((item.selected) ? (colors.LighterColors[item.nameColor]) : (item.nameColor))}" :onclick="(item.indexInDecks ? 'enemy' : 'player') + (item.inHand ? 'Hand' : 'Deck')+ '.cards['+item.ID+']' + (item.inHand ? '.summon()' : '.onclick()')" align="center">
                   {{ item.name }}
                 </div> 
                 <br v-if="item.health && !item.inHand"> 
                 <div v-if="item.health && !item.inHand" style="background-color:black; width:100px;" class="health"> 
                   <div v-bind:style="item.style"> {{item.health}} </div> 
                 </div> 
                 <br> 
                 <div class="tagList"> 
                   <div class="manaCost"> {{ item.inHand ? item.summonCost : item.manaCost }} </div>
                   <div class="attack"> {{ item.attack }} </div> 
                   <div class="manaPerRound"> {{ item.manaPerTurn }} </div> 
                 </div> 
               </div>`,
   'props': ['item', 'turnManager', 'colors']
});