'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from '@/app/components/layout/SiteHeader';
import { ButtonLink } from '@/app/components/ui/Button';
import { link } from 'fs';

/**
 * Navbar landing — memakai SiteHeader bersama (spec: top-nav 64px).
 * Hanya anchor yang benar-benar ada di halaman (#fitur, #faq).
 */
export default function Navbar() {
    const [activeHash, setActiveHash] = useState('#hero');
    const navLinks = [
        { href: '#hero', label: 'Beranda' },
        { href: '#fitur', label: 'Fitur' },
        { href: '#faq', label: 'FAQ' },
    ];
    return (
        <SiteHeader>
            <nav className="hidden md:flex items-center gap-8 text-nav-link">
                {navLinks.map((link) => {
                    const isActive = activeHash === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setActiveHash(link.href)}
                            className={`transition-colors duration-200 ${isActive ? 'text-ink font-semibold' : 'text-muted hover:text-ink'}`}>
                                {link.label}
                        </Link>
                    )
                })}
            </nav>
            <ButtonLink href="/review">Mulai Gratis</ButtonLink>
        </SiteHeader>
    );
}
