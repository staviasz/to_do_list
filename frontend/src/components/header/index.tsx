"use client";

import { useAuth } from "@/hooks/use-auth";
import AvatarAnonymous from "@public/11209565-avatar-do-perfil-do-usuario-gratis-vetor.jpg";
import Avatar from "@public/images.jpeg";
import Image from "next/image";

interface HeaderProps {
  onClick: () => void;
}

export default function Header({ onClick }: HeaderProps) {
  const {session} =useAuth();

  return (
    <header className="d-flex align-items-center justify-content-end gap-3 py-2 px-3">
      <p className="m-0 text-primary cursor-pointer" onClick={onClick}>
        Acessar
      </p>
      <Image
        src={session?.user?.id ? Avatar : AvatarAnonymous}
        alt="avatar"
        width={50}
        height={50}
        className="rounded-circle"
      />
    </header>
  );
}
