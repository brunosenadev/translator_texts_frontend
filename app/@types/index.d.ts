import { ColumnDef } from "@tanstack/react-table";

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

    export type ColumnsDefNumberType = ColumnDef<DataNumber>[];

    export interface Option {
      id: int;
      number_session: string;
      server_session: string;
      session_path: string;
      timeout_session: internal;
    }

    export interface OptionNumberSelect {
      id: int;
      name: string;
    }

    export interface OptionsServerSelect {
      id: int;
      name_server: string;
      ip_server: string;
      port_server: string;
    }
  }
  
  export {};
  