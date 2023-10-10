import React from 'react';
import { Button, Text } from '@chakra-ui/react';
import { useCustomisation } from './CustomisationContext';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

export const CustomCancelButton = ({ children, onClick, id, isDisabled }) => {
  const { color, isDarkMode } = useCustomisation();
  const backgroundColor = isDarkMode ? 'black' : color;
  const { buttonSize } = useCustomisation();
  const { fontSize } = useCustomisation();
  const { cancelButtonColor } = useCustomisation();


  return (
    <Button
    size={buttonSize}
    paddingX='6'
    paddingY='4'
    background={cancelButtonColor}
    textColor='white'
    variant='solid'
    w='80%'
    display='flex'
    alignItems='center'
    mb={8}
    onClick={onClick}
    id={id}
    isDisabled={isDisabled}
    
    >
      {children}
      <CloseIcon color="white" mr={2} fontSize={fontSize}/>
       <CustomText>Cancel</CustomText>
    </Button>
  );
};

export const CustomServeButton = ({ children, onClick, id, isDisabled }) => {
  const { color, isDarkMode } = useCustomisation();
  const backgroundColor = isDarkMode ? 'black' : color;
  const { buttonSize } = useCustomisation();
  const { fontSize } = useCustomisation();
  const { serveButtonColor } = useCustomisation();

  return (
    <Button
    size={buttonSize}
    paddingX='6'
    paddingY='4'
    background={serveButtonColor}
    textColor='white'
    variant='solid'
    w='80%'
    display='flex'
    alignItems='center'
    mb={8}
    onClick={onClick}
    id={id}
    isDisabled={isDisabled}
    
    >
      {children}
      <CheckIcon mr={2} color="white" fontSize={fontSize} style={{ marginRight: '5px' }} />
      <CustomText>Serve</CustomText>
    </Button>
  );
};
 
export const CustomText = ({ children, onClick }) => {
  const { fontSize } = useCustomisation();
  return (
    <Text
    fontSize={fontSize}
    color='white'
    >
      {children}
    </Text>
  );
};