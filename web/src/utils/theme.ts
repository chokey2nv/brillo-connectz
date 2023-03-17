import { Theme } from "@mui/material";

export interface AppTheme extends Theme {
  colors: {
    colorBgPrimary: string;
    colorBgSecondary: string;
    colorPrimary: string;
    colorSecondary: string;
    colorAccent: string;
    colorText: string;
    colorTextSecondary: string;
    colorHeader: string;
    colorBgHeader: string;
  };
}

export const appTheme: Partial<AppTheme> = {};
