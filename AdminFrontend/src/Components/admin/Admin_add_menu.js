import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Grid,
  GridItem,
  VStack,
  Spinner, 
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import TransitionExample from '../../Components/admin/model_box';

export default function Admin_add_menu() {
  const [isLoading, setIsLoading] = useState(false);
  const [msg, SetMsg] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [imageName, setImageName] = useState("");
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [specialComments, setSpecialComments] = useState([{ id: Date.now(), comment: "", price: "" }]);

  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    shortContent: "",
    content: "",
    dishType: "",
    tag: "",
    placement: "",
    ingredients:[],
    image: null,
  });

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL+'/ingredient/getAllIngredients')
      .then(response => response.json())
      .then(data => {
        setIngredientOptions(data);
      })
      .catch(error => {
        console.error('Error fetching ingredients:', error);
      });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  ////////////////////////////////// Special comments change ///////////////////////////////////////////////////////////
  const addSpecialCommentField = () => {
    setSpecialComments(prevData => [...prevData, { id: Date.now(), comment: "", price: "" }]);
  };

  const removeSpecialCommentField = (id) => {
      setSpecialComments(prevData => prevData.filter(comment => comment.id !== id));
  };

  const handleSpecialCommentChange = (id, key, value) => {
      setSpecialComments(prevData => prevData.map(comment => comment.id === id ? { ...comment, [key]: value } : comment));
  };


    ////////////////////////////////// Ingredient Change ///////////////////////////////////////////////////////////
  const addIngredientField = () => {
    setFormData(prevData => ({
      ...prevData,
      ingredients: [...prevData.ingredients, { id: Date.now(), value: "" }]
    }));
  };
  
  const removeIngredientField = (id) => {
    setFormData(prevData => ({
      ...prevData,
      ingredients: prevData.ingredients.filter(ingredient => ingredient.id !== id)
    }));
  };

  const handleIngredientChange = (id, value) => {
    const selectedIngredient = ingredientOptions.find(option => option.ingredients_id === parseInt(value, 10));
    setFormData(prevData => ({
      ...prevData,
      ingredients: prevData.ingredients.map(ingredient =>
        ingredient.id === id
          ? {
              ...ingredient,
              ingredients_id: selectedIngredient.ingredients_id,
              ingredients_name: selectedIngredient.ingredients_name,
            }
          : ingredient
      ),
    }));
  };
  
  // Handler for ingredient quantity change
