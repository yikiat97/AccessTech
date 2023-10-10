import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import {
  Box,
  ChakraProvider,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Center,
  SimpleGrid,
  extendTheme,
  Input,
  Heading
} from "@chakra-ui/react";

const theme = extendTheme({
    components: {
      Popover: {
        variants: {
          picker: {
            popper: {
              maxWidth: "unset",
              width: "unset"
            }
          }
        }
      }
    }
  });

export default function ColorPicker({value, onChange}){
    const [color, setColor] = useState(value);

    useEffect(() => {
      setColor(value);
    }, [value]);

  const colors = [
    "#EDF2F7",
    "#E53E3E",
    "#38A169",
    "#3182CE",
    "#D69E2E",
    "#6B46C1",
    "#171923"
  ];

  return (
    <ChakraProvider theme={theme}>
      <Center marginTop={5}>
        <Popover variant="picker">
          <PopoverTrigger>
            <Button
              aria-label={color}
              background={color}
              height="50px"
              width="50px"
              padding={0}
              minWidth="unset"
              borderRadius={3}
            ></Button>
          </PopoverTrigger>
          <PopoverContent width="auto">
            <PopoverArrow bg={color} />
            <PopoverCloseButton color="white" />
            <PopoverBody height="auto">
              <SimpleGrid columns={colors.length} spacing={4}>
                {colors.map((c) => (
                  <Button
                    key={c}
                    aria-label={c}
                    background={c}
                    height="50px"
                    width="50px"
                    padding={0}
                    minWidth="unset"
                    borderRadius={3}
                    _hover={{ background: c }}
                    onClick={() => {
                      onChange(c);  
                    }}
                  ></Button>
                ))}
              </SimpleGrid>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Center>
    </ChakraProvider>
  );
}
