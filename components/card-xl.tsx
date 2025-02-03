"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FaSave, FaTimes, FaWindowClose } from 'react-icons/fa'

export default function CardXL() {
    return (
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

                <div className="space-y-6">
                    <div className="flex flex-col space-y-2">
                        <Label className="font-semibold text-lg" htmlFor="number">
                            Number
                        </Label>
                        <Input
                            id="number"
                            type="text"
                            placeholder="Enter number: (Ex.:+554799876-5432)"
                            className="w-full h-full p-4 bg-muted/40 border border-gray-600 rounded-lg text-lg"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label className="font-semibold text-lg" htmlFor="name">
                            Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter name: (Ex.: Iphone)"
                            className="w-full h-full p-4 bg-muted/40 border border-gray-600 rounded-lg text-lg"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label className="font-semibold text-lg" htmlFor="id">
                            ID
                        </Label>
                        <Input
                            id="id"
                            type="text"
                            placeholder="Enter ID"
                            className="w-full h-full p-4 bg-muted/40 border border-gray-600 rounded-lg text-lg"
                            disabled
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex justify-start space-x-2 mt-6"
                    >
                        <Button className="text-lg w-[150px] h-full text-white bg-green-600 hover:bg-green-700">
                            <FaSave />
                            Save
                        </Button>
                        <Button className="text-lg w-[150px] h-full text-white bg-red-600 hover:bg-red-700">
                            <FaWindowClose className="text-xl"/>
                            Cancel
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
