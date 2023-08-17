import * as React from 'react';
import {
  Box,
  Text,
  Avatar,
  IconButton,
  Image,
  Button,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { StarIcon, ExternalLinkIcon, SettingsIcon } from '@chakra-ui/icons';

function Admin_add_menu() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/userAuth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin1',
        password: 'password',
      }),
    });

    const data = await response.json();
    console.log(data); // it will log the response to console
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      m={4}
    >
      <VStack
        align="start"
        p={4}
        spacing={4}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Box d="flex" alignItems="center">
          <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
          <Box ml="3">
            <Heading fontSize="xl">Shrimp and Chorizo Paella</Heading>
            <Text>September 14, 2016</Text>
          </Box>
          <IconButton
            variant="ghost"
            colorScheme="gray"
            aria-label="Settings"
            icon={<SettingsIcon />}
            ml="auto"
          />
        </Box>
      </VStack>
      <Image src="/assets/foodImage/chickenSandwich.jpg" alt="Paella dish" />
      <Box p={6}>
        <Text mb={4}>
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </Text>
        <Box d="flex" mt={2} alignItems="center">
          <IconButton
            variant="ghost"
            colorScheme="red"
            aria-label="Like"
            icon={<StarIcon />}
          />
          <IconButton
            variant="ghost"
            colorScheme="teal"
            aria-label="Share"
            icon={<ExternalLinkIcon />}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Admin_add_menu;
