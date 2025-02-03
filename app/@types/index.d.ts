import { ColumnDef } from "@tanstack/react-table";
import { StringToBoolean } from "class-variance-authority/types";

declare global {
    export interface DataMain {
      whatsapp: string;
      number: string;
      lastMessage: string;
      status: string;
    }

    export type ColumnsDefMainType = ColumnDef<DataMain>[];

    export interface DataNumber {
        number: string;
        session: string;
        path: string;
        timeout: number;
    }

    export type ColumnsDefNumberType = ColumnDef<DataNumber>[]
  }
  
  export {};
  