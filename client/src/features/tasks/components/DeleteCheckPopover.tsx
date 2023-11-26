import React from 'react';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  useDisclosure
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export const DeleteCheckPopover = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom"
    >
      <PopoverTrigger>
        <button
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer'
          }}
          aria-label="Delete item"
          onClick={onOpen}
        >
          <DeleteIcon color="tomato" />
        </button>
      </PopoverTrigger>
      <PopoverContent w="100%">
        <PopoverArrow />
        <PopoverBody color="gray.900">本当に削除しますか？</PopoverBody>
        <PopoverFooter display="flex" justifyContent="flex-end">
          <Button size="sm" colorScheme="red" mr={3}>
            削除
          </Button>
          <Button size="sm" colorScheme="gray" onClick={onClose}>
            キャンセル
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
