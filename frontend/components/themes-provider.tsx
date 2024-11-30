import * as React from "react"
import {ThemeProvider as NextThemesProvider} from "next-themes";

export const ThemeProvider = ({
                                  children,
                                  ...props
                              }: React.ComponentProps<typeof NextThemesProvider>) => {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
};
