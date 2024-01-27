import { Box, Text, Circle} from '@chakra-ui/react';
import React, {useEffect, useRef} from 'react';
import { useSpring, animated, interpolate } from 'react-spring';
import { LiaUndoAltSolid } from "react-icons/lia";
import { AiOutlineStop } from "react-icons/ai";
import { MdContentCopy } from "react-icons/md";


const ReverseIcon = ({color}) => {
    return (
        
        <> 
        <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%) rotate(15deg)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="70%"
        height="60%"
        border="4px solid white"
        borderRadius="50%"
        bg={color === 'Yellow'? '#ECD407' : color}
        zIndex="1"
        >
       
        <LiaUndoAltSolid color = {"white"}  size = {40}/> 
        
      </Box>

      <Box position="absolute" top="2" left="2" color="white" fontSize="lg" zIndex="2">
      <LiaUndoAltSolid color = {"white"}  size = {20}/> 

            </Box>

            {/* Small number/symbol in the bottom right corner */}
            <Box position="absolute" bottom="2" right="2" color="white" fontSize="lg" zIndex="2">
            <LiaUndoAltSolid color = {"white"}  size = {20}/> 

                
            </Box>
        </>
       
    );
  };


  const SkipIcon = (color) => {
    return (
        <> 
        <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%) rotate(15deg)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="70%"
        height="60%"
        border="4px solid white"
        borderRadius="50%"
        bg={color === 'Yellow'? '#ECD407' : color}
        zIndex="1"
        >
       
        <AiOutlineStop color = {"white"}  size = {40}/> 
        
      </Box>

      <Box position="absolute" top="2" left="2" color="white" fontSize="lg" zIndex="2">
      <AiOutlineStop color = {"white"}  size = {20}/> 

            </Box>

            {/* Small number/symbol in the bottom right corner */}
            <Box position="absolute" bottom="2" right="2" color="white" fontSize="lg" zIndex="2">
            <AiOutlineStop color = {"white"}  size = {20}/> 

                
            </Box>
        </>
    );
  };


  const Take4Icon = (color) => {
    return (
        <> 
        <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%) rotate(15deg)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="70%"
        height="60%"
        border="4px solid white"
        borderRadius="50%"
        bg={color === 'Yellow'? '#ECD407' : color}
        zIndex="1"
        >
       
        <MdContentCopy color = {"white"}  size = {40}/> 
        
      </Box>

      <Box position="absolute" top="2" left="2" color="white" fontSize="lg" zIndex="2">
                <Text>+2</Text>
            </Box>

            {/* Small number/symbol in the bottom right corner */}
            <Box position="absolute" bottom="2" right="2" color="white" fontSize="lg" zIndex="2">
             <Text>+2</Text>

                
            </Box>
        </>
    );
  };



  const Take2Icon = (color) => {
    return (
        <> 
        <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%) rotate(15deg)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="70%"
        height="60%"
        border="4px solid white"
        borderRadius="50%"
        bg={color === 'Yellow'? '#ECD407' : color}
        zIndex="1"
        >
       <Box mb = {5}>
       <MdContentCopy color = {"white"}  size = {30}/> 
       </Box>
        <Box bottom = {1}>
                   <MdContentCopy color = {"white"}  size = {30}/> 
 
        </Box>

        
      </Box>

      <Box position="absolute" top="2" left="2" color="white" fontSize="lg" zIndex="2">
                <Text>+4</Text>
            </Box>

            {/* Small number/symbol in the bottom right corner */}
            <Box position="absolute" bottom="2" right="2" color="white" fontSize="lg" zIndex="2">
             <Text>+4</Text>

                
            </Box>
        </>
    );
  };



