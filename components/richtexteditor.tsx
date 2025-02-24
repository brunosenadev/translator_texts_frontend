"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className: string
}

export default function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    return (
        <div className="w-full">
            <ReactQuill theme="snow" value={value} onChange={onChange} className={className} />
        </div>
    );
}
