import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  Box,
  VStack,
  useColorModeValue,
  Heading
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'Username', headerName: 'Username' },
  { field: 'Password', headerName: 'Password' },
  { field: 'Role', headerName: 'Role' },
  { field: 'update', headerName: 'Update' },
  { field: 'delete', headerName: 'Delete' },
];

const rows = [
  { id: 1, Username: 'Snow', Password: '123456', Role: 'Admin'},
  { id: 2, Username: 'Lannister', Password: 'abcdef', Role: 'User'},
  { id: 3, Username: 'Stark', Password: 'qwerty', Role: 'User'},
  { id: 4, Username: 'Targaryen', Password: 'asdfgh', Role: 'Admin'},
];

export default function DataTable() {
  const headerBg = useColorModeValue('#4b7fce7f', 'gray.700');

  return (
    <VStack spacing={4} p={5} position="fixed" top={50} marginLeft="250px" width="60%" marginRight="15%">
      <Heading>User Management</Heading>
      <Box boxShadow="xl" p={5} bg={useColorModeValue('white', 'gray.700')} w="full">
        <Table size="md">
          <Thead bg={headerBg}>
            <Tr>
              {columns.map((column) => (
                <Th key={column.field}>{column.headerName}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row) => (
              <Tr key={row.id}>
                <Td>{row.id}</Td>
                <Td>{row.Username}</Td>
                <Td>{row.Password}</Td>
                <Td>{row.Role}</Td>
                <Td>
                  <Button 
                    leftIcon={<EditIcon />} 
                    variant="outline" 
                    colorScheme="blue" 
                    aria-label="Update"
                  > Edit 
                  </Button>
                </Td>
                <Td>
                  <Button 
                      leftIcon={<DeleteIcon />} 
                      variant="outline" 
                      colorScheme="red" 
                      aria-label="Delete"
                  > Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
}
