import React, {useEffect} from 'react';
import "./css/admin_login.css";
import SideNavBar from '../../Components/admin/SideNavBar';
import {useState} from "react";
import { useTable, usePagination } from "react-table";
import { CustomText } from '../../Components/CustomTags';

import {
  ButtonGroup,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
  
  export function ItemIngredientsForm(props) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = React.useRef(null)
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const reversedData = data.slice().reverse();
    
    const totalPages = Math.ceil(reversedData.length / itemsPerPage);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const currentPageData = reversedData.slice(startIndex, endIndex);
    useEffect(() => {
      setLoading(true);
      fetch(process.env.REACT_APP_API_URL+'/ticketing/fetch_all_transactions')
      .then(response => response.json())
        .then(json => {
          setData(json);
          console.log(json)
          setLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setLoading(false);
        });
      }, []);
      
      return (
        <div className="App">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <TableContainer>
              <Heading>Invoice Table</Heading>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Order ID</Th>
                    <Th>Date/Time</Th>
                    <Th>Status</Th>
                    <Th>Amount</Th>
                  </Tr>               
                </Thead>
                <Tbody>
                {currentPageData.map(item => (
                  <Tr key={item.transaction.transaction_id} onClick={() => setSelectedItem(item)}>
                    <Td>{item.transaction.invoice.invoice_id}</Td>
                    <Td>{item.transaction.invoice.date_time}</Td>    
                    <Td>{item.transaction.invoice.invoice_status}</Td>
                    <Td>{item.transaction.invoice.total_price}</Td>
                    <Modal finalFocusRef={finalRef} isOpen={selectedItem !== null} onClose={() => setSelectedItem(null)}>
                      <ModalOverlay />
                      <ModalContent>
                      <ModalHeader>Invoice Receipt {selectedItem?.transaction.invoice.invoice_id} </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <Box>
                          {selectedItem?.transaction.dish.map(dish => (
                            <Text key={dish.dish_id} fontSize='xl'>
                              {dish.dish_name} X {dish.dish_qty}
                            </Text>
                          ))}
                          <Text fontSize='3xl'>Order Total: {selectedItem?.transaction.invoice.total_price}</Text>
                        </Box>
                        </ModalBody>
                        <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => setSelectedItem(null)}>
                          Close
                        </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </Tr>
                ))}
                </Tbody>                
              </Table>
              <Button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>Previous</Button>
              <Button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>Next</Button>
              <div>Page {currentPage} of {totalPages}</div>
            </TableContainer>
          )}
        </div>
      );
    
  }
  

  

function Admin_transactionpage() {


return (
    <div className='container_order_container '>
        <SideNavBar children={<ItemIngredientsForm/>}/>
    </div>
);
}

export default Admin_transactionpage;
