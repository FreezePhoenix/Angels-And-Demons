Vue.component('card', {
  'template': `<div class="card" v-if="item.name != null"> 
               <div class="tag" :style="{
                 'cursor': !item.locked && !item.used && ( (item.inHand ? item.summonCost : item.manaCost) <= item.manaManager.mana) && (item.isDecksTurn) && (item.inHand ? true : !item.isLand) ? 'pointer' : 'default',
                 'width': '100px',
                 'color': (item.locked  || item.used || ( (item.inHand ? item.summonCost : item.manaCost) > item.manaManager.mana) || (item.isDecksTurn) && (item.inHand ? false : item.inHand)) ? (colors.DarkerColors[item.nameColor]) : ((item.selected) ? (colors.LighterColors[item.nameColor]) : (item.nameColor))}" :onclick="(item.indexInDecks ? 'enemy' : 'player') + (item.inHand ? 'Hand' : 'Deck')+ '.cards['+item.ID+']' + (item.inHand ? '.summon()' : '.onclick()')" align="center">
                   {{ item.name }}
                 </div> 
                 <br v-if="item.health && !item.inHand"> 
                 <div v-if="item.health && !item.inHand" style="background-color:black; width:100px;" class="health"> 
                   <div :style="item.style" :title="'Health: ' + item.health +'/' + item.maxHealth">{{item.health}}</div> 
                 </div> 
                 <br> 
                 <div class="tagList"> 
                   <div class="manaCost" :title="(item.inHand ? 'Summon cost: ' + item.summonCost : 'Usage cost' + item.manaCost)">{{ item.inHand ? item.summonCost : item.manaCost }}</div>
                   <div class="attack" :title="'Attack: '+item.attack">{{ item.attack }}</div> 
                   <div class="manaPerRound" :title="'Mana per turn: '+item.manaPerTurn">{{ item.manaPerTurn }}</div> 
                 </div> 
               </div>`,
   'props': ['item', 'turnManager', 'colors']
});