"use client"

import { useEffect, useState } from "react";
import { MobileNav, MobileNavHeader, MobileNavMenu, MobileNavToggle, Navbar, NavbarButton, NavbarLogo, NavBody } from "./ui/resizable-navbar";
import { getToken } from "@/utils/token";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter()
  useEffect(() => {
    const getAccessToken = () => {
      const token = getToken();
      if (token) setIsLoggedIn(true);
    };
    getAccessToken();
  });

  const handleLogout = () => {
    setIsMobileMenuOpen(false)
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    router.replace("/login")
  }


  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-4">
            {
              isLoggedIn ? (
                <>
                  <NavbarButton variant="primary" href="/dashboard">Dashboard</NavbarButton>
                  <NavbarButton variant="primary" onClick={handleLogout}>Logout</NavbarButton>
                </>
              ) : <>
                <NavbarButton variant="primary" href="/login">Login</NavbarButton>
                <NavbarButton variant="primary" href="/register">Register</NavbarButton>
              </>
            }
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex w-full flex-col gap-4">
              {isLoggedIn ? <>
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                  href="/home"
                >
                  Home
                </NavbarButton>
                <NavbarButton
                  variant="primary"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </NavbarButton>
              </>
                :
                <>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                    href="/login"
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                    href="/register"
                  >
                    Register
                  </NavbarButton>
                </>
              }
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
