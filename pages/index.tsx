import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import FuseLogo from "img/fuse-logo.svg";
import Image from "next/image";
import styled from "styled-components";

import TextInput from "components/TextInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactDropdown from "react-dropdown";
import { TopicOptions } from "helper/topics";

const DateField = styled(DatePicker)`
  border: 1px solid #000;
  max-width: 600px;
  width: 100%;
  border-radius: 4px;
  font-size: 16px;
  padding: 8px 16px;
  transition: all 0.2s ease-in-out;

  padding: 12px 16px;
  border: 1px solid #10a37f;
  border-radius: 4px;
  outline-color: #10a37f;
`;

const Button = styled.button`
  width: 100%;
  text-align: center;
  max-width: 300px;
  align-self: flex-end;
  background-color: #1b39da;
  border: 1px solid #1b39da;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  padding: 8px 16px;
  transition: all 0.2s ease-in-out;
  &:disabled {
    background-color: #dddddd;
  }
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
  const [endDate, setEndDate] = useState<Date>();
  const [hotels, setHotels] = useState<string>("");
  const [artists, setArtists] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [result, setResult] = useState<string>("");

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
        body: JSON.stringify({
          eventName,
          location,
          startDate,
          endDate,
          hotels,
          artists,
          topic,
        }),
      });

      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setResult(data.result.content);
      setLoading(false);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setLoading(false);
    }
  };

  const isDisabled =
    !eventName ||
    !location ||
    !startDate ||
    !endDate ||
    !hotels ||
    !artists ||
    !topic;

  return (
    <div className="p-4">
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
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="text-nowrap">Start Date:</div>
            <DateField
              selected={startDate}
              placeholderText="Select a date"
              onChange={(date) => setStartDate(date as Date)}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="text-nowrap">End Date:</div>
            <DateField
              selected={endDate}
              placeholderText="Select a date"
              onChange={(date) => setEndDate(date as Date)}
            />
          </div>
          <TextInput
            label={"Featured artists"}
            placeholder={"Enter a few of the featured artists"}
            value={artists}
            setValue={setArtists}
          />
          <TextInput
            label={"Hotels"}
            placeholder={"Enter a few of the hotels"}
            value={hotels}
            setValue={setHotels}
          />
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="text-nowrap">Select a topic:</div>
            <ReactDropdown
              options={TopicOptions.filter(
                (options) => options.value !== topic
              )}
              onChange={(option) => setTopic(option.value)}
              // value={TopicOptions[0]}
              placeholder={`Select an option`}
            />
          </div>

          <Button type="submit" disabled={isDisabled} value="Generate names">
            Generate{" "}
          </Button>
        </Form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
