import Image from "next/image";

export default function Signature() {
  return (
    <Image
      src="/profile-karl.png"
      alt="Karl Lorey"
      width={80}
      height={80}
      className="float-right ml-4 mb-2 rounded-full"
    />
  );
}
