import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  Text,
  Container,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios({
        method: 'post',
        url: 'https://ins-api-unrz.onrender.com/api/chat/',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          message: inputMessage,
        },
      });

      const botMessage: Message = {
        content: response.data.response || response.data.message || 'No response',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.900" py={4}>
      <Container maxW="container.md" h="100vh">
        <Flex flexDirection="column" h="100%">
          <Box
            flex="1"
            overflowY="auto"
            bg="gray.800"
            borderRadius="xl"
            p={4}
            mb={4}
            boxShadow="dark-lg"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <VStack align="stretch" spacing={4}>
              {messages.map((message, index) => (
                <Flex
                  key={index}
                  justifyContent={message.isUser ? 'flex-end' : 'flex-start'}
                >
                  <Box
                    maxW="70%"
                    bg={message.isUser ? 'whiteAlpha.200' : 'gray.700'}
                    p={4}
                    borderRadius="xl"
                    boxShadow="dark-lg"
                    borderWidth="1px"
                    borderColor={message.isUser ? 'whiteAlpha.300' : 'gray.600'}
                  >
                    <Text color="white">{message.content}</Text>
                    <Text 
                      fontSize="xs" 
                      color={message.isUser ? 'whiteAlpha.600' : 'whiteAlpha.400'} 
                      mt={2}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </Text>
                  </Box>
                </Flex>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          <Flex>
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              mr={2}
              bg="gray.800"
              borderColor="gray.600"
              borderWidth="1px"
              _hover={{
                borderColor: 'gray.500'
              }}
              _focus={{
                borderColor: 'whiteAlpha.400',
                boxShadow: 'none'
              }}
              color="white"
              size="lg"
              borderRadius="xl"
            />
            <Button
              onClick={handleSendMessage}
              isLoading={isLoading}
              size="lg"
              px={8}
              borderRadius="xl"
              bg="whiteAlpha.200"
              _hover={{
                bg: 'whiteAlpha.300'
              }}
              _active={{
                bg: 'whiteAlpha.400'
              }}
            >
              Send
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}; 