const handleIngredientQtyChange = (id, value) => {
  setFormData(prevData => {
    const newIngredients = prevData.ingredients.map(ingredient => {
      if (ingredient.id === id) {
        return { ...ingredient, ingredient_qty_needed: parseFloat(value) };
      }
      return ingredient;
    });
    return { ...prevData, ingredients: newIngredients };
  });
};

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   console.log(formData);
  //   // Here, you can send the formData to your API or handle it accordingly
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);  // Start the loader
    console.log(formData);

    const url = process.env.REACT_APP_API_URL+'/order/addDish';
    const data = new FormData();
    console.log(formData.itemName); // Log individual value before appending
    data.append('dish_name', formData.itemName);
    console.log(data);
    // Mapping form data to the expected API structure
    data.append('dish_name', formData.itemName);
    data.append('price', formData.price);
    data.append('small_desc', formData.shortContent);
    data.append('description', formData.content);
    data.append('dish_type', formData.dishType);
    data.append('tag', formData.StationTag);
    data.append('placement', formData.placement);
    console.log(data)
    if (formData.image) {
        data.append('image', formData.image);
    }

    // Loop through formData.ingredients to append each ingredient's details to formData
    formData.ingredients.forEach((ingredient, index) => {
      console.log(ingredient.ingredient_qty_needed)
      if (ingredient.ingredients_id) {
        data.append(`recipe[${index}][ingredients_id]`, ingredient.ingredients_id.toString());
    }
      if (ingredient.ingredient_qty_needed) {
          data.append(`recipe[${index}][ingredient_qty_needed]`, ingredient.ingredient_qty_needed.toString());
      }
    });
    console.log(data)
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data
      });

      const dishResponse = await response.json();  // Assuming this response contains the dish_id.
      const dishId = dishResponse.dish_id;
      
      for (const comment of specialComments) {
        const commentData = {
          special_comments: comment.comment,
          special_comments_price: parseFloat(comment.price),
          dish_id: dishId
        };
      
        const commentResponse = await fetch(`${process.env.REACT_APP_API_URL}/admin/add_special_comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commentData)
        });
      
        const commentResult = await commentResponse.json();
        console.log(commentResult);
        SetMsg(dishResponse.result)
        setIsModalOpen(true);
      }

      // const result = await response.json();
      // console.log(result);


    } catch (error) {
      console.error('Error:', error);
    }
    finally {
      setIsLoading(false);  // Stop the loader
    }


   

};

  const station = [
    "Fried",
    "Drink",
    "General",
  ];

  const menu = [
    "Public",
    "SMU Student",
  ];

  const categories = [
    "Rice",
    "Noodle",
    "Sandwich",
    "Beverages",
  ];

  return (
    <Box borderRadius="lg" boxShadow="md" p={5} w="70%" m="auto">
      <VStack spacing={5} align="start">
        <Text fontSize="xl" fontWeight="bold">
          Add new item into menu
        </Text>
        <form onSubmit={handleSubmit}>
       
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            {[
              { label: "Item Name", name: "itemName" },
              { label: "Price", name: "price" },
              { label: "Short content", name: "shortContent" },
              { label: "Content", name: "content" },
              { label: "ingredients", name: "ingredients" },
              { label: "Dish Type", name: "dishType" },
              { label: "Station Tag", name: "StationTag" },
              { label: "placement", name: "placement" },   
            ].map((field) => (
              <>
                <React.Fragment key={field.name}>
                  <GridItem colSpan={field.labelColSpan}>
                    <FormLabel fontWeight="bold">
                      {field.label}
                    </FormLabel>
                  </GridItem>
                  <GridItem colSpan={12 - field.labelColSpan}>
                  </GridItem>
                </React.Fragment>
                <GridItem colSpan={field.label === "Short content" || field.label === "Content" || field.label === "ingredients" || field.label === "SpecialComments"? 10 : 4}>
                  {field.label === "Content" ? (
                    <Input
                      as="textarea"
                      rows={4}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.label}
                    />
                  ): field.name === "ingredients" ? (
                    <>
                    {formData.ingredients.map((ingredient, index) => (
                      <Box key={ingredient.id} display="flex" alignItems="center" mt={index !== 0 ? 2 : 0}>
                        <Select
                          value={ingredient.ingredients_id}
                          placeholder={`Select Ingredient ${index + 1}`}
                          onChange={(e) => handleIngredientChange(ingredient.id, e.target.value)}
                        >
                          {ingredientOptions.map(option => (
                            <option key={option.ingredients_id} value={option.ingredients_id}>
                              {option.ingredients_name}
                            </option>
                          ))}
                        </Select>
                        <Input
                          type="number"
                          value={ingredient.ingredient_qty_needed || ""}
                          placeholder="Qty"
                          onChange={(e) => handleIngredientQtyChange(ingredient.id, e.target.value)}
                          step="any"
                          ml={2}  // Margin for spacing (adjust as needed)
                        />
                        <Button colorScheme="red" ml={2} onClick={() => removeIngredientField(ingredient.id)}>
                          X
                        </Button>
                      </Box>
                      
                    ))}
                    <Button colorScheme="blue" mt={2} onClick={addIngredientField}>
                      Add Ingredient
                    </Button>
                  </>
                  ):
                  field.name === "dishType" ? (
                    <Select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={"Select"}
                    >
                      {categories.map(item => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  )
                  : field.name === "StationTag" ? (
                    <Select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={"Select"}
                    >
                      {station.map(item => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  ): field.name === "placement" ? (
                    <Select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={"Select"}
                    >
                      {menu.map(item => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.label}
                    />
                  )}
                </GridItem>
              </>
            ))}


           <GridItem colSpan={2}>
            <FormLabel fontWeight="bold" textAlign="center">
            Img Upload
            </FormLabel>
          </GridItem>
          <GridItem colSpan={4}>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                // Update formData when an image is selected
                setFormData((prevData) => ({
                  ...prevData,
                  image: e.target.files[0],
                }));
                setImageName(e.target.files[0].name);
              }}
              hidden
              id="imageUpload"
            />
            <label htmlFor="imageUpload">
              <Button as="span" leftIcon={<AttachmentIcon />} variant="outline">
                Upload
              </Button>
            </label>
          {imageName && <Text mt={2}>{imageName}</Text>}
          </GridItem>
          <>
          {
                    specialComments.map((comment, index) => (
                      <React.Fragment key={comment.id}>
                        <GridItem colSpan={3}>
                          <FormLabel fontWeight="bold" textAlign="center">
                            Special Comment {index + 1}
                            
                          </FormLabel>
                          
                        </GridItem>
                        <GridItem colSpan={4}>
                          <Input
                            placeholder="Special Comment"
                            value={comment.comment}
                            onChange={(e) => handleSpecialCommentChange(comment.id, 'comment', e.target.value)}
                          />
                        </GridItem>
                        <GridItem colSpan={4}>
                          <Input
                            placeholder="Price"
                            type="number"
                            step="0.01"
                            value={comment.price}
                            onChange={(e) => handleSpecialCommentChange(comment.id, 'price', e.target.value)}
                          />
                        </GridItem>
                        <GridItem colSpan={1}>
                          <Button colorScheme="red" ml="5" onClick={() => removeSpecialCommentField(comment.id)}>
                            X
                          </Button>
                        </GridItem>
                        
                      </React.Fragment>
                    ))
                  }
                  <GridItem colSpan={12}>
                    <Button colorScheme="blue" onClick={addSpecialCommentField}>
                      Add Special Comment
                    </Button>
                  </GridItem>
                  </>

       
            <GridItem colSpan={12}>
              <Button mt ={5} type="submit" colorScheme="orange" isDisabled={isLoading}>
                Save
              </Button>
            </GridItem>
            <GridItem colSpan={1}>{isLoading && <Spinner/>}</GridItem>
          </Grid>
        </form>
      </VStack>
      <TransitionExample isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adding Dish" message={msg} />
    </Box>
  );
}
