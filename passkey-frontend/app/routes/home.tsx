import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Passkey Auth Demo" },
    { name: "description", content: "Passkey authentication demo app" },
  ];
}

export default function Home() {
  return <Welcome />;
}
