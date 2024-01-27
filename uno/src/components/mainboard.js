import { Box, Flex, HStack, Image, Stack, VStack} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { createDeck, shuffleDeck } from './Deck';
import Card, { DeckCard } from './Card';
import { animated, useSpring } from 'react-spring';



// Deck Component








function CardStack({ onTakeCard }) {
  return (
    <Box
      position="absolute"
      height="200px" // Height of the stack
      width="100px"  // Width of the stack
      borderRadius="lg"
      // _before={{
      //   content: `""`,
      //   position: "absolute",
      //   top: "0",
      //   right: "0",
      //   borderBottom: "30px solid white", // Simulate the side of the stack
      //   borderLeft: "50px solid transparent", // The size should be adjusted based on the actual dimensions of the stack
      //   height: "0",
      //   width: "100px",
      //   zIndex: "-1"
      // }}
      onClick={onTakeCard} // we are calling the function to take the card 
      cursor="pointer" // we want to make the cursor looks like a pointer
    >

       {/*this is the card that is specifically for the take card function */}
      < DeckCard /> 
    </Box>
  );
}

  


export default function Mainboard() {
  const backgroundImage = "/images/boardImage.jpg"
  const [deck, setDeck] = useState([]);
  const [isTaken, setTaken] = useState(false); // New state to control the animation
  const [cardPosition, setCardPosition] = useState({ y: 0 }); // New state for card position
  const [currentCard, setCurrentCard] = useState({ color: 'Red', number: 1 });
  const [doubleClicked, setDoubleClicked] = useState(false)
  const MAX_HAND_SIZE = 5; // Maximum number of cards in a player's hand
  const [playerHand, setPlayerHand] = useState([]); // State for the player's hand
  const centerPileRef = useRef(null);  // Ref for the center pile

  const cardRef = useRef(null);

  const ws = useRef(null);




  useEffect(() => {
    // Initialize the WebSocket connection
    ws.current = new WebSocket('ws://localhost:8000'); // make a new WebSocket instance 

    ws.current.onopen = () => { // this opens the web socket instance
      console.log('WebSocket connection established'); // when the instance is connected we want to log a message for confirmation 
      
    };

    ws.current.onmessage = (event) => {   // this the function that receives the message from the wb server 
      if (event.data instanceof Blob) { // the event data should be in the form of a blob 
        // Convert Blob to text
        event.data.text().then((text) => {   //this function is converting the blob and making it into tet 
          // console.log('Message received from server:', text);
          // You can parse it as JSON if it's a JSON string
          const data = JSON.parse(text);
          // Handle the data...
        });
      } else {
        // Handle other types of data (e.g., if it's already a string)
        console.log('Message received from server:', event.data);
      }
    };
    
    
    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Clean up the WebSocket on component unmount
    return () => {
      if (ws.current) {
      ws.current.close();

    }
      
          };
 }, []);


  useEffect(() => {
    const shuffledDeck = shuffleDeck(createDeck()); // this is an instance that shuffles the deck 
    console.log(centerPileRef);
    setDeck(shuffledDeck); // this is redundant, can probably get rid of this 
    dealInitialHand(shuffledDeck); // we now use this to determine what cards that each person has 
  }, [centerPileRef]);



  const sendGameStateToServer = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) { // basically saying if the websocket ref and the websocket state == true 
      const messageString = JSON.stringify(message); // we are taking the data card data and making it into a instance 
      ws.current.send(messageString); // now we are sending the messsage to the server 
      console.log('Message sent to server:', messageString);
    }
  
  };

  // useEffect(() => {
  //   if (centerPileRef.current) {
  //     const rect = centerPileRef.current.getBoundingClientRect();
  //     console.log(rect); // Logs the position and size of the element
  //   }
  // }, []); // Empty dependency

  const dealInitialHand = (shuffledDeck) => {
    // Take the first few cards from the shuffled deck for the player's hand
    const initialHand = shuffledDeck.slice(0, MAX_HAND_SIZE); // max hand size is 5
    setPlayerHand(initialHand); // add it to the users pile 

    // Remove the dealt cards from the main deck
    const remainingDeck = shuffledDeck.slice(MAX_HAND_SIZE); // this function is not necessarily needed because their 
    setDeck(remainingDeck); // because we are not needing it
  };

  const generateRandomCard = () => {
    const colors = ['Red', 'Green', 'Blue', 'Yellow']; // have the colors to generate the card
    const ranNum = Math.floor(Math.random() * 10); // Assuming the numbers range is 0-9
    const ranColor = colors[Math.floor(Math.random() * colors.length)]; // we randomize the color as well 
    const cardId = `${ranColor}-${ranNum}`;
  
    return {
      id: cardId,
      color: ranColor,
      number: ranNum,
      display: () => <Card color={ranColor} number={ranNum} />
    };
  };


  const [props, set] = useSpring(() => ({
    to: { transform: 'translateY(0px)' },
    from: { transform: 'translateY(0px)' }
}));
  

  const cardAnimation = useSpring({
    opacity: isTaken ? 1 : 0, // Only show the card when it is taken
    transform: isTaken ? 'translateY(200px)' : 'translateY(0px)', // Move card down when taken
    from: { opacity: 1, transform: 'translateY(0px)' },
    reset: true,
    onRest: () => setTaken(false), // Reset the state when the animation finishes
  });


  // const cardMoveToCenter = useSpring({
  //   opacity: doubleClicked ? 1 :0,
  //   transform: doubleClicked ? 'translateY(200px)': 'translateY(0px)',
  //   from: {opacity: 1, transform: 'translateY(0px)'}, 
  //   reset: true

  // })


  
  const handleTakeCard = () => {
    const newCard = generateRandomCard();
    setCurrentCard(newCard); // Set the new random card
    setTaken(true); // Start the animation
  
    // Add the new card to the deck
    setPlayerHand(prevHand => [...prevHand, newCard]);
  };
  
  const otherPlayerCards = Array(5).fill(null).map((_, index) => <DeckCard key={index} />); // this function is filling the array with the map, using the map 
  const numCardsPerSide = 5;




  // Create the deck of cards for the sides
  const sideDecks = Array.from({ length: numCardsPerSide }, (_, index) => ( // this lets me do, any with the jsx element is different the map because we are not caring about the map. 
    <Box
      key={index}
      position="absolute"
      bottom={`${index * 10}%`} // Adjust percentage to fan out the cards correctly
      // Adjust to rotate each card slightly differently
      zIndex={numCardsPerSide - index} // Ensure cards overlap in the correct order
    >
      <DeckCard />
    </Box>
  ));



  return (
    <Flex style={{ backgroundImage: "url('./images/boardImage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', width: '100%', position: 'relative'}}>
      {/* Render a few cards from the deck */}


    <Flex
    position = {'absolute'}
    top = {0}
    bottom = {0}
    right = {0}
    left = {0}    
    justify = 'center'
    align = 'center'
    
    >
    <CardStack onTakeCard={handleTakeCard} />

    </Flex>

    <HStack
  position="absolute"
  top={0}
  bottom={0}
  right={0}
  left={0}    
  justify="center"
  align="center"
  spacing = {5}
  ref={centerPileRef}  // Attach the ref here
  onClick={() => {
    console.log(centerPileRef);
  }}
>
  <Box onClick={handleTakeCard} cursor="pointer">
    <animated.div style={cardAnimation}>
      <Card color={currentCard.color} number={currentCard.number} />
    </animated.div>
  </Box>
</HStack>


    <HStack position="absolute" top={0} right={0} left={0} justifyContent="center">
     
    {otherPlayerCards.map((card, index) => (
        <Box key={index} >
          {card}
        </Box>
      ))}
    </HStack>

    <VStack position="absolute" top={0} bottom={0} left={0} justifyContent="center" spacing="0">
          {sideDecks}
      </VStack>

      {/* Right side */}
      <VStack position="absolute" top={0} bottom={0} right={0} justifyContent="center">
      {sideDecks}

      </VStack>

      
     
     <HStack position={'absolute'} bottom={0} left={0} right={0} justify={'center'} >
     {playerHand.map((card, index) => (
      <Box key={index} ref={cardRef}>
        {card.display({
          centerPileRef,
          sendGameStateToServer,
        })}
      </Box>
    ))}



      </HStack>

  
    </Flex>
  );
}
