import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ModalConfirmationProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    bButtonCancel: Boolean;
}

const ModalConfirmation = ({ message, onConfirm, onCancel, bButtonCancel }: ModalConfirmationProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
        >
            <div className="bg-muted/70 p-6 rounded-xl text-center z-20">
                <p className="text-lg font-semibold mb-4">{message}</p>
                <div className="flex justify-center space-x-4">
                    <Button
                        className="bg-green-500 hover:bg-green-700 text-white hover:cursor-pointer"
                        onClick={onConfirm}
                        disabled={false}
                    >
                        Confirmar
                    </Button>
                    <Button
                        className={`bg-red-500 text-white ${bButtonCancel ? '' : 'hidden'} hover:cursor-pointer`}
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ModalConfirmation;
