import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import DiscountTable from "./Admin_discount_table";
export default function Admin_add_discount() {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const categories = [
    "science",
    "sports",
    "business",
    "politics",
    "entertainment",
    "technology",
    "world",
    "all",
  ];


    var voucher_codes = require('voucher-code-generator');
    var listOfVoucherCodes = voucher_codes.generate({
        length: 8,
        count: 10
    });
    console.log(listOfVoucherCodes)

    return (
        <Box borderRadius="lg" boxShadow="md" p={5} w="70%" m="auto">
        <VStack spacing={5} align="start">
            <Text fontSize="xl" fontWeight="bold">
            Add Discount Code
            </Text>
            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            {["Item Name", "Price", "Short content", "Content", "Dish Type", "Tag", "placement"].map((label, index) => (
                <>
                <GridItem colSpan={2}>
                    <FormLabel fontWeight="bold" textAlign="center">
                    {label}
                    </FormLabel>
                </GridItem>
                <GridItem colSpan={label === "Short content" || label === "Content" ? 10 : 4}>
                    {label === "Content" ? (
                    <Input as="textarea" rows={4} placeholder={label} />
                    ) : label === "Dish Type" || label === "Tag" || label === "placement" ? (
                    <Select placeholder={label} value={selectedValue} onChange={handleChange}>
                        {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                        ))}
                    </Select>
                    ) : (
                    <Input placeholder={label} />
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
                <Button leftIcon={<AttachmentIcon />} variant="outline">
                Upload
                </Button>
            </GridItem>
            <GridItem colSpan={4} />
            <GridItem colSpan={4}>
                <Button colorScheme="orange">Save</Button>
            </GridItem>
            </Grid>
        </VStack>
        </Box>
    );
}
