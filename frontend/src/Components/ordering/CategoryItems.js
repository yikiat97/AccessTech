import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';

function CategoryItems(props){
    return(
        <Flex flexWrap='wrap' justifyContent='center' alignItems='center' m='5'>
            <Tabs align="center" variant="enclosed">
                <TabList>
            {props.uniqueCategory.map((item,index) => (
                  <Tab key={index}>{item}</Tab>
                  ))}
                  </TabList>
                  </Tabs>
        </Flex>

    )
}
export default CategoryItems