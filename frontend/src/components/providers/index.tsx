import { Toaster } from "sonner";
import AuthProvider from "./auth-provider";
import ReactQueryProvider from "./react-query-provider";
import { ThemeProvider } from "../ui/theme/theme-provider";

export default function GlobalProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
         <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
    <ReactQueryProvider>
    <AuthProvider>
      {children}
      <Toaster/>
    </AuthProvider>
    </ReactQueryProvider>
    </ThemeProvider>
    </div>
  );
}