export default function Card({ color, number, setDoubleClicked, centerPileRef, wildcard, id, sendGameStateToServer }) {
    const [hoverProps, setHover] = useSpring(() => ({
        transform: 'translateY(0px)'
    }));
    const cardRef = useRef(null)


    
    const handleHover = () => setHover({ transform: 'translateY(-20px)' });
    const handleUnhover = () => setHover({ transform: 'translateY(0px)' });
    const [clickProps, setClick] = useSpring(() => ({
        transform: 'translate(0px, 0px)'
    }));
    
    const handleClick = () => {
        if (centerPileRef && centerPileRef.current) {
            const centerPileRect = centerPileRef.current.getBoundingClientRect();
            const cardRect = cardRef.current.getBoundingClientRect();
            const offsetX = 150; // 50 pixels to the left
            const translateX = centerPileRect.x - cardRect.x + centerPileRect.width / 2 - cardRect.width / 2 - offsetX; 
            // this is takes the distance between the pile and the 
            const translateY = centerPileRect.y - cardRect.y + centerPileRect.height / 2 - cardRect.height / 2;


            const cardMoveData = {
                action: 'MOVE_CARD',
                cardId: id, // Use the card's `id` here
                position: { x: translateX, y: translateY }
              };

              sendGameStateToServer(cardMoveData);


            setClick({ transform: `translate(${translateX}px, ${translateY}px)` });
        }
    };
    
    const combinedTransform = interpolate(
        [hoverProps.transform, clickProps.transform],
        (hoverTransform, clickTransform) => `${hoverTransform} ${clickTransform}`
    );
    

    useEffect(() => {
        if (centerPileRef && centerPileRef.current) {
          // Now it's safe to use centerPileRef.current
          const rect = centerPileRef.current.getBoundingClientRect();
          console.log(rect);
        }
      }, [centerPileRef]); // Depend on centerPileRef to re-run this effect if the ref changes
   
    const AnimatedBox = animated(Box);

    return (
        <AnimatedBox
            style={{ transform: combinedTransform }}
            background={color === 'Yellow'? '#ECD407' : color}
            height="200px"
            width="120px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            position="relative"
            borderRadius="lg"
            border="5px solid"
            borderColor={'white'}
            shadow="sm"
            onMouseEnter={handleHover}
            onMouseLeave={handleUnhover}
            onClick = {handleClick}
            ref = {cardRef}
           
        >
            {wildcard ? (
               
               
                (wildcard === 'reverse' && <ReverseIcon color = {color}/>) ||
                (wildcard === 'skip' && <SkipIcon color = {color} />) ||
                (wildcard === 'take2' && <Take2Icon color = {color}  />) ||
                (wildcard === 'take4' && <Take4Icon color = {color} />)


            
            ) :  ( <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%) rotate(15deg)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="70%"
                height="60%"
                border="4px solid white"
                borderRadius="50%"
                bg={color === 'Yellow'? '#ECD407' : color}
                zIndex="1"
            >
                <Text color={'white'} fontSize="5xl" fontWeight="bold">{number}</Text>
            </Box>)}
           

            {/* Small number/symbol in the top left corner */}
            <Box position="absolute" top="2" left="2" color="white" fontSize="lg" zIndex="2">
                {number}
            </Box>

            {/* Small number/symbol in the bottom right corner */}
            <Box position="absolute" bottom="2" right="2" color="white" fontSize="lg" zIndex="2">
                {number}
            </Box>
        </AnimatedBox>
    );
}


export function DeckCard({ color, number }) {
    const [props, set] = useSpring(() => ({
        to: { transform: 'translateY(0px)' },
        from: { transform: 'translateY(0px)' }
    }));

    
    const AnimatedBox = animated(Box);

    return (
        <AnimatedBox
            style={props}
            background={'black'}
            height="200px"
            width="120px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            position="relative"
            borderRadius="lg"
            border="5px solid"
            borderColor={'white'}
            shadow="sm"
            // onMouseDown={() => set({ transform: 'translateY(-20px)' })}
            // onMouseUp={() => set({ transform: 'translateY(0px)' })}
            // onTouchStart={() => set({ transform: 'translateY(-20px)' })}
            // onTouchEnd={() => set({ transform: 'translateY(0px)' })}
        >
            {/* Central angled ellipse */}
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%) rotate(15deg)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="70%"
                height="60%"
                border="4px solid white"
                borderRadius="50%"
                bg={'black'}
                zIndex="1"
            >
                <Text color={'white'} fontSize="md" textAlign={'center'} fontWeight="bold">Crazy 8</Text>
            </Box>

            {/* Small number/symbol in the top left corner */}
            <Box position="absolute" top="2" left="2" color="white" fontSize="lg" zIndex="2">
                <Text color = {'white'} >Crazy 8</Text>
            </Box>

            {/* Small number/symbol in the bottom right corner */}
            <Box position="absolute" bottom="2" right="2" color="white" fontSize="lg" zIndex="2">
                <Text color={'white'} fontWeight="bold">Crazy 8</Text>

            </Box>
        </AnimatedBox>
    );
}
