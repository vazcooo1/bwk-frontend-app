import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Input,
  VStack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tab,
  FormControl,
  FormLabel,
  Text,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  MenuGroup,
  MenuItem,
  IconButton,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons";

import { io, Socket } from "socket.io-client";

const Frontend: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("progressUpdate", (data: { message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleClick = async (endpoint: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method: "POST",
      });
      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, data.message]);
    } catch (error: any) {
      console.error("Error:", error);
      setMessages((prevMessages) => [...prevMessages, error]);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
      } else {
        const data = await response.json();
        setErrorModalMessage(data.error);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeModal = () => {
    setIsErrorModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  const handleRegister = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 201) {
        setLoggedIn(true);
      } else {
        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, data.error]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <Box bg="gray.100" minH="100vh">
      <Flex direction="column" minW="900px" maxW="1200px" py={5} px={4} mx="auto">
        <Heading mb={10} textAlign="center" fontSize={{ base: "2xl", md: "4xl" }}>
          Buswork Dashboard App
        </Heading>
        {!loggedIn && (
          <Tabs isFitted variant="enclosed" colorScheme="blue">
            <TabList mb="1em">
              <Tab>Login</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={6} align="center">
                  <FormControl id="usernameLogin" isRequired>
                    <FormLabel>Usuario</FormLabel>
                    <Input
                      bgColor="whiteAlpha.600"
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      borderRadius="lg"
                    />
                  </FormControl>
                  <FormControl id="passwordLogin" isRequired>
                    <FormLabel>Contraseña</FormLabel>
                    <Input
                      bgColor="whiteAlpha.600"
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      borderRadius="lg"
                    />
                  </FormControl>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleLogin(username, password)}
                    isLoading={loading}
                    size="lg"
                  >
                    Login
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
        {loggedIn && (
          <>
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    isActive={isOpen}
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    colorScheme="pink"
                    size="lg"
                    my={4}
                  >
                    {isOpen ? "Cerrar Menú" : "Menú"}
                  </MenuButton>
                  <MenuList>
                    <MenuGroup title="Buswork">
                      <MenuItem
                        onClick={() => handleClick("ecommerce-2-price-update")}
                      >
                        Actualizar precios
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleClick("ecommerce-2-stock-update")}
                      >
                        Actualizar stock
                      </MenuItem>
                    </MenuGroup>
                    <MenuGroup title="Atopem's">
                      <MenuItem
                        onClick={() => handleClick("ecommerce-1-price-update")}
                      >
                        Actualizar precios
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleClick("ecommerce-1-stock-update")}
                      >
                        Actualizar stock
                      </MenuItem>
                    </MenuGroup>
                    <MenuGroup title="MercadoLibre">
                      <MenuItem
                        onClick={() => handleClick("ecommerce-3-price-update")}
                      >
                        Actualizar precios
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleClick("ecommerce-3-stock-update")}
                      >
                        Actualizar stock
                      </MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuItem onClick={() => handleClick("updateGecom")}>
                      Actualizar GECOM & Google API
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={() => handleClick("updateMongo")}>
                      Actualizar MongoDB
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout}>Salir</MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<AddIcon />}
                colorScheme="purple"
                size="lg"
                my={4}
              >
                Registrar Usuario
              </MenuButton>
              <MenuList>
                <VStack spacing={6} align="center" padding={10}>
                  <FormControl id="usernameLogin                " isRequired>
                  <FormLabel>Usuario</FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl id="passwordLogin" isRequired>
                  <FormLabel>Contraseña</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    borderRadius="lg"
                  />
                </FormControl>
                <Button
                  colorScheme="blue"
                  onClick={() => handleRegister(username, password)}
                  isLoading={loading}
                  size="lg"
                >
                  Registrar
                </Button>
              </VStack>
            </MenuList>
          </Menu>
          <Card my={4}>
            <CardBody>
            <Textarea 
  ref={textareaRef}
  rows={10}
  height={250}
  value={messages.join("\n")}
  readOnly
  variant="filled"
  textAlign="left"
  _readOnly={{
    bg: "gray.100",
    borderColor: "gray.200",
  }}
  borderRadius="lg"
  fontSize={{ base: "sm", md: "md" }}
/>
            </CardBody>
          </Card>
        </>
      )}
      <Modal isOpen={isErrorModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{errorModalMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  </Box>
);

  
};

export default Frontend;