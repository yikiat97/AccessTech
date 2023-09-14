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
  Table,
} from '@chakra-ui/react';
import { StarIcon, ExternalLinkIcon, SettingsIcon } from '@chakra-ui/icons';

function Admin_update_menu() {
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
    <Table>
      test
    </Table>
  );
}

export default Admin_update_menu;
