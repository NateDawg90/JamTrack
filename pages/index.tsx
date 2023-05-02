import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import FuseLogo from "img/fuse-logo.svg";
import Image from "next/image";
import { Button, Form, TextField } from "./index.styles";

export default function Home() {
  const [eventName, setEventName] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [hotels, setHotels] = useState<string>();
  const [months, setMonths] = useState<string>();
  const [artists, setArtists] = useState<string>();
  const [topics, setTopics] = useState<string>();
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: eventName, location }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setEventName("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

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
        <Form onSubmit={onSubmit}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            Event name:
            <TextField
              type="text"
              className="ms-2"
              name="Event name"
              placeholder="Enter the event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between mb-4">
            Event location:
            <TextField
              type="text"
              className="ms-2"
              name="Event location"
              placeholder="Enter the event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Button type="submit" value="Generate names">
            Generate{" "}
          </Button>
        </Form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
