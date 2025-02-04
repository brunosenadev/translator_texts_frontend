"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaSave, FaWindowClose } from "react-icons/fa";
import useApiRequest from "@/hooks/use-api-request";
import ModalConfirmation from "@/components/modal-message";
import { Trash2 } from "lucide-react";

export default function Numbers() {
    const [formData, setFormData] = useState({
        number_phone: "",
        name: "",
        id: "",
    });

    const [message, setMessage] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showButtonCancel, setShowButtonCancel] = useState(true);
    const [confirmationAction, setConfirmationAction] = useState<() => void>(() => () => { });
    const [cancelationAction, setCancelationAction] = useState<() => void>(() => () => { });
    const [visibleButtonsEdit, setVisibleButtonsEdit] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const { request, loading } = useApiRequest();

    const handleRemove = async (e: React.FormEvent) => {

    };

    const handleUpdate = async () => {
        setMessage("");
        
        try {
            if (formData.id == "") {
                setMessage("Necessário ter id em tela para poder excluir um registro");
                setShowConfirmation(true);
                setShowButtonCancel(false);
                setConfirmationAction(() => () => {
                    setShowConfirmation(false);
                });
                return
            }

            const response = await request({
                url: `/number/${formData.id}`,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    name: formData.name,
                    number_phone: formData.number_phone,
                },
            });

            if (response) {
                setMessage(`Número do ${response.name} atualizado com sucesso!`);
                setFormData(response);
                setShowConfirmation(true);
                setShowButtonCancel(false);

                setConfirmationAction(() => () => {
                    setVisibleButtonsEdit(false);
                    handleReset();
                    setShowConfirmation(false);
                });
            }
        } catch (error: any) {
            setMessage(error.message);
            setShowConfirmation(true);
            setShowButtonCancel(false);

            setConfirmationAction(() => () => {
                setVisibleButtonsEdit(false);
                setShowConfirmation(false);
                handleReset();
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        try {
            if (formData.name == "" || formData.number_phone == "") {
                setMessage("Nome do aparelho ou o campo número está vazio! Não pode estar vazio, verifique.");
                setShowConfirmation(true);
                setShowButtonCancel(false);
                setConfirmationAction(() => () => {
                    setShowConfirmation(false);
                });
                return
            }
            const response = await request({
                url: "/number/create",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    name: formData.name,
                    number_phone: formData.number_phone,
                },
            });

            if (response) {
                setMessage(`Número do ${response.name} criado com sucesso!`);
                setShowConfirmation(true);
                setShowButtonCancel(false);

                setConfirmationAction(() => () => {
                    handleReset();
                    setShowConfirmation(false);
                });
            }
        } catch (error: any) {
            if (error.message === "Esse número já existe") {
                setMessage(`${error.message}. Deseja visualizar as informações desse número?`);
                setShowConfirmation(true);
                setShowButtonCancel(true);

                setConfirmationAction(() => async () => {
                    const response_get = await request({
                        url: `/number/${formData.number_phone}`,
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response_get) {
                        handleReset();
                        setFormData(response_get);
                    }

                    setVisibleButtonsEdit(true);
                    setShowConfirmation(false);
                });

                setCancelationAction(() => () => {
                    handleReset();
                    setShowConfirmation(false);
                })
            } else {
                setMessage(error.message);
                setShowConfirmation(true);
                setShowButtonCancel(false);

                setConfirmationAction(() => () => {
                    setShowConfirmation(false);
                    handleReset();
                });
            }
        }
    };

    const handleReset = () => {
        setFormData({
            number_phone: "",
            name: "",
            id: "",
        });
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="min-h-screen flex items-center justify-center bg-muted/60 p-6"
            >
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                    className="w-full max-w-2xl bg-muted/70 text-white rounded-2xl shadow-2xl p-8 space-y-6"
                >
                    <h2 className="text-4xl font-bold text-center">Number Settings</h2>

                    {showConfirmation && (
                        <ModalConfirmation
                            message={message}
                            onConfirm={confirmationAction}
                            onCancel={cancelationAction}
                            bButtonCancel={showButtonCancel}
                        />
                    )}

                    <div className="space-y-6">

                        <div className="flex flex-col space-y-2">
                            <Label className="font-semibold text-lg" htmlFor="id">
                                ID
                            </Label>
                            <Input
                                id="id"
                                type="text"
                                placeholder="Generated ID"
                                className="w-full h-full p-4 bg-muted/40 border border-gray-600 rounded-lg text-lg"
                                value={formData.id}
                                disabled
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label className="font-semibold text-lg" htmlFor="number_phone">
                                Number
                            </Label>
                            <Input
                                id="number_phone"
                                type="text"
                                placeholder="Enter number: (Ex.:5547999999999)"
                                className="w-full h-full p-4 bg-muted/40 border border-gray-600 rounded-lg text-lg"
                                value={formData.number_phone}
                                onChange={handleChange}
                                disabled={visibleButtonsEdit}
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label className="font-semibold text-lg" htmlFor="name">
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter name: (Ex.: iPhone)"
                                className="w-full h-full p-4 bg-muted/40 border border-gray-600 rounded-lg text-lg"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex justify-start space-x-2 mt-6"
                        >
                            <Button
                                className={`text-lg w-[150px] h-full text-white bg-green-600 ${!visibleButtonsEdit == true ? "" : "hidden"} hover:bg-green-700 hover:cursor-pointer`}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                <FaSave />
                                {loading ? "Saving..." : "Save"}
                            </Button>

                            <Button
                                className={`text-lg w-[150px] h-full text-white bg-green-600 ${visibleButtonsEdit == true ? "" : "hidden"} hover:bg-green-700 hover:cursor-pointer`}
                                onClick={handleUpdate}
                                disabled={loading}
                            >
                                <FaSave />
                                Confirm
                            </Button>

                            <Button
                                className={`text-lg w-[150px] h-full text-white bg-red-600 ${visibleButtonsEdit == true ? "" : "hidden"} hover:bg-red-700 hover:cursor-pointer`}
                                onClick={handleRemove}
                            >
                                <Trash2 className="text-xl" />
                                Remove
                            </Button>

                            <Button
                                className={`text-lg w-[150px] h-full text-white bg-red-600 ${!visibleButtonsEdit == true ? "" : "hidden"} hover:bg-red-700 hover:cursor-pointer`}
                                onClick={handleReset}
                            >
                                <FaWindowClose className="text-xl" />
                                Cancel
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
