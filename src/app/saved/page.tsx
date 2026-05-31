import { SavedClient } from "./SavedClient";

export const metadata = {
  title: "Saved places",
  description: "Your saved Moroccan destinations — stored locally in this browser.",
};

export default function SavedPage() {
  return <SavedClient />;
}
