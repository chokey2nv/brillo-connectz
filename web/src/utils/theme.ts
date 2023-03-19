import { Theme } from "@mui/material";

export const appTheme: Partial<AppTheme> = {
  colors: {
    colorText: "#717331",
    colorPrimary: "#908f44",
  },
  sizes: {
    large: 18,
    medium: 14,
    small: 10,
  },
};
export interface AppTheme extends Theme {
  colors: Partial<AppColors>;
  sizes: Partial<AppSizes>;
}

interface AppSizes {
  large: number;
  medium: number;
  small: number;
}
interface AppColors {
  colorBgPrimary: string;
  colorBgSecondary: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorText: string;
  colorTextSecondary: string;
  colorHeader: string;
  colorBgHeader: string;
}
