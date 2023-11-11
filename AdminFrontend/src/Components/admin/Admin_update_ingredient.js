import React, { useState,useEffect } from 'react';
import {
  SimpleGrid,
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
  Heading,
  Spinner,
  GridItem,
  Select,FormControl,FormLabel,Input,useDisclosure,Modal,ModalOverlay,ModalContent,ModalHeader,ModalCloseButton,ModalBody,ModalFooter
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { ArrowUpIcon,ArrowDownIcon } from '@chakra-ui/icons'
import Admin_update_ingredient_card from './Admin_update_ingredient_card';
import TransitionExample from '../../Components/admin/model_box';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'Ingrdients Name', headerName: 'Ingrdients Name' },
  { field: 'Quantity', headerName: 'Quantity' },
  { field: 'Edit', headerName: 'Edit' },
  { field: 'Delete', headerName: 'Delete' },
];


function Admin_update_ingredient() {
  const [isLoading, setIsLoading] = useState(false);
  const headerBg = useColorModeValue('#4b7fce7f', 'gray.700');
  const [ingredientList, setIngredientList] = useState([]); // State to store the fetched data

  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQty, setIngredientQty] = useState("");
  const [ingredientType, setIngredientType] = useState("");

  const [msg, SetMsg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalAction, setModalAction] = useState(""); // Use this to track whether it's an "Edit" or "Delete" action
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    // Make a GET request using fetch
    fetch(process.env.REACT_APP_API_URL+'/ingredient/getAllIngredients')
      .then(response => response.json())
      .then(data => {
        // Handle the response data and set it in the state
        setIngredientList(data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
  }, [])
  console.log(ingredientList)

  const handleEditClick = (item) => {

      setIngredientName(item.ingredients_name);
      setIngredientQty(item.ingredients_qty);
      setIngredientType(item.ingredients_type);


    setModalAction("Edit");
    console.log(item)
    setSelectedItem(item); // Store the selected item in state
    onOpen();
  };

  function handleEdit(ingredientId) {
    setIsLoading(true);
    const updatedData = {
        ingredients_name: ingredientName,
        ingredients_type: ingredientType,
        ingredients_qty: parseInt(ingredientQty) // Convert string to number
    };

    fetch(`${process.env.REACT_APP_API_URL}/ingredient/updateIngredient/${ingredientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        setIsLoading(false);
        console.log(data);
        SetMsg(data.result)
        setIsModalOpen(true);
        window.location.reload();
    })
    .catch((error) => {
      console.error('Error:', error);
      setIsLoading(false);
    });
}



  function handleDelete(ingredientId) {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/ingredient/deleteIngredient/${ingredientId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        // After deleting, refetch the ingredients or filter out the deleted one from the local state.
        console.log(data)
        if (data.result == "Ingredient deleted successfully"){
          SetMsg(data.result)
          setIsModalOpen(true);
          const updatedIngredients = ingredientList.filter(ingredient => ingredient.ingredients_id !== ingredientId);
          setIngredientList(updatedIngredients);
          setIsLoading(false);
        }
        else{
          SetMsg(data.result)
          setIsModalOpen(true);
          setIsLoading(false);
        }

    })
    .catch((error) => {
      console.error('Error:', error);
      setIsLoading(false);
    });
}
const scrollableTableStyle = {
  maxHeight: '900px', // Adjust this value as needed
  overflowY: 'auto'
};


  return (
    <SimpleGrid templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalAction === "Edit" ? "Edit Item" : "Delete Item"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Your modal content goes here */}
            {selectedItem && (
              <div>
                <label>Ingredient Name</label>
                <Input 
                  value={ingredientName} 
                  onChange={(e) => setIngredientName(e.target.value)} 
                  placeholder={selectedItem.ingredients_name}
                /> <br></br>
                <label>Ingredient Qty</label>
                <Input 
                    value={ingredientQty} 
                    onChange={(e) => setIngredientQty(e.target.value)} 
                    placeholder={selectedItem.ingredients_qty}
                />
                <label>Ingredient Type</label>
                <Select 
                    value={ingredientType} 
                    onChange={(e) => setIngredientType(e.target.value)} 
                    placeholder={selectedItem.ingredients_type}
                >
                    <option value="Pieces">Pieces</option>
                    <option value="Grams">Grams</option>
                    <option value="Kilograms">Kilograms</option>
                </Select>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>          
            <Button colorScheme="green" onClick={() => handleEdit(selectedItem.ingredients_id)}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        <TransitionExample isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ingredients" message={msg} />
        <VStack spacing={4} p={5} position="absolute" width="60%" marginTop="3%">
        <Heading>Ingredients Management</Heading>
        <Box boxShadow="xl" p={5} bg={useColorModeValue('white', 'gray.700')} w="full" style={scrollableTableStyle}>
          <Table size="md">
            <Thead bg={headerBg}>
              <Tr>
                {columns.map((column) => (
                  <Th key={column.field}>{column.headerName}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {ingredientList.map((row) => (
                <Tr key={row.ingredients_id}>
                  <Td>{row.ingredients_id}</Td>
                  <Td>{row.ingredients_name}</Td>
                  <Td>{row.ingredients_qty} {row.ingredients_type}</Td>
                  <Td>
                    <Button 
                      leftIcon={<EditIcon />} 
                      variant="outline" 
                      colorScheme="blue" 
                      aria-label="Update"
                      onClick={() => handleEditClick(row)}
                    > Edit 
                    </Button>
                  </Td>
                  <Td>
                    <Button 
                        leftIcon={<DeleteIcon />} 
                        variant="outline" 
                        colorScheme="red" 
                        aria-label="Delete"
                        onClick={() => handleDelete(row.ingredients_id)}
                    > Delete
                    </Button>
                    <GridItem colSpan={1}>{isLoading && <Spinner/>}</GridItem>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </SimpleGrid>  
  );
}

export default Admin_update_ingredient;
