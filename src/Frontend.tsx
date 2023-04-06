import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Flex, Input, VStack, TabList, TabPanel, TabPanels, Tabs, Tab, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { io, Socket } from 'socket.io-client';

const Frontend: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);
  

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('progressUpdate', (data: { message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleClick = async (endpoint: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/${endpoint}`, { method: 'POST' });
      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, data.message]);
    } catch (error: any) {
      console.error('Error:', error);
      setMessages((prevMessages) => [...prevMessages, error]);
    }
  };

  // Inside the Frontend component
const [loggedIn, setLoggedIn] = useState<boolean>(false);

const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store the token in the local storage
        setLoggedIn(true);
      } else {
        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, data.error]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

const handleRegister = async (username: string, password: string) => {
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 201) {
      setLoggedIn(true);
    } else {
      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, data.error]);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Inside the Frontend component
const [username, setUsername] = useState<string>('');
const [password, setPassword] = useState<string>('');

const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setUsername(event.target.value);
};

const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setPassword(event.target.value);
};

  return (
    <VStack spacing={4} align="center">
    {!loggedIn && (
      <Tabs isFitted variant="enclosed">        
        <TabPanels>
        // Add the following code inside the return statement for the login form:
<TabPanel>
  <VStack spacing={4} align="center">
    <FormControl id="usernameReg" isRequired>
      <FormLabel>Usuario</FormLabel>
      <Input type="text" value={username} onChange={handleUsernameChange} />
    </FormControl>
    <FormControl id="passwordReg" isRequired>
      <FormLabel>Contraseña</FormLabel>
      <Input type="password" value={password} onChange={handlePasswordChange} />
    </FormControl>
    <Button colorScheme="blue" onClick={() => handleLogin(username, password)}>
      Login
    </Button>
  </VStack>
</TabPanel>
        </TabPanels>
        <Flex width="80%" justifyContent="center">
        <Text
          as="textarea"
          rows={10}
          height={250}
          width={250}
          value={messages.join('\n')}
          readOnly
          variant="filled"
          textAlign="left"
          _readOnly={{
            bg: 'gray.100',
            borderColor: 'gray.200',
          }}
        />
      </Flex>
      </Tabs>
      
    )}
    {loggedIn && (
      <>
        <VStack spacing={4} align="center">
            <Tabs>
            <TabList mb="1em">
          <Tab>Actualizar Ecommerce</Tab>
          <Tab>Registrar usuario</Tab>
        </TabList>
        <TabPanels>        
<TabPanel>
  <VStack spacing={4} align="center">
  <ButtonGroup variant="outline" spacing="6">
        <Button onClick={() => handleClick('ecommerce-1-price-update')}>Actualizar Precios Atopem's</Button>
        <Button onClick={() => handleClick('ecommerce-1-stock-update')}>Actualizar Stock Atopem's</Button>
        <Button onClick={() => handleClick('ecommerce-2-price-update')}>Actualizar Precios Buswork</Button>
        <Button onClick={() => handleClick('ecommerce-2-stock-update')}>Actualizar Stock Buswork</Button>
        <Button onClick={() => handleClick('ecommerce-3-price-update')}>Actualizar Precios ML</Button>
        <Button onClick={() => handleClick('ecommerce-3-stock-update')}>Actualizar Stock ML</Button>
        <Button onClick={() => handleClick('omincommerce-update')}>Actualizar TODO</Button>
        </ButtonGroup>
      <Flex width="80%" justifyContent="center">
        <Input
          as="textarea"
          rows={10}
          height={250}
          value={messages.join('\n')}
          readOnly
          variant="filled"
          textAlign="left"
          _readOnly={{
            bg: 'gray.100',
            borderColor: 'gray.200',
          }}
        />
      </Flex>
  </VStack>
  </TabPanel>
  <TabPanel>
  <VStack spacing={4} align="center">
    <FormControl id="usernameLogin" isRequired>
      <FormLabel>Usuario</FormLabel>
      <Input type="text" value={username} onChange={handleUsernameChange} />
    </FormControl>
    <FormControl id="passwordLogin" isRequired>
      <FormLabel>Contraseña</FormLabel>
      <Input type="password" value={password} onChange={handlePasswordChange} />
    </FormControl>
    <Button colorScheme="blue" onClick={() => handleRegister(username, password)}>
      Registrar
    </Button>
  </VStack>
</TabPanel>
        </TabPanels>
            </Tabs>
       

      
    </VStack>
      </>
    )}
  </VStack>    
  );
};

export default Frontend;