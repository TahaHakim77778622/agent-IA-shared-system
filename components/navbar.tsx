"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import AnimatedLogo from "./AnimatedLogo"

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const themeLabel =
    theme === "system"
      ? "Système"
      : theme === "dark"
      ? "Sombre"
      : "Clair";
  const themeIcon =
    theme === "system" ? (
      <span className="relative flex items-center">
        <Sun className="h-5 w-5 text-yellow-500 animate-spin-slow" />
        <Moon className="h-5 w-5 text-zinc-500 -ml-2 animate-fade-in" />
      </span>
    ) : theme === "dark" ? (
      <Moon className="h-5 w-5 text-zinc-900 dark:text-yellow-400 animate-fade-in" />
    ) : (
      <Sun className="h-5 w-5 text-yellow-500 animate-fade-in" />
    );
  const handleChange = (value: string) => {
    setTheme(value);
    toast({
      title: `Thème changé`,
      description: value === "system" ? "Mode système activé" : value === "dark" ? "Mode sombre activé" : "Mode clair activé",
      duration: 1800,
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-4 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary">
          {themeIcon}
          <span className="hidden md:inline text-sm">{themeLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleChange("light")}
          className={theme === "light" ? "bg-primary/10 text-primary font-semibold" : ""}
          aria-checked={theme === "light"}
          role="menuitemradio"
        >
          ☀️ Clair {theme === "light" && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("dark")}
          className={theme === "dark" ? "bg-primary/10 text-primary font-semibold" : ""}
          aria-checked={theme === "dark"}
          role="menuitemradio"
        >
          🌙 Sombre {theme === "dark" && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("system")}
          className={theme === "system" ? "bg-primary/10 text-primary font-semibold" : ""}
          aria-checked={theme === "system"}
          role="menuitemradio"
        >
          🖥️ Système {theme === "system" && <span className="ml-2">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { ThemeSwitcher };

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
  ]

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <AnimatedLogo size="sm" showText={true} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/roadmap" className="text-muted-foreground hover:text-primary font-medium transition-colors">
              Roadmap
            </Link>

            {/* Theme Toggle */}
            <ThemeSwitcher />

            <Button variant="outline" className="ml-4 bg-transparent" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/register">Inscription</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/roadmap"
                className="text-muted-foreground hover:text-primary font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Roadmap
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <ThemeSwitcher />
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                  <Link href="/register">Inscription</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
