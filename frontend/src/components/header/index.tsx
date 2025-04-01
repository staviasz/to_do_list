"use client";

import Avatar from "@public/11209565-avatar-do-perfil-do-usuario-gratis-vetor.jpg";
import Image from "next/image";

interface HeaderProps {
  onClick: () => void;
}

export default function Header({ onClick }: HeaderProps) {
  return (
    <header className="d-flex align-items-center justify-content-end gap-3 py-2 px-3">
      <p className="m-0 text-primary cursor-pointer" onClick={onClick}>
        Acessar
      </p>
      <Image
        src={Avatar}
        alt="avatar"
        width={50}
        height={50}
        className="rounded-circle"
      />
    </header>
  );
}
