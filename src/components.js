Vue.component('card', {
  'template': `<div class="card" :data-health="''+Boolean((item.health || 0) && !item.inHand)" :key="item.UUID" :id="item.UUID" v-if="item.name !== null" :style="{
                    'border-radius': '4px',
                    'background-color': item.selected ? 'LightGrey' : 'transparent'
                    }"> 
                   <div class="name">
                     <div class="summonOrAttack"> </div>
                     <div class="tag" :style="{
                     'cursor': !item.locked && !gameOver && !item.used && ( (item.inHand ? item.summonCost : item.manaCost) <= item.manaManager.mana) && (item.isDecksTurn) && (item.inHand ? true : !item.isLand) ? 'pointer' : 'default',
                     'text-shadow': item.selected ? ('0 0 4px' + item.nameColor) : 'none',
                     'color': (item.locked  || item.used || gameOver || ( (item.inHand ? item.summonCost : item.manaCost) > item.manaManager.mana) || (item.isDecksTurn) && (item.inHand ? false : item.inHand)) ? (colors.DarkerColors[item.nameColor]) : ((item.selected) ? (colors.LighterColors[item.nameColor]) : (item.nameColor))}" align="center" :onclick=" gameOver ? void(0) : ((item.indexInDecks ? 'enemy' : 'player') + (item.inHand ? 'Hand' : 'Deck')+ '.cards['+item.ID+']' + (item.inHand ? '.summon()' : '.onclick()'))">
                         {{ item.name }}
                   </div>
                   <div class="discard" :style="{'cursor': item.isDecksTurn ? 'pointer' : 'default'}" :onclick="(item.indexInDecks ? 'enemy' : 'player') + (item.inHand ? 'Hand' : 'Deck')+ '.cards['+item.ID+']' + '.discard()'"> D </div>
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
   'props': {
              'index': Number,
              'item': Card,
              'turnManager': TurnManager, 
              'colors': Object,
              'gameOver': Boolean
            }
});