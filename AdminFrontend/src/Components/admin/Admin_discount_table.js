import React from 'react';
import SideNavBar from '../../Components/admin/SideNavBar';
import AdminAddIngredients from '../../Components/admin/Admin_add_ingredients';
import AdminUpdateMenu from '../../Components/admin/Admin_update_menu';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Icon, VStack, Divider } from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import AdminTransactionDetailsModal from '../../Components/admin/Admin_transaction_details_modal';

import {
    Select,
    Button,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Text,
    Badge,
  } from "@chakra-ui/react";
  import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
  import {
    FiChevronLeft,
    FiChevronRight,
    FiChevronsLeft,
    FiChevronsRight
  } from "react-icons/fi";
  import { useRef, useState, useMemo } from "react";
  import {
    useAsyncDebounce,
    useFilters,
    useGlobalFilter,
    usePagination,
    useSortBy,
    useTable
  } from "react-table";
  import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
  
  export function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id }
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set();
      preFilteredRows.forEach((row) => {
        options.add(row.values[id]);
      });
      return [...options.values()];
    }, [id, preFilteredRows]);
  
    return (
      <Select
        size={"xs"}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        variant={"outline"}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </Select>
    );
  }
  
  export function AppTable({ columns, data, searchEnabled }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      canPreviousPage,
      canNextPage,
      page,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, globalFilter, pageSize },
      preGlobalFilteredRows,
      setGlobalFilter
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 10 }
      },
      useFilters,
      useGlobalFilter,
      useSortBy,
      usePagination
    );
  
    /* SEARCH */
  
    const inputRef = useRef();
    const [searchValue, setsearchValue] = useState(globalFilter);
    const onSearchInputChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined);
    }, 200);
  
    // const onSearchInputChange = (value)=>{
    //   setGlobalFilter(value || undefined);
    // }
  
    return (
      <>
        {searchEnabled && (
          <Box mb={"20px"}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="gray.300" />}
              />
              <Input
                ref={inputRef}
                type="text"
                value={searchValue || ""}
                onChange={(e) => {
                  setsearchValue(inputRef.current.value);
                  onSearchInputChange(inputRef.current.value);
                }}
                placeholder={`Search...`}
              />
              {searchValue && (
                <InputRightElement
                  cursor={"pointer"}
                  children={
                    <CloseIcon
                      fontSize={14}
                      _hover={{ color: "gray.600" }}
                      color="gray.300"
                    />
                  }
                  onClick={() => {
                    setGlobalFilter("");
                    setsearchValue("");
                  }}
                />
              )}
            </InputGroup>
          </Box>
        )}
  
        <TableContainer>
          <Table variant={"simple"} size="md" {...getTableProps()}>
            <Thead>
              {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <Flex align={"center"} gap={"10px"}>
                        <Box as="span"> {column.render("Header")} </Box>
                        {column.isSorted && (
                          <Box as="span">
                            {column.isSortedDesc ? (
                              <ArrowDownIcon boxSize={3} ml={2} />
                            ) : (
                              <ArrowUpIcon boxSize={3} ml={2} />
                            )}
                          </Box>
                        )}
                        <Box ml={2} as="span">
                          {column?.canFilter ? column.render("Filter") : null}
                        </Box>
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        
                        <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          {/* <Box mt={4}>Showing the first 20 results of {rows.length} rows</Box> */}
          {pageCount > 1 && (
            <Flex align={"center"} justify={"end"} mt={"40px"} gap={"5px"}>
              <Text mr={2} fontSize="sm">
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{" "}
              </Text>
              <Button
                size={"xs"}
                onClick={() => gotoPage(0)}
                isDisabled={!canPreviousPage}
              >
                <Icon boxSize={4} as={FiChevronsLeft} />
              </Button>{" "}
              <Button
                size={"xs"}
                onClick={() => previousPage()}
                isDisabled={!canPreviousPage}
              >
                <Icon boxSize={4} as={FiChevronLeft} />
              </Button>{" "}
              <Button
                size={"xs"}
                onClick={() => nextPage()}
                isDisabled={!canNextPage}
              >
                <Icon boxSize={4} as={FiChevronRight} />
              </Button>{" "}
              <Button
                size={"xs"}
                onClick={() => gotoPage(pageCount - 1)}
                isDisabled={!canNextPage}
              >
                <Icon boxSize={4} as={FiChevronsRight} />
              </Button>{" "}
            </Flex>
          )}
        </TableContainer>
      </>
    );
  }
  
  export function DiscountTable(props) {
    /* to be filled with datajson*/
    const data = useMemo(
      () => [
        {
            OrderNo: "#1234",
            DateTime: "Please disable this account",
            status: "Open",      
            amount: "$1.00"

        },
        {
            OrderNo: "#1344",
            DateTime: "Need top up",
            status: "Closed",
            amount: "$105"
          
        },
        {
            OrderNo: "#2424",
            DateTime: "Test",
            status: "Closed",
            amount: "$1111"
          
        }
      ],
      []
    );
  
    const columns = useMemo(
      () => [
        {
          Header: "Order ID",
          accessor: "OrderNo",
          Filter: "",
          filter: ""
        },
        {
          Header: "Date/Time",
          accessor: "DateTime",
          Filter: "",
          filter: ""
        },
        {
          Header: "Status",
          accessor: "status",
          Filter: "",
          filter: ""
        },
        {
            Header: "Amount",
            accessor: "amount",
            Filter: "",
            filter: ""
          },
        // {
        //   Header: "Amount",
        //   accessor: "amount",
        //   Filter: SelectColumnFilter,
        //   filter: "",
        //   disableSortBy: true,
        //   Cell: ({ row: { original } }) => (
        //     <Badge
        //       size={"xs"}
        //       colorScheme={original.status == "Open" ? "green" : "gray"}
        //     >
        //       {original.status}
        //     </Badge>
        //   )
        // },
        // {
        //   Header: "",
        //   accessor: "action",
        //   Filter: "",
        //   filter: "",
        //   disableSortBy: true,
        //   Cell: ({ row: { original } }) => (
        //     <Button
        //       colorScheme="teal"
        //       size={"sm"}
        //       onClick={() => alert(JSON.stringify(original))}
        //     >
        //       Update
        //     </Button>
        //   )
        // }
      ],
      []
    );
  
    return (

      <div className="overlay">
        <div className="centerContent">          
          <AppTable columns={columns} data={data} searchEnabled={true} />
        </div>     
      </div>
    );
  }
  


export default DiscountTable;
