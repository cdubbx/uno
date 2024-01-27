import Card from './Card';

const colors = ['Red', 'Green', 'Blue', 'Yellow'];
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const wildcards = ['take2', 'take4', 'reverse', 'skip','changeColor']
export function createDeck() {
  let deck = []; // making an empty as array called deck 

  for (let color of colors) { // going to iterate through the colors array 
    // this is where I want to add the wildcards 
    for (let wildcard of wildcards) {
      deck.push({ id: `${color}-${wildcard}`, display: (props) => <Card id={`${color}-${wildcard}`}  color={color} wildcard={wildcard} {...props}/> });
    }
    for (let number of numbers) {   // going to iterate through the numbers 
      deck.push({ id: `${color}-${number}`, display: (props) => <Card id={`${color}-${number}`}   color={color} number={number} {...props}/> });  // in this case we are pushing the id: object that is
      // made from the color, ex: Red-7, and we are passing a function called display the returns a Card element that uses the color and number element from the for-loop
    }
  }
  // Add special cards here
  return deck;
}

export function shuffleDeck(deck) {
  let shuffled = [...deck]; // we are setting shuffled equal to 
  for (let i = shuffled.length - 1; i > 0; i--) { // we are starting from the top and we are shuffling to the bottom of the stack of cards
    const j = Math.floor(Math.random() * (i + 1)); // we are setting the j index of cards to the 
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
