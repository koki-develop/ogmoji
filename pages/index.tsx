import React, { useCallback, useEffect, useMemo } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

const origin =
  process.env.NODE_ENV === "production"
    ? "https://ogmoji.vercel.app"
    : "http://localhost:3000";

type HomeProps = {
  text: string;
};

export default function Home(props: HomeProps) {
  const router = useRouter();

  const [text, setText] = React.useState(props.text);
  const trimmedText = useMemo(() => text.trim(), [text]);

  const ogImageUrl = useMemo(() => {
    const url = new URL("/api/v1/og", origin);
    url.searchParams.set("t", trimmedText);
    return url;
  }, [trimmedText]);

  const imageSrc = useMemo(() => {
    return ogImageUrl.pathname + ogImageUrl.search;
  }, [ogImageUrl]);

  const handleChangeText = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    []
  );

  useEffect(() => {
    const query = trimmedText === "" ? undefined : { t: trimmedText };
    router.replace({ query }, undefined, { shallow: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmedText]);

  return (
    <main className={inter.className}>
      <input type="text" value={text} onChange={handleChangeText} />

      {trimmedText !== "" && (
        <Image src={imageSrc} width={1200} height={630} alt={trimmedText} />
      )}
    </main>
  );
}

export function getServerSideProps({ query }: { query: { t?: string } }) {
  return {
    props: {
      text: query.t ?? "",
    },
  };
}
