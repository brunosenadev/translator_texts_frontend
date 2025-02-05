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

export default function Servers() {
    const [formData, setFormData] = useState({
        ip_server: "",
        port_server: "",
        name_server: "",
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

    const handleRemove = async () => {
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
                url: `/server/${formData.id}`,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response) {
                setMessage(`Servidor do ${response.name_server} excluído com sucesso!`);
                handleReset();
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

    const handleUpdate = async () => {
        setMessage("");
        
        try {
            if (formData.id == "") {
                setMessage("Necessário ter id em tela para poder atualizar um registro");
                setShowConfirmation(true);
                setShowButtonCancel(false);
                setConfirmationAction(() => () => {
                    setShowConfirmation(false);
                });
                return
            }

            const response = await request({
                url: `/server/${formData.id}`,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    name_server: formData.name_server,
                    ip_server: formData.ip_server,
                    port_server: formData.port_server
                },
            });

            if (response) {
                setMessage(`Servidor ${response.name_server} atualizado com sucesso!`);
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
            if (formData.ip_server == "" || formData.port_server == "" || formData.name_server == "") {
                setMessage("Algum campo está vazio! Verifique.");
                setShowConfirmation(true);
                setShowButtonCancel(false);
                setConfirmationAction(() => () => {
                    setShowConfirmation(false);
                });
                return
            }
            const response = await request({
                url: "/server/create",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    name_server: formData.name_server,
                    ip_server: formData.ip_server,
                    port_server: formData.port_server,
                },
            });

            if (response) {
                setMessage(`Servidor do ${response.name_server} criado com sucesso!`);
                setShowConfirmation(true);
                setShowButtonCancel(false);

                setConfirmationAction(() => () => {
                    handleReset();
                    setShowConfirmation(false);
                });
            }
        } catch (error: any) {
            if (error.message === "Esse servidor já existe") {
                setMessage(`${error.message}. Deseja visualizar as informações desse servidor?`);
                setShowConfirmation(true);
                setShowButtonCancel(true);

                setConfirmationAction(() => async () => {
                    const response_get = await request({
                        url: `/server/${formData.ip_server}`,
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
            ip_server: "",
            name_server: "",
            port_server: "",
            id: ""
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
                    <h2 className="text-4xl font-bold text-center">Server Settings</h2>

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
                            <Label className="font-semibold text-lg" htmlFor="ipServer">
                                IP Server
                            </Label>
                            <Input
                                id="ip_server"
                                type="text"
                                placeholder="Enter IP server: (Ex.: 192.168.1.10)"
                                className="w-full h-full p-4 bg-muted/40 border border-gray-600 rounded-lg text-lg"
                                value={formData.ip_server}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label className="font-semibold text-lg" htmlFor="portServer">
                                Port Server
                            </Label>
                            <Input
                                id="port_server"
                                type="text"
                                placeholder="Enter port server: (Ex.: 10443)"
                                className="w-full h-full p-4 bg-muted/40 border border-gray-600 rounded-lg text-lg"
                                value={formData.port_server}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label className="font-semibold text-lg" htmlFor="nameServer">
                                Name Server
                            </Label>
                            <Input
                                id="name_server"
                                type="text"
                                placeholder="Enter name server: (Ex.: Vm-Node1)"
                                className="w-full h-full p-4 bg-muted/40 border border-gray-600 rounded-lg text-lg"
                                value={formData.name_server}
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
