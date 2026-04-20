import { Button, Label, Modal, ModalBody, ModalHeader, Textarea, Select } from "flowbite-react";

export default function ConfirmationModal({ title, msg, onConfirm, onCancel, isModalOpen, id}) {
    return (
        <Modal show={isModalOpen} size="xl" onClose={onCancel} popup>
            <ModalHeader className="pb-0 px-6! pt-6!">
                <p className="text-xl! tracking-tight font-semibold">{title}</p>
            </ModalHeader>
            <ModalBody className="flex flex-col gap-2">
                <p className="w-full wrap-normal text-sm! text-sate-600 mb-3">
                    {msg}
                </p>

                <div className="w-full flex sm:flex-row flex-col gap-2">
                    <Button className="w-full text-sm! rounded-lg! px-4! py-2!" color={"alternative"} onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button className="w-full text-sm! rounded-lg! bg-sky-600 hover:bg-sky-700! px-4! py-2!" onClick={onConfirm}>
                        Continuar
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};