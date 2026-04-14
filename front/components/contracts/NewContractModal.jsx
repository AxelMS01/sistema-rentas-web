
"use client";

import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useState } from "react";

export default function NewContractModal({ isModalOpen, onCloseModal, onSaveContract }) {

    return (
        <>
            <Modal show={isModalOpen} size="md" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="space-y-6!">
                        <h3 className="text-2xl! font-semibold! tracking-tight text-gray-900 dark:text-white">Nuevo contrato</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email">Your email</Label>
                            </div>
                            <TextInput
                                id="email"
                                placeholder="name@company.com"
                                value={""}
                                onChange={(e) => ""}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password">Your password</Label>
                            </div>
                            <TextInput id="password" type="password" required />
                        </div>
                        <div className="w-full flex sm:flex-row flex-col gap-2">
                            <Button className="w-full text-sm! rounded-lg! bg-sky-600 hover:bg-sky-700! px-4! py-2!" onClick={onSaveContract}>
                                Guardar contrato
                            </Button>
                            <Button className="w-full text-sm! rounded-lg! px-4! py-2!" color={"alternative"} onClick={onCloseModal}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
}