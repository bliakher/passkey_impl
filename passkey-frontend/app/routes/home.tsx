import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Passkey Auth Test" },
    { name: "description", content: "Passkey authentication test app" },
  ];
}

export default function Home() {
  return <Welcome />;
}
