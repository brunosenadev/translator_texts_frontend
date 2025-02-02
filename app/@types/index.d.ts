import { ColumnDef } from "@tanstack/react-table";

declare global {
    export interface DataMain {
      whatsapp: string;
      number: string;
      lastMessage: string;
      status: string;
      actions: string;
    }

    export type ColumnsDefMainType = ColumnDef<DataMain>[];
  }
  
  export {};
  