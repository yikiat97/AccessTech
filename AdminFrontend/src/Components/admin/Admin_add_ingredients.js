import React, { useState } from "react";
import {
  Box,
  Text,
  Input,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Select,
  Button,
  Alert,
  AlertIcon,
  useToast,
  Grid,
  GridItem,
  Spinner,
} from "@chakra-ui/react";
import TransitionExample from '../../Components/admin/model_box';


export default function Admin_add_ingredients() {
  const [qty_type_value, set_qty_type_value] = useState("");
  const [qty_value, set_qty_value] = useState("");
  const [Ingredient_Name_value, set_Ingredient_Name_value] = useState("");
  const [msg, SetMsg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    name: false,
    qty: false,
    type: false
  });

  const qty_type = ["Pieces", "Grams", "Kilograms"];

  const handleQtyTypeChange = (event) => {
    set_qty_type_value(event.target.value);
    setError({...error, type: false});
  };

  const handleQtyValueChange = (event) => {
    set_qty_value(event.target.value);
    setError({...error, qty: false});
  };

  const handleIngredientNameChange = (event) => {
    set_Ingredient_Name_value(event.target.value);
    setError({...error, name: false});
  };

  const submitButton = () => {
    setIsLoading(true);
    if (Ingredient_Name_value == ""){
      setError(Error1 => ({...Error1, name: true}));
    } 
    if (qty_value == "") {
      setError({...error, qty: true});
    }
    if (qty_type_value == "") {
      // setError({...error, type: true});
      setError(prevError => ({...prevError, type: true}));
    }

    console.log(error)
    
    if(Ingredient_Name_value && qty_value && qty_type_value){
      fetch(process.env.REACT_APP_API_URL+'/ingredient/addIngredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ingredients_name: Ingredient_Name_value, 
          ingredients_qty: qty_value, 
          ingredients_type: qty_type_value 
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data.result)
        SetMsg(data.result)
        setIsModalOpen(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
    }
  }

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      padding={5} 
      marginX={{base: "2%", md: "15%"}}
    >
      <TransitionExample isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adding Ingredients" message={msg} />
      <VStack spacing={5} alignItems="start" size='4150px'>
        <Text fontSize="xl" fontWeight="bold">Add new ingredient</Text>
        
        <HStack width="100%" spacing={8}>
          <FormLabel fontSize="lg" width="20%">Ingredient Name</FormLabel>
          <Input 
            type="text"
            isRequired
            isInvalid={error.name}
            value={Ingredient_Name_value}
            onChange={handleIngredientNameChange}
            placeholder="Ingredient Name"
            width="80%"
          />
        </HStack>

        <HStack width="100%" spacing={8}>
          <FormLabel fontSize="lg" width="20%">Qty</FormLabel>
          <Input 
            type="number"
            isRequired
            isInvalid={error.qty}
            value={qty_value}
            onChange={handleQtyValueChange}
            placeholder="Qty"
            width="30%"
          />

          <FormLabel fontSize="lg" width="20%">Qty Type</FormLabel>
          <Select 
            width="30%"
            value={qty_type_value}
            onChange={handleQtyTypeChange}
            isInvalid={error.type}
          >
            {qty_type.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </Select>
        </HStack>

        <HStack width="100%" justifyContent="flex-end">
          <Button 
            colorScheme="blue" 
            onClick={submitButton}
            isDisabled={isLoading}
          >
            Save
          </Button>
          <GridItem colSpan={1}>{isLoading && <Spinner/>}</GridItem>
        </HStack>
      </VStack>
    </Box>
  );
}

