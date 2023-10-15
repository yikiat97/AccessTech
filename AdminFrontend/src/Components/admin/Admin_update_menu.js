import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody,
  SimpleGrid, 
  Image, 
  Box, 
  Text, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  Input, 
  Select } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import TransitionExample from '../../Components/admin/model_box';


function Admin_update_menu() {
  const [AllDishes, setAllDishes] = useState([]);
  const [msg, SetMsg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedDish, setSelectedDish] = useState(null);

  const [DishName, setDishName] = useState(null); 
  const [Price, setPrice] = useState(null);
  const [Small_desc, setSmall_desc] = useState(null);
  const [Description, setDescription] = useState(null);
  const [ingredientQty, setIngredientQty] = useState([]);

  const openModal = (dish) => {
    setSelectedDish(dish);
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
    setSelectedDish(null);
  }
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL+'/order/getAllDishes')
      .then(response => response.json())
      .then(data => {
        setAllDishes(data)
        console.log(data)
      })
      .catch(error => {
        console.error('Error fetching ingredients:', error);
      });

          // Fetch the ingredients data
    // fetch(`${process.env.REACT_APP_API_URL}/ingredient/getAllIngredients`)
    // .then(response => response.json())
    // .then(data => {
    //   setAllIngredients(data);
    // })
    // .catch(error => {
    //   console.error('Error fetching ingredients:', error);
    // });
  }, []);

  
  function handleEdit(dish_id) {
   // Construct the payload
   const updatedDishDetails = {
    dish_name: DishName || selectedDish?.dish_name,
    price: Price || selectedDish?.price,
    small_desc: Small_desc || selectedDish?.small_desc,
    description: Description || selectedDish?.description,
    ingredients: selectedDish?.ingredients.map((ingredient, index) => ({
      ingredients_id: ingredient.ingredients_id,
      ingredient_qty_needed: parseFloat(ingredientQty[index] || ingredient.ingredient_qty_needed)
    }))
    };

// Send a PUT request to the server
fetch(`${process.env.REACT_APP_API_URL}/order/updateDish/${dish_id}`, {
  method: 'PUT',
  headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify(updatedDishDetails)
})
.then(response => response.json())
.then(data => {
  console.log(data);
  if (data.result === 'Dish and its recipes updated successfully') {
      // Close the modal
      closeModal();

      // Update local state to reflect the changes made
      const updatedDishes = AllDishes.map(dish => {
        if(dish.dish_id === dish_id) {
          // This assumes that the response includes the updated dish data. 
          // If not, you might need to construct the updated dish manually from the request payload.
          return {
            ...dish,
            ...updatedDishDetails,
            ingredients: updatedDishDetails.ingredients.map((ingredient, index) => ({
              ...ingredient,
              ingredient_qty_needed: parseFloat(ingredientQty[index] || ingredient.ingredient_qty_needed)
            }))
          }
        } else {
          return dish;
        }
      });

      setAllDishes(updatedDishes);
  } else {
      console.error('Error updating dish:', data.result);
  }
})
.catch(error => console.error('Error:', error));
}

  function handleDelete(dish_id) {
    fetch(`${process.env.REACT_APP_API_URL}/order/deleteDish/${dish_id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        // After deleting, refetch the ingredients or filter out the deleted one from the local state.
        console.log(data)
        if (data.message == 'Dish and associated recipes deleted successfully'){
          SetMsg(data.message)
          setIsModalOpen(true);
          const updatedAllDishes = AllDishes.filter(Dishes => Dishes.dish_id !== dish_id);
          setAllDishes(updatedAllDishes);
        }
        else{
          SetMsg(data.message)
          setIsModalOpen(true);
        }

    })
    .catch(error => console.error('Error:', error));
}



  return (
    <div style={{display:"flex", flexWrap:"wrap", justifyContent: "flex-start", gap:"30px"}}>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Item for {selectedDish?.dish_name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

          <label>Dish Name</label>
            <Input 
              value={DishName} 
              onChange={(e) => setDishName(e.target.value)} 
              placeholder={`${selectedDish?.dish_name}`}
            />
          <label>Dish Price</label>
            <Input 
              value={Price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder={`${selectedDish?.price}`}
            />
          <label>Small content</label>
            <Input 
              value={Small_desc} 
              onChange={(e) => setSmall_desc(e.target.value)} 
              placeholder={`${selectedDish?.dish_name}`}
            />
            <label>Content</label>
              <Input 
                value={Description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder={`${selectedDish?.dish_name}`}
              />

            {selectedDish?.ingredients.map((ingredient, index) => (
                <div key={ingredient.ingredients_id} style={{marginTop:"20px"}}>
                    <label>Ingredient Name: {ingredient.ingredients_name}</label>
                    <br />
                    <label>Qty</label>
                    <Input 
                        type="Number"
                        value={ingredientQty[index] || ''} 
                        onChange={(e) => {
                            const newIngredientQty = [...ingredientQty];
                            newIngredientQty[index] = e.target.value;
                            setIngredientQty(newIngredientQty);
                        }}
                        placeholder={`${ingredient.ingredient_qty_needed}`}
                    />
                    <br />
                </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>Close</Button>
            <Button colorScheme="green" onClick={() => handleEdit(selectedDish?.dish_id)}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

   {AllDishes.length > 0 ? (
    AllDishes.map(dish => (
      <Card key={dish.dish_id} width="300px" mx="10px" my="20px">
        <CardBody height="400px">
          <Image src={dish.image_url} align="center" maxH="200px" cover />
          <Box>
            <h1 className="title">
              <Text fontSize='m' fontWeight='bold'>{dish.dish_name}</Text>
            </h1>
            <Text mt='1rem' fontSize='xs'>{dish.small_desc}</Text>
            <Text mt='1rem' fontSize='xs'>{dish.description}</Text>
            <Text mt='5rem' color='yellow'>${dish.price ? Number(dish.price).toFixed(2) : 'N/A'}</Text>
            {dish.qty != 0 ? <Text color='yellow'>Item Qty: {dish.qty}</Text>: <Text textWeight="bold" color='Red'>Item Qty: {dish.qty}</Text> }
          </Box>
          <Button 
            leftIcon={<EditIcon />} 
            variant="outline" 
            colorScheme="blue" 
            aria-label="Update"
            margin={1}
            onClick={() => openModal(dish)}
          > Edit 
          </Button>
          <Button 
            leftIcon={<DeleteIcon />} 
            variant="outline" 
            colorScheme="red" 
            aria-label="Delete"
            margin={1}
            onClick={() => handleDelete(dish.dish_id)}
        > Delete
          </Button>
        </CardBody>
      </Card>
    ))
  ) : null}
      <TransitionExample isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="updating menu" message={msg} />
    </div>
  );
}

export default Admin_update_menu;
