import { useEffect, useRef, useState } from "react"
import { Button, Center, CloseButton, Dialog, Portal, } from "@chakra-ui/react"
import Image, { StaticImageData } from "next/image"

interface ModalProps {
    title: string;
    body: React.ReactNode;
    triggerLabel: string;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    image?: string | StaticImageData;
}


const Modal = ({title, body, triggerLabel, onConfirm, confirmLabel, cancelLabel, image}: ModalProps) => {
  return (
    <Dialog.Root size="cover" placement="center">
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          {triggerLabel}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize={50}>{title}</Dialog.Title>
            </Dialog.Header>
            <Center>
            {image && <Image src={image} alt="logo" quality={100} width={500} height={250} style={{ objectFit: "cover" }}/>}
            </Center>
            <Center>
            <Dialog.Body>
                {body}
            </Dialog.Body>
            </Center>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{cancelLabel || "Cancel"}</Button>
              </Dialog.ActionTrigger>
              <Button onClick={onConfirm}>{confirmLabel || "Save"}</Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default Modal