import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import FuseLogo from "img/fuse-logo.svg";
import Image from "next/image";
import styled from "styled-components";

import TextInput from "components/TextField";

const Button = styled.button`
  background-color: #1b39da;
  border: 1px solid #1b39da;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  padding: 8px 16px;
  transition: all 0.2s ease-in-out;
`;

const Form = styled.form`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
`;

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<string>();
  const [hotels, setHotels] = useState<string>();
  const [months, setMonths] = useState<string>();
  const [artists, setArtists] = useState<string>();
  const [topics, setTopics] = useState<string>();
  const [result, setResult] = useState<string>();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setResult("");
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventName, location }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = response.body;
      if (!data) {
        return;
      }
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setResult((prev) => prev + chunkValue);
      }

      setLoading(false);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>JamTrack</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <div className="d-flex align-items-center mb-5">
          <Image src={FuseLogo} width={200} alt="Fuse Logo" />
          <h2 className="text-white ms-4 ">JamTrack</h2>
        </div>
        {loading && (
          <div className="d-flex align-items-center justify-content-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <Form onSubmit={onSubmit}>
          <TextInput
            label="Event name"
            placeholder="Enter the event name"
            value={eventName}
            setValue={setEventName}
          />
          <TextInput
            label={"Event location"}
            placeholder={"Enter the event location"}
            value={location}
            setValue={setLocation}
          />

          <Button type="submit" value="Generate names">
            Generate{" "}
          </Button>
        </Form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
